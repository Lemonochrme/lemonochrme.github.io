"""Convertit un PcbDoc Altium (format ASCII) en SVG monochrome pour la page Aerolith.

Usage : python3 pcb2svg.py <board.pcbdoc> <sortie.svg> <sortie-nets.json>
Seule la géométrie est exportée (pistes, vias, pastilles, plans de cuivre, contour).
"""
import json, math, re, sys

MIL = 0.0254  # mm

def recs(path):
    raw = open(path, encoding='latin-1').read().replace('\r\n', '\n').replace('\r', '\n')
    for line in raw.split('\n'):
        if '|RECORD=' not in line:
            continue
        d = {}
        for kv in line.strip('|').split('|'):
            if '=' in kv:
                k, v = kv.split('=', 1)
                d.setdefault(k, v)
        yield d

def mil(v):
    return float(v.replace('mil', '')) * MIL

COPPER = {'TOP': 'top', 'MID1': 'in1', 'MID2': 'in2', 'BOTTOM': 'bot'}

src, out_svg, out_json = sys.argv[1:4]
R = list(recs(src))
nets = {int(r['ID']): r['NAME'] for r in R if r.get('RECORD') == 'Net'}

# Contour de la carte
board = next(r for r in R if r.get('RECORD') == 'Board' and 'VX0' in r)
n = int(board.get('MAINCONTOURVERTEXCOUNT', 0)) or sum(1 for k in board if re.fullmatch(r'VX\d+', k))
outline = []
for i in range(n):
    if f'VX{i}' not in board:
        break
    x, y = mil(board[f'VX{i}']), mil(board[f'VY{i}'])
    if board.get(f'KIND{i}') == '1' and float(board.get(f'R{i}', '0mil').replace('mil', '')) > 0:
        cx, cy, r = mil(board[f'CX{i}']), mil(board[f'CY{i}']), mil(board[f'R{i}'])
        sa, ea = float(board[f'SA{i}']), float(board[f'EA{i}'])
        # sens de parcours : on part du sommet courant
        a0 = math.degrees(math.atan2(y - cy, x - cx))
        cand = [sa, ea]
        start = min(cand, key=lambda a: abs(((a - a0 + 180) % 360) - 180))
        end = ea if start == sa else sa
        if end < start and start == sa:
            end += 360
        steps = 12
        for k in range(steps + 1):
            a = math.radians(start + (end - start) * k / steps)
            outline.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    else:
        outline.append((x, y))

xs = [p[0] for p in outline]; ys = [p[1] for p in outline]
X0, Y1 = min(xs), max(ys)
W, H = max(xs) - X0, Y1 - min(ys)
def P(x, y):
    return f'{x - X0:.2f} {Y1 - y:.2f}'

layers = {k: {'tracks': {}, 'pours': [], 'pads': []} for k in COPPER.values()}
silk = []
vias = {}

for r in R:
    t = r.get('RECORD')
    L = r.get('LAYER', '')
    if t == 'Track':
        seg = f'M{P(mil(r["X1"]), mil(r["Y1"]))}L{P(mil(r["X2"]), mil(r["Y2"]))}'
        if L in COPPER:
            key = (int(r.get('NET', -1)), round(mil(r['WIDTH']), 3))
            layers[COPPER[L]]['tracks'].setdefault(key, []).append(seg)
        elif L == 'TOPOVERLAY':
            silk.append(seg)
    elif t == 'Arc':
        cx, cy, rad = mil(r['LOCATION.X']), mil(r['LOCATION.Y']), mil(r['RADIUS'])
        sa, ea = float(r['STARTANGLE']), float(r['ENDANGLE'])
        if ea <= sa:
            ea += 360
        steps = max(4, int((ea - sa) / 15))
        pts = [P(cx + rad * math.cos(math.radians(sa + (ea - sa) * k / steps)),
                 cy + rad * math.sin(math.radians(sa + (ea - sa) * k / steps))) for k in range(steps + 1)]
        seg = 'M' + 'L'.join(pts)
        if L in COPPER:
            key = (int(r.get('NET', -1)), round(mil(r['WIDTH']), 3))
            layers[COPPER[L]]['tracks'].setdefault(key, []).append(seg)
        elif L == 'TOPOVERLAY':
            silk.append(seg)
    elif t == 'Via':
        key = (int(r.get('NET', -1)), round(mil(r['DIAMETER']) / 2, 3))
        vias.setdefault(key, []).append((mil(r['X']), mil(r['Y'])))
    elif t == 'Pad':
        net = int(r.get('NET', -1))
        x, y = mil(r['X']), mil(r['Y'])
        w, h = mil(r['XSIZE']), mil(r['YSIZE'])
        rot = float(r.get('ROTATION', 0))
        targets = ['top', 'bot'] if L == 'MULTILAYER' else [COPPER[L]] if L in COPPER else []
        for tg in targets:
            layers[tg]['pads'].append((net, x, y, w, h, rot, r.get('SHAPE', 'RECTANGLE')))
    elif t == 'Region' and 'POLYGON' in r and L in COPPER:
        net = int(r.get('NET', -1))
        if 'MVX0' in r:
            cnt = int(r['MAINCONTOURVERTEXCOUNT'])
            pts = [(float(r[f'MVX{i}']) / 1e4 * MIL, float(r[f'MVY{i}']) / 1e4 * MIL) for i in range(cnt)]
        else:
            pts = []
            i = 0
            while f'VX{i}' in r:
                pts.append((mil(r[f'VX{i}']), mil(r[f'VY{i}'])))
                i += 1
        # simplification : on saute les points trop proches
        simp = [pts[0]]
        for q in pts[1:]:
            if abs(q[0] - simp[-1][0]) + abs(q[1] - simp[-1][1]) > 0.08:
                simp.append(q)
        d = 'M' + 'L'.join(P(*q) for q in simp) + 'Z'
        holes = int(r.get('HOLECOUNT', 0))
        for h in range(holes):
            hc = int(r.get(f'HOLE{h}VERTEXCOUNT', 0) or 0)
            hp = []
            for i in range(hc):
                kx, ky = f'H{h}VX{i}', f'H{h}VY{i}'
                if kx in r:
                    hp.append((float(r[kx]) / 1e4 * MIL, float(r[ky]) / 1e4 * MIL))
            if len(hp) > 2:
                hs = [hp[0]]
                for q in hp[1:]:
                    if abs(q[0] - hs[-1][0]) + abs(q[1] - hs[-1][1]) > 0.08:
                        hs.append(q)
                d += 'M' + 'L'.join(P(*q) for q in hs) + 'Z'
        layers[COPPER[L]]['pours'].append((net, d))

def pad_path(x, y, w, h, rot, shape):
    if shape == 'ROUND' and abs(w - h) < 1e-3:
        return None
    a = math.radians(rot)
    c, s = math.cos(a), math.sin(a)
    pts = []
    for dx, dy in ((-w/2, -h/2), (w/2, -h/2), (w/2, h/2), (-w/2, h/2)):
        pts.append(P(x + dx * c - dy * s, y + dx * s + dy * c))
    return 'M' + 'L'.join(pts) + 'Z'

out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" data-w="{W:.2f}" data-h="{H:.2f}">']
out.append(f'<path class="pcb-outline" d="M{"L".join(P(*p) for p in outline)}Z"/>')
for name in ('bot', 'in2', 'in1', 'top'):
    Lg = layers[name]
    out.append(f'<g class="pcb-layer" data-layer="{name}">')
    for net, d in Lg['pours']:
        out.append(f'<path class="pour" data-n="{net}" d="{d}"/>')
    for (net, w), segs in sorted(Lg['tracks'].items()):
        out.append(f'<path class="trk" data-n="{net}" stroke-width="{w}" d="{"".join(segs)}"/>')
    by_net = {}
    for net, x, y, w, h, rot, shape in Lg['pads']:
        p = pad_path(x, y, w, h, rot, shape)
        if p is None:
            r_ = w / 2
            p = f'M{P(x - r_, y)}a{r_:.2f} {r_:.2f} 0 1 0 {2*r_:.2f} 0a{r_:.2f} {r_:.2f} 0 1 0 {-2*r_:.2f} 0Z'
        by_net.setdefault(net, []).append(p)
    for net, ps in by_net.items():
        out.append(f'<path class="pad" data-n="{net}" d="{"".join(ps)}"/>')
    out.append('</g>')
out.append('<g class="pcb-vias">')
for (net, r_), pts in vias.items():
    d = ''.join(f'M{P(x - r_, y)}a{r_:.2f} {r_:.2f} 0 1 0 {2*r_:.2f} 0a{r_:.2f} {r_:.2f} 0 1 0 {-2*r_:.2f} 0Z' for x, y in pts)
    out.append(f'<path class="via" data-n="{net}" d="{d}"/>')
out.append('</g>')
out.append(f'<path class="pcb-silk" d="{"".join(silk)}"/>')
out.append('</svg>')
open(out_svg, 'w').write(''.join(out))

used = set()
for Lg in layers.values():
    used |= {k[0] for k in Lg['tracks']} | {p[0] for p in Lg['pads']} | {p[0] for p in Lg['pours']}
used |= {k[0] for k in vias}
named = {i: nets[i] for i in sorted(used) if i in nets and not nets[i].startswith('$')}
stats = {
    'w': round(W, 2), 'h': round(H, 2),
    'tracks': sum(len(v) for Lg in layers.values() for v in Lg['tracks'].values()),
    'vias': sum(len(v) for v in vias.values()),
    'pads': sum(1 for r in R if r.get('RECORD') == 'Pad'),
    'components': sum(1 for r in R if r.get('RECORD') == 'Component'),
    'nets': len(nets),
}
json.dump({'nets': named, 'stats': stats}, open(out_json, 'w'), ensure_ascii=False)
print(src.split('/')[-1], stats, f'{len(open(out_svg).read())/1024:.0f} KB', file=sys.stderr)


# ───── Tracé ordonné d'un net, pour la sonde qui le parcourt au scroll ─────
def net_route(net_id):
    """Plus long chemin (approché) dans le graphe des pistes du net, à travers les vias."""
    import heapq
    key = lambda x, y, L: (round(x, 2), round(y, 2), L)
    adj = {}
    def link(a, b, w):
        adj.setdefault(a, []).append((b, w))
        adj.setdefault(b, []).append((a, w))
    for r in R:
        if r.get('RECORD') == 'Track' and r.get('LAYER') in COPPER and int(r.get('NET', -1)) == net_id:
            L = COPPER[r['LAYER']]
            a = key(mil(r['X1']), mil(r['Y1']), L)
            b = key(mil(r['X2']), mil(r['Y2']), L)
            link(a, b, math.dist(a[:2], b[:2]))
    for r in R:
        if r.get('RECORD') == 'Via' and int(r.get('NET', -1)) == net_id:
            x, y = mil(r['X']), mil(r['Y'])
            here = [n for n in adj if math.dist(n[:2], (x, y)) < mil(r['DIAMETER']) / 2 + 0.05]
            for i in range(len(here)):
                for j in range(i + 1, len(here)):
                    if here[i][2] != here[j][2]:
                        link(here[i], here[j], 0.0)
    if not adj:
        return None
    def farthest(s):
        dist = {s: 0.0}
        prev = {}
        pq = [(0.0, s)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in adj[u]:
                if d + w < dist.get(v, 1e18):
                    dist[v] = d + w
                    prev[v] = u
                    heapq.heappush(pq, (d + w, v))
        end = max(dist, key=dist.get)
        return end, dist[end], prev
    a, _, _ = farthest(next(iter(adj)))
    b, length, prev = farthest(a)
    path = [b]
    while path[-1] != a:
        path.append(prev[path[-1]])
    return length, [(n[0] - X0, Y1 - n[1], ['top', 'in1', 'in2', 'bot'].index(n[2])) for n in path]

meta = json.load(open(out_json))
routes = []
for nid, name in meta['nets'].items():
    if name in ('GND', 'VBAT', 'BAT', '3V3', '5V', '10V', '3V3_ICM', '5V_BUCK', '5V_USB'):
        continue
    res = net_route(int(nid))
    if res:
        routes.append((res[0], name, res[1]))
routes.sort(reverse=True)
print('plus longs tracés :', [(n, round(l, 1), len({p[2] for p in pts})) for l, n, pts in routes[:8]], file=sys.stderr)
pick = (sys.argv[4] if len(sys.argv) > 4 else '') or routes[0][1]
length, name, pts = next(r for r in routes if r[1] == pick)
meta['route'] = {'net': name, 'length': round(length, 2), 'pts': [[round(x, 2), round(y, 2), L] for x, y, L in pts]}

# Références → numéros de pièce, depuis le schéma (facultatif, 5e argument).
if len(sys.argv) > 5:
    raw = open(sys.argv[5], encoding='utf-8', errors='replace').read().replace('\r\n', '\n')
    srecs = []
    for line in raw.split('\n'):
        if '|RECORD=' in line:
            d = {}
            for kv in line.strip('|').split('|'):
                if '=' in kv:
                    k, v = kv.split('=', 1)
                    d.setdefault(k.upper(), v)
            srecs.append(d)
    parts = {}
    for d in srecs:
        if d.get('RECORD') == '34' and d.get('NAME') == 'Designator' and 'OWNERINDEX' in d:
            owner = srecs[int(d['OWNERINDEX'])] if int(d['OWNERINDEX']) < len(srecs) else {}
            lib = owner.get('LIBREFERENCE', '')
            if lib and not lib.startswith(('castellated', 'Test-Point', 'BLDC PIN')):
                parts[d.get('TEXT', '')] = lib
    meta['parts'] = parts
json.dump(meta, open(out_json, 'w'), ensure_ascii=False)

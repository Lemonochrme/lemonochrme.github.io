"""Rendu orthographique ombré des composants d'une carte (dessus et dessous) depuis un STEP EasyEDA.

Usage : python3 steprender.py <carte.step> <carte.pcbdoc> <prefixe-sortie>
Sorties :
  <prefixe>-top.png, <prefixe>-bot.png : rendus RGBA, vus de dessus (le dessous en transparence,
  dans le même repère que le dessus), à RES mm par pixel ;
  <prefixe>-parts.json : composants (référence, boîtier, face, emprise en mm dans le repère du PcbDoc).
Chaque volume du STEP est rattaché au composant du PcbDoc le plus proche, sur la même face.
"""
import json, sys
import gmsh
import numpy as np
from PIL import Image

src, pcbdoc, prefix = sys.argv[1:4]
RES = 0.04
MIL = 0.0254

# Composants du PcbDoc : référence, empreinte, face, position (mm).
pcb_comps = []
board_rec = None
raw = open(pcbdoc, encoding='latin-1').read().replace('\r\n', '\n').replace('\r', '\n')
for line in raw.split('\n'):
    if '|RECORD=' not in line:
        continue
    d = {}
    for kv in line.strip('|').split('|'):
        if '=' in kv:
            k, v = kv.split('=', 1)
            d.setdefault(k, v)
    if d.get('RECORD') == 'Component':
        pcb_comps.append((d.get('SOURCEDESIGNATOR', ''), d.get('PATTERN', ''), d.get('LAYER') == 'TOP',
                          float(d['X'].replace('mil', '')) * MIL, float(d['Y'].replace('mil', '')) * MIL))
    elif d.get('RECORD') == 'Board' and 'VX0' in d and board_rec is None:
        board_rec = d
vx = [float(board_rec[f'VX{i}'].replace('mil', '')) * MIL for i in range(64) if f'VX{i}' in board_rec]
vy = [float(board_rec[f'VY{i}'].replace('mil', '')) * MIL for i in range(64) if f'VY{i}' in board_rec]
PX0, PY1 = min(vx), max(vy)

gmsh.initialize()
gmsh.option.setNumber('General.Terminal', 0)
gmsh.option.setNumber('Geometry.OCCImportLabels', 1)
gmsh.model.occ.importShapes(src)
gmsh.model.occ.synchronize()

board = None
vols = []
for d, tg in gmsh.model.getEntities(3):
    leaf = gmsh.model.getEntityName(d, tg).split('/')[-1]
    if leaf.startswith('Board~'):
        board = gmsh.model.getBoundingBox(d, tg)
    elif not any(k in leaf for k in ('Silkscreen', 'Copper', 'Stiffener')):
        vols.append(tg)
bx0, by0, bz0, bx1, by1, bz1 = board
W = int(np.ceil((bx1 - bx0) / RES))
H = int(np.ceil((by1 - by0) / RES))

assign = {}
for tg in vols:
    x0, y0, z0, x1, y1, z1 = gmsh.model.getBoundingBox(3, tg)
    top = z0 >= bz1 - 0.2
    cx, cy = (x0 + x1) / 2 - bx0, by1 - (y0 + y1) / 2
    best = min((c for c in pcb_comps if c[2] == top),
               key=lambda c: (c[3] - PX0 - cx) ** 2 + (PY1 - c[4] - cy) ** 2, default=None)
    ok = best and ((best[3] - PX0 - cx) ** 2 + (PY1 - best[4] - cy) ** 2) < 25
    assign[tg] = (best[0] if ok else '', best[1] if ok else '', top)
print(f'carte {bx1-bx0:.2f} x {by1-by0:.2f} mm, {len(vols)} volumes, rendu {W}x{H}', file=sys.stderr)

gmsh.option.setNumber('Mesh.MeshSizeMin', 0.1)
gmsh.option.setNumber('Mesh.MeshSizeMax', 0.8)
gmsh.option.setNumber('Mesh.MeshSizeFromCurvature', 12)
keep = set(vols)
for d, tg in gmsh.model.getEntities(3):
    if tg not in keep:
        gmsh.model.occ.remove([(d, tg)], recursive=True)
gmsh.model.occ.synchronize()
gmsh.model.mesh.generate(2)

def new_buffers():
    return np.full((H, W), -1e9, np.float32), np.zeros((H, W), np.float32), np.zeros((H, W), bool)

views = {True: new_buffers(), False: new_buffers()}
boxes = {}
LIGHT = np.array([-0.45, 0.55, 0.7])
LIGHT /= np.linalg.norm(LIGHT)

for tg in vols:
    ref, pkg, top = assign[tg]
    zbuf, shade, cov = views[top]
    tris = []
    for _, s in gmsh.model.getBoundary([(3, tg)], oriented=False, recursive=False):
        types, _, nodes = gmsh.model.mesh.getElements(2, abs(s))
        for ty, nd in zip(types, nodes):
            if ty == 2:
                tris.append(np.array(nd, dtype=np.int64).reshape(-1, 3))
    if not tris:
        continue
    T = np.concatenate(tris)
    tags = np.unique(T)
    coords = np.array([gmsh.model.mesh.getNode(int(t))[0] for t in tags])
    lut = {int(t): i for i, t in enumerate(tags)}
    P = coords[np.vectorize(lut.get)(T)]
    if ref:
        x0, y0 = P[:, :, 0].min() - bx0, by1 - P[:, :, 1].max()
        x1, y1 = P[:, :, 0].max() - bx0, by1 - P[:, :, 1].min()
        b = boxes.setdefault((ref, top), [x0, y0, x1, y1, pkg])
        b[0], b[1], b[2], b[3] = min(b[0], x0), min(b[1], y0), max(b[2], x1), max(b[3], y1)
    nrm = np.cross(P[:, 1] - P[:, 0], P[:, 2] - P[:, 0])
    nrm /= np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-12
    for tri, n in zip(P, nrm):
        # Profondeur vue depuis la face concernée ; normale orientée vers l'observateur.
        if not top:
            n = -n
        if n[2] < 0:
            n = -n
        h = tri[:, 2] - bz1 if top else bz0 - tri[:, 2]
        gx = (tri[:, 0] - bx0) / RES
        gy = (by1 - tri[:, 1]) / RES
        x0_, x1_ = int(max(np.floor(gx.min()), 0)), int(min(np.ceil(gx.max()), W - 1))
        y0_, y1_ = int(max(np.floor(gy.min()), 0)), int(min(np.ceil(gy.max()), H - 1))
        if x1_ < x0_ or y1_ < y0_:
            continue
        xs, ys = np.meshgrid(np.arange(x0_, x1_ + 1) + 0.5, np.arange(y0_, y1_ + 1) + 0.5)
        (ax, bx_, cx), (ay, by_, cy) = gx, gy
        den = (by_ - cy) * (ax - cx) + (cx - bx_) * (ay - cy)
        if abs(den) < 1e-9:
            continue
        l1 = ((by_ - cy) * (xs - cx) + (cx - bx_) * (ys - cy)) / den
        l2 = ((cy - ay) * (xs - cx) + (ax - cx) * (ys - cy)) / den
        l3 = 1 - l1 - l2
        inside = (l1 >= -1e-6) & (l2 >= -1e-6) & (l3 >= -1e-6)
        if not inside.any():
            continue
        z = l1 * h[0] + l2 * h[1] + l3 * h[2]
        zb = zbuf[y0_:y1_ + 1, x0_:x1_ + 1]
        upd = inside & (z > zb)
        if not upd.any():
            continue
        lam = max(float(np.dot(n, LIGHT)), 0.0)
        # Les terminaisons (près de la carte) sont métalliques, les corps sont sombres.
        metal = float(h.mean()) < 0.35
        base = 0.62 if metal else 0.16
        val = base * (0.35 + 0.75 * lam) + (0.25 if metal else 0.08) * lam ** 12
        zb[upd] = z[upd]
        shade[y0_:y1_ + 1, x0_:x1_ + 1][upd] = val
        cov[y0_:y1_ + 1, x0_:x1_ + 1][upd] = True
gmsh.finalize()

def finish(v, cov):
    """Courbe de tons claire et arêtes rehaussées : chaque boîtier se détache du fond sombre."""
    v = np.clip(0.12 + 2.0 * v, 0, 1) * cov
    pad = np.pad(v, 1, mode='edge')
    grad = np.abs(pad[1:-1, 2:] - pad[1:-1, :-2]) + np.abs(pad[2:, 1:-1] - pad[:-2, 1:-1])
    c = np.pad(cov.astype(float), 1)
    border = cov & ((c[1:-1, 2:] + c[1:-1, :-2] + c[2:, 1:-1] + c[:-2, 1:-1]) < 4)
    v = np.where(border, np.maximum(v, 0.78), np.clip(v + np.clip(grad - 0.08, 0, 1) * 0.9, 0, 1))
    return v * cov


for top, name in ((True, 'top'), (False, 'bot')):
    zbuf, shade, cov = views[top]
    v = finish(np.clip(shade, 0, 1), cov)
    # Teinte neutre légèrement chaude, alignée sur l'encre de la page.
    rgb = np.stack([v * 233, v * 231, v * 226], axis=-1)
    a = np.where(cov, 255, 0)
    img = np.dstack([rgb, a]).astype(np.uint8)
    Image.fromarray(img, 'RGBA').save(f'{prefix}-{name}.png', optimize=True)

parts = [{'ref': r, 'pkg': b[4], 'side': 'top' if t else 'bot', 'box': [round(x, 2) for x in b[:4]]}
         for (r, t), b in sorted(boxes.items(), key=lambda kv: kv[0][0])]
json.dump({'mm': [round(bx1 - bx0, 2), round(by1 - by0, 2)], 'parts': parts}, open(f'{prefix}-parts.json', 'w'), ensure_ascii=False)
print(f'{len(parts)} composants rendus', file=sys.stderr)

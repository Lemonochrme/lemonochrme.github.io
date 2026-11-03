"""Carte de hauteur des composants (vue de dessus et de dessous) depuis un STEP EasyEDA.

Usage : python3 stepheight.py <carte.step> <sortie.bin> <sortie.json> <carte.pcbdoc>
Les volumes du STEP ne sont pas tous nommés : chaque volume est rattaché au composant
du PcbDoc le plus proche, sur la même face.
Sortie binaire : 4 grilles de W×H, dans l'ordre :
  hauteur dessus (Uint8, pas de 0.05 mm), composant dessus (Uint8, 0 = aucun),
  hauteur dessous, composant dessous.
Le JSON donne la résolution, l'emprise et la liste des composants (référence, boîtier).
"""
import json, sys
import gmsh
import numpy as np

src, out_bin, out_json, pcbdoc = sys.argv[1:5]

# Composants du PcbDoc : référence, empreinte, face et position (mm).
MIL = 0.0254
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
RES = 0.15  # mm par échantillon
STEP_H = 0.05

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
# Rattachement volume → composant : même face, centre le plus proche.
comps = []
for tg in vols:
    x0, y0, z0, x1, y1, z1 = gmsh.model.getBoundingBox(3, tg)
    top = z0 >= bz1 - 0.2
    cx, cy = (x0 + x1) / 2 - bx0, by1 - (y0 + y1) / 2
    best = min((c for c in pcb_comps if c[2] == top),
               key=lambda c: (c[3] - PX0 - cx) ** 2 + (PY1 - c[4] - cy) ** 2, default=None)
    if best and ((best[3] - PX0 - cx) ** 2 + (PY1 - best[4] - cy) ** 2) < 25:
        comps.append((tg, best[0], best[1]))
    else:
        comps.append((tg, '', ''))
print(f'carte {bx1-bx0:.2f} x {by1-by0:.2f} mm, épaisseur {bz1-bz0:.2f}, {len(vols)} volumes', file=sys.stderr)

# Maillage grossier de chaque composant, puis rastérisation des triangles.
gmsh.option.setNumber('Mesh.MeshSizeMin', 0.2)
gmsh.option.setNumber('Mesh.MeshSizeMax', 1.2)
gmsh.option.setNumber('Mesh.MeshSizeFromCurvature', 6)
keep = {tg for tg, _, _ in comps}
for d, tg in gmsh.model.getEntities(3):
    if tg not in keep:
        gmsh.model.occ.remove([(d, tg)], recursive=True)
gmsh.model.occ.synchronize()
gmsh.model.mesh.generate(2)

top_h = np.zeros((H, W), np.float32)
top_id = np.zeros((H, W), np.uint16)
bot_h = np.zeros((H, W), np.float32)
bot_id = np.zeros((H, W), np.uint16)

refs = []
ref_index = {}
for tg, ref, pkg in comps:
    if ref not in ref_index:
        ref_index[ref] = len(refs) + 1
        refs.append({'ref': ref, 'pkg': pkg})
    cid = ref_index[ref]
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
    P = coords[np.vectorize(lut.get)(T)]  # (n, 3, 3)
    zmin = P[:, :, 2].min()
    top = zmin >= bz1 - 0.2
    height_map, id_map = (top_h, top_id) if top else (bot_h, bot_id)
    for tri in P:
        gx = (tri[:, 0] - bx0) / RES
        gy = (by1 - tri[:, 1]) / RES
        hz = tri[:, 2] - bz1 if top else bz0 - tri[:, 2]
        x0, x1 = int(max(np.floor(gx.min()), 0)), int(min(np.ceil(gx.max()), W - 1))
        y0, y1 = int(max(np.floor(gy.min()), 0)), int(min(np.ceil(gy.max()), H - 1))
        if x1 < x0 or y1 < y0:
            continue
        xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
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
        z = l1 * hz[0] + l2 * hz[1] + l3 * hz[2]
        sub_h = height_map[y0:y1 + 1, x0:x1 + 1]
        sub_i = id_map[y0:y1 + 1, x0:x1 + 1]
        upd = inside & (z > sub_h)
        sub_h[upd] = z[upd]
        sub_i[upd] = cid
gmsh.finalize()

def q(hm):
    return np.clip(np.round(hm / STEP_H), 0, 255).astype(np.uint8)

blob = q(top_h).tobytes() + top_id.astype(np.uint8).tobytes() + q(bot_h).tobytes() + bot_id.astype(np.uint8).tobytes()
open(out_bin, 'wb').write(blob)
json.dump({'w': W, 'h': H, 'res': RES, 'step': STEP_H, 'mm': [round(bx1 - bx0, 2), round(by1 - by0, 2)], 'comps': refs},
          open(out_json, 'w'), ensure_ascii=False)
print(f'{W}x{H}, {len(refs)} composants, max {top_h.max():.2f} mm dessus / {bot_h.max():.2f} mm dessous', file=sys.stderr)

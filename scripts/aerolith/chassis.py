"""Assemble et maille le châssis FreeCAD (FCStd décompressé) pour la page Aerolith.

Usage : python3 chassis.py <dossier FCStd décompressé> <sortie.bin> <sortie.json>
Les liens App::Link de l'assemblage sont résolus vers leurs pièces de base,
puis chaque pièce est maillée (gmsh) et placée dans le repère global.
Format binaire : pour chaque géométrie de base, positions Int16 xyz (dixièmes de mm), puis index Uint16 ;
le JSON liste les instances avec leur matrice (colonnes 3×4).
Les normales sont recalculées dans le shader (dérivées écran) : pas besoin de les stocker.
"""
import json, re, shutil, sys, tempfile
import gmsh
import numpy as np

src, out_bin, out_json = sys.argv[1:4]
doc = open(f'{src}/Document.xml', encoding='utf-8').read()
data = re.search(r'<ObjectData[^>]*>(.*)</ObjectData>', doc, re.S).group(1)

def placement(body, prop='Placement'):
    m = re.search(rf'<Property name="{prop}"[^>]*>\s*<PropertyPlacement ([^/]*)/>', body)
    if not m:
        return np.eye(4)
    a = dict(re.findall(r'(\w+)="([^"]+)"', m.group(1)))
    x, y, z, w = (float(a[k]) for k in ('Q0', 'Q1', 'Q2', 'Q3'))
    R = np.array([
        [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
        [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
        [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
    ])
    M = np.eye(4)
    M[:3, :3] = R
    M[:3, 3] = [float(a['Px']), float(a['Py']), float(a['Pz'])]
    return M

objects = {m.group(1): m.group(2) for m in re.finditer(r'<Object name="([^"]+)"[^>]*>(.*?)</Object>', data, re.S)}

BASE = {
    'Platine': ('_01_Platine_centrale', 'plate'),
    'Bras_Court': ('_02_Bras_court', 'arm'),
    'Bras_Long': ('_03_Bras_long', 'arm'),
    'Support_moteur': ('_04_Socle_moteur', 'mount'),
}

instances = []
for name, body in objects.items():
    if name.startswith('Aplat') or name.startswith('_'):
        continue
    for prefix, (base, kind) in BASE.items():
        if name.startswith(prefix):
            instances.append((name, base, kind, placement(body)))
    if name.startswith('Entretoise_'):
        instances.append((name, name, 'standoff', placement(body)))

gmsh.initialize()
gmsh.option.setNumber('General.Terminal', 0)
cache = {}

def mesh_of(base):
    if base in cache:
        return cache[base]
    gmsh.clear()
    # gmsh reconnaît le BREP OpenCASCADE à son extension .brep
    tmp = tempfile.NamedTemporaryFile(suffix='.brep', delete=False).name
    shutil.copy(f'{src}/{base}.Shape.brp', tmp)
    gmsh.model.occ.importShapes(tmp)
    gmsh.model.occ.synchronize()
    gmsh.option.setNumber('Mesh.MeshSizeMin', 0.8)
    gmsh.option.setNumber('Mesh.MeshSizeMax', 40.0)
    gmsh.option.setNumber('Mesh.MeshSizeFromCurvature', 5)
    gmsh.option.setNumber('Mesh.MeshSizeExtendFromBoundary', 0)
    gmsh.option.setNumber('Mesh.Algorithm', 6)
    gmsh.model.mesh.generate(2)
    tags, coords, _ = gmsh.model.mesh.getNodes()
    idx = {int(t): i for i, t in enumerate(tags)}
    P = np.array(coords).reshape(-1, 3)
    tris = []
    for dim, tag in gmsh.model.getEntities(2):
        types, _, nodes = gmsh.model.mesh.getElements(dim, tag)
        for ty, nd in zip(types, nodes):
            if ty == 2:
                tris.append(np.array([idx[int(n)] for n in nd]).reshape(-1, 3))
    T = np.concatenate(tris)
    cache[base] = (P, T)
    return cache[base]

# Chaque géométrie de base n'est stockée qu'une fois ; les instances portent leur matrice.
meshes = {}
blob = bytearray()
for name, base, kind, M in instances:
    if base in meshes:
        continue
    P, T = mesh_of(base)
    off = len(blob)
    blob += np.round(P * 10).astype('<i2').tobytes()
    while len(blob) % 4:
        blob += b'\0'
    ioff = len(blob)
    blob += T.astype('<u2').tobytes()
    while len(blob) % 4:
        blob += b'\0'
    meshes[base] = {'v': off, 'nv': len(P), 'i': ioff, 'ni': int(T.size)}
gmsh.finalize()

parts = []
for name, base, kind, M in instances:
    P, _ = cache[base]
    Pw = (np.c_[P, np.ones(len(P))] @ M.T)[:, :3]
    parts.append({'name': name, 'kind': kind, 'mesh': base,
                  'm': [round(float(x), 5) for x in M[:3, :].T.reshape(-1)],
                  'centre': [round(float(x), 2) for x in (Pw.min(axis=0) + Pw.max(axis=0)) / 2]})

allV = np.concatenate([(np.c_[cache[p['mesh']][0], np.ones(len(cache[p['mesh']][0]))] @ np.vstack([np.array(p['m']).reshape(4, 3).T, [0, 0, 0, 1]]).T)[:, :3] for p in parts])
lo, hi = allV.min(axis=0), allV.max(axis=0)
ntri = sum(meshes[p['mesh']]['ni'] for p in parts) // 3
open(out_bin, 'wb').write(bytes(blob))
json.dump({'meshes': meshes, 'parts': parts, 'min': lo.round(2).tolist(), 'max': hi.round(2).tolist()}, open(out_json, 'w'))
print(f'{len(parts)} pièces, {ntri} triangles, {len(blob)/1024:.0f} Ko, emprise {np.round(hi-lo,1)}', file=sys.stderr)
for k in sorted({p["kind"] for p in parts}):
    print(k, sum(1 for p in parts if p['kind'] == k), file=sys.stderr)

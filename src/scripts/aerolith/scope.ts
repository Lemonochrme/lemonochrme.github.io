// Cartes électroniques en ASCII, parcourues au scroll :
// composants (carte de hauteur du STEP) → couches de cuivre → une piste suivie par une sonde.
import { Atlas, INK, SIG, dpr, fontsReady, reducedMotion, rgba, trackVisible, whenNear } from './glyphs';

type Kind = 'trk' | 'pad' | 'pour' | 'via';
interface Item { kind: Kind; net: number; d: Path2D; w: number }
const LAYERS = ['top', 'in1', 'in2', 'bot'] as const;
type Layer = (typeof LAYERS)[number];
const STAGES = ['comp', 'top', 'in1', 'in2', 'bot', 'trace'] as const;
type Stage = (typeof STAGES)[number];

// Glyphes : 0 '·' 1 '-' 2 '|' 3 '/' 4 '\' 5 '+' 6 '#' 7 'o' 8 '.' 9 '=' 10 ':' 11 '*' 12 '%' 13 '@' 14 '■'
const CHARS = '·-|/\\+#o.=:*%@■';
const RAMP = [8, 10, 1, 9, 5, 11, 6, 12, 13];
const LEVELS = [1, 0.62, 0.36, 0.2, 0.09, 0.045];
const COLORS = [...LEVELS.map((a) => rgba(INK, a)), rgba(SIG, 1), rgba(SIG, 0.55), rgba(SIG, 0.28)];
const HL = LEVELS.length;
const LABEL: Record<Stage, string> = {
  comp: 'Components', top: 'Top copper', in1: 'Inner 1', in2: 'Inner 2', bot: 'Bottom copper', trace: 'Trace',
};
// Bornes de chaque étape dans la progression du scroll.
const BOUNDS = [0, 0.2, 0.33, 0.44, 0.55, 0.68, 1];

interface Cell { g: number; net: number; fill: boolean }
interface Meta {
  nets: Record<string, string>;
  parts?: Record<string, string>;
  route: { net: string; length: number; pts: [number, number, number][] };
}
interface Height { w: number; h: number; res: number; step: number; mm: [number, number]; comps: { ref: string; pkg: string }[] }

export function initScope(root: HTMLElement) {
  whenNear(root, () => start(root), '120%');
}

async function start(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const stageEl = root.querySelector<HTMLElement>('.pcb-stage')!;
  const labelsEl = root.querySelector<HTMLElement>('.pcb-labels')!;
  const out = {
    name: root.querySelector<HTMLElement>('[data-out="name"]')!,
    info: root.querySelector<HTMLElement>('[data-out="info"]')!,
    stage: root.querySelector<HTMLElement>('[data-out="stage"]')!,
  };
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-step]')];

  const [svgText, meta, hmeta, hbuf] = await Promise.all([
    fetch(root.dataset.svg!).then((r) => r.text()),
    fetch(root.dataset.meta!).then((r) => r.json() as Promise<Meta>),
    fetch(root.dataset.hmeta!).then((r) => r.json() as Promise<Height>),
    fetch(root.dataset.height!).then((r) => r.arrayBuffer()),
    fontsReady(),
  ]);
  const svg = new DOMParser().parseFromString(svgText, 'image/svg+xml').documentElement;
  const BW = parseFloat(svg.getAttribute('data-w')!);
  const BH = parseFloat(svg.getAttribute('data-h')!);
  const names = new Map(Object.entries(meta.nets).map(([k, v]) => [Number(k), v]));
  const parts = meta.parts || {};

  const items: Record<Layer, Item[]> = { top: [], in1: [], in2: [], bot: [] };
  const read = (el: Element, kind: Kind): Item => ({
    kind,
    net: Number(el.getAttribute('data-n')),
    d: new Path2D(el.getAttribute('d')!),
    w: parseFloat(el.getAttribute('stroke-width') || '0'),
  });
  svg.querySelectorAll('.pcb-layer').forEach((g) => {
    const L = g.getAttribute('data-layer') as Layer;
    g.querySelectorAll('path').forEach((p) => items[L].push(read(p, p.getAttribute('class') as Kind)));
  });
  const vias = [...svg.querySelectorAll('.via')].map((p) => read(p, 'via'));
  const outline = new Path2D(svg.querySelector('.pcb-outline')!.getAttribute('d')!);
  const netStats = new Map<number, { layers: Set<Layer>; vias: number }>();
  for (const L of LAYERS)
    for (const it of items[L]) {
      if (!netStats.has(it.net)) netStats.set(it.net, { layers: new Set(), vias: 0 });
      netStats.get(it.net)!.layers.add(L);
    }
  for (const v of svg.querySelectorAll('.via')) {
    const n = Number(v.getAttribute('data-n'));
    if (!netStats.has(n)) netStats.set(n, { layers: new Set(), vias: 0 });
    netStats.get(n)!.vias += (v.getAttribute('d')!.match(/M/g) || []).length;
  }

  // Cartes de hauteur : dessus, identifiants dessus, dessous, identifiants dessous.
  const HW = hmeta.w;
  const HH = hmeta.h;
  const n = HW * HH;
  const topH = new Uint8Array(hbuf, 0, n);
  const topId = new Uint8Array(hbuf, n, n);
  const botH = new Uint8Array(hbuf, 2 * n, n);
  const botId = new Uint8Array(hbuf, 3 * n, n);

  let cols = 0;
  let rows = 0;
  let cw = 0;
  let ch = 0;
  let mmPerCol = 0;
  let atlas: Atlas;
  const grids = {} as Record<Layer, Cell[]>;
  let viaGrid = new Int32Array(0);
  let edge = new Uint8Array(0);
  let compTop = new Float32Array(0);
  let compTopId = new Int16Array(0);
  let compBotId = new Int16Array(0);
  let route: { cell: Int32Array; t: Float32Array; layer: Int8Array } = { cell: new Int32Array(0), t: new Float32Array(0), layer: new Int8Array(0) };

  const ctx = canvas.getContext('2d')!;
  const mk = () => {
    const c = document.createElement('canvas');
    return { c, x: c.getContext('2d')! };
  };
  const bufA = mk();
  const bufB = mk();
  const overlay = document.createElement('canvas');
  overlay.className = 'pcb-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  stageEl.append(overlay);
  const octx = overlay.getContext('2d')!;

  const SX = 4;
  const SY = 7;
  let ready = false;

  async function layout() {
    ready = false;
    const r = dpr();
    const W = stageEl.clientWidth;
    cols = Math.floor(W / (W < 600 ? 4.4 : 5.2));
    mmPerCol = BW / cols;
    rows = Math.ceil(BH / (mmPerCol * 1.72));
    const cssCw = W / cols;
    cw = cssCw * r;
    ch = cw * 1.72;
    for (const c of [canvas, overlay, bufA.c, bufB.c]) {
      c.width = Math.round(cw * cols);
      c.height = Math.round(ch * rows);
    }
    canvas.style.height = overlay.style.height = `${cssCw * 1.72 * rows}px`;
    atlas = new Atlas(CHARS, COLORS, Math.ceil(cw), Math.ceil(ch));
    await rasterize();
    sampleHeights();
    rasterRoute();
    placeLabels();
    ready = true;
    shown = -1;
    update();
  }

  // ───── Cuivre : rendu hors écran puis réduction en glyphes ─────
  async function rasterize() {
    const mm = mmPerCol;
    const w = cols * SX;
    const h = rows * SY;
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const sx = SX / mm;
    const sy = SY / (mm * 1.72);
    const paint = (list: Item[], color: (it: Item) => string, minW = 0) => {
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.clearRect(0, 0, w, h);
      o.setTransform(sx, 0, 0, sy, 0, 0);
      o.lineCap = 'round';
      o.lineJoin = 'round';
      for (const it of list) {
        const c = color(it);
        if (it.kind === 'trk') {
          o.strokeStyle = c;
          o.lineWidth = Math.max(it.w, minW);
          o.stroke(it.d);
        } else {
          o.fillStyle = c;
          o.fill(it.d, 'evenodd');
        }
      }
      return o.getImageData(0, 0, w, h).data;
    };
    const cover = (data: Uint8ClampedArray, c: number) => {
      const cov = new Float32Array(cols * rows);
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) cov[Math.floor(y / SY) * cols + Math.floor(x / SX)] += data[(y * w + x) * 4 + c] / 255;
      for (let i = 0; i < cov.length; i++) cov[i] /= SX * SY;
      return cov;
    };
    const idColor = (it: Item) => `rgb(${(it.net + 1) & 255},${(it.net + 1) >> 8},0)`;
    const known = new Set([...netStats.keys()]);
    const ids = (data: Uint8ClampedArray) => {
      const res = new Int32Array(cols * rows).fill(-1);
      for (let cy = 0; cy < rows; cy++)
        for (let cx = 0; cx < cols; cx++) {
          const px = ((cy * SY + 3) * w + cx * SX + 2) * 4;
          if (data[px + 3] < 255) continue;
          const id = data[px] + data[px + 1] * 256 - 1;
          if (known.has(id)) res[cy * cols + cx] = id;
        }
      return res;
    };
    const thin = mm * 0.9;
    for (const L of LAYERS) {
      await new Promise(requestAnimationFrame);
      const list = items[L];
      const geo = paint(list, (it) => (it.kind === 'trk' ? '#f00' : it.kind === 'pad' ? '#0f0' : '#00f'), thin);
      const trk = cover(geo, 0);
      const pad = cover(geo, 1);
      const pour = cover(geo, 2);
      const idsTrkPad = ids(paint(list.filter((i) => i.kind !== 'pour'), idColor, thin));
      const idsPour = ids(paint(list.filter((i) => i.kind === 'pour'), idColor));
      const at = (a: Float32Array, k: number) => (x: number, y: number) =>
        x >= 0 && y >= 0 && x < cols && y < rows && a[y * cols + x] > k;
      const on = at(trk, 0.2);
      const isPad = at(pad, 0.45);
      const isPour = at(pour, 0.5);
      const cells: Cell[] = new Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          let g = -1;
          let fill = false;
          if (isPad(x, y)) {
            const l = isPad(x - 1, y);
            const r = isPad(x + 1, y);
            const u = isPad(x, y - 1);
            const d = isPad(x, y + 1);
            if (l && r && u && d) {
              g = 0;
              fill = true;
            } else if (l && r) g = 1;
            else if (u && d) g = 2;
            else g = 5;
          } else if (trk[i] > 0.82) g = 9;
          else if (trk[i] > 0.2) {
            const hz = on(x - 1, y) || on(x + 1, y);
            const vt = on(x, y - 1) || on(x, y + 1);
            const d1 = on(x + 1, y - 1) || on(x - 1, y + 1);
            const d2 = on(x - 1, y - 1) || on(x + 1, y + 1);
            g = hz && vt ? 5 : hz ? 1 : vt ? 2 : d1 ? 3 : d2 ? 4 : 0;
          } else if (isPour(x, y)) {
            if (!isPour(x - 1, y) || !isPour(x + 1, y) || !isPour(x, y - 1) || !isPour(x, y + 1)) g = 8;
          }
          const net = g < 0 ? -1 : g === 8 ? idsPour[i] : idsTrkPad[i] >= 0 ? idsTrkPad[i] : idsPour[i];
          cells[i] = { g, net, fill };
        }
      grids[L] = cells;
    }
    viaGrid = ids(paint(vias, idColor));
    const ol = paint([{ kind: 'trk', net: 0, d: outline, w: mm * 1.1 }], () => '#fff');
    edge = Uint8Array.from(cover(ol, 0), (v) => (v > 0.12 ? 1 : 0));
  }

  // ───── Composants : carte de hauteur ramenée à la grille ─────
  function sampleHeights() {
    const N = cols * rows;
    compTop = new Float32Array(N);
    compTopId = new Int16Array(N);
    compBotId = new Int16Array(N);
    const kx = hmeta.mm[0] / BW;
    const ky = hmeta.mm[1] / BH;
    for (let cy = 0; cy < rows; cy++)
      for (let cx = 0; cx < cols; cx++) {
        const i = cy * cols + cx;
        const x0 = Math.floor(((cx * mmPerCol) / hmeta.res) * kx);
        const x1 = Math.min(HW - 1, Math.floor((((cx + 1) * mmPerCol) / hmeta.res) * kx));
        const y0 = Math.floor(((cy * mmPerCol * 1.72) / hmeta.res) * ky);
        const y1 = Math.min(HH - 1, Math.floor((((cy + 1) * mmPerCol * 1.72) / hmeta.res) * ky));
        let hmax = 0;
        let id = 0;
        let bid = 0;
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const k = y * HW + x;
            if (topH[k] > hmax) {
              hmax = topH[k];
              id = topId[k];
            }
            if (!bid && botId[k]) bid = botId[k];
          }
        compTop[i] = hmax * hmeta.step;
        compTopId[i] = id;
        compBotId[i] = bid;
      }
  }

  // ───── Piste suivie par la sonde ─────
  function rasterRoute() {
    const pts = meta.route.pts;
    const cells: number[] = [];
    const ts: number[] = [];
    const ls: number[] = [];
    const seen = new Set<number>();
    let acc = 0;
    for (let k = 1; k < pts.length; k++) {
      const [ax, ay, al] = pts[k - 1];
      const [bx, by] = pts[k];
      const len = Math.hypot(bx - ax, by - ay);
      const steps = Math.max(1, Math.ceil(len / (mmPerCol * 0.3)));
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const gx = Math.floor((ax + (bx - ax) * f) / mmPerCol);
        const gy = Math.floor((ay + (by - ay) * f) / (mmPerCol * 1.72));
        const i = gy * cols + gx;
        if (gx < 0 || gy < 0 || gx >= cols || gy >= rows || seen.has(i)) continue;
        seen.add(i);
        cells.push(i);
        ts.push(acc + len * f);
        ls.push(al);
      }
      acc += len;
    }
    route = { cell: Int32Array.from(cells), t: Float32Array.from(ts), layer: Int8Array.from(ls) };
  }

  // Références des principaux composants, posées en DOM pour rester nettes.
  const boxes = new Map<number, number[]>();
  function placeLabels() {
    boxes.clear();
    for (let i = 0; i < compTopId.length; i++) {
      const id = compTopId[i];
      if (!id) continue;
      const x = i % cols;
      const y = Math.floor(i / cols);
      const b = boxes.get(id) || [x, y, x, y, 0];
      b[0] = Math.min(b[0], x);
      b[1] = Math.min(b[1], y);
      b[2] = Math.max(b[2], x);
      b[3] = Math.max(b[3], y);
      b[4]++;
      boxes.set(id, b);
    }
    labelsEl.textContent = '';
    for (const [id, b] of boxes) {
      const ref = hmeta.comps[id - 1]?.ref || '';
      const big = b[4] * mmPerCol * mmPerCol * 1.72 > (cols < 120 ? 14 : 7);
      if (!big || !/^(U|Q|J|L|X|Y|SW|USB|LED)/.test(ref)) continue;
      const s = document.createElement('span');
      s.textContent = ref;
      s.style.left = `${((b[0] + b[2] + 1) / 2 / cols) * 100}%`;
      s.style.top = `${((b[1] + b[3] + 1) / 2 / rows) * 100}%`;
      labelsEl.append(s);
    }
  }

  // ───── Rendu d'une vue complète dans un tampon ─────
  function renderView(target: CanvasRenderingContext2D, st: Stage) {
    target.fillStyle = '#060606';
    target.fillRect(0, 0, bufA.c.width, bufA.c.height);
    const N = cols * rows;
    for (let i = 0; i < N; i++) {
      const x = (i % cols) * cw;
      const y = Math.floor(i / cols) * ch;
      let g = -1;
      let col = 0;

      if (st === 'comp') {
        const h = compTop[i];
        const id = compTopId[i];
        if (id) {
          const cx = i % cols;
          const cy = Math.floor(i / cols);
          const idAt = (dx: number, dy: number) => {
            const xx = cx + dx;
            const yy = cy + dy;
            return xx < 0 || yy < 0 || xx >= cols || yy >= rows ? 0 : compTopId[yy * cols + xx];
          };
          const hz = idAt(-1, 0) !== id || idAt(1, 0) !== id;
          const vt = idAt(0, -1) !== id || idAt(0, 1) !== id;
          if (hz || vt) {
            g = hz && vt ? 5 : vt ? 1 : 2;
            col = 0;
          } else {
            // Ombrage : lumière rasante venant du haut à gauche.
            const hl = compTop[Math.max(i - 1, 0)];
            const hu = compTop[Math.max(i - cols, 0)];
            const shade = Math.min(Math.max(0.55 + (h - hl) * 0.5 + (h - hu) * 0.5, 0), 1);
            const lum = Math.min(0.2 + Math.min(h / 2.2, 1) * 0.5 + shade * 0.35, 0.999);
            g = RAMP[Math.floor(lum * RAMP.length)];
            col = lum > 0.55 ? 0 : 1;
          }
        } else {
          const c = grids.top[i];
          if (viaGrid[i] >= 0) {
            g = 7;
            col = 5;
          } else if (c.g >= 0 && !c.fill) {
            g = c.g;
            col = c.g === 8 ? 5 : 4;
          }
        }
      } else {
        const order: Layer[] = st === 'trace' ? [...LAYERS] : [st];
        if (viaGrid[i] >= 0) {
          g = 7;
          col = st === 'trace' ? 4 : 2;
        } else {
          for (const L of order) {
            const c = grids[L][i];
            if (c.g >= 0) {
              g = c.g;
              col = st === 'trace' ? (c.fill || c.g === 8 ? 5 : 4) : c.fill ? 5 : c.g === 8 ? 3 : 0;
              break;
            }
          }
          if (g < 0 && st !== 'trace') {
            for (const L of LAYERS) {
              const c = grids[L][i];
              if (c.g >= 0 && c.g !== 8 && !c.fill) {
                g = c.g;
                col = 5;
                break;
              }
            }
          }
          if (st === 'bot' && compBotId[i] && g < 0) {
            g = 8;
            col = 3;
          }
        }
      }
      if (g < 0 && edge[i]) {
        g = 0;
        col = 3;
      }
      if (g >= 0) atlas.draw(target, g, col, x, y);
    }
  }

  // ───── Chronologie ─────
  const still = reducedMotion();
  let progress = 0;
  let shown = -1;
  let hot = -2; // -2 : rien d'affiché encore, force le premier texte d'aide
  let hotKind: 'net' | 'comp' = 'net';

  function stageAt(p: number) {
    let s = 0;
    while (s < STAGES.length - 1 && p >= BOUNDS[s + 1]) s++;
    return { s, f: (p - BOUNDS[s]) / (BOUNDS[s + 1] - BOUNDS[s]) };
  }

  function measure() {
    if (still) return;
    const b = root.getBoundingClientRect();
    progress = Math.min(Math.max(-b.top / Math.max(b.height - innerHeight, 1), 0), 1);
  }

  let prevStage = 0;
  function update() {
    if (!ready) return;
    const { s, f } = still ? { s: 0, f: 1 } : stageAt(progress);
    if (s !== shown) {
      // On garde la vue précédente pour le balayage de transition.
      prevStage = shown < 0 ? s : shown;
      renderView(bufA.x, STAGES[prevStage]);
      renderView(bufB.x, STAGES[s]);
      shown = s;
      steps.forEach((b, k) => b.setAttribute('aria-current', String(k === s)));
      out.stage.textContent = LABEL[STAGES[s]];
      root.dataset.stage = STAGES[s];
      setHot(-1);
    }
    const wipe = prevStage === s ? 1 : Math.min(f / 0.3, 1);
    const Wc = canvas.width;
    ctx.drawImage(bufA.c, 0, 0);
    if (wipe > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, Wc * wipe, canvas.height);
      ctx.clip();
      ctx.drawImage(bufB.c, 0, 0);
      ctx.restore();
    }
    if (wipe > 0 && wipe < 1) {
      ctx.fillStyle = 'rgba(255,59,29,.9)';
      ctx.fillRect(Wc * wipe - 1, 0, 2, canvas.height);
    }
    drawOverlay(STAGES[s], f);
  }

  function drawOverlay(st: Stage, f: number) {
    octx.clearRect(0, 0, overlay.width, overlay.height);
    if (st === 'trace') {
      const total = meta.route.length;
      const L = still ? total : Math.min(Math.max((f - 0.08) / 0.84, 0), 1) * total;
      let head = -1;
      for (let k = 0; k < route.cell.length; k++) {
        const i = route.cell[k];
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        const t = route.t[k];
        octx.fillStyle = '#060606';
        octx.fillRect(x, y, cw, ch);
        if (t <= L) {
          atlas.draw(octx, 6, L - t < 2.5 ? HL : HL + 1, x, y);
          head = k;
        } else atlas.draw(octx, 0, 1, x, y);
      }
      if (head >= 0) {
        const i = route.cell[head];
        const x = (i % cols) * cw + cw / 2;
        const y = Math.floor(i / cols) * ch + ch / 2;
        const R = cw * 9;
        const gr = octx.createRadialGradient(x, y, 0, x, y, R);
        gr.addColorStop(0, 'rgba(255,80,40,.5)');
        gr.addColorStop(0.3, 'rgba(255,59,29,.14)');
        gr.addColorStop(1, 'rgba(255,59,29,0)');
        octx.fillStyle = gr;
        octx.fillRect(x - R, y - R, R * 2, R * 2);
        octx.fillStyle = '#ff3b1d';
        octx.fillRect(x - cw * 0.9, y - cw * 0.9, cw * 1.8, cw * 1.8);
        const layer = LAYERS[route.layer[head]];
        out.name.textContent = meta.route.net;
        out.info.textContent = `${L.toFixed(1)} / ${total.toFixed(1)} mm · ${layer.toUpperCase()}`;
      } else {
        out.name.textContent = meta.route.net;
        out.info.textContent = `${total.toFixed(1)} mm`;
      }
      return;
    }
    if (hot < 0) return;
    octx.fillStyle = '#060606';
    if (hotKind === 'comp') {
      for (let i = 0; i < compTopId.length; i++) {
        if (compTopId[i] !== hot) continue;
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        octx.fillRect(x, y, cw, ch);
        atlas.draw(octx, 10, HL, x, y);
      }
      return;
    }
    const st2 = st as Layer;
    for (let i = 0; i < cols * rows; i++) {
      const c = grids[st2][i];
      const isVia = viaGrid[i] === hot;
      if (!isVia && (c.g < 0 || c.net !== hot)) continue;
      const x = (i % cols) * cw;
      const y = Math.floor(i / cols) * ch;
      octx.fillRect(x, y, cw, ch);
      atlas.draw(octx, isVia ? 7 : c.g, c.fill || c.g === 8 ? HL + 1 : HL, x, y);
    }
  }

  function setHot(id: number, kind: 'net' | 'comp' = hotKind) {
    if (id === hot && kind === hotKind) return;
    hot = id;
    hotKind = kind;
    const st = STAGES[Math.max(shown, 0)];
    if (st === 'trace') return;
    if (id < 0) {
      out.name.textContent = '—';
      out.info.textContent = st === 'comp' ? 'Hover a part' : 'Hover a trace';
    } else if (kind === 'comp') {
      const c = hmeta.comps[id - 1];
      out.name.textContent = c.ref;
      out.info.textContent = `${parts[c.ref] || ''}${parts[c.ref] ? ' · ' : ''}${c.pkg}`;
    } else {
      const s = netStats.get(id);
      out.name.textContent = names.get(id) ?? `N${String(id).padStart(3, '0')}`;
      out.info.textContent = `${s ? LAYERS.filter((L) => s.layers.has(L)).map((L) => L.toUpperCase()).join(' ') : ''}${s && s.vias ? ` · ${s.vias} vias` : ''}`;
    }
    if (ready) drawOverlay(st, 1);
  }

  function pick(e: PointerEvent | MouseEvent) {
    if (!ready) return;
    const b = canvas.getBoundingClientRect();
    const cx = Math.floor(((e.clientX - b.left) / b.width) * cols);
    const cy = Math.floor(((e.clientY - b.top) / b.height) * rows);
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return setHot(-1);
    const i = cy * cols + cx;
    const st = STAGES[shown];
    if (st === 'trace') return;
    if (st === 'comp') return setHot(compTopId[i] || -1, 'comp');
    let id = viaGrid[i];
    const c = grids[st as Layer][i];
    if (id < 0 && c.g >= 0 && c.g !== 8) id = c.net;
    setHot(id, 'net');
  }
  canvas.addEventListener('pointermove', (e) => e.pointerType === 'mouse' && pick(e));
  canvas.addEventListener('click', pick);
  canvas.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && setHot(-1));

  // Les étapes sont aussi des liens : un clic fait défiler jusqu'à elles.
  steps.forEach((b, k) =>
    b.addEventListener('click', () => {
      const r = root.getBoundingClientRect();
      const span = r.height - innerHeight;
      const target = scrollY + r.top + span * (BOUNDS[k] + (BOUNDS[k + 1] - BOUNDS[k]) * 0.45);
      scrollTo({ top: target, behavior: still ? 'auto' : 'smooth' });
    }),
  );

  let visible = false;
  let raf = 0;
  const tick = () => {
    raf = 0;
    measure();
    update();
  };
  addEventListener('scroll', () => visible && !raf && (raf = requestAnimationFrame(tick)), { passive: true });
  trackVisible(root, (v) => (visible = v));
  let lastW = stageEl.clientWidth;
  new ResizeObserver(() => {
    if (stageEl.clientWidth === lastW) return;
    lastW = stageEl.clientWidth;
    layout();
  }).observe(stageEl);
  measure();
  await layout();
  root.classList.add('is-live');
}

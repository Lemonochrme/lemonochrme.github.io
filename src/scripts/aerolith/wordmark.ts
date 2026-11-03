// Wordmark AEROLITH composé en caractères : le texte sert de masque, chaque cellule
// du masque reçoit un glyphe. Un champ lent fait vivre la matière, le pointeur la perturbe.
import { Atlas, FONT, INK, SIG, dpr, fontsReady, reducedMotion, rgba, trackVisible } from './glyphs';

const FILL = '.:-=+*#%@';
const EDGE = '|/-\\';
const CHARS = FILL + EDGE + '0123456789ABCDEF';
const COLORS = [rgba(INK, 1), rgba(INK, 0.7), rgba(INK, 0.42), rgba(SIG, 1)];

export async function initWordmark(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const ctx = canvas.getContext('2d')!;
  await fontsReady();

  let cols = 0;
  let rows = 0;
  let cw = 0;
  let ch = 0;
  let atlas: Atlas;
  let cover = new Float32Array(0); // couverture du glyphe par cellule
  let edge = new Int8Array(0); // -1 intérieur, 0..3 orientation du bord
  let seed = new Float32Array(0);
  const words = () => (root.clientWidth < 700 ? ['AERO', 'LITH'] : ['AEROLITH']);

  function layout() {
    const r = dpr();
    const W = root.clientWidth;
    const lines = words();
    const cssCw = W < 700 ? 3.6 : W < 1200 ? 4.4 : 5;
    cols = Math.floor(W / cssCw);
    // Le mot le plus long occupe toute la largeur, avec une approche serrée.
    const longest = Math.max(...lines.map((l) => l.length));
    const TRACK = 0.86; // avance d'une lettre, en fraction de la chasse de 0,6 em
    const emCells = cols / (0.6 * (1 + (longest - 1) * TRACK));
    const capRows = (emCells * 0.72) / 1.72;
    const lineRows = Math.ceil(capRows) + 1;
    const gap = Math.round(lineRows * 0.18);
    rows = lineRows * lines.length + gap * (lines.length - 1);
    cw = (W / cols) * r;
    ch = cw * 1.72;
    canvas.width = Math.round(cw * cols);
    canvas.height = Math.round(ch * rows);
    canvas.style.height = `${(W / cols) * 1.72 * rows}px`;
    atlas = new Atlas(CHARS, COLORS, Math.ceil(cw), Math.ceil(ch));

    // Masque : le texte rendu à 4 × 7 échantillons par cellule (pixels quasi carrés).
    const SX = 4;
    const SY = 7;
    const m = document.createElement('canvas');
    m.width = cols * SX;
    m.height = rows * SY;
    const mc = m.getContext('2d', { willReadFrequently: true })!;
    mc.fillStyle = '#fff';
    mc.textBaseline = 'alphabetic';
    const em = emCells * SX;
    mc.font = `500 ${em}px ${FONT}`;
    lines.forEach((l, i) => {
      const base = (i * (lineRows + gap) + lineRows - 0.5) * SY;
      [...l].forEach((c, k) => mc.fillText(c, k * 0.6 * em * TRACK, base));
    });
    const px = mc.getImageData(0, 0, m.width, m.height).data;
    cover = new Float32Array(cols * rows);
    for (let y = 0; y < m.height; y++)
      for (let x = 0; x < m.width; x++) cover[Math.floor(y / SY) * cols + Math.floor(x / SX)] += px[(y * m.width + x) * 4] / 255;
    for (let i = 0; i < cover.length; i++) cover[i] /= SX * SY;

    const on = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows && cover[y * cols + x] > 0.35;
    edge = new Int8Array(cols * rows).fill(-1);
    seed = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        seed[i] = Math.random();
        if (!on(x, y)) continue;
        const l = on(x - 1, y);
        const rr = on(x + 1, y);
        const u = on(x, y - 1);
        const d = on(x, y + 1);
        if (l && rr && u && d) continue;
        edge[i] = !l || !rr ? (!u || !d ? (on(x + 1, y - 1) && !on(x - 1, y + 1) ? 1 : 3) : 0) : 2;
      }
    frame(performance.now());
  }

  // Pointeur : les cellules proches se brouillent.
  const pointer = { x: -1e4, y: -1e4 };
  root.addEventListener('pointermove', (e) => {
    const b = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - b.left) / b.width) * cols;
    pointer.y = ((e.clientY - b.top) / b.height) * rows;
  });
  root.addEventListener('pointerleave', () => {
    pointer.x = pointer.y = -1e4;
  });

  const still = reducedMotion();
  const t0 = performance.now();
  function frame(now: number) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const intro = still ? 99 : t / 1.4;
    const R = Math.max(6, rows * 0.35);
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const c = cover[i];
        if (c < 0.35) continue;
        const s = seed[i];
        // Décodage d'entrée, de gauche à droite.
        if (intro < 1 && x / cols > intro * 1.25 - s * 0.25) continue;
        const near = Math.hypot((x - pointer.x) * 0.55, y - pointer.y) < R;
        let g: number;
        let col = 0;
        if (near || (intro < 1.2 && x / cols > intro - 0.1)) {
          g = FILL.length + EDGE.length + Math.floor(((s * 977 + t * 23) % 1) * 16);
          col = near ? 3 : 1;
        } else if (edge[i] >= 0) {
          g = FILL.length + edge[i];
          col = 0;
        } else {
          // Champ lent : la densité ondule dans la matière.
          const f = 0.55 + 0.45 * Math.sin(x * 0.18 + y * 0.31 + t * 0.9 + s * 1.6);
          g = Math.min(FILL.length - 1, Math.floor((0.35 + 0.65 * f) * c * FILL.length));
          col = f > 0.75 ? 0 : 1;
        }
        atlas.draw(ctx, g, col, x * cw, y * ch);
      }
  }

  let visible = true;
  let raf = 0;
  let last = 0;
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    // 30 images/s suffisent pour un champ de caractères.
    if (now - last < 33) return;
    last = now;
    frame(now);
  };
  trackVisible(root, (v) => {
    visible = v;
    if (v && !raf && !still) raf = requestAnimationFrame(loop);
  });
  let lastW = root.clientWidth;
  new ResizeObserver(() => {
    if (root.clientWidth === lastW) return;
    lastW = root.clientWidth;
    layout();
  }).observe(root);
  layout();
  root.classList.add('is-live');
  if (!still) raf = requestAnimationFrame(loop);
}

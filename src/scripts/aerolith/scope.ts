// Cartes électroniques, parcourues au scroll : composants (rendu tiré du STEP) → couches de cuivre
// → une piste suivie par une sonde. Tout est vectoriel, dans le repère de la carte en millimètres.
import { reducedMotion, trackVisible, whenNear } from './glyphs';

const SVGNS = 'http://www.w3.org/2000/svg';
const LAYERS = ['top', 'in1', 'in2', 'bot'] as const;
const STAGES = ['comp', 'top', 'in1', 'in2', 'bot', 'trace'] as const;
type Stage = (typeof STAGES)[number];
const LABEL: Record<Stage, string> = {
  comp: 'Components', top: 'Top copper', in1: 'Inner 1', in2: 'Inner 2', bot: 'Bottom copper', trace: 'Trace',
};
const HINT: Record<Stage, string> = {
  comp: 'Hover a part', top: 'Hover a trace', in1: 'Hover a trace', in2: 'Hover a trace', bot: 'Hover a trace', trace: '',
};
// Bornes de chaque étape dans la progression du scroll.
const BOUNDS = [0, 0.2, 0.33, 0.44, 0.55, 0.68, 1];

interface Meta {
  nets: Record<string, string>;
  parts?: Record<string, string>;
  route: { net: string; length: number; pts: [number, number, number][] };
}
interface Parts { mm: [number, number]; parts: { ref: string; pkg: string; side: 'top' | 'bot'; box: number[] }[] }

const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

export function initScope(root: HTMLElement) {
  whenNear(root, () => start(root), '120%');
}

async function start(root: HTMLElement) {
  const stageEl = root.querySelector<HTMLElement>('.pcb-stage')!;
  const out = {
    name: root.querySelector<HTMLElement>('[data-out="name"]')!,
    info: root.querySelector<HTMLElement>('[data-out="info"]')!,
    stage: root.querySelector<HTMLElement>('[data-out="stage"]')!,
  };
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const base = root.dataset.render!;

  const [svgText, meta, partsData] = await Promise.all([
    fetch(root.dataset.svg!).then((r) => r.text()),
    fetch(root.dataset.meta!).then((r) => r.json() as Promise<Meta>),
    fetch(`${base}-parts.json`).then((r) => r.json() as Promise<Parts>),
  ]);
  const svg = document.importNode(new DOMParser().parseFromString(svgText, 'image/svg+xml').documentElement, true) as unknown as SVGSVGElement;
  const BW = parseFloat(svg.getAttribute('data-w')!);
  const BH = parseFloat(svg.getAttribute('data-h')!);
  svg.classList.add('pcb-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', stageEl.dataset.label || 'Board layout');
  const names = new Map(Object.entries(meta.nets).map(([k, v]) => [Number(k), v]));
  const partNumbers = meta.parts || {};

  // Rendus des composants, posés dans le repère de la carte (le STEP a les mêmes cotes).
  const kx = BW / partsData.mm[0];
  const ky = BH / partsData.mm[1];
  for (const side of ['bot', 'top'] as const) {
    const img = el('image', { class: `comp-img comp-${side}`, x: 0, y: 0, width: BW, height: BH, preserveAspectRatio: 'none' });
    img.setAttribute('href', `${base}-${side}.png`);
    const anchor = side === 'top' ? svg.querySelector('.pcb-vias')!.nextSibling : svg.querySelector('.pcb-layer[data-layer="top"]');
    svg.insertBefore(img, anchor);
  }

  // Emprises des composants : zones de survol et étiquettes des principaux.
  const partsG = el('g', { class: 'comp-parts' });
  const labelsG = el('g', { class: 'comp-labels' });
  const boxes = new Map<string, SVGRectElement>();
  for (const p of partsData.parts) {
    if (!p.ref) continue;
    const [x0, y0, x1, y1] = [p.box[0] * kx, p.box[1] * ky, p.box[2] * kx, p.box[3] * ky];
    const r = el('rect', { class: 'hit', x: x0, y: y0, width: x1 - x0, height: y1 - y0, 'data-ref': p.ref, 'data-side': p.side });
    partsG.append(r);
    boxes.set(`${p.ref}:${p.side}`, r);
    const big = (x1 - x0) * (y1 - y0) > 5 && /^(U|Q|L|X|Y|J|SW|USB)/.test(p.ref);
    if (big && p.side === 'top') {
      const t = el('text', { x: (x0 + x1) / 2, y: (y0 + y1) / 2, 'data-ref': p.ref });
      t.textContent = p.ref;
      labelsG.append(t);
    }
  }
  svg.append(partsG, labelsG);

  // Tracé suivi par la sonde : fantôme complet, partie parcourue, tête.
  const pts = meta.route.pts;
  const ptsAttr = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const routeGhost = el('polyline', { class: 'route-ghost', points: ptsAttr });
  const routeLit = el('polyline', { class: 'route-lit', points: ptsAttr });
  const probe = el('rect', { class: 'probe' });
  const routeG = el('g', { class: 'route' });
  routeG.append(routeGhost, routeLit, probe);
  svg.append(routeG);
  // Longueurs cumulées, pour savoir sur quelle couche se trouve la sonde.
  const cum = [0];
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
  const total = cum[cum.length - 1];

  stageEl.prepend(svg);

  // Les traits restent fins quelle que soit l'échelle ; le texte est dimensionné en pixels.
  let mmPerPx = 0.05;
  function resize() {
    mmPerPx = BW / Math.max(stageEl.clientWidth, 1);
    labelsG.setAttribute('font-size', String(10.5 * mmPerPx));
    probe.setAttribute('width', String(9 * mmPerPx));
    probe.setAttribute('height', String(9 * mmPerPx));
    routeLit.style.strokeWidth = String(2.5 * mmPerPx);
    update(true);
  }

  // ───── Survol : nets en couche de cuivre, composants en vue « Components » ─────
  let hotEls: Element[] = [];
  function clearHot() {
    hotEls.forEach((e) => e.classList.remove('is-hot'));
    hotEls = [];
  }
  function showHint() {
    const st = STAGES[shown];
    out.name.textContent = '';
    out.info.textContent = HINT[st];
  }
  svg.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    const st = STAGES[shown];
    if (st === 'trace') return;
    if (t.classList.contains('hit') && st === 'comp') {
      clearHot();
      t.classList.add('is-hot');
      hotEls = [t];
      const ref = t.getAttribute('data-ref')!;
      const pkg = partsData.parts.find((p) => p.ref === ref)?.pkg || '';
      out.name.textContent = ref;
      out.info.textContent = [partNumbers[ref], pkg].filter(Boolean).join(' · ');
      return;
    }
    const n = t.getAttribute('data-n');
    if (n === null || st === 'comp') return;
    const layer = t.closest('[data-layer]')?.getAttribute('data-layer');
    if (layer && layer !== st) return;
    clearHot();
    hotEls = [...svg.querySelectorAll(`.pcb-layer[data-layer="${st}"] [data-n="${n}"], .via[data-n="${n}"]`)];
    hotEls.forEach((h) => h.classList.add('is-hot'));
    const id = Number(n);
    const used = LAYERS.filter((L) => svg.querySelector(`.pcb-layer[data-layer="${L}"] [data-n="${n}"]`));
    out.name.textContent = names.get(id) ?? `N${String(id).padStart(3, '0')}`;
    out.info.textContent = used.map((L) => L.toUpperCase()).join(' ');
  });
  svg.addEventListener('pointerleave', () => {
    clearHot();
    if (STAGES[shown] !== 'trace') showHint();
  });

  // ───── Chronologie ─────
  const still = reducedMotion();
  let progress = 0;
  let shown = -1;

  function measure() {
    if (still) return;
    const b = root.getBoundingClientRect();
    progress = Math.min(Math.max(-b.top / Math.max(b.height - innerHeight, 1), 0), 1);
  }

  function update(force = false) {
    let s = 0;
    while (s < STAGES.length - 1 && progress >= BOUNDS[s + 1]) s++;
    const f = (progress - BOUNDS[s]) / (BOUNDS[s + 1] - BOUNDS[s]);
    if (s !== shown || force) {
      if (s !== shown) clearHot();
      shown = s;
      root.dataset.stage = STAGES[s];
      steps.forEach((b, k) => b.setAttribute('aria-current', String(k === s)));
      out.stage.textContent = LABEL[STAGES[s]];
      if (STAGES[s] !== 'trace') showHint();
    }
    if (STAGES[s] !== 'trace') return;

    // La sonde parcourt la piste ; ce qui est derrière elle s'allume.
    const k = still ? 1 : Math.min(Math.max((f - 0.08) / 0.84, 0), 1);
    const L = k * total;
    routeLit.style.strokeDasharray = `${total} ${total}`;
    routeLit.style.strokeDashoffset = String(total - L);
    let seg = 1;
    while (seg < cum.length - 1 && cum[seg] < L) seg++;
    const a = pts[seg - 1];
    const b = pts[seg];
    const u = cum[seg] === cum[seg - 1] ? 0 : (L - cum[seg - 1]) / (cum[seg] - cum[seg - 1]);
    const hs = 4.5 * mmPerPx;
    probe.setAttribute('x', String(a[0] + (b[0] - a[0]) * u - hs));
    probe.setAttribute('y', String(a[1] + (b[1] - a[1]) * u - hs));
    const layer = LAYERS[(u < 0.5 ? a : b)[2]];
    root.dataset.probe = layer;
    out.name.textContent = meta.route.net;
    out.info.textContent = `${L.toFixed(1)} / ${total.toFixed(1)} mm · ${layer.toUpperCase()}`;
  }

  // Les étapes sont aussi des liens : un clic fait défiler jusqu'à elles.
  steps.forEach((b, k) =>
    b.addEventListener('click', () => {
      const r = root.getBoundingClientRect();
      const span = r.height - innerHeight;
      const target = scrollY + r.top + span * (BOUNDS[k] + (BOUNDS[k + 1] - BOUNDS[k]) * 0.5);
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
  new ResizeObserver(resize).observe(stageEl);
  measure();
  resize();
  root.classList.add('is-live');
}

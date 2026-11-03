// Effets d'interface : apparition des images, décodage des titres, brouillage des liens.
import { reducedMotion } from './glyphs';

const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/\\<>';
const rand = () => POOL[(Math.random() * POOL.length) | 0];

/** Les images apparaissent en fondu quand elles entrent dans l'écran. */
export function initReveal(root: ParentNode = document) {
  const plates = root.querySelectorAll<HTMLElement>('.plate');
  if (reducedMotion()) {
    plates.forEach((p) => p.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
    },
    { threshold: 0.15 },
  );
  plates.forEach((p) => io.observe(p));
}

interface Glyph {
  el: HTMLSpanElement;
  final: string;
}

/**
 * Découpe le texte d'un élément en caractères de largeur fixe (celle du caractère final) :
 * le texte ne bouge pas pendant que les glyphes défilent.
 */
function split(host: HTMLElement): Glyph[] {
  const glyphs: Glyph[] = [];
  const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walk.nextNode()) nodes.push(walk.currentNode as Text);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    for (const c of node.data) {
      if (c === ' ' || c === '\n') {
        frag.append(c);
        continue;
      }
      const el = document.createElement('span');
      el.className = 'fx-ch';
      el.textContent = c;
      frag.append(el);
      glyphs.push({ el, final: c });
    }
    node.replaceWith(frag);
  }
  for (const g of glyphs) g.el.style.width = `${g.el.getBoundingClientRect().width}px`;
  return glyphs;
}

/**
 * Anime un ensemble de glyphes : chaque caractère démarre avec un léger décalage,
 * défile à cadence fixe (et non à chaque image), puis se fixe avec un bref éclat.
 */
function play(glyphs: Glyph[], opts: { stagger: number; jitter: number; spin: number; hide: boolean; done: () => void }) {
  const t0 = performance.now();
  const plan = glyphs.map((g, k) => ({ g, start: k * opts.stagger + Math.random() * opts.jitter, last: -1 }));
  const end = Math.max(...plan.map((p) => p.start)) + opts.spin + 160;
  let raf = 0;
  const step = (now: number) => {
    const t = now - t0;
    for (const p of plan) {
      const local = t - p.start;
      const { el, final } = p.g;
      if (local < 0) {
        // À l'apparition, un caractère pas encore démarré reste invisible ; au survol, il reste lisible.
        if (opts.hide) el.dataset.fx = 'wait';
        continue;
      }
      if (local < opts.spin) {
        // Nouveau glyphe toutes les 45 ms seulement : le défilement reste lisible.
        const tick = Math.floor(local / 45);
        if (tick !== p.last) {
          p.last = tick;
          el.textContent = rand();
        }
        el.dataset.fx = 'spin';
      } else if (local < opts.spin + 160) {
        el.textContent = final;
        el.dataset.fx = 'hit';
      } else {
        el.textContent = final;
        delete el.dataset.fx;
      }
    }
    if (t < end) raf = requestAnimationFrame(step);
    else opts.done();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** Titres : décodage à l'entrée dans l'écran. */
export function initDecode(root: ParentNode = document) {
  if (reducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-decode]').forEach((el) => {
    const html = el.innerHTML;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const glyphs = split(el);
        el.classList.add('fx-on');
        play(glyphs, {
          stagger: Math.min(32, 520 / glyphs.length),
          jitter: 140,
          spin: 300,
          hide: true,
          done: () => {
            el.innerHTML = html;
            el.classList.remove('fx-on');
          },
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
  });
}

/** Liens : une vague de brouillage au survol, de gauche à droite. */
export function initScramble(root: ParentNode = document) {
  if (reducedMotion() || matchMedia('(pointer: coarse)').matches) return;
  root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    const html = el.innerHTML;
    let stop: (() => void) | null = null;
    el.addEventListener('mouseenter', () => {
      if (stop) {
        stop();
        el.innerHTML = html;
      }
      const glyphs = split(el);
      el.classList.add('fx-on');
      stop = play(glyphs, {
        stagger: 22,
        jitter: 30,
        spin: 180,
        hide: false,
        done: () => {
          el.innerHTML = html;
          el.classList.remove('fx-on');
          stop = null;
        },
      });
    });
  });
}

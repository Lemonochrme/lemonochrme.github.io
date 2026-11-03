// Châssis 3D : le modèle FreeCAD assemblé, rendu en WebGL puis converti en ASCII.
// Au scroll, les 34 pièces s'assemblent, puis un scan « matérialise » le dessin en pièce solide.
import { FONT, RAMP, dpr, reducedMotion, trackVisible } from './glyphs';

interface Mesh { v: number; nv: number; i: number; ni: number }
interface Part { name: string; kind: string; mesh: string; m: number[]; centre: number[] }
interface Model { meshes: Record<string, Mesh>; parts: Part[]; min: number[]; max: number[] }

const GLYPHS = RAMP + '|\\-/';

const SCENE_VS = `
attribute vec3 aPos;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
uniform vec3 uOffset;
varying vec3 vView;
void main() {
  vec4 w = uModel * vec4(aPos * 0.1, 1.0) + vec4(uOffset, 0.0);
  vec4 v = uView * w;
  vView = v.xyz;
  gl_Position = uProj * v;
}`;

const SCENE_FS = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec3 vView;
uniform float uNear;
uniform float uFar;
uniform float uTone;
void main() {
  vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
  vec3 v = normalize(-vView);
  vec3 key = normalize(vec3(-0.45, 0.75, 0.55));
  vec3 fill = normalize(vec3(0.7, -0.2, 0.4));
  float lam = max(dot(n, key), 0.0);
  float spec = pow(max(dot(reflect(-key, n), v), 0.0), 28.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  float lum = 0.06 + 0.62 * lam + 0.16 * max(dot(n, fill), 0.0) + 0.35 * spec + 0.22 * rim;
  float d = clamp((-vView.z - uNear) / (uFar - uNear), 0.0, 1.0);
  float hi = floor(d * 255.0) / 255.0;
  float lo = fract(d * 255.0);
  gl_FragColor = vec4(clamp(lum * uTone, 0.0, 1.0), hi, lo, 1.0);
}`;

const POST_VS = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const POST_FS = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uAtlas;
uniform vec2 uRes;
uniform vec2 uCell;
uniform float uN;
uniform float uRamp;
uniform float uScan;
uniform float uTime;

float depth(vec2 px) {
  vec4 s = texture2D(uScene, px / uRes);
  return s.a < 0.5 ? 1.0 : s.g + s.b / 255.0;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 bg = vec3(0.024);
  vec3 ink = vec3(0.914, 0.906, 0.886);
  vec3 sig = vec3(1.0, 0.231, 0.114);

  // Rendu solide : ombrage + arêtes détectées sur la profondeur.
  vec4 s = texture2D(uScene, frag / uRes);
  float d0 = depth(frag);
  float e = abs(depth(frag + vec2(1.0, 0.0)) - depth(frag - vec2(1.0, 0.0)))
          + abs(depth(frag + vec2(0.0, 1.0)) - depth(frag - vec2(0.0, 1.0)));
  float edge = smoothstep(0.004, 0.02, e);
  vec3 carbon = mix(vec3(0.035, 0.036, 0.04), vec3(0.78, 0.77, 0.74), pow(s.r, 1.35));
  vec3 solid = s.a > 0.5 ? carbon : bg;
  solid = mix(solid, ink * 0.85, edge * 0.8);

  // Rendu ASCII : une cellule = un glyphe choisi sur la luminance ou l'orientation du bord.
  vec2 ci = floor(frag / uCell);
  vec2 cc = (ci + 0.5) * uCell;
  vec4 c = texture2D(uScene, cc / uRes);
  // Un plan incliné a une dérivée première non nulle mais une dérivée seconde nulle :
  // seules les vraies discontinuités (arêtes, silhouettes) deviennent des glyphes de bord.
  float dc = depth(cc);
  float dl = depth(cc - vec2(uCell.x, 0.0));
  float dr = depth(cc + vec2(uCell.x, 0.0));
  float dd = depth(cc - vec2(0.0, uCell.y));
  float du = depth(cc + vec2(0.0, uCell.y));
  float dx = dr - dl;
  float dy = du - dd;
  float ce = abs(dl + dr - 2.0 * dc) + abs(dd + du - 2.0 * dc);
  vec3 ascii = bg;
  vec2 inCell = fract(frag / uCell);
  inCell.y = 1.0 - inCell.y;
  float g = -1.0;
  float bright = 0.0;
  if (ce > 0.02) {
    float ang = mod(atan(dy, dx) + 3.14159, 3.14159);
    g = uRamp + mod(floor(ang / 0.785398 + 0.5), 4.0);
    bright = 1.0;
  } else if (c.a > 0.5) {
    g = max(1.0, floor(clamp(c.r, 0.0, 0.999) * uRamp));
    bright = mix(0.35, 1.0, c.r);
  } else if (mod(ci.x, 6.0) == 0.0 && mod(ci.y, 4.0) == 0.0) {
    g = 2.0;
    bright = 0.12;
  }
  if (g >= 0.0) {
    float a = texture2D(uAtlas, vec2((g + inCell.x) / uN, inCell.y)).r;
    ascii = bg + ink * a * bright;
  }

  // Le scan balaie l'écran : à gauche la pièce, à droite le dessin.
  float x = frag.x / uRes.x;
  float m = step(x, uScan);
  vec3 col = mix(ascii, solid, m);
  float line = exp(-abs(x - uScan) * uRes.x * 0.9);
  float halo = exp(-abs(x - uScan) * uRes.x * 0.03) * 0.18;
  float on = step(0.0001, uScan) * step(uScan, 0.9999);
  col += sig * (line + halo) * on;
  gl_FragColor = vec4(col, 1.0);
}`;

// ───── Mathématiques minimales (colonnes, comme WebGL) ─────
type M4 = Float32Array;
const m4 = () => new Float32Array(16);
function mul(a: M4, b: M4) {
  const o = m4();
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}
function perspective(fov: number, ar: number, n: number, f: number) {
  const t = 1 / Math.tan(fov / 2);
  const o = m4();
  o[0] = t / ar;
  o[5] = t;
  o[10] = (f + n) / (n - f);
  o[11] = -1;
  o[14] = (2 * f * n) / (n - f);
  return o;
}
function lookAt(e: number[], c: number[], up: number[]) {
  const z = norm([e[0] - c[0], e[1] - c[1], e[2] - c[2]]);
  const x = norm(cross(up, z));
  const y = cross(z, x);
  const o = m4();
  o.set([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]);
  return o;
}
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: number[]) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  return p;
}

export async function initFrame(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas.frame-gl')!;
  const stage = root.querySelector<HTMLElement>('.frame-stage')!;
  const labels = [...root.querySelectorAll<HTMLElement>('[data-callout]')];
  const outCount = root.querySelector<HTMLElement>('[data-out="count"]');
  const outStage = root.querySelector<HTMLElement>('[data-out="stage"]');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl || !gl.getExtension('OES_standard_derivatives')) {
    root.classList.add('is-fallback');
    return;
  }

  const [model, buf] = await Promise.all([
    fetch(root.dataset.model!).then((r) => r.json() as Promise<Model>),
    fetch(root.dataset.bin!).then((r) => r.arrayBuffer()),
  ]);

  // Géométries de base, partagées par les instances.
  const geo: Record<string, { vb: WebGLBuffer; ib: WebGLBuffer; n: number }> = {};
  for (const [name, m] of Object.entries(model.meshes)) {
    const vb = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Int16Array(buf, m.v, m.nv * 3), gl.STATIC_DRAW);
    const ib = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buf, m.i, m.ni), gl.STATIC_DRAW);
    geo[name] = { vb, ib, n: m.ni };
  }

  // Ordre et direction d'assemblage de chaque pièce.
  const ORDER: Record<string, number> = { plate: 0, standoff: 1, arm: 2, mount: 3 };
  const parts = model.parts.map((p) => {
    const M = m4();
    M.set([p.m[0], p.m[1], p.m[2], 0, p.m[3], p.m[4], p.m[5], 0, p.m[6], p.m[7], p.m[8], 0, p.m[9], p.m[10], p.m[11], 1]);
    const [cx, cy, cz] = p.centre;
    const r = Math.hypot(cx, cy) || 1;
    let off = [0, 0, 0];
    let order = ORDER[p.kind] ?? 1;
    if (p.kind === 'plate') {
      const top = cz > -10;
      off = [0, 0, top ? 120 : -95];
      order = top ? 4 : 0;
    } else if (p.kind === 'arm') off = [(cx / r) * 70, (cy / r) * 70, 26];
    else if (p.kind === 'mount') off = [(cx / r) * 95, (cy / r) * 95, p.name.includes('Haut') ? 70 : -60];
    else if (p.kind === 'standoff') off = [0, 0, 55 + r * 0.12];
    return { ...p, M, off, order, t: 0 };
  });
  const maxOrder = Math.max(...parts.map((p) => p.order));
  const centre = [0, 0, (model.min[2] + model.max[2]) / 2];
  const radius = Math.hypot(model.max[0] - model.min[0], model.max[1] - model.min[1]) / 2;

  const scene = compile(gl, SCENE_VS, SCENE_FS);
  const post = compile(gl, POST_VS, POST_FS);
  const su = (n: string) => gl.getUniformLocation(scene, n);
  const pu = (n: string) => gl.getUniformLocation(post, n);
  const aPos = gl.getAttribLocation(scene, 'aPos');
  const aQuad = gl.getAttribLocation(post, 'aPos');
  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  // Cible de rendu de la scène (luminance + profondeur encodée).
  const fbo = gl.createFramebuffer()!;
  const tex = gl.createTexture()!;
  const rbo = gl.createRenderbuffer()!;
  const atlasTex = gl.createTexture()!;
  let W = 0;
  let H = 0;
  let cell = [8, 14];

  function setupTex(t: WebGLTexture, filter: number) {
    gl!.bindTexture(gl!.TEXTURE_2D, t);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
  }

  function resize() {
    const r = Math.min(dpr(), 1.75);
    W = Math.max(1, Math.round(stage.clientWidth * r));
    H = Math.max(1, Math.round(stage.clientHeight * r));
    canvas.width = W;
    canvas.height = H;
    setupTex(tex, gl!.NEAREST);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, W, H, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindRenderbuffer(gl!.RENDERBUFFER, rbo);
    gl!.renderbufferStorage(gl!.RENDERBUFFER, gl!.DEPTH_COMPONENT16, W, H);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
    gl!.framebufferRenderbuffer(gl!.FRAMEBUFFER, gl!.DEPTH_ATTACHMENT, gl!.RENDERBUFFER, rbo);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);

    // Atlas de glyphes à la taille de cellule.
    const cw = Math.round((stage.clientWidth < 700 ? 5 : 6.5) * r);
    const ch = Math.round(cw * 1.72);
    cell = [cw, ch];
    const c = document.createElement('canvas');
    c.width = cw * GLYPHS.length;
    c.height = ch;
    const x = c.getContext('2d')!;
    x.fillStyle = '#000';
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#fff';
    x.font = `${Math.round(cw / 0.6)}px ${FONT}`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    [...GLYPHS].forEach((g, i) => x.fillText(g, i * cw + cw / 2, ch * 0.55));
    setupTex(atlasTex, gl!.LINEAR);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, c);
    dirty = true;
  }

  // ───── État piloté par le scroll et le pointeur ─────
  const still = reducedMotion();
  let progress = 0;
  let drag = 0;
  let dragV = 0;
  let dirty = true;
  let visible = false;

  function measure() {
    if (still) {
      progress = 1;
      return;
    }
    const b = root.getBoundingClientRect();
    const span = b.height - innerHeight;
    const p = clamp01(-b.top / Math.max(span, 1));
    if (p !== progress) {
      progress = p;
      dirty = true;
    }
  }

  let down = false;
  let lastX = 0;
  stage.addEventListener('pointerdown', (e) => {
    down = true;
    lastX = e.clientX;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!down) return;
    dragV = (e.clientX - lastX) * 0.006;
    drag += dragV;
    lastX = e.clientX;
    dirty = true;
  });
  const up = () => (down = false);
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);

  function project(p: number[], vp: M4) {
    const x = vp[0] * p[0] + vp[4] * p[1] + vp[8] * p[2] + vp[12];
    const y = vp[1] * p[0] + vp[5] * p[1] + vp[9] * p[2] + vp[13];
    const w = vp[3] * p[0] + vp[7] * p[1] + vp[11] * p[2] + vp[15];
    return [((x / w) * 0.5 + 0.5) * stage.clientWidth, (1 - ((y / w) * 0.5 + 0.5)) * stage.clientHeight];
  }

  let t0 = performance.now();
  function render(now: number) {
    const t = (now - t0) / 1000;
    const p = progress;
    // Chronologie : assemblage (0 → 0,55), puis scan de matérialisation (0,6 → 0,92).
    const a = clamp01((p - 0.02) / 0.53);
    const scan = still ? 1 : clamp01((p - 0.6) / 0.32);

    if (!down) {
      dragV *= 0.92;
      drag += dragV;
    }
    const az = -0.9 + p * 2.6 + drag + (still ? 0 : t * 0.05);
    const el = 0.95 - p * 0.55;
    // Cadrage : le modèle éclaté (plus large que l'assemblé) doit tenir dans le cadre.
    const fit = Math.tan(0.31) * Math.min(1, W / H);
    const dist = ((radius * (1.32 - 0.42 * a)) / fit) * (stage.clientWidth < 700 ? 0.86 : 0.82);
    const eye = [centre[0] + Math.cos(az) * Math.cos(el) * dist, centre[1] + Math.sin(az) * Math.cos(el) * dist, centre[2] + Math.sin(el) * dist];
    const view = lookAt(eye, centre, [0, 0, 1]);
    const near = dist * 0.4;
    const far = dist * 2.2;
    const proj = perspective(0.62, W / H, near, far);
    const vp = mul(proj, view);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.viewport(0, 0, W, H);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    gl!.enable(gl!.DEPTH_TEST);
    gl!.useProgram(scene);
    gl!.uniformMatrix4fv(su('uView'), false, view);
    gl!.uniformMatrix4fv(su('uProj'), false, proj);
    gl!.uniform1f(su('uNear'), near);
    gl!.uniform1f(su('uFar'), far);
    gl!.uniform1f(su('uTone'), 1.0);
    let placed = 0;
    for (const part of parts) {
      // Chaque groupe de pièces arrive à son tour, avec un léger décalage interne.
      const start = (part.order / (maxOrder + 1)) * 0.8;
      const k = ease(clamp01((a - start) / 0.28));
      if (k > 0.999) placed++;
      const off = part.off.map((o) => o * (1 - k));
      part.t = k;
      gl!.uniformMatrix4fv(su('uModel'), false, part.M);
      gl!.uniform3f(su('uOffset'), off[0], off[1], off[2]);
      const g = geo[part.mesh];
      gl!.bindBuffer(gl!.ARRAY_BUFFER, g.vb);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 3, gl!.SHORT, false, 0, 0);
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, g.ib);
      gl!.drawElements(gl!.TRIANGLES, g.n, gl!.UNSIGNED_SHORT, 0);
    }
    gl!.disable(gl!.DEPTH_TEST);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, W, H);
    gl!.useProgram(post);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, atlasTex);
    gl!.uniform1i(pu('uScene'), 0);
    gl!.uniform1i(pu('uAtlas'), 1);
    gl!.uniform2f(pu('uRes'), W, H);
    gl!.uniform2f(pu('uCell'), cell[0], cell[1]);
    gl!.uniform1f(pu('uN'), GLYPHS.length);
    gl!.uniform1f(pu('uRamp'), RAMP.length);
    gl!.uniform1f(pu('uScan'), scan);
    gl!.uniform1f(pu('uTime'), t);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quad);
    gl!.enableVertexAttribArray(aQuad);
    gl!.vertexAttribPointer(aQuad, 2, gl!.FLOAT, false, 0, 0);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    // Légendes : visibles pendant que le modèle est éclaté.
    const show = a > 0.02 && a < 0.62;
    for (const el_ of labels) {
      const part = parts.find((q) => q.name === el_.dataset.callout);
      if (!part) continue;
      const k = part.t;
      const c = part.centre.map((v, i) => v + part.off[i] * (1 - k));
      const [x, y] = project(c, vp);
      el_.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      el_.classList.toggle('is-on', show && x > 0 && x < stage.clientWidth && y > 0 && y < stage.clientHeight);
    }
    if (outCount) outCount.textContent = String(placed).padStart(2, '0');
    if (outStage) outStage.textContent = scan > 0 ? (scan >= 1 ? 'Solid' : 'Scan') : a >= 1 ? 'Assembled' : 'Assembly';
  }

  let raf = 0;
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    measure();
    if (!dirty && still) return;
    dirty = false;
    render(now);
  };
  trackVisible(root, (v) => {
    visible = v;
    if (v && !raf) raf = requestAnimationFrame(loop);
  });
  new ResizeObserver(resize).observe(stage);
  resize();
  measure();
  render(performance.now());
  root.classList.add('is-live');
}

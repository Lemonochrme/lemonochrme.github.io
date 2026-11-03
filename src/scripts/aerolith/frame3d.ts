// Châssis 3D : le modèle FreeCAD assemblé, rendu en WebGL.
// Au scroll, les 34 pièces s'assemblent pendant que la caméra tourne ; le survol identifie chaque pièce.
import { dpr, reducedMotion, trackVisible } from './glyphs';

interface Mesh { v: number; nv: number; i: number; ni: number }
interface Part { name: string; kind: string; mesh: string; m: number[]; centre: number[] }
interface Model { meshes: Record<string, Mesh>; parts: Part[]; min: number[]; max: number[] }

// Désignation de chaque famille de pièces, pour les légendes et le survol.
export const PART_INFO: Record<string, { name: string; desc: string }> = {
  plate: { name: 'Plate', desc: 'Carbon, 270 × 126 mm, ×2' },
  long: { name: 'Long arm', desc: 'Carbon truss, 190 × 28 mm, ×4' },
  short: { name: 'Short arm', desc: 'Carbon truss, 160 × 28 mm, ×4' },
  mount: { name: 'Motor mount', desc: 'Carbon, 61 × 47 mm, ×8' },
  standoff: { name: 'Standoff', desc: 'M3, ×16' },
};
const family = (p: Part) =>
  p.kind === 'arm' ? (p.name.includes('Long') ? 'long' : 'short') : p.kind;

const VS = `
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

const FS = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec3 vView;
uniform float uMetal;
uniform float uHot;
uniform float uFade;
void main() {
  vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
  vec3 v = normalize(-vView);
  vec3 key = normalize(vec3(-0.5, 0.8, 0.6));
  vec3 fill = normalize(vec3(0.8, -0.3, 0.3));
  float lam = max(dot(n, key), 0.0);
  float fil = max(dot(n, fill), 0.0);
  vec3 h = normalize(key + v);
  float nh = max(dot(n, h), 0.0);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);

  // Carbone : sombre, reflet net ; entretoises : métal clair.
  vec3 albedo = mix(vec3(0.085, 0.087, 0.094), vec3(0.55, 0.55, 0.57), uMetal);
  float spec = mix(pow(nh, 70.0) * 0.7 + pow(nh, 10.0) * 0.08, pow(nh, 30.0) * 0.9, uMetal);
  vec3 col = albedo * (0.35 + 1.45 * lam + 0.45 * fil) + vec3(spec) + vec3(0.18) * fres;

  vec3 sig = vec3(1.0, 0.231, 0.114);
  col = mix(col, sig * (0.45 + 0.75 * lam) + vec3(spec) * 0.4, uHot * 0.85);
  col = mix(vec3(0.024), col, uFade);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 1.15)), 1.0);
}`;

const POST_VS = `
attribute vec2 aQuad;
void main() { gl_Position = vec4(aQuad, 0.0, 1.0); }`;

// Passe finale : moyenne de 4 échantillons (anticrénelage) et arêtes fines tirées de la profondeur.
const POST_FS = `
precision highp float;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uRes;
uniform vec2 uSrc;
uniform float uNear;
uniform float uFar;
float lin(vec2 uv) {
  float z = texture2D(uDepth, uv).r * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
}
float edge(vec2 uv) {
  vec2 px = 1.0 / uSrc;
  float c = lin(uv);
  float l = lin(uv - vec2(px.x, 0.0));
  float r = lin(uv + vec2(px.x, 0.0));
  float d = lin(uv - vec2(0.0, px.y));
  float u = lin(uv + vec2(0.0, px.y));
  float lap = abs(l + r - 2.0 * c) + abs(d + u - 2.0 * c);
  return smoothstep(0.6, 2.4, lap / max(c, 1.0) * 200.0);
}
void main() {
  vec3 ink = vec3(0.914, 0.906, 0.886);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec2 o = vec2(i == 1 || i == 3 ? 0.25 : -0.25, i >= 2 ? 0.25 : -0.25);
    vec2 uv = (gl_FragCoord.xy + o) / uRes;
    vec3 c = texture2D(uColor, uv).rgb;
    acc += mix(c, ink * 0.62, edge(uv) * 0.75);
  }
  gl_FragColor = vec4(acc * 0.25, 1.0);
}`;

const ID_FS = `
precision mediump float;
uniform float uId;
void main() { gl_FragColor = vec4(uId / 255.0, 0.0, 0.0, 1.0); }`;

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
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: number[]) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
function lookAt(e: number[], c: number[], up: number[]) {
  const z = norm([e[0] - c[0], e[1] - c[1], e[2] - c[2]]);
  const x = norm(cross(up, z));
  const y = cross(z, x);
  const o = m4();
  o.set([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]);
  return o;
}
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
  const tip = root.querySelector<HTMLElement>('.frame-tip')!;
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

  // Ordre et direction d'arrivée de chaque pièce.
  const parts = model.parts.map((p) => {
    const M = m4();
    M.set([p.m[0], p.m[1], p.m[2], 0, p.m[3], p.m[4], p.m[5], 0, p.m[6], p.m[7], p.m[8], 0, p.m[9], p.m[10], p.m[11], 1]);
    const [cx, cy, cz] = p.centre;
    const r = Math.hypot(cx, cy) || 1;
    let off = [0, 0, 0];
    let order = 1;
    if (p.kind === 'plate') {
      const top = cz > -10;
      off = [0, 0, top ? 130 : -100];
      order = top ? 4 : 0;
    } else if (p.kind === 'arm') {
      off = [(cx / r) * 80, (cy / r) * 80, 30];
      order = 2;
    } else if (p.kind === 'mount') {
      off = [(cx / r) * 110, (cy / r) * 110, p.name.includes('Haut') ? 75 : -65];
      order = 3;
    } else {
      off = [0, 0, 60 + r * 0.12];
      order = 1;
    }
    return { ...p, M, off, order, fam: family(p), t: 0 };
  });
  const maxOrder = Math.max(...parts.map((p) => p.order));
  const centre = [0, 0, (model.min[2] + model.max[2]) / 2];
  const radius = Math.hypot(model.max[0] - model.min[0], model.max[1] - model.min[1]) / 2;

  const depthExt = gl.getExtension('WEBGL_depth_texture');
  if (!depthExt) {
    root.classList.add('is-fallback');
    return;
  }
  const prog = compile(gl, VS, FS);
  const idProg = compile(gl, VS, ID_FS);
  const post = compile(gl, POST_VS, POST_FS);
  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const sceneFbo = gl.createFramebuffer()!;
  const colorTex = gl.createTexture()!;
  const depthTex = gl.createTexture()!;
  let SW = 1;
  let SH = 1;
  const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);

  // Cible de sélection : on y dessine l'indice de chaque pièce.
  const pickFbo = gl.createFramebuffer()!;
  const pickTex = gl.createTexture()!;
  const pickDepth = gl.createRenderbuffer()!;
  let PW = 1;
  let PH = 1;
  let W = 1;
  let H = 1;

  function resize() {
    const r = Math.min(dpr(), 2);
    W = Math.max(1, Math.round(stage.clientWidth * r));
    H = Math.max(1, Math.round(stage.clientHeight * r));
    canvas.width = W;
    canvas.height = H;
    // Scène sur-échantillonnée, ramenée à la taille de l'écran dans la passe finale.
    const ss = r < 1.5 ? 2 : 1.5;
    SW = Math.min(Math.round(W * ss), 4096);
    SH = Math.min(Math.round(H * ss), 4096);
    for (const [t, filter] of [[colorTex, gl!.LINEAR], [depthTex, gl!.NEAREST]] as const) {
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    }
    gl!.bindTexture(gl!.TEXTURE_2D, colorTex);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, SW, SH, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindTexture(gl!.TEXTURE_2D, depthTex);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.DEPTH_COMPONENT, SW, SH, 0, gl!.DEPTH_COMPONENT, gl!.UNSIGNED_INT, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, sceneFbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, colorTex, 0);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.DEPTH_ATTACHMENT, gl!.TEXTURE_2D, depthTex, 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    PW = Math.max(1, Math.round(stage.clientWidth / 2));
    PH = Math.max(1, Math.round(stage.clientHeight / 2));
    gl!.bindTexture(gl!.TEXTURE_2D, pickTex);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, PW, PH, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindRenderbuffer(gl!.RENDERBUFFER, pickDepth);
    gl!.renderbufferStorage(gl!.RENDERBUFFER, gl!.DEPTH_COMPONENT16, PW, PH);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, pickFbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, pickTex, 0);
    gl!.framebufferRenderbuffer(gl!.FRAMEBUFFER, gl!.DEPTH_ATTACHMENT, gl!.RENDERBUFFER, pickDepth);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    dirty = true;
  }

  // ───── État : scroll, glisser, survol ─────
  const still = reducedMotion();
  let progress = 0;
  let drag = 0;
  let dragV = 0;
  let dirty = true;
  let visible = false;
  let hot = -1;
  let pointer: { x: number; y: number } | null = null;
  let needPick = false;

  function measure() {
    if (still) {
      progress = 1;
      return;
    }
    const b = root.getBoundingClientRect();
    const p = clamp01(-b.top / Math.max(b.height - innerHeight, 1));
    if (p !== progress) {
      progress = p;
      dirty = true;
    }
  }

  let down = false;
  let lastX = 0;
  let moved = 0;
  stage.addEventListener('pointerdown', (e) => {
    down = true;
    moved = 0;
    lastX = e.clientX;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    const b = stage.getBoundingClientRect();
    pointer = { x: e.clientX - b.left, y: e.clientY - b.top };
    if (down) {
      dragV = (e.clientX - lastX) * 0.006;
      drag += dragV;
      moved += Math.abs(e.clientX - lastX);
      lastX = e.clientX;
    } else needPick = true;
    dirty = true;
  });
  const release = (e: PointerEvent) => {
    down = false;
    // Un appui sans glisser sélectionne la pièce (utile au toucher).
    if (moved < 4) {
      const b = stage.getBoundingClientRect();
      pointer = { x: e.clientX - b.left, y: e.clientY - b.top };
      needPick = true;
      dirty = true;
    }
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', () => (down = false));
  stage.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = null;
    setHot(-1);
  });

  function setHot(i: number) {
    if (i === hot) return;
    hot = i;
    dirty = true;
    if (i < 0) {
      tip.classList.remove('is-on');
      return;
    }
    const info = PART_INFO[parts[i].fam];
    tip.innerHTML = `<b>${info.name}</b><span>${info.desc}</span>`;
    tip.classList.add('is-on');
  }

  function project(p: number[], vp: M4) {
    const x = vp[0] * p[0] + vp[4] * p[1] + vp[8] * p[2] + vp[12];
    const y = vp[1] * p[0] + vp[5] * p[1] + vp[9] * p[2] + vp[13];
    const w = vp[3] * p[0] + vp[7] * p[1] + vp[11] * p[2] + vp[15];
    return [((x / w) * 0.5 + 0.5) * stage.clientWidth, (1 - ((y / w) * 0.5 + 0.5)) * stage.clientHeight];
  }

  function drawParts(program: WebGLProgram, view: M4, proj: M4, ids: boolean) {
    gl!.useProgram(program);
    gl!.uniformMatrix4fv(U(program, 'uView'), false, view);
    gl!.uniformMatrix4fv(U(program, 'uProj'), false, proj);
    const aPos = gl!.getAttribLocation(program, 'aPos');
    parts.forEach((part, i) => {
      const off = part.off.map((o) => o * (1 - part.t));
      gl!.uniformMatrix4fv(U(program, 'uModel'), false, part.M);
      gl!.uniform3f(U(program, 'uOffset'), off[0], off[1], off[2]);
      if (ids) gl!.uniform1f(U(program, 'uId'), i + 1);
      else {
        gl!.uniform1f(U(program, 'uMetal'), part.kind === 'standoff' ? 1 : 0);
        gl!.uniform1f(U(program, 'uHot'), hot >= 0 && parts[hot].fam === part.fam ? (i === hot ? 1 : 0.45) : 0);
        gl!.uniform1f(U(program, 'uFade'), 0.25 + 0.75 * clamp01(part.t * 1.4 + 0.2));
      }
      const g = geo[part.mesh];
      gl!.bindBuffer(gl!.ARRAY_BUFFER, g.vb);
      gl!.enableVertexAttribArray(aPos);
      gl!.vertexAttribPointer(aPos, 3, gl!.SHORT, false, 0, 0);
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, g.ib);
      gl!.drawElements(gl!.TRIANGLES, g.n, gl!.UNSIGNED_SHORT, 0);
    });
  }

  const t0 = performance.now();
  function render(now: number) {
    const t = (now - t0) / 1000;
    const p = progress;
    const a = clamp01((p - 0.04) / 0.56);
    if (!down) {
      dragV *= 0.93;
      drag += dragV;
    }
    const az = -0.75 + p * 2.4 + drag + (still ? 0 : t * 0.04);
    const el = 0.62 - p * 0.3;
    const fit = Math.tan(0.31) * Math.min(1, W / H);
    const dist = ((radius * (1.3 - 0.4 * a)) / fit) * (stage.clientWidth < 700 ? 1.15 : 0.85);
    const eye = [
      centre[0] + Math.cos(az) * Math.cos(el) * dist,
      centre[1] + Math.sin(az) * Math.cos(el) * dist,
      centre[2] + Math.sin(el) * dist,
    ];
    const view = lookAt(eye, centre, [0, 0, 1]);
    const near = dist * 0.3;
    const far = dist * 2.5;
    const proj = perspective(0.62, W / H, near, far);
    const vp = mul(proj, view);

    let placed = 0;
    for (const part of parts) {
      const start = (part.order / (maxOrder + 1)) * 0.8;
      part.t = ease(clamp01((a - start) / 0.3));
      if (part.t > 0.999) placed++;
    }

    gl!.enable(gl!.DEPTH_TEST);
    if (needPick && pointer) {
      needPick = false;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, pickFbo);
      gl!.viewport(0, 0, PW, PH);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      drawParts(idProg, view, proj, true);
      const px = new Uint8Array(4);
      const x = Math.floor((pointer.x / stage.clientWidth) * PW);
      const y = PH - 1 - Math.floor((pointer.y / stage.clientHeight) * PH);
      gl!.readPixels(x, y, 1, 1, gl!.RGBA, gl!.UNSIGNED_BYTE, px);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      setHot(px[0] - 1);
    }

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, sceneFbo);
    gl!.viewport(0, 0, SW, SH);
    gl!.clearColor(0.024, 0.024, 0.024, 1);
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    drawParts(prog, view, proj, false);
    gl!.disable(gl!.DEPTH_TEST);

    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, W, H);
    gl!.useProgram(post);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, colorTex);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, depthTex);
    gl!.uniform1i(U(post, 'uColor'), 0);
    gl!.uniform1i(U(post, 'uDepth'), 1);
    gl!.uniform2f(U(post, 'uRes'), W, H);
    gl!.uniform2f(U(post, 'uSrc'), SW, SH);
    gl!.uniform1f(U(post, 'uNear'), near);
    gl!.uniform1f(U(post, 'uFar'), far);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, quad);
    const aQuad = gl!.getAttribLocation(post, 'aQuad');
    gl!.enableVertexAttribArray(aQuad);
    gl!.vertexAttribPointer(aQuad, 2, gl!.FLOAT, false, 0, 0);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);

    if (hot >= 0 && pointer) tip.style.transform = `translate(${pointer.x + 16}px, ${pointer.y + 14}px)`;

    // Légendes : une par famille, visibles tant que le modèle est éclaté.
    const show = a > 0.02 && a < 0.7 && hot < 0;
    for (const el_ of labels) {
      const part = parts.find((q) => q.name === el_.dataset.callout);
      if (!part) continue;
      const c = part.centre.map((v, i) => v + part.off[i] * (1 - part.t));
      const [x, y] = project(c, vp);
      // Près du bord droit, la légende passe à gauche de son repère.
      const flip = x + el_.offsetWidth > stage.clientWidth - 8;
      el_.classList.toggle('is-left', flip);
      el_.style.transform = `translate(${(flip ? x - el_.offsetWidth : x).toFixed(1)}px, ${y.toFixed(1)}px)`;
      el_.classList.toggle('is-on', show && x > 0 && x < stage.clientWidth && y > 0 && y < stage.clientHeight);
    }
    if (outCount) outCount.textContent = String(placed).padStart(2, '0');
    if (outStage) outStage.textContent = placed === parts.length ? 'Assembled' : 'Assembly';
  }

  let raf = 0;
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    measure();
    if (still && !dirty) return;
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

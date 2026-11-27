/**
 * Geodesic sphere rendered on a 2D canvas.
 * - Assembles from scattered panels on load
 * - Follows the pointer (tilt), can be dragged to spin (with inertia)
 * - Panels open up on hover, letting the core light leak through the gaps
 * Pauses when off-screen; renders a single static frame with reduced motion.
 */

type Vec3 = [number, number, number];
type RGB = [number, number, number];

const PALETTE = {
  deep: [14, 22, 21] as RGB,
  shade: [22, 58, 58] as RGB,
  tealGlow: [95, 212, 200] as RGB,
  mint: [209, 232, 226] as RGB,
  beige: [217, 176, 140] as RGB,
  peach: [255, 203, 154] as RGB,
};

const normalize = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function icosphere(subdivisions: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: Vec3[] = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as Vec3[]
  ).map(normalize);

  let faces: number[][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  for (let s = 0; s < subdivisions; s++) {
    const cache = new Map<string, number>();
    const midpoint = (a: number, b: number) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      const va = verts[a];
      const vb = verts[b];
      verts.push(normalize([(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2, (va[2] + vb[2]) / 2]));
      cache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    faces = faces.flatMap(([a, b, c]) => {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
    });
  }
  return { verts, faces };
}

export function initSphere(canvas: HTMLCanvasElement, host: HTMLElement = canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phones/tablets: lower canvas resolution and fewer light passes
  const lite = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const { verts, faces } = icosphere(2);
  const rand = mulberry32(18);
  const warmDir = normalize([-0.55, 0.55, 0.6]);
  const lightDir = normalize([-0.45, 0.6, 0.75]);

  const faceData = faces.map((idx) => {
    const c = normalize([
      verts[idx[0]][0] + verts[idx[1]][0] + verts[idx[2]][0],
      verts[idx[0]][1] + verts[idx[1]][1] + verts[idx[2]][1],
      verts[idx[0]][2] + verts[idx[1]][2] + verts[idx[2]][2],
    ]);
    const warmth = dot(c, warmDir);
    const lit = (warmth > 0.42 && rand() > 0.3) || rand() < 0.035;
    return { idx, lit, phase: rand() * Math.PI * 2, lift: 0.4 + rand() * 0.9, scatter: 0.6 + rand() * 1.4 };
  });

  const rays = Array.from({ length: 7 }, (_, i) => ({
    angle: (i / 7) * Math.PI * 2 + rand() * 0.6,
    length: 2.2 + rand() * 1.6,
    width: 0.025 + rand() * 0.04,
    alpha: 0.12 + rand() * 0.18,
  }));

  // Ambient dust motes drifting slowly upwards (positions normalised 0..1)
  type Mote = { x: number; y: number; r: number; speed: number; phase: number; warm: boolean };
  let dust: Mote[] = [];
  const seedDust = () => {
    const count = Math.min(lite ? 28 : 70, Math.round((width * height) / 20000));
    dust = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.3,
      speed: 4 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      warm: Math.random() < 0.18,
    }));
  };

  const rotated: Vec3[] = verts.map(() => [0, 0, 0]);
  const order = faceData.map((_, i) => i);
  const depth = new Float32Array(faceData.length);

  // State
  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let R = 0;
  let rotY = 0.6;
  let velY = 0.18;
  const autoVel = 0.18;
  let tiltX = 0.32;
  let tiltY = 0;
  let targetTiltX = 0.32;
  let targetTiltY = 0;
  let hover = 0;
  let targetHover = 0;
  let dragging = false;
  let lastPointerX = 0;
  let running = false;
  let visible = true;
  let rafId = 0;
  let last = performance.now();
  const start = last;

  // Gradients depend only on size/position → built once per resize, not every frame
  let haloGrad: CanvasGradient | null = null;
  let coreGrad: CanvasGradient | null = null;
  let rayGrads: CanvasGradient[] = [];

  const buildGradients = () => {
    haloGrad = ctx.createRadialGradient(cx, cy, R * 1.18, cx, cy, R * 1.6);
    haloGrad.addColorStop(0, rgba(PALETTE.tealGlow, 0));
    haloGrad.addColorStop(0.45, rgba(PALETTE.tealGlow, 0.09));
    haloGrad.addColorStop(1, rgba(PALETTE.tealGlow, 0));

    coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
    coreGrad.addColorStop(0, rgba([255, 255, 255], 0.95));
    coreGrad.addColorStop(0.12, rgba(PALETTE.mint, 0.75));
    coreGrad.addColorStop(0.35, rgba(PALETTE.tealGlow, 0.35));
    coreGrad.addColorStop(1, rgba(PALETTE.tealGlow, 0));

    // Rays are drawn in a local frame (pointing along +x) and rotated into place
    rayGrads = rays.map((ray) => {
      const g = ctx.createLinearGradient(0, 0, R * ray.length, 0);
      g.addColorStop(0, rgba(PALETTE.mint, ray.alpha));
      g.addColorStop(0.35, rgba(PALETTE.tealGlow, ray.alpha * 0.5));
      g.addColorStop(1, rgba(PALETTE.tealGlow, 0));
      return g;
    });
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (width >= 960) {
      cx = width * 0.66;
      cy = height * 0.5;
      R = Math.min(width * 0.17, height * 0.26);
    } else {
      cx = width * 0.5;
      cy = height * 0.3;
      R = Math.min(width * 0.28, height * 0.15);
    }
    buildGradients();
    seedDust();
    if (!running) draw(performance.now());
  };

  const drawDust = (t: number, dt: number, intro: number) => {
    for (const m of dust) {
      if (!reduceMotion) {
        m.y -= (m.speed * dt) / height;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
      }
      const twinkle = 0.5 + 0.5 * Math.sin(t * 1.4 + m.phase);
      ctx.fillStyle = rgba(m.warm ? PALETTE.peach : PALETTE.mint, (0.12 + twinkle * 0.38) * intro);
      ctx.beginPath();
      ctx.arc(m.x * width, m.y * height, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawHalo = (t: number, intro: number) => {
    ctx.globalAlpha = intro;
    ctx.fillStyle = haloGrad!;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(PALETTE.mint, 0.16 * intro);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.48, 0, Math.PI * 2);
    ctx.stroke();

    // HUD rings
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.05);
    ctx.setLineDash([2, 9]);
    ctx.strokeStyle = rgba(PALETTE.mint, 0.22 * intro);
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.rotate(-t * 0.12);
    ctx.strokeStyle = rgba(PALETTE.peach, 0.5 * intro);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.82, a, a + 0.22);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawRays = (t: number, strength: number) => {
    if (strength <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, strength);
    ctx.translate(cx, cy);
    rays.forEach((ray, i) => {
      const len = R * ray.length;
      const w = R * ray.width;
      ctx.save();
      ctx.rotate(ray.angle + t * 0.025);
      ctx.fillStyle = rayGrads[i];
      ctx.beginPath();
      ctx.moveTo(0, 1.5);
      ctx.lineTo(len, w);
      ctx.lineTo(len, -w);
      ctx.lineTo(0, -1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  };

  const drawCore = (strength: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, strength);
    ctx.fillStyle = coreGrad!;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function draw(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = (now - start) / 1000;
    const intro = reduceMotion ? 1 : easeOutCubic(clamp01((t - 0.2) / 2));

    if (!reduceMotion) {
      if (!dragging) velY += (autoVel - velY) * Math.min(1, dt * 1.5);
      rotY += velY * dt;
      tiltX += (targetTiltX - tiltX) * Math.min(1, dt * 3);
      tiltY += (targetTiltY - tiltY) * Math.min(1, dt * 3);
      hover += (targetHover - hover) * Math.min(1, dt * 4);
    }

    const cosY = Math.cos(rotY + tiltY);
    const sinY = Math.sin(rotY + tiltY);
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);

    for (let i = 0; i < verts.length; i++) {
      const [x, y, z] = verts[i];
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const r = rotated[i];
      r[0] = x1;
      r[1] = y2;
      r[2] = z2;
    }

    for (let i = 0; i < faceData.length; i++) {
      const [a, b, c] = faceData[i].idx;
      depth[i] = rotated[a][2] + rotated[b][2] + rotated[c][2];
    }
    order.sort((i, j) => depth[i] - depth[j]);

    ctx.clearRect(0, 0, width, height);
    drawDust(t, dt, intro);
    drawHalo(t, intro);
    drawRays(t, intro);
    drawCore(intro * (0.85 + hover * 0.25));

    const D = 3.4;
    const shrink = 0.86 - hover * 0.06;
    const pts: [number, number][] = [[0, 0], [0, 0], [0, 0]];

    for (const fi of order) {
      const f = faceData[fi];
      const va = rotated[f.idx[0]];
      const vb = rotated[f.idx[1]];
      const vc = rotated[f.idx[2]];
      const centroid: Vec3 = [
        (va[0] + vb[0] + vc[0]) / 3,
        (va[1] + vb[1] + vc[1]) / 3,
        (va[2] + vb[2] + vc[2]) / 3,
      ];
      const n = normalize(centroid);
      const breathe = reduceMotion ? 0 : 0.018 * (Math.sin(t * 0.9 + f.phase) * 0.5 + 0.5);
      const explode = (1 - intro) * 1.6 * f.scatter + breathe + hover * 0.16 * f.lift;

      for (let k = 0; k < 3; k++) {
        const v = k === 0 ? va : k === 1 ? vb : vc;
        const px = centroid[0] + (v[0] - centroid[0]) * shrink + n[0] * explode;
        const py = centroid[1] + (v[1] - centroid[1]) * shrink + n[1] * explode;
        const pz = centroid[2] + (v[2] - centroid[2]) * shrink + n[2] * explode;
        const s = D / (D - pz);
        pts[k][0] = cx + px * R * s;
        pts[k][1] = cy - py * R * s;
      }

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.lineTo(pts[2][0], pts[2][1]);
      ctx.closePath();

      const facing = n[2];
      const alpha = intro;

      if (facing < 0) {
        ctx.fillStyle = rgba(PALETTE.shade, 0.18 * alpha);
        ctx.fill();
        ctx.strokeStyle = rgba(PALETTE.tealGlow, 0.12 * alpha);
        ctx.lineWidth = 0.8;
        ctx.stroke();
        continue;
      }

      const light = Math.max(0, dot(n, lightDir));
      let fill = mix(PALETTE.deep, PALETTE.shade, 0.15 + light * 0.85);
      if (f.lit) {
        const pulse = reduceMotion ? 0.8 : 0.6 + 0.4 * Math.sin(t * 1.2 + f.phase);
        fill = mix(fill, mix(PALETTE.beige, PALETTE.peach, light), pulse * (0.55 + light * 0.45));
      }
      ctx.fillStyle = rgba(fill, 0.95 * alpha);
      ctx.fill();
      ctx.strokeStyle = f.lit
        ? rgba(PALETTE.peach, 0.55 * alpha)
        : rgba(PALETTE.tealGlow, (0.22 + facing * 0.35) * alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Light spilling over the front panels (skipped on mobile — full-screen additive blending is costly)
    if (!lite) drawRays(t + 3, intro * (0.35 + hover * 0.5));
  }

  const loop = (now: number) => {
    draw(now);
    rafId = requestAnimationFrame(loop);
  };

  const play = () => {
    if (running || reduceMotion || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  // Interaction
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetTiltX = 0.32 + ((y - cy) / height) * 0.6;
    targetTiltY = ((x - cx) / width) * 0.8;
    targetHover = Math.hypot(x - cx, y - cy) < R * 1.35 ? 1 : 0;

    if (dragging) {
      velY = (e.clientX - lastPointerX) * 0.12;
      rotY += (e.clientX - lastPointerX) * 0.008;
      lastPointerX = e.clientX;
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (Math.hypot(e.clientX - rect.left - cx, e.clientY - rect.top - cy) > R * 1.4) return;
    dragging = true;
    lastPointerX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };
  const onPointerUp = (e: PointerEvent) => {
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = '';
  };
  const onLeave = () => {
    targetHover = 0;
    targetTiltX = 0.32;
    targetTiltY = 0;
  };

  if (!reduceMotion) {
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  resize();
  play();
}

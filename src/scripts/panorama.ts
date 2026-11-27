/**
 * Minimal equirectangular 360° viewer (WebGL2, single full-screen triangle).
 * - Loads the texture only when the viewer approaches the viewport
 * - Drag / arrow keys to look around, gentle auto-rotation when idle
 * - Exposes the current heading as --heading (deg) on the host for a compass UI
 * Falls back to a flat background image when WebGL2 is unavailable.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform float uYaw;
uniform float uPitch;
uniform float uFov;
uniform float uAspect;
out vec4 outColor;
const float PI = 3.141592653589793;

void main() {
  float t = tan(uFov * 0.5);
  vec3 d = normalize(vec3(vUv.x * t * uAspect, vUv.y * t, -1.0));

  float cp = cos(uPitch), sp = sin(uPitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);

  float cy = cos(uYaw), sy = sin(uYaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);

  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  vec2 uv = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);

  vec3 col = textureLod(uTex, uv, 0.0).rgb;

  // soft vignette for a lens-like feel
  float v = 1.0 - 0.28 * dot(vUv * 0.75, vUv * 0.75);
  outColor = vec4(col * v, 1.0);
}`;

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
};

export function initPanorama(host: HTMLElement) {
  const canvas = host.querySelector('canvas')!;
  const src = host.dataset.src!;
  const startYaw = Number(host.dataset.startYaw ?? 0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  const fallback = () => {
    host.classList.add('is-fallback');
    host.style.backgroundImage = `url(${src})`;
  };
  if (!gl || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096) return fallback();

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link');
  } catch {
    return fallback();
  }

  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {
    yaw: gl.getUniformLocation(program, 'uYaw'),
    pitch: gl.getUniformLocation(program, 'uPitch'),
    fov: gl.getUniformLocation(program, 'uFov'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
  };

  // View state
  let yaw = startYaw;
  let pitch = -0.04;
  let velYaw = 0;
  let velPitch = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idleSince = performance.now();
  let loaded = false;
  let running = false;
  let visible = false;
  let raf = 0;
  let last = performance.now();
  let width = 1;
  let height = 1;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    width = r.width;
    height = r.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (loaded && !running) render();
  };

  const fov = () => (width / height < 1 ? 1.45 : 1.15); // wider on portrait screens

  const render = () => {
    gl.uniform1f(u.yaw, yaw);
    gl.uniform1f(u.pitch, pitch);
    gl.uniform1f(u.fov, fov());
    gl.uniform1f(u.aspect, width / height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const heading = ((((yaw - startYaw) * 180) / Math.PI) % 360 + 360) % 360;
    host.style.setProperty('--heading', `${heading.toFixed(1)}deg`);
  };

  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!dragging) {
      // inertia, then gentle auto-rotation after 2.5s idle
      yaw += velYaw;
      pitch += velPitch;
      velYaw *= 0.92;
      velPitch *= 0.92;
      if (!reduceMotion && now - idleSince > 2500) yaw += 0.05 * dt;
    }
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
    render();
    raf = requestAnimationFrame(loop);
  };

  const play = () => {
    if (running || !loaded || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const load = () => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      loaded = true;
      host.classList.add('is-loaded');
      resize();
      render();
      play();
    };
    img.onerror = fallback;
    img.src = src;
  };

  // Interaction
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velYaw = velPitch = 0;
    canvas.setPointerCapture(e.pointerId);
    host.classList.add('is-dragging', 'has-interacted');
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const k = fov() / height;
    const dx = (e.clientX - lastX) * k;
    const dy = (e.clientY - lastY) * k;
    yaw -= dx;
    pitch += dy;
    velYaw = -dx;
    velPitch = dy;
    lastX = e.clientX;
    lastY = e.clientY;
    idleSince = performance.now();
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    idleSince = performance.now();
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    host.classList.remove('is-dragging');
  };
  const onKey = (e: KeyboardEvent) => {
    const step = 0.12;
    if (e.key === 'ArrowLeft') yaw -= step;
    else if (e.key === 'ArrowRight') yaw += step;
    else if (e.key === 'ArrowUp') pitch += step;
    else if (e.key === 'ArrowDown') pitch -= step;
    else return;
    e.preventDefault();
    idleSince = performance.now();
    host.classList.add('has-interacted');
    if (!running) render();
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('keydown', onKey);

  new ResizeObserver(resize).observe(canvas);

  // Lazy-load when close to the viewport; pause rendering when off-screen
  const loader = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        loader.disconnect();
        load();
      }
    },
    { rootMargin: '600px 0px' },
  );
  loader.observe(host);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  }).observe(host);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
}

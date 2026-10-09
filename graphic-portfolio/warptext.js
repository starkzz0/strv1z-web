// WarpText — vanilla port of the React Bits glass-warp typography component.
// Renders text into a WebGL texture with ambient warp + pointer lensing (OGL).
// Used for the hero STRV1Z wordmark (#heroWarp); auto-inits on load.
// No-WebGL or init failure → the .warp-fallback wordmark stays visible.
// DEPS: ogl via importmap (see index.html). No build step.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uRipple;
uniform float uMotion;

in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);

  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  float rippleRing = (rippleWave - 0.5) * uRipple;
  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;
  pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;

  vec2 displaced = uv + ambient + pointerWarp;
  vec2 splitDir = ambient + pointerWarp;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);

  vec4 base = sampleText(displaced);
  float r = sampleText(displaced + split).r;
  float g = base.g;
  float b = sampleText(displaced - split).b;
  float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);

  vec3 color = vec3(r, g, b) + lens * base.a * 0.055;
  fragColor = vec4(color, a);
}
`;

const getFontValue = value => (typeof value === 'number' ? `${value}px` : value);

const measureLine = (ctx, line, letterSpacing) => {
  const chars = Array.from(line);
  const textWidth = chars.reduce((width, char) => width + ctx.measureText(char).width, 0);
  return textWidth + Math.max(0, chars.length - 1) * letterSpacing;
};

const drawLine = (ctx, line, x, y, letterSpacing) => {
  const chars = Array.from(line);
  let cursor = x - measureLine(ctx, line, letterSpacing) / 2;

  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);
  });
};

const buildTextCanvas = ({ container, width, height, dpr, props }) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const probe = document.createElement('span');
  probe.textContent = props.text;
  Object.assign(probe.style, {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    whiteSpace: 'pre',
    inset: '0 auto auto 0',
    fontFamily: props.fontFamily,
    fontSize: getFontValue(props.fontSize),
    fontWeight: String(props.fontWeight),
    letterSpacing: getFontValue(props.letterSpacing),
    lineHeight: typeof props.lineHeight === 'number' ? String(props.lineHeight) : props.lineHeight
  });
  container.appendChild(probe);
  const computed = window.getComputedStyle(probe);
  let fontSizePx = parseFloat(computed.fontSize) || 96;
  const fontFamily = computed.fontFamily || 'sans-serif';
  const fontWeight = computed.fontWeight || String(props.fontWeight);
  let letterSpacing = computed.letterSpacing === 'normal' ? 0 : parseFloat(computed.letterSpacing) || 0;
  let lineHeight = parseFloat(computed.lineHeight);
  if (!Number.isFinite(lineHeight)) {
    lineHeight = fontSizePx * (typeof props.lineHeight === 'number' ? props.lineHeight : 0.92);
  }
  probe.remove();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = props.color;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const lines = String(props.text || '').split('\n');
  const applyFont = () => {
    ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  };
  applyFont();

  const maxWidth = width * 0.86;
  const maxHeight = height * 0.78;
  const widest = Math.max(...lines.map(line => measureLine(ctx, line, letterSpacing)), 1);
  const blockHeight = Math.max(lineHeight * lines.length, 1);
  const fit = Math.min(1, maxWidth / widest, maxHeight / blockHeight);

  if (fit < 1) {
    fontSizePx *= fit;
    letterSpacing *= fit;
    lineHeight *= fit;
    applyFont();
  }

  const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
  lines.forEach((line, index) => drawLine(ctx, line, width / 2, startY + index * lineHeight, letterSpacing));

  return canvas;
};

const syncUniforms = (program, props) => {
  const uniforms = program.uniforms;
  uniforms.uWarpStrength.value = props.warpStrength;
  uniforms.uWarpScale.value = props.warpScale;
  uniforms.uSpeed.value = props.speed;
  uniforms.uPointerInfluence.value = props.pointerInfluence;
  uniforms.uPointerStrength.value = props.pointerStrength;
  uniforms.uRefraction.value = props.refraction;
  uniforms.uRipple.value = props.ripple ? 1 : 0;
};

const DEFAULTS = {
  text: 'STRV1Z',
  color: '#E9E6DE',
  warpStrength: 0.08,
  warpScale: 1.7,
  speed: 0.55,
  pointerInfluence: 0.42,
  pointerStrength: 0.38,
  refraction: 0.018,
  ripple: true,
  fontSize: 'clamp(3rem, 10vw, 9rem)',
  fontWeight: 800,
  fontFamily: 'inherit',
  letterSpacing: '-0.06em',
  lineHeight: 0.9
};

function initWarpText(container, props) {
  const P = Object.assign({}, DEFAULTS, props);
  if (!container || typeof window === 'undefined') return () => {};
  // phones: cap GL resolution lower — same look, cheaper fill rate
  const maxDpr = Math.min(window.devicePixelRatio || 1, matchMedia('(max-width: 700px)').matches ? 1.5 : 2);

  let renderer;
  let gl;
  let program;
  let geometry;
  let mesh;
  let texture;
  let resizeObserver;
  let intersectionObserver;
  let raf = 0;
  let disposed = false;
  let contextLost = false;
  let visible = true;
  let pageVisible = !document.hidden;
  let live = false;
  let reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let rasterVersion = 0;

  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };
  const startTime = performance.now();

  function destroy() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    canvasRemove();
    function canvasRemove() {
      const cv = container.querySelector('canvas');
      if (cv) {
        cv.removeEventListener('pointermove', onPointerMove);
        cv.removeEventListener('pointerleave', onPointerLeave);
        cv.removeEventListener('webglcontextlost', onContextLost);
        if (cv.parentNode === container) container.removeChild(cv);
      }
    }
    document.removeEventListener('visibilitychange', onVisibility);
    mediaQuery?.removeEventListener('change', onReducedMotion);
    if (!contextLost && gl) {
      try {
        if (texture?.texture) gl.deleteTexture(texture.texture);
        geometry?.remove?.();
        program?.remove?.();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (error) {
        void error;
      }
    }
  }

  let canvas;
  function onPointerMove(event) {
    // touch included: finger drags bend the text too (listener is passive,
    // so page scroll keeps working while the lens follows the finger)
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    pointer.tx = (event.clientX - rect.left) / rect.width;
    pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
    pointer.activeTarget = 1;
  }
  function onPointerLeave() {
    pointer.activeTarget = 0;
  }
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function onVisibility() {
    pageVisible = !document.hidden;
    if (pageVisible && visible && !raf) raf = requestAnimationFrame(loop);
    if (!pageVisible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }
  const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  function onReducedMotion(event) {
    reduceMotion = event.matches;
    if (program) {
      program.uniforms.uMotion.value = reduceMotion ? 0 : 1;
      renderOnce();
    }
  }

  try {
    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      dpr: maxDpr
    });
    gl = renderer.gl;
  } catch (error) {
    console.warn('WarpText: WebGL could not be initialized.', error);
    return () => {};
  }

  function renderOnce() {
    if (disposed || contextLost) return;
    renderer.render({ scene: mesh });
    // first successful frame: hide the static fallback wordmark for good
    if (!live) {
      live = true;
      container.classList.add('is-live');
      const fb = container.parentElement && container.parentElement.querySelector('.warp-fallback');
      if (fb) fb.hidden = true;
    }
  }

  async function rasterize() {
    const version = ++rasterVersion;
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch (error) {
        void error;
      }
    }
    if (disposed || contextLost || version !== rasterVersion) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const textCanvas = buildTextCanvas({
      container,
      width: rect.width,
      height: rect.height,
      dpr: maxDpr,
      props: P
    });
    container._warpCanvas = textCanvas; // debug hook: verify raster in console
    texture.image = textCanvas;
    texture.needsUpdate = true;
    renderOnce();
  }

  function resize() {
    if (disposed || contextLost) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    renderer.dpr = maxDpr;
    renderer.setSize(rect.width, rect.height);
    program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
    program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
    rasterize();
  }

  function loop(now) {
    if (disposed || contextLost) return;

    const elapsed = (now - startTime) * 0.001;
    const idleX = 0.5 + Math.sin(elapsed * 0.33) * 0.12;
    const idleY = 0.5 + Math.cos(elapsed * 0.27) * 0.1;
    const targetX = pointer.activeTarget > 0 ? pointer.tx : idleX;
    const targetY = pointer.activeTarget > 0 ? pointer.ty : idleY;
    const damping = pointer.activeTarget > 0 ? 0.12 : 0.035;

    pointer.x += (targetX - pointer.x) * damping;
    pointer.y += (targetY - pointer.y) * damping;
    pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.18) - pointer.active) * 0.06;

    program.uniforms.uPointer.value[0] = pointer.x;
    program.uniforms.uPointer.value[1] = pointer.y;
    program.uniforms.uPointerActive.value = reduceMotion ? pointer.active * 0.35 : pointer.active;
    program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;

    renderOnce();
    raf = requestAnimationFrame(loop);
  }

  gl.clearColor(0, 0, 0, 0);
  canvas = gl.canvas;
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  texture = new Texture(gl, {
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE
  });

  geometry = new Triangle(gl);
  program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTextTexture: { value: texture },
      uResolution: { value: new Float32Array([1, 1]) },
      uPointer: { value: new Float32Array([0.5, 0.5]) },
      uPointerActive: { value: 0 },
      uTime: { value: 0 },
      uWarpStrength: { value: P.warpStrength },
      uWarpScale: { value: P.warpScale },
      uSpeed: { value: P.speed },
      uPointerInfluence: { value: P.pointerInfluence },
      uPointerStrength: { value: P.pointerStrength },
      uRefraction: { value: P.refraction },
      uRipple: { value: P.ripple ? 1 : 0 },
      uMotion: { value: reduceMotion ? 0 : 1 }
    }
  });
  mesh = new Mesh(gl, { geometry, program });

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && pageVisible && !raf) raf = requestAnimationFrame(loop);
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(container);

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('webglcontextlost', onContextLost, false);
  document.addEventListener('visibilitychange', onVisibility);
  mediaQuery?.addEventListener('change', onReducedMotion);

  syncUniforms(program, P);
  resize();
  raf = requestAnimationFrame(loop);

  return destroy;
}

// hero STRV1Z wordmark — restrained glass warp in brand ink, self-hosted grotesk.
// (TUNE: warpStrength/speed/pointerStrength here; everything else is the component.)
const heroWarp = document.getElementById('heroWarp');
if (heroWarp) initWarpText(heroWarp, {
  text: 'STRV1Z',
  color: '#E9E6DE',
  fontFamily: "'Neue Montreal','Inter Tight',sans-serif",
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 0.95,
  fontSize: 'clamp(6rem, 22vw, 20rem)', // monumental: ~975px wordmark desktop, edge-to-edge mobile via auto-fit
  warpStrength: 0.22,
  warpScale: 1.5,
  speed: 0.6,
  pointerInfluence: 0.5,
  pointerStrength: 0.5,
  refraction: 0.04,
  ripple: true
});

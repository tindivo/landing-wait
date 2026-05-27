precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

varying vec2 vUv;

const vec3 COLOR_A = vec3(0.976, 0.451, 0.086); // #F97316 brand
const vec3 COLOR_B = vec3(0.918, 0.345, 0.047); // #EA580C brand-hover
const vec3 COLOR_C = vec3(0.984, 0.749, 0.141); // #FBBF24 brand-glow
const vec3 BACKGROUND = vec3(0.980, 0.965, 0.945); // #FAF6F1 surface

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return value;
}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  vec2 uv = vUv;
  vec2 st = uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  st.x *= aspect;

  float t = u_time * 0.085;
  vec2 mouseInfluence = (u_mouse - 0.5) * 0.28;

  vec2 q = vec2(
    fbm(st + vec2(0.0, t) + mouseInfluence),
    fbm(st + vec2(t * 1.3, -t * 0.5))
  );

  vec2 r = vec2(
    fbm(st + 1.8 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(st + 1.8 * q + vec2(8.3, 2.8) + 0.126 * t)
  );

  float n = fbm(st + 2.4 * r);
  float pattern = smoothstep(-0.6, 0.9, n);

  vec3 c1 = mix(COLOR_B, COLOR_A, smoothstep(0.05, 0.55, n + 0.5));
  vec3 c2 = mix(c1, COLOR_C, pow(pattern, 1.6) * 0.9);
  vec3 color = mix(BACKGROUND, c2, smoothstep(0.18, 0.72, pattern));

  float radial = distance(uv, u_mouse * 0.5 + vec2(0.25));
  color += COLOR_C * (1.0 - smoothstep(0.0, 0.8, radial)) * 0.08;

  float grain = hash(gl_FragCoord.xy + u_time * 0.6) - 0.5;
  color += grain * 0.025;

  float vignette = smoothstep(1.05, 0.35, distance(uv, vec2(0.5)));
  color *= mix(0.92, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}

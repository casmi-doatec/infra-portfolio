import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import ForestBackdrop from './ForestBackdrop'
import AutumnLeaves from './AutumnLeaves'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x),
      mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.0, 9.0);
      a *= 0.5;
    }
    return v;
  }

  // Soft vertical trunks: one optional trunk per cell, slightly leaning and tapering.
  float trunks(float x, float y, float density, float width, float soft, float seed) {
    float gx = x * density;
    float cell = floor(gx);
    float f = fract(gx);
    float present = step(0.32, hash(cell * 1.7 + seed));
    float center = 0.2 + 0.6 * hash(cell * 3.1 + seed + 1.0);
    float w = width * (0.5 + hash(cell * 5.3 + seed + 2.0));
    w *= 1.0 + (0.5 - y) * 0.18;
    float lean = (hash(cell * 7.9 + seed + 3.0) - 0.5) * 0.12 * (y - 0.5);
    float d = abs(f - center - lean);
    return present * (1.0 - smoothstep(w * 0.5 - soft, w * 0.5 + soft, d));
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float x = uv.x * uAspect;

    vec3 top    = vec3(0.780, 0.840, 0.910);
    vec3 mid    = vec3(0.880, 0.920, 0.960);
    vec3 low    = vec3(0.840, 0.890, 0.940);
    vec3 bottom = vec3(0.760, 0.820, 0.890);

    vec3 col = mix(bottom, low, smoothstep(0.0, 0.25, uv.y));
    col = mix(col, mid, smoothstep(0.25, 0.55, uv.y));
    col = mix(col, top, smoothstep(0.55, 1.0, uv.y));

    vec2 gp = vec2(x - 0.68 * uAspect, uv.y - 0.78);
    float glowPulse = 0.9 + 0.1 * sin(t * 0.21);
    col += vec3(1.0, 1.0, 1.0) * 0.22 * glowPulse * exp(-dot(gp, gp) * 2.2);

    // Slow, non-repeating camera drift shared by all layers, scaled by depth.
    float drift = sin(t * 0.035) * 0.6 + sin(t * 0.013 + 1.3) * 0.4;

    float far = trunks(x + drift * 0.02, uv.y, 9.0, 0.28, 0.10, 11.0);
    col = mix(col, vec3(0.660, 0.740, 0.840), far * 0.40);

    float band = exp(-pow((uv.y - 0.42) / 0.22, 2.0));
    float fog = fbm(vec2(x * 1.4 + t * 0.020, uv.y * 3.0 - t * 0.004));
    col = mix(col, vec3(0.970, 0.980, 1.000), band * smoothstep(0.35, 0.85, fog) * 0.45);

    float midT = trunks(x + drift * 0.05, uv.y, 3.6, 0.22, 0.07, 23.0);
    col = mix(col, vec3(0.480, 0.580, 0.710), midT * 0.55);

    float r = x + uv.y * 0.45;
    float ray = smoothstep(0.62, 1.0, noise(vec2(r * 2.6 + t * 0.015, 0.5)));
    ray *= 0.7 + 0.3 * sin(t * 0.37 + r * 4.0);
    ray *= smoothstep(0.0, 0.9, uv.y);
    col += vec3(1.0, 1.0, 1.0) * ray * 0.10;

    float canopy = fbm(vec2(x * 2.2 + sin(t * 0.08) * 0.15, uv.y * 4.0 + t * 0.01));
    col = mix(col, vec3(0.600, 0.690, 0.800), smoothstep(0.72, 1.0, uv.y) * canopy * 0.5);

    float groundBand = exp(-pow((uv.y - 0.10) / 0.12, 2.0));
    float groundFog = fbm(vec2(x * 1.1 - t * 0.016, uv.y * 2.0 + 4.0));
    col = mix(col, vec3(0.970, 0.980, 1.000), groundBand * smoothstep(0.3, 0.8, groundFog) * 0.40);

    float near = trunks(x + drift * 0.12, uv.y, 1.5, 0.22, 0.05, 37.0);
    col = mix(col, vec3(0.330, 0.420, 0.550), near * 0.55);

    vec2 vp = (uv - 0.5) * vec2(uAspect, 1.0) / max(uAspect, 1.0);
    col *= 1.0 - 0.15 * smoothstep(0.30, 0.80, length(vp));

    vec3 page = vec3(0.933, 0.953, 0.973);
    col = mix(page, col, 0.6);

    col += (hash2(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`

function ForestShader() {
  const material = useRef()
  const size = useThree(state => state.size)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAspect: { value: 1 } }), [])

  useFrame((_, dt) => {
    const u = material.current.uniforms
    u.uTime.value += Math.min(dt, 0.05)
    u.uAspect.value = size.width / size.height
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function ForestScene() {
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  if (reduced) return <ForestBackdrop />

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
    >
      <ForestShader />
      <AutumnLeaves />
    </Canvas>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // Sky gradient matching site palette
    vec3 top    = vec3(0.780, 0.840, 0.910);
    vec3 mid    = vec3(0.880, 0.920, 0.960);
    vec3 low    = vec3(0.840, 0.890, 0.940);
    vec3 bottom = vec3(0.760, 0.820, 0.890);

    vec3 col = mix(bottom, low, smoothstep(0.0, 0.25, uv.y));
    col = mix(col, mid, smoothstep(0.25, 0.55, uv.y));
    col = mix(col, top, smoothstep(0.55, 1.0, uv.y));

    // Subtle glow (upper right)
    float x = uv.x * uAspect;
    vec2 gp = vec2(x - 0.68 * uAspect, uv.y - 0.78);
    float glowPulse = 0.9 + 0.1 * sin(t * 0.21);
    col += vec3(1.0, 1.0, 1.0) * 0.22 * glowPulse * exp(-dot(gp, gp) * 2.2);

    // Vignette
    vec2 vp = (uv - 0.5) * vec2(uAspect, 1.0) / max(uAspect, 1.0);
    col *= 1.0 - 0.12 * smoothstep(0.30, 0.80, length(vp));

    // Blend toward page background
    vec3 page = vec3(0.933, 0.953, 0.973);
    col = mix(page, col, 0.6);

    // Dither
    col += (hash2(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function ForestSky() {
  const matRef = useRef()
  const size = useThree(state => state.size)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAspect: { value: 1 },
  }), [])

  useFrame((_, dt) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value += Math.min(dt, 0.05)
    matRef.current.uniforms.uAspect.value = size.width / size.height
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

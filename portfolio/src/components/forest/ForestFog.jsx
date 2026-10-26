import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fogVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fogFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uFogColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.0, 9.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float t = uTime;
    vec2 uv = vUv;

    // FBM-driven fog density
    float n = fbm(vec2(uv.x * 3.0 + t * 0.02, uv.y * 2.0 - t * 0.005));

    // Vertical alpha gradient: dense at bottom, fading upward
    float vertGrad = 1.0 - smoothstep(0.0, 0.8, uv.y);

    // Edge fade
    float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);

    float alpha = vertGrad * smoothstep(0.3, 0.7, n) * 0.55 * edgeFade;

    gl_FragColor = vec4(uFogColor, alpha);
  }
`

export default function ForestFog({ fogColor, density = 0.045 }) {
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uFogColor: { value: fogColor.clone() },
  }), [fogColor])

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += Math.min(dt, 0.05)
    }
  })

  return (
    <>
      {/* Scene-wide exponential fog */}
      <fogExp2 attach="fog" args={[fogColor, density]} />

      {/* Ground-level animated fog plane */}
      <mesh
        position={[0, 1.0, -8]}
        rotation={[0, 0, 0]}
        frustumCulled={false}
      >
        <planeGeometry args={[60, 8]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

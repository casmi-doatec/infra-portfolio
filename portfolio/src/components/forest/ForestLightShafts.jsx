import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from './forestConfig'

const shaftVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const shaftFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uOpacity;
  uniform vec3 uColor;

  void main() {
    // Vertical gradient: brightest at top, fading down
    float grad = smoothstep(0.0, 0.6, vUv.y);
    // Horizontal: bell-curve centered
    float horiz = exp(-pow((vUv.x - 0.5) / 0.25, 2.0));
    float alpha = grad * horiz * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function LightShaft({ position, rotation, width, height, phase, speed }) {
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uOpacity: { value: 0 },
    uColor: { value: COLORS.lightShaft.clone() },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const t = clock.getElapsedTime()
    const opacity = 0.06 + 0.04 * Math.sin(t * speed + phase)
    matRef.current.uniforms.uOpacity.value = opacity
  })

  return (
    <mesh position={position} rotation={rotation} frustumCulled={false}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={shaftVertexShader}
        fragmentShader={shaftFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function ForestLightShafts({ count = 6 }) {
  const shafts = useMemo(() => {
    const result = []
    for (let i = 0; i < count; i++) {
      const x = -8 + (i / (count - 1)) * 16 + (Math.sin(i * 3.7) * 2)
      const z = -5 - Math.random() * 15
      result.push({
        position: [x, 6, z],
        rotation: [0, 0, (Math.random() - 0.5) * 0.15],
        width: 1.5 + Math.random() * 2,
        height: 12 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
      })
    }
    return result
  }, [count])

  return (
    <group>
      {shafts.map((s, i) => (
        <LightShaft key={i} {...s} />
      ))}
    </group>
  )
}

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from './forestConfig'

export default function ForestParticles({ count = 120 }) {
  const pointsRef = useRef()

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]     = (Math.random() - 0.5) * 30
      pos[i3 + 1] = Math.random() * 10
      pos[i3 + 2] = -2 - Math.random() * 25
      vel[i3]     = (Math.random() - 0.5) * 0.02
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005
      vel[i3 + 2] = (Math.random() - 0.5) * 0.01
    }
    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((_, dt) => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array
    const clampedDt = Math.min(dt, 0.05)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]     += velocities[i3] * clampedDt * 60
      pos[i3 + 1] += velocities[i3 + 1] * clampedDt * 60
      pos[i3 + 2] += velocities[i3 + 2] * clampedDt * 60

      // Drift wind
      pos[i3] += Math.sin(pos[i3 + 1] * 0.5 + clampedDt) * 0.002

      // Reset if out of bounds
      if (pos[i3 + 1] > 12 || pos[i3 + 1] < -1) {
        pos[i3]     = (Math.random() - 0.5) * 30
        pos[i3 + 1] = Math.random() * 10
        pos[i3 + 2] = -2 - Math.random() * 25
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.dust}
        size={0.05}
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

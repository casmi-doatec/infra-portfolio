import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const lookTarget = new THREE.Vector3(0, 2, -15)

export default function CameraDrift() {
  const camera = useThree(state => state.camera)
  const timeRef = useRef(0)

  useFrame((_, dt) => {
    timeRef.current += Math.min(dt, 0.05)
    const t = timeRef.current

    // Slow sinusoidal drift matching the original shader pattern
    const driftX = Math.sin(t * 0.035) * 0.6 + Math.sin(t * 0.013 + 1.3) * 0.3
    const driftY = Math.sin(t * 0.025 + 0.7) * 0.15

    camera.position.x = driftX * 0.3
    camera.position.y = 2.5 + driftY
    camera.lookAt(lookTarget)
  })

  return null
}

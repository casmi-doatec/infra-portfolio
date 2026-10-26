import { useMemo } from 'react'
import * as THREE from 'three'
import { COLORS } from './forestConfig'

export default function ForestGround() {
  const material = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: COLORS.ground,
      side: THREE.DoubleSide,
    })
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, -10]}
      receiveShadow
    >
      <planeGeometry args={[80, 60]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import ForestBackdrop from './ForestBackdrop'
import AutumnLeaves from './AutumnLeaves'
import ForestSky from './forest/ForestSky'
import ForestTrees from './forest/ForestTrees'
import ForestGround from './forest/ForestGround'
import ForestFog from './forest/ForestFog'
import ForestLightShafts from './forest/ForestLightShafts'
import ForestParticles from './forest/ForestParticles'
import CameraDrift from './forest/CameraDrift'
import { COLORS, QUALITY, detectQuality } from './forest/forestConfig'

export default function ForestScene() {
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const quality = useMemo(() => detectQuality(), [])
  const preset = QUALITY[quality]

  if (reduced) return <ForestBackdrop />

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      camera={{ position: [0, 2.5, 8], fov: 50 }}
      dpr={preset.dpr}
      gl={{ antialias: true, alpha: false }}
      performance={{ min: 0.5 }}
    >
      {/* Sky gradient background (fullscreen quad) */}
      <ForestSky />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#c8d4e8" />
      <directionalLight position={[5, 8, 3]} intensity={1.2} color="#fff4e0" />
      <hemisphereLight args={['#d8e2ee', '#505850', 0.4]} />

      {/* 3D Forest elements */}
      <ForestTrees qualityScale={preset.layerScale} />
      <ForestGround />

      {/* Atmosphere */}
      <ForestFog fogColor={COLORS.fog} density={preset.fogDensity} />
      {preset.lightShaftCount > 0 && (
        <ForestLightShafts count={preset.lightShaftCount} />
      )}
      <ForestParticles count={preset.particleCount} />

      {/* Falling leaves */}
      <AutumnLeaves />

      {/* Camera animation */}
      <CameraDrift />
    </Canvas>
  )
}

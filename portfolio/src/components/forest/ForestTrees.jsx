import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, LAYERS } from './forestConfig'
import { buildLayerTemplates } from './treeGeometry'

function mulberry32(seed) {
  let s = seed | 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Wind sway shader injection
const windVertexPreamble = /* glsl */ `
  attribute float aWindSeed;
  uniform float uTime;
  uniform float uWindStrength;
`

const windVertexTransform = /* glsl */ `
  float windT = uTime * 0.8 + aWindSeed * 6.28;
  float sway = sin(windT) * 0.02 + sin(windT * 1.7 + 1.3) * 0.01;
  float heightFactor = max(0.0, transformed.y) * 0.15;
  transformed.x += sway * heightFactor * uWindStrength;
  transformed.z += sway * 0.5 * heightFactor * uWindStrength;
`

function TreeLayer({ layerKey, qualityScale = 1 }) {
  const config = LAYERS[layerKey]
  const count = Math.max(1, Math.round(config.count * qualityScale))
  const trunkColor = COLORS.trunk[layerKey]
  const canopyColor = COLORS.canopy[layerKey]

  const trunkRef = useRef()
  const canopyRef = useRef()
  const timeRef = useRef(0)

  const { templates, trunkGeo, canopyGeo, windSeeds } = useMemo(() => {
    const tmpls = buildLayerTemplates(config, 5, layerKey.charCodeAt(0) * 100)
    // Pick first template for instanced mesh geometry
    const tGeo = tmpls[0].trunk
    const cGeo = tmpls[0].canopy

    const seeds = new Float32Array(count)
    const rand = mulberry32(layerKey.charCodeAt(0) * 777)
    for (let i = 0; i < count; i++) seeds[i] = rand()

    return { templates: tmpls, trunkGeo: tGeo, canopyGeo: cGeo, windSeeds: seeds }
  }, [layerKey, count, config])

  const trunkMat = useMemo(() => {
    const mat = new THREE.MeshLambertMaterial({ color: trunkColor })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uWindStrength = { value: 1.0 }
      shader.vertexShader = windVertexPreamble + '\n' + shader.vertexShader
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' + windVertexTransform,
      )
      mat.userData.shader = shader
    }
    return mat
  }, [trunkColor])

  const canopyMat = useMemo(() => {
    const mat = new THREE.MeshLambertMaterial({ color: canopyColor })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uWindStrength = { value: 1.0 }
      shader.vertexShader = windVertexPreamble + '\n' + shader.vertexShader
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' + windVertexTransform,
      )
      mat.userData.shader = shader
    }
    return mat
  }, [canopyColor])

  // Set up instanced positions
  useEffect(() => {
    const rand = mulberry32(layerKey.charCodeAt(0) * 999)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * config.xSpread
      const z = config.zMin + rand() * (config.zMax - config.zMin)
      const scaleY = 0.7 + rand() * 0.6
      const rotY = rand() * Math.PI * 2

      dummy.position.set(x, 0, z)
      dummy.rotation.set(0, rotY, 0)
      dummy.scale.set(1, scaleY, 1)
      dummy.updateMatrix()

      if (trunkRef.current) trunkRef.current.setMatrixAt(i, dummy.matrix)
      if (canopyRef.current) canopyRef.current.setMatrixAt(i, dummy.matrix)
    }

    if (trunkRef.current) {
      trunkRef.current.instanceMatrix.needsUpdate = true
      // Add wind seed attribute
      const seedAttr = new THREE.InstancedBufferAttribute(windSeeds, 1)
      trunkRef.current.geometry.setAttribute('aWindSeed', seedAttr)
    }
    if (canopyRef.current) {
      canopyRef.current.instanceMatrix.needsUpdate = true
      const seedAttr = new THREE.InstancedBufferAttribute(windSeeds, 1)
      canopyRef.current.geometry.setAttribute('aWindSeed', seedAttr)
    }
  }, [count, config, layerKey, windSeeds])

  useFrame((_, dt) => {
    timeRef.current += Math.min(dt, 0.05)
    const t = timeRef.current
    if (trunkMat.userData.shader) trunkMat.userData.shader.uniforms.uTime.value = t
    if (canopyMat.userData.shader) canopyMat.userData.shader.uniforms.uTime.value = t
  })

  // Cleanup
  useEffect(() => () => {
    trunkMat.dispose()
    canopyMat.dispose()
  }, [trunkMat, canopyMat])

  if (!trunkGeo || !canopyGeo) return null

  return (
    <group>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeo, trunkMat, count]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={canopyRef}
        args={[canopyGeo, canopyMat, count]}
        frustumCulled={false}
      />
    </group>
  )
}

export default function ForestTrees({ qualityScale = 1 }) {
  return (
    <group>
      <TreeLayer layerKey="far" qualityScale={qualityScale} />
      <TreeLayer layerKey="mid" qualityScale={qualityScale} />
      <TreeLayer layerKey="near" qualityScale={qualityScale} />
      <TreeLayer layerKey="fg" qualityScale={qualityScale} />
    </group>
  )
}

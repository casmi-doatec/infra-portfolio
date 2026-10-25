import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

const PALETTES = [
  { base: '#d9a63a', light: '#f0c868', edge: '#8a5a1c' },
  { base: '#b9822f', light: '#d9a552', edge: '#6b4219' },
  { base: '#c4b04e', light: '#ddd07a', edge: '#7a6a24' },
  { base: '#9a6a34', light: '#bb8a52', edge: '#553515' },
]

function leafPath(ctx, widthScale) {
  const cx = 128
  const s = widthScale
  ctx.beginPath()
  ctx.moveTo(cx, 16)
  ctx.bezierCurveTo(cx + 46 * s, 58, cx + 74 * s, 122, cx + 42 * s, 186)
  ctx.bezierCurveTo(cx + 27 * s, 214, cx + 10 * s, 228, cx, 232)
  ctx.bezierCurveTo(cx - 10 * s, 228, cx - 27 * s, 214, cx - 42 * s, 186)
  ctx.bezierCurveTo(cx - 74 * s, 122, cx - 46 * s, 58, cx, 16)
  ctx.closePath()
}

function makeLeafTexture(palette, widthScale, seed) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  let r = seed
  const rand = () => ((r = (r * 16807) % 2147483647) / 2147483647)

  ctx.strokeStyle = palette.edge
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(128, 228)
  ctx.quadraticCurveTo(131, 242, 126, 254)
  ctx.stroke()

  ctx.save()
  leafPath(ctx, widthScale)
  ctx.clip()

  const g = ctx.createRadialGradient(128, 120, 10, 128, 130, 130)
  g.addColorStop(0, palette.light)
  g.addColorStop(0.55, palette.base)
  g.addColorStop(1, palette.edge)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)

  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.05)' : 'rgba(255,240,200,0.05)'
    ctx.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1 + rand() * 2)
  }

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(90, 50, 15, ${0.12 + rand() * 0.18})`
    ctx.beginPath()
    ctx.arc(70 + rand() * 116, 50 + rand() * 160, 2 + rand() * 6, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(255, 238, 190, 0.45)'
  ctx.lineWidth = 2.6
  ctx.beginPath()
  ctx.moveTo(128, 230)
  ctx.quadraticCurveTo(126, 120, 128, 22)
  ctx.stroke()

  ctx.lineWidth = 1.3
  ctx.strokeStyle = 'rgba(255, 238, 190, 0.30)'
  for (let i = 0; i < 7; i++) {
    const y = 196 - i * 24
    const reach = (70 - Math.abs(i - 3) * 9) * widthScale
    ctx.beginPath()
    ctx.moveTo(128, y)
    ctx.quadraticCurveTo(128 + reach * 0.5, y - 10, 128 + reach, y - 30)
    ctx.moveTo(128, y)
    ctx.quadraticCurveTo(128 - reach * 0.5, y - 10, 128 - reach, y - 30)
    ctx.stroke()
  }
  ctx.restore()

  leafPath(ctx, widthScale)
  ctx.strokeStyle = palette.edge
  ctx.globalAlpha = 0.7
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function makeCurvedLeafGeometry() {
  const geo = new THREE.PlaneGeometry(1, 1, 10, 10)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    pos.setZ(i, -0.22 * (2 * x) ** 2 + 0.06 * Math.sin((y + 0.5) * Math.PI))
  }
  geo.computeVertexNormals()
  return geo
}

const noise = createNoise2D()
const rnd = (a, b) => a + Math.random() * (b - a)

function resetLeaf(s, vp) {
  s.x = rnd(-vp.width * 0.45, vp.width * 0.45)
  s.y = vp.height / 2 + 0.8
  s.z = rnd(-1.5, 0.8)
  s.seed = Math.random() * 1000
  s.theta = Math.random() * Math.PI * 2
  s.omega = rnd(0.45, 0.8)
  s.swing = rnd(0.28, 0.5)
  s.fall = rnd(0.45, 0.6)
  s.pitch = rnd(0.25, 0.55)
  s.yaw = rnd(-0.5, 0.5)
  s.yawFreq = rnd(0.15, 0.35)
  s.flip = 0
  s.size = rnd(0.6, 0.85)
}

function Leaf({ texture, geometry, initialDelay }) {
  const mesh = useRef()
  const vp = useThree(state => state.viewport)
  const s = useRef({ waiting: initialDelay, t: 0 }).current

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const m = mesh.current

    if (s.waiting > 0) {
      s.waiting -= dt
      m.visible = false
      if (s.waiting <= 0) resetLeaf(s, vp)
      return
    }
    m.visible = true
    s.t += dt

    const wind = noise(s.t * 0.07, s.seed)
    s.theta += s.omega * (1 + 0.25 * noise(s.t * 0.13, s.seed + 9)) * dt

    const glide = Math.cos(s.theta)
    s.x += (s.swing * glide + wind * 0.12) * dt
    s.y -= s.fall * (0.4 + 0.8 * Math.abs(glide)) * dt

    if (noise(s.t * 0.05, s.seed + 21) > 0.6) s.flip += 2.4 * dt

    m.position.set(s.x, s.y, s.z)
    m.rotation.set(
      s.pitch + 0.35 * glide + s.flip,
      s.yaw + 0.6 * Math.sin(s.t * s.yawFreq * Math.PI * 2),
      -0.8 * Math.sin(s.theta) + 0.15 * wind,
    )
    m.scale.setScalar(s.size)

    if (s.y < -vp.height / 2 - 0.8) s.waiting = rnd(3, 10)
  })

  return (
    <mesh ref={mesh} geometry={geometry} visible={false}>
      <meshStandardMaterial
        map={texture}
        alphaTest={0.4}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0}
      />
    </mesh>
  )
}

function Scene() {
  const geometry = useMemo(() => makeCurvedLeafGeometry(), [])
  const textures = useMemo(
    () => PALETTES.map((p, i) => makeLeafTexture(p, 0.85 + (i % 2) * 0.25, 1234 + i * 977)),
    [],
  )

  useEffect(() => () => {
    geometry.dispose()
    textures.forEach(t => t.dispose())
  }, [geometry, textures])

  const slots = useMemo(
    () => [[0.5, 1.5], [5, 9], [11, 17]].map(([a, b]) => ({
      delay: rnd(a, b),
      texture: textures[Math.floor(Math.random() * textures.length)],
    })),
    [textures],
  )

  return (
    <>
      <ambientLight intensity={1.1} color="#ffe9c4" />
      <directionalLight position={[2, 4, 8]} intensity={1.6} color="#ffe2b0" />
      {slots.map((slot, i) => (
        <Leaf key={i} texture={slot.texture} geometry={geometry} initialDelay={slot.delay} />
      ))}
    </>
  )
}

export default function AutumnLeaves() {
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  if (reduced) return null

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <Scene />
    </Canvas>
  )
}

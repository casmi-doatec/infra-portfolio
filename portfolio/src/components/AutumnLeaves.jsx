import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

const PALETTES = [
  { light: '#f07a3a', base: '#c8321e', edge: '#7a1610' },
  { light: '#dc5a3e', base: '#b52222', edge: '#661010' },
  { light: '#f6a04a', base: '#d4502a', edge: '#8a2a12' },
  { light: '#d85050', base: '#a81c2c', edge: '#5e0e18' },
]

const CX = 128
const CY = 146
const R = 104
const LOBES = [[-135, 0.42], [-90, 0.72], [-45, 0.92], [0, 1], [45, 0.92], [90, 0.72], [135, 0.42]]

const toRad = d => (d * Math.PI) / 180
const polar = (deg, r) => [CX + r * Math.sin(toRad(deg)), CY - r * Math.cos(toRad(deg))]

function lobeEdge(points, a, b, tip) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  let nx = -(b[1] - a[1]) / len
  let ny = (b[0] - a[0]) / len
  const dx = tip[0] - CX
  const dy = tip[1] - CY
  const dl = Math.hypot(dx, dy)
  const mx = (a[0] + b[0]) / 2 - CX
  const my = (a[1] + b[1]) / 2 - CY
  const along = (mx * dx + my * dy) / dl
  if (nx * (mx - (dx / dl) * along) + ny * (my - (dy / dl) * along) < 0) {
    nx = -nx
    ny = -ny
  }
  const steps = 18
  for (let i = 1; i <= steps; i++) {
    const u = i / steps
    const saw = (u * 7) % 1
    const tooth = u > 0.08 && u < 0.94 ? (saw < 0.5 ? saw : 1 - saw) * 6 : 0
    const off = Math.sin(Math.PI * u) * len * 0.14 + tooth
    points.push([a[0] + (b[0] - a[0]) * u + nx * off, a[1] + (b[1] - a[1]) * u + ny * off])
  }
}

function mapleOutline(rand) {
  const tips = LOBES.map(([deg, l]) => polar(deg, R * l * (0.94 + rand() * 0.1)))
  const sinus = [polar(180, R * 0.08)]
  for (let i = 0; i < LOBES.length - 1; i++) {
    sinus.push(polar((LOBES[i][0] + LOBES[i + 1][0]) / 2, R * (0.27 + rand() * 0.06)))
  }
  sinus.push(polar(180, R * 0.08))

  const points = [sinus[0]]
  tips.forEach((tip, i) => {
    lobeEdge(points, sinus[i], tip, tip)
    lobeEdge(points, tip, sinus[i + 1], tip)
  })
  return { points, tips }
}

function tracePath(ctx, points) {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1])
  ctx.closePath()
}

function makeLeafTexture(palette, seed) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  let r = seed
  const rand = () => ((r = (r * 16807) % 2147483647) / 2147483647)
  const { points, tips } = mapleOutline(rand)

  ctx.strokeStyle = palette.edge
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(CX, CY)
  ctx.quadraticCurveTo(CX + 4, CY + 60, CX - 2, 252)
  ctx.stroke()

  ctx.save()
  tracePath(ctx, points)
  ctx.clip()

  const g = ctx.createRadialGradient(CX, CY, 6, CX, CY - 10, R)
  g.addColorStop(0, palette.light)
  g.addColorStop(0.5, palette.base)
  g.addColorStop(1, palette.edge)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)

  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,220,190,0.05)'
    ctx.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1 + rand() * 2)
  }

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = `rgba(60, 10, 8, ${0.12 + rand() * 0.18})`
    ctx.beginPath()
    ctx.arc(70 + rand() * 116, 60 + rand() * 120, 2 + rand() * 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.lineCap = 'round'
  tips.forEach(([tx, ty]) => {
    ctx.strokeStyle = 'rgba(255, 200, 170, 0.38)'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(CX, CY)
    ctx.lineTo(tx, ty)
    ctx.stroke()
  })
  ctx.restore()

  tracePath(ctx, points)
  ctx.strokeStyle = palette.edge
  ctx.globalAlpha = 0.75
  ctx.lineWidth = 1.6
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
    () => PALETTES.map((p, i) => makeLeafTexture(p, 1234 + i * 977)),
    [],
  )

  useEffect(() => () => {
    geometry.dispose()
    textures.forEach(t => t.dispose())
  }, [geometry, textures])

  const slots = useMemo(
    () => [[0.5, 1.5], [4, 7], [9, 13], [15, 20]].map(([a, b], i) => ({
      delay: rnd(a, b),
      texture: textures[i % textures.length],
    })),
    [textures],
  )

  return (
    <>
      <ambientLight intensity={1.0} color="#e4ecff" />
      <directionalLight position={[2, 4, 8]} intensity={1.5} color="#fff1dd" />
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

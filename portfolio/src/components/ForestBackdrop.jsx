import { useEffect, useRef } from 'react'

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function trunk(ctx, x, w, h, color, rand) {
  const lean = (rand() - 0.5) * w * 0.6
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x - w * 0.42 + lean, 0)
  ctx.lineTo(x + w * 0.42 + lean, 0)
  ctx.lineTo(x + w * 0.55, h)
  ctx.lineTo(x - w * 0.55, h)
  ctx.closePath()
  ctx.fill()
}

function paint(canvas) {
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const rand = mulberry32(7)

  const base = ctx.createLinearGradient(0, 0, 0, h)
  base.addColorStop(0, '#231d10')
  base.addColorStop(0.45, '#4a3c1e')
  base.addColorStop(0.75, '#33280f')
  base.addColorStop(1, '#16110a')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, w, h)

  const glow = ctx.createRadialGradient(w * 0.68, h * 0.22, 0, w * 0.68, h * 0.22, w * 0.6)
  glow.addColorStop(0, 'rgba(214, 176, 98, 0.45)')
  glow.addColorStop(1, 'rgba(214, 176, 98, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 46; i++) {
    trunk(ctx, rand() * w, 3 + rand() * 8, h, `rgba(96, 80, 48, ${0.25 + rand() * 0.2})`, rand)
  }

  const fog = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.85)
  fog.addColorStop(0, 'rgba(190, 160, 100, 0)')
  fog.addColorStop(0.5, 'rgba(190, 160, 100, 0.16)')
  fog.addColorStop(1, 'rgba(190, 160, 100, 0)')
  ctx.fillStyle = fog
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 16; i++) {
    trunk(ctx, rand() * w, 14 + rand() * 20, h, `rgba(44, 34, 18, ${0.55 + rand() * 0.2})`, rand)
  }

  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 5; i++) {
    const x = w * (0.35 + rand() * 0.6)
    const spread = 40 + rand() * 90
    const ray = ctx.createLinearGradient(x, 0, x - w * 0.25, h)
    ray.addColorStop(0, 'rgba(235, 205, 140, 0.10)')
    ray.addColorStop(1, 'rgba(235, 205, 140, 0)')
    ctx.fillStyle = ray
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + spread, 0)
    ctx.lineTo(x - w * 0.25 + spread * 2.5, h)
    ctx.lineTo(x - w * 0.25, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'

  for (let i = 0; i < 220; i++) {
    const r = 20 + rand() * 70
    ctx.fillStyle = rand() < 0.5
      ? `rgba(70, 56, 22, ${0.08 + rand() * 0.12})`
      : `rgba(150, 110, 40, ${0.05 + rand() * 0.08})`
    ctx.beginPath()
    ctx.arc(rand() * w, rand() * h * 0.28, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < 420; i++) {
    ctx.fillStyle = `rgba(${150 + rand() * 60}, ${100 + rand() * 40}, ${40 + rand() * 20}, ${0.10 + rand() * 0.15})`
    ctx.beginPath()
    ctx.ellipse(rand() * w, h * (0.86 + rand() * 0.14), 3 + rand() * 6, 1.5 + rand() * 2.5, rand() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  const nearXs = [0.03, 0.14, 0.88, 0.97, 0.5 + (rand() - 0.5) * 0.3]
  nearXs.forEach(fx => trunk(ctx, fx * w, 50 + rand() * 60, h, 'rgba(16, 11, 5, 0.88)', rand))

  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, w, h)
}

export default function ForestBackdrop() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    paint(canvas)
    let timer
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => paint(canvas), 200)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="forest-backdrop" aria-hidden="true" />
}

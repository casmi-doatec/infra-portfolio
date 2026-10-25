import { useEffect, useRef } from 'react'

// Natural green leaf colors — not autumn red/orange
const COLORS = [
  '#4a7c3f', '#5a9448', '#3d6b34', '#6aaa5a',
  '#4e8c42', '#2e5e28', '#7ab86a', '#3a6e30',
]

function mkLeaf(id, vw) {
  // Each leaf gets a unique noise seed so no two move alike
  const seed = Math.random() * 1000 + id * 137.5

  return {
    id,
    seed,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    type: Math.random() < 0.5 ? 'maple' : 'oval',

    x:  Math.random() * vw,
    y:  -30 - Math.random() * 200,

    vy: 22 + Math.random() * 25,        // slow fall
    vx: (Math.random() - 0.5) * 14,

    // Each leaf has 2–3 independent sway frequencies overlaid
    sway1Amp:   25 + Math.random() * 55,
    sway1Freq:  0.25 + Math.random() * 0.45,
    sway1Phase: Math.random() * Math.PI * 2,

    sway2Amp:   10 + Math.random() * 30,
    sway2Freq:  0.6 + Math.random() * 0.9,
    sway2Phase: Math.random() * Math.PI * 2,

    rot:        Math.random() * Math.PI * 2,
    rotSpeed:   (Math.random() < 0.5 ? 1 : -1) * (0.4 + Math.random() * 1.4),

    // Flutter (flip) — independent frequency
    flutterFreq:  0.8 + Math.random() * 1.6,
    flutterPhase: Math.random() * Math.PI * 2,

    // Occasional pause — leaf briefly slows as if caught on air
    pauseTimer: 3 + Math.random() * 8,
    pauseDur:   0,
    pausing:    false,

    scale: 0.6 + Math.random() * 0.7,
    alpha: 0.55 + Math.random() * 0.35,
    t:     0,
  }
}

function drawMaple(ctx, color) {
  ctx.beginPath()
  ctx.moveTo(0, -13)
  ctx.bezierCurveTo( 2, -10,  5,  -8,  3,  -5)
  ctx.bezierCurveTo( 7,  -7, 11,  -6, 10,  -2)
  ctx.bezierCurveTo(13,  -4, 14,  -1, 11,   1)
  ctx.bezierCurveTo(13,   2, 13,   6,  9,   5)
  ctx.bezierCurveTo( 9,   8,  5,   9,  3,   7)
  ctx.bezierCurveTo( 3,  10,  1,  12,  0,  13)
  ctx.bezierCurveTo(-1,  12, -3,  10, -3,   7)
  ctx.bezierCurveTo(-5,   9, -9,   8, -9,   5)
  ctx.bezierCurveTo(-13,  6,-13,   2,-11,   1)
  ctx.bezierCurveTo(-14, -1,-13,  -4,-10,  -2)
  ctx.bezierCurveTo(-11, -6, -7,  -7, -3,  -5)
  ctx.bezierCurveTo(-5,  -8, -2, -10,  0, -13)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'
  ctx.lineWidth = 0.6
  ctx.stroke()
  // midrib
  ctx.beginPath(); ctx.moveTo(0,-13); ctx.lineTo(0,11)
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 0.8; ctx.stroke()
  // veins
  ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = 0.5
  ;[[-5,-3,1],[-9,1,3],[-7,6,5],[5,-3,1],[9,1,3],[7,6,5]].forEach(([tx,ty,fy])=>{
    ctx.beginPath(); ctx.moveTo(0,fy); ctx.lineTo(tx,ty); ctx.stroke()
  })
}

function drawOval(ctx, color) {
  const w = 8, h = 15
  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.bezierCurveTo( w*0.85, -h*0.55,  w, h*0.25, 0,  h*0.65)
  ctx.bezierCurveTo(-w,       h*0.25, -w*0.85, -h*0.55, 0, -h)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 0.6; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-h); ctx.lineTo(0,h*0.65)
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 0.8; ctx.stroke()
  ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = 0.4
  for (let i=0;i<4;i++){
    const yv = -h*0.5 + i*h*0.32
    ctx.beginPath(); ctx.moveTo(0,yv); ctx.lineTo( w*0.75,yv+2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0,yv); ctx.lineTo(-w*0.75,yv+2); ctx.stroke()
  }
}

export default function FallingLeaves({ count = 4 }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const stateRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const vw = canvas.width
    // Start all leaves at top, staggered so they don't all appear together
    const leaves = Array.from({ length: count }, (_, i) => {
      const lf = mkLeaf(i, vw)
      lf.y = -30 - i * (window.innerHeight / count) * 0.8
      return lf
    })
    stateRef.current = { leaves }

    let last = performance.now()

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const { leaves } = stateRef.current
      const cw = canvas.width
      const ch = canvas.height

      ctx.clearRect(0, 0, cw, ch)

      leaves.forEach(lf => {
        lf.t += dt

        // Pause logic — leaf briefly floats / slows
        if (lf.pausing) {
          lf.pauseDur -= dt
          if (lf.pauseDur <= 0) lf.pausing = false
        } else {
          lf.pauseTimer -= dt
          if (lf.pauseTimer <= 0) {
            lf.pausing   = true
            lf.pauseDur  = 0.4 + Math.random() * 1.2
            lf.pauseTimer= 4 + Math.random() * 10
          }
        }

        const speedMul = lf.pausing ? 0.12 : 1.0
        lf.y += lf.vy * dt * speedMul
        lf.vx += (Math.sin(lf.t * 0.22 + lf.seed) * 8 - lf.vx) * dt * 0.3
        lf.x += lf.vx * dt * speedMul

        // Two-frequency sway overlay — each leaf has unique rhythm
        const sway =
          Math.sin(lf.t * lf.sway1Freq * Math.PI * 2 + lf.sway1Phase) * lf.sway1Amp +
          Math.sin(lf.t * lf.sway2Freq * Math.PI * 2 + lf.sway2Phase) * lf.sway2Amp

        lf.rot += lf.rotSpeed * dt * speedMul

        const flutter = Math.cos(lf.t * lf.flutterFreq * Math.PI * 2 + lf.flutterPhase)

        // Respawn at top when leaf exits bottom
        if (lf.y > ch + 50 || lf.x < -80 || lf.x > cw + 80) {
          Object.assign(lf, mkLeaf(lf.id, cw))
        }

        ctx.save()
        ctx.translate(lf.x + sway, lf.y)
        ctx.rotate(lf.rot)
        ctx.scale(
          lf.scale * (0.45 + 0.55 * Math.abs(flutter)),
          lf.scale
        )
        ctx.globalAlpha = lf.alpha * (lf.pausing ? 0.75 : 1)

        if (lf.type === 'maple') drawMaple(ctx, lf.color)
        else drawOval(ctx, lf.color)

        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        2,
      }}
    />
  )
}

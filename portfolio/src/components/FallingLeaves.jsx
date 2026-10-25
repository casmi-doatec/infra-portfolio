import { useEffect, useRef } from 'react'

const LEAF_COLORS = [
  '#C0392B', '#E74C3C', '#D2691E', '#E8A020',
  '#C8940E', '#F0C030', '#B03A2E', '#D45500',
  '#A04020', '#E8681A',
]

/* Maple leaf shape as SVG path — drawn around (0,0), spans ~24×24 */
function maplePathD() {
  return `M0,-11 C1,-8 4,-7 3,-4 C6,-6 9,-5 8,-2 C10,-3 12,-1 10,1
          C12,0 13,2 11,3 C9,2 7,4 5,3 C4,5 2,6 0,5
          C-2,6 -4,5 -5,3 C-7,4 -9,2 -11,3
          C-13,2 -12,0 -10,1 C-12,-1 -10,-3 -8,-2
          C-9,-5 -6,-6 -3,-4 C-4,-7 -1,-8 0,-11 Z
          M0,-11 L0,8`
}

/* Simple oval leaf (ginkgo / fallen leaf) */
function ovalLeafD(w = 10, h = 16) {
  return `M0,${-h / 2} C${w / 2},${-h / 2} ${w / 2},${h / 2} 0,${h / 2} C${-w / 2},${h / 2} ${-w / 2},${-h / 2} 0,${-h / 2} Z M0,${-h / 2} L0,${h / 2}`
}

function createLeaf(id, vw) {
  const type   = Math.random() < 0.55 ? 'maple' : 'oval'
  const color  = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
  const size   = 0.7 + Math.random() * 0.9          // scale factor
  const x      = Math.random() * vw
  const delay  = Math.random() * 18                  // s
  const dur    = 9 + Math.random() * 14              // fall duration
  const swing  = 60 + Math.random() * 120            // horizontal swing px
  const rot0   = Math.random() * 360
  const rotSpd = (Math.random() < 0.5 ? 1 : -1) * (180 + Math.random() * 360)
  return { id, type, color, size, x, delay, dur, swing, rot0, rotSpd }
}

export default function FallingLeaves({ count = 36 }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const leavesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* Initialise leaves */
    const vw = canvas.width
    leavesRef.current = Array.from({ length: count }, (_, i) => ({
      ...createLeaf(i, vw),
      y: -80 - Math.random() * canvas.height, // start above viewport
    }))

    let last = performance.now()

    function drawMapleLeaf(ctx, color) {
      ctx.beginPath()
      ctx.moveTo(0, -11)
      ctx.bezierCurveTo(1, -8, 4, -7, 3, -4)
      ctx.bezierCurveTo(6, -6, 9, -5, 8, -2)
      ctx.bezierCurveTo(10, -3, 12, -1, 10, 1)
      ctx.bezierCurveTo(12, 0, 13, 2, 11, 3)
      ctx.bezierCurveTo(9, 2, 7, 4, 5, 3)
      ctx.bezierCurveTo(4, 5, 2, 6, 0, 5)
      ctx.bezierCurveTo(-2, 6, -4, 5, -5, 3)
      ctx.bezierCurveTo(-7, 4, -9, 2, -11, 3)
      ctx.bezierCurveTo(-13, 2, -12, 0, -10, 1)
      ctx.bezierCurveTo(-12, -1, -10, -3, -8, -2)
      ctx.bezierCurveTo(-9, -5, -6, -6, -3, -4)
      ctx.bezierCurveTo(-4, -7, -1, -8, 0, -11)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      /* stem */
      ctx.beginPath()
      ctx.moveTo(0, -11)
      ctx.lineTo(0, 8)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.stroke()
    }

    function drawOvalLeaf(ctx, color) {
      const w = 9, h = 15
      ctx.beginPath()
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      /* midrib */
      ctx.beginPath()
      ctx.moveTo(0, -h / 2)
      ctx.lineTo(0,  h / 2)
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const h = canvas.height
      leavesRef.current.forEach(lf => {
        if (lf.delay > 0) { lf.delay -= dt; return }

        lf.y   += (40 + lf.size * 28) * dt
        lf.rot0 += lf.rotSpd * dt
        const xOff = Math.sin(lf.y / 120 + lf.id) * lf.swing * 0.5

        if (lf.y > h + 60) {
          Object.assign(lf, createLeaf(lf.id, canvas.width))
          lf.y = -80
        }

        ctx.save()
        ctx.translate(lf.x + xOff, lf.y)
        ctx.rotate((lf.rot0 * Math.PI) / 180)
        ctx.scale(lf.size, lf.size)
        ctx.globalAlpha = 0.82 + Math.sin(lf.y / 200) * 0.12

        if (lf.type === 'maple') drawMapleLeaf(ctx, lf.color)
        else drawOvalLeaf(ctx, lf.color)

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
        zIndex:        1,
      }}
    />
  )
}

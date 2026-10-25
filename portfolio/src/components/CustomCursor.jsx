/**
 * CustomCursor — Fairy follower
 *
 * A small female fairy chases the mouse with spring physics.
 * Her wand tip emits twinkling star sparkles as she flies.
 *
 * Motion stack:
 *  - fairyX / fairyY   : slow spring → visible "chase" lag
 *  - velX → rotate     : tilts ±20° in the direction of travel
 *  - bobY              : sinusoidal vertical float
 *  - Canvas 2D         : star + circle sparkles from wand tip
 */

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from 'framer-motion'

/* ─── Sparkle palette (matches design tokens) ─────────────── */
const SPARKLE_COLORS = ['#ffd700', '#ffffff', '#4cc9f0', '#ffb3d9', '#fffacd']

/* Draw a 4-pointed star at (x, y) with outer radius r */
function drawStar4(ctx, x, y, r) {
  if (r < 0.1) return
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2
    const radius = i % 2 === 0 ? r : r * 0.38
    i === 0
      ? ctx.moveTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius)
      : ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius)
  }
  ctx.closePath()
  ctx.fill()
}

/* ─── Fairy SVG ────────────────────────────────────────────── */
/*
 * Viewport 70 × 90, overflow:visible for glow filters.
 * Body centre ≈ (35, 52) — used as wing transform-origin.
 * Wand tip ≈ SVG (63, 23) → screen offset from spring pos:
 *   x: 63 − 0.20×70 = +49
 *   y: 23 − 0.90×90 = −58
 */
function FairySVG() {
  return (
    <svg
      width="70"
      height="90"
      viewBox="0 0 70 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Soft body glow */}
        <filter id="fglow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Intense wand-star glow */}
        <filter id="wglow" x="-250%" y="-250%" width="600%" height="600%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Wing fill gradients */}
        <radialGradient id="wingHi" cx="50%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#4cc9f0" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#4cc9f0" stopOpacity="0.08"/>
        </radialGradient>
        <radialGradient id="wingLo" cx="50%" cy="50%" r="65%">
          <stop offset="0%"   stopColor="#c8a96e" stopOpacity="0.38"/>
          <stop offset="100%" stopColor="#c8a96e" stopOpacity="0.05"/>
        </radialGradient>
      </defs>

      {/* ── Lower wings (gold tint, behind body) ── */}
      <ellipse cx="20" cy="61" rx="18" ry="10"
        fill="url(#wingLo)" stroke="rgba(200,169,110,0.55)" strokeWidth="0.8"
        className="fairy-wing fairy-wing-lo-l"
      />
      <ellipse cx="50" cy="61" rx="18" ry="10"
        fill="url(#wingLo)" stroke="rgba(200,169,110,0.55)" strokeWidth="0.8"
        className="fairy-wing fairy-wing-lo-r"
      />

      {/* ── Upper wings (cyan, behind body) ── */}
      <ellipse cx="16" cy="46" rx="26" ry="16"
        fill="url(#wingHi)" stroke="rgba(76,201,240,0.82)" strokeWidth="0.9"
        className="fairy-wing fairy-wing-hi-l"
      />
      <ellipse cx="54" cy="46" rx="26" ry="16"
        fill="url(#wingHi)" stroke="rgba(76,201,240,0.82)" strokeWidth="0.9"
        className="fairy-wing fairy-wing-hi-r"
      />

      {/* ── Dress ── */}
      <ellipse cx="35" cy="67" rx="6.5" ry="11" fill="#d4a5ff" filter="url(#fglow)"/>
      <path d="M26 74 Q35 87 44 74" fill="#c090ee"/>

      {/* ── Head ── */}
      <circle cx="35" cy="42" r="12" fill="#fcd5b0" filter="url(#fglow)"/>

      {/* ── Hair ── */}
      <path d="M23 37 Q21 23 35 20 Q49 23 47 37" fill="#ff7eb3"/>
      <path d="M23 39 Q14 52 18 66"
        stroke="#ff7eb3" strokeWidth="4.2" fill="none" strokeLinecap="round"/>
      <path d="M47 39 Q55 48 51 59"
        stroke="#ff7eb3" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

      {/* ── Eyes ── */}
      <ellipse cx="30" cy="43" rx="2.7" ry="3.1" fill="#2d1d3d"/>
      <ellipse cx="40" cy="43" rx="2.7" ry="3.1" fill="#2d1d3d"/>
      {/* Shine */}
      <circle cx="31.3" cy="41.4" r="1.35" fill="white" opacity="0.92"/>
      <circle cx="41.3" cy="41.4" r="1.35" fill="white" opacity="0.92"/>

      {/* ── Blush ── */}
      <ellipse cx="25" cy="46.5" rx="4.0" ry="2.3" fill="rgba(255,120,120,0.42)"/>
      <ellipse cx="45" cy="46.5" rx="4.0" ry="2.3" fill="rgba(255,120,120,0.42)"/>

      {/* ── Mouth ── */}
      <path d="M31 50 Q35 54 39 50"
        fill="none" stroke="#dd5588" strokeWidth="1.5" strokeLinecap="round"/>

      {/* ── Arm + wand ── */}
      <path d="M43 62 Q51 52 55 40"
        stroke="#fcd5b0" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
      <line x1="55" y1="40" x2="63" y2="23"
        stroke="#ffd700" strokeWidth="2.2" strokeLinecap="round"/>

      {/* ── Wand star tip ── */}
      <g transform="translate(63,23)" filter="url(#wglow)">
        <path d="M0,-9 L2.3,-2.3 L9,0 L2.3,2.3 L0,9 L-2.3,2.3 L-9,0 L-2.3,-2.3 Z"
          fill="#ffd700" stroke="#ffcc00" strokeWidth="0.5"/>
        <circle r="4.2" fill="rgba(255,230,80,0.60)"/>
      </g>
    </svg>
  )
}

/* ─── Main cursor component ───────────────────────────────── */
export default function CustomCursor() {
  /* Raw mouse position */
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)

  /* Fairy spring-follows the cursor with visible lag */
  const fairyX = useSpring(mouseX, { stiffness: 68, damping: 13, mass: 0.70 })
  const fairyY = useSpring(mouseY, { stiffness: 68, damping: 13, mass: 0.70 })

  /* Lean left/right based on horizontal velocity */
  const velX   = useVelocity(fairyX)
  const rotate = useTransform(velX, [-1400, 1400], [22, -22])

  /* Vertical float bob */
  const bobY   = useMotionValue(0)
  const yFinal = useTransform([fairyY, bobY], ([y, b]) => y + b)

  /* Visibility */
  const opacity = useMotionValue(0)

  /* Canvas / sparkle refs (no re-renders needed) */
  const canvasRef = useRef(null)
  const particles = useRef([])
  const rafId     = useRef(null)
  const frame     = useRef(0)

  useEffect(() => {
    /* Touch-only devices: skip entirely */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove  = ({ clientX: x, clientY: y }) => {
      mouseX.set(x)
      mouseY.set(y)
      opacity.set(1)
    }
    const onLeave = () => opacity.set(0)
    const onEnter = () => opacity.set(1)

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    /* ── Render loop ── */
    const draw = () => {
      frame.current++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* Update bob */
      bobY.set(Math.sin(frame.current * 0.046) * 5.5)

      /* Emit sparkles from wand tip every 2 frames */
      if (opacity.get() > 0.3 && frame.current % 2 === 0) {
        const fx = fairyX.get()
        const fy = fairyY.get() + bobY.get()

        /*
         * Fairy div: translateX(-20%), translateY(-90%) of its 70×90 box
         * → top-left at (fx - 14, fy - 81)
         * Wand tip in SVG: (63, 23)
         * → screen: (fx - 14 + 63, fy - 81 + 23) = (fx+49, fy-58)
         */
        particles.current.push({
          x:     fx + 49 + (Math.random() - 0.5) * 10,
          y:     fy - 58 + (Math.random() - 0.5) * 10,
          vx:    (Math.random() - 0.5) * 2.8,
          vy:    (Math.random() - 0.5) * 2.2 - 1.1,
          life:  1.0,
          decay: 0.023 + Math.random() * 0.017,
          size:  Math.random() * 5.0 + 1.8,
          phase: Math.random() * Math.PI * 2,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          isStar: Math.random() > 0.42,
        })

        if (particles.current.length > 130) {
          particles.current = particles.current.slice(-100)
        }
      }

      /* Draw + age sparkles */
      particles.current = particles.current.filter(p => p.life > 0.02)

      for (const p of particles.current) {
        p.x    += p.vx
        p.y    += p.vy
        p.vy   -= 0.048   /* gentle upward drift */
        p.vx   *= 0.97
        p.life -= p.decay

        /* Twinkling: oscillate scale + alpha */
        const twinkle = 0.55 + 0.45 * Math.sin(frame.current * 0.30 + p.phase)
        const alpha   = p.life * twinkle * 0.88
        const r       = p.size * p.life * (0.5 + 0.5 * twinkle)

        ctx.fillStyle   = p.color
        ctx.globalAlpha = alpha

        if (p.isStar) {
          drawStar4(ctx, p.x, p.y, r)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, Math.max(r * 0.55, 0.1), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId.current)
    }
  }, [mouseX, mouseY, fairyX, fairyY, bobY, opacity])

  return (
    <>
      {/* Sparkle canvas — below fairy */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        9995,
        }}
      />

      {/* Fairy — above canvas */}
      <motion.div
        style={{
          x:             fairyX,
          y:             yFinal,
          rotate,
          opacity,
          position:      'fixed',
          top:           0,
          left:          0,
          pointerEvents: 'none',
          zIndex:        9996,
          translateX:    '-20%',
          translateY:    '-90%',
          willChange:    'transform',
        }}
      >
        <FairySVG />
      </motion.div>
    </>
  )
}

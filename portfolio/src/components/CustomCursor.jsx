/**
 * CustomCursor
 *
 * Two-layer cursor system:
 *  1. Inner dot   — follows mouse instantly via useMotionValue
 *  2. Outer ring  — follows with spring physics via useSpring
 *  3. Canvas 2D   — particle trail (red + cyan sparks from the color palette)
 *
 * Active only on pointer-capable devices (hover: hover).
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [visible,  setVisible]  = useState(false)
  const [hovered,  setHovered]  = useState(false)  // over link/button
  const [clicking, setClicking] = useState(false)

  /* ── Motion values ─────────────────────────────────────── */

  // Dot: moves instantly
  const dotX = useMotionValue(-200)
  const dotY = useMotionValue(-200)

  // Ring: spring lag for "trailing" feel
  const ringX = useSpring(dotX, { stiffness: 180, damping: 22, mass: 0.4 })
  const ringY = useSpring(dotY, { stiffness: 180, damping: 22, mass: 0.4 })

  /* ── Canvas particle trail ─────────────────────────────── */

  const canvasRef   = useRef(null)
  const particles   = useRef([])
  const rafId       = useRef(null)
  const lastPos     = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only activate on real pointer devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    /* Spawn 2 particles every ~8 px of cursor travel */
    const onMove = ({ clientX: x, clientY: y }) => {
      dotX.set(x)
      dotY.set(y)
      setVisible(true)

      const dx = x - lastPos.current.x
      const dy = y - lastPos.current.y

      if (dx * dx + dy * dy > 64) {
        lastPos.current = { x, y }

        for (let i = 0; i < 2; i++) {
          particles.current.push({
            x:     x + (Math.random() - 0.5) * 6,
            y:     y + (Math.random() - 0.5) * 6,
            vx:    (Math.random() - 0.5) * 2.0,
            vy:    (Math.random() - 0.5) * 2.0 - 0.5,
            life:  1.0,
            decay: 0.036 + Math.random() * 0.024,
            size:  Math.random() * 2.5 + 0.8,
            // Palette: 55% cyan, 45% red — matches the design tokens
            color: Math.random() > 0.45 ? '#4cc9f0' : '#e63946',
          })
        }

        // Cap to prevent runaway allocation
        if (particles.current.length > 130) {
          particles.current = particles.current.slice(-100)
        }
      }
    }

    const onLeave  = () => setVisible(false)
    const onEnter  = () => setVisible(true)
    const onDown   = () => setClicking(true)
    const onUp     = () => setClicking(false)

    /* Detect hoverable targets */
    const onOver = (e) => {
      const el = e.target.closest(
        'a, button, [role="button"], .skill-card, .project-card, .skills-tab, .contact-link'
      )
      setHovered(!!el)
    }

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onOver,  { passive: true })

    /* Animation loop */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update + draw each particle
      particles.current = particles.current.filter(p => p.life > 0.02)

      for (const p of particles.current) {
        p.x    += p.vx
        p.y    += p.vy
        p.vy   -= 0.018          // slight upward drift (data rising from foundation)
        p.vx   *= 0.98           // air resistance
        p.life -= p.decay

        const r = p.size * p.life  // shrink as it fades

        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(r, 0.1), 0, Math.PI * 2)
        ctx.fillStyle    = p.color
        ctx.globalAlpha  = p.life * 0.55
        ctx.fill()
      }
      ctx.globalAlpha = 1

      rafId.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onOver)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId.current)
    }
  }, [dotX, dotY])

  return (
    <>
      {/* ── Particle canvas (below cursor layers) ── */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        9996,
        }}
      />

      {/* ── Outer spring ring ── */}
      <motion.div
        className="cursor-ring"
        data-hovered={hovered}
        data-clicking={clicking}
        style={{
          x:          ringX,
          y:          ringY,
          opacity:    visible ? 1 : 0,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* ── Inner dot ── */}
      <motion.div
        className="cursor-dot"
        style={{
          x:          dotX,
          y:          dotY,
          opacity:    visible ? 1 : 0,
          translateX: '-50%',
          translateY: '-50%',
          scale:      clicking ? 0.5 : 1,
        }}
        transition={{ scale: { duration: 0.08 } }}
      />
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useVelocity } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)

  const hamsterX = useSpring(mouseX, { stiffness: 85, damping: 14, mass: 0.6 })
  const hamsterY = useSpring(mouseY, { stiffness: 85, damping: 14, mass: 0.6 })

  const velX = useVelocity(hamsterX)

  const [state, setState] = useState('hidden') // hidden | idle | running | sleeping
  const [direction, setDirection] = useState(1) // 1=right -1=left
  const [runSpeed, setRunSpeed] = useState(0.18)

  const sleepTimer = useRef(null)
  const prevX = useRef(0)
  const prevY = useRef(0)
  const visible = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = ({ clientX: x, clientY: y }) => {
      mouseX.set(x)
      mouseY.set(y)

      const dx = x - prevX.current
      prevX.current = x
      prevY.current = y

      if (!visible.current) {
        visible.current = true
      }

      if (Math.abs(dx) > 2) {
        setDirection(dx > 0 ? 1 : -1)
      }

      const dist = Math.sqrt(dx * dx + (y - prevY.current) * (y - prevY.current))
      const speed = Math.max(0.06, 0.22 - dist * 0.004)
      setRunSpeed(speed)
      setState('running')

      clearTimeout(sleepTimer.current)
      sleepTimer.current = setTimeout(() => {
        setState('idle')
        sleepTimer.current = setTimeout(() => setState('sleeping'), 800)
      }, 1200)
    }

    const onLeave = () => {
      clearTimeout(sleepTimer.current)
      setState('hidden')
      visible.current = false
    }
    const onEnter = () => {
      if (!visible.current) setState('idle')
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      clearTimeout(sleepTimer.current)
    }
  }, [mouseX, mouseY])

  if (state === 'hidden') return null

  return (
    <motion.div
      style={{
        x: hamsterX,
        y: hamsterY,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9997,
        willChange: 'transform',
      }}
    >
      <div
        className={`hamster-cursor hamster-${state}`}
        style={{
          transform: `translateX(${direction * 28}px) translateY(2px) scaleX(${direction})`,
          transition: 'transform 0.08s ease',
          '--run-spd': `${runSpeed}s`,
        }}
      >
        <img
          src="/hamster.png"
          alt=""
          width="64"
          height="64"
          style={{ objectFit: 'contain' }}
          draggable={false}
        />
        {state === 'sleeping' && (
          <div className="hamster-zzz">
            <span style={{ '--d': '0s' }}>z</span>
            <span style={{ '--d': '0.55s' }}>z</span>
            <span style={{ '--d': '1.1s' }}>Z</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

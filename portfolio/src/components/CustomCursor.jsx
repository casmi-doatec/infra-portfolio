import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/*
 * White-outline SVG hamster drawn from scratch.
 * fill="none", stroke="white" throughout — purely contour-style.
 * viewBox 80×70, anchor at nose-tip ≈ (8, 38).
 */
function HamsterSVG({ running, sleeping }) {
  return (
    <svg
      width="80"
      height="70"
      viewBox="0 0 80 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', display: 'block' }}
    >
      {/* ── stroke style shared ── */}
      <g stroke="white" strokeLinecap="round" strokeLinejoin="round">

        {/* BODY — plump oval */}
        <ellipse cx="44" cy="38" rx="26" ry="20" strokeWidth="2"/>

        {/* CHEEK POUCHES — two bulgy circles on the sides */}
        <circle cx="22" cy="40" r="10" strokeWidth="1.8"/>
        <circle cx="66" cy="40" r="10" strokeWidth="1.8"/>

        {/* HEAD — smaller circle on top-left of body */}
        <circle cx="24" cy="26" r="14" strokeWidth="2"/>

        {/* EAR LEFT */}
        <ellipse cx="16" cy="14" rx="6" ry="7" strokeWidth="1.8"/>
        <ellipse cx="16" cy="14" rx="3" ry="4" strokeWidth="1" opacity="0.55"/>

        {/* EAR RIGHT */}
        <ellipse cx="32" cy="12" rx="6" ry="7" strokeWidth="1.8"/>
        <ellipse cx="32" cy="12" rx="3" ry="4" strokeWidth="1" opacity="0.55"/>

        {/* EYES */}
        {sleeping ? (
          /* Sleeping — closed curved lines */
          <>
            <path d="M18 26 Q21 23 24 26" strokeWidth="2"/>
            <path d="M26 25 Q29 22 32 25" strokeWidth="2"/>
          </>
        ) : (
          /* Awake — small circles */
          <>
            <circle cx="21" cy="26" r="2.5" strokeWidth="1.8" fill="white"/>
            <circle cx="30" cy="25" r="2.5" strokeWidth="1.8" fill="white"/>
            {/* Shine dots */}
            <circle cx="22" cy="24.8" r="1" fill="white" stroke="none"/>
            <circle cx="31" cy="23.8" r="1" fill="white" stroke="none"/>
          </>
        )}

        {/* NOSE */}
        <ellipse cx="25.5" cy="33" rx="2.5" ry="1.8" strokeWidth="1.5"/>

        {/* MOUTH */}
        <path d="M23.5 35 Q25.5 37.5 27.5 35" strokeWidth="1.5"/>

        {/* WHISKERS — left */}
        <line x1="8"  y1="31" x2="21" y2="33" strokeWidth="1"  opacity="0.7"/>
        <line x1="7"  y1="34" x2="21" y2="34" strokeWidth="1"  opacity="0.7"/>
        <line x1="9"  y1="37" x2="21" y2="35" strokeWidth="1"  opacity="0.7"/>
        {/* WHISKERS — right */}
        <line x1="30" y1="33" x2="43" y2="31" strokeWidth="1"  opacity="0.7"/>
        <line x1="30" y1="34" x2="44" y2="34" strokeWidth="1"  opacity="0.7"/>
        <line x1="30" y1="35" x2="43" y2="37" strokeWidth="1"  opacity="0.7"/>

        {/* TAIL — small curly nub at back */}
        <path d="M68 36 Q76 30 74 38 Q72 44 68 42" strokeWidth="1.8"/>

        {sleeping ? (
          /* SLEEPING — legs tucked under, rounded shape */
          <>
            <path d="M32 55 Q44 60 58 55" strokeWidth="1.8"/>
            <path d="M30 52 Q32 57 38 58" strokeWidth="1.8"/>
            <path d="M54 58 Q60 57 62 52" strokeWidth="1.8"/>
          </>
        ) : running ? (
          /* RUNNING — 4 legs pumping */
          <>
            {/* front-left */}
            <path d="M30 52 Q24 58 20 64" strokeWidth="2"/>
            <path d="M20 64 Q18 67 14 66" strokeWidth="2"/>
            {/* front-right */}
            <path d="M38 54 Q36 62 34 68" strokeWidth="2"/>
            <path d="M34 68 Q33 70 29 70" strokeWidth="2"/>
            {/* back-left */}
            <path d="M52 54 Q56 60 60 65" strokeWidth="2"/>
            <path d="M60 65 Q62 68 58 70" strokeWidth="2"/>
            {/* back-right */}
            <path d="M60 52 Q66 56 70 60" strokeWidth="2"/>
            <path d="M70 60 Q73 62 72 66" strokeWidth="2"/>
          </>
        ) : (
          /* IDLE — legs resting */
          <>
            <path d="M30 54 Q26 60 22 64" strokeWidth="2"/>
            <path d="M22 64 Q20 67 16 66" strokeWidth="2"/>
            <path d="M40 56 Q38 62 36 67" strokeWidth="2"/>
            <path d="M36 67 Q35 70 31 69" strokeWidth="2"/>
            <path d="M54 54 Q56 60 58 65" strokeWidth="2"/>
            <path d="M58 65 Q60 68 56 70" strokeWidth="2"/>
            <path d="M62 52 Q66 56 68 60" strokeWidth="2"/>
            <path d="M68 60 Q70 62 69 66" strokeWidth="2"/>
          </>
        )}
      </g>
    </svg>
  )
}

export default function CustomCursor() {
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)

  const hamsterX = useSpring(mouseX, { stiffness: 90, damping: 15, mass: 0.55 })
  const hamsterY = useSpring(mouseY, { stiffness: 90, damping: 15, mass: 0.55 })

  const [state, setState]       = useState('hidden')
  const [direction, setDir]     = useState(1)
  const [runSpeed, setRunSpeed] = useState(0.18)

  const sleepTimer = useRef(null)
  const prevX      = useRef(0)
  const prevY      = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = ({ clientX: x, clientY: y }) => {
      mouseX.set(x)
      mouseY.set(y)

      const dx   = x - prevX.current
      const dy   = y - prevY.current
      prevX.current = x
      prevY.current = y

      if (Math.abs(dx) > 2) setDir(dx > 0 ? 1 : -1)

      const dist = Math.sqrt(dx * dx + dy * dy)
      setRunSpeed(Math.max(0.07, 0.22 - dist * 0.004))
      setState('running')

      clearTimeout(sleepTimer.current)
      sleepTimer.current = setTimeout(() => {
        setState('idle')
        sleepTimer.current = setTimeout(() => setState('sleeping'), 900)
      }, 1300)
    }

    const onLeave = () => { clearTimeout(sleepTimer.current); setState('hidden') }
    const onEnter = () => setState(s => s === 'hidden' ? 'idle' : s)

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      clearTimeout(sleepTimer.current)
    }
  }, [mouseX, mouseY])

  if (state === 'hidden') return null

  const isRunning  = state === 'running'
  const isSleeping = state === 'sleeping'

  return (
    <motion.div
      style={{
        x: hamsterX,
        y: hamsterY,
        position:      'fixed',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        9997,
        willChange:    'transform',
      }}
    >
      <div
        className={`hamster-cursor hamster-${state}`}
        style={{
          transform:  `translateX(${direction * 20}px) translateY(-8px) scaleX(${direction})`,
          transition: 'transform 0.08s ease',
          '--run-spd': `${runSpeed}s`,
        }}
      >
        <HamsterSVG running={isRunning} sleeping={isSleeping} />
        {isSleeping && (
          <div className="hamster-zzz">
            <span style={{ '--d': '0s'   }}>z</span>
            <span style={{ '--d': '0.6s' }}>z</span>
            <span style={{ '--d': '1.2s' }}>Z</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

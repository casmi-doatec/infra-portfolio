import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/*
 * White-outline hamster matching the reference illustration:
 * - Big round head that flows into a fat round body (one continuous silhouette)
 * - Small round ears with inner circle
 * - Tuft of hair on top
 * - Large dot eyes, small oval nose, short whiskers
 * - Tiny round paw nubs at the bottom
 * All stroke="white", fill="none" — pure white contour on transparent.
 * viewBox 0 0 90 100
 */
function HamsterSVG({ running, sleeping }) {
  return (
    <svg
      width="90"
      height="100"
      viewBox="0 0 90 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <g stroke="white" strokeLinecap="round" strokeLinejoin="round">

        {/* ── OUTER SILHOUETTE ──
            One big closed path: wide round body + head merged together.
            Think of it as a vertical oval with a slightly narrower top (head)
            and wide middle (body/cheeks), tapering to small paw bumps at bottom.
        */}
        <path
          d={`
            M 45 8
            C 55 5, 68 10, 72 20
            C 76 28, 76 36, 78 44
            C 80 52, 80 62, 74 70
            C 70 76, 62 80, 55 82
            C 52 83, 50 84, 50 84
            L 50 88
            C 50 91, 47 93, 45 93
            C 43 93, 40 91, 40 88
            L 40 84
            C 40 84, 38 83, 35 82
            C 28 80, 20 76, 16 70
            C 10 62, 10 52, 12 44
            C 14 36, 14 28, 18 20
            C 22 10, 35 5, 45 8
            Z
          `}
          strokeWidth="3.5"
        />

        {/* ── EAR LEFT ── */}
        <ellipse cx="22" cy="17" rx="9" ry="10" strokeWidth="3"/>
        <ellipse cx="22" cy="17" rx="5"  ry="5.5" strokeWidth="1.8" opacity="0.7"/>

        {/* ── EAR RIGHT ── */}
        <ellipse cx="68" cy="17" rx="9" ry="10" strokeWidth="3"/>
        <ellipse cx="68" cy="17" rx="5"  ry="5.5" strokeWidth="1.8" opacity="0.7"/>

        {/* ── HAIR TUFT (3 strands on top-center) ── */}
        <path d="M 41 10 Q 38 3 36 0"  strokeWidth="2.2"/>
        <path d="M 45 8  Q 44 1 44 -2" strokeWidth="2.2"/>
        <path d="M 49 10 Q 52 3 54 0"  strokeWidth="2.2"/>

        {/* ── EYES ── */}
        {sleeping ? (
          <>
            <path d="M 32 42 Q 36 38 40 42" strokeWidth="2.5"/>
            <path d="M 50 42 Q 54 38 58 42" strokeWidth="2.5"/>
          </>
        ) : (
          <>
            <circle cx="36" cy="42" r="5" strokeWidth="2.5" fill="white"/>
            <circle cx="54" cy="42" r="5" strokeWidth="2.5" fill="white"/>
            {/* pupils */}
            <circle cx="37" cy="41" r="2.2" fill="white" stroke="none"/>
            <circle cx="55" cy="41" r="2.2" fill="white" stroke="none"/>
          </>
        )}

        {/* ── NOSE ── */}
        <ellipse cx="45" cy="54" rx="3.5" ry="2.5" strokeWidth="2" fill="white"/>

        {/* ── MOUTH ── */}
        <path d="M 42 57 Q 45 61 48 57" strokeWidth="1.8"/>

        {/* ── WHISKERS left ── */}
        <line x1="18" y1="50" x2="40" y2="54" strokeWidth="1.4" opacity="0.75"/>
        <line x1="16" y1="55" x2="40" y2="56" strokeWidth="1.4" opacity="0.75"/>
        <line x1="18" y1="60" x2="40" y2="58" strokeWidth="1.4" opacity="0.75"/>

        {/* ── WHISKERS right ── */}
        <line x1="50" y1="54" x2="72" y2="50" strokeWidth="1.4" opacity="0.75"/>
        <line x1="50" y1="56" x2="74" y2="55" strokeWidth="1.4" opacity="0.75"/>
        <line x1="50" y1="58" x2="72" y2="60" strokeWidth="1.4" opacity="0.75"/>

        {/* ── PAWS at bottom ── */}
        {sleeping ? (
          /* curled paws */
          <>
            <path d="M 35 82 Q 30 88 32 93 Q 34 96 38 95" strokeWidth="2.2"/>
            <path d="M 55 82 Q 60 88 58 93 Q 56 96 52 95" strokeWidth="2.2"/>
          </>
        ) : running ? (
          /* paws kicked out */
          <>
            <path d="M 36 82 Q 26 88 20 94" strokeWidth="2.5"/>
            <path d="M 20 94 Q 17 97 14 96"  strokeWidth="2.5"/>
            <path d="M 54 82 Q 64 88 70 94" strokeWidth="2.5"/>
            <path d="M 70 94 Q 73 97 76 96"  strokeWidth="2.5"/>
          </>
        ) : (
          /* resting paws — small rounded nubs */
          <>
            <path d="M 36 82 Q 32 88 34 93" strokeWidth="2.5"/>
            <path d="M 34 93 Q 36 96 40 95"  strokeWidth="2.2"/>
            <path d="M 54 82 Q 58 88 56 93" strokeWidth="2.5"/>
            <path d="M 56 93 Q 54 96 50 95"  strokeWidth="2.2"/>
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
          transform:  `translateX(${direction * 16}px) translateY(-12px) scaleX(${direction})`,
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

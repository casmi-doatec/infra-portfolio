import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import NetworkScene from './NetworkScene'

const TECH_ITEMS = [
  'AWS', 'Kubernetes', 'Terraform', 'Linux',
  'Docker', 'Ansible', 'Prometheus', 'Python',
  'GitHub Actions', 'ArgoCD', 'Grafana', 'EKS',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content container">

        {/* ── Left: text ── */}
        <div className="hero-text">

          <motion.p className="hero-jp-sub" {...fadeUp(0.1)}>
            インフラエンジニア
          </motion.p>

          <motion.h1 className="hero-name" {...fadeUp(0.25)}>
            Taiji Takeda
            <span className="hero-name-jp">武田 泰治</span>
          </motion.h1>

          <motion.p className="hero-title" {...fadeUp(0.35)}>
            Infrastructure Engineer
          </motion.p>

          {/* Foundation concept tagline */}
          <motion.p className="hero-foundation-quote" {...fadeUp(0.42)}>
            <span className="hero-quote-jp">基盤</span>
            <span className="hero-quote-sep">—</span>
            Infrastructure is the foundation everything is built on.
          </motion.p>

          <motion.p className="hero-desc" {...fadeUp(0.50)}>
            Designing cloud-native systems that are resilient by default,
            scalable by design, and invisible when they're working.
          </motion.p>

          <motion.div className="hero-cta" {...fadeUp(0.60)}>
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact"  className="btn-ghost">Contact Me</a>
          </motion.div>
        </div>

        {/* ── Right: 3D canvas ── */}
        <motion.div
          className="hero-3d"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Canvas
            camera={{ position: [0, 0, 9.5], fov: 48 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <NetworkScene />
            </Suspense>
          </Canvas>

          {/* Blueprint label overlay */}
          <div className="hero-3d-label">
            <span className="hero-3d-label-text">VPC Architecture · インフラ構成図</span>
          </div>
        </motion.div>
      </div>

      {/* ── Scrolling tech strip ── */}
      <div className="hero-tech-strip">
        <div className="hero-tech-inner">
          <div className="hero-tech-track" aria-hidden="true">
            {[...TECH_ITEMS, ...TECH_ITEMS].map((tech, i) => (
              <span key={i} className="hero-tech-item">
                <span className="hero-tech-dot" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

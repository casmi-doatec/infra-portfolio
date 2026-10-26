import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <motion.span className="hero-label" {...fadeUp(0.1)}>
          インフラエンジニア
        </motion.span>
        <motion.h1 className="hero-title" {...fadeUp(0.2)}>
          武田 泰治
        </motion.h1>
        <motion.p className="hero-sub" {...fadeUp(0.35)}>
          クラウド・コンテナ・自動化で<br />
          堅牢な基盤を設計します。
        </motion.p>
        <motion.div className="hero-buttons" {...fadeUp(0.5)}>
          <a href="#projects" className="btn-primary">
            プロジェクトを見る →
          </a>
          <a href="#contact" className="btn-ghost">
            お問い合わせ
          </a>
        </motion.div>
      </div>
    </section>
  )
}

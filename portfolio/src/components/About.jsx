import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

// "基盤" = foundation/infrastructure  "構造" = structure
const TAGS = [
  'Cloud Architecture', 'Site Reliability', 'DevOps', 'Automation',
  'Security Hardening', 'Cost Optimisation', 'High Availability',
]

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">

          {/* ── Visual card ── */}
          <motion.div className="about-visual" {...fadeUp(0)}>
            <div className="about-card">

              {/* Large architectural kanji as visual */}
              <div className="about-kanji-block">
                <span className="about-kanji-main">基</span>
                <span className="about-kanji-sub">盤</span>
              </div>

              {/* Blueprint annotation line */}
              <div className="about-annotation">
                <span className="about-annotation-line" />
                <span className="about-annotation-text">Infrastructure = Foundation</span>
              </div>

              <div className="about-stats">
                <div>
                  {/* TODO: Update with your actual years */}
                  <span className="about-stat-num">6<span>+</span></span>
                  <span className="about-stat-label">Years Exp.</span>
                </div>
                <div>
                  {/* TODO: Update with your actual project count */}
                  <span className="about-stat-num">40<span>+</span></span>
                  <span className="about-stat-label">Projects</span>
                </div>
                <div>
                  {/* TODO: Update with your cert count */}
                  <span className="about-stat-num">5</span>
                  <span className="about-stat-label">Certs</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Text ── */}
          <motion.div className="about-text" {...fadeUp(0.15)}>
            <span className="section-label">About Me</span>
            <h2 className="section-title">Infrastructure is the Foundation</h2>
            <span className="section-title-jp">インフラは、すべての基盤</span>

            {/* TODO: Replace with your actual bio */}
            <p>
              Just as a skyscraper depends on its unseen foundation, every
              modern system runs on the infrastructure beneath it. I'm an
              infrastructure engineer based in Tokyo, Japan — I design and
              operate the foundation so that everything above it can scale
              without limits.
            </p>
            <p>
              With 6+ years in cloud-native environments, my focus is building
              highly available AWS architectures, Kubernetes platforms, and
              full automation pipelines that make infrastructure invisible
              by making it bulletproof.
            </p>

            <div className="about-tags">
              {TAGS.map(tag => (
                <span key={tag} className="about-tag">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
})

const TAGS = [
  'クラウド設計', 'サイト信頼性', 'DevOps', '自動化',
  'セキュリティ強化', 'コスト最適化', '高可用性',
]

export default function About() {
  return (
    <section id="about" className="about-section section-with-bg">
      <div className="section-bg-img" style={{ backgroundImage: "url('/about-bg.png')" }} />
      <div className="section-bg-overlay" />
      <div className="container">
        <div className="section-left-content">
          <motion.div {...fadeUp(0)}>
            <span className="section-label">自己紹介</span>
            <h2 className="section-title">インフラは、すべての基盤</h2>
            <span className="section-title-jp">Infrastructure is the Foundation</span>
          </motion.div>

          <motion.div className="about-stats" {...fadeUp(0.1)}>
            <div>
              <span className="about-stat-num">6<span>+</span></span>
              <span className="about-stat-label">年の経験</span>
            </div>
            <div>
              <span className="about-stat-num">40<span>+</span></span>
              <span className="about-stat-label">プロジェクト</span>
            </div>
            <div>
              <span className="about-stat-num">5</span>
              <span className="about-stat-label">資格</span>
            </div>
          </motion.div>

          <motion.div className="about-text" {...fadeUp(0.2)}>
            <p>
              超高層ビルが見えない基礎の上に立つように、すべての現代システムはその下に広がるインフラの上で動いています。
              東京を拠点に活動するインフラエンジニアとして、あらゆるものがスケールできる基盤を設計・運用しています。
            </p>
            <p>
              クラウドネイティブ環境での6年以上の経験を持ち、可用性の高いAWSアーキテクチャ、Kubernetesプラットフォーム、
              そして完全自動化パイプラインの構築を通じて、インフラを「見えない存在」にすることを目指しています。
            </p>
          </motion.div>

          <motion.div className="about-tags" {...fadeUp(0.3)}>
            {TAGS.map(tag => (
              <span key={tag} className="about-tag">{tag}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

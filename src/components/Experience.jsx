import { motion } from 'framer-motion'

const EXPERIENCE = [
  {
    role:     'フルスタックAIエンジニア',
    company:  '株式会社〇〇',
    period:   '2022年4月 — 現在',
    location: '東京都',
    desc:     '社内ナレッジ検索のRAG基盤と業務支援AIエージェントを企画から運用まで一貫して開発。ハイブリッド検索とリランキングで回答精度を改善し、評価パイプラインを整備して継続的に品質を計測。ストリーミング対応のチャットUIも設計・実装。',
    techs:    ['Claude API', 'LangGraph', 'pgvector', 'FastAPI', 'React'],
  },
  {
    role:     'フルスタックエンジニア',
    company:  '株式会社〇〇',
    period:   '2020年4月 — 2022年3月',
    location: '東京都',
    desc:     'ReactとPythonによるWebサービスの設計・開発を担当。レコメンドや文書分類などの機械学習機能をAPI化して本番へ組み込み、Dockerを用いたCI/CDでリリースを自動化。',
    techs:    ['React', 'Python', 'PyTorch', 'Docker', 'PostgreSQL'],
  },
  {
    role:     'ソフトウェアエンジニア',
    company:  '株式会社〇〇',
    period:   '2018年4月 — 2020年3月',
    location: '東京都',
    desc:     '業務システムのバックエンド開発とデータ集計基盤の構築に従事。SQLとPythonによるデータ処理の自動化で、月20時間以上の工数を削減。',
    techs:    ['Python', 'SQL', 'Node.js', 'REST API', 'AWS'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">キャリア</span>
          <h2 className="section-title">経歴</h2>
          <span className="section-title-jp">Experience</span>
        </motion.div>

        <div className="timeline">
          {EXPERIENCE.map((item, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="timeline-meta">
                <p className="timeline-period">{item.period}</p>
                <p className="timeline-location">{item.location}</p>
              </div>
              <div className="timeline-body">
                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-company">{item.company}</p>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-techs">
                  {item.techs.map(t => (
                    <span key={t} className="timeline-tech">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

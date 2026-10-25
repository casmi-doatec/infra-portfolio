import { motion } from 'framer-motion'

const EXPERIENCE = [
  {
    role:     'シニアインフラエンジニア',
    company:  '株式会社〇〇',
    period:   '2022年4月 — 現在',
    location: '東京都',
    desc:     'モノリシックアプリケーションをEKS上のマイクロサービスへ移行するプロジェクトをリード。Terraformを使ったマルチリージョンAWSインフラを設計・構築し、ArgoCDによるGitOpsパイプラインにより、デプロイ頻度を週1回から1日複数回へ改善。',
    techs:    ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus'],
  },
  {
    role:     'インフラエンジニア',
    company:  '株式会社〇〇',
    period:   '2020年4月 — 2022年3月',
    location: '東京都',
    desc:     '20以上のマイクロサービス向けCI/CDパイプラインを構築・保守。AnsibleとTerraformによるインフラプロビジョニングを自動化。PrometheusとGrafanaによる集中監視・アラートを整備し、平均復旧時間（MTTR）を40%削減。',
    techs:    ['AWS', 'Docker', 'Ansible', 'GitHub Actions', 'Grafana'],
  },
  {
    role:     'システムエンジニア',
    company:  '株式会社〇〇',
    period:   '2018年4月 — 2020年3月',
    location: '東京都',
    desc:     '500名以上のユーザーを対象にオンプレミスLinuxサーバーインフラを管理。支社向けネットワークアーキテクチャを設計・展開。シェルスクリプトとPythonによるシステム管理の自動化で、月20時間以上の工数を削減。',
    techs:    ['Linux', 'Python', 'VMware', 'ネットワーク', 'Shell'],
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

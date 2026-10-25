import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  {
    name: 'クラウド',
    skills: [
      { name: 'AWS',        level: 5, tags: ['EC2', 'EKS', 'RDS', 'S3', 'VPC'] },
      { name: 'GCP',        level: 3, tags: ['GKE', 'Cloud SQL', 'GCS'] },
      { name: 'Azure',      level: 3, tags: ['AKS', 'Azure SQL', 'Blob'] },
      { name: 'CloudFlare', level: 4, tags: ['CDN', 'DNS', 'Workers'] },
    ],
  },
  {
    name: 'コンテナ',
    skills: [
      { name: 'Kubernetes', level: 5, tags: ['Helm', 'RBAC', 'Ingress', 'CRDs'] },
      { name: 'Docker',     level: 5, tags: ['Compose', 'BuildKit', 'Registry'] },
      { name: 'Helm',       level: 4, tags: ['チャート', 'リリース', 'フック'] },
      { name: 'ArgoCD',     level: 4, tags: ['GitOps', '同期', 'ロールアウト'] },
    ],
  },
  {
    name: 'IaC・CI/CD',
    skills: [
      { name: 'Terraform',       level: 5, tags: ['モジュール', 'ステート', 'ワークスペース'] },
      { name: 'Ansible',         level: 4, tags: ['プレイブック', 'ロール', 'Vault'] },
      { name: 'GitHub Actions',  level: 4, tags: ['ワークフロー', 'ランナー', 'シークレット'] },
      { name: 'Jenkins',         level: 3, tags: ['パイプライン', 'Groovy', 'エージェント'] },
    ],
  },
  {
    name: '監視',
    skills: [
      { name: 'Prometheus', level: 4, tags: ['PromQL', 'AlertManager', 'エクスポーター'] },
      { name: 'Grafana',    level: 4, tags: ['ダッシュボード', 'アラート', 'Loki'] },
      { name: 'Datadog',    level: 3, tags: ['APM', 'ログ', 'メトリクス'] },
      { name: 'ELK Stack',  level: 3, tags: ['Elasticsearch', 'Logstash', 'Kibana'] },
    ],
  },
  {
    name: 'Linux・ネットワーク',
    skills: [
      { name: 'Linux',      level: 5, tags: ['Ubuntu', 'CentOS', 'シェル'] },
      { name: 'Python',     level: 4, tags: ['boto3', '自動化', 'FastAPI'] },
      { name: 'ネットワーク', level: 4, tags: ['VPN', 'BGP', 'Nginx', 'HAProxy'] },
      { name: 'セキュリティ', level: 3, tags: ['IAM', 'WAF', 'TLS', 'SIEM'] },
    ],
  },
]

function SkillCard({ name, level, tags, index }) {
  return (
    <motion.div
      className="skill-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="skill-card-header">
        <span className="skill-card-name">{name}</span>
        <div className="skill-dots">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`skill-dot${i < level ? ' on' : ''}`} />
          ))}
        </div>
      </div>
      <div className="skill-tags">
        {tags.map(tag => (
          <span key={tag} className="skill-tag">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(0)

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">技術スキル</span>
          <h2 className="section-title">技術スタック</h2>
          <span className="section-title-jp">Tech Stack</span>
        </motion.div>

        <div className="skills-tabs">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              className={`skills-tab${active === i ? ' active' : ''}`}
              onClick={() => setActive(i)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <div className="skills-grid" key={active}>
            {CATEGORIES[active].skills.map((skill, i) => (
              <SkillCard key={skill.name} {...skill} index={i} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const PROJECTS = [
  {
    title:    'マルチリージョンAWSインフラ',
    desc:     'Terraformを使用して高可用性のマルチリージョンAWSアーキテクチャを設計。VPCピアリング、Route 53フェイルオーバー、RDS Multi-AZ、ap-northeast-1とap-southeast-1にまたがるEKSノードグループを含む完全なGitOpsデプロイパイプライン。',
    techs:    ['Terraform', 'AWS', 'EKS', 'RDS', 'Route 53'],
    github:   '#',
    featured: true,
  },
  {
    title:    'ArgoCDによるGitOpsプラットフォーム',
    desc:     'Kubernetes上でArgoCDを使った完全なGitOpsプラットフォームを構築。Gitでアプリケーションマニフェストを管理し、30以上のマイクロサービスへの自動同期・ヘルスチェック・ロールバックを実現。',
    techs:    ['Kubernetes', 'ArgoCD', 'Helm', 'GitHub Actions'],
    github:   '#',
    featured: false,
  },
  {
    title:    'オブザーバビリティスタック',
    desc:     'Prometheus、Grafana、Loki、Tempoを組み合わせた包括的な可観測性プラットフォームを構築。インフラメトリクス、アプリログ、分散トレースのカスタムダッシュボードを整備。',
    techs:    ['Prometheus', 'Grafana', 'Loki', 'Tempo'],
    github:   '#',
    featured: false,
  },
  {
    title:    'Kubernetesコスト最適化ツール',
    desc:     'K8sリソース使用状況を分析し、適切なサイジングのTerraform推奨事項を生成するPythonツール。インフラコストを30%削減。',
    techs:    ['Python', 'Kubernetes', 'boto3', 'Terraform'],
    github:   '#',
    featured: false,
  },
  {
    title:    'ゼロダウンタイムDBマイグレーション',
    desc:     'AWS DMSを使ったオンプレミスからAWS RDSへのPostgreSQLゼロダウンタイム移行を指揮。デュアルライト戦略と自動カットオーバースクリプトで無停止移行を実現。',
    techs:    ['AWS DMS', 'PostgreSQL', 'Python', 'Ansible'],
    github:   '#',
    featured: false,
  },
  {
    title:    'ネットワークセキュリティ自動化',
    desc:     'PythonとBoto3によるAWSセキュリティグループ管理の自動化。JIRAワークフロー承認と完全な監査証跡によりコンプライアンスを強化。',
    techs:    ['Python', 'boto3', 'AWS', 'Lambda', 'JIRA'],
    github:   '#',
    featured: false,
  },
]

function ProjectCard({ title, desc, techs, github, featured, index }) {
  return (
    <motion.article
      className={`project-card${featured ? ' featured' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="project-number">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{desc}</p>

      <div className="project-footer">
        <div className="project-techs">
          {techs.map(t => (
            <span key={t} className="project-tech">{t}</span>
          ))}
        </div>
        <a href={github} className="project-link" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">実績</span>
          <h2 className="section-title">プロジェクト</h2>
          <span className="section-title-jp">Projects</span>
        </motion.div>

        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

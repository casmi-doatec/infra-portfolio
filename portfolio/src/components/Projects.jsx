import { useEffect, useRef } from 'react'

const PROJECTS = [
  {
    num: '01',
    title: '出張買取プラス',
    period: '2025.11 — 2026.9',
    desc: 'フランチャイズ本部向け予約管理システム。要件定義からGCP運用まで一人で担当。Claude Codeを活用したAI駆動開発。',
    techs: ['Next.js', 'Node.js', 'PostgreSQL', 'GCP'],
    img: '/project-01.png',
    featured: true,
  },
  {
    num: '02',
    title: 'SNS広告分析システム',
    period: '2025.3 — 2025.10',
    desc: 'SNS広告データのリアルタイム分析基盤。scikit-learnで異常検知モデルを構築し、広告パフォーマンスを可視化。',
    techs: ['Django', 'Python', 'Pandas', 'scikit-learn', 'AWS'],
    img: '/project-02.png',
  },
  {
    num: '03',
    title: 'AI動画生成プラットフォーム',
    period: '2023.10 — 2025.2',
    desc: 'AI動画生成のフルスクラッチ開発。生成ジョブ管理・課金機能・Salesforce連携を設計・実装。',
    techs: ['Next.js', 'Ruby on Rails', 'Supabase', 'Salesforce'],
    img: '/project-03.png',
  },
  {
    num: '04',
    title: 'リアルタイムチャットシステム',
    period: '2021.11 — 2023.5',
    desc: 'Atomic Design + クリーンアーキテクチャで構築。Socket.IOによるリアルタイム通信とCI/CD・自動テストを導入。',
    techs: ['Next.js', 'Express', 'Socket.IO', 'Docker'],
    img: '/project-04.png',
  },
  {
    num: '05',
    title: '製造業向け資料検索システム',
    period: '2020.7 — 2021.9',
    desc: '仕様書・図面を対象としたRAGベース全文検索基盤。VectorDBでアクセス制御付き検索を実現。',
    techs: ['Python', 'LangChain', 'VectorDB', 'Next.js'],
    img: '/project-05.png',
  },
  {
    num: '06',
    title: '社内業務管理システム',
    period: '2018.5 — 2020.6',
    desc: '勤怠・申請・承認ワークフローを一元管理。Laravel Sanctumで認証・権限制御を実装。',
    techs: ['Laravel', 'Vue.js', 'PostgreSQL', 'Docker'],
    img: '/project-06.png',
  },
  {
    num: '07',
    title: 'オンライン講義システム',
    period: '2017.10 — 2018.4',
    desc: '講義・動画・受講履歴を管理するシステム。React + Node.jsで構築し、AWS環境へデプロイ。',
    techs: ['React', 'Node.js', 'Express', 'MySQL', 'AWS'],
    img: '/project-07.png',
  },
]

function ProjectCard({ project, delay }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`project-card project-card-anim${project.featured ? ' featured' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img className="project-img" src={project.img} alt={project.title} />
      <div className="project-body">
        <div className="project-meta">
          <span className="project-number">{project.num}</span>
          <span className="project-period">{project.period}</span>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>
        <div className="project-footer">
          <div className="project-techs">
            {project.techs.map(t => (
              <span key={t} className="project-tech">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="projects-bg-sticky">
        <div
          className="section-bg-img"
          style={{ backgroundImage: "url('/projects-bg.png')" }}
        />
      </div>
      <div className="projects-content">
        <div className="projects-panel">
          <span className="section-label">プロジェクト</span>
          <h2 className="section-title">Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.num} project={p} delay={i * 100} />
            ))}
          </div>
        </div>
        <div className="projects-spacer" />
      </div>
    </section>
  )
}

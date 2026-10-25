import { motion } from 'framer-motion'

/* TODO: Replace with your actual projects */
const PROJECTS = [
  {
    title:    'Multi-Region AWS Infrastructure',
    desc:     'Designed a highly available, multi-region AWS architecture using Terraform. Includes VPC peering, Route 53 failover, RDS Multi-AZ, and EKS node groups across ap-northeast-1 and ap-southeast-1. Full GitOps deployment pipeline.',
    techs:    ['Terraform', 'AWS', 'EKS', 'RDS', 'Route 53'],
    github:   '#',   /* TODO: add your GitHub URL */
    featured: true,
  },
  {
    title:    'GitOps Platform with ArgoCD',
    desc:     'Implemented a complete GitOps platform using ArgoCD on Kubernetes. Application manifests in Git, automated sync, health checks, and rollback for 30+ microservices.',
    techs:    ['Kubernetes', 'ArgoCD', 'Helm', 'GitHub Actions'],
    github:   '#',
    featured: false,
  },
  {
    title:    'Observability Stack',
    desc:     'Built a comprehensive observability platform: Prometheus, Grafana, Loki, and Tempo. Custom dashboards for infra metrics, application logs, and distributed traces.',
    techs:    ['Prometheus', 'Grafana', 'Loki', 'Tempo'],
    github:   '#',
    featured: false,
  },
  {
    title:    'Kubernetes Cost Optimizer',
    desc:     'Python tool that analyses K8s resource usage and generates Terraform recommendations for right-sizing, achieving 30% infrastructure cost reduction.',
    techs:    ['Python', 'Kubernetes', 'boto3', 'Terraform'],
    github:   '#',
    featured: false,
  },
  {
    title:    'Zero-Downtime DB Migration',
    desc:     'Orchestrated zero-downtime migration of PostgreSQL from on-premise to AWS RDS using DMS, with dual-write strategy and automated cutover scripts.',
    techs:    ['AWS DMS', 'PostgreSQL', 'Python', 'Ansible'],
    github:   '#',
    featured: false,
  },
  {
    title:    'Network Security Automation',
    desc:     'Automated AWS security group management with Python and boto3. Integrated JIRA workflow approval and full audit trail for compliance.',
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
          <span className="section-label">Work</span>
          <h2 className="section-title">Projects</h2>
          <span className="section-title-jp">プロジェクト</span>
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

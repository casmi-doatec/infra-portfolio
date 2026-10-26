import { useEffect, useRef } from 'react'

const SKILLS = [
  {
    category: 'Cloud (AWS)',
    items: ['EC2', 'EKS', 'VPC', 'S3', 'RDS', 'Route 53', 'IAM', 'ALB', 'CloudFront'],
  },
  {
    category: 'Container & Orchestration',
    items: ['Kubernetes', 'Docker', 'Helm'],
  },
  {
    category: 'IaC & Automation',
    items: ['Terraform', 'Ansible', 'CloudFormation'],
  },
  {
    category: 'CI/CD & GitOps',
    items: ['ArgoCD', 'GitHub Actions', 'Jenkins'],
  },
  {
    category: 'Monitoring',
    items: ['Prometheus', 'Grafana', 'CloudWatch'],
  },
  {
    category: 'Languages & Scripts',
    items: ['Python', 'Bash', 'Shell Script', 'YAML', 'SQL'],
  },
  {
    category: 'OS & Network',
    items: ['Linux', 'Nginx', 'TCP/IP', 'VMware'],
  },
]

function SkillGroup({ category, items, delay }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="skill-group" style={{ transitionDelay: `${delay}ms` }}>
      <span className="skill-group-label">{category}</span>
      <div className="skill-chips">
        {items.map(item => (
          <span key={item} className="skill-chip">{item}</span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="skills-section section-with-bg">
      <div className="section-bg-img" style={{ backgroundImage: "url('/skills-bg.png')" }} />
      <div className="skills-content">
        <div className="skills-panel">
          <span className="section-label">スキル</span>
          <h2 className="section-title">Skills</h2>
          <div className="skills-groups">
            {SKILLS.map((group, i) => (
              <SkillGroup
                key={group.category}
                category={group.category}
                items={group.items}
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

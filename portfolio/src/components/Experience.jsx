import { motion } from 'framer-motion'

/* TODO: Replace with your actual work history */
const EXPERIENCE = [
  {
    role:    'Senior Infrastructure Engineer',
    company: 'Company Name',
    period:  '2022.04 — Present',
    location: 'Tokyo, Japan',
    desc:    'Led migration of monolithic applications to microservices on EKS. Designed and implemented multi-region AWS infrastructure using Terraform. Reduced deployment frequency from weekly to multiple times per day via GitOps pipelines with ArgoCD.',
    techs:   ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'Prometheus'],
  },
  {
    role:    'Infrastructure Engineer',
    company: 'Company Name',
    period:  '2020.04 — 2022.03',
    location: 'Tokyo, Japan',
    desc:    'Built and maintained CI/CD pipelines for 20+ microservices. Automated infrastructure provisioning with Ansible and Terraform. Implemented centralized monitoring and alerting with Prometheus and Grafana, reducing MTTR by 40%.',
    techs:   ['AWS', 'Docker', 'Ansible', 'GitHub Actions', 'Grafana'],
  },
  {
    role:    'Systems Engineer',
    company: 'Company Name',
    period:  '2018.04 — 2020.03',
    location: 'Tokyo, Japan',
    desc:    'Managed on-premise Linux server infrastructure for 500+ users. Designed and deployed network architecture for branch offices. Automated system administration tasks with shell scripts and Python, saving 20+ hours per month.',
    techs:   ['Linux', 'Python', 'VMware', 'Networking', 'Shell'],
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
          <span className="section-label">Career</span>
          <h2 className="section-title">Experience</h2>
          <span className="section-title-jp">職務経歴</span>
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

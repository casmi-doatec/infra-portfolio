import { motion } from 'framer-motion'

/* TODO: Replace all "#" links and "your@email.com" with real values */
const LINKS = [
  { label: 'GitHub',   href: '#', icon: '⌥' },
  { label: 'LinkedIn', href: '#', icon: '⊞' },
  { label: 'Twitter/X', href: '#', icon: '✕' },
]

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          className="contact-wrapper"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">Contact</span>

          <h2 className="contact-heading">
            Let's build something<br /><span>together.</span>
          </h2>
          <p className="contact-sub">
            Open to full-time roles, contract work, and interesting
            infrastructure challenges. Reach out anytime —
            I reply within 24 hours.
          </p>

          {/* TODO: Replace with your actual email */}
          <a href="mailto:your@email.com" className="contact-email-btn">
            Send Email →
          </a>

          <div className="contact-divider" />

          <div className="contact-links">
            {LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                className="contact-link"
                target="_blank"
                rel="noreferrer"
              >
                <span>{icon}</span>
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

const LINKS = [
  { label: 'GitHub',    href: '#', icon: '⌥' },
  { label: 'LinkedIn',  href: '#', icon: '⊞' },
  { label: 'Twitter/X', href: '#', icon: '✕' },
]

export default function Contact() {
  return (
    <section id="contact" className="contact-section section-with-bg">
      <div className="section-bg-img" style={{ backgroundImage: "url('/contact-bg.png')" }} />
      <div className="section-bg-overlay" />
      <div className="container">
        <div className="section-left-content">
          <motion.div
            className="contact-wrapper"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label">お問い合わせ</span>

            <h2 className="contact-heading">
              一緒に、何かを<br /><span>つくりませんか。</span>
            </h2>
            <p className="contact-sub">
              正社員・業務委託・副業など、インフラに関するご相談はお気軽にどうぞ。
              24時間以内に返信いたします。
            </p>

            <a href="mailto:your@email.com" className="contact-email-btn">
              メールを送る →
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
      </div>
    </section>
  )
}

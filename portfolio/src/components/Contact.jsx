import { useEffect, useRef, useState } from 'react'

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="contact-fade" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`【ポートフォリオ】${form.name}様からのお問い合わせ`)
    const body = encodeURIComponent(
      `お名前: ${form.name}\nメール: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:snowdev39@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="contact-section section-with-bg">
      <div className="section-bg-img" style={{ backgroundImage: "url('/contact-bg.png')" }} />
      <div className="contact-content">
        <div className="contact-panel">
          <FadeIn>
            <span className="section-label">お問い合わせ</span>
            <h2 className="contact-heading">
              Contact
            </h2>
          </FadeIn>

          <FadeIn delay={150}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label" htmlFor="name">お名前</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="contact-input"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="email">メールアドレス</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="contact-input"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="message">お問い合わせ内容</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="contact-input contact-textarea"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="contact-submit">
                {sent ? '送信しました' : '送信する'}
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

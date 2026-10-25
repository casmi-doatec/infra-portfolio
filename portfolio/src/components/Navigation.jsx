import { useEffect, useState } from 'react'

const LINKS = [
  { label: '自己紹介', href: '#about'      },
  { label: 'スキル',   href: '#skills'     },
  { label: '実績',     href: '#projects'   },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <div className="nav-logo-mark">武</div>
          <span className="nav-logo-text">武田 泰治</span>
        </a>

        <ul className="nav-links">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta">お問い合わせ</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

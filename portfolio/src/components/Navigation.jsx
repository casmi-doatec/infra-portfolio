import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
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
          <div className="nav-logo-mark">山</div>
          {/* TODO: Replace "Your Name" with your actual name */}
          <span className="nav-logo-text">Your Name</span>
        </a>

        <ul className="nav-links">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

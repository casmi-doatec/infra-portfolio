import { useEffect, useRef, useState } from 'react'

// Each segment: { text, highlight?, color?, size?, break? }
const LINES = [
  [
    { text: 'どんなに美しい建物も、' },
    { text: '基礎', highlight: true, color: '#e8553d', size: '1.6em' },
    { text: 'が崩れたら' },
    { text: 'おしまい。', highlight: true, color: '#d4502a' },
  ],
  [
    { text: 'でも、その基礎を' },
    { text: '毎日見つめている人', highlight: true, color: '#2e86de', size: '1.15em' },
    { text: 'は' },
  ],
  [
    { text: 'ほとんど' },
    { text: 'いない', highlight: true, color: '#e8553d', size: '1.4em' },
    { text: '。' },
  ],
  [],
  [
    { text: 'サーバーが落ちた瞬間、みんなが気づく。' },
  ],
  [
    { text: '「あれ？' },
    { text: 'ネット繋がらない', highlight: true, color: '#e55039' },
    { text: 'んだけど」' },
  ],
  [
    { text: '「デプロイ、なんか' },
    { text: '壊れてない？', highlight: true, color: '#e55039' },
    { text: '」' },
  ],
  [],
  [
    { text: 'そう、インフラは' },
    { text: '空気', highlight: true, color: '#2e86de', size: '1.8em' },
    { text: 'みたいなもの。' },
  ],
  [
    { text: 'あって' },
    { text: '当たり前', highlight: true, color: '#e8553d', size: '1.3em' },
    { text: '。なくなったら' },
    { text: '大パニック', highlight: true, color: '#d63031', size: '1.5em' },
    { text: '。' },
  ],
  [],
  [
    { text: '僕は、その「' },
    { text: '見えない世界', highlight: true, color: '#0abde3', size: '1.2em' },
    { text: '」を' },
  ],
  [
    { text: '8年間', highlight: true, color: '#e8553d', size: '2em' },
    { text: 'ずっと守り続けてきた。' },
  ],
  [],
  [
    { text: 'AWS、Kubernetes、Terraform ──' },
  ],
  [
    { text: 'クラウドの奥深く', highlight: true, color: '#2e86de' },
    { text: 'で、' },
  ],
  [
    { text: '誰も見ていない場所', highlight: true, color: '#6c5ce7', size: '1.15em' },
    { text: 'を' },
  ],
  [
    { text: 'せっせと' },
    { text: '整えるのが好き', highlight: true, color: '#e8553d', size: '1.2em' },
    { text: 'なんです。' },
  ],
  [],
  [
    { text: '地味？  うん、' },
    { text: 'めちゃくちゃ地味', highlight: true, color: '#d63031', size: '1.3em' },
    { text: '。' },
  ],
  [
    { text: 'でも、この地味さが' },
  ],
  [
    { text: '世界を支えてる', highlight: true, color: '#e8553d', size: '1.6em' },
    { text: 'って' },
  ],
  [
    { text: '本気で思ってます。', highlight: true, color: '#2e86de' },
  ],
]

// Flatten all segments into characters with metadata
function buildCharacters() {
  const chars = []
  for (const line of LINES) {
    if (line.length === 0) {
      chars.push({ char: '\n', highlight: false })
      continue
    }
    for (const seg of line) {
      for (const ch of seg.text) {
        chars.push({
          char: ch,
          highlight: !!seg.highlight,
          color: seg.color || null,
          size: seg.size || null,
        })
      }
    }
    chars.push({ char: '\n', highlight: false })
  }
  return chars
}

const ALL_CHARS = buildCharacters()

export default function About() {
  const sectionRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [started, setStarted] = useState(false)

  // Start typewriter when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  // Typewriter tick
  useEffect(() => {
    if (!started || visibleCount >= ALL_CHARS.length) return
    const ch = ALL_CHARS[visibleCount]
    // Pause longer on line breaks and punctuation
    let delay = 35
    if (ch.char === '\n') delay = 220
    else if ('。、！？」』）'.includes(ch.char)) delay = 120
    else if (ch.highlight) delay = 50

    const timer = setTimeout(() => setVisibleCount(c => c + 1), delay)
    return () => clearTimeout(timer)
  }, [started, visibleCount])

  // Render characters
  const rendered = []
  let lineIndex = 0
  let lineChars = []

  const flushLine = () => {
    if (lineChars.length === 0) {
      rendered.push(<div key={`br-${lineIndex}`} className="about-line about-line-blank" />)
    } else {
      rendered.push(
        <div key={`line-${lineIndex}`} className="about-line">
          {lineChars}
        </div>,
      )
    }
    lineChars = []
    lineIndex++
  }

  for (let i = 0; i < visibleCount && i < ALL_CHARS.length; i++) {
    const c = ALL_CHARS[i]
    if (c.char === '\n') {
      flushLine()
      continue
    }
    const style = {}
    if (c.color) style.color = c.color
    if (c.size) style.fontSize = c.size
    const cls = c.highlight ? 'about-char about-char-hl' : 'about-char'
    lineChars.push(
      <span key={i} className={cls} style={style}>
        {c.char}
      </span>,
    )
  }
  // Flush remaining line + cursor
  if (lineChars.length > 0 || visibleCount > 0) {
    if (visibleCount < ALL_CHARS.length) {
      lineChars.push(<span key="cursor" className="about-cursor">|</span>)
    }
    flushLine()
  }

  return (
    <section id="about" ref={sectionRef} className="about-section section-with-bg">
      <div className="section-bg-img" style={{ backgroundImage: "url('/about-bg.png')" }} />
      <div className="about-overlay" />
      <div className="about-text-area">
        {rendered}
      </div>
    </section>
  )
}

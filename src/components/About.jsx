import { useEffect, useRef } from 'react'

const LINES = [
  [
    { text: '誰かが安心して「送信」を押せるのは、' },
  ],
  [
    { text: '見えないところ', hl: true, color: '#dda0ff', size: '1.2em' },
    { text: 'で、誰かが静かに支えてるから。' },
  ],
  [],
  [
    { text: '僕はその「' },
    { text: '誰か', hl: true, color: '#ffeb3b', size: '1.5em' },
    { text: '」。' },
  ],
  [],
  [
    { text: 'よく聞かれる。' },
  ],
  [
    { text: '「なんで目立たない仕事を？」' },
  ],
  [],
  [
    { text: '好き', hl: true, color: '#ffeb3b', size: '1.8em' },
    { text: 'だから、かな。' },
  ],
  [],
  [
    { text: '壊れないように設計して、' },
  ],
  [
    { text: '壊れても、すぐ元に戻せるようにして。' },
  ],
  [
    { text: 'その' },
    { text: '安心感', hl: true, color: '#a8f0d0', size: '1.3em' },
    { text: 'をつくるのが、たまらなく好き。' },
  ],
  [],
  [
    { text: 'Linuxの黒い画面', hl: true, color: '#a8f0d0' },
    { text: 'から始まって、' },
  ],
  [
    { text: '気づいたら' },
    { text: '8年', hl: true, color: '#ffeb3b', size: '2em' },
    { text: '。' },
  ],
  [],
  [
    { text: '今は' },
    { text: 'クラウドの空の上', hl: true, color: '#a8f0d0', size: '1.2em' },
    { text: 'で、' },
  ],
  [
    { text: '同じことをしてる。' },
  ],
  [],
  [
    { text: '技術は変わった。' },
  ],
  [
    { text: '守りたい気持ち', hl: true, color: '#dda0ff', size: '1.3em' },
    { text: 'は、変わらない。' },
  ],
  [],
  [
    { text: '「今日も何も起きなかったね」' },
  ],
  [
    { text: '── それが、僕の' },
    { text: '最高の褒め言葉', hl: true, color: '#ffeb3b', size: '1.6em' },
    { text: '。' },
  ],
]

function AboutLine({ segments }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (segments.length === 0) return <div className="about-line about-line-blank" />

  return (
    <div ref={ref} className="about-line">
      {segments.map((seg, i) => (
        <span
          key={i}
          className={seg.hl ? 'about-seg about-seg-hl' : 'about-seg'}
          style={{
            ...(seg.color && { color: seg.color }),
            ...(seg.size && { fontSize: seg.size }),
          }}
        >
          {seg.text}
        </span>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-bg-sticky">
        <div
          className="section-bg-img"
          style={{ backgroundImage: "url('/about-bg.png')" }}
        />
      </div>
      <div className="about-text-flow">
        <div className="about-text-spacer" />
        {LINES.map((line, i) => (
          <AboutLine key={i} segments={line} />
        ))}
        <div className="about-text-spacer" />
      </div>
    </section>
  )
}

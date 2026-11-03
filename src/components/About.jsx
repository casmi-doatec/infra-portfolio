import { useEffect, useRef } from 'react'

const LINES = [
  [
    { text: '「AIって、すごいですね」' },
  ],
  [
    { text: 'そう言われるたびに、思う。' },
  ],
  [
    { text: 'すごいのは、' },
    { text: 'モデルだけじゃない', hl: true, color: '#dda0ff', size: '1.2em' },
    { text: 'って。' },
  ],
  [],
  [
    { text: '画面を設計して、APIを書いて、' },
  ],
  [
    { text: 'データを整えて、プロンプトを磨いて、' },
  ],
  [
    { text: '精度を測って、また改善する。' },
  ],
  [
    { text: 'そのすべてがそろって、はじめて' },
  ],
  [
    { text: '「使えるAI」', hl: true, color: '#ffeb3b', size: '1.5em' },
    { text: 'になる。' },
  ],
  [],
  [
    { text: '僕は、その' },
    { text: '全工程', hl: true, color: '#a8f0d0', size: '1.3em' },
    { text: 'を一人で持てるエンジニア。' },
  ],
  [],
  [
    { text: 'よく聞かれる。' },
  ],
  [
    { text: '「フロントも、バックも、AIも全部やるの？」' },
  ],
  [],
  [
    { text: 'やる、というより、' },
    { text: 'つなげたい', hl: true, color: '#ffeb3b', size: '1.8em' },
    { text: '。' },
  ],
  [
    { text: 'ユーザーの一言からモデルの出力まで、' },
  ],
  [
    { text: 'ひとつの線で見ていたいから。' },
  ],
  [],
  [
    { text: 'Webアプリ開発', hl: true, color: '#a8f0d0' },
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
    { text: 'LLM・RAG・AIエージェント', hl: true, color: '#a8f0d0', size: '1.2em' },
    { text: 'で、' },
  ],
  [
    { text: '現場の仕事を変えるプロダクトをつくってる。' },
  ],
  [],
  [
    { text: '技術は、どんどん変わる。' },
  ],
  [
    { text: '「ちゃんと役に立つものをつくる」', hl: true, color: '#dda0ff', size: '1.3em' },
    { text: 'は、変わらない。' },
  ],
  [],
  [
    { text: '「もう、これなしじゃ仕事できないよ」' },
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

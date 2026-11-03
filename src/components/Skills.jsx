import { useEffect, useRef } from 'react'

const SKILLS = [
  {
    category: 'LLM & Generative AI',
    items: ['Claude API', 'OpenAI API', 'Tool Use', 'Structured Output', 'Prompt Engineering', 'Fine-tuning'],
  },
  {
    category: 'RAG & Agents',
    items: ['LangChain', 'LangGraph', 'LlamaIndex', 'MCP', 'Embeddings', 'Hybrid Search', 'Reranking'],
  },
  {
    category: 'Evaluation & MLOps',
    items: ['LLM-as-a-Judge', 'Langfuse', 'MLflow', 'PyTorch', 'Hugging Face'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Streaming UI'],
  },
  {
    category: 'Backend & API',
    items: ['Python', 'FastAPI', 'Node.js', 'REST', 'WebSocket', 'SSE'],
  },
  {
    category: 'Data & Vector DB',
    items: ['PostgreSQL', 'pgvector', 'Pinecone', 'Redis', 'MongoDB'],
  },
  {
    category: 'Cloud & Delivery',
    items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
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

import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ForestBackground from './components/ForestBackground'
import FallingLeaves from './components/FallingLeaves'

function App() {
  return (
    <>
      <ForestBackground />
      <FallingLeaves count={3} />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-jp">武田 泰治</span>
          <span className="footer-sep">·</span>
          <span>インフラエンジニア</span>
          <span className="footer-sep">·</span>
          <span>© 2024</span>
        </div>
      </footer>
    </>
  )
}

export default App

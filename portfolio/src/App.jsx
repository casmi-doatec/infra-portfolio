import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'

function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-jp">インフラエンジニア</span>
          <span className="footer-sep">·</span>
          <span>Infrastructure Engineer</span>
          <span className="footer-sep">·</span>
          <span>© 2024</span>
        </div>
      </footer>
    </>
  )
}

export default App

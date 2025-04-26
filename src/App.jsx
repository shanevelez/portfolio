import './index.css';
import ProjectList from './components/ProjectList';
import About from './components/About';
import ContactForm from './components/ContactForm';
import { useEffect } from 'react';
import useInView from './hooks/useInView';
import { Analytics } from "@vercel/analytics/react"


function App() {
    
	const [contactRef, contactVisible] = useInView(0.2);
		return (
		<>
    <div className="min-h-screen w-screen overflow-x-hidden bg-slate-900 pb-5 text-white">
  
      <header className="text-center pt-6 px-4">
        <h1 className="text-5xl font-bold mb-4">Shane Velez</h1>
        <h2 className="text-3xl font-medium text-sky-300 mb-4">Head of Data & Management Information Systems</h2>

		<p className="mb-8 max-w-xl mx-auto">
          Self-taught, tech-agnostic, and relentlessly resourceful. I built this portfolio in React + Tailwind to show I can pick up any tech.
        </p>
      </header>


      <section id="projects" className="pb-2 px-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center">Projects</h2>
          <a
  href="#contact"
  className="text-center block text-sm text-sky-400 hover:underline mt-2 transition"
>
  Demos available upon request
</a>
          <ProjectList />
        </div>
      </section>

      
      <section
        id="about"
        className="mt-10 max-w-7xl mx-auto px-0 md:flex md:items-center"
      >
        <About />
      </section>

  
     <section
        ref={contactRef}
        id="contact"
        className={`mt-20 transition-opacity duration-2000 ease-out ${
          contactVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ContactForm />
      </section>
<footer className="mt-12 text-center text-sm text-slate-500 pb-6 space-x-4">
  <a
    href="https://www.linkedin.com/in/shane-velez-3096926a/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-sky-400 transition"
  >
    Connect with me on LinkedIn
  </a>
  <span>|</span>
  <a
    href="https://github.com/shanevelez/portfolio"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-sky-400 transition"
  >
    View source on GitHub
  </a>
</footer>

	</div>
	<Analytics/>
	</>
  );
}

export default App;

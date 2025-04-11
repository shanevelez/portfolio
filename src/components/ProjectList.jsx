import { useState, useEffect, useRef } from 'react';
import projects from '../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

function easeOutQuad(t) {
  return t * (2 - t);
}

function animateScroll(element, to, duration = 800) {
  const start = element.scrollLeft;
  const change = to - start;
  const startTime = performance.now();

  function step(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 2);
    const ease = easeOutQuad(progress);
    element.scrollLeft = start + change * ease;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const ProjectList = () => {

const scrollRef = useRef(null);

useEffect(() => {
  const scroller = scrollRef.current;
  if (!scroller) return;

  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;

  const scrollDistance = 100; 
  const scrollDuration = 800;

  const forwardScroll = () => {
    animateScroll(scroller, scrollDistance, scrollDuration);
    setTimeout(() => {
      animateScroll(scroller, 0, scrollDuration);
    }, scrollDuration + 200);
  };

  const timeoutId = setTimeout(forwardScroll, 600); 

  return () => clearTimeout(timeoutId);
}, []);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.Category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.Category === selectedCategory);

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="text-white">
      

      {/* Scrollable Card List */}
      <div
  ref={scrollRef}
  className="md:h-[300px] overflow-x-auto scrollbar-stable scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800 px-4 py-4 mt-6"
style={{ overflowAnchor: 'none' }}
>

        <div className="flex space-x-6 w-max">
          {filteredProjects.map((project, index) => (
            <div key={index} onClick={() => handleCardClick(project)}>
              <ProjectCard
                title={project.Project}
                category={project.Category}
              />
            </div>
          ))}
        </div>
      
	  </div>
{/* Mobile Dropdown Filter */}
      <div className="md:hidden mt-6 px-4">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="w-full bg-slate-800 text-white border border-sky-400 rounded-md px-4 py-2 text-sm"
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Filter Pills */}
      <div className="hidden md:flex justify-center mt-4">
        <div className="flex items-center space-x-4">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat;

            return (
              <span
  key={idx}
  onClick={() => setSelectedCategory(cat)}
  className={`
    cursor-pointer inline-block text-sky-400 hover:text-sky-300 transition
    text-sm px-4 py-1 leading-tight rounded-full text-center w-fit
    ${isActive ? 'ring-1 ring-sky-400' : ''}
  `}
>
  {cat}
</span>
            );
          })}
        </div>
      </div>
      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;

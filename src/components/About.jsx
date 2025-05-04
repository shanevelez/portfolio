import { useState } from 'react';
import aboutMePhoto from '../media/aboutme.jpg';
import CvModal from './CvModal';

const About = () => {
  const [expanded, setExpanded] = useState(false);
const [showCv, setShowCv] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-6 max-w-6xl mx-auto">
      {/* Photo */}
      <div className="md:w-1/3 flex-shrink-0">
        <img
          src={aboutMePhoto}
          alt="Shane Velez"
          className="rounded-full w-48 h-48 md:w-48 md:h-48 object-cover mx-auto border-4 border-slate-700 shadow-lg"
        />
      </div>

      {/* Text */}
      <div className="md:w-2/3 text-slate-300">
        <h2 className="text-3xl font-bold text-white mb-4">About Me</h2>
        
        <p className="text-sm leading-relaxed mb-4">
          I didn’t start out in tech — I started by solving problems. I’ve always had an instinct for how technology works, and an ability to pick up new tools quickly. This portfolio is meant to serve as proof of concept. I’d never heard of React or Tailwind before building it, but a bit of research told me they were the best tools for the job.
        </p>

{!expanded ? (
  <div className="flex gap-4">
    <button
      onClick={() => {
        if (typeof umami === 'object' && typeof umami.track === 'function') {
          umami.track('Clicked About Read More');
        }
        setExpanded(true);
      }}
      className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
    >
      Read more →
    </button>

    <button
      onClick={() => {
        if (typeof umami === 'object' && typeof umami.track === 'function') {
          umami.track('Clicked View CV');
        }
        setShowCv(true);
      }}
      className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
    >
      View CV
    </button>
  </div>
) : (

          <>
            <p className="text-sm leading-relaxed mb-4">
              When I joined a school as Administrator for Senior Leadership, my role had nothing to do with automation or development. On my first day, I was given a desk, some quiet admin tasks and a filing cabinet full of paper leave request forms. I wasn’t busy. But I noticed how much time and effort went into basic processes around the school. So I started thinking about how they could work better.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              I began building digital systems — first with what was available: Power Automate, PowerApps, SharePoint. Then with whatever tool the challenge required.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              Over the past 5 years, I’ve built dozens of custom tools across every operational area of a 1000+ student school — from leave requests, detentions, and performance tracking, to safeguarding, procurement, admissions, and more. The 17 projects in this portfolio represent a small slice of that work. Altogether, my systems have replaced countless manual workflows, automated thousands of hours of admin time, and continue to run independently without oversight. I’ve been promoted twice, and now serve as the school’s Head of Data & Management Information Systems.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              I taught myself Power Platform because it came bundled with the school’s Microsoft license. I taught myself Python when Power Automate couldn’t process 100,000 rows of student assessment data. I taught myself React and Tailwind just to build this site — because if I’m going to present myself to the industry, I want to do it properly.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              I don’t just learn new technologies — I seek out inefficiencies, design solutions, and build systems that work.
            </p>
            <p className="text-sm leading-relaxed mb-4 italic">
              No budget. No team. No roadmap. Just curiosity, adaptability, and a bias for getting things done.
            </p>
            <p className="text-sm leading-relaxed mb-4">
              Now I’m ready to take what I’ve learned to a new environment — to work with a team, contribute at scale, and keep solving problems that matter.
            </p>

            <div className="mt-6 text-sm text-slate-400">
              <p>📅 5+ years building internal tools</p>
              <p>🧩 50+ systems and automations deployed</p>
              <p>⏳ Thousands of hours of admin time saved</p>
            </div>

     <div className="flex gap-4 mt-4">
  <button
    onClick={() => setExpanded(false)}
    className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
  >
    Show less ↑
  </button>

  <button
    onClick={() => {
      if (typeof umami === 'object' && typeof umami.track === 'function') {
        umami.track('Clicked View CV');
      }
      setShowCv(true);
    }}
    className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
  >
    View CV
  </button>
</div>
          </>
        )}
      </div>
 {showCv && <CvModal onClose={() => setShowCv(false)} />}
   
   </div>
 );
};

export default About;

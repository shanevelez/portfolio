import cvPdf from '../media/CV.pdf';

const Section = ({ title, children }) => (
  <div className="border-b border-slate-700 py-4">
    <details className="group">
      <summary className="cursor-pointer text-lg font-semibold flex justify-between items-center">
        {title}
        <span className="text-sm text-slate-400 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="mt-2 text-sm text-slate-300">
        {children}
      </div>
    </details>
  </div>
);

const CvModal = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-800 text-white max-w-3xl w-full mx-4 rounded-xl shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-white text-xl z-20"
        >
          &times;
        </button>

        <div className="p-6 pt-6 max-h-[90vh] overflow-y-auto">
         <div className="pr-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
  <h2 className="text-2xl font-bold">Shane Velez</h2>
  <a
  href="#contact"
  onClick={() => {
    onClose(); // closes modal
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300); // wait for modal to finish closing
  }}
  className="text-sm font-medium text-sky-400 hover:text-sky-300 transition"
>
  📬 Contact Me
</a>
  <a
    href={cvPdf}
    download
    className="text-sm font-medium text-sky-400 hover:text-sky-300 transition"
    onClick={() => {
      if (typeof umami === 'object' && typeof umami.track === 'function') {
        umami.track('Downloaded CV');
      }
    }}
  >
    ⬇ Download PDF
  </a>
  
</div>


          <Section title="Professional Profile">
            <p>
              Business Process Automation Architect with over five years of experience designing and delivering scalable, secure, and maintainable digital solutions. Expert in leveraging Microsoft Power Platform (Power Apps, Power Automate), SharePoint Online, and REST API integrations to streamline operations, improve compliance, and reduce administrative overhead. Adept at translating complex business requirements into user-focused solutions across HR, finance, compliance, and operations. Skilled in end-to-end solution delivery—from stakeholder engagement through to system architecture, development, deployment, and long-term support.
            </p>
          </Section>

          <Section title="Relevant Experience">
            <p className="mt-2 font-semibold">Head of Data & MIS, St Augustine’s CE High School (06/2024 – Present)</p>
            <ul className="list-disc list-inside mb-4">
              <li>Architected and rebuilt automation systems following migration to a cloud-based MIS</li>
              <li>Designed Power Platform solutions with REST APIs to sync real-time data</li>
              <li>Refactored workflows to improve maintainability and reduce admin overhead</li>
              <li>Used PowerShell and Python for transforming 100k+ row datasets for reporting</li>
            </ul>
            <p className="font-semibold">Digital Innovation Lead / Office Manager (09/2021 – 06/2024)</p>
            <ul className="list-disc list-inside mb-4">
              <li>Delivered Power Platform tools across HR, finance, safeguarding, and compliance</li>
              <li>Provided architectural guidance on data design and scalable delivery</li>
              <li>Led full delivery lifecycle with focus on adoption and maintainability</li>
            </ul>
            <p className="font-semibold">Web Editor, The Normal School (2013 – 2016)</p>
            <ul className="list-disc list-inside">
              <li>Built and maintained WordPress site using HTML, CSS, JS, and PHP</li>
              <li>Improved SEO and site usability with analytics-based enhancements</li>
            </ul>
          </Section>

          <Section title="Key Skills & Technologies">
            <ul className="list-disc list-inside">
              <li>Power Apps, Power Automate, SharePoint, Teams, Power BI</li>
              <li>REST APIs, JSON, Office Scripts</li>
              <li>Python, PowerShell</li>
              <li>React, WordPress, HTML, CSS, PHP</li>
              <li>Process optimisation, stakeholder engagement, solution architecture</li>
            </ul>
          </Section>

          <Section title="Additional Experience">
            <ul className="list-disc list-inside">
              <li>SLT Administrator, St Augustine’s CE High School (2020–2021)</li>
              <li>English Teacher, Villiers High School (2019–2020)</li>
              <li>English Teacher, Jinling A-Level Centre, Nanjing (2016–2018)</li>
              <li>Lecturer, Ocean University of China (2014–2015)</li>
            </ul>
          </Section>

          <Section title="Education">
            <ul className="list-disc list-inside">
              <li>MFA, Creative Writing – CSU Fresno, 2013</li>
              <li>BA, Literature & Writing – CSU San Marcos, 2010</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default CvModal;

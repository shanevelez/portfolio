const ProjectModal = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
  <div className="relative bg-slate-800 text-white max-w-2xl w-full mx-4 rounded-xl shadow-lg">

 
    <button
      onClick={onClose}
      className="absolute top-3 right-4 text-slate-400 hover:text-white text-xl z-20"
    >
      &times;
    </button>
<div className="p-6 pt-6 max-h-[90vh] overflow-y-auto">
        {/* Project Title & Category */}
        <h2 className="text-2xl font-bold mb-1">{project.Project}</h2>
        <p className="text-sm mb-4 opacity-80">{project.Category}</p>

        {/* Features */}
        {project.Features && (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-1">Features</h3>
            <p className="text-sm opacity-90">{project.Features}</p>
          </>
        )}

        {/* Apps */}
        {project.Apps && project.Apps.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-1">Apps</h3>
            <ul className="list-disc pl-6 text-sm opacity-90">
              {project.Apps.map((app, i) => (
                <li key={i}>{app}</li>
              ))}
            </ul>
          </>
        )}

        {/* Flows */}
        {project.Flows && project.Flows.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-1">Flows</h3>
            <ul className="list-disc pl-6 text-sm opacity-90">
              {project.Flows.map((flow, i) => (
                <li key={i}>{flow}</li>
              ))}
            </ul>
          </>
        )}
 {/* Business Use Case */}
{project["Business Use Case"] && (
  <>
    <h3 className="font-semibold text-lg mt-4 mb-1">Business Use Case</h3>
    <p className="text-sm opacity-90">{project["Business Use Case"]}</p>
  </>
)}
        {/* Impact */}
        {project.Impact && (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-1">Impact</h3>
            <p className="text-sm opacity-90">{project.Impact}</p>
          </>
        )}
      </div>
	  </div>
    </div>
  );
};

export default ProjectModal;

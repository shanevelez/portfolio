import cardBg from '../media/cardbg.svg'; 


const categoryGradients = {
  "Case & Workflow Management": "bg-gradient-to-br from-indigo-700 to-indigo-500",
  "HR & People Ops": "bg-gradient-to-br from-rose-600 to-pink-500",
  "Reporting & Analytics": "bg-gradient-to-br from-cyan-700 to-cyan-500",
  "Internal Tools & Self-Service": "bg-gradient-to-br from-emerald-600 to-teal-500",
  "Intake & Forms Automation": "bg-gradient-to-br from-violet-700 to-fuchsia-600",
  "Compliance & Escalation": "bg-gradient-to-br from-orange-600 to-red-500",
  "Default": "bg-gradient-to-br from-slate-700 to-slate-800",
};

const categoryOverlayOpacity = {
  "Case & Workflow Management": "opacity-40",
  "HR & People Ops": "opacity-30",
  "Reporting & Analytics": "opacity-35",
  "Internal Tools & Self-Service": "opacity-25",
  "Intake & Forms Automation": "opacity-35",
  "Compliance & Escalation": "opacity-25",
  "Default": "opacity-40",
};

const categoryOverlayFilter = {
  "Case & Workflow Management": "contrast(100%) brightness(120%)",
  "HR & People Ops": "contrast(85%) brightness(170%)",
  "Reporting & Analytics": "contrast(100%) brightness(100%)",
  "Internal Tools & Self-Service": "contrast(100%) brightness(130%)",
  "Intake & Forms Automation": "contrast(90%) brightness(120%)",
  "Compliance & Escalation": "contrast(90%) brightness(180%)",
  "Default": "contrast(130%) brightness(90%)",
};

const categoryIcons = {
  "Case & Workflow Management": "📁",
  "HR & People Ops": "👥",
  "Reporting & Analytics": "📊",
  "Internal Tools & Self-Service": "🛠️",
  "Intake & Forms Automation": "📝",
  "Compliance & Escalation": "⚠️",
  "Default": "📦",
};

const ProjectCard = ({ title, category }) => {
  const gradient = categoryGradients[category] || categoryGradients["Default"];
  const icon = categoryIcons[category] || categoryIcons["Default"];
  const fontSize = title.length > 50 ? 'text-sm' : 'text-lg';
  const overlayOpacity = categoryOverlayOpacity[category] || categoryOverlayOpacity["Default"];
  const overlayFilter = categoryOverlayFilter[category] || categoryOverlayFilter["Default"];
  

  return (
    <div   onClick={() => {
  if (typeof umami === 'object' && typeof umami.track === 'function') {
    umami.track('Clicked Project', { name: title });
  }
}}

  className={`relative cursor-pointer p-6 w-48 sm:w-64 h-48 sm:h-64 flex-shrink-0 ${gradient} rounded-2xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-105 transition-all duration-300 transform flex flex-col justify-between overflow-hidden`}>
  
  {/* Textured SVG Overlay */}
  <img
  src={cardBg}
  alt=""
  className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-10 ${overlayOpacity}`}
  style={{
	
    filter: overlayFilter,
  }}
/>
<div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none z-15" />
  {/* Content */}
  <div className="relative z-20 text-white flex flex-col justify-between h-full">
    <h3 className={`${fontSize} font-semibold leading-tight break-words`}>
      {title}
    </h3>
    <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
      <span className="text-[11px]">{icon}</span> {category}
    </p>
  </div>
</div>
  );
};

export default ProjectCard;

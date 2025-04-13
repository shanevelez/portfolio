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
  "Case & Workflow Management": "opacity-50",
  "HR & People Ops": "opacity-100",
  "Reporting & Analytics": "opacity-25",
  "Internal Tools & Self-Service": "opacity-35",
  "Intake & Forms Automation": "opacity-70",
  "Compliance & Escalation": "opacity-70",
  "Default": "opacity-40",
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

  return (
    <div className={`relative cursor-pointer p-6 w-48 sm:w-64 h-48 sm:h-64 flex-shrink-0 ${gradient} rounded-2xl shadow-md shadow-black/10 hover:shadow-lg hover:scale-105 transition-all duration-300 transform flex flex-col justify-between overflow-hidden`}>
  
  {/* Textured SVG Overlay */}
  <img
  src={cardBg}
  alt=""
  className={`absolute inset-0 w-full h-full object-cover ${overlayOpacity} mix-blend-overlay pointer-events-none z-10`}
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

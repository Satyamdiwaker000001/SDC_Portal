import { Github, Code2, Terminal, ExternalLink, Linkedin, Cpu } from "lucide-react"; 
import { motion } from "framer-motion";
import { soundManager } from "../../utils/SoundManager";
import { HackyText } from "../../components/shared/HackyText";

const PROJECTS = [
  {
    title: "PhishGuard",
    desc: "AI-POWERED PHISHING DETECTION SYSTEM WITH REAL-TIME URL ANALYSIS AND FORENSIC REPORTING.",
    tech: ["PYTHON", "FASTAPI", "REACT", "TENSORFLOW"],
    github: "https://github.com/satyam-diwaker/PhishGuard",
    portfolio: "#",
    linkedin: "#"
  },
  {
    title: "Nexus AI",
    desc: "A CUSTOM VERSION CONTROL SYSTEM BUILT FOR RAPID OPERATIVE DEPLOYMENTS IN HIGH-LATENCY ZONES.",
    tech: ["TYPESCRIPT", "NESTJS", "POSTGRESQL", "REDIS"],
    github: "https://github.com/satyam-diwaker/Nexus-AI",
    portfolio: "#",
    linkedin: "#"
  },
  {
    title: "Jolt App",
    desc: "HIGH-PERFORMANCE NOTE-TAKING UTILITY DESIGNED FOR SYNCHRONIZED ENGINEERING TEAM DOCUMENTATION.",
    tech: ["FLUTTER", "MONGODB", "NODE.JS"],
    github: "#",
    portfolio: "#",
    linkedin: "#"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black selection:bg-kpr-green font-sans overflow-x-hidden relative pt-32">
      
      {/* 00_BRANDING_HEADER (Logo Fix) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 pointer-events-none">
         <span className="kpr-mono text-[10px] font-black tracking-[1.5em] text-black">SOFTWARE DEVELOPMENT CELL</span>
         <div className="w-48 h-px bg-black" />
      </div>

      <main className="pb-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* SECTION_HEADER */}
        <header className="mb-32 relative">
          <div className="flex items-center gap-6 mb-6">
             <div className="w-16 h-px bg-kpr-green" />
             <p className="kpr-mono text-black text-[10px] font-black tracking-widest uppercase">Operational_Artifacts</p>
          </div>
          <HackyText 
            text="THE_FORGE" 
            className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none text-black mb-10" 
          />
          <div className="flex justify-between items-end border-t border-black/5 pt-8">
             <div className="kpr-mono text-[10px] font-black text-black/20 uppercase tracking-widest">
               VERSION_CONTROL_REGISTRY // SDC_CORE_REPOSITORY
             </div>
             <Cpu size={24} className="text-black/10" />
          </div>
        </header>

        {/* PROJECTS_GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PROJECTS.map((project, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              onMouseEnter={() => soundManager.playHover()}
              className="group kpr-panel p-12 bg-white border-black/5 hover:border-kpr-green transition-all relative"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center group-hover:bg-kpr-green group-hover:text-black transition-colors duration-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                  <Code2 size={24} />
                </div>
                <div className="flex flex-col items-end opacity-10 group-hover:opacity-40 transition-opacity">
                   <span className="kpr-mono text-[8px] font-black">X_NODE</span>
                   <Terminal size={14} />
                </div>
              </div>

              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-black group-hover:text-kpr-green transition-colors leading-none">
                {project.title}
              </h3>
              
              <p className="text-black opacity-40 kpr-mono text-[10px] leading-relaxed mb-10 tracking-widest uppercase">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-12">
                {project.tech.map(t => (
                  <span key={t} className="text-[10px] font-black kpr-mono bg-black text-white px-4 py-1 tracking-widest">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-10 border-t border-black/5 pt-10 mt-auto items-center">
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => soundManager.playClick()}
                  className="text-black/30 hover:text-kpr-green transition-all transform hover:scale-125"
                  title="Source Code"
                >
                  <Github size={20} />
                </a>
                <a 
                  href={project.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => soundManager.playClick()}
                  className="text-black/30 hover:text-kpr-green transition-all transform hover:scale-125"
                  title="LinkedIn Context"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href={project.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => soundManager.playClick()}
                  className="text-black/30 hover:text-kpr-green transition-all transform hover:scale-125"
                  title="Live Demo"
                >
                  <ExternalLink size={20} />
                </a>
                <div className="ml-auto w-2 h-2 bg-black/10 rounded-full group-hover:bg-kpr-green group-hover:animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Decorative Technical HUD */}
      <div className="fixed bottom-12 left-12 z-0 hidden lg:block opacity-10 pointer-events-none">
         <div className="kpr-mono text-[10px] font-black space-y-2 text-black">
            <p>DATA_SYNC: TRUE</p>
            <p>LATENCY: 0.00ms</p>
            <p>NODE: AGRA_NORTH</p>
         </div>
      </div>
    </div>
  );
}
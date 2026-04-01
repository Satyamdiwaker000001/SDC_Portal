/* cspell:disable */
import { Github, Code2, Terminal, ExternalLink, Linkedin } from "lucide-react"; 
import { motion } from "framer-motion";
import Navbar from "../landingpage/Navbar"; 

/* SDC_CORE_SYSTEM: Project Forge
   Maintainer: Satyam Diwaker
*/

const PROJECTS = [
  {
    title: "PhishGuard",
    desc: "AI-powered phishing detection system with real-time URL analysis and forensic reporting.",
    tech: ["Python", "FastAPI", "React", "TensorFlow"],
    github: "https://github.com/satyam-diwaker/PhishGuard",
    portfolio: "#",
    linkedin: "#"
  },
  {
    title: "Nexus AI",
    desc: "A custom version control system built for rapid operative deployments in high-latency zones.",
    tech: ["TypeScript", "NestJS", "PostgreSQL", "Redis"],
    github: "https://github.com/satyam-diwaker/Nexus-AI",
    portfolio: "#",
    linkedin: "#"
  },
  {
    title: "Jolt App",
    desc: "High-performance note-taking utility designed for synchronized engineering team documentation.",
    tech: ["Flutter", "MongoDB", "Node.js"],
    github: "#",
    portfolio: "#",
    linkedin: "#"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-sky-500/30 font-sans overflow-x-hidden">
      
      <Navbar />
      
      <main className="pt-32 pb-20 px-10 max-w-7xl mx-auto relative z-10">
        {/* SECTION_HEADER */}
        <header className="mb-16 border-l-2 border-sky-500 pl-8 relative">
          {/* FIX: -left-[2px] changed to -left-0.5 */}
          <div className="absolute -left-0.5 top-0 h-10 w-0.5 bg-sky-400 shadow-[0_0_15px_#0ea5e9]" />
          <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-80">Operational_Artifacts</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            THE_<span className="text-sky-500 drop-shadow-[0_0_15px_#0ea5e966]">FORGE</span>
          </h1>
        </header>

        {/* PROJECTS_GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-zinc-950 border border-white/5 p-8 relative overflow-hidden hover:border-sky-500/30 transition-all shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 [clip-path:polygon(100%_0,0_0,100%_100%)] group-hover:bg-sky-500/10 transition-all" />
              
              <div className="flex justify-between items-start mb-6">
                <Code2 className="text-sky-500" size={24} />
                <Terminal className="text-zinc-900 group-hover:text-sky-500/20 transition-colors" size={16} />
              </div>

              {/* FIX: break-words changed to wrap-break-word */}
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-sky-400 transition-colors leading-tight wrap-break-word">
                {project.title}
              </h3>
              
              {/* FIX: break-words changed to wrap-break-word */}
              <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 uppercase font-bold tracking-tight wrap-break-word">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map(t => (
                  <span key={t} className="text-[8px] font-black bg-white/5 px-2 py-1 border border-white/5 uppercase text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-6 border-t border-white/5 pt-6">
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-600 hover:text-white transition-colors"
                  title="Source Code"
                >
                  <Github size={18} />
                </a>
                <a 
                  href={project.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-600 hover:text-[#0077b5] transition-colors"
                  title="LinkedIn Context"
                >
                  <Linkedin size={18} />
                </a>
                <a 
                  href={project.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-600 hover:text-sky-400 transition-colors"
                  title="Live Demo"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
    </div>
  );
}
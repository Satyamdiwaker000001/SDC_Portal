import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Cpu } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ProfileFrame } from '../shared/ProfileFrame';
import type { Project, Member, Team } from '../../types';

interface ProjectWithTeam extends Project {
  teamMembers: Member[];
}

export const ProjectsView = ({ onJump }: { onJump: (id: string) => void }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectWithTeam | null>(null);
  const { projects, teams, members } = useStore();

  const projectsWithTeam: ProjectWithTeam[] = projects.map(p => {
    const team = teams.find((t: Team) => t.id === p.teamId);
    return {
      ...p,
      teamMembers: members.filter((m: Member) => team?.memberIds.includes(m.id))
    };
  });

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-2 border-emerald-500/20 pb-8">
        <h2 className="text-6xl font-black italic text-emerald-400 uppercase tracking-tighter">Project_Matrix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsWithTeam.map((project) => (
          <div key={project.id} onClick={() => setSelectedProject(project)} className="group bg-slate-900 border-t-2 border-emerald-500/20 -skew-x-12 p-8 hover:bg-emerald-500/5 transition-all cursor-none">
            <div className="skew-x-12 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-white italic">{project.name}</h3>
                  <div className="flex gap-2 mt-4">
                    {project.teamMembers.slice(0, 3).map(m => (
                      <ProfileFrame key={m.id} imageUrl={m.image} size="sm" status={m.status} onClick={() => onJump(m.id)} />
                    ))}
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400 italic">{project.progress}%</div>
              </div>
              <div className="relative h-1 bg-slate-800 border border-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full bg-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-1000 bg-black/95 backdrop-blur-md flex items-center justify-center p-8 cursor-none" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-4xl bg-slate-950 border-2 border-emerald-500/30 p-12">
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"><X size={32}/></button>
              <h2 className="text-5xl font-black italic text-emerald-400 uppercase mb-10 tracking-tighter">{selectedProject.name}</h2>
              <div className="p-8 bg-white/2 border-l-4 border-emerald-500 mb-8 font-black text-[10px] italic text-slate-400 uppercase">
                <Cpu size={16} className="mb-2 text-cyan-400"/> Autonomous performance tracking active.
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active_Nodes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProject.teamMembers.map(m => (
                    <div key={m.id} onClick={() => onJump(m.id)} className="p-4 bg-white/2 border border-white/5 flex items-center gap-4 group hover:border-cyan-500 transition-all">
                      <ProfileFrame imageUrl={m.image} size="md" status={m.status} />
                      <div className="text-xs font-black text-white uppercase italic">{m.name}</div>
                      <ChevronRight size={14} className="ml-auto text-slate-800 group-hover:text-cyan-500" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
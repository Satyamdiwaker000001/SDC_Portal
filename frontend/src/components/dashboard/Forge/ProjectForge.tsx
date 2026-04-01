/* cspell:disable */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, BarChart3, Calendar } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const ProjectForge = ({ onClose }: { onClose: () => void }) => {
  const [projectName, setProjectName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [deadline, setDeadline] = useState('');
  const { teams } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && teamId && deadline) {
      console.log('Creating project:', { 
        projectName, 
        teamId, 
        deadline, 
        progress: 0 
      });
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-2xl bg-slate-950/95 border-2 border-emerald-500/30 backdrop-blur-3xl rounded-none shadow-[0_0_100px_rgba(0,0,0,1)]"
    >
      <div className="flex justify-between items-center px-8 py-6 border-b-2 border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-emerald-500 to-green-600 text-black -skew-x-12 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
            <BarChart3 size={20} className="skew-x-12" />
          </div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tight">Project Forge</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="w-full mt-2 px-4 py-3 bg-slate-900 border border-emerald-500/30 text-white text-sm font-black uppercase placeholder-slate-600 focus:border-emerald-400 focus:outline-none transition-all"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-1 italic">Assign Team</label>
          <div className="relative mt-2">
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 text-white text-sm font-black uppercase appearance-none focus:border-emerald-400 focus:outline-none transition-all cursor-pointer"
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
          </div>
        </div>

        <div>
          <label className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
            Target Deadline
          </label>
          <div className="relative mt-2">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 text-white text-sm font-black uppercase focus:border-emerald-400 focus:outline-none transition-all scheme-dark"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-bold uppercase tracking-wider leading-relaxed">
          Operational briefing: Initial progress set to 0%. Timeline synchronization required via Project Matrix.
        </div>

        <button 
          type="submit" 
          disabled={!projectName || !teamId || !deadline}
          className="w-full py-4 bg-linear-to-r from-emerald-500 to-green-600 text-black font-black uppercase tracking-widest text-lg -skew-x-12 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all"
        >
          <span className="flex items-center justify-center gap-2 skew-x-12">
            Initialize Project
          </span>
        </button>
      </form>
    </motion.div>
  );
};
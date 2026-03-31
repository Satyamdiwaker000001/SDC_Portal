/* cspell:disable */
import { useState } from 'react';
import { User, Cpu, ShieldCheck, Save, Globe, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DevSettings() { // Renamed to DevSettings
  const [skills, setSkills] = useState(['NestJS', 'TypeScript', 'Python', 'React', 'Docker']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-2">Operative_Profile</p>
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Settings</h2>
        </div>
        <button className="flex items-center gap-3 px-6 py-2 bg-sky-500 text-black text-[10px] font-black uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)]">
          <Save size={14} /> Commit_Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: IDENTITY MODULE */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 10%, 100% 100%, 2% 100%, 0 90%)' }}>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <User size={16} className="text-sky-500" /> Core_Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Public_Alias</label>
                <input type="text" placeholder="Your Name" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Designation</label>
                <input type="text" placeholder="Full Stack Developer" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><Github size={12}/> GitHub_Node</label>
                <input type="text" placeholder="github.com/..." className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2"><Globe size={12}/> Link_Portal</label>
                <input type="text" placeholder="https://..." className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500/50" />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-white/5 p-8">
             <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 block">Operative_Directives (Bio)</label>
             <textarea className="w-full bg-black border border-white/10 p-4 h-32 text-[11px] font-bold text-white outline-none focus:border-sky-500/50 resize-none" placeholder="Update your professional bio..." />
          </section>
        </div>

        {/* RIGHT: TECH SKILLS */}
        <div className="space-y-6">
          <section className="bg-sky-500/5 border border-sky-500/20 p-8">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Cpu size={16} /> Tech_Skill_Matrix
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="ADD_SKILL..." 
                  className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] font-black text-white outline-none focus:border-sky-400"
                />
                <button onClick={addSkill} className="bg-white text-black px-3 py-2 text-[10px] font-black uppercase hover:bg-sky-400 transition-colors">ADD</button>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                {skills.map((skill) => (
                  <motion.div 
                    layout
                    key={skill} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-[9px] font-black text-zinc-400 uppercase group hover:border-sky-500/50 transition-all"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-zinc-700 hover:text-red-500 transition-colors">×</button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-emerald-500/5 border border-emerald-500/20 p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-full">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Security_Sync</p>
              <p className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-tighter">Two-Factor Authentication: Enabled</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
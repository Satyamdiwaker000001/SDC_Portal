/* cspell:disable */
import { useState, useRef } from 'react';
import { 
  Cpu, ShieldCheck, Save, Globe, 
  Github, Edit3, Loader2, Camera, Linkedin 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- PROPS INTERFACE ---
interface DevSettingsProps {
  profile: {
    alias: string;
    designation: string;
    github: string;
    linkedin: string; // Added LinkedIn
    portfolio: string;
    bio: string;
    avatar: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    alias: string;
    designation: string;
    github: string;
    linkedin: string; // Added LinkedIn
    portfolio: string;
    bio: string;
    avatar: string;
  }>>;
}

export default function DevSettings({ profile, setProfile }: DevSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState(['NestJS', 'TypeScript', 'Python', 'React', 'Docker']);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleCommit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-2">Nexus_Control_Panel</p>
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Account_Settings</h2>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-6 py-2 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase hover:bg-sky-500 hover:text-black transition-all">
            <Edit3 size={14} /> Edit_Profile
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => setIsEditing(false)} className="text-zinc-500 text-[10px] font-black uppercase hover:text-white transition-all">Abort</button>
            <button onClick={handleCommit} disabled={isSaving} className="flex items-center gap-3 px-6 py-2 bg-sky-500 text-black text-[10px] font-black uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Syncing...' : 'Save_Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.section key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900/40 border border-white/5 p-8 relative overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 98% 0, 100% 10%, 100% 100%, 2% 100%, 0 90%)' }}>
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="w-32 h-32 bg-zinc-950 border-2 border-sky-500/20 rotate-45 shrink-0 self-center md:self-start overflow-hidden relative shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                    <img src={profile.avatar} alt="Avatar" className="-rotate-45 w-[140%] h-[140%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{profile.alias}</h3>
                      <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em]">{profile.designation}</p>
                    </div>
                    {/* View Mode Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-zinc-500 text-[11px] font-mono">
                      <div className="flex items-center gap-3"><Github size={14} /> {profile.github}</div>
                      <div className="flex items-center gap-3"><Linkedin size={14} className="text-sky-600" /> LinkedIn_Profile</div>
                      <div className="flex items-center gap-3"><Globe size={14} /> {profile.portfolio}</div>
                    </div>
                    <div className="pt-4">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">Mission_Statement</p>
                      <p className="text-zinc-400 text-sm italic">"{profile.bio}"</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900/60 border border-sky-500/20 p-8 space-y-8">
                <div className="flex items-center gap-8 pb-6 border-b border-white/5">
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-24 h-24 bg-black border border-sky-500/50 rotate-45 overflow-hidden relative">
                         <img src={profile.avatar} className="-rotate-45 w-[140%] h-[140%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-30 transition-opacity" alt="" />
                         <div className="absolute inset-0 flex items-center justify-center -rotate-45"><Camera size={20} className="text-sky-400" /></div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Update_Operative_Photo</p>
                      <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-[9px] font-black text-sky-500 hover:text-white transition-colors uppercase underline underline-offset-4">Browse_Local_Files</button>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="alias" value={profile.alias} onChange={handleInputChange} placeholder="Alias" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500" />
                  <input type="text" name="designation" value={profile.designation} onChange={handleInputChange} placeholder="Rank" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500" />
                  <input type="text" name="github" value={profile.github} onChange={handleInputChange} placeholder="GitHub" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500" />
                  {/* LinkedIn Input added */}
                  <input type="text" name="linkedin" value={profile.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500" />
                  <input type="text" name="portfolio" value={profile.portfolio} onChange={handleInputChange} placeholder="Portfolio" className="w-full bg-black border border-white/10 p-3 text-[11px] font-bold text-white outline-none focus:border-sky-500" />
                </div>
                <textarea name="bio" value={profile.bio} onChange={handleInputChange} placeholder="Bio..." className="w-full bg-black border border-white/10 p-4 h-32 text-[11px] font-bold text-white outline-none focus:border-sky-500 resize-none" />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <section className="bg-sky-500/5 border border-sky-500/20 p-8">
            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-6 flex items-center gap-3"><Cpu size={16} /> Skill_Matrix</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && newSkill && (setSkills([...skills, newSkill]), setNewSkill(''))} placeholder="ADD..." className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] font-black text-white outline-none focus:border-sky-400" />
                <button onClick={() => newSkill && (setSkills([...skills, newSkill]), setNewSkill(''))} className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase hover:bg-sky-400 transition-colors">ADD</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {skills.map((skill) => (
                  <motion.div layout key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-[9px] font-black text-zinc-400 uppercase hover:border-sky-500/50 transition-all">
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="text-zinc-700 hover:text-red-500 transition-colors">×</button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section className="bg-emerald-500/5 border border-emerald-500/20 p-6 flex items-center gap-4">
            <ShieldCheck className="text-emerald-500" size={20} />
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Security: MAX</p>
              <p className="text-[8px] font-bold text-emerald-500/60 uppercase italic">Authorized_Operative</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
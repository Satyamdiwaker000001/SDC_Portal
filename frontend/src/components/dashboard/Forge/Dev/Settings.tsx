/* cspell:disable */
import { useState, useRef, useMemo } from 'react';
import { 
  Cpu, ShieldCheck, Save, Globe, 
  Github, Edit3, Loader2, Camera, Linkedin, Lock 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- PROPS INTERFACE ---
interface DevSettingsProps {
  profile: {
    alias: string;
    designation: string;
    github: string;
    linkedin: string;
    portfolio: string;
    bio: string;
    avatar: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    alias: string;
    designation: string;
    github: string;
    linkedin: string;
    portfolio: string;
    bio: string;
    avatar: string;
  }>>;
}

export default function DevSettings({ profile, setProfile }: DevSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation: Fetching Admin-created ID from DB/Storage
  const personnelId = useMemo(() => localStorage.getItem("SDC_USER_ID") || "SDC-2026-OP-01", []);

  const [skills, setSkills] = useState(['NestJS', 'TypeScript', 'Python', 'React', 'Docker']);
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Safety check: Prevent modifying restricted fields if any bypass attempt happens
    if (name === "alias") return; 
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 text-left font-sans">
      <div className="flex items-end justify-between border-b-2 border-slate-grey-200/50 pb-6">
        <div>
          <p className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest mb-1">Nexus Control Panel</p>
          <h2 className="text-3xl font-black text-carbon-black-DEFAULT uppercase tracking-tight text-left">Account Settings</h2>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-slate-grey-200 text-carbon-black-DEFAULT text-[11px] font-bold uppercase hover:border-sky-500 hover:text-sky-600 transition-all rounded-xl shadow-sm">
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-slate-grey-100 text-slate-grey-600 border border-slate-grey-200 text-[11px] font-bold uppercase hover:bg-slate-grey-200 transition-all rounded-xl">Abort</button>
            <button onClick={handleCommit} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white text-[11px] font-bold uppercase hover:bg-sky-600 transition-all rounded-xl shadow-md gaming-clip-btn">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Syncing...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.section key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="crystal-card p-10 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="w-40 h-40 bg-slate-grey-50 border-4 border-sky-100 rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 self-center md:self-start overflow-hidden relative shadow-lg">
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover absolute top-0 left-0" />
                  </div>
                  <div className="flex-1 space-y-6 text-left">
                    <div>
                      <h3 className="text-4xl font-black text-carbon-black-DEFAULT uppercase tracking-tight">{profile.alias}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sky-600 text-xs font-black uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-md">{profile.designation}</p>
                        <span className="text-slate-grey-500 text-[10px] font-bold border border-slate-grey-200 px-2 py-1 rounded-md uppercase">ID: {personnelId}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-2 border-slate-grey-100 text-slate-grey-600 text-xs font-semibold">
                      <div className="flex items-center gap-3"><Github size={16} className="text-carbon-black-DEFAULT" /> {profile.github || "Not Linked"}</div>
                      <div className="flex items-center gap-3"><Linkedin size={16} className="text-sky-600" /> LinkedIn Profile</div>
                      <div className="flex items-center gap-3"><Globe size={16} className="text-carbon-black-DEFAULT" /> {profile.portfolio || "No Portfolio"}</div>
                    </div>
                    <div className="pt-6 text-left">
                      <p className="text-[10px] font-bold text-slate-grey-400 uppercase tracking-widest mb-2">Mission Statement</p>
                      <p className="text-slate-grey-600 text-sm italic font-medium leading-relaxed">"{profile.bio}"</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="crystal-card p-10 space-y-8 text-left border-2 border-sky-200 border-dashed">
                <div className="flex items-center gap-8 pb-8 border-b-2 border-slate-grey-100">
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-28 h-28 bg-slate-grey-50 border-4 border-slate-grey-200 rounded-2xl overflow-hidden relative shadow-inner">
                         <img src={profile.avatar} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" alt="" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"><Camera size={28} className="text-white drop-shadow-md" /></div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-grey-500 uppercase tracking-widest mb-2">Update Operative Photo</p>
                      <button onClick={() => fileInputRef.current?.click()} className="text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-colors uppercase underline underline-offset-4 decoration-sky-300">Browse Local Files</button>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* READ ONLY FIELDS (Admin Managed) */}
                  <div className="relative group">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest absolute -top-3 left-4 bg-white px-2 z-10 flex items-center gap-1 shadow-[0_4px_0_0_white]"><Lock size={12}/> Restricted Alias</label>
                    <input type="text" value={profile.alias} readOnly className="w-full bg-slate-grey-50 border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-slate-grey-500 outline-none cursor-not-allowed shadow-none" />
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] font-bold text-slate-grey-500 uppercase tracking-widest absolute -top-3 left-4 bg-white px-2 z-10 flex items-center gap-1 shadow-[0_4px_0_0_white]"><Lock size={12}/> Restricted ID</label>
                    <input type="text" value={personnelId} readOnly className="w-full bg-slate-grey-50 border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-slate-grey-500 outline-none cursor-not-allowed font-mono shadow-none" />
                  </div>

                  {/* EDITABLE FIELDS */}
                  <input type="text" name="designation" value={profile.designation} onChange={handleInputChange} placeholder="Rank / Designation" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                  <input type="text" name="github" value={profile.github} onChange={handleInputChange} placeholder="GitHub Handle" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                  <input type="text" name="linkedin" value={profile.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                  <input type="text" name="portfolio" value={profile.portfolio} onChange={handleInputChange} placeholder="Portfolio URL" className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                </div>
                <textarea name="bio" value={profile.bio} onChange={handleInputChange} placeholder="Operational Bio..." className="w-full bg-white border-2 border-slate-grey-200 rounded-xl p-4 h-32 text-sm font-medium text-carbon-black-DEFAULT outline-none focus:border-sky-500 resize-none transition-colors placeholder:text-slate-grey-400" />
                
                <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl rounded-l-sm">
                  <p className="text-[11px] font-bold text-red-600 uppercase flex items-center gap-2 mb-1"><Lock size={14}/> Security Note</p>
                  <p className="text-xs text-red-500/80 font-medium">Identity credentials and security keys can only be modified by a Root Administrator.</p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6 text-left">
          <section className="crystal-card p-8 border-t-4 border-t-sky-400">
            <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Cpu size={18} className="text-sky-500" /> Skill Matrix</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && newSkill && (setSkills([...skills, newSkill]), setNewSkill(''))} placeholder="Add a skill..." className="flex-1 bg-white border-2 border-slate-grey-200 rounded-xl px-4 py-3 text-xs font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors placeholder:text-slate-grey-400" />
                <button onClick={() => newSkill && (setSkills([...skills, newSkill]), setNewSkill(''))} className="bg-sky-50 text-sky-600 border border-sky-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <motion.div layout key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-slate-grey-100 border border-slate-grey-200 rounded-lg text-xs font-bold text-slate-grey-600 hover:bg-white hover:border-sky-300 hover:text-carbon-black-DEFAULT transition-all">
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="text-slate-grey-400 hover:text-red-500 transition-colors">×</button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section className="crystal-card p-6 flex items-center gap-5 text-left border-l-4 border-l-emerald-500">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-carbon-black-DEFAULT uppercase tracking-wider mb-0.5">Verification: Active</p>
              <p className="text-[10px] font-bold text-slate-grey-400 uppercase tracking-widest">Authenticated Personnel</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
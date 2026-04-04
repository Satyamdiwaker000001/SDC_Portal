/* cspell:disable */
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Upload, Plus, X } from 'lucide-react';

// --- TYPES ---
type MemberStatus = 'ACTIVE' | 'PASSOUT' | 'RETIRED';

interface MemberProfile {
  personnelId: string;
  fullName: string;
  role: string;
  joinedDate: string;
  passoutDate: string;
  profileImage: string; 
  techStack: string[];
  linkedInUrl: string;
  gitHubUrl: string;
  status: MemberStatus;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'RETIRED'>('SYSTEM');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  const [adminData, setAdminData] = useState({
    name: localStorage.getItem("SDC_ADMIN_NAME") || 'ADMIN',
    photoUrl: localStorage.getItem("SDC_ADMIN_AVATAR") || '',
    password: '',
    confirmPassword: '',
    sessionTimeout: 30,
    autoIdleLogout: true
  });

  const [newMember, setNewMember] = useState<MemberProfile>({
    personnelId: '', fullName: '', role: '', joinedDate: '', passoutDate: '',
    profileImage: '', techStack: [], linkedInUrl: '', gitHubUrl: '', status: 'PASSOUT'
  });

  const handleAdminPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAdminData(prev => ({ ...prev, photoUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleRegistryPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewMember(prev => ({ ...prev, profileImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e?: FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const skill = skillInput.trim().toUpperCase();
    if (skill && !newMember.techStack.includes(skill)) {
      setNewMember(prev => ({ ...prev, techStack: [...prev.techStack, skill] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setNewMember(prev => ({ ...prev, techStack: prev.techStack.filter(s => s !== skillToRemove) }));
  };

  const handleIdentitySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (adminData.password && adminData.password !== adminData.confirmPassword) {
      alert("System Action Invalid: Authentication keys do not match!");
      return;
    }
    setShowConfirmModal(true);
  };

  const finalUpdateProtocol = () => {
    localStorage.setItem("SDC_ADMIN_NAME", adminData.name);
    if (adminData.photoUrl) localStorage.setItem("SDC_ADMIN_AVATAR", adminData.photoUrl);
    window.dispatchEvent(new Event("admin_settings_updated"));
    setShowConfirmModal(false);
    alert("System Overridden. Identity Update Successful.");
  };

  const handleRegistrySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Record Saved: Personnel data successfully moved to Registry.");
  };

  return (
    <div className="text-carbon-black-600 font-sans text-left">
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${activeTab === 'SYSTEM' ? 'bg-sky-500 text-white shadow-md' : 'bg-white border text-slate-grey-500 border-slate-grey-200 hover:text-carbon-black-DEFAULT hover:border-sky-300'}`} 
          onClick={() => setActiveTab('SYSTEM')}
        >
          Administrator & Security
        </button>
        <button 
          className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${activeTab === 'RETIRED' ? 'bg-sky-500 text-white shadow-md' : 'bg-white border text-slate-grey-500 border-slate-grey-200 hover:text-carbon-black-DEFAULT hover:border-sky-300'}`} 
          onClick={() => setActiveTab('RETIRED')}
        >
          Passout Registry
        </button>
      </div>

      {activeTab === 'SYSTEM' && (
        <div className="animate-in fade-in duration-500">
          <form className="crystal-card p-8" onSubmit={handleIdentitySubmit}>
            <h2 className="text-xl font-black uppercase text-carbon-black-DEFAULT tracking-tight mb-8 flex items-center gap-2 border-b-2 border-slate-grey-200/50 pb-4">
               Operator Profile
            </h2>
            <div className="flex items-center gap-8 mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-sky-100 overflow-hidden bg-slate-grey-50 flex items-center justify-center shadow-lg">
                {adminData.photoUrl ? <img src={adminData.photoUrl} alt="Admin" className="w-full h-full object-cover" /> : <span className="text-slate-grey-400 font-bold text-xl">{adminData.name.substring(0,2)}</span>}
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-grey-500 mb-2">Update Avatar</label>
                <input type="file" accept="image/*" onChange={handleAdminPhoto} className="text-sm font-semibold text-slate-grey-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Operator Alias</label>
                <input type="text" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value.toUpperCase()})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Reset Authorization Key</label>
                <input type="password" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" value={adminData.password} onChange={(e) => setAdminData({...adminData, password: e.target.value})} placeholder="New key..." />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Confirm Authorization Key</label>
                <input type="password" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" value={adminData.confirmPassword} onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})} placeholder="Verify key..." />
              </div>
            </div>
            <button type="submit" className="px-8 py-3 bg-sky-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-md transition-colors hover:bg-sky-600 gaming-clip-btn">Apply Identification Override</button>
          </form>
        </div>
      )}

      {activeTab === 'RETIRED' && (
        <form className="crystal-card p-8 animate-in fade-in duration-500" onSubmit={handleRegistrySubmit}>
          <h2 className="text-xl font-black uppercase text-carbon-black-DEFAULT tracking-tight mb-8 flex items-center gap-2 border-b-2 border-slate-grey-200/50 pb-4">
             Archive Personnel Deployment
          </h2>

          <div className="flex flex-col md:flex-row gap-10 mb-10 items-start text-left">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-grey-500 mb-2">Profile Visual</label>
              <div className="w-32 h-32 rounded-xl border-4 border-dashed border-slate-grey-200 overflow-hidden bg-white flex items-center justify-center">
                {newMember.profileImage ? <img src={newMember.profileImage} alt="Archive" className="w-full h-full object-cover" /> : <Upload className="text-slate-grey-300" size={32} />}
              </div>
              <input type="file" accept="image/*" onChange={handleRegistryPhoto} className="mt-4 text-[10px] uppercase font-bold text-slate-grey-500 w-40" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Full Name</label>
                <input type="text" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" required placeholder="Personnel Name" onChange={(e) => setNewMember({...newMember, fullName: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Personnel ID</label>
                <input type="text" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" required placeholder="SDC-HIST-XX" onChange={(e) => setNewMember({...newMember, personnelId: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Assigned Role</label>
                <input type="text" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" required placeholder="e.g. Lead Developer" onChange={(e) => setNewMember({...newMember, role: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">LinkedIn Identifier</label>
                <input type="url" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors" placeholder="https://linkedin.com/in/..." onChange={(e) => setNewMember({...newMember, linkedInUrl: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex flex-col text-left mb-6">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-grey-500 mb-2">Tech Stack Arsenal <span className="lowercase font-normal tracking-normal ml-1">(Press Enter)</span></label>
            <div className="flex gap-4 mb-4">
              <input type="text" className="bg-white border-2 border-slate-grey-200 rounded-xl p-4 text-sm font-bold text-carbon-black-DEFAULT outline-none focus:border-sky-500 transition-colors flex-1" placeholder="Input skill (e.g. REACT)" value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)} />
              <button onClick={() => handleAddSkill()} type="button" className="px-6 bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-500 hover:text-white transition-all rounded-xl font-bold uppercase tracking-widest text-xs"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newMember.techStack.map(skill => (
                <div key={skill} className="px-3 py-1.5 bg-slate-grey-50 border border-slate-grey-200 text-slate-grey-600 text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-2">
                  {skill} 
                  <X size={12} className="cursor-pointer hover:text-red-500 text-slate-grey-400 transition-colors" onClick={() => removeSkill(skill)} />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-4 mt-6 bg-carbon-black-DEFAULT text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-md transition-colors hover:bg-sky-500 gaming-clip-btn">Authorize Archive Entry Deployment</button>
        </form>
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="crystal-card p-8 max-w-md w-full relative border-2 border-sky-300 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b-2 border-slate-grey-200/50 pb-4">
                <ShieldAlert className="text-sky-500" size={28} />
                <h3 className="text-carbon-black-DEFAULT font-black uppercase text-lg tracking-tight text-left">Confirm Protocol Override?</h3>
              </div>
              <p className="text-sm font-semibold text-slate-grey-500 mb-8 border-l-4 border-sky-500 pl-4 py-1 text-left">"You are about to modify the core administrative credentials for this portal instance. Acknowledge and proceed?"</p>
              <div className="flex gap-4">
                <button onClick={finalUpdateProtocol} className="flex-1 py-4 bg-sky-500 text-white font-black uppercase text-xs tracking-widest hover:bg-sky-600 transition-all rounded-xl gaming-clip-btn">Acknowledge</button>
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 bg-slate-grey-100 text-slate-grey-600 font-bold uppercase text-xs tracking-widest hover:bg-slate-grey-200 transition-all rounded-xl border border-slate-grey-200">Abort</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
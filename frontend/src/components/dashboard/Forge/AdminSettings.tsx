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

const styles = {
  container: { padding: '20px', color: '#d4d4d8', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { borderBottom: '1px solid rgba(14, 165, 233, 0.2)', color: '#fff', paddingBottom: '15px', marginBottom: '25px', fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase' as const, letterSpacing: '0.1em' },
  tabContainer: { display: 'flex', marginBottom: '25px', gap: '10px' },
  tab: { padding: '10px 20px', cursor: 'pointer', background: '#09090b', border: '1px solid #27272a', color: '#71717a', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' as const, letterSpacing: '0.1em', transition: 'all 0.3s ease' },
  activeTab: { borderColor: '#0ea5e9', color: '#fff', backgroundColor: 'rgba(14, 165, 233, 0.1)', boxShadow: '0 0 15px rgba(14, 165, 233, 0.1)' },
  section: { marginBottom: '30px', padding: '30px', backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '4px', position: 'relative' as const },
  subHeader: { color: '#0ea5e9', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' as const, letterSpacing: '0.2em', marginBottom: '20px', marginTop: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column' as const, marginBottom: '15px' },
  label: { fontSize: '9px', fontWeight: '900', color: '#52525b', textTransform: 'uppercase' as const, marginBottom: '8px', letterSpacing: '0.05em' },
  input: { padding: '12px', backgroundColor: '#020203', border: '1px solid #18181b', color: '#fff', fontSize: '12px', borderRadius: '2px', outline: 'none', transition: 'border-color 0.3s' },
  button: { padding: '12px 24px', cursor: 'pointer', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' as const, border: 'none', borderRadius: '2px', transition: 'all 0.3s ease' },
  primaryBtn: { backgroundColor: '#0ea5e9', color: '#000', boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)' },
  imagePreviewSquare: { width: '100px', height: '100px', borderRadius: '4px', border: '1px dashed #27272a', overflow: 'hidden', backgroundColor: '#020203', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chip: { backgroundColor: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0ea5e9', padding: '4px 10px', fontSize: '9px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }
};

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
      alert("CRITICAL ERROR: Security keys do not match!");
      return;
    }
    setShowConfirmModal(true);
  };

  const finalUpdateProtocol = () => {
    localStorage.setItem("SDC_ADMIN_NAME", adminData.name);
    if (adminData.photoUrl) localStorage.setItem("SDC_ADMIN_AVATAR", adminData.photoUrl);
    window.dispatchEvent(new Event("admin_settings_updated"));
    setShowConfirmModal(false);
    alert("SYSTEM: Identity Override Successful.");
  };

  const handleRegistrySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("ARCHIVE DEPLOYED: Personnel data moved to Passout Registry.");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Nexus_Settings</h1>

      <div style={styles.tabContainer}>
        <button style={activeTab === 'SYSTEM' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('SYSTEM')}>Admin_&_Security</button>
        <button style={activeTab === 'RETIRED' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('RETIRED')}>Passout_Registry</button>
      </div>

      {activeTab === 'SYSTEM' && (
        <div className="animate-in fade-in duration-500">
          <form style={styles.section} onSubmit={handleIdentitySubmit}>
            <h2 style={styles.subHeader}>Operator_Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '25px' }}>
              <div className="w-20 h-20 rounded-full border-2 border-sky-500 overflow-hidden bg-black flex items-center justify-center">
                {adminData.photoUrl ? <img src={adminData.photoUrl} alt="Admin" className="w-full h-full object-cover" /> : <span className="text-zinc-600 text-[10px]">{adminData.name.substring(0,2)}</span>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Update_Avatar</label>
                <input type="file" accept="image/*" onChange={handleAdminPhoto} className="text-[10px] text-zinc-500" />
              </div>
            </div>
            <div style={styles.grid}>
              <div style={styles.formGroup}><label style={styles.label}>Operator_Alias</label><input type="text" style={styles.input} value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value.toUpperCase()})} /></div>
              <div style={styles.formGroup}><label style={styles.label}>Reset_Key</label><input type="password" style={styles.input} value={adminData.password} onChange={(e) => setAdminData({...adminData, password: e.target.value})} placeholder="New key..." /></div>
              <div style={styles.formGroup}><label style={styles.label}>Confirm_Key</label><input type="password" style={styles.input} value={adminData.confirmPassword} onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})} placeholder="Verify key..." /></div>
            </div>
            <button type="submit" style={{ ...styles.button, ...styles.primaryBtn, marginTop: '10px' }}>Apply_Override</button>
          </form>
        </div>
      )}

      {activeTab === 'RETIRED' && (
        <form style={styles.section} className="animate-in fade-in duration-500" onSubmit={handleRegistrySubmit}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '2px', backgroundColor: '#0ea5e9' }} />
          <h2 style={styles.subHeader}>Archive_Personnel_Deployment</h2>

          <div className="flex gap-8 mb-8 items-start text-left">
            <div style={styles.formGroup}>
              <label style={styles.label}>Profile_Visual</label>
              <div style={styles.imagePreviewSquare}>
                {newMember.profileImage ? <img src={newMember.profileImage} alt="Archive" className="w-full h-full object-cover" /> : <Upload className="text-zinc-800" size={24} />}
              </div>
              <input type="file" accept="image/*" onChange={handleRegistryPhoto} className="mt-3 text-[9px] text-zinc-600" />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div style={styles.formGroup}><label style={styles.label}>Full_Name</label><input type="text" style={styles.input} required placeholder="Personnel Name" onChange={(e) => setNewMember({...newMember, fullName: e.target.value})} /></div>
              <div style={styles.formGroup}><label style={styles.label}>Personnel_ID</label><input type="text" style={styles.input} required placeholder="SDC-HIST-XX" onChange={(e) => setNewMember({...newMember, personnelId: e.target.value})} /></div>
              <div style={styles.formGroup}><label style={styles.label}>Assigned_Role</label><input type="text" style={styles.input} required placeholder="e.g. Lead Developer" onChange={(e) => setNewMember({...newMember, role: e.target.value})} /></div>
              <div style={styles.formGroup}><label style={styles.label}>LinkedIn_Protocol_URL</label><input type="url" style={styles.input} placeholder="https://linkedin.com/in/..." onChange={(e) => setNewMember({...newMember, linkedInUrl: e.target.value})} /></div>
            </div>
          </div>

          <div style={styles.formGroup} className="text-left">
            <label style={styles.label}>Tech_Stack_Archive (Press Enter to Add)</label>
            <div className="flex gap-2 mb-3">
              <input type="text" style={{ ...styles.input, flex: 1 }} placeholder="Input skill (e.g. REACT)" value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)} />
              <button onClick={() => handleAddSkill()} type="button" className="px-4 bg-zinc-800 border border-white/5 text-white hover:bg-sky-500 hover:text-black transition-all rounded-sm"><Plus size={16}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newMember.techStack.map(skill => (
                <div key={skill} style={styles.chip}>{skill} <X size={10} className="cursor-pointer hover:text-white" onClick={() => removeSkill(skill)} /></div>
              ))}
            </div>
          </div>

          <button type="submit" style={{ ...styles.button, ...styles.primaryBtn, width: '100%', marginTop: '20px' }}>Authorize_Archive_Deploy</button>
        </form>
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-950 border border-sky-500/30 p-8 max-w-md w-full relative">
              <div className="flex items-center gap-4 mb-6">
                <ShieldAlert className="text-sky-500" size={24} />
                <h3 className="text-white font-black uppercase text-sm tracking-widest text-left">Authorize_Override?</h3>
              </div>
              <p className="text-[11px] text-zinc-400 mb-8 italic border-l-2 border-sky-500/50 pl-4 text-left">"Are you sure you want to update the primary identity protocols?"</p>
              <div className="flex gap-4">
                <button onClick={finalUpdateProtocol} className="flex-1 py-3 bg-sky-500 text-black font-black uppercase text-[10px] hover:bg-white transition-all">Authorize</button>
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] border border-white/5">Abort</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
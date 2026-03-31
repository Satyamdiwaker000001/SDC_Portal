import React, { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';

/* cspell:disable */

// --- TYPES ---
type MemberStatus = 'ACTIVE' | 'PASSOUT' | 'RETIRED';

interface MemberProfile {
  personnelId: string;
  fullName: string;
  role: string;
  joinedDate: string;
  passoutDate: string;
  profileImage: File | null;
  previewUrl: string;
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
  input: { padding: '12px', backgroundColor: '#020203', border: '1px solid #18181b', color: '#fff', fontSize: '12px', borderRadius: '2px', outline: 'none' },
  button: { padding: '12px 24px', cursor: 'pointer', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' as const, border: 'none', borderRadius: '2px', transition: 'all 0.3s ease' },
  primaryBtn: { backgroundColor: '#0ea5e9', color: '#000', boxShadow: '0 0 15px rgba(14, 165, 233, 0.2)' },
  secondaryBtn: { backgroundColor: '#18181b', color: '#fff', border: '1px solid #27272a' },
  imagePreviewCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #0ea5e9', overflow: 'hidden', backgroundColor: '#020203', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  imagePreviewSquare: { width: '100px', height: '100px', borderRadius: '4px', border: '1px dashed #27272a', overflow: 'hidden', backgroundColor: '#020203', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chipContainer: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginTop: '10px' },
  chip: { backgroundColor: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#0ea5e9', padding: '5px 12px', fontSize: '10px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '8px' }
};

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SYSTEM' | 'RETIRED'>('SYSTEM');
  
  // --- STATE: Admin Profile & Security ---
  const [adminData, setAdminData] = useState({
    photoUrl: '',
    password: '',
    confirmPassword: '',
    sessionTimeout: 30,
    autoIdleLogout: true
  });

  // --- STATE: Passout Registry ---
  const [skillInput, setSkillInput] = useState('');
  const [newMember, setNewMember] = useState<MemberProfile>({
    personnelId: '', fullName: '', role: '', joinedDate: '', passoutDate: '',
    profileImage: null, previewUrl: '', techStack: [], linkedInUrl: '', gitHubUrl: '', status: 'PASSOUT'
  });

  // Handlers
  const handleAdminPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAdminData({ ...adminData, photoUrl: URL.createObjectURL(file) });
  };

  const handleRegistryPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewMember({ ...newMember, profileImage: file, previewUrl: URL.createObjectURL(file) });
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !newMember.techStack.includes(skill)) {
      setNewMember({ ...newMember, techStack: [...newMember.techStack, skill] });
      setSkillInput('');
    }
  };

  const handleIdentitySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Admin Identity Protocols Updated.");
  };

  const handleRegistrySubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Archive Deployed: Registry Updated.");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Settings</h1>

      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'SYSTEM' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab('SYSTEM')}
        >
          Admin_&_Security
        </button>
        <button 
          style={activeTab === 'RETIRED' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab('RETIRED')}
        >
          Passout_Registry
        </button>
      </div>

      {/* --- TAB 1: ADMIN PROFILE & SYSTEM SECURITY --- */}
      {activeTab === 'SYSTEM' && (
        <div className="animate-in fade-in duration-500">
          <form style={styles.section} onSubmit={handleIdentitySubmit}>
            <h2 style={styles.subHeader}>Operator_Profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '25px' }}>
              <div style={styles.imagePreviewCircle}>
                {adminData.photoUrl ? (
                  <img src={adminData.photoUrl} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '10px', color: '#52525b' }}>NO_IMG</span>
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Update_Admin_Avatar</label>
                <input type="file" accept="image/*" onChange={handleAdminPhoto} style={{ fontSize: '10px', color: '#52525b' }} />
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Reset_Password</label>
                <input type="password" style={styles.input} placeholder="New password..." 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminData({...adminData, password: e.target.value})} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm_Password</label>
                <input type="password" style={styles.input} placeholder="Confirm password..." 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminData({...adminData, confirmPassword: e.target.value})} />
              </div>
            </div>
            <button type="submit" style={{ ...styles.button, ...styles.primaryBtn, marginTop: '10px' }}>Update_Admin_Identity</button>
          </form>

          <div style={styles.section}>
            <h2 style={styles.subHeader}>System_Security_Protocols</h2>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Session_Timeout (Minutes)</label>
                <input type="number" style={styles.input} value={adminData.sessionTimeout} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminData({...adminData, sessionTimeout: parseInt(e.target.value) || 0})} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Idle_Detection_Logout</label>
                <select style={styles.input} value={adminData.autoIdleLogout ? "ON" : "OFF"}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdminData({...adminData, autoIdleLogout: e.target.value === "ON"})}>
                  <option value="ON">ON (Auto-terminate idle session)</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PASSOUT REGISTRY --- */}
      {activeTab === 'RETIRED' && (
        <form style={styles.section} className="animate-in fade-in duration-500" onSubmit={handleRegistrySubmit}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '2px', backgroundColor: '#0ea5e9' }} />
          <h2 style={styles.subHeader}>Registry_Update</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Passout_Visual</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={styles.imagePreviewSquare}>
                {newMember.previewUrl ? (
                  <img src={newMember.previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '24px', color: '#18181b' }}>+</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleRegistryPhoto} style={{ fontSize: '10px', color: '#52525b' }} />
            </div>
          </div>
          
          <div style={styles.grid}>
            <div style={styles.formGroup}><label style={styles.label}>Full_Name</label>
              <input type="text" style={styles.input} placeholder="Identity name..." required 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMember({...newMember, fullName: e.target.value})} /></div>
            <div style={styles.formGroup}><label style={styles.label}>Personnel_ID</label>
              <input type="text" style={styles.input} placeholder="SDC-HIST-01" required 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMember({...newMember, personnelId: e.target.value})} /></div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tech_Stack_Archive (Press Enter)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" style={{ ...styles.input, flex: 1 }} placeholder="Initialize skill..." value={skillInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSkillInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} />
            </div>
            <div style={styles.chipContainer}>
              {newMember.techStack.map(skill => (
                <div key={skill} style={styles.chip}>{skill}</div>
              ))}
            </div>
          </div>

          <button type="submit" style={{ ...styles.button, ...styles.primaryBtn, width: '100%', marginTop: '20px' }}>Authorize_Registry_Deploy</button>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
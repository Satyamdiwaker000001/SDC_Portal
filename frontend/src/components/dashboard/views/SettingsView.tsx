import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  Upload, 
  Cpu,
  ShieldCheck,
  ChevronRight,
  Database,
  Terminal,
  Zap
} from 'lucide-react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import api from '../../../services/api';
import toast from 'react-hot-toast';

type TabType = string;

const SettingsView: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('sdc_user') || '{}');
  const [activeTab, setActiveTab ] = useState<TabType>(user.role?.toLowerCase() === 'admin' ? 'CORE_PROFILE' : 'PERSONNEL');
  const [sysSettings, setSysSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    techStack: '',
    githubUrl: '',
    linkedinUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate personnel dossier retrieval [MOCK_INTEL]
      setTimeout(() => {
        const mockProfile = {
          id: user.id || 'ADMIN-001',
          name: user.name || 'Satyam Diwaker',
          email: user.email || 'admin@sdc.com',
          role: user.role || 'admin',
          spec: 'Full Stack Sentinel',
          image: user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          techStack: ['Typescript', 'React', 'FastAPI', 'PostgreSQL'],
          joinDate: '2024_Q1',
          githubUrl: 'https://github.com/sdc-operative',
          linkedinUrl: 'https://linkedin.com/in/sdc-operative'
        };
        setProfile(mockProfile);
        setFormData({
          name: mockProfile.name,
          email: mockProfile.email,
          image: mockProfile.image,
          techStack: mockProfile.techStack.join(', '),
          githubUrl: mockProfile.githubUrl,
          linkedinUrl: mockProfile.linkedinUrl
        });

        if (user.role?.toLowerCase() === 'admin') {
           setSysSettings({
             'SESSION_TIMEOUT_MINS': '30',
             'MAINTENANCE_MODE': 'OFF',
             'AUTO_ENLISTMENT': 'OFF'
           });
        }
        setLoading(false);
      }, 1200);
    };
    fetchData();
  }, [user.id, user.name, user.email, user.role, user.image]);

  const calculateSyncRate = () => {
    let score = 0;
    if (formData.image) score += 25;
    if (formData.techStack) score += 25;
    if (formData.githubUrl) score += 25;
    if (formData.linkedinUrl) score += 25;
    return score;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await api.post('/users/upload-avatar', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImageUrl = res.data.url;
      setFormData({ ...formData, image: newImageUrl });
      
      // Auto-save image to profile immediately
      const updatePayload = {
         ...formData,
         image: newImageUrl,
         techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      const patchRes = await api.patch(`/users/${user.id}`, updatePayload);
      const updatedUser = { ...user, image: patchRes.data.image, name: patchRes.data.name || formData.name };
      localStorage.setItem('sdc_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('sdc_user_updated'));
      
      toast.success('VISUAL_DATA_UPLINKED_AND_SAVED');
    } catch (err) {
      toast.error('UPLINK_PROTOCOL_TERMINATED');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatePayload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      const res = await api.patch(`/users/${user.id}`, updatePayload);
      const updatedUser = { ...user, image: res.data.image, name: res.data.name };
      localStorage.setItem('sdc_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('sdc_user_updated'));
      toast.success('CORE_IDENTITY_SYNCHRONIZED');
    } catch (err) {
      toast.error('UPDATE_PROTOCOL_FAILED');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <LoaderWrapper>
       <Cpu size={40} className="spin" />
       <span>SYNCING_NEURAL_STREAMS...</span>
    </LoaderWrapper>
  );

  if (!profile) return (
    <LoaderWrapper>
       <Shield size={40} color="var(--color-error)" />
       <span style={{ color: 'var(--color-error)' }}>DASSIER_IDENTIFICATION_FAILURE</span>
       <p style={{ opacity: 0.5, fontSize: '0.7rem' }}>COMMAND_CLEARANCE_REQUIRED_OR_NETWORK_ERROR</p>
    </LoaderWrapper>
  );

  return (
    <ViewContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <MasterHeader>
        <DossierBanner>
           <div className="avatar-preview">
              <img src={formData.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sdc'} alt="" />
              <div className="rank-badge">{(user.role?.charAt(0) || 'U').toUpperCase()}</div>
           </div>
           <div className="banner-info">
              <h1>{(formData.name || user.name || '').toUpperCase()}</h1>
              <div className="meta-row">
                 <span className="id">OPERATIVE_ID: {user.id || 'N/A'}</span>
                 <span className="divider">/</span>
                 <span className="status">STATUS: ALL_SYSTEMS_NOMINAL</span>
              </div>
           </div>
        </DossierBanner>

        <TelemetryCards>
           <TCard>
              <div className="tc-label">JOIN_DATE</div>
              <div className="tc-value">{profile.joinDate || '2024_Q1'}</div>
           </TCard>
           <TCard active>
              <div className="tc-label">SYNC_RATE</div>
              <div className="tc-value">{calculateSyncRate()}%</div>
              <div className="tc-progress"><div className="fill" style={{ width: `${calculateSyncRate()}%` }} /></div>
           </TCard>
           <TCard>
              <div className="tc-label">PERMISSION_LVL</div>
              <div className="tc-value">{user.role?.toUpperCase()}</div>
           </TCard>
        </TelemetryCards>
      </MasterHeader>

      <SettingsHub>
        <TabStrip>
           {(user.role?.toLowerCase() === 'admin' 
              ? ['CORE_PROFILE', 'SESSION_CONFIG'] 
              : ['PERSONNEL', 'NETWORK', 'SECURITY'])
             .map((tab, idx) => (
             <TabButton 
               key={tab}
               active={activeTab === tab}
               onClick={() => setActiveTab(tab)}
             >
               <span className="tab-id">[0{idx + 1}]</span>
               <span className="tab-label">{tab}</span>
               {activeTab === tab && <motion.div layoutId="activeTabGlow" className="indicator-glow" />}
             </TabButton>
           ))}
        </TabStrip>

        <ContentZone>
           <AnimatePresence mode="wait">
              {activeTab === 'PERSONNEL' && (
                <Panel key="personnel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SectionGrid>
                     <TacticalCard>
                        <div className="card-tag">FILE_01_PERSONNEL</div>
                        <div className="card-body">
                           <FormGroup>
                              <label>IDENTIFIER_SIGNATURE</label>
                              <LockedInput><User size={14} /> {profile.name}</LockedInput>
                           </FormGroup>
                           <FormGroup>
                              <label>UPLINK_MAIL</label>
                              <LockedInput><Mail size={14} /> {profile.email}</LockedInput>
                           </FormGroup>
                           <FormGroup>
                              <label>SYSTEM_SPECIALIZATION</label>
                              <LockedInput><ShieldCheck size={14} /> {profile.spec || 'FIELD_OPERATIVE'}</LockedInput>
                           </FormGroup>
                        </div>
                     </TacticalCard>
                     
                     <TacticalCard>
                        <div className="card-tag">VIS_UPLINK_V2</div>
                        <div className="card-body">
                           <FormGroup>
                              <label>AVATAR_ENDPOINT (HTTP/S)</label>
                              <InputRow>
                                 <CyberInput 
                                   placeholder="ENTER_IMAGE_URL..." 
                                   value={formData.image}
                                   onChange={e => setFormData({...formData, image: e.target.value})}
                                 />
                                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                                 <UploadBtn onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                    <Upload size={16} />
                                 </UploadBtn>
                              </InputRow>
                           </FormGroup>
                           <VisualPulse>
                              <div className="pulse-graphic" />
                              <span className="pulse-text">UPLINK_READY_FOR_DATA_INJECTION</span>
                           </VisualPulse>
                        </div>
                     </TacticalCard>
                  </SectionGrid>
                </Panel>
              )}

              {activeTab === 'NETWORK' && (
                <Panel key="network" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <SectionGrid>
                      <TacticalCard>
                         <div className="card-tag">TECH_MANIFEST</div>
                         <div className="card-body">
                            <FormGroup>
                               <label>TECH_STACK_REGISTRY</label>
                               <CyberTextArea 
                                  placeholder="TYPESCRIPT, REACT, GO, DOCKER..." 
                                  value={formData.techStack}
                                  onChange={e => setFormData({...formData, techStack: e.target.value})}
                               />
                               <div className="meta-footer"><Terminal size={10} /> AUTO_SYNC: ENABLED</div>
                            </FormGroup>
                         </div>
                      </TacticalCard>
                      
                      <TacticalCard>
                         <div className="card-tag">NEURAL_CONNECTIONS</div>
                         <div className="card-body">
                            <FormGroup>
                               <label>GITHUB_ARCHIVE</label>
                               <SocialField>
                                  <FiGithub size={20} className="icon" />
                                  <CyberInput 
                                     placeholder="https://github.com/..." 
                                     value={formData.githubUrl}
                                     onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                                  />
                                </SocialField>
                            </FormGroup>
                            <FormGroup style={{ marginTop: '20px' }}>
                               <label>LINKEDIN_DOSSIER</label>
                               <SocialField>
                                  <FiLinkedin size={20} className="icon" />
                                  <CyberInput 
                                     placeholder="https://linkedin.com/..." 
                                     value={formData.linkedinUrl}
                                     onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                                  />
                               </SocialField>
                            </FormGroup>
                         </div>
                      </TacticalCard>
                   </SectionGrid>
                </Panel>
              )}

              {activeTab === 'SECURITY' && (
                <Panel key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                   <TacticalCard>
                      <div className="card-tag">ENCRYPTION_VAULT</div>
                      <SecurityHub>
                         <SecSection>
                            <div className="sec-icon"><Database size={24} /></div>
                            <div className="sec-text">
                               <h4>PASS_OVERRIDE</h4>
                               <p>Access control to your neural key requires administrative authorization from the command center.</p>
                            </div>
                            <CyberBtn disabled>REQUEST_SEC_OVERRIDE <ChevronRight size={14} /></CyberBtn>
                         </SecSection>
                         
                         <SecSection active>
                            <div className="sec-icon"><Zap size={24} /></div>
                            <div className="sec-text">
                               <h4>ACTIVE_SESSION</h4>
                               <p>Currently synchronized via V5 Tactical Bridge. Stability is optimal across all nodes.</p>
                            </div>
                            <div className="active-badge"><div className="ping" /> UPLINK_STABLE</div>
                         </SecSection>
                      </SecurityHub>
                   </TacticalCard>
                </Panel>
              )}

              {activeTab === 'CORE_PROFILE' && (
                <Panel key="core" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SectionGrid>
                     <TacticalCard>
                        <div className="card-tag">ADMINISTRATIVE_DATA</div>
                        <div className="card-body">
                           <FormGroup>
                              <label>IDENTIFIER_SIGNATURE</label>
                              <CyberInput value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                           </FormGroup>
                           <FormGroup>
                              <label>UPLINK_MAIL (LOCKED)</label>
                              <LockedInput><Mail size={14} /> {formData.email}</LockedInput>
                           </FormGroup>
                           <FormGroup>
                              <label>SYSTEM_SPECIALIZATION</label>
                              <LockedInput><ShieldCheck size={14} /> COMMAND_OVERSEER</LockedInput>
                           </FormGroup>
                        </div>
                     </TacticalCard>
                     
                     <TacticalCard>
                        <div className="card-tag">VIS_UPLINK_V2</div>
                        <div className="card-body">
                           <FormGroup>
                              <label>AVATAR_ENDPOINT (HTTP/S)</label>
                              <InputRow>
                                 <CyberInput 
                                   placeholder="ENTER_IMAGE_URL..." 
                                   value={formData.image}
                                   onChange={e => setFormData({...formData, image: e.target.value})}
                                 />
                                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                                 <UploadBtn onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                    <Upload size={16} />
                                 </UploadBtn>
                              </InputRow>
                           </FormGroup>
                           <VisualPulse>
                              <div className="pulse-graphic" />
                              <span className="pulse-text">UPLINK_READY_FOR_DATA_INJECTION</span>
                           </VisualPulse>
                        </div>
                     </TacticalCard>
                  </SectionGrid>
                </Panel>
              )}

              {activeTab === 'SESSION_CONFIG' && (
                 <Panel key="session" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TacticalCard>
                        <div className="card-tag">SESSION_LIFETIME_TTL</div>
                        <SecurityHub>
                             <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                 <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Configure the idle timeout limit. The neural bridge will automatically terminate if no tactical movement is detected within this window.</p>
                                 <div style={{ display: 'flex', gap: '15px' }}>
                                     {['15', '30', '60', '120'].map(mins => (
                                         <TimerButton 
                                            key={mins}
                                            active={sysSettings['SESSION_TIMEOUT_MINS'] === mins}
                                            onClick={() => {
                                                setSysSettings({...sysSettings, SESSION_TIMEOUT_MINS: mins});
                                                api.post('/settings/', { key: 'SESSION_TIMEOUT_MINS', value: mins })
                                                   .then(() => toast.success('SESSION_TTL_UPDATED'))
                                                   .catch(() => toast.error('ERROR_UPDATING_TTL'));
                                            }}
                                         >
                                            {mins === '120' ? '2_HOURS' : `${mins}_MINUTES`}
                                         </TimerButton>
                                     ))}
                                 </div>
                             </div>
                        </SecurityHub>
                    </TacticalCard>
                 </Panel>
              )}
           </AnimatePresence>
        </ContentZone>

        {activeTab !== 'SESSION_CONFIG' && (
          <CommitArea>
             <CommitBtn onClick={handleSave} disabled={saving}>
                <Save size={18} />
                <span>{saving ? 'TRANSMITTING...' : 'SAVE_OPERATIVE_DATA'}</span>
             </CommitBtn>
          </CommitArea>
        )}
      </SettingsHub>
    </ViewContainer>
  );
};

/* --- ADVANCED TACTICAL STYLING --- */

const ViewContainer = styled(motion.div)` padding: 50px 40px; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 50px; box-sizing: border-box; width: 100%; `;
const MasterHeader = styled.div` display: flex; justify-content: space-between; align-items: flex-end; `;
const DossierBanner = styled.div`
  display: flex; align-items: center; gap: 30px;
  .avatar-preview {
    width: 110px; height: 110px; border-radius: 28px; position: relative; border: 2px solid var(--ui-primary); padding: 5px;
    img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }
    .rank-badge { position: absolute; bottom: -10px; right: -10px; width: 34px; height: 34px; background: var(--ui-primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 900; color: white; border: 3px solid var(--bg-main); font-size: 0.8rem; }
  }
  .banner-info {
    h1 { font-family: var(--font-display); font-size: 2.2rem; letter-spacing: 0.05em; margin: 0; }
    .meta-row { display: flex; gap: 20px; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); opacity: 0.7; margin-top: 8px; font-weight: 800; .status { color: var(--accent-success); } }
  }
`;
const TelemetryCards = styled.div` display: flex; gap: 20px; `;
const TCard = styled.div<{ active?: boolean }>`
  background: var(--bg-card); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 18px 24px; min-width: 160px;
  .tc-label { font-family: var(--font-mono); font-size: 0.5rem; color: var(--ui-primary); font-weight: 800; opacity: 0.8; margin-bottom: 5px; }
  .tc-value { font-family: var(--font-heading); font-size: 1rem; font-weight: 800; color: var(--text-main); }
  .tc-progress { margin-top: 10px; height: 4px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: var(--ui-primary); box-shadow: 0 0 10px var(--ui-primary); } }
  ${props => props.active && `border-color: rgba(var(--color-primary-rgb), 0.3);`}
`;
const SettingsHub = styled.div` background: var(--bg-card); backdrop-filter: var(--glass-blur); border: var(--border-glass); border-radius: 32px; padding: 40px; display: flex; flex-direction: column; gap: 40px; box-shadow: var(--shadow-premium); `;
const TabStrip = styled.div` display: flex; gap: 50px; border-bottom: 2px solid var(--border-glass); `;
const TabButton = styled.button<{ active: boolean }>`
  background: none; border: none; padding: 20px 0; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.3s; position: relative;
  .tab-id { font-family: var(--font-mono); font-size: 0.6rem; color: var(--ui-primary); font-weight: 800; opacity: 0.5; }
  .tab-label { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: ${props => props.active ? 'var(--text-main)' : 'var(--text-dim)'}; letter-spacing: 0.1em; }
  &:hover .tab-label { color: var(--ui-primary); }
  .indicator-glow { position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: var(--ui-primary); box-shadow: 0 0 15px var(--ui-primary); }
`;
const ContentZone = styled.div` min-height: 400px; `;
const Panel = styled(motion.div)` width: 100%; `;
const SectionGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 32px; @media (max-width: 1000px) { grid-template-columns: 1fr; } `;
const TacticalCard = styled.div`
  background: var(--bg-glass); border: var(--border-glass); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
  .card-tag { background: var(--bg-main); padding: 12px 24px; font-family: var(--font-mono); font-size: 0.55rem; color: var(--ui-primary); font-weight: 800; border-bottom: var(--border-glass); letter-spacing: 0.1em; }
  .card-body { padding: 30px; display: flex; flex-direction: column; gap: 24px; }
`;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 10px; label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); font-weight: 800; opacity: 0.6; padding-left: 5px; } `;
const LockedInput = styled.div` background: var(--bg-main); border: var(--border-glass); border-radius: 12px; padding: 15px 20px; color: var(--text-dim); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 12px; opacity: 0.7; `;
const InputRow = styled.div` display: flex; gap: 12px; `;
const CyberInput = styled.input` flex: 1; background: var(--bg-main); border: var(--border-glass); border-radius: 12px; padding: 15px 20px; color: var(--text-main); font-family: var(--font-heading); font-size: 0.8rem; transition: 0.3s; &:focus { border-color: var(--ui-primary); outline: none; background: var(--bg-card); } `;
const CyberTextArea = styled.textarea` width: 100%; min-height: 120px; resize: none; background: var(--bg-main); border: var(--border-glass); border-radius: 12px; padding: 15px 20px; color: var(--text-main); font-family: var(--font-heading); font-size: 0.8rem; transition: 0.3s; &:focus { border-color: var(--ui-primary); outline: none; background: var(--bg-card); } `;
const SocialField = styled.div` display: flex; align-items: center; gap: 15px; position: relative; .icon { color: var(--ui-primary); opacity: 0.8; filter: drop-shadow(0 0 5px var(--ui-primary)); } `;
const VisualPulse = styled.div` display: flex; align-items: center; gap: 15px; background: rgba(var(--color-primary-rgb), 0.03); padding: 15px 20px; border-radius: 14px; border: 1px solid rgba(var(--color-primary-rgb), 0.1); .pulse-graphic { width: 40px; height: 3px; background: var(--ui-primary); position: relative; overflow: hidden; &::after { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: white; animation: pulse 2s infinite; } } .pulse-text { font-family: var(--font-mono); font-size: 0.55rem; color: var(--ui-primary); font-weight: 800; } @keyframes pulse { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } `;
const SecurityHub = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const SecSection = styled.div<{ active?: boolean }>`
  background: var(--bg-main); border: var(--border-glass); border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 24px;
  .sec-icon { width: 56px; height: 56px; border-radius: 16px; background: var(--bg-card); display: flex; align-items: center; justify-content: center; color: var(--ui-primary); border: var(--border-glass); }
  .sec-text { flex: 1; h4 { font-size: 1rem; margin-bottom: 5px; } p { font-size: 0.8rem; color: var(--text-dim); opacity: 0.8; line-height: 1.5; } }
  .active-badge { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-success); font-weight: 800; .ping { width: 100%; height: 10px; background: var(--color-success); border-radius: 50%; box-shadow: 0 0 10px var(--color-success); } }
`;
const CommitArea = styled.div` display: flex; justify-content: flex-end; `;
const UploadBtn = styled.button` background: var(--bg-glass); border: var(--border-glass); border-radius: 12px; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; color: var(--ui-primary); cursor: pointer; transition: 0.3s; &:hover { background: var(--ui-primary); color: white; transform: rotate(90deg); } `;
const CyberBtn = styled.button` background: var(--bg-glass); border: var(--border-glass); border-radius: 12px; padding: 12px 24px; color: var(--text-main); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; opacity: 0.5; `;
const CommitBtn = styled.button`
  background: linear-gradient(135deg, var(--ui-primary), var(--ui-secondary));
  border: none; border-radius: 18px; padding: 20px 48px; color: white !important; font-weight: 900;
  font-family: var(--font-heading); font-size: 0.9rem; letter-spacing: 0.1em; cursor: pointer;
  display: flex; align-items: center; gap: 15px; transition: 0.4s;
  box-shadow: 0 15px 40px rgba(var(--color-primary-rgb), 0.3);
  &:hover:not(:disabled) { transform: translateY(-5px) scale(1.02); box-shadow: 0 25px 50px rgba(var(--color-primary-rgb), 0.5); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const LoaderWrapper = styled.div` height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--ui-primary); .spin { animation: spin 2s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `;

const TimerButton = styled.button<{ active: boolean }>`
   background: ${props => props.active ? 'var(--ui-primary)' : 'var(--bg-main)'};
   color: ${props => props.active ? '#fff' : 'var(--text-dim)'};
   border: 1px solid ${props => props.active ? 'var(--ui-primary)' : 'var(--border-glass)'};
   padding: 15px 30px; border-radius: 12px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
   cursor: pointer; transition: 0.3s;
   &:hover { background: ${props => props.active ? 'var(--ui-primary)' : 'var(--bg-glass)'}; color: #fff; transform: translateY(-2px); }
`;

export default SettingsView;

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Mail, Trash2, Activity, RefreshCw, Edit } from 'lucide-react';
import { useSDCData } from '../../../hooks/useSDCData';
import { useSearchFilter } from '../../../context/SearchFilterContext';
import TacticalFilterBar from '../premium/TacticalFilterBar';
import { Modal, FormGroup, SubmitButton, FormGrid } from '../AdminModals';
import TacticalHeader from '../premium/TacticalHeader';
import TacticalFrame from '../premium/TacticalFrame';
import toast from 'react-hot-toast';

const MembersView: React.FC = () => {
  const { members = [], projects = [], refresh } = useSDCData() as any;
  const { searchQuery, statusFilter } = useSearchFilter();
  const sdc_user = JSON.parse(localStorage.getItem('sdc_user') || '{"role": "developer"}');

  const [modal, setModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [detailModal, setDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    spec: 'Full Stack Developer',
    role: 'developer',
    password: '',
    joinDate: new Date().toISOString().split('T')[0],
    image: 'N/A'
  });
  const [uploading, setUploading] = useState(false);

  const getOperativeIntel = (memberId: string) => {
    const filteredProjects = sdc_user.role === 'admin' 
      ? (projects || []) 
      : (projects || []).filter((p: any) => 
          p?.team?.leaderId === sdc_user.id || p?.team?.members?.some((m: any) => m?.id === sdc_user.id)
        );
    const allTasks = (filteredProjects || []).flatMap((p: any) => p?.tasks || []) || [];
    const memberTasks = (allTasks || []).filter((t: any) => t?.assignedTo === memberId) || [];
    
    if (memberTasks.length === 0) return { count: 0, progress: 0 };
    const totalProgress = memberTasks.reduce((sum: number, t: any) => sum + (t.progress || 0), 0);
    return {
      count: memberTasks.length,
      progress: Math.round(totalProgress / memberTasks.length)
    };
  };

  const getSkills = (memberId: string) => {
    const seed = (memberId || 'SDC').charCodeAt(0) + (memberId || 'SDC').charCodeAt((memberId || 'SDC').length - 1);
    return [
      { label: 'NEURAL_LOGIC', val: 60 + (seed % 35) },
      { label: 'FRONTEND_OPS', val: 65 + ((seed * 7) % 30) },
      { label: 'BACKEND_SYNC', val: 55 + ((seed * 13) % 40) },
      { label: 'CYBER_PROTOCOLS', val: 50 + ((seed * 3) % 45) }
    ];
  };

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    setTimeout(() => {
      URL.createObjectURL(file);
      toast.success('Profile Photo Added');
      setUploading(false);
    }, 1000);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email) {
      toast.error('MISSING_MANDATORY_FIELDS');
      return;
    }
    toast.loading('Adding Member...', { duration: 1000 });
    setTimeout(() => {
      toast.success('Member Added');
      setModal(false);
      setFormData({
        name: '', email: '', spec: 'Full Stack Developer', role: 'developer',
        password: '', joinDate: new Date().toISOString().split('T')[0], image: 'N/A'
      });
      refresh();
    }, 1200);
  };



  const filteredMembers = (members || []).filter((m: any) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || m.role === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <ViewContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TacticalHeader 
        title="Team Directory" 
        subtitle={`Connection: Secure // Total Members: ${members?.length || 0}`}
        actions={sdc_user.role === 'admin' && (
          <AddBtn onClick={() => setModal(true)}>
            <Plus size={18} /> <span>Add Member</span>
          </AddBtn>
        )}
      />

      <TacticalFilterBar 
        placeholder="Search by Name, Email or ID (e.g. MEM-001)..." 
        statusOptions={[
          { label: 'Admins', value: 'ADMIN' },
          { label: 'Developers', value: 'DEVELOPER' }
        ]}
      />

      <RegistryGrid>
        {filteredMembers.map((m: any, index: number) => {
          const intel = getOperativeIntel(m.id);
          return (
            <TacticalFrame
              key={m.id || index}
              delay={index * 0.05}
              statusColor={m.role === 'admin' ? '#8B5CF6' : '#60A5FA'}
              onClick={() => { setSelectedMember(m); setDetailModal(true); }}
            >
              <CardInner>
                <CardTop>
                  <AvatarBox>
                    {m.image && m.image !== 'N/A' ? <img src={m.image} alt="" /> : (m.name || '?').charAt(0)}
                  </AvatarBox>
                  <div className="status-badge" style={{ color: m.status === 'ACTIVE' ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                    <Activity size={10} /> {m.status || 'ACTIVE'}
                  </div>
                </CardTop>
                
                <CardMain>
                  <h3>{m.name}</h3>
                  <p className="spec">{m.spec || 'Team Member'}</p>
                  <div className="meta">
                    <Mail size={12} /> <span>{m.email}</span>
                  </div>
                </CardMain>

                <ProgressLayer>
                  <div className="label">
                    <span>Task Success Rate: {intel.progress}%</span>
                    <span>{intel.count} Active Tasks</span>
                  </div>
                  <div className="bar">
                    <motion.div 
                      className="fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${intel.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                      style={{ background: m.role === 'admin' ? '#8B5CF6' : 'var(--accent-primary)' }}
                    />
                  </div>
                </ProgressLayer>

                <CardTags>
                  <RoleTag $isAdmin={m.role === 'admin'}>{m.role || 'Member'}</RoleTag>
                </CardTags>

                {sdc_user.role === 'admin' && (
                  <CardActions>
                    <ActionButton onClick={(e) => { e.stopPropagation(); setSelectedMember(m); setDetailModal(true); }} title="View Profile">
                      <Edit size={14} />
                    </ActionButton>
                    <ActionButton $danger onClick={(e) => { e.stopPropagation(); }} title="Remove Member">
                      <Trash2 size={14} />
                    </ActionButton>
                  </CardActions>
                )}
              </CardInner>
            </TacticalFrame>
          );
        })}
      </RegistryGrid>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New Member">
        <FormGrid>
          <FormGroup fullWidth>
            <label>Profile Photo</label>
            <PhotoUploadZone>
              <input type="file" id="avatar-upload" hidden accept="image/*" onChange={e => e.target.files && handleAvatarUpload(e.target.files[0])} />
              <label htmlFor="avatar-upload" className="upload-box">
                {uploading ? <RefreshCw size={24} className="spin" /> : formData.image && formData.image !== 'N/A' ? <img src={formData.image} alt="" className="preview" /> : <><Plus size={24} /><span>Upload Photo</span></>}
              </label>
            </PhotoUploadZone>
          </FormGroup>
          <FormGroup fullWidth><label>Full Name</label><input placeholder="Enter full name..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></FormGroup>
          <FormGroup><label>Work Email</label><input type="email" placeholder="user@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></FormGroup>
          <FormGroup><label>Role</label><select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option value="developer">Standard</option><option value="admin">Administrator</option></select></FormGroup>
        </FormGrid>
        <SubmitButton onClick={handleCreate}>Add Member</SubmitButton>
      </Modal>

      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Member Profile">
        <DossierLayout>
          <DossierTop>
            <DossierAvatar>
              {selectedMember?.image && selectedMember?.image !== 'N/A' ? <img src={selectedMember.image} alt="" /> : <div className="char">{selectedMember?.name?.charAt(0)}</div>}
              <div className="status-dot" />
            </DossierAvatar>
            <div className="dossier-id">
              <h2>{selectedMember?.name}</h2>
              <div className="sub">{selectedMember?.spec} // {selectedMember?.role?.toUpperCase()}</div>
              <div className="mail">{selectedMember?.email}</div>
            </div>
          </DossierTop>
          <DossierGrid>
            <DossierSection>
              <div className="sec-title">Skill Competencies</div>
              <SkillList>{getSkills(selectedMember?.id || '').map(s => (<SkillRow key={s.label} label={s.label} val={s.val} />))}</SkillList>
            </DossierSection>
            <DossierSection>
              <div className="sec-title">Performance Stats</div>
              <StatsRow><StatBox label="Projects" val="12" /><StatBox label="Utilization" val="94%" /><StatBox label="Level" val="Expert" /></StatsRow>
            </DossierSection>
          </DossierGrid>
        </DossierLayout>
      </Modal>
    </ViewContainer>
  );
};

const SkillRow = ({ label, val }: { label: string, val: number }) => (
  <SRow>
    <div className="meta"><span>{label}</span><span>{val}%</span></div>
    <div className="bar"><motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1.5 }} className="fill" /></div>
  </SRow>
);

const StatBox = ({ label, val }: { label: string, val: string }) => (
  <SBox><div className="val">{val}</div><div className="label">{label}</div></SBox>
);

const ViewContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 40px; `;
const AddBtn = styled.button` background: var(--bg-glass); border: var(--border-glow); border-radius: 12px; padding: 12px 24px; color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.3s; &:hover { background: var(--accent-primary); color: white; box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); } `;
const RegistryGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; `;
const CardInner = styled.div` padding: 30px; height: 100%; display: flex; flex-direction: column; position: relative; `;
const CardTop = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; .status-badge { background: rgba(16, 185, 129, 0.05); padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.55rem; display: flex; align-items: center; gap: 6px; font-weight: 800; } `;
const AvatarBox = styled.div` width: 54px; height: 54px; background: rgba(56, 189, 248, 0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--accent-primary); border: 1px solid rgba(56, 189, 248, 0.2); overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } `;
const CardMain = styled.div` margin-bottom: 24px; h3 { font-size: 1.1rem; margin-bottom: 6px; font-weight: 800; } .spec { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); opacity: 0.7; margin-bottom: 12px; } .meta { display: flex; align-items: center; gap: 10px; color: var(--text-dim); font-size: 0.7rem; } `;
const ProgressLayer = styled.div` margin-bottom: 24px; .label { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); margin-bottom: 8px; } .bar { height: 4px; background: var(--bg-main); border-radius: 10px; overflow: hidden; } .fill { height: 100%; border-radius: 10px; } `;
const CardTags = styled.div` display: flex; gap: 8px; `;
const RoleTag = styled.span<{ $isAdmin?: boolean }>`
  background: ${p => p.$isAdmin ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-glass)'};
  color: ${p => p.$isAdmin ? '#8B5CF6' : 'var(--text-dim)'};
  border: 1px solid ${p => p.$isAdmin ? 'rgba(139, 92, 246, 0.2)' : 'var(--border-glass)'};
  padding: 4px 10px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.55rem;
`;
const CardActions = styled.div` position: absolute; bottom: 20px; right: 20px; display: flex; gap: 10px; `;
const ActionButton = styled.button<{ $danger?: boolean }>` background: var(--bg-glass); border: var(--border-glass); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: ${p => p.$danger ? 'var(--accent-error)' : 'var(--text-dim)'}; cursor: pointer; transition: 0.3s; &:hover { background: ${p => p.$danger ? 'var(--accent-error)' : 'var(--accent-primary)'}; color: white; } `;
const DossierLayout = styled.div` display: flex; flex-direction: column; gap: 30px; padding: 10px; `;
const DossierTop = styled.div` display: flex; align-items: center; gap: 24px; `;
const DossierAvatar = styled.div` width: 80px; height: 80px; border-radius: 20px; overflow: hidden; background: rgba(56, 189, 248, 0.1); border: 2px solid var(--accent-primary); position: relative; img { width: 100%; height: 100%; object-fit: cover; } .char { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem; font-weight: 900; color: var(--accent-primary); } .status-dot { position: absolute; bottom: 5px; right: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent-success); border: 2px solid var(--bg-main); } `;
const DossierGrid = styled.div` display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; `;
const DossierSection = styled.div` background: var(--bg-card); border: var(--border-glass); border-radius: 20px; padding: 20px; .sec-title { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 20px; opacity: 0.6; } `;
const SkillList = styled.div` display: flex; flex-direction: column; gap: 15px; `;
const SRow = styled.div` .meta { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); margin-bottom: 6px; } .bar { height: 4px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary); } } `;
const StatsRow = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; `;
const SBox = styled.div` background: var(--bg-glass); border: var(--border-glass); border-radius: 12px; padding: 12px; text-align: center; .val { font-family: var(--font-heading); font-size: 1rem; font-weight: 900; color: var(--text-main); } .label { font-family: var(--font-mono); font-size: 0.45rem; color: var(--text-dim); margin-top: 4px; } `;
const PhotoUploadZone = styled.div` .upload-box { width: 100%; height: 160px; border: 2px dashed var(--border-glass); border-radius: 16px; background: var(--bg-main); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-dim); transition: 0.3s; overflow: hidden; &:hover { border-color: var(--accent-primary); background: var(--bg-glass); color: var(--accent-primary); } .preview { width: 100%; height: 100%; object-fit: cover; } span { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.1em; } } `;

export default MembersView;

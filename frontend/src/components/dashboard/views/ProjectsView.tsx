import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Clock, ShieldCheck } from 'lucide-react';
import { useSDCData } from '../../../hooks/useSDCData';
import { useSearchFilter } from '../../../context/SearchFilterContext';
import TacticalHeader from '../premium/TacticalHeader';
import TacticalFrame from '../premium/TacticalFrame';
import TacticalFilterBar from '../premium/TacticalFilterBar';
import toast from 'react-hot-toast';
import { Modal, FormGroup, SubmitButton, FormGrid } from '../AdminModals';
import { TacticalSelect } from '../TacticalSelect';

const ProjectsView: React.FC = () => {
  const { projects = [], refresh } = useSDCData() as any;
  const { searchQuery, statusFilter } = useSearchFilter();
  const sdc_user = JSON.parse(localStorage.getItem('sdc_user') || '{"role": "developer"}');

  const filteredProjects = (sdc_user.role === 'admin' 
    ? (projects || []) 
    : (projects || []).filter((p: any) => 
        p?.team?.leaderId === sdc_user.id || p?.team?.members?.some((m: any) => m?.id === sdc_user.id)
      )).filter((p: any) => {
        const matchesSearch = 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.missionCode?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showCustomType, setShowCustomType] = useState(false);
  const [formData, setFormData] = useState({
    missionCode: '',
    name: '',
    type: 'Web Application',
    customType: '',
    deadline: '',
    description: ''
  });

  const generateMissionId = (name: string) => {
    if (!name) return 'SDC-XXXX';
    const prefix = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 4);
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix || 'MSN'}-${suffix}`;
  };

  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({ ...prev, missionCode: generateMissionId(formData.name) }));
    }
  }, [formData.name]);

  const handleCreate = async () => {
    toast.loading('Creating Project...', { duration: 1000 });
    setTimeout(() => {
      toast.success('Project Created');
      setModal(false);
      setFormData({
        missionCode: '', name: '', type: 'Web Application', customType: '',
        deadline: '', description: ''
      });
      refresh();
    }, 1200);
  };

  const handleCSVUpload = async () => {
    toast.loading('Syncing Data...', { duration: 1500 });
    setTimeout(() => {
      toast.success('Data Synced');
      setModal(false);
      refresh();
    }, 1800);
  };

  const missionTypeOptions = [
    { label: 'Web Application', value: 'Web Application' },
    { label: 'Mobile System', value: 'Mobile System' },
    { label: 'Core API', value: 'Core API' },
    { label: 'Cybersecurity', value: 'Cybersecurity' },
    { label: 'Custom...', value: 'Custom...' }
  ];

  return (
    <ViewContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TacticalHeader 
        title="Project Pipeline" 
        subtitle={`System Status: Online // Active Projects: ${filteredProjects.length}`}
        actions={sdc_user.role === 'admin' && (
          <AddBtn onClick={() => setModal(true)}>
            <Plus size={18} /> <span>Create Project</span>
          </AddBtn>
        )}
      />

      <TacticalFilterBar 
        placeholder="Search by Project Name, ID or Mission Code (e.g. PROJ-ALPHA)..." 
        statusOptions={[
          { label: 'Live Projects', value: 'LIVE' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Drafts', value: 'DRAFT' }
        ]}
      />

      <ProjectGrid>
        {filteredProjects.map((p: any, index: number) => (
          <TacticalFrame
            key={p.id || index}
            delay={index * 0.05}
            statusColor={p.status === 'LIVE' ? 'var(--accent-success)' : 'var(--accent-primary)'}
            onClick={() => { setSelectedProject(p); setDetailModal(true); }}
          >
            <CardInner>
              <CardHeader>
                <StatusBadge $status={p.status}>{p.status}</StatusBadge>
                <div className="type-tag">{p.type}</div>
              </CardHeader>

              <CardMain>
                <h3>{p.name}</h3>
                <p>{p.description || "No description provided"}</p>
              </CardMain>

              <ProgressSection>
                 <div className="progress-info">
                    <span>Progress: {p.progress}%</span>
                    <div className="deadline">
                       <Clock size={12} /> {p.deadline || 'TBD'}
                    </div>
                 </div>
                 <ProgressBar>
                    <motion.div 
                      className="fill" 
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.05 + 0.5 }}
                    />
                 </ProgressBar>
              </ProgressSection>

              <CardFooter>
                 <div className="team-intel">
                    <ShieldCheck size={14} />
                    <span>{p.team?.name || 'Unassigned'}</span>
                 </div>
                 <div className="actions">
                    {sdc_user.role === 'admin' && (
                      <>
                        <IconButton onClick={(e) => { e.stopPropagation(); }} title="Edit Project"><Edit2 size={14} /></IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); }} $danger title="Delete Project"><Trash2 size={14} /></IconButton>
                      </>
                    )}
                    <IconButton onClick={(e) => { e.stopPropagation(); }}><ExternalLink size={14} /></IconButton>
                 </div>
              </CardFooter>
            </CardInner>
          </TacticalFrame>
        ))}
      </ProjectGrid>

      <Modal 
        isOpen={modal} 
        onClose={() => setModal(false)} 
        title="Create New Project"
        onCSVUpload={handleCSVUpload}
        csvTemplateUrl="/static/templates/projects_template.csv"
      >
        <FormGrid>
          <FormGroup>
            <label>Project ID</label>
            <input 
              value={formData.missionCode}
              readOnly
              style={{ opacity: 0.8, color: 'var(--accent-primary)', cursor: 'not-allowed', fontStyle: 'italic' }}
            />
          </FormGroup>
          <FormGroup>
            <label>Project Name</label>
            <input 
              placeholder="Enter project name..." 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup fullWidth={!showCustomType}>
            <TacticalSelect 
              label="Project Type"
              options={missionTypeOptions}
              value={formData.type}
              onChange={(val) => {
                setFormData({...formData, type: val});
                setShowCustomType(val === 'Custom...');
              }}
            />
          </FormGroup>

          {showCustomType && (
            <FormGroup>
              <label>Custom Project Type</label>
              <input 
                placeholder="Enter custom type..."
                value={formData.customType}
                onChange={e => setFormData({...formData, customType: e.target.value})}
              />
            </FormGroup>
          )}

          <FormGroup fullWidth>
            <label>Deadline</label>
            <input 
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </FormGroup>
          <FormGroup fullWidth>
            <label>Project Description</label>
            <textarea 
              placeholder="Define Project Scope..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </FormGroup>
        </FormGrid>
        <SubmitButton onClick={handleCreate}>Create Project</SubmitButton>
      </Modal>

      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Project Overview">
        <IntelLayout>
          <IntelHeader>
            <div className="status-orb" />
            <div className="title-block">
               <h2>{selectedProject?.name}</h2>
               <div className="meta">{selectedProject?.type} // ID: {selectedProject?.id}</div>
            </div>
          </IntelHeader>
          <IntelContent>
            <IntelSection>
              <div className="sec-label">Project Objectives</div>
              <p className="desc">{selectedProject?.description || 'No objectives provided'}</p>
            </IntelSection>
            <IntelGrid>
              <IntelSection>
                <div className="sec-label">Resource Allocation</div>
                <ResourceStats>
                   <ResRow label="Compute Power" val="42%" />
                   <ResRow label="Bandwidth" val="88%" />
                   <ResRow label="Team Size" val={`${selectedProject?.team?.members?.length || 0}`} />
                </ResourceStats>
              </IntelSection>
              <IntelSection>
                <div className="sec-label">Project Roadmap</div>
                <RoadmapList>
                   <RoadStep label="v1.0 Alpha Release" done />
                   <RoadStep label="External Security Audit" active />
                   <RoadStep label="Mainframe Deployment" pending />
                </RoadmapList>
              </IntelSection>
            </IntelGrid>
          </IntelContent>
        </IntelLayout>
      </Modal>
    </ViewContainer>
  );
};

const ResRow = ({ label, val }: { label: string, val: string }) => (
  <RRow>
    <span className="label">{label}</span>
    <span className="val">{val}</span>
  </RRow>
);

const RoadStep = ({ label, done, active }: { label: string, done?: boolean, active?: boolean, pending?: boolean }) => (
  <RTStep $active={active || done}>
     <div className={`dot ${done ? 'done' : active ? 'active' : ''}`} />
     <span>{label}</span>
  </RTStep>
);

const ViewContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 40px; `;

const AddBtn = styled.button`
  background: var(--bg-glass); border: var(--border-glow); border-radius: 12px; padding: 12px 24px;
  color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer;
  display: flex; align-items: center; gap: 12px; transition: 0.3s;
  &:hover { background: var(--accent-primary); color: white; box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
`;

const ProjectGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; `;

const CardInner = styled.div` padding: 30px; display: flex; flex-direction: column; gap: 24px; height: 100%; position: relative; `;

const CardHeader = styled.div` display: flex; justify-content: space-between; align-items: center; .type-tag { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); opacity: 0.6; } `;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
  background: ${p => p.$status === 'LIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)'};
  color: ${p => p.$status === 'LIVE' ? '#10B981' : 'var(--accent-primary)'};
  border: 1px solid ${p => p.$status === 'LIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)'};
`;

const CardMain = styled.div` h3 { font-size: 1.15rem; margin-bottom: 10px; font-weight: 800; } p { font-size: 0.75rem; color: var(--text-dim); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; } `;

const ProgressSection = styled.div` .progress-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; span { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); } .deadline { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); } } `;

const ProgressBar = styled.div` height: 6px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 10px; } `;

const CardFooter = styled.div` display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: var(--border-glass); .team-intel { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); } .actions { display: flex; gap: 8px; } `;

const IconButton = styled.button<{ $danger?: boolean }>`
  background: var(--bg-glass); border: var(--border-glass); border-radius: 8px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  color: ${p => p.$danger ? 'var(--accent-error)' : 'var(--text-dim)'}; cursor: pointer; transition: 0.3s;
  &:hover { background: ${p => p.$danger ? 'var(--accent-error)' : 'var(--accent-primary)'}; color: white; }
`;

const IntelLayout = styled.div` display: flex; flex-direction: column; gap: 30px; `;
const IntelHeader = styled.div` display: flex; align-items: center; gap: 20px; .status-orb { width: 12px; height: 12px; border-radius: 50%; background: var(--accent-primary); box-shadow: 0 0 15px var(--accent-primary); } h2 { font-size: 1.4rem; font-weight: 900; } .meta { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); } `;
const IntelContent = styled.div` display: flex; flex-direction: column; gap: 24px; `;
const IntelSection = styled.div` background: var(--bg-glass); border: var(--border-glass); border-radius: 18px; padding: 20px; .sec-label { font-family: var(--font-mono); font-size: 0.55rem; color: var(--accent-primary); font-weight: 800; margin-bottom: 15px; opacity: 0.6; } .desc { font-size: 0.85rem; color: var(--text-main); line-height: 1.6; } `;
const IntelGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 20px; `;
const ResourceStats = styled.div` display: flex; flex-direction: column; gap: 12px; `;
const RRow = styled.div` display: flex; justify-content: space-between; font-size: 0.75rem; .label { font-family: var(--font-mono); font-size: 0.6rem; opacity: 0.7; } .val { font-weight: 800; } `;
const RoadmapList = styled.div` display: flex; flex-direction: column; gap: 12px; `;
const RTStep = styled.div<{ $active?: boolean }>` display: flex; align-items: center; gap: 12px; font-size: 0.75rem; color: ${p => p.$active ? 'var(--text-main)' : 'var(--text-dim)'}; .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--bg-main); &.done { background: var(--accent-success); box-shadow: 0 0 10px var(--accent-success); } &.active { background: var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary); } } `;

export default ProjectsView;

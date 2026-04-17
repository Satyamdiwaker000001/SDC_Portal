import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Check, X, Power, Cpu } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ApplicationsView: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Simulate recruitment registry provisioning [MOCK_DATA]
    setTimeout(() => {
      setApps([
        { id: 1, name: 'Ava Thorne', email: 'ava@nexus.io', contact: '+1 (555) 0101', class_name: 'B.Tech CS / 2024', interested: 'Full Stack Development / Blockchain Architecture', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava', status: 'PENDING', timestamp: '2026-04-10T10:00:00Z' },
        { id: 2, name: 'Liam Vance', email: 'liam@void.com', contact: '+1 (555) 0202', class_name: 'M.S. CyberSec', interested: 'Penetration Testing / Threat Intelligence', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam', status: 'REVIEWED', timestamp: '2026-04-12T14:30:00Z' },
        { id: 3, name: 'Zoe Quinn', email: 'zoe@cyber.org', contact: '+1 (555) 0303', class_name: 'B.E. IT / 2025', interested: 'UI/UX Design / Interaction Paradigms', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe', status: 'PENDING', timestamp: '2026-04-14T09:15:00Z' },
        { id: 4, name: 'Ethan Hunt', email: 'ethan@impossible.net', contact: '+1 (555) 0007', class_name: 'Diplomacy / Intel', interested: 'DevOps / Stealth Infrastructure', photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', status: 'PENDING', timestamp: '2026-04-15T11:45:00Z' }
      ]);
      setIsOpen(true);
      setSelectedIds(new Set());
      setLoading(false);
    }, 1500);
  };

  const toggleStatus = async () => {
    try {
      const res = await api.post('/applications/toggle');
      setIsOpen(res.data.isOpen);
      toast.success(`Applications ${res.data.isOpen ? 'Open' : 'Closed'}`);
    } catch (err) {
      toast.error('Action Failed');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/applications/${id}/approve`);
      toast.success('Applicant Approved');
      fetchData();
    } catch (err) {
      toast.error('Approval Failed');
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm('Reject this applicant?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Applicant Rejected');
      fetchData();
    } catch (err) {
      toast.error('Rejection Failed');
    }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === apps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(apps.map(a => a.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const idList = Array.from(selectedIds);
    try {
      await api.post('/applications/bulk-approve', { ids: idList });
      toast.success(`Approved ${idList.length} Applicants`);
      fetchData();
    } catch (err) {
      toast.error('Bulk Approval Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    if (isProcessing) return;
    if (!window.confirm(`Reject ${selectedIds.size} applicants?`)) return;
    setIsProcessing(true);
    const idList = Array.from(selectedIds);
    try {
      await api.post('/applications/bulk-reject', { ids: idList });
      toast.success('Applicants Rejected');
      fetchData();
    } catch (err) {
      toast.error('Bulk Rejection Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportExcel = () => {
    window.open(`${api.defaults.baseURL}/applications/export-excel`, '_blank');
  };

  if (loading) return (
    <LoaderWrapper>
      <Cpu size={40} className="spin" />
      <span>Loading applicant data...</span>
    </LoaderWrapper>
  );

  return (
    <ViewContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <div className="title-block">
          <h2>Recruit Pipeline</h2>
          <p>Applications: {isOpen ? 'Open' : 'Closed'} // Pending: {apps.length}</p>
        </div>
        
        <ControlPanel active={isOpen}>
           <GlobalSelect onClick={toggleSelectAll} active={selectedIds.size === apps.length && apps.length > 0}>
             <Check size={14} />
             <span>{selectedIds.size === apps.length ? 'Deselect All' : 'Select All'}</span>
           </GlobalSelect>
           <div className="status-indicator">
              <div className="pulse" />
              <span>{isOpen ? 'Open' : 'Closed'}</span>
           </div>
           <ToggleButton onClick={toggleStatus} active={isOpen}>
              <Power size={14} />
              <span>{isOpen ? 'Close Applications' : 'Open Applications'}</span>
           </ToggleButton>
           <ExportButton onClick={handleExportExcel}>
              <Cpu size={14} />
              <span>Generate Excel</span>
           </ExportButton>
        </ControlPanel>
      </Header>

      <RecruitGrid>
        <AnimatePresence>
          {apps.map((app, index) => (
            <RecruitCard
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleSelect(app.id)}
              isSelected={selectedIds.has(app.id)}
            >
              <CardTop>
                <div className="avatar-section">
                  <div className="avatar-ring">
                     {app.photo_url ? (
                       <img src={app.photo_url} alt={app.name} className="recruit-photo" />
                     ) : (
                       <User size={20} />
                     )}
                  </div>
                  <div className="name-stack">
                    <h3>{app.name}</h3>
                    <span className="id-sub">Applicant ID: #{app.id}</span>
                  </div>
                  <Checkbox active={selectedIds.has(app.id)}>
                    {selectedIds.has(app.id) && <Check size={10} />}
                  </Checkbox>
                </div>
                <div className="class-tag">{app.class_name}</div>
              </CardTop>

              <CardBody>
                <div className="meta-info">
                  <div className="row"><Mail size={12} /> {app.email}</div>
                  <div className="row"><Phone size={12} /> {app.contact}</div>
                </div>
                <div className="intent-box">
                  <p>"{app.interested}"</p>
                </div>
              </CardBody>

              <CardActions>
                <ActionButton className="approve" onClick={(e) => { e.stopPropagation(); handleApprove(app.id); }} title="Approve Applicant">
                  <Check size={16} /> <span>Approve</span>
                </ActionButton>
                {app.resume_url && (
                  <ActionButton className="resume" onClick={(e) => { e.stopPropagation(); window.open(app.resume_url, '_blank'); }} title="View/Download Resume">
                    <Cpu size={14} /> <span>Resume</span>
                  </ActionButton>
                )}
                <ActionButton className="reject" onClick={(e) => { e.stopPropagation(); handleReject(app.id); }} title="Reject Applicant">
                  <X size={16} /> <span>Reject</span>
                </ActionButton>
              </CardActions>
              
              <DecoBars />
            </RecruitCard>
          ))}
        </AnimatePresence>
      </RecruitGrid>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <BulkHUD
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="hud-info">
              <span className="count">{selectedIds.size}</span>
              <span className="label">Applicants Selected</span>
            </div>
            <div className="hud-actions">
              <BulkButton className="approve" onClick={handleBulkApprove} disabled={isProcessing}>
                <Check size={16} /> <span>Approve Selected</span>
              </BulkButton>
              <BulkButton className="reject" onClick={handleBulkReject} disabled={isProcessing}>
                <X size={16} /> <span>Reject Selected</span>
              </BulkButton>
              <CloseHUD onClick={() => setSelectedIds(new Set())}><X size={14} /></CloseHUD>
            </div>
          </BulkHUD>
        )}
      </AnimatePresence>
    </ViewContainer>
  );
};

/* --- STYLED COMPONENTS --- */

const ViewContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 40px; `;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end;
  .title-block {
    h2 { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.1em; margin-bottom: 8px; }
    p { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); }
  }
`;

const ControlPanel = styled.div<{ active: boolean }>`
  background: var(--bg-glass); border: var(--border-glass); border-radius: 16px; padding: 10px 20px;
  display: flex; align-items: center; gap: 30px;
  .status-indicator {
    display: flex; align-items: center; gap: 10px;
    span { font-family: var(--font-mono); font-size: 0.65rem; color: ${props => props.active ? 'var(--accent-success)' : 'var(--accent-error)'}; font-weight: 800; }
    .pulse { 
      width: 8px; height: 8px; background: ${props => props.active ? 'var(--accent-success)' : 'var(--accent-error)'}; border-radius: 50%;
      box-shadow: 0 0 10px ${props => props.active ? 'var(--accent-success)' : 'var(--accent-error)'};
    }
  }
`;

const ExportButton = styled.button`
  background: var(--bg-glass); border: var(--border-glass); color: var(--accent-primary);
  padding: 8px 16px; border-radius: 10px; font-family: var(--font-mono); font-size: 0.6rem;
  display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
  &:hover { background: var(--accent-primary); color: white; }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  border: 1px solid ${props => props.active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  color: ${props => props.active ? 'var(--accent-error)' : 'var(--accent-success)'};
  padding: 8px 16px; border-radius: 10px; font-family: var(--font-mono); font-size: 0.6rem;
  display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
  &:hover { background: ${props => props.active ? 'var(--accent-error)' : 'var(--accent-success)'}; color: white; }
`;

const RecruitCard = styled(motion.div)<{ isSelected?: boolean }>`
  background: var(--bg-card); backdrop-filter: var(--glass-blur); border: var(--border-glass);
  border-radius: 24px; padding: 30px; position: relative; overflow: hidden;
  transition: 0.3s;
  ${props => props.isSelected && `
    border-color: var(--accent-primary);
    background: ${props.theme.mode === 'light' ? 'rgba(47, 69, 80, 0.02)' : 'rgba(96, 165, 250, 0.02)'};
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.05);
  `}
  &:hover { border-color: var(--accent-primary); transform: translateY(-4px); }
`;

const RecruitGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px;
  padding-bottom: 120px;
`;

const CardTop = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  .avatar-section { display: flex; align-items: center; gap: 15px; position: relative; }
  .avatar-ring {
    width: 48px; height: 48px; background: rgba(255,255,255,0.03); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: var(--accent-primary);
    overflow: hidden; border: 1px solid var(--border-glass);
    .recruit-photo { width: 100%; height: 100%; object-fit: cover; }
  }
  .name-stack {
    display: flex; flex-direction: column; gap: 2px;
    h3 { font-size: 1rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .id-sub { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); }
  }
  .class-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); opacity: 0.6; }
`;

const Checkbox = styled.div<{ active: boolean }>`
  width: 18px; height: 18px; border-radius: 4px;
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-glass)'};
  background: ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: white; display: flex; align-items: center; justify-content: center;
  position: absolute; top: -5px; left: -5px; transition: 0.2s;
`;

const GlobalSelect = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-glass)'};
  color: ${props => props.active ? 'white' : 'var(--text-dim)'};
  padding: 8px 16px; border-radius: 10px; font-family: var(--font-mono); font-size: 0.6rem;
  display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
`;

const BulkHUD = styled(motion.div)`
  position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
  background: var(--bg-card); backdrop-filter: blur(20px); border: 1px solid var(--accent-primary);
  padding: 15px 30px; border-radius: 20px; z-index: 1000;
  display: flex; align-items: center; gap: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(96, 165, 250, 0.1);
  .hud-info {
    display: flex; align-items: center; gap: 15px;
    .count { font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent-primary); }
    .label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); letter-spacing: 0.1em; }
  }
  .hud-actions { display: flex; align-items: center; gap: 15px; }
`;

const BulkButton = styled.button`
  border: none; border-radius: 10px; padding: 10px 20px; font-family: var(--font-mono);
  font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px;
  transition: 0.3s;
  &.approve { background: var(--accent-success); color: white; }
  &.reject { background: var(--accent-error); color: white; }
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CloseHUD = styled.button`
  background: rgba(255,255,255,0.05); border: none; color: var(--text-dim);
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; cursor: pointer; &:hover { background: var(--accent-error); color: white; }
`;

const CardBody = styled.div`
  h3 { font-size: 1.1rem; margin-bottom: 12px; font-weight: 800; color: var(--text-main); }
  .meta-info {
    margin-bottom: 20px;
    .row { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: var(--text-dim); margin-bottom: 6px; }
  }
  .intent-box {
    background: ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.2)'}; 
    border-radius: 12px; padding: 15px; border-left: 3px solid var(--accent-primary);
    p { font-size: 0.7rem; line-height: 1.5; color: var(--text-dim); font-style: italic; }
  }
`;

const CardActions = styled.div` margin-top: 30px; display: flex; gap: 10px; `;

const ActionButton = styled.button`
  flex: 1; border: none; border-radius: 12px; padding: 10px; font-family: var(--font-mono);
  font-size: 0.6rem; font-weight: 800; cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 6px; transition: 0.3s;
  &.approve { background: rgba(16, 185, 129, 0.1); color: var(--accent-success); border: 1px solid rgba(16, 185, 129, 0.2); }
  &.reject { background: rgba(239, 68, 68, 0.1); color: var(--accent-error); border: 1px solid rgba(239, 68, 68, 0.2); }
  &.resume { background: var(--bg-glass); border: var(--border-glass); color: var(--accent-primary); }
  &:hover { transform: translateY(-2px); filter: brightness(1.2); }
`;

const DecoBars = styled.div`
  position: absolute; top: 0; right: 0; width: 60px; height: 4px;
  background: linear-gradient(90deg, transparent, var(--accent-primary)); opacity: 0.2;
`;

const LoaderWrapper = styled.div`
  height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
  font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.2em; color: var(--accent-primary);
  .spin { animation: spin 2s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export default ApplicationsView;

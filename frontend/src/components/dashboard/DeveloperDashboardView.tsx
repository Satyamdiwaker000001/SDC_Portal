import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  CheckCircle,
  Search,
  Settings,
  MapPin, 
  Target,
  Zap,
  Terminal,
  Cpu
} from 'lucide-react';
import { FiGithub, FiLinkedin, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementsWall from './AnnouncementsWall';
import { useSDCData } from '../../hooks/useSDCData';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal, FormGroup, SubmitButton } from './AdminModals';
import { HUDBorder, TacticalBadge, DecoLine, TerminalText } from '../common/HUDElements';

const DeveloperDashboardView: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('sdc_user') || '{}');
  const { projects, refresh, loading } = useSDCData();
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'INTEL'>('PROJECTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [profileModal, setProfileModal] = useState(false);
  const [pulseModal, setPulseModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const myProjects = projects.filter((p: any) => 
    p.team?.leaderId === user.id || p.team?.members?.some((m: any) => m.id === user.id)
  );

  const myTasks = projects.flatMap((p: any) => p.tasks || []).filter((t: any) => t.assignedTo === user.id);

  const executeProgressPulse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    try {
      await api.patch(`/projects/tasks/${selectedTask.id}/status`, {
        status: 'DONE',
        progress: 100,
        workLog: data.workLog
      });
      toast.success('Pulse Transmitted: Awaiting Leader Seal');
      refresh();
      setPulseModal(false);
    } catch (err) {
      toast.error('Uplink Failed');
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    if (data.techStack) data.techStack = data.techStack.split(';').map((s: string) => s.trim()).filter((s: string) => s);
    try {
      await api.patch(`/users/${user.id}`, data);
      toast.success('Profile Refinement Successful');
      localStorage.setItem('sdc_user', JSON.stringify({ ...user, ...data }));
      refresh();
      setProfileModal(false);
    } catch (err) {
      toast.error('Identity Sync Failed');
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <TerminalText text="SYNCHRONIZING OPERATIVE MISSION DATA..." speed={30} />
    </div>
  );

  return (
    <DashboardContainer>
      <SidePanel
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HUDBorder>
          <div className="corner-bl" />
          <ProfileHeader>
            <div className="avatar-wrapper">
               <FiUser size={48} color="var(--accent-secondary)" />
               <div className="avatar-glow" />
            </div>
            <div className="name-stack">
               <h2>{user.name}</h2>
               <TacticalBadge>MK-{user.id.substring(user.id.length - 4)}</TacticalBadge>
            </div>
          </ProfileHeader>
          
          <DecoLine />
          
          <QuickStatsGrid>
             <div className="stat-node">
                <span className="label">ACTIVE_MISSIONS</span>
                <span className="value">{myProjects.length}</span>
             </div>
             <div className="stat-node">
                <span className="label">MODULES_ASSIGNED</span>
                <span className="value">{myTasks.length}</span>
             </div>
          </QuickStatsGrid>

          <ArsenalSection>
             <div className="label-row">
                <Cpu size={12} /> TECHNICAL_ARSENAL
             </div>
             <div className="skills-cloud">
                {user.techStack?.map((skill: string, i: number) => (
                  <motion.span key={i} whileHover={{ scale: 1.1, color: 'var(--accent-secondary)' }}>
                     {skill}
                  </motion.span>
                )) || <span className="dim">NO_SKILLS_INDEXED</span>}
             </div>
          </ArsenalSection>

          <DecoLine />
          
          <NavGroup>
             <NavButton active={activeTab === 'PROJECTS'} onClick={() => setActiveTab('PROJECTS')}>
                <Target size={16} /> OPERATIONAL_GRID
             </NavButton>
             <NavButton active={activeTab === 'INTEL'} onClick={() => setActiveTab('INTEL')}>
                <Terminal size={16} /> DATA_STREAM
             </NavButton>
          </NavGroup>

          <FooterMeta>
             <div className="meta-row">
                <MapPin size={10} /> HQ: SDC_STATION_ALPHA
             </div>
             <div className="meta-row link-row">
                <a href={user.githubUrl} target="_blank" rel="noreferrer"><FiGithub size={14} /></a>
                <a href={user.linkedinUrl} target="_blank" rel="noreferrer"><FiLinkedin size={14} /></a>
                <Settings size={14} onClick={() => setProfileModal(true)} style={{ cursor: 'pointer' }} />
             </div>
          </FooterMeta>
        </HUDBorder>
      </SidePanel>

      <MainScope
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="view-header">
           <div className="title-stack">
              <h1>{activeTab === 'PROJECTS' ? 'MISSION_OVERVIEW' : 'INTEL_STREAM'}</h1>
              <span className="path">root / operatives / {user.name.toLowerCase().replace(' ', '_')} / {activeTab.toLowerCase()}</span>
           </div>
           
           {activeTab === 'PROJECTS' && (
             <SearchHUD>
                <Search size={16} className="search-icon" />
                <input 
                  placeholder="FILTER_OPERATIONS..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </SearchHUD>
           )}
        </div>

        <AnimatePresence mode="wait">
           {activeTab === 'PROJECTS' ? (
             <motion.div 
               key="projects" 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -20 }}
               className="projects-scroll"
             >
                {myProjects.length > 0 ? myProjects.map((project: any) => (
                  <ProjectHUDCard key={project.id}>
                     <div className="project-top">
                        <div className="header-intel">
                           <TacticalBadge>{project.category || 'PROJECT'}</TacticalBadge>
                           <h3>{project.name}</h3>
                        </div>
                        <div className="progress-hub">
                           <div className="percentage">{project.progress}%</div>
                           <div className="bar-wrapper">
                              <motion.div 
                                className="fill" 
                                initial={{ width: 0 }} 
                                animate={{ width: `${project.progress}%` }} 
                              />
                           </div>
                        </div>
                     </div>
                     
                     <div className="task-matrix">
                        {(project.tasks || []).filter((t: any) => t.assignedTo === user.id).map((task: any) => (
                          <TaskModuleCard key={task.id} status={task.status}>
                             <div className="module-top">
                                <span className="id">MOD_{task.id.split('-')[0]}</span>
                                <StatusTag status={task.status}>{task.status}</StatusTag>
                             </div>
                             <h4>{task.title}</h4>
                             <p>{task.moduleName}</p>
                             
                             {task.status !== 'DONE' && (
                               <div className="actions">
                                  <ActionButton onClick={() => toast.loading('Initializing module...')}>
                                     <Zap size={14} /> INITIALIZE
                                  </ActionButton>
                                  <ActionButton primary onClick={() => { setSelectedTask(task); setPulseModal(true); }}>
                                     <CheckCircle size={14} /> TRANSMIT_PULSE
                                  </ActionButton>
                               </div>
                             )}
                          </TaskModuleCard>
                        ))}
                        {(project.tasks || []).filter((t: any) => t.assignedTo === user.id).length === 0 && (
                          <div className="no-tasks">NO_DIRECTIVES_IN_THIS_MODULE</div>
                        )}
                     </div>
                  </ProjectHUDCard>
                )) : (
                  <EmptyHUD>
                     <Zap size={48} className="zap-icon" />
                     <h3>NO_ACTIVE_DEPLOYMENTS</h3>
                     <p>AWAITING MISSION ASSIGNMENT FROM COMMAND</p>
                  </EmptyHUD>
                )}
             </motion.div>
           ) : (
             <motion.div 
               key="intel"
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -20 }}
             >
                <AnnouncementsWall />
             </motion.div>
           )}
        </AnimatePresence>
      </MainScope>

      {/* Modals upgraded to HUD theme in AdminModals overhaul */}
      <Modal isOpen={pulseModal} onClose={() => setPulseModal(false)} title="TRANSMIT_PROGRESS_PULSE">
        <form onSubmit={executeProgressPulse}>
          <FormGroup>
            <label>TACTICAL_WORK_LOG</label>
            <textarea name="workLog" placeholder="DESCRIBE COMPLETED OBJECTIVES..." required />
          </FormGroup>
          <SubmitButton type="submit">TRANSMIT_DATA_TO_LEAD</SubmitButton>
        </form>
      </Modal>

      <Modal isOpen={profileModal} onClose={() => setProfileModal(false)} title="REFINE_OPERATIVE_IDENTITY">
        <form onSubmit={updateProfile}>
          <FormGroup>
             <label>SPECIALIZATION</label>
             <input name="spec" defaultValue={user.spec} placeholder="e.g. CORE_ARCHITECT" />
          </FormGroup>
          <FormGroup>
             <label>TECH_STACK (SEMI-COLON SEPARATED)</label>
             <input name="techStack" defaultValue={user.techStack?.join('; ')} placeholder="React; Node; Python" />
          </FormGroup>
          <FormGroup>
             <label>MISSION_STATEMENT</label>
             <textarea name="bio" defaultValue={user.bio} placeholder="Enter your directive..." />
          </FormGroup>
          <SubmitButton type="submit">SYNCHRONIZE_IDENTITY</SubmitButton>
        </form>
      </Modal>

    </DashboardContainer>
  );
};

/* Styled Components for the HUD Dashboard */

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: var(--bg-dark);
  padding: 24px;
  gap: 24px;
  overflow: hidden;
`;

const SidePanel = styled(motion.div)`
  width: 350px;
  height: 100%;
  flex-shrink: 0;
  
  .corner-bl {
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 15px;
    height: 15px;
    border: 2px solid var(--accent-secondary);
    border-right: 0;
    border-top: 0;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;

  .avatar-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(45, 212, 191, 0.05);
    border: 1px solid var(--accent-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 4px;
  }
  
  .avatar-glow {
    position: absolute;
    inset: 0;
    border: 1px solid var(--accent-secondary);
    animation: pulse 2s infinite;
    opacity: 0.3;
  }

  .name-stack {
    h2 { font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 0.1em; margin-bottom: 8px; }
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;

  .stat-node {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .label { font-size: 0.55rem; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 0.1em; }
    .value { font-size: 1.4rem; font-weight: 800; color: var(--accent-secondary); font-family: var(--font-mono); }
  }
`;

const ArsenalSection = styled.div`
  margin-top: 30px;
  .label-row {
    font-size: 0.65rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .skills-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    span {
      font-size: 0.65rem;
      background: rgba(255,255,255,0.03);
      padding: 4px 10px;
      border-radius: 2px;
      border: 1px solid rgba(255,255,255,0.05);
      font-family: var(--font-mono);
      cursor: default;
    }
  }
`;

const NavGroup = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(45, 212, 191, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--accent-secondary)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-secondary)' : 'var(--text-dim)'};
  padding: 12px 20px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    color: var(--accent-secondary);
    background: rgba(45, 212, 191, 0.05);
  }
`;

const FooterMeta = styled.div`
  margin-top: auto;
  padding-top: 40px;
  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.6rem;
    color: var(--text-dim);
    font-family: var(--font-mono);
    margin-bottom: 12px;
  }
  .link-row {
     margin-top: 20px;
     gap: 20px;
     a { color: var(--text-dim); transition: 0.2s; &:hover { color: var(--accent-secondary); } }
  }
`;

const MainScope = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow: hidden;

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    
    h1 { font-family: var(--font-mono); font-size: 1.8rem; letter-spacing: 0.3em; margin-bottom: 4px; color: var(--text-main); }
    .path { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-secondary); opacity: 0.5; letter-spacing: 0.1em; }
  }

  .projects-scroll {
     flex: 1;
     overflow-y: auto;
     padding-right: 10px;
     display: flex;
     flex-direction: column;
     gap: 24px;
     
     &::-webkit-scrollbar { width: 4px; }
     &::-webkit-scrollbar-thumb { background: rgba(45, 212, 191, 0.1); border-radius: 10px; }
  }
`;

const SearchHUD = styled.div`
  position: relative;
  width: 300px;
  
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--accent-secondary); opacity: 0.5; }
  
  input {
    width: 100%;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 12px 12px 12px 42px;
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    outline: none;
    transition: all 0.3s;
    
    &:focus { border-color: var(--accent-secondary); box-shadow: 0 0 15px rgba(45, 212, 191, 0.1); }
  }
`;

const ProjectHUDCard = styled.div`
  background: rgba(8, 14, 28, 0.4);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 24px;
  
  .project-top {
     display: flex;
     justify-content: space-between;
     align-items: flex-start;
     margin-bottom: 30px;
  }
  
  .header-intel {
     display: flex;
     flex-direction: column;
     gap: 12px;
     h3 { font-family: var(--font-mono); color: var(--text-main); letter-spacing: 0.1em; font-size: 1.2rem; }
  }
  
  .progress-hub {
     width: 150px;
     text-align: right;
     .percentage { font-family: var(--font-mono); color: var(--accent-secondary); font-size: 1rem; font-weight: 800; margin-bottom: 8px; }
     .bar-wrapper { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
     .fill { height: 100%; background: var(--accent-secondary); box-shadow: 0 0 10px var(--accent-secondary); }
  }

  .task-matrix {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
     gap: 20px;
  }
`;

const TaskModuleCard = styled.div<{ status: string }>`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 16px;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;

  &:hover {
     background: rgba(255,255,255,0.04);
     border-color: rgba(45, 212, 191, 0.3);
  }

  .module-top {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 12px;
     .id { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); }
  }

  h4 { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-main); margin-bottom: 6px; }
  p { font-size: 0.7rem; color: var(--text-dim); margin-bottom: 16px; font-family: var(--font-mono); }

  .actions {
     display: flex;
     gap: 10px;
     margin-top: 10px;
  }
`;

const StatusTag = styled.span<{ status: string }>`
  font-size: 0.55rem;
  font-family: var(--font-mono);
  padding: 2px 8px;
  border-radius: 2px;
  background: ${props => props.status === 'DONE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.status === 'DONE' ? 'var(--accent-success)' : 'var(--accent-warning)'};
  border: 1px solid ${props => props.status === 'DONE' ? 'var(--accent-success)' : 'var(--accent-warning)'}44;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  background: ${props => props.primary ? 'var(--accent-secondary)' : 'transparent'};
  border: 1px solid var(--accent-secondary);
  color: ${props => props.primary ? 'var(--bg-dark)' : 'var(--accent-secondary)'};
  padding: 8px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
     background: var(--accent-secondary);
     color: var(--bg-dark);
     box-shadow: 0 0 10px var(--accent-secondary)44;
  }
`;

const EmptyHUD = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.2;
  text-align: center;
  
  .zap-icon { margin-bottom: 20px; }
  h3 { font-family: var(--font-mono); letter-spacing: 0.4em; }
  p { font-family: var(--font-mono); font-size: 0.7rem; margin-top: 10px; letter-spacing: 0.1em; }
`;

export default DeveloperDashboardView;

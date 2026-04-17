import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Users, 
  Plus, 
  Search, 
  Layers,
  Shield,
  User,
  ExternalLink,
  Activity,
  Edit2,
  Trash2,
  Cpu,
  Globe,
  Zap
} from 'lucide-react';
import { useSDCData } from '../../hooks/useSDCData';
import type { SDCMember, SDCProject, SDCTeam } from '../../hooks/useSDCData';
import AnnouncementsWall from './AnnouncementsWall';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal, FormGroup, SubmitButton, FormGrid } from './AdminModals';
import { HUDBorder, TacticalBadge, DecoLine, TerminalText } from '../common/HUDElements';

// Type Definitions
interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  spec?: string;
  image?: string;
}

interface Team {
  id: string;
  name: string;
  leaderId: string;
  leader?: Member;
  members?: Member[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  academicYear?: string;
  gitHubRepo?: string;
  team?: Team;
  tasks?: any[];
}

const AdminDashboardView: React.FC = () => {
  const { members, projects, teams, refresh, loading } = useSDCData();
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'PROJECTS' | 'TEAMS' | 'ANNOUNCEMENTS'>('PROJECTS');
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'PROJECT_PIPELINE'>('OVERVIEW');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [teamModal, setTeamModal] = useState(false);

  // Create filtered datasets
  const filteredMembers = (members as SDCMember[] | undefined)?.filter((m: SDCMember) => 
    (searchTerm === '' || (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const filteredProjects = (projects as SDCProject[] | undefined)?.filter((p: SDCProject) => 
    (searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const filteredTeams = (teams as SDCTeam[] | undefined)?.filter((t: SDCTeam) => 
    (searchTerm === '' || t.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleRecruitmentToggle = async () => {
    try {
      await api.post('/applications/toggle');
      setRecruitmentOpen(!recruitmentOpen);
      toast.success(`Recruitment ${!recruitmentOpen ? 'OPENED' : 'CLOSED'}`);
    } catch (err) {
      toast.error('Failed to toggle recruitment');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Decommission this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project Terminated');
      refresh();
    } catch (err) {
      toast.error('Termination Failed');
    }
  };

  const selectedProject = projects?.find((p: SDCProject) => p.id === selectedProjectId) as SDCProject | undefined;

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <TerminalText text="ACCESSING COMMAND_AND_CONTROL_MAINFRAME..." speed={30} />
    </div>
  );

  return (
    <DashboardLayout>
      <AdminSidebar
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HUDBorder>
           <div className="corner-bl" />
           <CommandBranding>
              <div className="icon-shield"><Shield size={24} /></div>
              <div className="text-stack">
                 <h2>HQ_COMMAND</h2>
                 <TacticalBadge>SECURE_SESSION</TacticalBadge>
              </div>
           </CommandBranding>
           
           <DecoLine />

           <NavGroup>
              <NavBtn active={activeTab === 'PROJECTS'} onClick={() => { setActiveTab('PROJECTS'); setActiveView('OVERVIEW'); }}>
                 <Layers size={18} /> MISSION_PIPELINE
              </NavBtn>
              <NavBtn active={activeTab === 'MEMBERS'} onClick={() => { setActiveTab('MEMBERS'); setActiveView('OVERVIEW'); }}>
                 <Users size={18} /> OPERATIVE_REGISTRY
              </NavBtn>
              <NavBtn active={activeTab === 'TEAMS'} onClick={() => { setActiveTab('TEAMS'); setActiveView('OVERVIEW'); }}>
                 <Cpu size={18} /> SQUAD_ORGANIZER
              </NavBtn>
              <NavBtn active={activeTab === 'ANNOUNCEMENTS'} onClick={() => { setActiveTab('ANNOUNCEMENTS'); setActiveView('OVERVIEW'); }}>
                 <Globe size={18} /> GLOBAL_BROADCAST
              </NavBtn>
           </NavGroup>

           <DecoLine />
           
           <SystemStatusCard>
              <div className="status-row">
                 <div className={`status-led ${recruitmentOpen ? 'active' : ''}`} />
                 <span>RECRUITMENT: {recruitmentOpen ? 'ACTIVE' : 'IDLE'}</span>
              </div>
              <ToggleSwitch active={recruitmentOpen} onClick={handleRecruitmentToggle}>
                 <div className="knob" />
              </ToggleSwitch>
           </SystemStatusCard>

           <SidebarFooter>
              <div className="meta">UPLINK_STABLE // 12.04.26</div>
              <Activity size={16} color="var(--accent-secondary)" />
           </SidebarFooter>
        </HUDBorder>
      </AdminSidebar>

      <AdminMain
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="main-header">
           <div className="title-stack">
              <h1>{activeTab === 'PROJECTS' && activeView === 'PROJECT_PIPELINE' ? selectedProject?.name : activeTab}</h1>
              <span className="path">root / command / {activeTab.toLowerCase()} {activeView === 'PROJECT_PIPELINE' ? `/ ${selectedProjectId}` : ''}</span>
           </div>

           <div className="action-hub">
              <SearchWrapper>
                 <Search size={16} className="icon" />
                 <input 
                   placeholder="SCAN_RECORDS..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </SearchWrapper>
              <ActionButton onClick={() => {
                if (activeTab === 'PROJECTS') setProjectModal(true);
                if (activeTab === 'MEMBERS') setMemberModal(true);
                if (activeTab === 'TEAMS') setTeamModal(true);
              }}>
                <Plus size={18} /> ADD_OBJECTIVE
              </ActionButton>
           </div>
        </div>

        <ContentWrapper>
           <AnimatePresence mode="wait">
              {activeTab === 'PROJECTS' && (
                <motion.div 
                  key="projects-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ display: 'flex', gap: '24px', height: '100%' }}
                >
                   {activeView === 'PROJECT_PIPELINE' ? (
                     <PipelineLayout>
                        <ProjectSidebar>
                           {projects.map((p: any) => (
                             <ProjectNode 
                               key={p.id} 
                               active={p.id === selectedProjectId}
                               onClick={() => setSelectedProjectId(p.id)}
                             >
                                <div className="id-tag">#{p.id.substring(0, 4)}</div>
                                <div className="name-row">
                                   <div className="dot" />
                                   {p.name}
                                </div>
                             </ProjectNode>
                           ))}
                        </ProjectSidebar>
                        <ModuleMatrix>
                           <HUDBorder>
                              <div className="matrix-header">
                                 <div className="intel">
                                    <TacticalBadge>OPERATION: {selectedProject?.name}</TacticalBadge>
                                    <p>ACADEMIC_YEAR: {selectedProject?.academicYear || '2025-26'}</p>
                                 </div>
                                 <div className="repo-link">
                                    <Globe size={14} /> {selectedProject?.gitHubRepo || 'UNLINKED'}
                                 </div>
                              </div>
                              <ModuleGrid>
                                 {(selectedProject?.tasks || []).map((task: any) => (
                                   <ModuleCard key={task.id}>
                                      <div className="m-top">
                                         <span className="m-id">{task.id}</span>
                                         <span className="m-status">{task.status}</span>
                                      </div>
                                      <h4>{task.title}</h4>
                                      <div className="m-progress">
                                         <div className="m-bar"><motion.div className="m-fill" initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} /></div>
                                         <span>{task.progress}%</span>
                                      </div>
                                      <DecoLine style={{ opacity: 0.1 }} />
                                      <div className="m-intel">
                                         <div className="intel-row"><strong>ASSIGNED:</strong> {task.assignedTo || 'PENDING'}</div>
                                         <div className="intel-row"><strong>PATH:</strong> {task.moduleName || '/root'}</div>
                                      </div>
                                   </ModuleCard>
                                 ))}
                              </ModuleGrid>
                           </HUDBorder>
                        </ModuleMatrix>
                     </PipelineLayout>
                   ) : (
                     <ProjectGrid>
                        {filteredProjects.map((p: Project) => (
                          <ProjectOverviewCard key={p.id}>
                             <div className="c-header">
                                <TacticalBadge>{p.status}</TacticalBadge>
                                <div className="c-actions">
                                   <Edit2 size={14} onClick={() => { setSelectedProjectId(p.id); setProjectModal(true); }} />
                                   <Trash2 size={14} onClick={() => deleteProject(p.id)} />
                                </div>
                             </div>
                             <h2 onClick={() => { setSelectedProjectId(p.id); setActiveView('PROJECT_PIPELINE'); }}>{p.name}</h2>
                             <div className="c-progress">
                                <div className="p-text">UPLINK_PROGRESS: {p.progress}%</div>
                                <div className="p-bar"><motion.div className="p-fill" initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} /></div>
                             </div>
                             <div className="c-footer">
                                <span>YEAR: {p.academicYear}</span>
                                <ExternalLink size={14} />
                             </div>
                          </ProjectOverviewCard>
                        ))}
                     </ProjectGrid>
                   )}
                </motion.div>
              )}

              {activeTab === 'MEMBERS' && (
                <GridOverlay key="members">
                   {filteredMembers.map(m => (
                     <MemberTacticalCard key={m.id}>
                        <div className="avatar-sec">
                           {m.image ? <img src={m.image} alt="" /> : <User size={24} />}
                        </div>
                        <div className="info-sec">
                           <h3>{m.name}</h3>
                           <p>{m.role}</p>
                           <TacticalBadge>{m.spec || 'OPERATIVE'}</TacticalBadge>
                        </div>
                        <div className="actions-sec">
                           <Edit2 size={14} />
                           <Trash2 size={14} />
                        </div>
                     </MemberTacticalCard>
                   ))}
                </GridOverlay>
              )}

              {activeTab === 'TEAMS' && (
                <GridOverlay key="teams">
                   {filteredTeams.map(t => (
                     <TeamTacticalCard key={t.id}>
                        <div className="team-head">
                           <h3>{t.name}</h3>
                           <TacticalBadge>SQUAD_ID: {t.id}</TacticalBadge>
                        </div>
                        <div className="member-list">
                           {(t.members as any[])?.map((m, idx) => (
                             <div key={idx} className="member-mini">
                                <div className="dot" /> {typeof m === 'object' ? (m as any).name : m}
                             </div>
                           ))}
                        </div>
                     </TeamTacticalCard>
                   ))}
                </GridOverlay>
              )}

              {activeTab === 'ANNOUNCEMENTS' && (
                <motion.div key="intel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <AnnouncementsWall />
                </motion.div>
              )}
           </AnimatePresence>
        </ContentWrapper>
      </AdminMain>

      {/* Modals are globally styled in the HUD theme */}
      <Modal isOpen={projectModal} onClose={() => setProjectModal(false)} title="INITIALIZE_NEW_OPERATION">
         <FormGrid>
            <FormGroup fullWidth>
               <label>OPERATION_NAME</label>
               <input placeholder="ENTER_NAME..." />
            </FormGroup>
            <FormGroup>
               <label>TARGET_DEADLINE</label>
               <input type="date" />
            </FormGroup>
            <FormGroup>
               <label>MISSION_TYPE</label>
               <select>
                  <option>WEB_INTERFACE</option>
                  <option>CORE_SYSTEM</option>
                  <option>SECURITY_PROTOCOL</option>
               </select>
            </FormGroup>
            <FormGroup fullWidth>
               <label>MISSION_BRIEFING</label>
               <textarea placeholder="DESCRIBE_OBJECTIVES..." />
            </FormGroup>
         </FormGrid>
         <SubmitButton onClick={() => setProjectModal(false)}>
            <Zap size={18} /> INITIATE_FORGE_SEQUENCE
         </SubmitButton>
      </Modal>

      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="ENLIST_NEW_OPERATIVE">
         <FormGrid>
            <FormGroup fullWidth>
               <label>OPERATIVE_NAME</label>
               <input placeholder="SEARCH_DATABASE..." />
            </FormGroup>
         </FormGrid>
      </Modal>

      <Modal isOpen={teamModal} onClose={() => setTeamModal(false)} title="FORM_NEW_SQUAD">
         <FormGrid>
            <FormGroup fullWidth>
               <label>SQUAD_NAME</label>
               <input placeholder="ASSIGN_CODENAME..." />
            </FormGroup>
         </FormGrid>
      </Modal>

    </DashboardLayout>
  );
};

/* Implementation of Tactical HUD Styled Components */

const DashboardLayout = styled.div`
  display: flex;
  height: 100vh;
  background: var(--bg-dark);
  padding: 24px;
  gap: 24px;
`;

const AdminSidebar = styled(motion.div)`
  width: 320px;
  height: 100%;
  flex-shrink: 0;
  
  .corner-bl { position: absolute; bottom: -2px; left: -2px; width: 15px; height: 15px; border: 2px solid var(--accent-secondary); border-top: 0; border-right: 0; }
`;

const CommandBranding = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0 20px;
  
  .icon-shield {
    width: 50px;
    height: 50px;
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid var(--accent-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-primary);
    border-radius: 4px;
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.2);
  }

  .text-stack {
    h2 { font-family: var(--font-mono); font-size: 1rem; letter-spacing: 0.2em; margin-bottom: 4px; }
  }
`;

const NavGroup = styled.div`
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavBtn = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(124, 58, 237, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-dim)'};
  padding: 14px 20px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;

  &:hover {
    color: var(--accent-primary);
    background: rgba(124, 58, 237, 0.05);
  }
`;

const SystemStatusCard = styled.div`
  margin-top: 20px;
  background: rgba(255,255,255,0.02);
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.05);

  .status-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.65rem;
    font-family: var(--font-mono);
    color: var(--text-dim);
    .status-led { width: 8px; height: 8px; border-radius: 50%; background: #333; transition: 0.3s; &.active { background: var(--accent-success); box-shadow: 0 0 8px var(--accent-success); } }
  }
`;

const ToggleSwitch = styled.div<{ active: boolean }>`
  width: 40px; height: 20px; background: ${props => props.active ? 'var(--accent-success)' : '#222'}; border-radius: 20px; position: relative; cursor: pointer; transition: 0.3s;
  .knob { position: absolute; top: 2px; left: ${props => props.active ? '22px' : '2px'}; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.3s; }
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .meta { font-size: 0.6rem; font-family: var(--font-mono); color: var(--text-dim); opacity: 0.5; }
`;

const AdminMain = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow: hidden;

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-stack {
       h1 { font-family: var(--font-mono); font-size: 1.8rem; letter-spacing: 0.3em; margin-bottom: 4px; }
       .path { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-primary); opacity: 0.5; letter-spacing: 0.1em; }
    }
    .action-hub { display: flex; gap: 16px; }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 300px;
  .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--accent-primary); opacity: 0.5; }
  input {
    width: 100%; height: 48px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding-left: 42px; border-radius: 4px; color: white; font-family: var(--font-mono); outline: none; transition: 0.3s;
    &:focus { border-color: var(--accent-primary); box-shadow: 0 0 15px rgba(124, 58, 237, 0.1); }
  }
`;

const ActionButton = styled.button`
  background: var(--accent-primary); color: white; border: none; padding: 0 24px; height: 48px; border-radius: 4px; font-family: var(--font-mono); font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
  &:hover { box-shadow: 0 0 20px rgba(124, 58, 237, 0.4); transform: translateY(-2px); }
`;

const ContentWrapper = styled.div` flex: 1; overflow: hidden; `;

const ProjectGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; height: 100%; overflow-y: auto; padding-right: 10px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.1); border-radius: 10px; } `;

const ProjectOverviewCard = styled.div` 
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 8px; transition: 0.3s;
  &:hover { border-color: var(--accent-primary); background: rgba(255,255,255,0.04); }
  .c-header { display: flex; justify-content: space-between; margin-bottom: 20px; .c-actions { display: flex; gap: 12px; color: var(--text-dim); } }
  h2 { font-family: var(--font-mono); font-size: 1.25rem; margin-bottom: 24px; cursor: pointer; &:hover { color: var(--accent-primary); } }
  .c-progress { .p-text { font-size: 0.6rem; color: var(--text-dim); margin-bottom: 8px; font-family: var(--font-mono); } .p-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; .p-fill { height: 100%; background: var(--accent-success); box-shadow: 0 0 8px var(--accent-success); } } }
  .c-footer { margin-top: 24px; display: flex; justify-content: space-between; font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-dim); }
`;

const PipelineLayout = styled.div` display: flex; gap: 24px; height: 100%; width: 100%; `;

const ProjectSidebar = styled.div` width: 250px; background: rgba(0,0,0,0.2); border-radius: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; `;

const ProjectNode = styled.div<{ active: boolean }>`
  padding: 16px; cursor: pointer; transition: 0.2s; background: ${props => props.active ? 'rgba(124, 58, 237, 0.1)' : 'transparent'}; border-left: 2px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  .id-tag { font-size: 0.55rem; color: var(--text-dim); font-family: var(--font-mono); margin-bottom: 4px; }
  .name-row { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 0.8rem; .dot { width: 4px; height: 4px; background: ${props => props.active ? 'var(--accent-primary)' : '#444'}; border-radius: 50%; } }
  &:hover { background: rgba(255,255,255,0.03); }
`;

const ModuleMatrix = styled.div` flex: 1; height: 100%; `;

const ModuleGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 30px; height: 500px; overflow-y: auto; padding-right: 10px; `;

const ModuleCard = styled.div` 
  background: rgba(255,255,255,0.02); padding: 20px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);
  .m-top { display: flex; justify-content: space-between; font-size: 0.6rem; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 12px; }
  h4 { font-family: var(--font-mono); font-size: 0.85rem; color: white; margin-bottom: 12px; }
  .m-progress { margin-bottom: 20px; .m-bar { width: 100%; height: 2px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-bottom: 6px; .m-fill { height: 100%; background: var(--accent-secondary); } } span { font-size: 0.6rem; color: var(--accent-secondary); font-family: var(--font-mono); } }
  .m-intel { .intel-row { font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 4px; strong { color: white; } } }
`;

const GridOverlay = styled(motion.div)` 
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; height: 100%; overflow-y: auto;
`;

const MemberTacticalCard = styled.div`
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; display: flex; align-items: center; gap: 20px;
  .avatar-sec { width: 50px; height: 50px; background: #222; border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } }
  .info-sec { flex: 1; h3 { font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: 4px; } p { font-size: 0.65rem; color: var(--text-dim); margin-bottom: 8px; } }
  .actions-sec { display: flex; flex-direction: column; gap: 12px; color: var(--text-dim); cursor: pointer; }
`;

const TeamTacticalCard = styled.div`
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 8px;
  .team-head { margin-bottom: 20px; h3 { font-family: var(--font-mono); font-size: 1.1rem; margin-bottom: 8px; } }
  .member-list { .member-mini { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-dim); display: flex; align-items: center; gap: 10px; margin-bottom: 8px; .dot { width: 6px; height: 6px; border: 1px solid var(--accent-primary); border-radius: 50%; } } }
`;

export default AdminDashboardView;

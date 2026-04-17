import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Plus, Send, Shield, XCircle,
  TrendingUp, User, Cpu, MessageSquare,
  Layers, Activity, Target,
  Calendar, Clock, ChevronRight
} from 'lucide-react';
import { useSDCData } from '../../../hooks/useSDCData';
import { useSearchFilter } from '../../../context/SearchFilterContext';
import TacticalHeader from '../premium/TacticalHeader';
import TacticalFrame from '../premium/TacticalFrame';
import TacticalFilterBar from '../premium/TacticalFilterBar';
import toast from 'react-hot-toast';
import { Modal, FormGroup, SubmitButton, FormGrid } from '../AdminModals';

/* ══════════════════════════════════════
   UTILITIES
══════════════════════════════════════ */
const getStatusColor = (status: string) => {
  switch (status) {
    case 'DONE': return 'var(--accent-success)';
    case 'IN_PROGRESS': return 'var(--accent-warning)';
    case 'AWAITING_SEAL': return 'var(--accent-secondary)';
    default: return 'var(--text-dim)';
  }
};

/* ══════════════════════════════════════
   ADMIN ANALYTICS VIEW
══════════════════════════════════════ */
const AdminProgressView: React.FC<{ projects: any[]; teams: any[]; members: any[] }> = ({
  projects, teams, members
}) => {
  const { searchQuery, statusFilter } = useSearchFilter();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);

  const allTasks = (projects || []).flatMap((p: any) => (p.tasks || []).map((t: any) => ({ 
    ...t, 
    projectId: p.id, 
    projectName: p.name || p.title,
    due: p.due || 'TBD'
  })));

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = selectedProject?.tasks || [];
  
  const filteredTasks = projectTasks.filter((t: any) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.moduleName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allTasks.length,
    done: allTasks.filter(t => t.status === 'DONE').length,
    active: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
    globalProgress: allTasks.length === 0 ? 0 : Math.round((allTasks.filter(t => t.status === 'DONE').length / allTasks.length) * 100)
  };

  return (
    <AnalyticsContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TacticalHeader 
        title="Task Analytics" 
        subtitle="Mission Control Console"
      />

      {/* ── Top KPI Strip ── */}
      <KPIStrip>
        <TacticalFrame statusColor="var(--accent-primary)">
          <KPICardContent accent="var(--accent-primary)">
            <div className="kpi-icon"><Target size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-val">{stats.globalProgress}%</div>
              <div className="kpi-label">OVERALL PROGRESS</div>
            </div>
            <GlobalProgressRing progress={stats.globalProgress} color="var(--accent-primary)" />
          </KPICardContent>
        </TacticalFrame>

        <TacticalFrame statusColor="var(--accent-secondary)">
          <KPICardContent accent="var(--accent-secondary)">
            <div className="kpi-icon"><Layers size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-val">{projects.length}</div>
              <div className="kpi-label">TOTAL PROJECTS</div>
            </div>
          </KPICardContent>
        </TacticalFrame>

        <TacticalFrame statusColor="var(--accent-success)">
          <KPICardContent accent="var(--accent-success)">
            <div className="kpi-icon"><CheckCircle size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-val">{stats.done}</div>
              <div className="kpi-label">TASKS COMPLETED</div>
            </div>
          </KPICardContent>
        </TacticalFrame>

        <TacticalFrame statusColor="var(--accent-warning)">
          <KPICardContent accent="var(--accent-warning)" className="pulse-card">
            <div className="kpi-icon"><Activity size={20} /></div>
            <div className="kpi-body">
              <div className="kpi-val">{stats.active}</div>
              <div className="kpi-label">IN PROGRESS</div>
            </div>
          </KPICardContent>
        </TacticalFrame>
      </KPIStrip>

      <DashboardGrid>
        {/* ── Left Sidebar: Projects ── */}
        <SidebarPanel>
          <PanelHeader>
            <div className="title">Projects List</div>
          </PanelHeader>
          <SidebarList>
            {projects.map((p, i) => {
              const pTasks = p.tasks || [];
              const pDone = pTasks.filter((t: any) => t.status === 'DONE').length;
              const pTotal = pTasks.length;
              const pPct = pTotal === 0 ? 0 : Math.round((pDone / pTotal) * 100);
              const isActive = selectedProjectId === p.id;
              const team = teams.find((t: any) => t.id === p.teamId || t.name === p.teamName);

              return (
                <ProjectCard
                  key={p.id}
                  active={isActive}
                  onClick={() => setSelectedProjectId(p.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="card-top">
                    <div className="p-info">
                      <div className="p-name">{p.name || p.title}</div>
                      <div className="p-team">{team?.name || 'Unassigned'}</div>
                    </div>
                    <div className="p-pct-circle">
                       <MiniCircle progress={pPct} color={pPct === 100 ? 'var(--accent-success)' : 'var(--accent-primary)'} />
                       <span>{pPct}%</span>
                    </div>
                  </div>
                  <div className="card-bottom">
                     <div className="p-status">{pDone}/{pTotal} done</div>
                     <div className="p-date"><Calendar size={10} /> {p.deadline || p.due || 'TBD'}</div>
                  </div>
                  {isActive && <motion.div layoutId="active-bg" className="active-glow" />}
                </ProjectCard>
              );
            })}
          </SidebarList>
        </SidebarPanel>

        {/* ── Main Detail Area ── */}
        <DetailPanel>
          <AnimatePresence mode="wait">
            {!selectedProject ? (
              <EmptyState key="empty">
                 <Cpu size={48} opacity={0.3} />
                 <h3>Select a project to analyze</h3>
              </EmptyState>
            ) : (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="detail-header">
                  <div className="h-left">
                     <span className="dot" />
                     <h2>{selectedProject.name || selectedProject.title}</h2>
                     <span className="h-team">TEAM: {selectedProject.teamName || 'ALPHA'}</span>
                     <span className="h-due">DUE: {selectedProject.deadline || selectedProject.due || 'TBD'}</span>
                  </div>
                  <div className="h-right">
                    <div className="summary-pill done">
                      <CheckCircle size={14} /> {projectTasks.filter((t: any) => t.status === 'DONE').length} Completed
                    </div>
                    <div className="summary-pill active">
                      <Activity size={14} /> {projectTasks.filter((t: any) => t.status === 'IN_PROGRESS').length} Active
                    </div>
                    <div className="summary-pill pending">
                      <Clock size={14} /> {projectTasks.filter((t: any) => t.status === 'TODO').length} Pending
                    </div>
                  </div>
                </div>

                <TacticalFilterBar 
                  placeholder="Filter project tasks by title or module..." 
                  statusOptions={[
                    { label: 'Completed', value: 'DONE' },
                    { label: 'In Progress', value: 'IN_PROGRESS' },
                    { label: 'Awaiting Review', value: 'AWAITING_SEAL' },
                    { label: 'Pending', value: 'TODO' }
                  ]}
                />

                <TaskTable>
                  <thead>
                    <tr>
                      <th>MODULE & MEMBERS</th>
                      <th>PROGRESS</th>
                      <th>STATUS</th>
                      <th>DEADLINE</th>
                      <th>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr><td colSpan={5} className="empty-row">No tasks found for this project</td></tr>
                    ) : (
                      filteredTasks.map((task: any, idx: number) => {
                        const assignee = members.find((m: any) => m.id === task.assignedTo);
                        return (
                          <motion.tr 
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <td>
                              <div className="m-group">
                                <div className="m-name">{task.title}</div>
                                <div className="m-assignee">
                                  <User size={10} />
                                  <span>{assignee?.name || 'Unassigned'}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="prog-group">
                                <DetailBar>
                                  <motion.div 
                                    className="fill" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${task.progress}%` }}
                                    transition={{ duration: 1 }}
                                    style={{ background: getStatusColor(task.status) }}
                                  />
                                </DetailBar>
                                <span className="prog-val">{task.progress}%</span>
                              </div>
                            </td>
                            <td>
                              <StatusLabel status={task.status}>
                                {task.status === 'DONE' && <CheckCircle size={10} />}
                                {task.status === 'IN_PROGRESS' && <Activity size={10} />}
                                {task.status === 'TODO' && <Clock size={10} />}
                                <span>{task.status.replace('_', ' ')}</span>
                              </StatusLabel>
                            </td>
                            <td className="mono-date">{task.deadline || 'MAY 10 2026'}</td>
                            <td>
                              <div className="remark">
                                {task.whatsGoingOn || '—'}
                                {task.whatsGoingOn && <ChevronRight size={10} className="r-icon" />}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </TaskTable>
              </motion.div>
            )}
          </AnimatePresence>
        </DetailPanel>
      </DashboardGrid>
    </AnalyticsContainer>
  );
};

/* ══════════════════════════════════════
   OPERATIVE TASK VIEW (non-admin)
══════════════════════════════════════ */
const OperativeTaskView: React.FC<{ projects: any[]; members: any[]; sdc_user: any; refresh: () => void }> = ({
  projects, members, sdc_user, refresh
}) => {
  const { searchQuery, statusFilter } = useSearchFilter();
  const [forgeModal, setForgeModal] = useState(false);
  const [pulseModal, setPulseModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [forgeData, setForgeData] = useState({ title: '', moduleName: 'UI_LAYER', assignedTo: '', projectId: '' });
  const [pulseData, setPulseData] = useState({ status: 'IN_PROGRESS', progress: 0, whatsGoingOn: '', workLog: '' });
  const [reviewData, setReviewData] = useState({ action: 'APPROVE', feedback: '' });

  const allTasks = projects.flatMap((p: any) => (p.tasks || []).map((t: any) => ({ ...t, projectName: p.name, projectLeaderId: p.team?.leaderId })));
  const filteredTasks = allTasks.filter((t: any) => {
    const isRelated = t.projectLeaderId === sdc_user.id || t.assignedTo === sdc_user.id;
    if (!isRelated) return false;

    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.moduleName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isLeader = (task: any) => task.projectLeaderId === sdc_user.id;

  const handleForge = async () => {
    if (!forgeData.projectId || !forgeData.title || !forgeData.assignedTo) return toast.error('Please fill in all required fields');
    // Simulate directive forging [MOCK_PROTOCOL]
    toast.loading('Creating Task...', { duration: 1000 });
    setTimeout(() => {
      toast.success('Task Created'); 
      setForgeModal(false); 
      refresh();
    }, 1200);
  };

  const handlePulse = async () => {
    if (!selectedTask) return;
    // Simulate pulse transmission [MOCK_PROTOCOL]
    toast.loading('Updating Status...', { duration: 800 });
    setTimeout(() => {
      toast.success('Status Updated'); 
      setPulseModal(false); 
      refresh();
    }, 1000);
  };

  const handleReview = async () => {
    if (!selectedTask) return;
    // Simulate mission audit [MOCK_PROTOCOL]
    toast.loading('Submitting Review...', { duration: 1200 });
    setTimeout(() => {
      toast.success(reviewData.action === 'APPROVE' ? 'Task Approved' : 'Task Returned');
      setReviewModal(false); 
      refresh();
    }, 1500);
  };

  return (
    <ViewContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TacticalHeader 
        title="Task Directory" 
        subtitle={`System Online // Tasks: ${filteredTasks.length}`}
        actions={projects.some((p: any) => p.team?.leaderId === sdc_user.id) && (
          <AddBtn onClick={() => setForgeModal(true)}><Plus size={18} /> <span>New Task</span></AddBtn>
        )}
      />

      <TacticalFilterBar 
        placeholder="Search by Title, Project or Tag..." 
        statusOptions={[
          { label: 'Completed', value: 'DONE' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Awaiting Review', value: 'AWAITING_SEAL' },
          { label: 'Pending', value: 'TODO' }
        ]}
      />

      <TaskGrid>
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <TacticalFrame 
              key={task.id} 
              delay={index * 0.05}
              statusColor={getStatusColor(task.status)}
            >
              <TaskCardInner>
                <CardTop>
                  <div className="module-tag">{task.moduleName || 'CORE_RELAY'}</div>
                  <StatusBadge status={task.status}>{task.status.replace('_', ' ')}</StatusBadge>
                </CardTop>
                <CardBody>
                  <h3>{task.title}</h3>
                  <p className="project-ref">{task.projectName}</p>
                  <p className="desc">{task.whatsGoingOn || 'No updates provided...'}</p>
                  {task.reviewFeedback && (
                    <FeedbackBox><MessageSquare size={12} /><p>{task.reviewFeedback}</p></FeedbackBox>
                  )}
                </CardBody>
                <ProgressSection>
                  <div className="meta">
                    <span>Progress: {task.progress}%</span>
                    <div className="operative"><User size={12} /><span>{members.find((m: any) => m.id === task.assignedTo)?.name || 'Unassigned'}</span></div>
                  </div>
                  <ProgressBar>
                    <motion.div className="fill" initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 1 }} />
                  </ProgressBar>
                </ProgressSection>
                <CardActions>
                  {task.status === 'AWAITING_SEAL' && isLeader(task) && (
                    <ActionButton className="seal" onClick={() => { setSelectedTask(task); setReviewModal(true); }}>
                      <Shield size={14} /> <span>Review</span>
                    </ActionButton>
                  )}
                  {task.status !== 'DONE' && task.status !== 'AWAITING_SEAL' && task.assignedTo === sdc_user.id && (
                    <ActionButton className="pulse" onClick={() => { setSelectedTask(task); setPulseData({ ...pulseData, status: task.status, progress: task.progress }); setPulseModal(true); }}>
                      <TrendingUp size={14} /> <span>Update Status</span>
                    </ActionButton>
                  )}
                </CardActions>
              </TaskCardInner>
            </TacticalFrame>
          ))}
        </AnimatePresence>
      </TaskGrid>

      <Modal isOpen={forgeModal} onClose={() => setForgeModal(false)} title="Create New Task">
        <FormGrid>
          <FormGroup fullWidth>
            <label>Target Project</label>
            <select value={forgeData.projectId} onChange={e => setForgeData({ ...forgeData, projectId: e.target.value })}>
              <option value="">Select Project...</option>
              {projects.filter((p: any) => p.team?.leaderId === sdc_user.id).map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </FormGroup>
          <FormGroup fullWidth>
            <label>Task Title</label>
            <input placeholder="e.g. Update user dashboard layout" value={forgeData.title} onChange={e => setForgeData({ ...forgeData, title: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <label>Module</label>
            <select value={forgeData.moduleName} onChange={e => setForgeData({ ...forgeData, moduleName: e.target.value })}>
              <option>UI_LAYER</option><option>CORE_API</option><option>DATABASE_RELAY</option><option>SECURITY_PROTOCOL</option><option>INFRASTRUCTURE</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Assignee</label>
            <select value={forgeData.assignedTo} onChange={e => setForgeData({ ...forgeData, assignedTo: e.target.value })}>
              <option value="">Select Assignee...</option>
              {members.map((m: any) => (<option key={m.id} value={m.id}>{m.name}</option>))}
            </select>
          </FormGroup>
        </FormGrid>
        <SubmitButton onClick={handleForge}><Send size={16} /> Create Task</SubmitButton>
      </Modal>

      <Modal isOpen={pulseModal} onClose={() => setPulseModal(false)} title="Update Task Status">
        <FormGrid>
          <FormGroup><label>Progress (%)</label><input type="number" value={pulseData.progress} onChange={e => setPulseData({ ...pulseData, progress: parseInt(e.target.value) })} /></FormGroup>
          <FormGroup>
            <label>Status</label>
            <select value={pulseData.status} onChange={e => setPulseData({ ...pulseData, status: e.target.value })}>
              <option value="TODO">TODO</option><option value="IN_PROGRESS">IN_PROGRESS</option>
            </select>
          </FormGroup>
          <FormGroup fullWidth>
            <label>Update Notes</label>
            <textarea placeholder="What have you been working on?..." value={pulseData.whatsGoingOn} onChange={e => setPulseData({ ...pulseData, whatsGoingOn: e.target.value })} />
          </FormGroup>
        </FormGrid>
        <SubmitButton onClick={handlePulse}><Send size={16} /> Submit Update</SubmitButton>
      </Modal>

      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Review Task">
        <AuditBrief>Evaluating: <strong>{selectedTask?.title}</strong></AuditBrief>
        <FormGrid>
          <FormGroup fullWidth>
            <label>Action</label>
            <select value={reviewData.action} onChange={e => setReviewData({ ...reviewData, action: e.target.value })}>
              <option value="APPROVE">Approve Task</option><option value="REJECT">Reject Task</option>
            </select>
          </FormGroup>
          <FormGroup fullWidth>
            <label>Review Feedback</label>
            <textarea placeholder="Provide feedback..." value={reviewData.feedback} onChange={e => setReviewData({ ...reviewData, feedback: e.target.value })} />
          </FormGroup>
        </FormGrid>
        <SubmitButton onClick={handleReview} style={{ background: reviewData.action === 'APPROVE' ? 'var(--accent-success)' : 'var(--accent-error)' }}>
          {reviewData.action === 'APPROVE' ? <CheckCircle size={16} /> : <XCircle size={16} />} Submit Review
        </SubmitButton>
      </Modal>
    </ViewContainer>
  );
};

/* ══════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════ */
const TasksView: React.FC = () => {
  const { projects = [], members = [], teams = [], refresh } = useSDCData() as any;
  const sdc_user = JSON.parse(localStorage.getItem('sdc_user') || '{}');

  return sdc_user.role === 'admin' 
    ? <AdminProgressView projects={projects} teams={teams} members={members} />
    : <OperativeTaskView projects={projects} members={members} sdc_user={sdc_user} refresh={refresh} />;
};

/* ══════════════════════════════════════
   STYLING COMPONENTS
══════════════════════════════════════ */
const pulse = keyframes`0%,100%{opacity:0.6}50%{opacity:1}`;

const AnalyticsContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 32px; `;

const KPIStrip = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; `;

const KPICardContent = styled.div<{ accent: string }>`
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  height: 100%;
  
  .kpi-icon { width: 44px; height: 44px; border-radius: 14px; background: ${p => `${p.accent}15`}; border: 1px solid ${p => `${p.accent}30`}; display: flex; align-items: center; justify-content: center; color: ${p => p.accent}; flex-shrink: 0; }
  &.pulse-card .kpi-icon svg { animation: ${pulse} 2s infinite ease-in-out; }
  .kpi-body { flex: 1; }
  .kpi-val { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 900; color: var(--text-main); line-height: 1; margin-bottom: 4px; }
  .kpi-label { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); letter-spacing: 0.1em; font-weight: 800; }
`;

const GlobalProgressRing = ({ progress, color }: { progress: number; color: string }) => {
  const radius = 20; const circ = 2 * Math.PI * radius; const offset = circ - (progress / 100) * circ;
  return (
    <RingBox>
      <svg width="50" height="50">
        <circle className="bg" cx="25" cy="25" r={radius} />
        <motion.circle 
          className="fill" cx="25" cy="25" r={radius} 
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ stroke: color, strokeDasharray: circ }}
        />
      </svg>
    </RingBox>
  );
};

const RingBox = styled.div`
  position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
  svg { transform: rotate(-90deg); }
  circle { fill: transparent; stroke-width: 4; }
  .bg { stroke: var(--border-glass); }
  .fill { stroke-linecap: round; }
`;

const DashboardGrid = styled.div` display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: flex-start; `;

const SidebarPanel = styled.div` background: var(--bg-card); border: var(--border-glass); border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; `;
const PanelHeader = styled.div` padding: 24px; border-bottom: var(--border-glass); .title { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 800; color: var(--accent-primary); letter-spacing: 0.15em; } `;
const SidebarList = styled.div` padding: 12px; display: flex; flex-direction: column; gap: 8px; max-height: 600px; overflow-y: auto; &::-webkit-scrollbar { width: 2px; } `;

const ProjectCard = styled(motion.div)<{ active: boolean }>`
  position: relative; padding: 18px; border-radius: 18px; cursor: pointer; transition: 0.25s;
  background: ${p => p.active ? 'rgba(96,165,250,0.08)' : 'transparent'};
  border: 1.5px solid ${p => p.active ? 'rgba(96,165,250,0.3)' : 'transparent'};
  &:hover { background: rgba(255,255,255,0.03); }
  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .p-name { font-weight: 800; font-size: 0.85rem; color: ${p => p.active ? 'var(--text-main)' : 'var(--text-dim)'}; margin-bottom: 2px; }
  .p-team { font-family: var(--font-mono); font-size: 0.5rem; color: var(--accent-primary); opacity: 0.6; }
  .p-pct-circle { position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; span { position: absolute; font-family: var(--font-mono); font-size: 0.45rem; font-weight: 900; color: var(--text-main); } }
  .card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
  .p-status { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); }
  .p-date { display: flex; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 0.5rem; color: var(--accent-primary); opacity: 0.5; }
  .active-glow { position: absolute; inset: 0; border-radius: 18px; border: 1px solid var(--accent-primary); opacity: 0.1; z-index: -1; }
`;

const MiniCircle = ({ progress, color }: { progress: number; color: string }) => {
  const rad = 14; const circ = 2 * Math.PI * rad; const off = circ - (progress/100)*circ;
  return (
    <svg width="34" height="34">
      <circle cx="17" cy="17" r={rad} fill="none" stroke="var(--bg-glass)" strokeWidth="3" />
      <circle cx="17" cy="17" r={rad} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 17 17)" strokeLinecap="round" />
    </svg>
  );
};

const DetailPanel = styled.div` background: var(--bg-card); border: var(--border-glass); border-radius: 24px; padding: 32px; min-height: 600px;
  .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;
    .h-left { display: flex; align-items: center; gap: 16px; 
      .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent-warning); box-shadow: 0 0 10px var(--accent-warning); }
      h2 { font-size: 1.5rem; letter-spacing: -0.01em; }
      .h-team { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); opacity: 0.6; margin-left: 10px; }
      .h-due { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-primary); opacity: 0.7; }
    }
    .h-right { display: flex; gap: 12px; .summary-pill { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 100px; font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800; border: 1px solid transparent; &.done { background: rgba(16,185,129,0.08); color: #10B981; border-color: rgba(16,185,129,0.2); } &.active { background: rgba(251,191,36,0.08); color: #FBBF24; border-color: rgba(251,191,36,0.2); } &.pending { background: rgba(255,255,255,0.05); color: var(--text-dim); border-color: rgba(255,255,255,0.1); } } }
  }
  .filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 20px;
    .search-box { flex: 1; display: flex; align-items: center; gap: 12px; background: var(--bg-main); border: var(--border-glass); border-radius: 12px; padding: 10px 16px; color: var(--text-dim); input { background: none; border: none; color: var(--text-main); font-family: var(--font-body); font-size: 0.85rem; width: 100%; outline: none; } }
    .status-filters { display: flex; gap: 4px; background: var(--bg-main); padding: 4px; border-radius: 10px;
      button { padding: 6px 14px; border-radius: 8px; border: none; background: none; color: var(--text-dim); font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; cursor: pointer; transition: 0.2s; &.active { background: var(--bg-card); color: var(--text-main); box-shadow: 0 2px 8px rgba(0,0,0,0.1); } &:hover { color: var(--text-main); } }
    }
  }
`;

const TaskTable = styled.table`
  width: 100%; border-collapse: separate; border-spacing: 0 8px;
  th { text-align: left; font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); opacity: 0.6; padding: 0 16px 8px; font-weight: 800; letter-spacing: 0.1em; }
  tr { background: var(--bg-glass); border-radius: 12px; }
  td { padding: 16px; border-top: 1px solid transparent; border-bottom: 1px solid transparent; &:first-child { border-left: 1px solid transparent; border-radius: 12px 0 0 12px; } &:last-child { border-right: 1px solid transparent; border-radius: 0 12px 12px 0; } }
  tbody tr { transition: 0.2s; border: 1px solid transparent; &:hover { background: var(--bg-main); td { border-top-color: var(--border-glass); border-bottom-color: var(--border-glass); &:first-child { border-left-color: var(--border-glass); } &:last-child { border-right-color: var(--border-glass); } } } }
  .m-group { display: flex; flex-direction: column; gap: 4px; .m-name { font-weight: 800; font-size: 0.85rem; color: var(--text-main); } .m-assignee { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.55rem; color: var(--accent-primary); opacity: 0.7; } }
  .prog-group { display: flex; align-items: center; gap: 12px; .prog-val { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; min-width: 35px; } }
  .mono-date { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); }
  .remark { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: var(--text-dim); .r-icon { opacity: 0.3; } }
  .empty-row { text-align: center; padding: 48px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); opacity: 0.3; }
`;

const DetailBar = styled.div` width: 100px; height: 4px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; border-radius: 10px; } `;

const StatusLabel = styled.div<{ status: string }>`
  display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.55rem; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase;
  background: ${p => {
    if (p.status === 'DONE') return 'rgba(16,185,129,0.12)';
    if (p.status === 'IN_PROGRESS') return 'rgba(56, 189, 248, 0.12)';
    return 'var(--bg-main)';
  }};
  color: ${p => {
    if (p.status === 'DONE') return '#10B981';
    if (p.status === 'IN_PROGRESS') return 'var(--accent-primary)';
    return 'var(--text-dim)';
  }};
`;

const EmptyState = styled.div` height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: var(--text-dim); h3 { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.2em; opacity: 0.4; } `;

/* ══════════════════════════════════════
   SHARED UI
══════════════════════════════════════ */
const ViewContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 40px; `;
const AddBtn = styled.button` background: var(--bg-glass); border: var(--border-glow); border-radius: 12px; padding: 12px 24px; color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.3s; &:hover { background: var(--accent-primary); color: white; box-shadow: 0 0 20px rgba(56,189,248,0.3); } `;
const TaskGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; `;
const TaskCardInner = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  position: relative;
`;
const CardTop = styled.div` display: flex; justify-content: space-between; align-items: center; .module-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-primary); opacity: 0.8; letter-spacing: 0.1em; } `;
const StatusBadge = styled.span<{ status: string }>` 
  padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.55rem; font-weight: 800; 
  background: ${p => p.status === 'DONE' ? 'rgba(16,185,129,0.1)' : p.status === 'AWAITING_SEAL' ? 'rgba(139,92,246,0.1)' : p.status === 'IN_PROGRESS' ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-glass)'}; 
  color: ${p => p.status === 'DONE' ? '#10B981' : p.status === 'AWAITING_SEAL' ? 'var(--accent-secondary)' : p.status === 'IN_PROGRESS' ? 'var(--accent-primary)' : 'var(--text-dim)'}; 
`;
const CardBody = styled.div` h3 { font-size: 1.15rem; margin-bottom: 6px; font-weight: 800; } .project-ref { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); opacity: 0.6; margin-bottom: 15px; text-transform: uppercase; } .desc { font-size: 0.8rem; color: var(--text-dim); line-height: 1.6; min-height: 48px; } `;
const FeedbackBox = styled.div` margin-top: 20px; background: rgba(239, 68, 68, 0.05); border-left: 2px solid var(--accent-error); padding: 12px; border-radius: 0 8px 8px 0; display: flex; gap: 10px; p { font-size: 0.65rem; color: var(--accent-error); font-weight: 600; line-height: 1.4; } svg { color: var(--accent-error); flex-shrink: 0; } `;
const ProgressSection = styled.div` .meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; span { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-primary); } .operative { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; color: var(--text-dim); } } `;
const ProgressBar = styled.div` height: 6px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 10px; } `;
const CardActions = styled.div` margin-top: auto; display: flex; gap: 12px; `;
const ActionButton = styled.button` 
  flex: 1; border: none; border-radius: 12px; padding: 12px; font-family: var(--font-mono); font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; 
  &.seal { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); } 
  &.pulse { 
    background: var(--bg-glass); 
    color: var(--accent-primary); 
    border: var(--border-glass); 
  } 
  &:hover { filter: brightness(1.2); transform: scale(1.02); } 
`;
const AuditBrief = styled.p` font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); margin-bottom: 30px; `;


export default TasksView;

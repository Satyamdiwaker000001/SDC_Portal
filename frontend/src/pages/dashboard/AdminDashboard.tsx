import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Shield, Terminal, Users, Check, X, Search,
  RefreshCw, Send, Plus, Cpu, Activity, Radio,
  CheckCircle2, TrendingUp, AlertCircle, Server
} from 'lucide-react';
import Button from '../../components/common/Button';
import Leaderboard from '../../components/dashboard/Leaderboard';
import { useSound } from '../../context/SoundContext';
import { t } from '../../hooks/useTranslation';
import api from '../../lib/api';

/* ─── Types ─── */
interface Application {
  id: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  role: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
interface ServerNode {
  id: string; name: string;
  status: 'ONLINE' | 'OFFLINE' | 'STANDBY'; load: number; ip: string;
}
interface Member {
  id: string; name: string;
  role: 'LEAD' | 'SENIOR' | 'MEMBER' | 'JUNIOR';
  focus: string; status: 'ACTIVE' | 'IDLE' | 'OFFLINE'; xp: number;
}
interface Project {
  id: string; name: string; lead: string;
  progress: number; priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
interface Task {
  id: string; module: string; title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'; assignee: string;
}
interface Team {
  id: string;
  name: string;
  leaderId: string;
  leaderName?: string;
  memberCount?: number;
}

/* ─── Seed ─── */
/* ─── Seed ─── */
const seedNodes: ServerNode[] = [
  { id: 'NODE-1', name: 'Primary Database Host',  status: 'ONLINE',   load: 98, ip: '10.0.12.4'  },
  { id: 'NODE-2', name: 'FastAPI Production Core', status: 'ONLINE',   load: 85, ip: '10.0.12.15' },
  { id: 'NODE-3', name: 'Render Worker Node',      status: 'STANDBY',  load: 45, ip: '10.0.14.22' },
  { id: 'NODE-4', name: 'Nginx Ingress Proxy',     status: 'ONLINE',   load: 92, ip: '10.0.12.8'  },
];

interface AdminDashboardProps {
  view: 'desk' | 'members' | 'teams' | 'projects' | 'tasks' | 'applications' | 'announcements' | 'leaderboard';
}

const mapUserToMember = (user: any): Member => {
  let role: Member['role'] = 'MEMBER';
  const branchLower = (user.branch || '').toLowerCase();
  if (branchLower.includes('lead')) role = 'LEAD';
  else if (branchLower.includes('senior')) role = 'SENIOR';
  else if (branchLower.includes('junior')) role = 'JUNIOR';

  let status: Member['status'] = 'ACTIVE';
  if (user.disabled) status = 'OFFLINE';
  else if (!user.is_active) status = 'IDLE';

  return {
    id: user.id,
    name: user.name,
    role,
    focus: user.branch || 'Developer',
    status,
    xp: user.xp || (user.id.startsWith('MEM') ? parseInt(user.id.split('-')[1] || '0') * 350 : 1200) || 1200
  };
};

const mapProject = (p: any): Project => {
  let lead = 'ROOT-ADMIN';
  if (p.teamId === 'TEAM-ALPHA') lead = 'Abhishek';
  else if (p.teamId === 'TEAM-EPSILON') lead = 'Vayu';
  else if (p.teamId === 'TEAM-GAMMA') lead = 'Nivedita';

  let priority: Project['priority'] = 'MEDIUM';
  if (p.status === 'LIVE') priority = 'HIGH';
  else if (p.status === 'COMPLETED') priority = 'LOW';

  let progress = 0;
  if (p.status === 'LIVE') progress = 65;
  else if (p.status === 'COMPLETED') progress = 100;
  else if (p.status === 'PENDING_ADMIN') progress = 80;

  return {
    id: p.id,
    name: p.name,
    lead: lead,
    progress: progress,
    priority: priority
  };
};

const mapTask = (t: any): Task => {
  let status: Task['status'] = 'TODO';
  if (t.status === 'DONE') status = 'DONE';
  else if (t.status === 'IN_PROGRESS') status = 'IN_PROGRESS';
  else if (t.status === 'AWAITING_SEAL') status = 'REVIEW';

  let module = t.module_id || 'Core';
  if (module.includes('UI')) module = 'UI';
  else if (module.includes('API')) module = 'API';
  else if (module.includes('SEC')) module = 'Security';
  else if (module.includes('DB')) module = 'Database';
  else if (module.includes('NET')) module = 'Networks';

  let assignee = t.assigned_to || 'Unassigned';
  if (assignee === 'MEM-001') assignee = 'Abhishek';
  else if (assignee === 'MEM-002') assignee = 'Vaishnavi';
  else if (assignee === 'MEM-003') assignee = 'Satyam';
  else if (assignee === 'MEM-004') assignee = 'Vayu';
  else if (assignee === 'MEM-005') assignee = 'Bhavna';
  else if (assignee === 'MEM-006') assignee = 'Akansha';
  else if (assignee === 'MEM-007') assignee = 'Vighnesh';
  else if (assignee === 'MEM-008') assignee = 'Nivedita';

  return {
    id: t.id,
    module,
    title: t.title,
    status,
    assignee
  };
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ view }) => {
  const { playClick, playTypeClick } = useSound();

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedIds,  setSelectedIds]  = useState<string[]>([]);
  const [nodes,        setNodes]         = useState<ServerNode[]>(seedNodes);
  const [members,      setMembers]       = useState<Member[]>([]);
  const [projects,     setProjects]      = useState<Project[]>([]);
  const [tasks,        setTasks]         = useState<Task[]>([]);
  
  // Teams State & Actions
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLeader, setNewTeamLeader] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Member[]>([]);
  const [addMemberToTeamId, setAddMemberToTeamId] = useState('');

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLead, setNewProjectLead] = useState('');
  const [broadcastMsg,   setBroadcastMsg]   = useState('');
  const [broadcastLogs,  setBroadcastLogs]  = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>({
    name: '',
    role: 'MEMBER',
    focus: '',
    status: 'ACTIVE',
    xp: 0
  });

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const res = await api.get(`/teams/${teamId}/members`);
      const mapped = res.data.map(mapUserToMember);
      setSelectedTeamMembers(mapped);
    } catch (err) {
      console.error("Failed to load team members:", err);
    }
  };

  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamLeader) return;
    try { playClick(); } catch (_) {}
    
    const teamId = `TEAM-${newTeamName.toUpperCase().replace(/\s+/g, '-')}`;
    try {
      await api.post('/admin/teams', {
        id: teamId,
        name: newTeamName,
        leaderId: newTeamLeader
      });
      setNewTeamName('');
      setNewTeamLeader('');
      await fetchAllData();
    } catch (err) {
      console.error("Failed to create team:", err);
      alert("Error creating team on backend.");
    }
  };

  const handleDisbandTeam = async (teamId: string) => {
    try { playClick(); } catch (_) {}
    if (!confirm("Are you sure you want to disband this squad?")) return;
    try {
      await api.delete(`/admin/teams/${teamId}`);
      if (selectedTeamId === teamId) {
        setSelectedTeamId(null);
        setSelectedTeamMembers([]);
      }
      await fetchAllData();
    } catch (err) {
      console.error("Failed to disband team:", err);
    }
  };

  const handleAddMemberToTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !addMemberToTeamId) return;
    try { playClick(); } catch (_) {}
    try {
      await api.post(`/admin/teams/${selectedTeamId}/members`, {
        userId: addMemberToTeamId
      });
      setAddMemberToTeamId('');
      await fetchTeamMembers(selectedTeamId);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to add member to team:", err);
      alert("Error adding member to team.");
    }
  };

  const handleRemoveMemberFromTeam = async (userId: string) => {
    try { playClick(); } catch (_) {}
    if (!selectedTeamId) return;
    try {
      await api.delete(`/admin/teams/${selectedTeamId}/members/${userId}`);
      await fetchTeamMembers(selectedTeamId);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to remove member from team:", err);
    }
  };

  const fetchAllData = async () => {
    try {
      const [usersRes, projectsRes, tasksRes, appsRes, noticesRes, teamsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/applications'),
        api.get('/announcements'),
        api.get('/teams')
      ]);

      const devUsers = usersRes.data.filter((u: any) => u.role === 'developer');
      const mappedMembers = devUsers.map(mapUserToMember);
      setMembers(mappedMembers);
      
      const mappedProjects = projectsRes.data.map(mapProject);
      setProjects(mappedProjects);
      
      if (mappedMembers.length > 0 && !newProjectLead) {
        setNewProjectLead(mappedMembers[0].name || '');
      }

      setTasks(tasksRes.data.map(mapTask));

      const mappedApps = appsRes.data.map((app: any) => {
        let semester = 4;
        if (app.admission_year) {
          semester = Math.max(1, (2026 - app.admission_year) * 2);
        }
        let status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
        if (app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'RECRUIT_ENLISTED') status = 'APPROVED';
        else if (app.status === 'REJECTED') status = 'REJECTED';

        return {
          id: app.id,
          name: app.name,
          email: app.email,
          branch: app.branch || 'CSE',
          semester: semester,
          role: 'WEB DEVELOPER',
          message: app.linkedin_url ? `LinkedIn Profile: ${app.linkedin_url}` : 'Wants to join SDC to build awesome projects.',
          status: status
        };
      });
      setApplications(mappedApps);

      const mappedLogs = noticesRes.data.map((ann: any) => {
        const dateObj = ann.timestamp ? new Date(ann.timestamp) : new Date();
        const timeStr = dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        return `[${timeStr}] ${ann.title}: ${ann.body}`;
      });
      setBroadcastLogs(mappedLogs);

      const mappedTeams = await Promise.all(teamsRes.data.map(async (team: any) => {
        const leader = devUsers.find((u: any) => u.id === team.leaderId) || usersRes.data.find((u: any) => u.id === team.leaderId);
        let memberCount = 0;
        try {
          const membersRes = await api.get(`/teams/${team.id}/members`);
          memberCount = membersRes.data.length;
        } catch (_) {}
        return {
          id: team.id,
          name: team.name,
          leaderId: team.leaderId,
          leaderName: leader ? leader.name : 'Unknown Leader',
          memberCount
        };
      }));
      setTeams(mappedTeams);

    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.focus.trim()) return;
    try { playClick(); } catch (_) {}

    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `MEM-${randomIdNum}`;
    const emailName = newMember.name.toLowerCase().replace(/\s+/g, '');
    const email = `${emailName}${randomIdNum}@sdc.com`;

    try {
      await api.post('/admin/users/developers', {
        id: newId,
        name: newMember.name,
        email: email,
        spec: newMember.focus,
        joinDate: new Date().toISOString().split('T')[0],
        password: "SDC@2026"
      });
      
      setNewMember({
        name: '',
        role: 'MEMBER',
        focus: '',
        status: 'ACTIVE',
        xp: 0
      });
      setIsAddModalOpen(false);
      await fetchAllData();
    } catch (err: any) {
      console.error("Failed to add developer:", err);
      const errorMsg = err.response?.data?.detail || "Error adding operative to database.";
      alert(errorMsg);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approveApp = async (id: string) => {
    try { playClick(); } catch (_) {}
    try {
      await api.post(`/applications/${id}/approve`);
      setSelectedIds(prev => prev.filter(x => x !== id));
      await fetchAllData();
    } catch (err) {
      console.error("Error enlisting recruit:", err);
    }
  };

  const rejectApp = async (id: string) => {
    try { playClick(); } catch (_) {}
    try {
      await api.delete(`/applications/${id}`);
      setSelectedIds(prev => prev.filter(x => x !== id));
      await fetchAllData();
    } catch (err) {
      console.error("Error discarding recruit:", err);
    }
  };

  const toggleSelectApp = (id: string) => {
    try { playClick(); } catch (_) {}
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllApps = () => {
    try { playClick(); } catch (_) {}
    const pendingApps = applications.filter(a => a.status === 'PENDING');
    const allPendingSelected = pendingApps.length > 0 && pendingApps.every(a => selectedIds.includes(a.id));
    if (allPendingSelected) {
      const pendingIds = pendingApps.map(a => a.id);
      setSelectedIds(prev => prev.filter(id => !pendingIds.includes(id)));
    } else {
      const pendingIds = pendingApps.map(a => a.id);
      setSelectedIds(prev => {
        const next = [...prev];
        pendingIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      });
    }
  };

  const bulkApproveApps = async () => {
    try { playClick(); } catch (_) {}
    if (selectedIds.length === 0) return;
    try {
      await api.post(`/applications/bulk-approve?ids=${selectedIds.join('&ids=')}`);
      setSelectedIds([]);
      await fetchAllData();
    } catch (err) {
      console.error("Failed bulk approval:", err);
    }
  };

  const bulkRejectApps = async () => {
    try { playClick(); } catch (_) {}
    if (selectedIds.length === 0) return;
    try {
      await api.post(`/applications/bulk-reject?ids=${selectedIds.join('&ids=')}`);
      setSelectedIds([]);
      await fetchAllData();
    } catch (err) {
      console.error("Failed bulk rejection:", err);
    }
  };

  const cycleNode = (id: string) => {
    try { playClick(); } catch (_) {}
    setNodes(p => p.map(n => {
      if (n.id !== id) return n;
      const next = n.status === 'ONLINE' ? 'STANDBY' : n.status === 'STANDBY' ? 'OFFLINE' : 'ONLINE';
      return { ...n, status: next, load: next === 'ONLINE' ? 95 : next === 'STANDBY' ? 40 : 0 };
    }));
  };

  const promoteMember = async (id: string) => {
    try { playClick(); } catch (_) {}
    const member = members.find(m => m.id === id);
    if (!member) return;

    const roles: Member['role'][] = ['JUNIOR', 'MEMBER', 'SENIOR', 'LEAD'];
    const currentIdx = roles.indexOf(member.role);
    const nextRole = roles[Math.min(currentIdx + 1, roles.length - 1)];

    let newFocus = member.focus;
    if (nextRole === 'LEAD') {
      newFocus = member.focus.replace(/ (Lead|Senior|Junior)/g, '') + ' Lead';
    } else if (nextRole === 'SENIOR') {
      newFocus = member.focus.replace(/ (Lead|Senior|Junior)/g, '') + ' Senior';
    } else if (nextRole === 'MEMBER') {
      newFocus = member.focus.replace(/ (Lead|Senior|Junior)/g, '');
    } else if (nextRole === 'JUNIOR') {
      newFocus = member.focus.replace(/ (Lead|Senior|Junior)/g, '') + ' Junior';
    }

    try {
      await api.patch(`/admin/users/${id}`, {
        branch: newFocus
      });
      await fetchAllData();
    } catch (err) {
      console.error("Error promoting member:", err);
    }
  };

  const cycleMemberStatus = async (id: string) => {
    try { playClick(); } catch (_) {}
    const member = members.find(m => m.id === id);
    if (!member) return;

    const isDisabled = member.status !== 'OFFLINE';
    try {
      await api.patch(`/admin/users/${id}`, {
        disabled: isDisabled
      });
      await fetchAllData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try { playClick(); } catch (_) {}

    const randomId = `PROJ-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await api.post('/admin/projects', {
        id: randomId,
        name: newProjectName,
        type: 'Web_App',
        deadline: '2026-12-31',
        academicYear: '2025-26'
      });

      let teamId = '';
      if (newProjectLead === 'Abhishek') teamId = 'TEAM-ALPHA';
      else if (newProjectLead === 'Vayu') teamId = 'TEAM-EPSILON';
      else if (newProjectLead === 'Nivedita') teamId = 'TEAM-GAMMA';

      if (teamId) {
        await api.post(`/admin/projects/${randomId}/teams`, {
          teamId: teamId
        });
      }

      setNewProjectName('');
      await fetchAllData();
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const cycleTask = async (id: string) => {
    try { playClick(); } catch (_) {}
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextStatusMap: Record<Task['status'], string> = {
      'TODO': 'IN_PROGRESS',
      'IN_PROGRESS': 'AWAITING_SEAL',
      'REVIEW': 'DONE',
      'DONE': 'TODO'
    };
    const nextStatus = nextStatusMap[task.status];

    try {
      await api.patch(`/tasks/${id}/status`, {
        status: nextStatus
      });
      await fetchAllData();
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    try { playClick(); } catch (_) {}

    try {
      await api.post('/announcements', {
        title: 'Global Broadcast',
        body: broadcastMsg,
        priority: 'Normal',
        is_global: true
      });
      setBroadcastMsg('');
      await fetchAllData();
    } catch (err) {
      console.error("Failed to send broadcast:", err);
    }
  };

  /* KPI data */
  const kpis = [
    { icon: Users,        label: 'Operative Registry', value: `${members.length}`,                                                  trend: 'ACTIVE', trendUp: true,  accent: 'indigo'  },
    { icon: Shield,       label: 'Pending Directives',  value: String(tasks.filter(t => t.status !== 'DONE').length),               trend: 'ACTIVE', trendUp: true,  accent: 'violet'  },
    { icon: Radio,        label: 'Active Missions',     value: String(projects.length),                                              trend: '+2',     trendUp: true,  accent: 'cyan'    },
    { icon: Activity,     label: 'Core Integrity',      value: `${nodes.filter(n => n.status === 'ONLINE').length}/${nodes.length}`, trend: 'SECURE', trendUp: true,  accent: 'emerald' },
  ];

  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser ? JSON.parse(rawUser) : { name: 'Admin' };
  const firstName = user.name?.split(' ')[0] ?? 'Overseer';

  const viewTitles: Record<string, string> = {
    desk: `Welcome Back, ${firstName}`, members: 'Operative Registry',
    teams: 'Teams', projects: 'Mission Matrix', tasks: 'Task Console',
    applications: 'Recruit Pipeline', announcements: 'Terminal Feed',
    leaderboard: 'Tactical Leaderboard',
  };
  const viewSubs: Record<string, string> = {
    desk: 'System Status: All Systems Nominal. Uplink Stable',
    members: 'Active Member Directory - Full Roster',
    teams: 'Team Registry - Squad Directory',
    projects: 'Mission Archive - Manage All Projects',
    tasks: 'Task Management - Assign and Track Directives',
    applications: 'Recruit Pipeline - Review New Applications',
    announcements: 'Terminal Feed - Broadcast Global Messages',
    leaderboard: 'Ranking Cycle: Active 2024 Q2',
  };

  const renderContent = () => {
    switch (view) {
      /* ── Overview ── */
      case 'desk': return (
        <>
          <KpiGrid>
            {kpis.map(kpi => {
              const Icon = kpi.icon;
              return (
                <KpiCard key={kpi.label} $accent={kpi.accent}>
                  <KpiTop>
                    <IconWrap $accent={kpi.accent}><Icon size={18} /></IconWrap>
                    <TrendBadge $up={kpi.trendUp}><TrendingUp size={10} />{t(kpi.trend)}</TrendBadge>
                  </KpiTop>
                  <KpiLabel>{t(kpi.label)}</KpiLabel>
                  <KpiValue>{kpi.value}</KpiValue>
                </KpiCard>
              );
            })}
          </KpiGrid>

          <ContentRow>
            {/* Server Nodes */}
            <SectionCard>
              <SectionHead>
                <div className="title-row"><Server size={16} className="icon cyan" /><span className="title">{t('Infrastructure Nodes')}</span></div>
                <span className="subtitle">{t('Hosting Node Status - Live Monitor')}</span>
              </SectionHead>
              <NodeList>
                {nodes.map(node => (
                  <NodeRow key={node.id}>
                    <div className="node-meta">
                      <span className="node-name">{node.name}</span>
                      <span className="node-ip">{node.ip}</span>
                    </div>
                    <div className="node-load">
                      <span className="load-txt">{t('Load: ')}{node.load}%</span>
                      <ProgressFill $level={node.load} />
                    </div>
                    <div className="node-right">
                      <StatusPill className={node.status.toLowerCase()}>{node.status}</StatusPill>
                      <Button variant={node.status === 'ONLINE' ? 'cyan' : node.status === 'STANDBY' ? 'amber' : 'red'} glow={false} onClick={() => cycleNode(node.id)}>
                        <RefreshCw size={11} style={{ marginRight: 5 }} />{t('Toggle')}
                      </Button>
                    </div>
                  </NodeRow>
                ))}
              </NodeList>
            </SectionCard>

            {/* Broadcast Feed */}
            <SectionCard style={{ maxWidth: 360 }}>
              <SectionHead>
                <div className="title-row"><Terminal size={16} className="icon amber" /><span className="title">{t('Terminal Feed')}</span></div>
                <span className="subtitle">{t('Uplink Build Monitor')}</span>
              </SectionHead>
              <LogConsole>
                {broadcastLogs.map((log, idx) => (
                  <p key={idx} className="log info">&gt; {log}</p>
                ))}
              </LogConsole>
            </SectionCard>
          </ContentRow>
        </>
      );

      /* ── Members ── */
      case 'members': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><Users size={16} className="icon indigo" /><span className="title">{t('Operative Registry')}</span></div>
            <span className="subtitle">{t('Active Member Directory - Full Roster')}</span>
          </SectionHead>
          
          <MemberControls>
            <SearchWrapper>
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder={t("Search operatives by name, role, focus...", "Search operatives by name, role, focus...")}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); try { playTypeClick(); } catch (_) {} }}
              />
              {searchQuery && (
                <ClearSearchButton onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </ClearSearchButton>
              )}
            </SearchWrapper>
            <Button variant="cyan" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} style={{ marginRight: 6 }} /> {t('Add Member', 'Add Member')}
            </Button>
          </MemberControls>

          <TableWrap>
            <DataTable>
              <thead><tr><th>{t('ID', 'ID')}</th><th>{t('Name')}</th><th>{t('ROLE')}</th><th>{t('FOCUS AREA')}</th><th>{t('XP', 'XP')}</th><th>{t('STATUS')}</th><th>{t('Actions', 'Actions')}</th></tr></thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(m => (
                    <tr key={m.id}>
                      <td className="mono dim">{m.id}</td>
                      <td className="bold white">{m.name}</td>
                      <td><RolePill className={m.role.toLowerCase()}>{m.role}</RolePill></td>
                      <td className="dim">{m.focus}</td>
                      <td className="mono indigo bold">{m.xp} XP</td>
                      <td><StatusPill className={m.status.toLowerCase()}>{m.status}</StatusPill></td>
                      <td>
                        <ActionRow>
                          <Button variant="cyan" glow={false} onClick={() => promoteMember(m.id)}>{t('Promote')}</Button>
                          <Button variant="red"  glow={false} onClick={() => cycleMemberStatus(m.id)}>{t('Toggle')}</Button>
                        </ActionRow>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '24px 0' }}>
                      {t('No members found matching your search.', 'No members found matching your search.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </DataTable>
          </TableWrap>
        </SectionCard>
      );

      /* ── Teams ── */
      case 'teams': return (
        <ContentRow>
          <SectionCard>
            <SectionHead>
              <div className="title-row"><Users size={16} className="icon indigo" /><span className="title">{t('Team Registry')}</span></div>
              <span className="subtitle">{t('Active Squads and Teams')}</span>
            </SectionHead>
            <TableWrap>
              <DataTable>
                <thead>
                  <tr>
                    <th>{t('ID')}</th>
                    <th>{t('Squad Name')}</th>
                    <th>{t('Leader')}</th>
                    <th>{t('Members')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.length > 0 ? (
                    teams.map(team => (
                      <tr key={team.id} style={{ background: selectedTeamId === team.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }}>
                        <td className="mono dim">{team.id}</td>
                        <td className="bold white">{team.name}</td>
                        <td className="bold indigo">{team.leaderName}</td>
                        <td className="mono white">{team.memberCount} {t('members')}</td>
                        <td>
                          <ActionRow>
                            <Button variant="cyan" glow={false} onClick={() => { setSelectedTeamId(team.id); fetchTeamMembers(team.id); }}>
                              {t('Manage')}
                            </Button>
                            <Button variant="red" glow={false} onClick={() => handleDisbandTeam(team.id)}>
                              {t('Disband')}
                            </Button>
                          </ActionRow>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '24px 0' }}>
                        {t('No squads active. Use the generator on the right to initialize.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>
            </TableWrap>
          </SectionCard>

          <SectionCard style={{ maxWidth: 360 }}>
            {selectedTeamId ? (
              <>
                <SectionHead>
                  <div className="title-row"><Users size={16} className="icon cyan" /><span className="title">{t('Manage Squad')}</span></div>
                  <span className="subtitle">{t('Configure Members for ')}{teams.find(t => t.id === selectedTeamId)?.name}</span>
                </SectionHead>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>{t('Squad Roster')}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                      {selectedTeamMembers.length > 0 ? (
                        selectedTeamMembers.map(m => (
                          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>{m.name}</span>
                              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>{m.focus}</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveMemberFromTeam(m.id)} 
                              style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                              {t('Remove')}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{t('No members in this squad.')}</p>
                      )}
                    </div>
                  </div>

                  <StyledForm onSubmit={handleAddMemberToTeam}>
                    <div className="field-group">
                      <label>{t('Draft Operative')}</label>
                      <select value={addMemberToTeamId} onChange={e => { setAddMemberToTeamId(e.target.value); try { playClick(); } catch (_) {} }}>
                        <option value="">{t('-- Select Operative --')}</option>
                        {members
                          .filter(m => !selectedTeamMembers.some(tm => tm.id === m.id))
                          .map(m => <option key={m.id} value={m.id}>{m.name} ({m.focus})</option>)
                        }
                      </select>
                    </div>
                    <Button variant="cyan" type="submit" glow={true} className="submit-btn" disabled={!addMemberToTeamId}>
                      <Plus size={14} style={{ marginRight: 8 }} /> {t('Draft Operative')}
                    </Button>
                  </StyledForm>

                  <Button variant="red" glow={false} onClick={() => { setSelectedTeamId(null); setSelectedTeamMembers([]); }}>
                    {t('Back to Create Squad')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <SectionHead>
                  <div className="title-row"><Plus size={16} className="icon emerald" /><span className="title">{t('Create Squad')}</span></div>
                  <span className="subtitle">{t('Initialize a New Working Unit')}</span>
                </SectionHead>
                <StyledForm onSubmit={handleCreateTeamSubmit}>
                  <div className="field-group">
                    <label>{t('Squad Name')}</label>
                    <input 
                      type="text" 
                      placeholder={t("e.g. Portal Architects")} 
                      value={newTeamName}
                      onChange={e => { setNewTeamName(e.target.value); try { playTypeClick(); } catch (_) {} }} 
                      required
                    />
                  </div>
                  <div className="field-group">
                    <label>{t('Squad Leader')}</label>
                    <select value={newTeamLeader} onChange={e => { setNewTeamLeader(e.target.value); try { playClick(); } catch (_) {} }} required>
                      <option value="">{t('-- Select Leader --')}</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <Button variant="cyan" type="submit" glow={true} className="submit-btn" disabled={!newTeamName.trim() || !newTeamLeader}>
                    <Plus size={14} style={{ marginRight: 8 }} /> {t('Initialize Squad')}
                  </Button>
                </StyledForm>
              </>
            )}
          </SectionCard>
        </ContentRow>
      );

      /* ── Projects ── */
      case 'projects': return (
        <ContentRow>
          <SectionCard>
            <SectionHead>
              <div className="title-row"><Cpu size={16} className="icon violet" /><span className="title">{t('Mission Matrix')}</span></div>
              <span className="subtitle">{t('Active Project Portfolio')}</span>
            </SectionHead>
            <ProjectList>
              {projects.map(p => (
                <ProjectItem key={p.id}>
                  <div className="proj-top">
                    <span className="proj-name">{p.name}</span>
                    <PriorityBadge className={p.priority.toLowerCase()}>{p.priority}</PriorityBadge>
                  </div>
                  <div className="proj-mid">
                    <span>{t('Lead: ')}{p.lead}</span>
                    <span>{t('Completion: ')}{p.progress}%</span>
                  </div>
                  <ProgressFill $level={p.progress} />
                </ProjectItem>
              ))}
            </ProjectList>
          </SectionCard>

          <SectionCard style={{ maxWidth: 340 }}>
            <SectionHead>
              <div className="title-row"><Plus size={16} className="icon emerald" /><span className="title">{t('Create Mission')}</span></div>
              <span className="subtitle">{t('Initialize a New Project')}</span>
            </SectionHead>
            <StyledForm onSubmit={createProject}>
              <div className="field-group">
                <label>{t('Project Name')}</label>
                <input type="text" placeholder={t("e.g. SDC Recruitment Portal", "e.g. SDC Recruitment Portal")} value={newProjectName}
                  onChange={e => { setNewProjectName(e.target.value); try { playTypeClick(); } catch (_) {} }} />
              </div>
              <div className="field-group">
                <label>{t('Assign Lead')}</label>
                <select value={newProjectLead} onChange={e => { setNewProjectLead(e.target.value); try { playClick(); } catch (_) {} }}>
                  {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <Button variant="cyan" type="submit" glow={true} className="submit-btn">
                <Plus size={14} style={{ marginRight: 8 }} /> {t('Initialize Mission', 'Initialize Mission')}
              </Button>
            </StyledForm>
          </SectionCard>
        </ContentRow>
      );

      /* ── Tasks ── */
      case 'tasks': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><CheckCircle2 size={16} className="icon emerald" /><span className="title">{t('Task Console')}</span></div>
            <span className="subtitle">{t('Mission Directives - Manage All Tasks')}</span>
          </SectionHead>
          <div className="task-list">
            {tasks.map(task => (
              <TaskEntry key={task.id} $status={task.status}>
                <div className="t-left">
                  <span className="t-id">{task.id}</span>
                  <span className="t-mod">[{task.module}]</span>
                </div>
                <div className="t-body">
                  <p className="t-title">{task.title}</p>
                  <span className="t-assignee">{t('Assignee: ')}{task.assignee}</span>
                </div>
                <Button variant={task.status === 'DONE' ? 'cyan' : task.status === 'IN_PROGRESS' ? 'amber' : 'red'} glow={false} onClick={() => cycleTask(task.id)}>
                  {task.status.replace('_', ' ')}
                </Button>
              </TaskEntry>
            ))}
          </div>
        </SectionCard>
      );

      /* ── Applications ── */
      case 'applications': {
        const pendingApps = applications.filter(a => a.status === 'PENDING');
        return (
          <SectionCard>
            <SectionHead>
              <div className="title-row"><AlertCircle size={16} className="icon amber" /><span className="title">{t('Recruit Pipeline')}</span></div>
              <span className="subtitle">{t('Pending Membership Applications - Review Queue')}</span>
            </SectionHead>

            {/* Bulk Actions Bar */}
            {pendingApps.length > 0 && (
              <BulkActionBar>
                <div className="bulk-left">
                  <input 
                    type="checkbox" 
                    id="select-all-pending"
                    checked={pendingApps.length > 0 && pendingApps.every(a => selectedIds.includes(a.id))}
                    onChange={toggleSelectAllApps} 
                    className="bulk-checkbox"
                  />
                  <label htmlFor="select-all-pending" className="select-all-label">
                    {t('Select All Pending')}
                  </label>
                  {selectedIds.length > 0 && (
                    <span className="selection-count">
                      ({selectedIds.length} {t('selected')})
                    </span>
                  )}
                </div>
                <div className="bulk-right">
                  <Button 
                    variant="cyan" 
                    glow={false}
                    disabled={selectedIds.length === 0} 
                    onClick={bulkApproveApps}
                  >
                    <Check size={12} style={{ marginRight: 6 }} />
                    {t('Bulk Approve')}
                  </Button>
                  <Button 
                    variant="red" 
                    glow={false}
                    disabled={selectedIds.length === 0} 
                    onClick={bulkRejectApps}
                  >
                    <X size={12} style={{ marginRight: 6 }} />
                    {t('Bulk Reject')}
                  </Button>
                </div>
              </BulkActionBar>
            )}

            <AppListList>
              {applications.map(app => (
                <AppRowItem key={app.id} className={app.status.toLowerCase()}>
                  {app.status === 'PENDING' ? (
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(app.id)} 
                      onChange={() => toggleSelectApp(app.id)}
                      className="app-checkbox"
                    />
                  ) : (
                    <div className="app-checkbox-placeholder" />
                  )}
                  <AppRowLeft>
                    <AppRowMeta>
                      <span className="app-id">{app.id}</span>
                      <span className="app-year">{t('SEM-')}{app.semester} / {app.branch}</span>
                    </AppRowMeta>
                    <AppRowMain>
                      <span className="app-name">{app.name}</span>
                      <span className="app-email">{app.email}</span>
                    </AppRowMain>
                  </AppRowLeft>
                  <AppRowMiddle>
                    <div className="role-and-msg">
                      <div className="app-role">
                        {t('Preferred Role:')} <RolePill className={app.role.toLowerCase().replace(' ', '_')}>{app.role}</RolePill>
                      </div>
                      {app.message && (
                        <p className="app-reason">"{app.message}"</p>
                      )}
                    </div>
                  </AppRowMiddle>
                  <AppRowRight>
                    {app.status === 'PENDING' ? (
                      <AppRowActions>
                        <Button variant="cyan" glow={false} onClick={() => approveApp(app.id)}>
                          <Check size={12} style={{ marginRight: 4 }} /> {t('Approve', 'Approve')}
                        </Button>
                        <Button variant="red" glow={false} onClick={() => rejectApp(app.id)}>
                          <X size={12} style={{ marginRight: 4 }} /> {t('Reject', 'Reject')}
                        </Button>
                      </AppRowActions>
                    ) : (
                      <StatusPill className={app.status.toLowerCase()}>{app.status}</StatusPill>
                    )}
                  </AppRowRight>
                </AppRowItem>
              ))}
            </AppListList>
          </SectionCard>
        );
      }

      /* ── Announcements ── */
      case 'announcements': return (
        <ContentRow>
          <SectionCard>
            <SectionHead>
              <div className="title-row"><Send size={16} className="icon amber" /><span className="title">{t('Broadcast Console')}</span></div>
              <span className="subtitle">{t('Transmit Global Announcements')}</span>
            </SectionHead>
            <StyledForm onSubmit={sendBroadcast} style={{ marginBottom: 16 }}>
              <div className="field-group">
                <label>{t('Broadcast Message')}</label>
                <div className="input-row">
                  <input type="text" placeholder={t("Type an announcement...", "Type an announcement...")} value={broadcastMsg}
                    onChange={e => { setBroadcastMsg(e.target.value); try { playTypeClick(); } catch (_) {} }} />
                  <Button variant="amber" type="submit" glow={true}><Send size={14} /></Button>
                </div>
              </div>
            </StyledForm>
            <LogConsole style={{ height: 220 }}>
              {broadcastLogs.map((log, idx) => (
                <p key={idx} className="log info">&gt; {log}</p>
              ))}
            </LogConsole>
          </SectionCard>

          <SectionCard style={{ maxWidth: 360 }}>
            <SectionHead>
              <div className="title-row"><Terminal size={16} className="icon cyan" /><span className="title">{t('System Diagnostics')}</span></div>
              <span className="subtitle">{t('Server Health Check')}</span>
            </SectionHead>
            <LogConsole>
              <p className="log info">&gt; Checking node security status...</p>
              <p className="log success">&gt; Gateway secured. No latency spikes detected.</p>
              <p className="log info">&gt; Verifying microservice health...</p>
              <p className="log success">&gt; WebGL canvas initialized at 60 FPS.</p>
              <p className="log warning">&gt; Notice: DB indexing cron scheduled in 2 hours.</p>
              <p className="log info">&gt; CPU utilization: 12.4% across all cores.</p>
            </LogConsole>
          </SectionCard>
        </ContentRow>
      );

      /* ── Leaderboard ── */
      case 'leaderboard': return (
        <Leaderboard />
      );

      default: return <div style={{ color: 'rgba(255,255,255,0.3)' }}>{t('Section not found.')}</div>;
    }
  };

  return (
    <PageContainer>
      <WelcomeHeader>
        <div className="left">
          <h1 className="page-title">{t((Reflect.get(viewTitles, view) as string) ?? view.toUpperCase())}</h1>
          <p className="page-sub">{t((Reflect.get(viewSubs, view) as string) ?? '')}</p>
        </div>
        {view === 'desk' && (
          <SessionBadge>
            <TrendingUp size={12} />
            <span>{t('SESSION_UPTIME: 04:12:09')}</span>
          </SessionBadge>
        )}
      </WelcomeHeader>

      {renderContent()}

      {/* ── Add Member Modal ── */}
      {isAddModalOpen && (
        <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHead>
              <h3>{t('Add New Member')}</h3>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </ModalHead>
            <ModalBody onSubmit={handleAddMemberSubmit}>
              <div className="field-group">
                <label>{t('Name')}</label>
                <input
                  type="text"
                  placeholder={t("Enter full name", "Enter full name")}
                  required
                  value={newMember.name}
                  onChange={e => {
                    setNewMember(prev => ({ ...prev, name: e.target.value }));
                    try { playTypeClick(); } catch (_) {}
                  }}
                />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>{t('Role')}</label>
                  <select
                    value={newMember.role}
                    onChange={e => {
                      setNewMember(prev => ({ ...prev, role: e.target.value as Member['role'] }));
                      try { playClick(); } catch (_) {}
                    }}
                  >
                    <option value="JUNIOR">{t('JUNIOR')}</option>
                    <option value="MEMBER">{t('MEMBER')}</option>
                    <option value="SENIOR">{t('SENIOR')}</option>
                    <option value="LEAD">{t('LEAD')}</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>{t('Status')}</label>
                  <select
                    value={newMember.status}
                    onChange={e => {
                      setNewMember(prev => ({ ...prev, status: e.target.value as Member['status'] }));
                      try { playClick(); } catch (_) {}
                    }}
                  >
                    <option value="ACTIVE">{t('ACTIVE')}</option>
                    <option value="IDLE">{t('IDLE')}</option>
                    <option value="OFFLINE">{t('OFFLINE')}</option>
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>{t('Focus Area')}</label>
                  <input
                    type="text"
                    placeholder={t("e.g. Backend Architecture", "e.g. Backend Architecture")}
                    required
                    value={newMember.focus}
                    onChange={e => {
                      setNewMember(prev => ({ ...prev, focus: e.target.value }));
                      try { playTypeClick(); } catch (_) {}
                    }}
                  />
                </div>
                <div className="field-group">
                  <label>{t('Initial XP')}</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    required
                    min="0"
                    value={newMember.xp}
                    onChange={e => {
                      setNewMember(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }));
                      try { playTypeClick(); } catch (_) {}
                    }}
                  />
                </div>
              </div>
              <ModalFooter>
                <Button type="button" variant="red" glow={false} onClick={() => setIsAddModalOpen(false)}>
                  {t('Cancel', 'Cancel')}
                </Button>
                <Button type="submit" variant="cyan" glow={true}>
                  {t('Initialize Operative', 'Initialize Operative')}
                </Button>
              </ModalFooter>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

/* ─── Keyframes ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ─── */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  animation: ${fadeUp} 0.3s ease both;
`;

const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;

  .left { display: flex; flex-direction: column; gap: 4px; }

  .page-title {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.02em;
    margin: 0;
  }

  .page-sub {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.06em;
    margin: 0;
  }
`;

const SessionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 8px;
  padding: 8px 14px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #818cf8;
  letter-spacing: 0.05em;
`;

/* ── KPI ── */
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const accentColors: Record<string, { border: string; bg: string; color: string; glow: string }> = {
  indigo:  { border: 'rgba(99,102,241,0.25)',  bg: 'rgba(99,102,241,0.06)',  color: '#818cf8', glow: 'rgba(99,102,241,0.12)' },
  violet:  { border: 'rgba(139,92,246,0.25)',  bg: 'rgba(139,92,246,0.06)',  color: '#a78bfa', glow: 'rgba(139,92,246,0.12)' },
  cyan:    { border: 'rgba(34,211,238,0.25)',  bg: 'rgba(34,211,238,0.06)',  color: '#22d3ee', glow: 'rgba(34,211,238,0.12)' },
  emerald: { border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.06)',  color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
};

const getAccentValue = (accent: string, key: 'border' | 'bg' | 'glow' | 'color'): string | undefined => {
  const obj = Reflect.get(accentColors, accent);
  return obj ? (Reflect.get(obj, key) as string) : undefined;
};

const KpiCard = styled.div<{ $accent: string }>`
  background: rgba(10, 14, 30, 0.65);
  border: 1px solid ${p => getAccentValue(p.$accent, 'border') ?? 'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  backdrop-filter: blur(12px);
  transition: all 0.2s;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${p => getAccentValue(p.$accent, 'bg') ?? 'transparent'};
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${p => getAccentValue(p.$accent, 'glow') ?? 'transparent'};
  }
`;

const KpiTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrap = styled.div<{ $accent: string }>`
  width: 36px; height: 36px;
  background: ${p => getAccentValue(p.$accent, 'bg') ?? 'rgba(255,255,255,0.05)'};
  border: 1px solid ${p => getAccentValue(p.$accent, 'border') ?? 'rgba(255,255,255,0.08)'};
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: ${p => getAccentValue(p.$accent, 'color') ?? '#fff'};
`;

const TrendBadge = styled.div<{ $up: boolean }>`
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.6rem; font-weight: 700;
  color: ${p => p.$up ? '#34d399' : '#f87171'};
  background: ${p => p.$up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'};
  border: 1px solid ${p => p.$up ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'};
  padding: 3px 8px; border-radius: 20px; letter-spacing: 0.04em;
`;

const KpiLabel = styled.div`
  font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
  color: rgba(255,255,255,0.35); letter-spacing: 0.06em;
`;

const KpiValue = styled.div`
  font-family: var(--font-mono); font-size: 1.65rem; font-weight: 800;
  color: #ffffff; letter-spacing: -0.01em; line-height: 1;
`;

/* ── Content ── */
const ContentRow = styled.div`
  display: flex; gap: 16px; align-items: flex-start;
  @media (max-width: 900px) { flex-direction: column; }
`;

const SectionCard = styled.div`
  flex: 1;
  background: rgba(10, 14, 30, 0.65);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(12px);

  .task-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
`;

const SectionHead = styled.div`
  display: flex; flex-direction: column; gap: 3px;
  margin-bottom: 14px; padding-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  .title-row {
    display: flex; align-items: center; gap: 9px;

    .icon {
      &.indigo  { color: #818cf8; }
      &.violet  { color: #a78bfa; }
      &.amber   { color: #fbbf24; }
      &.emerald { color: #34d399; }
      &.cyan    { color: #22d3ee; }
    }

    .title {
      font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;
      color: #ffffff; letter-spacing: 0.04em;
    }
  }

  .subtitle {
    font-family: var(--font-mono); font-size: 0.57rem;
    color: rgba(255,255,255,0.25); letter-spacing: 0.07em; padding-left: 25px;
  }
`;

const NodeList = styled.div`
  display: flex; flex-direction: column; gap: 10px;
`;

const NodeRow = styled.div`
  display: flex; align-items: center; gap: 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px; padding: 12px 14px;
  transition: all 0.18s;

  &:hover { background: rgba(255,255,255,0.03); border-color: rgba(99,102,241,0.18); }

  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 8px; }

  .node-meta {
    min-width: 160px; display: flex; flex-direction: column; gap: 2px;
    .node-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
    .node-ip   { font-family: var(--font-mono); font-size: 0.62rem; color: rgba(255,255,255,0.3); }
  }

  .node-load {
    flex-grow: 1; display: flex; flex-direction: column; gap: 6px;
    .load-txt { font-family: var(--font-mono); font-size: 0.62rem; color: rgba(255,255,255,0.35); }
  }

  .node-right {
    display: flex; align-items: center; gap: 10px;
    button { padding: 6px 12px; font-size: 0.67rem; }
  }
`;

const LogConsole = styled.div`
  background: rgba(4,6,16,0.8);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px; padding: 14px;
  height: 230px; overflow-y: auto;
  font-family: var(--font-mono); font-size: 0.67rem; line-height: 1.75;
  display: flex; flex-direction: column; gap: 2px;

  .log         { white-space: pre-wrap; word-break: break-all; }
  .log.success { color: #34d399; }
  .log.info    { color: rgba(255,255,255,0.3); }
  .log.warning { color: #fbbf24; }
  .log.error   { color: #f87171; }
`;

const ProgressFill = styled.div<{ $level: number }>`
  height: 4px; background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden;

  &::after {
    content: ''; display: block; height: 100%;
    width: ${p => p.$level}%;
    background: ${p =>
      p.$level > 80 ? 'linear-gradient(90deg,#6366f1,#22d3ee)' :
      p.$level > 40 ? 'linear-gradient(90deg,#8b5cf6,#fbbf24)' :
      'linear-gradient(90deg,#f87171,#fb923c)'
    };
    border-radius: 10px; transition: width 0.4s ease;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.78rem; text-align: left;

  th, td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }

  th {
    font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
    color: rgba(255,255,255,0.3); letter-spacing: 0.07em;
  }

  tbody tr { transition: background 0.15s; }
  tbody tr:hover   { background: rgba(255,255,255,0.02); }
  tbody tr.top-row { background: rgba(99,102,241,0.05); }

  .mono   { font-family: var(--font-mono); }
  .bold   { font-weight: 700; }
  .white  { color: #ffffff; }
  .dim    { color: rgba(255,255,255,0.35); }
  .indigo { color: #818cf8; }
`;

const RolePill = styled.span`
  font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
  padding: 3px 9px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); letter-spacing: 0.04em;

  &.lead   { border-color: rgba(99,102,241,0.35); color: #818cf8; }
  &.senior { border-color: rgba(139,92,246,0.35); color: #a78bfa; }
  &.member { border-color: rgba(255,255,255,0.1); }
  &.junior { border-color: rgba(251,191,36,0.3); color: #fbbf24; }

  &.web_developer { border-color: rgba(34,211,238,0.35); color: #22d3ee; }
  &.mobile   { border-color: rgba(139,92,246,0.35); color: #a78bfa; }
  &.ui\/ux   { border-color: rgba(244,63,94,0.35);  color: #f43f5e; }
  &.devops   { border-color: rgba(251,191,36,0.3);  color: #fbbf24; }
  &.ai\/ml   { border-color: rgba(52,211,153,0.3);  color: #34d399; }
`;

const StatusPill = styled.span`
  font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; border: 1px solid; letter-spacing: 0.04em;

  &.active, &.online, &.approved { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.25); }
  &.idle, &.standby, &.pending   { background: rgba(251,191,36,0.08); color: #fbbf24; border-color: rgba(251,191,36,0.25); }
  &.offline, &.rejected          { background: rgba(248,113,113,0.08); color: #f87171; border-color: rgba(248,113,113,0.25); }
`;

const ActionRow = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
  button { padding: 6px 10px; font-size: 0.67rem; }
`;

const ProjectList = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const ProjectItem = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(139,92,246,0.14);
  border-radius: 10px; padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
  transition: all 0.2s;

  &:hover { border-color: rgba(139,92,246,0.3); }

  .proj-top {
    display: flex; justify-content: space-between; align-items: center;
    .proj-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
  }

  .proj-mid {
    display: flex; justify-content: space-between;
    font-family: var(--font-mono); font-size: 0.63rem; color: rgba(255,255,255,0.35);
  }
`;

const PriorityBadge = styled.span`
  font-family: var(--font-mono); font-size: 0.58rem; font-weight: 700;
  padding: 2px 8px; border-radius: 20px; letter-spacing: 0.04em;

  &.high   { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: #f87171; }
  &.medium { background: rgba(251,191,36,0.1);  border: 1px solid rgba(251,191,36,0.2);  color: #fbbf24; }
  &.low    { background: rgba(52,211,153,0.1);  border: 1px solid rgba(52,211,153,0.2);  color: #34d399; }
`;

const StyledForm = styled.form`
  display: flex; flex-direction: column; gap: 16px;

  .field-group {
    display: flex; flex-direction: column; gap: 6px;

    label {
      font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
      color: rgba(255,255,255,0.35); letter-spacing: 0.07em;
    }

    input, select {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(99,102,241,0.18);
      border-radius: 8px; padding: 10px 14px;
      color: #fff; font-size: 0.82rem; font-family: var(--font-body);
      outline: none; width: 100%; transition: border-color 0.2s;

      &:focus { border-color: rgba(99,102,241,0.45); }
      &::placeholder { color: rgba(255,255,255,0.2); }
      option { background: #0f172a; }
    }

    .input-row { display: flex; gap: 10px; input { flex-grow: 1; } }
  }

  .submit-btn { align-self: flex-start; }
`;

const BulkActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 14px;
  font-family: var(--font-mono);
  font-size: 0.72rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .bulk-left {
    display: flex;
    align-items: center;
    gap: 10px;

    input[type="checkbox"] {
      accent-color: #818cf8;
      cursor: pointer;
      width: 14px;
      height: 14px;
    }

    .select-all-label {
      color: rgba(255, 255, 255, 0.75);
      cursor: pointer;
      font-weight: 700;
    }

    .selection-count {
      color: #818cf8;
      font-weight: 700;
    }
  }

  .bulk-right {
    display: flex;
    gap: 10px;

    button {
      padding: 6px 12px;
      font-size: 0.68rem;
    }
  }
`;

const AppListList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`;

const AppRowItem = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 3px solid #fbbf24;
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(99, 102, 241, 0.25);
    transform: translateX(2px);
  }

  &.approved {
    border-left-color: #34d399;
  }

  &.rejected {
    border-left-color: #f87171;
  }

  .app-checkbox {
    accent-color: #818cf8;
    cursor: pointer;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .app-checkbox-placeholder {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
  }
`;

const AppRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 240px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    min-width: 100%;
  }
`;

const AppRowMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 80px;

  .app-id {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
  }

  .app-year {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.25);
  }
`;

const AppRowMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .app-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #fff;
  }

  .app-email {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    font-family: var(--font-mono);
  }

  .app-role {
    font-size: 0.68rem;
    color: #818cf8;
    font-weight: 600;
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
  }
`;

const AppRowMiddle = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .role-and-msg {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    .app-role {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.45);
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .app-reason {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    line-height: 1.4;
    margin: 0;
    max-width: 500px;
  }
`;

const AppRowRight = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const AppRowActions = styled.div`
  display: flex;
  gap: 8px;
  
  button {
    padding: 6px 12px;
    font-size: 0.68rem;
  }
`;

const MemberControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(99, 102, 241, 0.15);
    border-radius: 8px;
    padding: 8px 12px 8px 36px;
    color: #fff;
    font-size: 0.8rem;
    font-family: var(--font-body);
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: rgba(99, 102, 241, 0.45);
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.1);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.15s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 5, 12, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: rgba(10, 14, 30, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15);
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 14px;
  margin-bottom: 20px;

  h3 {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.15s;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.06);
    }
  }
`;

const ModalBody = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 0.07em;
    }

    input, select {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(99, 102, 241, 0.18);
      border-radius: 8px;
      padding: 10px 14px;
      color: #fff;
      font-size: 0.82rem;
      font-family: var(--font-body);
      outline: none;
      width: 100%;
      transition: border-color 0.2s;

      &:focus {
        border-color: rgba(99, 102, 241, 0.45);
        background: rgba(255, 255, 255, 0.05);
      }
      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }
      option {
        background: #0f172a;
      }
    }
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  margin-top: 8px;
`;

const TaskEntry = styled.div<{ $status: Task['status'] }>`
  display: flex; align-items: center; gap: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-left: 3px solid ${p =>
    p.$status === 'DONE'        ? '#34d399' :
    p.$status === 'IN_PROGRESS' ? '#fbbf24' :
    p.$status === 'REVIEW'      ? '#818cf8' :
    'rgba(255,255,255,0.12)'
  };
  border-radius: 8px; padding: 12px 14px; transition: all 0.18s;

  &:hover { background: rgba(255,255,255,0.03); }

  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 8px; }

  .t-left {
    display: flex; flex-direction: column; gap: 3px; min-width: 80px;
    .t-id  { font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: #fff; }
    .t-mod { font-family: var(--font-mono); font-size: 0.6rem; color: rgba(255,255,255,0.3); }
  }

  .t-body {
    flex-grow: 1; display: flex; flex-direction: column; gap: 2px;
    .t-title    { font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.4; }
    .t-assignee { font-size: 0.65rem; color: rgba(255,255,255,0.3); }
  }

  button { flex-shrink: 0; padding: 6px 12px; font-size: 0.67rem; }
`;



export default AdminDashboard;

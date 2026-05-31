import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Terminal, TrendingUp, Users, Cpu,
  ArrowUpRight, ListTodo, CheckCircle2, AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Leaderboard from '../../components/dashboard/Leaderboard';
import { useSound } from '../../context/SoundContext';
import { t } from '../../hooks/useTranslation';

/* ─── Types ─── */
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

/* ─── Seed Data ─── */
const seedMembers: Member[] = [
  { id: 'MBR-001', name: 'Aditya Sharma', role: 'LEAD',   focus: 'System Architecture',    status: 'ACTIVE', xp: 2840 },
  { id: 'MBR-002', name: 'Priya Mehta',   role: 'SENIOR', focus: 'WebGL & UI Engineering', status: 'ACTIVE', xp: 1950 },
  { id: 'MBR-003', name: 'Rohit Verma',   role: 'MEMBER', focus: 'Database Optimization',  status: 'IDLE',   xp: 1240 },
  { id: 'MBR-004', name: 'Sneha Joshi',   role: 'MEMBER', focus: 'Auth & Security',        status: 'ACTIVE', xp: 980  },
];

const seedProjects: Project[] = [
  { id: 'PRJ-01', name: 'Member Roster Showcase',    lead: 'Priya Mehta',   progress: 68, priority: 'HIGH'   },
  { id: 'PRJ-02', name: 'Database Migration Suite',  lead: 'Rohit Verma',   progress: 94, priority: 'MEDIUM' },
  { id: 'PRJ-03', name: 'FastAPI Deployment Pipeline', lead: 'Aditya Sharma', progress: 30, priority: 'HIGH' },
];

const seedTasks: Task[] = [
  { id: 'TSK-109', module: 'Auth',     title: 'Implement JWT login session verification',     status: 'DONE',        assignee: 'Aditya Sharma' },
  { id: 'TSK-110', module: 'UI',       title: 'Optimize WebGL particle coordinate mapping',   status: 'IN_PROGRESS', assignee: 'Priya Mehta'   },
  { id: 'TSK-111', module: 'Assets',   title: 'Configure static media cache layer',           status: 'DONE',        assignee: 'Priya Mehta'   },
  { id: 'TSK-112', module: 'Database', title: 'Audit SQL query times and rewrite indexes',    status: 'TODO',        assignee: 'Rohit Verma'   },
];

const seedApplications: Application[] = [
  { 
    id: 'APP-882', 
    name: 'Alex Karr', 
    email: 'alex.karr@college.edu', 
    branch: 'CSE', 
    semester: 4, 
    role: 'WEB DEVELOPER', 
    message: 'Familiar with microservices. Looking to build real-world REST APIs with FastAPI.', 
    status: 'PENDING' 
  },
  { 
    id: 'APP-883', 
    name: 'Valerie Vane', 
    email: 'valerie.vane@college.edu', 
    branch: 'IT', 
    semester: 6, 
    role: 'DEVOPS', 
    message: 'Experienced with Docker, CI/CD pipelines, and cloud hosting architecture.', 
    status: 'PENDING' 
  },
  { 
    id: 'APP-884', 
    name: 'Damien Rush', 
    email: 'damien.rush@college.edu', 
    branch: 'CSE', 
    semester: 4, 
    role: 'WEB DEVELOPER', 
    message: 'React enthusiast. Love crafting animations and responsive fluid interfaces.', 
    status: 'PENDING' 
  },
];

interface DeveloperDashboardProps {
  view: 'desk' | 'members' | 'teams' | 'projects' | 'tasks' | 'applications' | 'announcements' | 'leaderboard';
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ view }) => {
  const { playClick } = useSound();
  const [tasks, setTasks]     = useState<Task[]>(seedTasks);
  const [members]             = useState<Member[]>(seedMembers);
  const [projects]            = useState<Project[]>(seedProjects);
  const [applications]        = useState<Application[]>(seedApplications);
  const [broadcastLogs]       = useState<string[]>([
    '[10:24] Admin: All production instances scaling correctly.',
    '[09:15] System: DB backup synchronization completed successfully.',
  ]);

  const cycleTask = (id: string) => {
    try { playClick(); } catch (_) {}
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const s: Task['status'][] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
      return { ...t, status: Reflect.get(s, (s.indexOf(t.status) + 1) % s.length) };
    }));
  };

  /* ── Shared Welcome + KPI header ── */
  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser ? JSON.parse(rawUser) : { name: 'Developer' };
  const firstName = user.name?.split(' ')[0] ?? 'Developer';

  const kpis = [
    { icon: Users,    label: 'Operative Registry', value: `${members.filter(m => m.status === 'ACTIVE').length} / ${members.length}`, trend: '+4.2%',  trendUp: true,  accent: 'indigo' },
    { icon: Cpu,      label: 'Active Missions',    value: String(projects.length),                                                     trend: '+2',      trendUp: true,  accent: 'violet' },
    { icon: CheckCircle2, label: 'My Directives',  value: String(tasks.filter(t => t.status !== 'DONE').length),                      trend: 'Optimal', trendUp: true,  accent: 'emerald'},
    { icon: TrendingUp,   label: 'Core Integrity', value: '98.4%',                                                                    trend: 'Secure',  trendUp: true,  accent: 'cyan'   },
  ];

  const viewTitles: Record<string, string> = {
    desk: `Welcome Back, ${firstName}`, members: 'Operative Registry',
    teams: 'Teams', projects: 'Mission Matrix', tasks: 'Task Console',
    applications: 'Recruit Pipeline', announcements: 'Terminal Feed',
    leaderboard: 'Leaderboard',
  };
  const viewSubs: Record<string, string> = {
    desk: 'System Status: All Systems Nominal. Uplink Stable',
    members: 'Registered Members - SDC Developer Roster',
    teams: 'Team Registry - Squad Directory',
    projects: 'Active Missions - Current Project Portfolio',
    tasks: 'Assigned Directives - Your Task Queue',
    applications: 'Recruit Pipeline - Pending Applications',
    announcements: 'Terminal Feed - Global Broadcasts',
    leaderboard: 'Contribution Rankings - Active Cycle 2024 Q2',
  };

  const renderContent = () => {
    switch (view) {
      case 'desk': return (
        <>
          {/* KPI Grid */}
          <KpiGrid>
            {kpis.map(kpi => {
              const Icon = kpi.icon;
              return (
                <KpiCard key={kpi.label} $accent={kpi.accent}>
                  <KpiTop>
                    <IconWrap $accent={kpi.accent}><Icon size={18} /></IconWrap>
                    <TrendBadge $up={kpi.trendUp}>
                      <TrendingUp size={10} />
                      {t(kpi.trend)}
                    </TrendBadge>
                  </KpiTop>
                  <KpiLabel>{t(kpi.label)}</KpiLabel>
                  <KpiValue $accent={kpi.accent}>{kpi.value}</KpiValue>
                  <ArrowUpRight size={14} className="corner-arrow" />
                </KpiCard>
              );
            })}
          </KpiGrid>

          {/* Content Section */}
          <ContentRow>
            {/* Task Queue */}
            <SectionCard>
              <SectionHead>
                <div className="title-row">
                  <ListTodo size={16} className="icon indigo" />
                  <span className="title">{t('Task Console')}</span>
                </div>
                <span className="subtitle">{t('Assigned Directives: Active Queue')}</span>
              </SectionHead>
              <div className="task-list">
                {tasks.slice(0, 4).map(task => (
                  <TaskEntry key={task.id} $status={task.status}>
                    <div className="t-left">
                      <span className="t-id">{task.id}</span>
                      <span className="t-mod">[{task.module}]</span>
                    </div>
                    <div className="t-body">
                      <p className="t-title">{task.title}</p>
                      <span className="t-assignee">{task.assignee}</span>
                    </div>
                    <Button
                      variant={task.status === 'DONE' ? 'cyan' : task.status === 'IN_PROGRESS' ? 'amber' : 'red'}
                      glow={false}
                      onClick={() => cycleTask(task.id)}
                    >
                      {t(task.status)}
                    </Button>
                  </TaskEntry>
                ))}
              </div>
            </SectionCard>

            {/* Activity Log */}
            <SectionCard style={{ maxWidth: 380 }}>
              <SectionHead>
                <div className="title-row">
                  <Terminal size={16} className="icon amber" />
                  <span className="title">{t('System Log')}</span>
                </div>
                <span className="subtitle">{t('Uplink Build Monitor')}</span>
              </SectionHead>
              <LogConsole>
                <p className="log success">&gt; uvicorn app.main:app --reload --port 8000</p>
                <p className="log info">&gt; Will watch for changes in: ['backend']</p>
                <p className="log info">&gt; Uvicorn running on http://127.0.0.1:8000</p>
                <p className="log success">&gt; Database connection established. Dialect: SQLITE</p>
                <p className="log warning">&gt; WARNING: Unregistered requests ignored. Auth verified.</p>
                <p className="log error">&gt; ERROR: Timeout resolved by load balancer retry.</p>
              </LogConsole>
            </SectionCard>
          </ContentRow>
        </>
      );

      case 'members': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><Users size={16} className="icon indigo" /><span className="title">{t('Operative Registry')}</span></div>
            <span className="subtitle">{t('SDC Registered Developers')}</span>
          </SectionHead>
          <TableWrap>
            <DataTable>
              <thead><tr><th>{t('ID')}</th><th>{t('Name')}</th><th>{t('Role')}</th><th>{t('Focus Area')}</th><th>{t('XP')}</th><th>{t('Status')}</th></tr></thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="mono dim">{m.id}</td>
                    <td className="bold white">{m.name}</td>
                    <td><RolePill className={m.role.toLowerCase()}>{m.role}</RolePill></td>
                    <td className="dim">{m.focus}</td>
                    <td className="mono indigo bold">{m.xp} XP</td>
                    <td><StatusPill className={m.status.toLowerCase()}>{m.status}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </TableWrap>
        </SectionCard>
      );

      case 'teams': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><Users size={16} className="icon indigo" /><span className="title">{t('Team Registry')}</span></div>
            <span className="subtitle">{t('Active Squads and Teams')}</span>
          </SectionHead>
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '20px 0' }}>
            <p>{t('Teams view is currently under construction.')}</p>
          </div>
        </SectionCard>
      );

      case 'projects': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><Cpu size={16} className="icon violet" /><span className="title">{t('Mission Matrix')}</span></div>
            <span className="subtitle">{t('Active Project Portfolio')}</span>
          </SectionHead>
          <ProjectGrid>
            {projects.map(p => (
              <ProjectItem key={p.id}>
                <div className="proj-top">
                  <span className="proj-name">{p.name}</span>
                  <PriorityBadge className={p.priority.toLowerCase()}>{p.priority}</PriorityBadge>
                </div>
                <div className="proj-mid">
                  <span>{t('Lead: ')}{p.lead}</span>
                  <span>{t('Progress: ')}{p.progress}%</span>
                </div>
                <ProgressFill $level={p.progress} />
              </ProjectItem>
            ))}
          </ProjectGrid>
        </SectionCard>
      );

      case 'tasks': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><CheckCircle2 size={16} className="icon emerald" /><span className="title">{t('Task Console')}</span></div>
            <span className="subtitle">{t('My Assigned Directives')}</span>
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
                <Button
                  variant={task.status === 'DONE' ? 'cyan' : task.status === 'IN_PROGRESS' ? 'amber' : 'red'}
                  glow={false}
                  onClick={() => cycleTask(task.id)}
                >
                  {t(task.status)}
                </Button>
              </TaskEntry>
            ))}
          </div>
        </SectionCard>
      );

      case 'applications': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><AlertCircle size={16} className="icon amber" /><span className="title">{t('Recruit Pipeline')}</span></div>
            <span className="subtitle">{t('Pending Membership Applications')}</span>
          </SectionHead>
          <AppGrid>
            {applications.map(app => (
              <AppCard key={app.id} className={app.status.toLowerCase()}>
                <div className="app-top">
                  <span className="app-id">{app.id}</span>
                  <span className="app-role">{app.role}</span>
                </div>
                <div className="app-info-block">
                  <span className="app-name">{app.name}</span>
                  <span className="app-email">{app.email}</span>
                </div>
                <div className="app-meta-row">
                  <span className="app-branch-sem">{t('SEM-')}{app.semester} / {app.branch}</span>
                  <StatusPill className={app.status.toLowerCase()}>{t(app.status)}</StatusPill>
                </div>
                {app.message && (
                  <p className="app-reason">"{app.message}"</p>
                )}
              </AppCard>
            ))}
          </AppGrid>
        </SectionCard>
      );

      case 'announcements': return (
        <SectionCard>
          <SectionHead>
            <div className="title-row"><Terminal size={16} className="icon amber" /><span className="title">{t('Terminal Feed')}</span></div>
            <span className="subtitle">{t('Global Broadcast Stream')}</span>
          </SectionHead>
          <LogConsole style={{ height: 300 }}>
            {broadcastLogs.map((log, i) => (
              <p key={i} className="log info">&gt; {log}</p>
            ))}
          </LogConsole>
        </SectionCard>
      );

      case 'leaderboard': return (
        <Leaderboard />
      );

      default: return <div style={{ color: 'var(--text-dim)' }}>{t('Section not found.')}</div>;
    }
  };

  return (
    <PageContainer>
      {/* Welcome Header */}
      <WelcomeHeader>
        <div className="left">
          <h1 className="page-title">{t((Reflect.get(viewTitles, view) as string) ?? view.toUpperCase())}</h1>
          <p className="page-sub">{t((Reflect.get(viewSubs, view) as string) ?? '')}</p>
        </div>
        {view === 'desk' && (
          <SessionBadge>
            <TrendingUp size={12} />
            <span>{t('Session Uptime: 04:12:09')}</span>
          </SessionBadge>
        )}
      </WelcomeHeader>

      {renderContent()}
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

  .left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

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

/* ── KPI Cards ── */
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
  emerald: { border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.06)',  color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
  cyan:    { border: 'rgba(34,211,238,0.25)',  bg: 'rgba(34,211,238,0.06)',  color: '#22d3ee', glow: 'rgba(34,211,238,0.12)' },
};

const getAccentValue = (accent: string, key: 'border' | 'bg' | 'glow' | 'color'): string | undefined => {
  const obj = Reflect.get(accentColors, accent);
  return obj ? (Reflect.get(obj, key) as string) : undefined;
};

const KpiCard = styled.div<{ $accent: string }>`
  background: rgba(10, 14, 30, 0.6);
  border: 1px solid ${p => getAccentValue(p.$accent, 'border') ?? 'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
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

  .corner-arrow {
    position: absolute;
    bottom: 16px; right: 16px;
    color: rgba(255,255,255,0.15);
    transition: color 0.2s;
  }

  &:hover .corner-arrow { color: ${p => getAccentValue(p.$accent, 'color') ?? '#818cf8'}; }
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => getAccentValue(p.$accent, 'color') ?? '#fff'};
`;

const TrendBadge = styled.div<{ $up: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  color: ${p => p.$up ? '#34d399' : '#f87171'};
  background: ${p => p.$up ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'};
  border: 1px solid ${p => p.$up ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'};
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.04em;
`;

const KpiLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.06em;
`;

const KpiValue = styled.div<{ $accent: string }>`
  font-family: var(--font-mono);
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1;
`;

/* ── Content Row ── */
const ContentRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 900px) { flex-direction: column; }
`;

const SectionCard = styled.div`
  flex: 1;
  background: rgba(10, 14, 30, 0.6);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(12px);

  .task-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
`;

const SectionHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  .title-row {
    display: flex;
    align-items: center;
    gap: 9px;

    .icon {
      &.indigo { color: #818cf8; }
      &.violet { color: #a78bfa; }
      &.amber  { color: #fbbf24; }
      &.emerald{ color: #34d399; }
    }

    .title {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.04em;
    }
  }

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.57rem;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.07em;
    padding-left: 25px;
  }
`;

const TaskEntry = styled.div<{ $status: Task['status'] }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-left: 3px solid ${p =>
    p.$status === 'DONE'        ? '#34d399' :
    p.$status === 'IN_PROGRESS' ? '#fbbf24' :
    p.$status === 'REVIEW'      ? '#818cf8' :
    'rgba(255,255,255,0.12)'
  };
  border-radius: 8px;
  padding: 12px 14px;
  transition: all 0.18s;

  &:hover {
    background: rgba(255,255,255,0.03);
    border-color: rgba(99,102,241,0.2);
    border-left-color: ${p =>
      p.$status === 'DONE'        ? '#34d399' :
      p.$status === 'IN_PROGRESS' ? '#fbbf24' :
      p.$status === 'REVIEW'      ? '#818cf8' :
      'rgba(99,102,241,0.35)'
    };
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .t-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 80px;

    .t-id  { font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: #fff; }
    .t-mod { font-family: var(--font-mono); font-size: 0.6rem; color: rgba(255,255,255,0.3); }
  }

  .t-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .t-title    { font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.4; }
    .t-assignee { font-size: 0.65rem; color: rgba(255,255,255,0.3); }
  }

  button { flex-shrink: 0; padding: 6px 12px; font-size: 0.67rem; }
`;

const LogConsole = styled.div`
  background: rgba(4, 6, 16, 0.8);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 14px;
  height: 230px;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 0.67rem;
  line-height: 1.75;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .log          { white-space: pre-wrap; word-break: break-all; }
  .log.success  { color: #34d399; }
  .log.info     { color: rgba(255,255,255,0.3); }
  .log.warning  { color: #fbbf24; }
  .log.error    { color: #f87171; }
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  text-align: left;

  th, td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  th {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.07em;
  }

  tbody tr {
    transition: background 0.15s;
    &:hover  { background: rgba(255,255,255,0.02); }
    &.top-row{ background: rgba(99,102,241,0.05); }
  }

  .mono   { font-family: var(--font-mono); }
  .bold   { font-weight: 700; }
  .white  { color: #ffffff; }
  .dim    { color: rgba(255,255,255,0.35); }
  .indigo { color: #818cf8; }
`;

const RolePill = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;

  &.lead   { border-color: rgba(99,102,241,0.35); color: #818cf8; }
  &.senior { border-color: rgba(139,92,246,0.35); color: #a78bfa; }
  &.member { border-color: rgba(255,255,255,0.1); }
  &.junior { border-color: rgba(251,191,36,0.3); color: #fbbf24; }
`;

const StatusPill = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid;
  letter-spacing: 0.04em;

  &.active   { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.25); }
  &.idle     { background: rgba(251,191,36,0.08); color: #fbbf24; border-color: rgba(251,191,36,0.25); }
  &.offline  { background: rgba(248,113,113,0.08); color: #f87171; border-color: rgba(248,113,113,0.25); }
  &.pending  { background: rgba(251,191,36,0.08); color: #fbbf24; border-color: rgba(251,191,36,0.25); }
  &.approved { background: rgba(52,211,153,0.08); color: #34d399; border-color: rgba(52,211,153,0.25); }
  &.rejected { background: rgba(248,113,113,0.08); color: #f87171; border-color: rgba(248,113,113,0.25); }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 4px;
`;

const ProjectItem = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(139,92,246,0.14);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;

  &:hover { border-color: rgba(139,92,246,0.3); transform: translateY(-2px); }

  .proj-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .proj-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
  }

  .proj-mid {
    display: flex;
    justify-content: space-between;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.35);
    font-family: var(--font-mono);
  }
`;

const PriorityBadge = styled.span`
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.04em;

  &.high   { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: #f87171; }
  &.medium { background: rgba(251,191,36,0.1);  border: 1px solid rgba(251,191,36,0.2);  color: #fbbf24; }
  &.low    { background: rgba(52,211,153,0.1);  border: 1px solid rgba(52,211,153,0.2);  color: #34d399; }
`;

const ProgressFill = styled.div<{ $level: number }>`
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${p => p.$level}%;
    background: ${p =>
      p.$level > 80 ? 'linear-gradient(90deg,#6366f1,#22d3ee)' :
      p.$level > 40 ? 'linear-gradient(90deg,#8b5cf6,#fbbf24)' :
      'linear-gradient(90deg,#f87171,#fb923c)'
    };
    border-radius: 10px;
    transition: width 0.4s ease;
  }
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 4px;
`;

const AppCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 3px solid #fbbf24;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); border-color: rgba(99, 102, 241, 0.25); }

  &.approved { border-left-color: #34d399; }
  &.rejected { border-left-color: #f87171; }

  .app-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .app-id   { font-family: var(--font-mono); font-size: 0.65rem; color: rgba(255,255,255,0.4); }
    .app-role { font-size: 0.62rem; color: #22d3ee; font-weight: 700; font-family: var(--font-mono); border: 1px solid rgba(34,211,238,0.25); padding: 2px 8px; border-radius: 20px; }
  }

  .app-info-block {
    display: flex;
    flex-direction: column;
    gap: 3px;

    .app-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
    .app-email { font-size: 0.65rem; color: rgba(255,255,255,0.35); font-family: var(--font-mono); }
  }

  .app-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .app-branch-sem { font-size: 0.65rem; color: rgba(255,255,255,0.35); font-family: var(--font-mono); }
  }

  .app-reason { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-style: italic; line-height: 1.5; margin: 0; }
`;



export default DeveloperDashboard;

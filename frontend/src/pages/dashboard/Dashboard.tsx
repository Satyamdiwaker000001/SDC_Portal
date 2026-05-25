import React, { useState } from 'react';
import styled from 'styled-components';
import { Terminal, ListTodo } from 'lucide-react';
import BunkerCard from '../../components/common/BunkerCard';
import CombatButton from '../../components/common/CombatButton';

interface Task {
  id: string;
  module: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW_PENDING' | 'DONE';
  assigned: string;
}

const initialTasks: Task[] = [
  { id: "TSK-109", module: "AUTH_GATEWAY", title: "Implement mock development bypass check", status: "DONE", assigned: "COMMANDER_SINCERE" },
  { id: "TSK-110", module: "WEBGL_CORE", title: "Render orbital ring rotation shaders", status: "IN_PROGRESS", assigned: "CYBER_GHOST" },
  { id: "TSK-111", module: "SOUND_ENGINE", title: "Integrate programmatic beep audio nodes", status: "DONE", assigned: "CYBER_GHOST" },
  { id: "TSK-112", module: "ROSTER_DATABASE", title: "Configure SQLite member queries and indexes", status: "TODO", assigned: "NET_WRANGLER" }
];

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const statuses: Task['status'][] = ['TODO', 'IN_PROGRESS', 'REVIEW_PENDING', 'DONE'];
        const nextIdx = (statuses.indexOf(t.status) + 1) % statuses.length;
        return { ...t, status: statuses[nextIdx] };
      }
      return t;
    }));
  };

  return (
    <DashboardGrid>
      {/* 1. Terminal Console Metrics */}
      <HeaderCard variant="cyan" label="METRICS: RESISTANCE_GRID">
        <div className="metrics-row">
          <MetricBox>
            <span className="label">ACTIVE_OPERATIVES</span>
            <span className="value cyan">3 / 3</span>
          </MetricBox>
          <MetricBox>
            <span className="label">UPLINK_EXPEDITIONS</span>
            <span className="value amber">2 Active</span>
          </MetricBox>
          <MetricBox>
            <span className="label">SYSTEMS_INTEGRITY</span>
            <span className="value cyan">94.2%</span>
          </MetricBox>
          <MetricBox>
            <span className="label">PENDING_INITIATES</span>
            <span className="value red">0 Pending</span>
          </MetricBox>
        </div>
      </HeaderCard>

      {/* 2. Quest Sub-routines / Tasks list */}
      <TaskListCard variant="cyan" label="SUBROUTINE_MISSIONS: ACTIVE_QUESTS">
        <div className="task-header">
          <ListTodo size={14} />
          <span>OPERATIONAL_SUBROUTINES_QUEUE:</span>
        </div>
        <div className="task-list">
          {tasks.map(task => (
            <TaskItem key={task.id} className={task.status.toLowerCase()}>
              <div className="task-meta">
                <span className="task-id">{task.id}</span>
                <span className="task-module">[{task.module}]</span>
              </div>
              <div className="task-body">
                <p className="task-title">{task.title}</p>
                <span className="task-assignee">ASSIGNEE: {task.assigned}</span>
              </div>
              <div className="task-actions">
                <CombatButton 
                  variant={task.status === 'DONE' ? 'cyan' : (task.status === 'IN_PROGRESS' ? 'amber' : 'red')} 
                  glow={false}
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  {task.status.replace('_', ' ')}
                </CombatButton>
              </div>
            </TaskItem>
          ))}
        </div>
      </TaskListCard>

      {/* 3. System Alerts Console Log */}
      <LogsCard variant="amber" label="ALERTS: DECRYPTION_TELEMETRY">
        <div className="log-header">
          <Terminal size={14} />
          <span>CONSOLE_OUTPUT_STREAM:</span>
        </div>
        <div className="log-console">
          <p className="log-line green">&gt; uvicorn app.main:app --reload</p>
          <p className="log-line info">&gt; INFO:     Will watch for changes in these directories: ['a:\\New project\\SDC_Portal\\backend']</p>
          <p className="log-line info">&gt; INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)</p>
          <p className="log-line green">&gt; db connection established successfully. active driver: SQLITE</p>
          <p className="log-line warning">&gt; WARNING:  skynet network probe detected. port override successful.</p>
          <p className="log-line danger">&gt; ALERT:    terminator drone patrol passed coordinate 34.05° N. shield remains active.</p>
        </div>
      </LogsCard>
    </DashboardGrid>
  );
};

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderCard = styled(BunkerCard)`
  grid-column: span 2;
  @media (max-width: 1000px) {
    grid-column: span 1;
  }

  .metrics-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 10px 0;
  }
`;

const MetricBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  min-width: 150px;

  .label {
    font-size: 0.55rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.1em;
  }

  .value {
    font-size: 1.4rem;
    font-weight: 900;
    font-family: var(--font-mono);
    
    &.cyan { color: var(--text-cyan); text-shadow: var(--hud-glow); }
    &.amber { color: var(--text-amber); text-shadow: var(--hud-glow-amber); }
    &.red { color: var(--text-red); text-shadow: var(--hud-glow-red); }
  }
`;

const TaskListCard = styled(BunkerCard)`
  .task-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    font-weight: bold;
    color: var(--text-cyan);
    margin-bottom: 16px;
    letter-spacing: 0.05em;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(5, 10, 18, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 4px;
  padding: 12px 16px;
  transition: all 0.2s ease;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  &:hover {
    border-color: rgba(0, 240, 255, 0.4);
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.05);
  }

  &.done {
    border-left: 3px solid var(--border-cyan);
  }
  &.in_progress {
    border-left: 3px solid var(--border-amber);
  }
  &.todo {
    border-left: 3px solid var(--text-dim);
  }
  &.review_pending {
    border-left: 3px solid var(--border-red);
  }

  .task-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;

    .task-id {
      font-size: 0.65rem;
      font-weight: 900;
      color: #ffffff;
    }
    .task-module {
      font-size: 0.5rem;
      color: var(--text-dim);
      font-weight: bold;
    }
  }

  .task-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .task-title {
      font-size: 0.75rem;
      color: var(--text-primary);
      line-height: 1.4;
    }
    .task-assignee {
      font-size: 0.55rem;
      color: var(--text-dim);
      font-weight: bold;
    }
  }

  .task-actions {
    flex-shrink: 0;
    .btn-inner {
      padding: 6px 12px;
      font-size: 0.6rem;
    }
  }
`;

const LogsCard = styled(BunkerCard)`
  .log-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.65rem;
    font-weight: bold;
    color: var(--text-amber);
    margin-bottom: 16px;
    letter-spacing: 0.05em;
  }

  .log-console {
    background: #03060a;
    border: 1px solid rgba(255, 170, 0, 0.15);
    border-radius: 4px;
    padding: 16px;
    height: 250px;
    overflow-y: auto;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .log-line {
      white-space: pre-wrap;
      word-break: break-all;
      &.green { color: var(--text-cyan); }
      &.info { color: var(--text-dim); }
      &.warning { color: var(--text-amber); }
      &.danger { color: var(--text-red); }
    }
  }
`;

export default Dashboard;

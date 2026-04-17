import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Target, 
  Zap, 
  ArrowUpRight, 
  Code,
  Rocket
} from 'lucide-react';

import { useSDCData } from '../../../hooks/useSDCData';
import FrostCard from '../../common/FrostCard';
import CyberButton from '../../common/CyberButton';
import PremiumBarChart from '../premium/PremiumBarChart';

const OverviewView: React.FC = () => {
  const { members, projects, applications } = useSDCData();
  
  const pendingApps = applications?.filter((a: any) => a?.status === 'PENDING')?.length || 0;
  const avgProgress = projects?.length > 0 
    ? Math.round(projects.reduce((acc: number, p: any) => acc + (p?.progress || 0), 0) / projects.length) 
    : 0;

  const stats = [
    { label: 'Active Projects', value: projects?.length || 0, trend: '+12%', icon: <Code size={20} />, color: '#0076e4' },
    { label: 'Pending Recruits', value: pendingApps, trend: 'URGENT', icon: <Zap size={20} />, color: '#ffd500' },
    { label: 'Project Velocity', value: `${avgProgress}%`, trend: '+5.2%', icon: <Rocket size={20} />, color: '#10B981' },
    { label: 'Total Members', value: members?.length || 0, trend: '+4', icon: <Users size={20} />, color: '#ffd500' },
  ];

  const chartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 70 },
    { name: 'Fri', value: 65 },
    { name: 'Sat', value: 40 },
    { name: 'Sun', value: 38 },
  ];

  return (
    <Container>
      <HeaderSection
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="title-block">
          <h1>COMMAND_OVERVIEW</h1>
          <p>Real-time system metrics and operational status</p>
        </div>
        <div className="actions">
          <CyberButton variant="secondary" size="sm" iconLeft={<Target size={14} />}>
            DEPLOY_OVR
          </CyberButton>
          <CyberButton variant="primary" size="sm">
            GENERATE_REPORT
          </CyberButton>
        </div>
      </HeaderSection>

      <StatsGrid>
        {stats.map((stat, i) => (
          <FrostCard key={i} elevation="medium" isHoverable isGlowing accentColor={stat.color}>
            <StatContent>
              <div className="stat-header">
                <div className="icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className={`trend ${stat.trend.includes('+') ? 'up' : 'neutral'}`}>
                  {stat.trend.includes('+') ? <ArrowUpRight size={14} /> : null}
                  {stat.trend}
                </div>
              </div>
              <div className="stat-body">
                <div className="label">{stat.label}</div>
                <div className="value">{stat.value}</div>
              </div>
            </StatContent>
          </FrostCard>
        ))}
      </StatsGrid>

      <MainGrid>
        <VisualsColumn>
          <FrostCard elevation="high">
            <PremiumBarChart 
              data={chartData} 
              title="DAILY_THROUGHPUT_MATRIX"
              height={320}
            />
          </FrostCard>
        </VisualsColumn>

        <IntelColumn>
          <FrostCard elevation="medium">
            <IntelHeader>
              <h3>LIVE_INTELLIGENCE</h3>
              <Activity size={16} className="pulse" />
            </IntelHeader>
            <IntelList>
              {[1, 2, 3, 4].map(idx => (
                <IntelItem key={idx}>
                  <div className="dot" />
                  <div className="content">
                    <div className="meta">09:{idx * 12} AM - SYSTEM_CORE</div>
                    <div className="text">Node_0{idx} successfully initialized operational parameters. Protocol stable.</div>
                  </div>
                </IntelItem>
              ))}
            </IntelList>
            <CyberButton variant="ghost" fullWidth style={{ marginTop: '20px' }}>
              VIEW_FULL_LOGS
            </CyberButton>
          </FrostCard>
        </IntelColumn>
      </MainGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  max-width: 1600px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 0; }
`;

const HeaderSection = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  h1 {
    font-size: var(--text-2xl);
    letter-spacing: 0.2em;
    color: var(--text-main);
    margin-bottom: 8px;
    font-family: var(--font-heading);
  }
  
  p {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .actions {
    display: flex;
    gap: 12px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
`;

const StatContent = styled.div`
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  .icon-box {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    
    &.up { color: #10B981; }
    &.neutral { color: var(--ui-accent); }
    &.down { color: #FB7185; }
  }

  .stat-body {
    .label {
      font-size: var(--text-xs);
      color: var(--text-dim);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .value {
      font-size: var(--text-3xl);
      font-family: var(--font-heading);
      color: var(--text-main);
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: var(--space-xl);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const VisualsColumn = styled.div``;

const IntelColumn = styled.div``;

const IntelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  
  h3 {
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    color: var(--text-main);
    font-family: var(--font-heading);
  }
  
  .pulse {
    color: var(--ui-accent);
    animation: pulse-glow 2s infinite;
  }
  
  @keyframes pulse-glow {
    0% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 2px var(--ui-accent)); }
    50% { opacity: 0.5; transform: scale(1.1); filter: drop-shadow(0 0 8px var(--ui-accent)); }
    100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 2px var(--ui-accent)); }
  }
`;

const IntelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const IntelItem = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: background 0.3s;
  
  &:hover {
    background: rgba(0, 118, 228, 0.05);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ui-accent);
    margin-top: 6px;
    flex-shrink: 0;
    box-shadow: 0 0 10px var(--ui-accent);
  }
  
  .content {
    .meta {
      font-family: var(--font-mono);
      font-size: 0.55rem;
      color: var(--text-dim);
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .text {
      font-size: 0.75rem;
      color: var(--text-main);
      line-height: 1.5;
      opacity: 0.8;
    }
  }
`;

export default OverviewView;

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendType, icon, color, delay = 0 }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="glow-overlay" style={{ '--glow-color': color } as any} />
      
      <Header>
        <IconBox color={color}>
          {icon}
        </IconBox>
        <TrendBadge type={trendType}>
          {trendType === 'positive' && <TrendingUp size={14} />}
          {trendType === 'negative' && <TrendingDown size={14} />}
          {trendType === 'neutral' && <AlertTriangle size={14} />}
          <span>{trend}</span>
        </TrendBadge>
      </Header>

      <Content>
        <Title>{title}</Title>
        <ValueBlock>
          <h2 className="value">{value}</h2>
          <div className="action-btn">
             <ArrowUpRight size={16} />
          </div>
        </ValueBlock>
      </Content>
      
      <DecoLine color={color} />
    </Card>
  );
};

/* --- STYLED COMPONENTS --- */

const Card = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: var(--border-glass);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .glow-overlay {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, var(--glow-color) 0%, transparent 70%);
    opacity: 0.03;
    pointer-events: none;
    transition: 0.3s;
  }

  &:hover .glow-overlay {
    opacity: 0.06;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconBox = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.color}15;
  border: 1px solid ${props => props.color}30;
  color: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px ${props => props.color}10;
`;

const TrendBadge = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: ${props => {
    if (props.type === 'positive') return 'rgba(52, 211, 153, 0.08)';
    if (props.type === 'negative') return 'rgba(251, 113, 131, 0.08)';
    return 'rgba(254, 215, 170, 0.08)';
  }};
  border: 1px solid ${props => {
    if (props.type === 'positive') return 'rgba(52, 211, 153, 0.15)';
    if (props.type === 'negative') return 'rgba(251, 113, 131, 0.15)';
    return 'rgba(254, 215, 170, 0.15)';
  }};
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 800;
  color: ${props => {
    if (props.type === 'positive') return 'var(--accent-success)';
    if (props.type === 'negative') return 'var(--accent-error)';
    return 'var(--accent-warning)';
  }};
  letter-spacing: 0.05em;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.span`
  font-family: var(--font-heading);
  font-size: 0.6rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 800;
`;

const ValueBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .value {
    font-family: var(--font-display);
    font-size: 1.6rem;
    margin: 0;
    letter-spacing: -0.05em;
    font-weight: 900;
  }

  .action-btn {
    width: 34px;
    height: 34px;
    background: ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'};
    border: 1px solid ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.3s;
    &:hover { 
      background: var(--accent-primary); 
      color: white; 
      border-color: var(--accent-primary); 
      transform: rotate(45deg); 
    }
  }
`;

const DecoLine = styled.div<{ color: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, ${props => props.color}, transparent);
  opacity: 0.2;
  animation: decoPulse 3s ease-in-out infinite;

  @keyframes decoPulse {
    0%, 100% { opacity: 0.1; transform: scaleX(0.8); }
    50% { opacity: 0.4; transform: scaleX(1); }
  }
`;

export default StatCard;

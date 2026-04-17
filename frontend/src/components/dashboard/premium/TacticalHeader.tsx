import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';

interface TacticalHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

const TacticalHeader: React.FC<TacticalHeaderProps> = ({ title, subtitle, actions }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="main-block">
        <div className="title-stack">
          <Title>{title}</Title>
          <Subtitle>
            <Zap size={10} className="flash" />
            {subtitle}
          </Subtitle>
        </div>
        
        <TelemetryStrip>
          <TelemetryItem>
            <Activity size={12} />
            <span>Security: Verified // Encryption: AES-256</span>
          </TelemetryItem>
          <TelemetryItem className="clock">
            <Clock size={12} />
            <span>Time Sync: {time}</span>
          </TelemetryItem>
        </TelemetryStrip>
      </div>

      {actions && (
        <ActionBlock>
           {actions}
        </ActionBlock>
      )}

      <HolographicBorder />
    </HeaderContainer>
  );
};

/* --- STYLED COMPONENTS --- */

const HeaderContainer = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 30px;
  margin-bottom: 20px;
  position: relative;
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  margin: 0;
  color: var(--text-main);
  text-transform: uppercase;
  background: linear-gradient(90deg, var(--text-main) 0%, var(--accent-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  margin-top: 6px;
  text-transform: uppercase;
  
  .flash {
    color: var(--accent-warning);
    animation: flash 1.5s infinite;
  }

  @keyframes flash {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

const TelemetryStrip = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 15px;
`;

const TelemetryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--accent-primary);
  opacity: 0.5;
  letter-spacing: 0.1em;
  
  &.clock {
    color: var(--accent-secondary);
  }
`;

const ActionBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const borderMove = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const HolographicBorder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(96, 165, 250, 0.2) 30%, 
    rgba(96, 165, 250, 0.4) 50%, 
    rgba(96, 165, 250, 0.2) 70%, 
    transparent 100%
  );
  background-size: 200% 100%;
  animation: ${borderMove} 4s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: 0 0 10px rgba(96, 165, 250, 0.1);
  }
`;

export default TacticalHeader;

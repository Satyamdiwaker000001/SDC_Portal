import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

interface TacticalFrameProps {
  children: React.ReactNode;
  statusColor?: string;
  delay?: number;
  onClick?: () => void;
  className?: string;
}

const TacticalFrame: React.FC<TacticalFrameProps> = ({ 
  children, 
  statusColor = 'var(--accent-primary)', 
  delay = 0,
  onClick,
  className
}) => {
  return (
    <FrameContainer
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      onClick={onClick}
      className={className}
      style={{ '--status-color': statusColor } as any}
    >
      <Scanline />
      <CornerTL />
      <CornerTR />
      <CornerBL />
      <CornerBR />
      
      <ContentZone>
        {children}
      </ContentZone>
      
      <GlowOverlay />
    </FrameContainer>
  );
};

/* --- STYLED COMPONENTS --- */

const scanMove = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const FrameContainer = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: var(--status-color);
  }
`;

const ContentZone = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.02) 50%,
    transparent 100%
  );
  height: 200%;
  pointer-events: none;
  z-index: 1;
  animation: ${scanMove} 8s linear infinite;
  opacity: 0.3;
`;

const Corner = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--status-color);
  border-style: solid;
  opacity: 0.2;
  pointer-events: none;
  z-index: 3;
`;

const CornerTL = styled(Corner)` top: 12px; left: 12px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; `;
const CornerTR = styled(Corner)` top: 12px; right: 12px; border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; `;
const CornerBL = styled(Corner)` bottom: 12px; left: 12px; border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; `;
const CornerBR = styled(Corner)` bottom: 12px; right: 12px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; `;

const GlowOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, var(--status-color) 0%, transparent 60%);
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
`;

export default TacticalFrame;

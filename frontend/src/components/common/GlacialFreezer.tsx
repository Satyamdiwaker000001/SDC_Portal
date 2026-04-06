import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const GlacialFreezer: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING_CORE");

  useEffect(() => {
    const statuses = [
      "ESTABLISHING_LINK", 
      "GATHERING_CRYSTAL_DATA", 
      "FORGING_MATRIX", 
      "UPLINK_COMPLETE"
    ];
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const statusInterval = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  return (
    <Container
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1.5 }}
    >
      {/* Cinematic Frost Layer */}
      <FrostLayer />
      
      <CenterBox>
        <ScannerLine 
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <Title
          initial={{ letterSpacing: '0.2em', opacity: 0 }}
          animate={{ letterSpacing: '1em', opacity: 1 }}
          transition={{ duration: 2 }}
        >
          SDC_PORTAL
        </Title>
        <ProgressBarContainer>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
        <Status>{status} // {progress}%</Status>
      </CenterBox>

      {/* Tactical HUD Corners */}
      <HUDCorner top left>
        <div className="line-h" />
        <div className="line-v" />
        <span>SECTOR: 001</span>
      </HUDCorner>
      <HUDCorner top right>
        <div className="line-h" />
        <div className="line-v" />
        <span>UPLINK: ACTIVE</span>
      </HUDCorner>
      <HUDCorner bottom left>
        <div className="line-h" />
        <div className="line-v" />
        <span>CORE: GLACIAL_V3</span>
      </HUDCorner>
      <HUDCorner bottom right>
        <div className="line-h" />
        <div className="line-v" />
        <span>LATENCY: 12ms</span>
      </HUDCorner>
    </Container>
  );
};

const Container = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 5000;
  background: var(--snow);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const FrostLayer = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(125, 226, 209, 0.1) 100%);
  border: 40px solid var(--snow); /* Acting as ice crawl edges */
  box-shadow: inset 0 0 100px rgba(125, 226, 209, 0.2);
  pointer-events: none;
`;

const CenterBox = styled.div`
  position: relative;
  text-align: center;
  z-index: 10;
`;

const ScannerLine = styled(motion.div)`
  position: absolute;
  left: -200px;
  right: -200px;
  height: 2px;
  background: var(--verdigris);
  box-shadow: 0 0 15px var(--pearl-aqua);
  z-index: 5;
  opacity: 0.5;
`;

const Title = styled(motion.h1)`
  font-family: var(--font-heading);
  font-size: 4rem;
  color: var(--onyx);
  font-weight: 300;
  margin-bottom: 20px;
`;

const ProgressBarContainer = styled.div`
  width: 400px;
  height: 4px;
  background: rgba(19, 21, 21, 0.05);
  margin: 0 auto;
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: var(--verdigris);
  transition: width 0.1s linear;
`;

const Status = styled.p`
  font-family: var(--font-heading);
  font-size: 0.7rem;
  color: var(--onyx);
  opacity: 0.4;
  margin-top: 15px;
  letter-spacing: 0.3em;
`;

const HUDCorner = styled.div<{ top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }>`
  position: absolute;
  width: 100px;
  height: 100px;
  ${props => props.top ? 'top: 50px;' : 'bottom: 50px;'}
  ${props => props.left ? 'left: 50px;' : 'right: 50px;'}
  opacity: 0.3;
  
  .line-h { width: 100%; height: 1px; background: var(--verdigris); }
  .line-v { width: 1px; height: 100%; background: var(--verdigris); position: absolute; top: 0; ${props => props.left ? 'left: 0;' : 'right: 0;'} }
  
  span {
    position: absolute;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: var(--onyx);
    font-family: var(--font-heading);
    ${props => props.top ? 'top: 110px;' : 'bottom: 110px;'}
    ${props => props.left ? 'left: 0;' : 'right: 0;'}
    white-space: nowrap;
  }
`;

export default GlacialFreezer;

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import sdcLogo from '../../assets/sdclogo.png';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const GlacialLoader: React.FC = () => {
  const [status, setStatus] = useState('INITIALIZING_SYSTEM...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const statusSequence = [
      { time: 1000, text: 'SCANNING_FROST_DATA...' },
      { time: 2000, text: 'ESTABLISHING_SECURE_LINK...' },
      { time: 3000, text: 'OPTIMIZING_INTERFACE...' },
      { time: 3800, text: 'READY' }
    ];

    statusSequence.forEach(s => {
      setTimeout(() => setStatus(s.text), s.time);
    });

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 35); // Approx 100% in 3.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <LoaderContainer
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <ContentBox>
        <LogoWrapper
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src={sdcLogo} alt="SDC" />
          <SpinnerOverlay />
        </LogoWrapper>

        <StatusText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {status}
        </StatusText>

        <ProgressContainer>
          <ProgressBar 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </ProgressContainer>

        <Percentage>
          {progress}%
        </Percentage>
      </ContentBox>
    </LoaderContainer>
  );
};

const LoaderContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000815;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, #00296b30 0%, transparent 70%);
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  position: relative;
  z-index: 1;
`;

const LogoWrapper = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 20px #0076e460);
  }
`;

const SpinnerOverlay = styled.div`
  position: absolute;
  inset: -20px;
  border: 1px solid rgba(255, 213, 0, 0.1);
  border-top: 1px solid #ffd500;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(0, 118, 228, 0.1);
    border-bottom: 1px solid #0076e4;
    border-radius: 50%;
    animation: ${rotate} 3s linear infinite reverse;
  }
`;

const StatusText = styled(motion.div)`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #ffd500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  height: 20px;
`;

const ProgressContainer = styled.div`
  width: 240px;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #0076e4, #ffd500);
  box-shadow: 0 0 10px #0076e4;
`;

const Percentage = styled.div`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
`;

export default GlacialLoader;

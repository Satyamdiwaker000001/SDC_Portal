import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import GlacialCore from './GlacialCore';

const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1200);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <IntroContainer
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.5, 
            filter: 'blur(40px)',
            transition: { duration: 1.5, ease: "easeIn" } 
          }}
        >
          {/* V2 3D Core - User's Preference */}
          <CanvasContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
              <GlacialCore />
            </Canvas>
          </CanvasContainer>

          <Content>
            <motion.div
              initial={{ letterSpacing: '0.5em', opacity: 0 }}
              animate={{ letterSpacing: '1.5em', opacity: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <Title>SDC FORGE</Title>
            </motion.div>
            <StatusText
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2, duration: 1 }}
            >
              UPLINK ESTABLISHED // SECTOR_001
            </StatusText>
          </Content>
        </IntroContainer>
      )}
    </AnimatePresence>
  );
};

const IntroContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 5000;
  background-color: #FFFAFB;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CanvasContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  pointer-events: none;
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2rem, 10vw, 6rem);
  color: var(--onyx);
  font-weight: 300;
  text-shadow: 0 0 20px rgba(125, 226, 209, 0.2);
`;

const StatusText = styled(motion.p)`
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  color: var(--onyx);
  font-family: var(--font-heading);
  margin-top: 20px;
`;

export default CinematicIntro;

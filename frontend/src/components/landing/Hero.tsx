import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import GlacialCore from './GlacialCore';
import CyberSnow from './CyberSnow';

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <CyberSnow />
      
      {/* Stable Glacial Core 3D Entrance */}
      <CanvasContainer
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
           <GlacialCore />
        </Canvas>
      </CanvasContainer>

      <HeroContent>
        <motion.div
           initial={{ letterSpacing: '0.2em', opacity: 0 }}
           animate={{ letterSpacing: '1em', opacity: 1 }}
           transition={{ duration: 2, delay: 0.5 }}
        >
          <HeroTitle>SDC FORGE</HeroTitle>
        </motion.div>
        
        <HeroSub
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          ENGINEERING_THE_FUTURE // WINTER_TECHNICAL_CORE
        </HeroSub>
        
        <div className="scroll-indicator" />
      </HeroContent>

      <TacticalHUD>
        <div className="sector">SECTOR: 001_A</div>
        <div className="uplink">UPLINK_READY</div>
      </TacticalHUD>
    </HeroSection>
  );
};

const HeroSection = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--snow);
`;

const CanvasContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  pointer-events: none;
  
  .scroll-indicator {
    width: 1px;
    height: 100px;
    background: linear-gradient(to bottom, var(--verdigris), transparent);
    margin: 50px auto 0;
  }
`;

const HeroTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 7rem);
  color: var(--onyx);
  font-weight: 300;
  text-shadow: 0 0 20px rgba(125, 226, 209, 0.2);
`;

const HeroSub = styled(motion.p)`
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  color: var(--onyx);
  margin-top: 15px;
`;

const TacticalHUD = styled.div`
  position: absolute;
  bottom: 40px;
  left: 5%;
  right: 5%;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-heading);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  color: var(--onyx);
  opacity: 0.3;
  z-index: 10;
`;

export default Hero;

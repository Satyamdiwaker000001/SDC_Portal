import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import GamingButton from '../components/common/GamingButton';
import CyberSnow from '../components/landing/CyberSnow';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  team: string;
  operatives: { name: string; role: string }[];
}

const HeroShowcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/projects/public/showcase')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Showcase Link Failure", err));
  }, []);

  const next = () => setIndex(prev => (prev + 1) % projects.length);
  const prev = () => setIndex(prev => (prev - 1 + projects.length) % projects.length);

  return (
    <MainWrapper>
      <CyberSnow />
      
      <AnimatePresence mode="wait">
        {projects[index] && (
          <Slide
            key={projects[index].id}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <ContentLayer>
              <TypeTag>MISSION_MODULE // {projects[index].type}</TypeTag>
              <ProjectTitle>{projects[index].name}</ProjectTitle>
              <Description>{projects[index].description}</Description>
              
              <TeamInfo>
                 <div className="unit-label">UNIT {projects[index].team}</div>
                 <div className="operatives">
                    {projects[index].operatives.map((op, i) => (
                      <span key={i}>{op.name} // </span>
                    ))}
                 </div>
              </TeamInfo>

              <div style={{ marginTop: '40px' }}>
                <GamingButton label="INITIALIZE_LINK" />
              </div>
            </ContentLayer>

            <VisualLayer>
               <IceCore 
                 animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               />
            </VisualLayer>
          </Slide>
        )}
      </AnimatePresence>

      <NavHUD>
        <button onClick={prev}>PREV_LINK</button>
        <Counter>{index + 1} / {projects.length}</Counter>
        <button onClick={next}>NEXT_LINK</button>
      </NavHUD>

      <StatusHUD>
        <span>STATUS: GLACIAL_OPTIMIZED</span>
        <span>LATENCY: 0.4s</span>
      </StatusHUD>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: var(--snow);
  overflow: hidden;
  position: relative;
`;

const Slide = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  padding: 0 10%;
  align-items: center;
  z-index: 2;
  background: radial-gradient(circle at 60% 50%, rgba(125, 226, 209, 0.05) 0%, transparent 70%);
`;

const ContentLayer = styled.div`
  flex: 1.2;
  z-index: 5;
`;

const VisualLayer = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IceCore = styled(motion.div)`
  width: 300px;
  height: 300px;
  border: 1px solid rgba(125, 226, 209, 0.4);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  rotate: 45deg;
  box-shadow: 
    0 0 40px rgba(125, 226, 209, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.5);
`;

const TypeTag = styled.div`
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  color: var(--pearl-aqua);
  margin-bottom: 20px;
`;

const ProjectTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 6rem);
  color: var(--onyx);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 30px;
`;

const Description = styled.p`
  max-width: 500px;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--onyx);
  opacity: 0.6;
  margin-bottom: 40px;
`;

const TeamInfo = styled.div`
  .unit-label { font-family: var(--font-heading); font-size: 0.7rem; color: var(--onyx); opacity: 0.3; margin-bottom: 10px; letter-spacing: 0.2em; }
  .operatives { font-size: 0.85rem; color: var(--onyx); opacity: 0.7; font-weight: 400; }
`;

const NavHUD = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 50px;
  z-index: 100;
  
  button {
    background: transparent;
    border: none;
    font-family: var(--font-heading);
    color: var(--onyx);
    letter-spacing: 0.3em;
    font-size: 0.6rem;
    cursor: pointer;
    opacity: 0.4;
    transition: 0.3s;
    &:hover { opacity: 1; color: var(--pearl-aqua); }
  }
`;

const Counter = styled.div`
  font-family: var(--font-heading);
  font-size: 0.8rem;
  opacity: 0.2;
  letter-spacing: 0.2em;
`;

const StatusHUD = styled.div`
  position: absolute;
  top: 50px;
  right: 10%;
  display: flex;
  gap: 40px;
  font-family: var(--font-heading);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  opacity: 0.3;
  color: var(--onyx);
`;

export default HeroShowcase;

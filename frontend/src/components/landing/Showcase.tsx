import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FrostCard from '../common/FrostCard';
import GamingButton from '../common/GamingButton';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  team: string;
  operatives: { name: string; role: string }[];
}

const Showcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/projects/public/showcase')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Showcase Failure", err));
  }, []);

  const next = () => setIndex(prev => (prev + 1) % projects.length);
  const prev = () => setIndex(prev => (prev - 1 + projects.length) % projects.length);

  return (
    <ShowcaseSection>
      <AnimatePresence mode="wait">
        {projects[index] && (
          <Slide
            key={projects[index].id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <FrostCard 
              title={projects[index].name}
              type={projects[index].type}
              team={`UNIT_${projects[index].team}`}
              desc={projects[index].description || "Data Encrypted."}
            >
               <GamingButton label="INITIALIZE" />
            </FrostCard>
          </Slide>
        )}
      </AnimatePresence>

      <NavHUD>
        <HUDButton onClick={prev}>PREV_LINK</HUDButton>
        <Counter>{index + 1} / {projects.length}</Counter>
        <HUDButton onClick={next}>NEXT_LINK</HUDButton>
      </NavHUD>
    </ShowcaseSection>
  );
};

const ShowcaseSection = styled.section`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: var(--snow);
  z-index: 5;
`;

const Slide = styled(motion.div)`
  width: 600px;
  z-index: 10;
`;

const NavHUD = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 50px;
`;

const HUDButton = styled.button`
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
`;

const Counter = styled.div`
  font-family: var(--font-heading);
  font-size: 0.8rem;
  opacity: 0.2;
  letter-spacing: 0.2em;
  color: var(--onyx);
`;

export default Showcase;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import GamingButton from '../components/GamingButton';
import FrostCard from '../components/FrostCard';
import CyberSnow from '../components/CyberSnow';

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  team: string;
  operatives: { name: string; role: string }[];
}

const PublicShowcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/projects/public/showcase')
      .then(res => setProjects(res.data))
      .catch(err => console.error("Uplink Failure:", err));
  }, []);

  return (
    <ShowcaseWrapper>
      <CyberSnow />
      
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Logo>SDC_CORE</Logo>
        <Nav>
          <span>MISSION_LOGS</span>
          <span>OPERATIVES</span>
          <span>ENLIST</span>
        </Nav>
      </Header>

      <HeroSection style={{ y: y1 }}>
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.8em' }}
          transition={{ duration: 2 }}
        >
          <HeroTitle>GLACIAL FORGE</HeroTitle>
        </motion.div>
        <HeroSub>ENGINEERING THE FUTURE IN ICE AND LIGHT.</HeroSub>
        <div className="scroll-indicator" />
      </HeroSection>

      <ProjectGrid>
        {projects.map((project, index) => (
          <FrostCard
            key={project.id}
            title={project.name}
            type={project.type}
            team={`UNIT ${project.team}`}
            desc={project.description || "Transmission encrypted."}
          >
            <GamingButton label="ACCESS MODULE" />
          </FrostCard>
        ))}

        {projects.length === 0 && (
          <EmptyState>
            <h3>SCANNING FOR ACTIVE MODULES...</h3>
            <div className="pulse-line" />
          </EmptyState>
        )}
      </ProjectGrid>

      <Footer>
        <span>STATUS: OPERATIONAL</span>
        <span>LOCATION: Glacial_Sector_001</span>
        <span>© 2026 SDC PORTAL</span>
      </Footer>
    </ShowcaseWrapper>
  );
};

const ShowcaseWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--snow);
  position: relative;
  overflow-x: hidden;
`;

const Header = styled(motion.header)`
  height: 80px;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(51, 153, 137, 0.1);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.2rem;
  letter-spacing: 0.3em;
  color: var(--onyx);
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  
  span {
    cursor: pointer;
    transition: color 0.3s;
    &:hover { color: var(--verdigris); }
  }
`;

const HeroSection = styled(motion.div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
  position: relative;
  
  .scroll-indicator {
    position: absolute;
    bottom: 50px;
    width: 1px;
    height: 100px;
    background: linear-gradient(to bottom, var(--verdigris), transparent);
  }
`;

const HeroTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 8rem);
  color: var(--onyx);
  font-weight: 400;
`;

const HeroSub = styled.p`
  margin-top: 20px;
  font-size: 0.8rem;
  letter-spacing: 0.4em;
  color: var(--onyx);
  opacity: 0.4;
`;

const ProjectGrid = styled.div`
  padding: 0 5% 100px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 50px;
  position: relative;
  z-index: 2;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 100px;
  text-align: center;
  border: 1px solid rgba(125, 226, 209, 0.2);
  
  h3 { font-size: 0.8rem; letter-spacing: 0.3em; opacity: 0.5; }
  .pulse-line {
    width: 300px;
    height: 1px;
    background: var(--pearl-aqua);
    margin: 20px auto;
    animation: pulse 2s infinite ease-in-out;
  }
  @keyframes pulse { 0% { opacity: 0.1; transform: scaleX(0.5); } 50% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0.1; transform: scaleX(0.5); } }
`;

const Footer = styled.footer`
  padding: 50px 5%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,0.05);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--onyx);
  opacity: 0.3;
`;

export default PublicShowcase;

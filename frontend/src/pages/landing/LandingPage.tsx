import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Cpu, Layers, ArrowRight } from 'lucide-react';
import api from '../../services/api';

import Navbar from '../../components/layout/Navbar';
import Founders from '../../components/landing/Founders';
import Developers from '../../components/landing/Developers';
import RecruitmentSection from '../../components/landing/RecruitmentSection';
import GlobalOperationsTerminal from '../../components/landing/GlobalOperationsTerminal';
import FrostCard from '../../components/common/FrostCard';
import CyberButton from '../../components/common/CyberButton';

const LandingPage: React.FC = () => {
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkRecruitment = async () => {
      try {
        const res = await api.get('/applications/status');
        setIsRecruitmentOpen(res.data.isOpen);
      } catch (err) {
        console.error('Failed to check recruitment status', err);
      }
    };
    checkRecruitment();
  }, []);

  const sectionReveal = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      
      {/* HERO_SECTION */}
      <HeroSection>
         <GlobalOperationsTerminal />
      </HeroSection>
      
      <MainContent>
        {/* CORE_MISSION */}
        <ContentSection 
          id="about" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionReveal}
        >
          <div className="container">
            <SectionHeader>
              <span className="sid">DIRECTIVE_01 // ARCHITECTURE</span>
              <h2>Engineering Stability</h2>
              <div className="glow-bar" />
            </SectionHeader>
            
            <MissionGrid>
              <div className="text-col">
                <p className="lead">
                  The Software Development Cell is an elite technical unit forging high-stability systems. 
                  We operate at the frontier of production engineering, security, and human-centric design.
                </p>
                <div className="action-row">
                  <CyberButton variant="primary">EXPLORE_MANIFESTO</CyberButton>
                  <CyberButton variant="ghost" iconRight={<ArrowRight size={14} />}>VIEW_CORE_TECH</CyberButton>
                </div>
              </div>

              <FeaturesGrid>
                <FrostCard isGlowing accentColor="#0076e4">
                  <FeatureItem>
                    <div className="f-icon"><Shield size={24} /></div>
                    <h3>Global Reliability</h3>
                    <p>Engineering production-grade systems for thousands. Reliability is our primary directive.</p>
                  </FeatureItem>
                </FrostCard>
                <FrostCard isGlowing accentColor="#ffd500">
                  <FeatureItem>
                    <div className="f-icon"><Cpu size={24} /></div>
                    <h3>Core Infrastructure</h3>
                    <p>Specializing in scalable full-stack architectures and secure operations for modern enterprises.</p>
                  </FeatureItem>
                </FrostCard>
                <FrostCard isGlowing accentColor="#10B981">
                  <FeatureItem>
                    <div className="f-icon"><Layers size={24} /></div>
                    <h3>Technical Vanguard</h3>
                    <p>A syndicate of top-tier architects and veteran alumni agents operating in perfect synchronicity.</p>
                  </FeatureItem>
                </FrostCard>
              </FeaturesGrid>
            </MissionGrid>
          </div>
        </ContentSection>

        {/* LEADERSHIP_SECTION */}
        <ContentSection 
          id="vanguard"
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionReveal}
        >
           <div className="container">
              <SectionHeader>
                 <span className="sid">DOSSIER_02 // LEADERSHIP</span>
                 <h2>Command Center</h2>
                 <div className="glow-bar" style={{ background: 'var(--ui-primary)' }} />
              </SectionHeader>
              <Founders />
           </div>
        </ContentSection>

        {/* DEVELOPERS_SECTION */}
        <ContentSection 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionReveal}
        >
           <div className="container">
              <SectionHeader>
                 <span className="sid">CORPS_03 // OPERATIVES</span>
                 <h2>Development Corps</h2>
                 <div className="glow-bar" style={{ background: 'var(--ui-accent)' }} />
              </SectionHeader>
              <Developers />
           </div>
        </ContentSection>

        {/* RECRUITMENT_SECTION */}
        {isRecruitmentOpen && (
          <ContentSection 
            id="recruitment" 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionReveal}
          >
            <div className="container">
              <SectionHeader>
                 <span className="sid">GATE_04 // ENLISTMENT</span>
                 <h2>Join the Syndicate</h2>
                 <div className="glow-bar" style={{ background: '#10B981' }} />
              </SectionHeader>
              <FrostCard elevation="high">
                <RecruitmentSection />
              </FrostCard>
            </div>
          </ContentSection>
        )}
      </MainContent>
      
      <EliteFooter>
        <div className="container">
           <div className="f-top">
              <div className="f-brand">
                 <h2>SDC_CENTRAL</h2>
                 <p>ARCHITECTURAL VANGUARD DEPLOYED. ALL SYSTEMS OPTIMIZED.</p>
              </div>
              <div className="f-nav">
                 <div className="f-col">
                    <h4>MISSION</h4>
                    <a href="#about">Philosophy</a>
                    <a href="#recruitment">Enlistment</a>
                 </div>
                 <div className="f-col">
                    <h4>SYSTEMS</h4>
                    <a href="/login">Command Access</a>
                    <a href="/">Public Archive</a>
                 </div>
              </div>
           </div>
           <div className="f-bottom">
              <div className="f-copy">© 2026 SOFTWARE DEVELOPMENT CELL // PORTAL v2.5</div>
              <div className="f-status">
                 <div className="led" /> CORE_INTERFACE_STABLE // ARCH_ACTIVE
              </div>
           </div>
        </div>
      </EliteFooter>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  width: 100%;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 160px;
  padding: 120px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%; left: 0;
    width: 100%; height: 600px;
    background: radial-gradient(circle at 0% 50%, var(--ui-primary)10 0%, transparent 70%);
    pointer-events: none;
  }
`;

const ContentSection = styled(motion.section)`
  position: relative;
  z-index: 2;
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .sid {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--ui-primary);
    font-weight: 800;
    letter-spacing: 0.3em;
    margin-bottom: 20px;
  }
  
  h2 {
    font-family: var(--font-heading);
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 30px;
    letter-spacing: -0.02em;
    color: var(--text-main);
    @media (max-width: 768px) { font-size: 2.5rem; }
  }

  .glow-bar {
    width: 80px;
    height: 4px;
    background: var(--ui-accent);
    box-shadow: 0 0 15px currentColor;
    border-radius: 2px;
  }
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  
  .text-col {
    .lead {
      font-size: 1.5rem;
      line-height: 1.6;
      color: var(--text-dim);
      margin-bottom: 48px;
      font-weight: 500;
    }
    .action-row {
      display: flex;
      gap: 24px;
    }
  }
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

const FeaturesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FeatureItem = styled.div`
  .f-icon {
    color: inherit;
    margin-bottom: 20px;
    opacity: 0.8;
  }
  h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 12px;
  }
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-dim);
  }
`;

const EliteFooter = styled.footer`
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  padding: 120px 0 60px;
  border-top: var(--border-glass);
  
  .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
  
  .f-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 100px;
    
    .f-brand {
      h2 { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; }
      p { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); margin-top: 15px; letter-spacing: 0.15em; font-weight: 700; }
    }
    
    .f-nav {
      display: flex;
      gap: 120px;
      .f-col {
        display: flex; flex-direction: column; gap: 20px;
        h4 { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
        a { text-decoration: none; color: var(--text-dim); font-size: 0.9rem; font-weight: 600; transition: color 0.3s; &:hover { color: var(--ui-primary); } }
      }
    }
  }
  
  .f-bottom {
    display: flex;
    justify-content: space-between;
    padding-top: 40px;
    border-top: var(--border-glass);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    font-weight: 700;
    letter-spacing: 0.1em;
    
    .f-status {
      display: flex; align-items: center; gap: 12px;
      .led { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 10px #10B981; }
    }
  }
  
  @media (max-width: 992px) {
    .f-top { flex-direction: column; gap: 80px; }
    .f-nav { flex-direction: column; gap: 40px; }
  }
`;

export default LandingPage;

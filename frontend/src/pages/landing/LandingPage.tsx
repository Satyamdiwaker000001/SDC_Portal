import React from 'react';
import styled from 'styled-components';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/landing/Hero';
import Showcase from '../../components/landing/Showcase';
import Snowfall from '../../components/landing/Snowfall';

const LandingPage: React.FC = () => {
  return (
    <PageWrapper>
      <Navbar />
      <Snowfall />
      
      <Hero />
      <Showcase />
      
      <Footer>
        <span>STATUS: GLACIAL_OPTIMIZED</span>
        <span>LOCATION: Glacial_Sector_001</span>
        <span>© 2026 SDC PORTAL</span>
      </Footer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: var(--snow);
  position: relative;
  overflow-x: hidden;
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
  background: var(--snow);
  position: relative;
  z-index: 10;
`;

export default LandingPage;

import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import sdcLogo from '../../assets/sdclogo.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }} 
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <div className="nav-container">
        <LogoLink to="/">
          <LogoWrapper>
            <img src={sdcLogo} alt="SDC" />
            <div className="brand-intel">
              <span className="name">SDC_CENTRAL</span>
              <span className="ver">STABLE_V2.5</span>
            </div>
          </LogoWrapper>
        </LogoLink>

        <NavLinksSection>
          <NavList>
            <NavAction href="#about">SYSTEM_PHILOSOPHY</NavAction>
            <NavAction href="#vanguard">OPERATIVES</NavAction>
            <NavAction href="#recruitment">ENLISTMENT</NavAction>
          </NavList>
          
          <AuthCluster>
            <DashboardBtn onClick={() => navigate('/login')}>
              <Hexagon size={16} className="deco" />
              <span>COMMAND_ACCESS</span>
            </DashboardBtn>
          </AuthCluster>
        </NavLinksSection>
      </div>
    </Nav>
  );
};

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 80px;
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  border-bottom: var(--border-glass);
  z-index: 2000;
  display: flex;
  align-items: center;
  
  .nav-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  img {
    height: 48px;
    filter: drop-shadow(0 0 10px rgba(0, 118, 228, 0.3));
  }
  
  .brand-intel {
    display: flex;
    flex-direction: column;
    .name {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: 0.1em;
    }
    .ver {
      font-family: var(--font-mono);
      font-size: 0.55rem;
      color: var(--ui-primary);
      font-weight: 700;
      letter-spacing: 0.2em;
    }
  }
`;

const NavLinksSection = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  
  @media (max-width: 1024px) { display: none; }
`;

const NavList = styled.div`
  display: flex;
  gap: 40px;
`;

const NavAction = styled.a`
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--text-dim);
  text-decoration: none;
  letter-spacing: 0.15em;
  transition: all 0.3s;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--ui-accent);
    transition: width 0.3s;
  }
  
  &:hover {
    color: var(--ui-accent);
    text-shadow: 0 0 8px rgba(255, 213, 0, 0.3);
    &::after { width: 100%; }
  }
`;

const AuthCluster = styled.div``;

const DashboardBtn = styled.button`
  background: var(--bg-card);
  border: 1px solid var(--ui-primary);
  color: var(--ui-primary);
  padding: 10px 24px;
  border-radius: 8px;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  
  .deco {
    color: var(--ui-accent);
    transition: transform 0.5s;
  }
  
  &:hover {
    background: var(--ui-primary);
    color: white;
    border-color: var(--ui-primary);
    box-shadow: 0 4px 20px rgba(0, 41, 107, 0.4);
    .deco { transform: rotate(180deg); color: white; }
  }
`;

export default Navbar;

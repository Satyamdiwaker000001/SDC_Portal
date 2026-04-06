import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GamingButton from '../common/GamingButton';
import sdcLogo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  return (
    <NavContainer
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <LogoContainer>
        <img src={sdcLogo} alt="SDC Logo" className="logo-img" />
        <div className="pulse-indicator" />
      </LogoContainer>

      <NavLinks>
        <NavLink whileHover={{ scale: 1.1, color: "var(--verdigris)" }}>SHOWCASE</NavLink>
        <NavLink whileHover={{ scale: 1.1, color: "var(--verdigris)" }}>OPERATIVES</NavLink>
        <NavLink whileHover={{ scale: 1.1, color: "var(--verdigris)" }}>APPLICATIONS</NavLink>
      </NavLinks>

      <ActionArea>
        <div className="status-badge">UPLINK_STABLE</div>
        <GamingButton label="LOGIN" onClick={() => console.log("Login Initiated")} />
      </ActionArea>
    </NavContainer>
  );
};

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 20px;
  left: 5%;
  right: 5%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: rgba(255, 250, 251, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(125, 226, 209, 0.2);
  border-radius: 99px;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(19, 21, 21, 0.05);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .logo-img {
    height: 96px;
    width: auto;
    /* Clean & Seamless integration - No artificial borders or hovers */
    transition: opacity 0.3s ease;
    opacity: 0.9;
    
    &:hover {
      opacity: 1;
    }
  }

  .pulse-indicator {
    width: 8px;
    height: 8px;
    background: var(--pearl-aqua);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--pearl-aqua);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
`;

const NavLink = styled(motion.span)`
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--onyx);
  cursor: pointer;
  transition: color 0.3s;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  
  .status-badge {
    font-size: 0.6rem;
    letter-spacing: 0.4em;
    color: var(--onyx);
    opacity: 0.3;
    font-family: var(--font-heading);
  }
`;

export default Navbar;

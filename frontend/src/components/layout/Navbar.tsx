import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Menu } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('HOME');
  const { playClick, playHover } = useSound();

  const handleTabClick = (tabName: string, sectionId: string) => {
    setActiveTab(tabName);
    playClick();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavWrapper>
      {/* SDC Logo */}
      <LogoContainer onMouseEnter={playHover} onClick={() => window.location.href = '/'}>
        <div className="logo-outer">
          <div className="logo-inner" />
        </div>
        <span className="logo-text">SDC // PORTAL</span>
      </LogoContainer>

      {/* Centered Navigation */}
      <NavLinks>
        <TabButton
          className={activeTab === 'HOME' ? 'active' : ''}
          onClick={() => handleTabClick('HOME', 'home')}
          onMouseEnter={playHover}
        >
          HOME
        </TabButton>
        <TabButton
          className={activeTab === 'FOUNDERS' ? 'active' : ''}
          onClick={() => handleTabClick('FOUNDERS', 'founders')}
          onMouseEnter={playHover}
        >
          FOUNDERS
        </TabButton>
        <TabButton
          className={activeTab === 'DEVELOPERS' ? 'active' : ''}
          onClick={() => handleTabClick('DEVELOPERS', 'developers')}
          onMouseEnter={playHover}
        >
          DEVELOPERS
        </TabButton>
      </NavLinks>

      {/* Right Actions */}
      <NavActions>
        <IconButton
          onClick={() => { playClick(); window.location.href = '/login'; }}
          onMouseEnter={playHover}
          title="Portal Login"
        >
          <User size={18} />
          <span className="login-txt">PORTAL LOGIN</span>
        </IconButton>
        <IconButton onClick={playClick} onMouseEnter={playHover} title="Main Menu" className="menu-btn">
          <Menu size={18} />
        </IconButton>
      </NavActions>
    </NavWrapper>
  );
};

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #050a11;
  border-bottom: 1px solid rgba(0, 229, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(3, 6, 10, 0.6);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  .logo-outer {
    width: 26px;
    height: 26px;
    border: 2px solid #00e5ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  }

  .logo-inner {
    width: 10px;
    height: 10px;
    border: 1.5px solid #00e5ff;
    border-radius: 50%;
    background: rgba(0, 229, 255, 0.2);
  }

  .logo-text {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.08em;
    text-shadow: 0 0 6px rgba(0, 229, 255, 0.35);

    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  height: 100%;
  align-items: center;

  @media (max-width: 600px) {
    gap: 16px;
  }
`;

const TabButton = styled.div`
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  padding: 18px 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }

  &.active {
    color: #00e5ff;
    border-bottom: 2px solid #00e5ff;
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.div`
  cursor: pointer;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.1);
  background: rgba(0, 229, 255, 0.02);
  transition: all 0.2s ease;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: bold;

  &:hover {
    color: #00e5ff;
    background: rgba(0, 229, 255, 0.05);
    border-color: rgba(0, 229, 255, 0.25);
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.15);
  }

  &.menu-btn {
    display: none;
    padding: 6px;
    border-radius: 50%;

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .login-txt {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export default Navbar;

import React from 'react';
import styled from 'styled-components';
import ResistanceNavbar from './ResistanceNavbar';

interface ResistanceHUDProps {
  children: React.ReactNode;
}

const ResistanceHUD: React.FC<ResistanceHUDProps> = ({ children }) => {
  return (
    <HUDContainer>
      <ResistanceNavbar />
      
      {/* Sleek Technical Side Borders (Non-Game, Corporate Style) */}
      <SideBorderLeft className="hud-decor">
        <div className="vertical-label">
          <span className="line" />
          <span className="text">SOFTWARE_DEVELOPMENT_CELL // PORTAL_v1.0</span>
        </div>
      </SideBorderLeft>

      <SideBorderRight className="hud-decor">
        <div className="vertical-label">
          <span className="text">BUILD_TOGETHER // GROW_TOGETHER</span>
          <span className="line" />
        </div>
      </SideBorderRight>

      {/* Main content wrapper */}
      <ContentWrapper>{children}</ContentWrapper>
    </HUDContainer>
  );
};

const HUDContainer = styled.div`
  min-height: 100vh;
  position: relative;
  background: #040910;
  overflow-x: hidden;
`;

const ContentWrapper = styled.main`
  padding-top: 60px; /* navbar offset */
  position: relative;
  z-index: 10;
`;

const SideBorderLeft = styled.div`
  position: fixed;
  left: 20px;
  top: 100px;
  bottom: 60px;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 50;
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-dim);
  opacity: 0.45;

  @media (max-width: 1200px) {
    display: none;
  }

  .vertical-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    height: 100%;
    
    .line {
      width: 1px;
      flex-grow: 1;
      background: linear-gradient(to bottom, var(--border-cyan) 0%, transparent 100%);
    }

    .text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      letter-spacing: 0.15em;
      font-weight: 700;
    }
  }
`;

const SideBorderRight = styled.div`
  position: fixed;
  right: 20px;
  top: 100px;
  bottom: 60px;
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 50;
  pointer-events: none;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  color: var(--text-dim);
  opacity: 0.45;

  @media (max-width: 1200px) {
    display: none;
  }

  .vertical-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    height: 100%;
    
    .line {
      width: 1px;
      flex-grow: 1;
      background: linear-gradient(to bottom, transparent 0%, var(--border-cyan) 100%);
    }

    .text {
      writing-mode: vertical-rl;
      letter-spacing: 0.15em;
      font-weight: 700;
    }
  }
`;

export default ResistanceHUD;

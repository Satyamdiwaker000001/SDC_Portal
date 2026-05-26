import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />

      {/* Subtle side decorations */}
      <SideBorderLeft>
        <div className="vertical-label">
          <span className="line" />
          <span className="text">SOFTWARE_DEVELOPMENT_CELL // PORTAL_v1.0</span>
        </div>
      </SideBorderLeft>

      <SideBorderRight>
        <div className="vertical-label">
          <span className="text">BUILD_TOGETHER // GROW_TOGETHER</span>
          <span className="line" />
        </div>
      </SideBorderRight>

      <ContentWrapper>{children}</ContentWrapper>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  position: relative;
  background: #040910;
  overflow-x: hidden;
`;

const ContentWrapper = styled.main`
  padding-top: 60px;
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

export default SiteLayout;

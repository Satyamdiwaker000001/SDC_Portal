import React from 'react';
import styled from 'styled-components';
import { Mail, ArrowUp } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const SdcFooter: React.FC = () => {
  const { playClick, playHover } = useSound();

  const handleScrollTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterTop>
          <FooterBrand onMouseEnter={playHover}>
            <LogoIcon>
              <div className="logo-dot" />
            </LogoIcon>
            <div className="brand-text">
              <span className="title">SOFTWARE DEVELOPMENT CELL</span>
              <span className="tag">Build Together. Grow Together. Lead Tomorrow.</span>
            </div>
          </FooterBrand>

          <SocialLinks>
            <SocialIcon 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              title="GitHub Organization"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </SocialIcon>
            <SocialIcon 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              title="LinkedIn Page"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </SocialIcon>
            <SocialIcon 
              href="mailto:sdc@college.edu" 
              onClick={playClick}
              onMouseEnter={playHover}
              title="Email Inquiry"
            >
              <Mail size={16} />
            </SocialIcon>
          </SocialLinks>
        </FooterTop>

        <FooterDivider />

        <FooterBottom>
          <div className="copyright">
            <span>© 2026 SDC_PORTAL // ALL_RIGHTS_RESERVED</span>
          </div>

          <FooterNav>
            <span className="nav-link" onClick={() => { playClick(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>HOME</span>
            <span className="nav-link" onClick={() => { playClick(); document.getElementById('founders')?.scrollIntoView({ behavior: 'smooth' }); }}>FOUNDERS</span>
            <span className="nav-link" onClick={() => { playClick(); document.getElementById('developers')?.scrollIntoView({ behavior: 'smooth' }); }}>DEVELOPERS</span>
          </FooterNav>

          <ScrollTopBtn onClick={handleScrollTop} onMouseEnter={playHover} title="Scroll to top">
            <ArrowUp size={14} />
          </ScrollTopBtn>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  width: 100%;
  background: #03060a;
  border-top: 1px solid rgba(0, 229, 255, 0.12);
  padding: 40px 0;
  position: relative;
  z-index: 50;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.05em;
      text-shadow: 0 0 6px rgba(0, 229, 255, 0.3);
    }

    .tag {
      font-family: var(--font-mono);
      font-size: 0.55rem;
      color: var(--text-dim);
      letter-spacing: 0.05em;
    }
  }
`;

const LogoIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #00e5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);

  .logo-dot {
    width: 6px;
    height: 6px;
    background: #00e5ff;
    border-radius: 50%;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.15);
  background: rgba(5, 10, 18, 0.4);
  color: var(--text-dim);
  transition: all 0.2s ease;

  &:hover {
    color: #00e5ff;
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.05);
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.15);
  }
`;

const FooterDivider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.15), transparent);
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-dim);

  .copyright {
    letter-spacing: 0.05em;
  }
`;

const FooterNav = styled.div`
  display: flex;
  gap: 24px;

  .nav-link {
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #00e5ff;
    }
  }
`;

const ScrollTopBtn = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.15);
  color: var(--text-dim);
  transition: all 0.2s ease;

  &:hover {
    color: #00e5ff;
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.05);
  }
`;

export default SdcFooter;

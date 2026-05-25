import React from 'react';
import styled from 'styled-components';
import { Award, Briefcase, Mail } from 'lucide-react';
import BunkerCard from '../common/BunkerCard';
import { useSound } from '../../context/SoundContext';

interface Founder {
  name: string;
  role: string;
  specialization: string;
  bio: string;
  avatarSvg: React.ReactNode;
  linkedin: string;
  github?: string;
  email: string;
}

const foundersData: Founder[] = [
  {
    name: "Dr. Aarav Mehta",
    role: "Faculty Advisor & Founder",
    specialization: "Distributed Systems & Cybersecurity",
    bio: "Professor in the Computer Science & Engineering Department. Over 15 years of academic and industry research experience. Founded SDC to bridge academic concepts with real-world product engineering.",
    linkedin: "https://linkedin.com",
    email: "aarav.mehta@college.edu",
    avatarSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="18" stroke="#00e5ff" strokeWidth="2.5" fill="rgba(0, 229, 255, 0.05)" />
        <path d="M22 80C22 66 32 58 50 58C68 58 78 66 78 80" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(0, 229, 255, 0.05)" />
        <circle cx="50" cy="50" r="45" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="50" y1="5" x2="50" y2="15" stroke="#00e5ff" strokeWidth="1.5" />
        <line x1="50" y1="85" x2="50" y2="95" stroke="#00e5ff" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    name: "Ananya Sharma",
    role: "Founding Student Lead",
    specialization: "Product Management & Full-Stack Web",
    bio: "Class of 2024. Co-founded SDC during her sophomore year. Directed technical sprints, oversaw frontend alignment, and successfully shipped the initial student cell internal portal.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "ananya.sharma@sdc.org",
    avatarSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="16" stroke="#ffaa00" strokeWidth="2.5" fill="rgba(255, 170, 0, 0.05)" />
        <path d="M25 78C25 65 35 58 50 58C65 58 75 65 75 78" stroke="#ffaa00" strokeWidth="2.5" strokeLinecap="round" fill="rgba(255, 170, 0, 0.05)" />
        <circle cx="50" cy="50" r="45" stroke="rgba(255, 170, 0, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="5" y1="50" x2="15" y2="50" stroke="#ffaa00" strokeWidth="1.5" />
        <line x1="85" y1="50" x2="95" y2="50" stroke="#ffaa00" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    name: "Vikramaditya Roy",
    role: "Founding Technical Lead",
    specialization: "DevOps & Systems Engineering",
    bio: "Class of 2024. Lead developer of SDC infrastructure. Configured centralized college database architecture, automated deployment pipelines, and established the Git integration system.",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "vikram.roy@sdc.org",
    avatarSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="17" stroke="#ef233c" strokeWidth="2.5" fill="rgba(239, 35, 60, 0.05)" />
        <path d="M24 79C24 65 34 58 50 58C66 58 76 65 76 79" stroke="#ef233c" strokeWidth="2.5" strokeLinecap="round" fill="rgba(239, 35, 60, 0.05)" />
        <circle cx="50" cy="50" r="45" stroke="rgba(239, 35, 60, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="18" y1="18" x2="26" y2="26" stroke="#ef233c" strokeWidth="1.5" />
        <line x1="74" y1="74" x2="82" y2="82" stroke="#ef233c" strokeWidth="1.5" />
      </svg>
    )
  }
];

const FoundersSection: React.FC = () => {
  const { playHover, playClick } = useSound();

  return (
    <Container id="founders">
      <HeaderBlock>
        <span className="subtitle">SDC_MEMBERSHIP // STACK_MAPPING</span>
        <h2>Founding Members & Mentors</h2>
        <div className="accent-bar" />
      </HeaderBlock>

      <Grid>
        {foundersData.map((founder) => (
          <FounderCard 
            key={founder.name} 
            variant={founder.name === 'Dr. Aarav Mehta' ? 'cyan' : founder.name === 'Ananya Sharma' ? 'amber' : 'red'}
            label={founder.role.toUpperCase()}
            onMouseEnter={playHover}
          >
            <CardInner>
              <AvatarBox>
                {founder.avatarSvg}
              </AvatarBox>

              <InfoBox>
                <FounderName>{founder.name}</FounderName>
                
                <DetailRow>
                  <Briefcase size={12} className="icon" />
                  <span className="val">{founder.role}</span>
                </DetailRow>

                <DetailRow>
                  <Award size={12} className="icon" />
                  <span className="val spec-val">{founder.specialization}</span>
                </DetailRow>

                <FounderBio>{founder.bio}</FounderBio>

                <ActionsRow>
                  <SocialButton 
                    href={founder.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={playClick}
                    onMouseEnter={playHover}
                    title="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </SocialButton>
                  
                  {founder.github && (
                    <SocialButton 
                      href={founder.github} 
                      target="_blank" 
                      rel="noreferrer"
                      onClick={playClick}
                      onMouseEnter={playHover}
                      title="GitHub"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </SocialButton>
                  )}

                  <SocialButton 
                    href={`mailto:${founder.email}`}
                    onClick={playClick}
                    onMouseEnter={playHover}
                    title="Email"
                  >
                    <Mail size={14} />
                  </SocialButton>
                </ActionsRow>
              </InfoBox>
            </CardInner>
          </FounderCard>
        ))}
      </Grid>
    </Container>
  );
};

const Container = styled.section`
  padding: 80px 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 50px;

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 900;
    color: var(--text-dim);
    letter-spacing: 0.15em;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 950;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .accent-bar {
    width: 60px;
    height: 3px;
    background: var(--border-cyan);
    box-shadow: var(--hud-glow);
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const FounderCard = styled(BunkerCard)`
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0, 229, 255, 0.05);
  }
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
`;

const AvatarBox = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 6px;
  background: rgba(5, 10, 18, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--font-mono);
`;

const FounderName = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.02em;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.65rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  color: var(--text-dim);

  .icon {
    color: var(--text-cyan);
    flex-shrink: 0;
  }

  .val {
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .spec-val {
    color: var(--text-cyan);
  }
`;

const FounderBio = styled.p`
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--text-primary);
  opacity: 0.85;
  margin-top: 6px;
  border-top: 1px dashed rgba(0, 240, 255, 0.1);
  padding-top: 12px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  justify-content: center;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.15);
  background: rgba(0, 229, 255, 0.03);
  color: var(--text-dim);
  transition: all 0.2s ease;

  &:hover {
    color: #00e5ff;
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.08);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
  }
`;

export default FoundersSection;

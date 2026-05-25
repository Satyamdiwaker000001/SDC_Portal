import React from 'react';
import styled from 'styled-components';
import {
  RavenAvatar,
  Neo3Blad3Avatar,
  PhantomOpsAvatar,
  CircuitBreakerAvatar,
  NeuralSpikeAvatar,
  GhostCodeAvatar,
  ZeroDayAvatar,
  DataStrikerAvatar
} from '../common/OperativeAvatars';

export interface OperativeData {
  id: string;
  name: string;
  role: string;
  status: string; // 'ACTIVE' | 'PASSOUT' | 'RETIRED'
  specialization: string;
  avatar: string; // 'raven' | 'neo' | 'phantom' | 'circuit' | 'neural' | 'ghost' | 'zero' | 'data'
  skills: { name: string; level: number }[];
}

interface OperativeCardProps {
  operative: OperativeData;
}

const renderAvatar = (avatar: string) => {
  switch (avatar) {
    case 'raven': return <RavenAvatar />;
    case 'neo': return <Neo3Blad3Avatar />;
    case 'phantom': return <PhantomOpsAvatar />;
    case 'circuit': return <CircuitBreakerAvatar />;
    case 'neural': return <NeuralSpikeAvatar />;
    case 'ghost': return <GhostCodeAvatar />;
    case 'zero': return <ZeroDayAvatar />;
    case 'data': return <DataStrikerAvatar />;
    default: return <RavenAvatar />;
  }
};

const OperativeCard: React.FC<OperativeCardProps> = ({ operative }) => {
  return (
    <CardWrapper>
      {/* Top Header info tabs (STATUS & CLASS) */}
      <CardHeaderTabs>
        <span className="status-tab">STATUS: {operative.status}</span>
        <span className="class-tab">CLASS: HACKER</span>
      </CardHeaderTabs>

      {/* Main card box */}
      <CardContentBox>
        <AvatarContainer>
          <div className="avatar-frame">
            {renderAvatar(operative.avatar)}
          </div>
        </AvatarContainer>

        <NameSection>
          <h3 className="operative-name">{operative.name}</h3>
          <span className="operative-role">{operative.specialization}</span>
        </NameSection>

        <SkillSection>
          <div className="section-title">SKILL LEVELS</div>
          {operative.skills.map((skill, index) => (
            <SkillItem key={index}>
              <span className="skill-name">{skill.name.toUpperCase()}</span>
              <div className="skill-right">
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="skill-percent">{skill.level}%</span>
              </div>
            </SkillItem>
          ))}
        </SkillSection>
      </CardContentBox>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  background: rgba(4, 9, 17, 0.85);
  border: 1px solid rgba(0, 229, 255, 0.25);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(15px);
  box-shadow: inset 0 0 15px rgba(0, 229, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid transparent;
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, transparent 100%) border-box;
    pointer-events: none;
  }

  &:hover {
    border-color: #00e5ff;
    box-shadow: 
      0 0 20px rgba(0, 229, 255, 0.5),
      inset 0 0 15px rgba(0, 229, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const CardHeaderTabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: bold;
  color: #00ffaa; /* Neon green text matching the image */
  text-shadow: 0 0 4px rgba(0, 255, 170, 0.4);
  margin-bottom: 12px;
  padding: 0 4px;
`;

const CardContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AvatarContainer = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #03060a;
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;

  .avatar-frame {
    width: 100px;
    height: 100px;
  }
`;

const NameSection = styled.div`
  text-align: center;
  margin-bottom: 16px;

  .operative-name {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  .operative-role {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #00e5ff;
    letter-spacing: 0.1em;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const SkillSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(0, 229, 255, 0.15);
  padding-top: 12px;

  .section-title {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 900;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: bold;

  .skill-name {
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .skill-right {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 60%;
  }

  .skill-bar-track {
    flex-grow: 1;
    height: 6px;
    background: rgba(0, 255, 170, 0.08);
    border: 1px solid rgba(0, 255, 170, 0.15);
    border-radius: 3px;
    overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%;
    background: #00ffaa; /* Neon green progress fill */
    box-shadow: 0 0 8px rgba(0, 255, 170, 0.6);
  }

  .skill-percent {
    color: #ffffff;
    width: 25px;
    text-align: right;
  }
`;

export default OperativeCard;

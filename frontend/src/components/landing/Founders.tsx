import React from 'react';
import styled from 'styled-components';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Founders: React.FC = () => {
  const founders = [
    {
      name: "SATYAM DIWAKER",
      role: "CHIEF_ARCHITECT",
      id: "OPERATIVE_01_SOLAR",
      bio: "Mastermind behind the centralized command architecture and secure neural bridges.",
      linkedin: "https://www.linkedin.com/in/satyam-diwaker/",
      github: "https://github.com/satyamdiwaker",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=satyam"
    },
    {
      name: "SDC CORE",
      role: "SYSTEMS_INTELLIGENCE",
      id: "OPERATIVE_02_LUNAR",
      bio: "Leading the specialized task routing and system-wide synchronization protocols.",
      linkedin: "#",
      github: "https://github.com/satyamdiwaker",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=core"
    }
  ];

  return (
    <Container id="founders">
      <Grid>
        {founders.map((founder, i) => (
          <FounderCard 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="card-id">{founder.id}</div>
            
            <AvatarWrapper>
               <img src={founder.image} alt={founder.name} />
               <div className="status-dot" />
            </AvatarWrapper>
            
            <Content>
              <Name>{founder.name}</Name>
              <RoleBadge>{founder.role}</RoleBadge>
              <Bio>{founder.bio}</Bio>
              
              <SocialGrid>
                 <SocialLink href={founder.linkedin} target="_blank" className="linkedin">
                    <FiLinkedin size={18} />
                    <span>LinkedIn Profile</span>
                 </SocialLink>
                 <SocialLink href={founder.github} target="_blank" className="github">
                    <FiGithub size={18} />
                    <span>GitHub Archive</span>
                 </SocialLink>
              </SocialGrid>
            </Content>
          </FounderCard>
        ))}
      </Grid>
    </Container>
  );
};

const Container = styled.section`
  padding: 40px 0;
  background-color: transparent;
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FounderCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 32px;
  padding: 48px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  
  .card-id {
    position: absolute;
    top: 32px;
    right: 32px;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #64748B;
    letter-spacing: 0.1em;
    font-weight: 800;
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: #6366F1;
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.08);
  }
`;

const AvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin-bottom: 32px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 40px;
    background: #F1F5F9;
    padding: 8px;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .status-dot {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    background: #10B981;
    border: 3px solid #FFF;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
  }
`;

const Content = styled.div`
  width: 100%;
`;

const Name = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: #0F172A;
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const RoleBadge = styled.div`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  color: #6366F1;
  background: rgba(99, 102, 241, 0.08);
  padding: 6px 16px;
  border-radius: 99px;
  margin-bottom: 24px;
`;

const Bio = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #64748B;
  margin-bottom: 32px;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid rgba(0,0,0,0.05);
  
  &.linkedin {
    background: #F8FAFC;
    color: #0077B5;
    &:hover { background: #0077B5; color: white; border-color: #0077B5; }
  }
  
  &.github {
    background: #F8FAFC;
    color: #1F2937;
    &:hover { background: #1F2937; color: white; border-color: #1F2937; }
  }
`;

export default Founders;

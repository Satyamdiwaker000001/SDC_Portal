import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Code, Layers, ShieldCheck, Database } from 'lucide-react';
import BunkerCard from '../common/BunkerCard';
import { useSound } from '../../context/SoundContext';

interface StudentDeveloper {
  name: string;
  role: 'WEB' | 'MOBILE' | 'UIUX' | 'DEVOPS';
  roleDisplay: string;
  skills: string[];
  bio: string;
  github: string;
  linkedin: string;
  avatarSeed: number; // For generating a unique procedural SVG face
}

const developersData: StudentDeveloper[] = [
  {
    name: "Tanishq Patel",
    role: "WEB",
    roleDisplay: "Senior Frontend Lead",
    skills: ["React", "TypeScript", "GSAP", "WebGL", "Three.js"],
    bio: "Passionate about creating highly interactive, visual-rich digital experiences. Manages frontend architecture and design alignment for all SDC projects.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 1
  },
  {
    name: "Riya Sen",
    role: "WEB",
    roleDisplay: "Senior Backend Lead",
    skills: ["FastAPI", "Python", "MySQL", "Docker", "REST API"],
    bio: "Focuses on building robust, scalable APIs and microservices. Specialist in relational database modeling, query tuning, and web security protocols.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 2
  },
  {
    name: "Kabir Malhotra",
    role: "WEB",
    roleDisplay: "Full Stack Engineer",
    skills: ["React", "Node.js", "Express", "MySQL", "Git"],
    bio: "Versatile developer who loves connecting database structures with seamless client interfaces. Enthusiastic about collaborative codebase integrations.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 3
  },
  {
    name: "Nisha Verma",
    role: "UIUX",
    roleDisplay: "UI/UX & Design Systems Lead",
    skills: ["Figma", "CSS", "Wireframing", "Vector Art", "Prototyping"],
    bio: "Enforces UI guidelines, creates responsive layouts, and builds SDC design systems. Believes that user accessibility is the core of software success.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 4
  },
  {
    name: "Rohit Bansal",
    role: "MOBILE",
    roleDisplay: "Mobile App Lead",
    skills: ["React Native", "Flutter", "Swift", "Dart", "Firebase"],
    bio: "Builds cross-platform Android & iOS applications. Focuses on device performance optimization, native bridges, and clean mobile navigation.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 5
  },
  {
    name: "Ishita Gupta",
    role: "DEVOPS",
    roleDisplay: "Database Architect",
    skills: ["MySQL", "Redis", "Database Optimization", "Linux", "SQL"],
    bio: "Specializes in relational schemas, transaction locking, indexing optimization, and caching. Keeps the database system operating at maximum uptime.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 6
  },
  {
    name: "Devansh Dixit",
    role: "DEVOPS",
    roleDisplay: "QA & Integration Specialist",
    skills: ["Jest", "Cypress", "CI/CD", "GitHub Actions", "Docker"],
    bio: "Builds automated test suites and sets up integration pipelines. Ensures that not a single broken commit reaches the production branch.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 7
  },
  {
    name: "Meera Iyer",
    role: "DEVOPS",
    roleDisplay: "Cloud & Infrastructure Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "Nginx", "Linux Shell"],
    bio: "Manages server hosting, routing, security firewalls, and server-side configurations. Makes sure the SDC Portal operates flawlessly under high loads.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarSeed: 8
  }
];

// Procedural SVG Face Generator based on index seed
const ProceduralAvatar: React.FC<{ seed: number, color: string }> = ({ seed, color }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="6" fill="rgba(5, 10, 18, 0.5)" stroke="rgba(0, 229, 255, 0.08)" strokeWidth="1" />
      {/* Circuit board traces background */}
      <path d={`M 10 20 L ${20 + seed * 5} 20 L ${25 + seed * 5} 35 L 90 35`} stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1" />
      <path d={`M 10 80 L ${30 + seed * 3} 80 L ${35 + seed * 3} 65 L 90 65`} stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1" />
      
      {/* Main Face silhouette */}
      <circle cx="50" cy="40" r="15" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <path d="M28 82C28 68 38 60 50 60C62 60 72 68 72 82" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      
      {/* Decorative details */}
      <circle cx="50" cy="40" r="4" fill="none" stroke={color} strokeWidth="1" />
      <line x1="20" y1="50" x2="80" y2="50" stroke={color} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
      <rect x="42" y="70" width="16" height="4" rx="2" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
};

const DevelopersSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WEB' | 'MOBILE' | 'UIUX' | 'DEVOPS'>('ALL');
  const { playHover, playClick, playTypeClick } = useSound();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    playTypeClick();
  };

  const handleFilterClick = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    playClick();
  };

  const getRoleColor = (role: StudentDeveloper['role']) => {
    switch (role) {
      case 'WEB': return '#00e5ff';
      case 'MOBILE': return '#ffaa00';
      case 'UIUX': return '#ef233c';
      case 'DEVOPS': return '#00ffaa';
    }
  };

  const getRoleIcon = (role: StudentDeveloper['role']) => {
    switch (role) {
      case 'WEB': return <Code size={12} />;
      case 'MOBILE': return <Layers size={12} />;
      case 'UIUX': return <ShieldCheck size={12} />;
      case 'DEVOPS': return <Database size={12} />;
    }
  };

  // Filter developers
  const filteredDevs = developersData.filter((dev) => {
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          dev.roleDisplay.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'ALL' || dev.role === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Container id="developers">
      <HeaderBlock>
        <span className="subtitle">SDC_DATABASE // LOG_SHEETS</span>
        <h2>Developer Directory</h2>
        <div className="accent-bar" />
      </HeaderBlock>

      {/* Roster Filters and Search Grid */}
      <FilterPanel>
        <SearchBox>
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, skill, stack..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchBox>

        <FilterTabs>
          {(['ALL', 'WEB', 'MOBILE', 'UIUX', 'DEVOPS'] as const).map((tab) => (
            <TabBtn 
              key={tab}
              className={activeFilter === tab ? 'active' : ''}
              onClick={() => handleFilterClick(tab)}
              onMouseEnter={playHover}
            >
              {tab}
            </TabBtn>
          ))}
        </FilterTabs>
      </FilterPanel>

      {/* Developer Card Grid */}
      <Grid>
        {filteredDevs.map((dev) => {
          const roleColor = getRoleColor(dev.role);
          return (
            <DevCard 
              key={dev.name} 
              variant="cyan"
              label={`CLASS // ${dev.roleDisplay.toUpperCase()}`}
              onMouseEnter={playHover}
            >
              <CardBody>
                <ProfileRow>
                  <AvatarWrapper>
                    <ProceduralAvatar seed={dev.avatarSeed} color={roleColor} />
                  </AvatarWrapper>
                  
                  <ProfileMain>
                    <h3 className="dev-name">{dev.name}</h3>
                    <RoleBadge $color={roleColor}>
                      {getRoleIcon(dev.role)}
                      <span>{dev.roleDisplay}</span>
                    </RoleBadge>
                  </ProfileMain>
                </ProfileRow>

                <DevBio>{dev.bio}</DevBio>

                <SkillsContainer>
                  <span className="skills-lbl">SKILL_STACK:</span>
                  <div className="skills-list">
                    {dev.skills.map((skill) => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </SkillsContainer>

                <CardActions>
                  <SocialLink 
                    href={dev.github} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'block' }}>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    GITHUB
                  </SocialLink>
                  <SocialLink 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'block' }}>
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    LINKEDIN
                  </SocialLink>
                </CardActions>
              </CardBody>
            </DevCard>
          );
        })}
      </Grid>

      {filteredDevs.length === 0 && (
        <EmptyResults>
          <span className="warning-text">&gt; NO_MEMBERS_MATCHING_FILTER_CRITERIA</span>
          <span className="info-text">Try resetting filters or adjusting search queries.</span>
        </EmptyResults>
      )}
    </Container>
  );
};

const Container = styled.section`
  padding: 80px 0 120px 0;
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

const FilterPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: rgba(5, 10, 18, 0.6);
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 4px;
  padding: 10px 16px;
  flex-grow: 1;
  max-width: 400px;
  font-family: var(--font-mono);

  @media (max-width: 768px) {
    max-width: 100%;
  }

  .search-icon {
    color: var(--text-dim);
    margin-right: 12px;
    flex-shrink: 0;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    width: 100%;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabBtn = styled.div`
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 255, 0.1);
  background: rgba(5, 10, 18, 0.4);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--text-dim);
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    border-color: rgba(0, 229, 255, 0.25);
  }

  &.active {
    color: #00e5ff;
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.08);
    text-shadow: 0 0 5px rgba(0, 229, 255, 0.35);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const DevCard = styled(BunkerCard)`
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 6px 0;
  font-family: var(--font-mono);
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AvatarWrapper = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ProfileMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;

  .dev-name {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RoleBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.55rem;
  font-weight: 900;
  color: ${props => props.$color};
  letter-spacing: 0.05em;
  background: ${props => props.$color}10;
  border: 1px solid ${props => props.$color}30;
  padding: 2px 8px;
  border-radius: 3px;
  width: fit-content;
`;

const DevBio = styled.p`
  font-size: 0.7rem;
  line-height: 1.5;
  color: var(--text-primary);
  opacity: 0.85;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .skills-lbl {
    font-size: 0.55rem;
    font-weight: bold;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .skill-badge {
      font-size: 0.55rem;
      background: rgba(0, 229, 255, 0.04);
      border: 1px solid rgba(0, 229, 255, 0.1);
      color: #cbd5e1;
      padding: 2px 8px;
      border-radius: 2px;
    }
  }
`;

const CardActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 229, 255, 0.15);
  background: rgba(5, 10, 18, 0.4);
  color: var(--text-dim);
  padding: 8px 0;
  font-size: 0.6rem;
  font-weight: bold;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #00e5ff;
    border-color: #00e5ff;
    background: rgba(0, 229, 255, 0.05);
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.1);
  }
`;

const EmptyResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  border: 1px dashed rgba(0, 229, 255, 0.12);
  border-radius: 6px;
  gap: 8px;
  font-family: var(--font-mono);

  .warning-text {
    font-size: 0.7rem;
    font-weight: 900;
    color: var(--text-amber);
    letter-spacing: 0.05em;
  }

  .info-text {
    font-size: 0.65rem;
    color: var(--text-dim);
  }
`;

export default DevelopersSection;

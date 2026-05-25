import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import axios from 'axios';
import OperativeCard from './OperativeCard';
import type { OperativeData } from './OperativeCard';

const mockOperatives: OperativeData[] = [
  {
    id: "OP-001",
    name: "RAVEN_S4",
    role: "TECH-HACKER",
    status: "ACTIVE",
    specialization: "TECH-HACKER",
    avatar: "raven",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "NET-CRACK", level: 86 },
      { name: "ENCRYPTION", level: 82 }
    ]
  },
  {
    id: "OP-002",
    name: "NEO3_BLAD3",
    role: "NETRUNNER",
    status: "ACTIVE",
    specialization: "NETRUNNER",
    avatar: "neo",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "DECRYPTION", level: 85 }
    ]
  },
  {
    id: "OP-003",
    name: "PHANTOM_OPS",
    role: "INFRA-BREACHER",
    status: "ACTIVE",
    specialization: "INFRA-BREACHER",
    avatar: "phantom",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  },
  {
    id: "OP-004",
    name: "CIRCUIT_BREAKER",
    role: "CYBER-SPECIALIST",
    status: "ACTIVE",
    specialization: "CYBER-SPECIALIST",
    avatar: "circuit",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  },
  {
    id: "OP-005",
    name: "NEURAL_SPIKE",
    role: "CYBER-SPECIALIST",
    status: "ACTIVE",
    specialization: "CYBER-SPECIALIST",
    avatar: "neural",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  },
  {
    id: "OP-006",
    name: "GHOST_CODE",
    role: "INFRA-BREACHER",
    status: "ACTIVE",
    specialization: "INFRA-BREACHER",
    avatar: "ghost",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  },
  {
    id: "OP-007",
    name: "ZERO_DAY",
    role: "TECH-HACKER",
    status: "ACTIVE",
    specialization: "TECH-HACKER",
    avatar: "zero",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  },
  {
    id: "OP-008",
    name: "DATA_STRIKER",
    role: "CYBER-SPECIALIST",
    status: "ACTIVE",
    specialization: "CYBER-SPECIALIST",
    avatar: "data",
    skills: [
      { name: "HACKING", level: 92 },
      { name: "ENCRYPTION", level: 78 },
      { name: "BREACHING", level: 85 }
    ]
  }
];

const OperativesGuild: React.FC = () => {
  const [operatives, setOperatives] = useState<OperativeData[]>(mockOperatives);
  
  // Filtering States
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('HIGH');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOperatives = async () => {
      try {
        const response = await axios.get('/api/members');
        if (response.data && response.data.length > 0) {
          const mapped: OperativeData[] = response.data.map((m: any, index: number) => {
            const avatarTypes = ['raven', 'neo', 'phantom', 'circuit', 'neural', 'ghost', 'zero', 'data'];
            const specTypes = ['TECH-HACKER', 'NETRUNNER', 'INFRA-BREACHER', 'CYBER-SPECIALIST'];
            return {
              id: m.id || `OP-00${index + 1}`,
              name: m.name.toUpperCase(),
              role: m.spec || specTypes[index % specTypes.length],
              status: m.status || 'ACTIVE',
              specialization: m.spec || specTypes[index % specTypes.length],
              avatar: avatarTypes[index % avatarTypes.length],
              skills: m.techStack ? m.techStack.map((tech: string, i: number) => ({
                name: tech,
                level: 92 - (i * 6)
              })) : [
                { name: "HACKING", level: 92 },
                { name: "ENCRYPTION", level: 78 },
                { name: "BREACHING", level: 85 }
              ]
            };
          });
          setOperatives(mapped);
        }
      } catch (err) {
        // Fall back silently to our ditto mock list
      }
    };
    fetchOperatives();
  }, []);

  // Filter handlers
  const filteredOperatives = operatives.filter(op => {
    const matchesRole = selectedRole === 'ALL' || op.specialization === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || op.status === selectedStatus;
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Skill Level Filter Logic
    let matchesSkill = true;
    if (selectedSkill === 'HIGH') {
      matchesSkill = op.skills.some(s => s.level >= 85);
    } else if (selectedSkill === 'MEDIUM') {
      matchesSkill = op.skills.some(s => s.level >= 70 && s.level < 85);
    } else if (selectedSkill === 'LOW') {
      matchesSkill = op.skills.every(s => s.level < 70);
    }

    return matchesRole && matchesStatus && matchesSearch && matchesSkill;
  });

  return (
    <SectionContainer>
      {/* Search & Filter bar layout */}
      <FilterBarRow>
        <div className="filter-group">
          {/* Role Filter */}
          <SelectWrapper>
            <span className="select-label">ROLE:</span>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="TECH-HACKER">TECH-HACKER</option>
              <option value="NETRUNNER">NETRUNNER</option>
              <option value="INFRA-BREACHER">INFRA-BREACHER</option>
              <option value="CYBER-SPECIALIST">CYBER-SPECIALIST</option>
            </select>
          </SelectWrapper>

          {/* Skill Filter */}
          <SelectWrapper>
            <span className="select-label">SKILL:</span>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </SelectWrapper>

          {/* Status Filter */}
          <SelectWrapper>
            <span className="select-label">STATUS:</span>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PASSOUT">PASSOUT</option>
              <option value="RETIRED">RETIRED</option>
            </select>
          </SelectWrapper>
        </div>

        {/* Search input field */}
        <SearchWrapper>
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
      </FilterBarRow>

      {/* Roster Grid */}
      <GuildGrid>
        {filteredOperatives.map((op) => (
          <OperativeCard key={op.id} operative={op} />
        ))}
      </GuildGrid>

      {filteredOperatives.length === 0 && (
        <NoResults>
          <span>NO_MATCHING_CYBER_OPERATIVES_FOUND_IN_GRID</span>
        </NoResults>
      )}
    </SectionContainer>
  );
};

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FilterBarRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  background: rgba(10, 18, 30, 0.4);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 8px;
  padding: 12px 20px;
  width: 100%;

  .filter-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--text-dim);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 4px;
  background: rgba(5, 10, 18, 0.8);
  padding: 4px 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-cyan);
    box-shadow: var(--hud-glow);
  }

  .select-label {
    letter-spacing: 0.05em;
  }

  select {
    background: transparent;
    border: none;
    color: var(--text-cyan);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: bold;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;

    option {
      background: #0a121e;
      color: #ffffff;
      text-transform: uppercase;
    }
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 20px;
  background: rgba(5, 10, 18, 0.8);
  padding: 6px 14px;
  width: 250px;
  transition: all 0.2s ease;

  &:hover, &:focus-within {
    border-color: var(--border-cyan);
    box-shadow: var(--hud-glow);
  }

  .search-icon {
    color: var(--text-dim);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    width: 100%;

    &::placeholder {
      color: rgba(209, 215, 224, 0.35);
    }
  }
`;

const GuildGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px;
  border: 1px dashed var(--border-amber);
  border-radius: 6px;
  color: var(--text-amber);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  background: rgba(255, 170, 0, 0.02);
`;

export default OperativesGuild;

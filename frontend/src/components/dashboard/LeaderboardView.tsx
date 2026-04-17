import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  ChevronRight, 
  Activity, 
  Zap, 
  Clock, 
  Briefcase,
  Layout,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react';
import { useSDCData } from '../../hooks/useSDCData';

type ViewMode = 'OVERALL' | 'PROJECTS';




const LeaderboardView: React.FC = () => {
  const { leaderboard: apiLeaderboard = { teams: [], individuals: [], projects: [] }, loading } = useSDCData() as any;
  const [viewMode, setViewMode] = useState<ViewMode>('OVERALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Use real data; ensure defaults to avoid undefined property errors
  const leaderboard = apiLeaderboard || { teams: [], individuals: [], projects: [] };

  useEffect(() => {
    if (!loading && viewMode === 'PROJECTS' && leaderboard?.projects?.length > 0 && !selectedProjectId) {
      setSelectedProjectId(leaderboard.projects[0].id);
    }
  }, [viewMode, leaderboard, selectedProjectId, loading]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <HeaderSection>
          <div className="title-area">
            <Trophy size={32} className="icon-main" />
            <div className="text">
              <h1>TACTICAL_LEADERBOARD</h1>
              <p>PROVISIONING_INTELLIGENCE...</p>
            </div>
          </div>
        </HeaderSection>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Loading data...</p>
      </Container>
    );
  }

  const activeProject = leaderboard.projects?.find((p: any) => p.id === selectedProjectId);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderSection>
        <div className="title-area">
          <Trophy size={32} className="icon-main" />
          <div className="text">
            <h1>TACTICAL_LEADERBOARD</h1>
            <p>UPLINK_STATUS: SECURE // CYCLE_2025_Q1</p>
          </div>
        </div>

        <ViewSwitcher>
          <SwitcherBtn 
            active={viewMode === 'OVERALL'} 
            onClick={() => setViewMode('OVERALL')}
          >
            <Zap size={14} /> OVERALL
          </SwitcherBtn>
          <SwitcherBtn 
            active={viewMode === 'PROJECTS'} 
            onClick={() => setViewMode('PROJECTS')}
          >
            <Briefcase size={14} /> PROJECTS
          </SwitcherBtn>
        </ViewSwitcher>
      </HeaderSection>

      <AnimatePresence mode="wait">
        {viewMode === 'OVERALL' ? (
          <motion.div 
            key="overall"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {/* --- OPERATIVE_TIER --- */}
            <TierSection>
              <div className="tier-header">
                <SectionTitle>LEVEL_01: ELITE_OPERATIVE_COMMAND</SectionTitle>
                <div className="tier-line" />
              </div>
              
              <PodiumSection>
                <div className="podium-grid">
                  {leaderboard.individuals[1] && <ChampionCard rank={2} data={leaderboard.individuals[1]} />}
                  {leaderboard.individuals[0] && <ChampionCard rank={1} data={leaderboard.individuals[0]} />}
                  {leaderboard.individuals[2] && <ChampionCard rank={3} data={leaderboard.individuals[2]} />}
                </div>
              </PodiumSection>

              <RankingSection>
                <div className="section-header">
                  <h3>RANK_04_AND_BEYOND</h3>
                  <div className="line" />
                </div>
                <RankTable>
                  {leaderboard.individuals.slice(3).map((item: any, index: number) => (
                    <RankRow 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="rank-num">#{index + 4}</div>
                      <LBAvatar>
                        {item.image && item.image !== 'N/A' ? <img src={item.image} alt="" /> : item.name.charAt(0)}
                      </LBAvatar>
                      <div className="info">
                        <div className="main-name">{item.name}</div>
                        <div className="sub-info">
                          <span className="spec-tag">{item.spec || 'FIELD_OPERATIVE'}</span> // {item.teams?.join(', ') || 'SOLO_CADRE'}
                        </div>
                      </div>
                      <div className="score-area">
                        <div className="score">{item.avgProgress}%</div>
                        <div className="label">AVG_SYNC</div>
                      </div>
                      <ChevronRight size={16} className="arrow" />
                    </RankRow>
                  ))}
                </RankTable>
              </RankingSection>
            </TierSection>

            <Spacer />

            {/* --- SQUAD_TIER --- */}
            <TierSection>
              <div className="tier-header">
                <SectionTitle>LEVEL_02: SQUADRON_HIERARCHY</SectionTitle>
                <div className="tier-line" />
              </div>
              
              <PodiumSection>
                <div className="podium-grid">
                  {leaderboard.teams[1] && <TeamCard rank={2} data={leaderboard.teams[1]} />}
                  {leaderboard.teams[0] && <TeamCard rank={1} data={leaderboard.teams[0]} />}
                  {leaderboard.teams[2] && <TeamCard rank={3} data={leaderboard.teams[2]} />}
                </div>
              </PodiumSection>

              <TeamRankingSection leaderboard={leaderboard} />
            </TierSection>
          </motion.div>
        ) : (
          <motion.div 
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProjectNavigation>
              {leaderboard.projects?.map((p: any) => (
                <ProjectChip 
                  key={p.id} 
                  active={selectedProjectId === p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  {p.name}
                </ProjectChip>
              ))}
            </ProjectNavigation>

            {activeProject ? (
              <ProjectContainer>
                <ProjectHeader>
                  <div className="p-main-info">
                    <Trophy size={18} className="medal-icon" />
                    <div className="p-title">
                      <h3>{activeProject.name}</h3>
                      <span>SQUAD: {activeProject.teamName}</span>
                    </div>
                  </div>
                  <ProjectStatus status={activeProject.status}>
                    {activeProject.progress}% <span>{activeProject.status}</span>
                  </ProjectStatus>
                </ProjectHeader>

                <ProjectStatsGrid>
                  <StatCard>
                    <div className="label"><Activity size={12} /> PROGRESS</div>
                    <div className="value" color="var(--ui-primary)">{activeProject.progress}%</div>
                    <div className="progress-bar-mini"><div className="fill" style={{ width: `${activeProject.progress}%` }} /></div>
                  </StatCard>
                  <StatCard>
                    <div className="label"><Layout size={12} /> MODULES</div>
                    <div className="value">{activeProject.totalModules}</div>
                  </StatCard>
                  <StatCard>
                    <div className="label"><CheckCircle2 size={12} /> DONE</div>
                    <div className="value" color="var(--color-success)">{activeProject.modulesDone}</div>
                  </StatCard>
                  <StatCard>
                    <div className="label"><Clock size={12} /> DAYS_LEFT</div>
                    <div className="value" color="var(--color-warning)">{activeProject.daysLeft}</div>
                  </StatCard>
                </ProjectStatsGrid>

                <SectionTitle>TEAM_RANKINGS</SectionTitle>
                <SubRankingTable>
                  {activeProject.rankings?.map((m: any, idx: number) => (
                    <SubRankRow key={m.id}>
                      <div className="m-rank">#{idx + 1}</div>
                      <img src={m.image && m.image !== "N/A" ? m.image : `https://api.dicebear.com/7.x/initials/svg?seed=${m.name}`} alt="" className="m-avatar" />
                      <div className="m-name">{m.name}</div>
                      <div className="m-progress-zone">
                        <div className="p-bar"><div className="fill" style={{ width: `${m.progress}%` }} /></div>
                      </div>
                      <div className="m-val">{m.progress}%</div>
                    </SubRankRow>
                  ))}
                </SubRankingTable>
              </ProjectContainer>
            ) : (
              <EmptyState>
                <AlertCircle size={48} />
                <p>NO_ACTIVE_PROJECT_DATA_FOUND</p>
              </EmptyState>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FooterInfo>
        <span className="live-dot" /> RANKINGS_UPDATED_IN_REAL_TIME
        <div className="badges">
          <Badge type="top">TOP</Badge>
          <Badge type="perfect">PERFECT</Badge>
          <Badge type="fast">FAST</Badge>
          <Badge type="fire">FIRE</Badge>
          <Badge type="round">ALL-ROUND</Badge>
        </div>
      </FooterInfo>
    </Container>
  );
};

/* --- SUB-COMPONENTS --- */

const ChampionCard = ({ rank, data }: any) => {
    const medalColors = { 
        1: 'var(--gold-primary)', 
        2: 'var(--stl-400)', 
        3: 'var(--imp-400)' 
    };
    const medalGlow = { 
        1: 'rgba(255, 213, 0, 0.4)', 
        2: 'rgba(0, 118, 228, 0.3)', 
        3: 'rgba(0, 41, 107, 0.2)' 
    };

    return (
        <PodiumItem rank={rank} color={medalColors[rank as keyof typeof medalColors]} glow={medalGlow[rank as keyof typeof medalGlow]}>
            <div className="pillar">
                <div className="rank-floating">TIER_0{rank}</div>
                <AvatarRing progress={data.avgProgress} color={medalColors[rank as keyof typeof medalColors]}>
                    <div className="inner-glow" />
                    <div className="avatar-content">
                        {data.image && data.image !== "N/A" ? <img src={data.image} alt="" /> : <Target size={30} />}
                    </div>
                    <svg className="progress-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="45" className="fill" style={{ strokeDashoffset: `${283 - (283 * data.avgProgress) / 100}` }} />
                    </svg>
                </AvatarRing>
                <div className="details">
                    <div className="name">{data.name}</div>
                    <div className="role">{data.spec || 'FIELD_OPERATIVE'}</div>
                    <div className="squad-info">{data.teams?.[0] || 'SOLO_CADRE'}</div>
                    <div className="progress-stats">
                        <span className="val">{data.avgProgress}%</span>
                        <span className="lbl">SYNC_EFFICIENCY</span>
                    </div>
                </div>
                <PillarBottom color={medalColors[rank as keyof typeof medalColors]} />
                <div className="hud-deco">[0{rank}]_UNIT_IDENTIFIED</div>
            </div>
        </PodiumItem>
    );
};

const TeamCard = ({ rank, data }: any) => {
    // Team colors (Cyan/Blue spectrum for squads)
    const teamColors = { 1: 'var(--stl-600)', 2: 'var(--stl-700)', 3: 'var(--stl-800)' };
    const teamGlow = { 1: 'rgba(0, 118, 228, 0.4)', 2: 'rgba(44, 153, 255, 0.3)', 3: 'rgba(114, 187, 255, 0.2)' };

    return (
        <PodiumItem rank={rank} color={teamColors[rank as keyof typeof teamColors]} glow={teamGlow[rank as keyof typeof teamGlow]} isTeam>
            <div className="pillar">
                <div className="rank-floating">SQUAD_#0{rank}</div>
                <AvatarRing progress={data.score} color={teamColors[rank as keyof typeof teamColors]}>
                    <div className="inner-glow" />
                    <div className="avatar-content">
                        <Users size={36} style={{ color: teamColors[rank as keyof typeof teamColors] }} />
                    </div>
                    <svg className="progress-svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="45" className="fill" style={{ strokeDashoffset: `${283 - (283 * data.score) / 100}` }} />
                    </svg>
                </AvatarRing>
                <div className="details">
                    <div className="name">{data.name}</div>
                    <div className="role">ACTIVE_MISSIONS: {data.projectCount}</div>
                    <div className="progress-stats">
                        <span className="val">{data.score}%</span>
                        <span className="lbl">TEAM_SYNC</span>
                    </div>
                </div>
                <PillarBottom color={teamColors[rank as keyof typeof teamColors]} />
            </div>
        </PodiumItem>
    );
};

const TeamRankingSection = ({ leaderboard }: any) => {
  return (
    <RankingSection>
      <div className="section-header">
        <h3>SQUAD_RANK_04+</h3>
        <div className="line" />
      </div>
      <RankTable>
        {leaderboard.teams.slice(3).map((item: any, index: number) => (
          <RankRow 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="rank-num">#{index + 4}</div>
            <LBAvatar>
              <Users size={16} />
            </LBAvatar>
            <div className="info">
              <div className="main-name">{item.name}</div>
              <div className="sub-info">
                ACTIVE_MISSIONS: {item.projectCount}
              </div>
            </div>
            <div className="score-area">
              <div className="score">{item.score}%</div>
              <div className="label">TEAM_SYNC</div>
            </div>
            <ChevronRight size={16} className="arrow" />
          </RankRow>
        ))}
      </RankTable>
    </RankingSection>
  );
};

/* --- STYLING --- */

const Container = styled(motion.div)`
  padding: 40px; height: 100%; overflow-y: auto; background: var(--bg-main);
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(var(--color-primary-rgb), 0.1); border-radius: 10px; }
`;

const HeaderSection = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;
  .title-area {
    display: flex; align-items: center; gap: 20px;
    .icon-main { color: var(--ui-primary); filter: drop-shadow(0 0 15px rgba(var(--color-primary-rgb), 0.5)); }
    h1 { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 0.15em; margin: 0; }
    p { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); opacity: 0.5; margin-top: 4px; }
  }
`;

const ViewSwitcher = styled.div`
  background: var(--bg-glass); padding: 4px; border-radius: 14px; display: flex; gap: 5px;
  border: var(--border-glass);
`;

const SwitcherBtn = styled.button<{ active: boolean }>`
  background: ${p => p.active ? 'var(--ui-primary)' : 'transparent'};
  color: ${p => p.active ? '#fff' : 'var(--text-dim)'};
  border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;
  font-family: var(--font-heading); font-size: 0.7rem; font-weight: 800;
  display: flex; align-items: center; gap: 8px; transition: 0.3s;
  &:hover:not(:disabled) { transform: translateY(-2px); }
`;

const ProjectNavigation = styled.div`
  display: flex; gap: 12px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 30px;
  &::-webkit-scrollbar { display: none; }
`;

const ProjectChip = styled.button<{ active: boolean }>`
  background: ${p => p.active ? 'rgba(var(--color-primary-rgb), 0.15)' : 'var(--bg-card)'};
  border: 1px solid ${p => p.active ? 'var(--ui-primary)' : 'var(--border-glass)'};
  color: ${p => p.active ? 'var(--ui-primary)' : 'var(--text-dim)'};
  padding: 8px 18px; border-radius: 100px; font-family: var(--font-mono); font-size: 0.65rem;
  font-weight: 700; cursor: pointer; white-space: nowrap; transition: 0.3s;
  &:hover { background: var(--bg-glass); }
`;

const ProjectContainer = styled.div`
  background: var(--bg-glass); border: var(--border-glass);
  border-radius: 24px; padding: 30px; backdrop-filter: var(--glass-blur);
`;

const ProjectHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
  .p-main-info {
    display: flex; align-items: center; gap: 15px;
    .medal-icon { color: var(--color-warning); }
    .p-title {
        h3 { font-family: var(--font-heading); font-size: 1.2rem; margin: 0; color: var(--text-main); }
        span { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim); opacity: 0.6; }
    }
  }
`;

const ProjectStatus = styled.div<{ status: string }>`
  text-align: right; font-family: var(--font-display); font-size: 1.8rem; font-weight: 900;
  color: ${p => p.status === 'AT_RISK' ? 'var(--color-error)' : 'var(--color-success)'};
  span { display: block; font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; opacity: 0.8; }
`;

const ProjectStatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 50px;
`;

const StatCard = styled.div`
  background: var(--bg-card); padding: 20px; border-radius: 16px; border: var(--border-glass); position: relative;
  &::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--ui-primary); opacity: 0.3; }
  .label { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .value { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 900; color: ${p => p.color || 'var(--text-main)'}; }
  .progress-bar-mini { margin-top: 10px; height: 3px; background: var(--bg-glass); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: linear-gradient(90deg, var(--color-success), var(--color-warning)); } }
`;

const SectionTitle = styled.h4`
  font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); opacity: 0.4;
  letter-spacing: 0.3em; margin: 0 0 20px 0; text-align: center;
`;

const SubRankingTable = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const SubRankRow = styled.div`
  display: flex; align-items: center; gap: 20px; padding: 12px 20px; background: var(--bg-glass);
  &:hover { background: var(--bg-main); }
  .m-rank { width: 30px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); opacity: 0.5; }
  .m-avatar { min-width: 32px; width: 32px; height: 32px; border-radius: 50%; object-fit: cover; aspect-ratio: 1 / 1; display: block; border: 2px solid var(--border-glass); box-shadow: 0 0 10px rgba(255,255,255,0.05); }
  .m-name { flex: 1; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: #fff; }
  .m-progress-zone {
    width: 200px; .p-bar { height: 6px; background: var(--bg-main); border-radius: 10px; overflow: hidden; .fill { height: 100%; background: linear-gradient(90deg, var(--jungle), var(--lemon)); } }
  }
  .m-val { font-family: var(--font-display); font-size: 0.9rem; font-weight: 900; color: var(--ui-primary); width: 60px; text-align: right; }
`;

const FooterInfo = styled.div`
  margin-top: 50px; padding: 20px; display: flex; justify-content: space-between; align-items: center;
  font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); opacity: 0.6;
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-success); display: inline-block; margin-right: 8px; animation: breathe 2s infinite; }
  @keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .badges { display: flex; gap: 15px; }
`;

const Badge = styled.span<{ type: string }>`
    display: flex; align-items: center; gap: 5px;
    &::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: ${p => p.type === 'fire' ? '#ff4d4d' : p.type === 'fast' ? '#4d94ff' : '#ffd700'}; }
`;

const EmptyState = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: var(--text-dim); opacity: 0.3; p { font-family: var(--font-mono); font-size: 0.8rem; } `;

const PodiumSection = styled.div` margin-bottom: 100px; .podium-grid { display: flex; justify-content: center; align-items: flex-end; gap: 60px; perspective: 1000px; padding: 0 40px; } `;
const PodiumItem = styled.div<{ rank: number; color: string; glow: string; isTeam?: boolean }>`
  position: relative; display: flex; flex-direction: column; align-items: center; z-index: ${props => props.rank === 1 ? 10 : 1};
  .pillar {
    width: ${props => props.rank === 1 ? '240px' : '200px'}; height: ${props => props.rank === 1 ? '380px' : '320px'};
    background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-main) 100%);
    backdrop-filter: var(--glass-blur); border: var(--border-glass); border-radius: 30px; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 30px; position: relative; overflow: hidden; 
    box-shadow: var(--shadow-premium);
    &::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, ${props => props.glow} 0%, transparent 70%); opacity: 0.15; pointer-events: none; }
    .hud-deco { position: absolute; bottom: 15px; font-family: var(--font-mono); font-size: 0.4rem; color: var(--text-dim); opacity: 0.2; letter-spacing: 0.1em; }
  }
  .rank-floating { position: absolute; top: 20px; left: 20px; font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; opacity: 0.12; color: ${props => props.color}; letter-spacing: 0.2em; }
  .details {
    text-align: center;
    .name { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 900; color: var(--text-main); margin-bottom: 4px; }
    .role { font-family: var(--font-mono); font-size: 0.55rem; color: ${props => props.isTeam ? props.color : 'var(--ui-primary)'}; letter-spacing: 0.15em; opacity: 0.7; margin-bottom: 4px; }
    .squad-info { font-family: var(--font-mono); font-size: 0.45rem; color: var(--text-dim); opacity: 0.5; text-transform: uppercase; margin-bottom: 20px; }
    .progress-stats { display: flex; flex-direction: column; align-items: center; .val { font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: ${props => props.color}; filter: drop-shadow(0 0 10px ${props => props.color}40); } .lbl { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); letter-spacing: 0.2em; } }
  }
  &:hover { transform: translateY(-15px) rotateX(5deg); .pillar { border-color: ${props => props.color}80; backdrop-filter: blur(40px); box-shadow: 0 30px 60px -15px ${props => props.color}20; } }
`;
const AvatarRing = styled.div<{ progress: number; color: string }>` 
  position: relative; width: 110px; height: 110px; display: flex; align-items: center; justify-content: center; 
  .inner-glow { position: absolute; width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 0 40px ${props => props.color}15; } 
  .avatar-content { 
    width: 84px; height: 84px; border-radius: 50%; overflow: hidden; 
    border: 3px solid ${props => props.color}; background: var(--bg-card); 
    display: flex; align-items: center; justify-content: center; 
    box-shadow: 0 0 20px ${props => props.color}40, inset 0 0 15px rgba(0,0,0,0.5);
    img { min-width: 100%; min-height: 100%; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; aspect-ratio: 1 / 1; display: block; } 
    color: var(--text-dim); 
  } 
  .progress-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible; circle { fill: none; stroke: ${props => props.theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'}; stroke-width: 3; &.fill { stroke: ${props => props.color}; stroke-dasharray: 283; stroke-linecap: round; transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1); } } } 
`;
const PillarBottom = styled.div<{ color: string }>` position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: ${props => props.color}; box-shadow: 0 0 20px ${props => props.color}; `;
const RankingSection = styled.section` 
  max-width: 900px; margin: 0 auto; 
  .section-header { 
    display: flex; align-items: center; gap: 20px; margin-bottom: 30px; 
    h3 { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.3em; margin: 0; opacity: 0.5; color: var(--ui-primary); } 
    .line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(var(--color-secondary-rgb), 0.2), transparent); } 
  } 
`;

const TierSection = styled.div`
  margin-bottom: 80px;
  .tier-header {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-bottom: 60px;
    .tier-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
    }
  }
`;

const Spacer = styled.div`
  height: 40px;
  border-bottom: 1px dashed var(--border-glass);
  margin-bottom: 60px;
  position: relative;
  &::after {
    content: 'DECRYPTING_NEXT_TIER';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-mono);
    font-size: 0.5rem;
    color: var(--text-dim);
    background: var(--bg-main);
    padding: 0 15px;
    letter-spacing: 0.2em;
    opacity: 0.3;
  }
`;
const RankTable = styled.div` display: flex; flex-direction: column; gap: 10px; `;
const RankRow = styled(motion.div)` 
  background: var(--bg-card); border: var(--border-glass); border-radius: 16px; padding: 16px 30px; display: flex; align-items: center; gap: 30px; transition: all 0.3s; 
  box-shadow: ${props => props.theme.mode === 'light' ? '0 4px 12px rgba(0,0,0,0.02)' : 'none'};
  .rank-num { font-family: var(--font-display); font-size: 1rem; color: var(--text-dim); opacity: ${props => props.theme.mode === 'light' ? 0.8 : 0.4}; width: 40px; } 
  .info { flex: 1; .main-name { font-family: var(--font-mono); font-size: 0.9rem; font-weight: 800; color: var(--text-main); } .sub-info { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); opacity: 0.5; margin-top: 2px; } } 
  .score-area { text-align: right; .score { font-family: var(--font-display); font-size: 1.1rem; color: var(--ui-primary); } .label { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); opacity: 0.4; letter-spacing: 0.1em; } } 
  .arrow { color: var(--text-dim); opacity: 0.2; } &:hover { background: var(--bg-glass); border-color: var(--ui-primary); transform: translateX(10px); .arrow { color: var(--ui-primary); opacity: 1; transform: translateX(5px); } } `;
const LBAvatar = styled.div` width: 42px; height: 42px; min-width: 42px; border-radius: 50%; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; color: var(--ui-primary); border: 2px solid rgba(var(--color-primary-rgb), 0.4); overflow: hidden; flex-shrink: 0; box-shadow: 0 0 12px rgba(var(--color-primary-rgb), 0.2); img { min-width: 100%; min-height: 100%; width: 100%; height: 100%; object-fit: cover; aspect-ratio: 1/1; display: block; border-radius: 50%; } `;
export default LeaderboardView;

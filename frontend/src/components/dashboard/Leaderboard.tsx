import React, { useState } from 'react';
import styled from 'styled-components';
import { Award, Zap, Box, CheckSquare, Folder, X, Trophy, Crown, Flame, Star } from 'lucide-react';

// Base Data Models
interface BaseDev {
  id: string;
  name: string;
  initials: string;
  projectId: string;
  modules: number;   // total assigned modules
  done: number;      // completed modules
  active: number;    // currently active modules
  streak: number;    // tasks completed consecutively
  daysActive: number;// days spent working
}

interface BaseProject {
  id: string;
  name: string;
  team: string;
  daysLeft: number;
  totalDays: number;
  themeColor: string;
}

// 1. Define Base Projects
const baseProjects: BaseProject[] = [
  { id: 'p1', name: 'CareNest (DR Hospital Home Care)', team: 'Team Epsilon', daysLeft: 76, totalDays: 120, themeColor: '#ec4899' },
  { id: 'p2', name: 'Library Management (Koha)', team: 'Team Gamma', daysLeft: 30, totalDays: 100, themeColor: '#10b981' },
  { id: 'p3', name: 'Software Development Portal', team: 'Team Alpha', daysLeft: 10, totalDays: 60, themeColor: '#fbbf24' },
];

// 2. Define Base Developers assigned to Projects
const baseDevs: BaseDev[] = [
  // Perfect + Fast + Fire -> "All-Round"
  { id: '1', name: 'Abhishek', initials: 'A', projectId: 'p3', modules: 10, done: 10, active: 0, streak: 6, daysActive: 15 }, 
  // High progress, but not perfect
  { id: '2', name: 'Vaishnavi', initials: 'V', projectId: 'p3', modules: 12, done: 10, active: 2, streak: 5, daysActive: 20 },
  // Low progress, at risk
  { id: '3', name: 'Satyam', initials: 'S', projectId: 'p3', modules: 8, done: 2, active: 2, streak: 1, daysActive: 15 },
  // Vayu (CareNest) - Fast
  { id: '4', name: 'Vayu', initials: 'V', projectId: 'p1', modules: 10, done: 8, active: 2, streak: 2, daysActive: 10 },
  // Bhavna (CareNest)
  { id: '5', name: 'Bhavna', initials: 'B', projectId: 'p1', modules: 10, done: 6, active: 3, streak: 3, daysActive: 20 },
  // Akansha (CareNest)
  { id: '6', name: 'Akansha', initials: 'A', projectId: 'p1', modules: 10, done: 4, active: 1, streak: 1, daysActive: 25 },
  // Vighnesh (CareNest)
  { id: '7', name: 'Vighnesh', initials: 'V', projectId: 'p1', modules: 10, done: 4, active: 2, streak: 0, daysActive: 25 },
  // Nivedita (Library) - Perfect but maybe not fast
  { id: '8', name: 'Nivedita singh', initials: 'N', projectId: 'p2', modules: 5, done: 5, active: 0, streak: 2, daysActive: 30 },
  // Vivek (Library)
  { id: '9', name: 'Vivek sharma', initials: 'V', projectId: 'p2', modules: 8, done: 4, active: 2, streak: 1, daysActive: 40 },
  // Anshika (Library)
  { id: '10', name: 'Anshika gupta', initials: 'A', projectId: 'p2', modules: 10, done: 3, active: 1, streak: 0, daysActive: 40 },
];

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DEVELOPERS' | 'PROJECTS'>('DEVELOPERS');
  const [activeProjectFilter, setActiveProjectFilter] = useState("All Projects");

  const projectFilters = ["All Projects", ...baseProjects.map(p => p.name)];

  // --- BUSINESS LOGIC CALCULATIONS ---
  
  // 1. Calculate Dev Stats & Tags
  const calculatedDevs = baseDevs.map(dev => {
    const progress = dev.modules > 0 ? Math.round((dev.done / dev.modules) * 100) : 0;
    
    // Tag Rules
    const isPerfect = (progress === 100);
    const isFast = (progress / dev.daysActive >= 5); // Average 5% progress per day
    const isFire = (dev.streak >= 4); // 4 consecutive modules done without breaking streak
    
    let mainBadge: 'top' | 'all_round' | 'perfect' | 'fast' | 'fire' | null = null;
    
    // The Supreme Tag Rule: Must fulfill ALL THREE (Perfect, Fast, Fire)
    if (isPerfect && isFast && isFire) {
      mainBadge = 'all_round';
    } else if (isPerfect) {
      mainBadge = 'perfect';
    } else if (isFire) {
      mainBadge = 'fire';
    } else if (isFast) {
      mainBadge = 'fast';
    }

    return { ...dev, score: progress, badge: mainBadge };
  }).sort((a, b) => b.score - a.score); // Sort by score descending

  // Assign Ranks and 'Top' badge
  calculatedDevs.forEach((dev, idx) => {
    (dev as any).rank = idx + 1;
    // Rank 1 always gets 'Top' badge alongside anything else, 
    // but for the UI slot we prioritize 'all_round' or 'top'
    if (idx === 0 && dev.badge !== 'all_round') {
      dev.badge = 'top';
    }
  });

  // 2. Calculate Project Stats & Risk
  const calculatedProjects = baseProjects.map(proj => {
    const team = calculatedDevs.filter(d => d.projectId === proj.id);
    const totalModules = team.reduce((acc, d) => acc + d.modules, 0);
    const totalDone = team.reduce((acc, d) => acc + d.done, 0);
    
    // Project Progress is total done / total modules
    const projProgress = totalModules > 0 ? Math.round((totalDone / totalModules) * 100) : 0;
    
    // Risk Logic: Expected Progress based on time elapsed
    const expectedProgress = ((proj.totalDays - proj.daysLeft) / proj.totalDays) * 100;
    
    let riskStatus = 'ON TRACK';
    let riskColor = '#34d399'; // Green
    
    if (projProgress < expectedProgress - 15) {
      riskStatus = 'AT RISK';
      riskColor = '#f59e0b'; // Orange/Red
    } else if (projProgress >= expectedProgress + 10) {
      riskStatus = 'AHEAD';
      riskColor = '#60a5fa'; // Blue
    }

    return {
      ...proj,
      progress: projProgress,
      modules: totalModules,
      done: totalDone,
      statusText: riskStatus,
      statusColor: riskColor,
      members: team // Already sorted by score
    };
  }).sort((a, b) => b.progress - a.progress); // Rank projects by progress

  // Assign Project Ranks
  calculatedProjects.forEach((proj, idx) => { (proj as any).rank = idx + 1; });

  // Reorder for podium display: [Rank 2, Rank 1, Rank 3]
  const podiumOrder = [
    calculatedDevs.find(e => (e as any).rank === 2),
    calculatedDevs.find(e => (e as any).rank === 1),
    calculatedDevs.find(e => (e as any).rank === 3)
  ].filter(Boolean) as any[];

  const renderBadge = (badge?: string) => {
    const style = { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' };
    switch (badge) {
      case 'all_round': return <span title="All-Round Legend" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🌟</span>;
      case 'top': return <Crown size={18} color="#fbbf24" fill="#fbbf24" style={style} />;
      case 'perfect': return <Star size={18} color="#a855f7" fill="#a855f7" style={style} />;
      case 'fast': return <Zap size={18} color="#34d399" fill="#34d399" style={style} />;
      case 'fire': return <Flame size={18} color="#f97316" fill="#f97316" style={style} />;
      default: return null;
    }
  };

  const getRankTheme = (rank: number) => {
    if (rank === 1) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.5)' };
    if (rank === 2) return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.4)' };
    if (rank === 3) return { color: '#d97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.4)' };
    return { color: 'rgba(255,255,255,0.2)', bg: 'transparent', border: 'transparent' };
  };

  return (
    <Container>
      {/* ── Top Header ── */}
      <Header>
        <div className="h-left">
          <div className="title-row">
            <Trophy size={28} color="#fbbf24" fill="#fbbf24" style={{ filter: 'drop-shadow(0 2px 5px rgba(251,191,36,0.5))' }} />
            <h1>Student Leaderboard</h1>
          </div>
          <p className="subtitle">Live rankings - Academic Year 2025-26</p>
        </div>
        <div className="h-right">
          <ToggleGroup>
            <ToggleButton $active={activeTab === 'DEVELOPERS'} onClick={() => setActiveTab('DEVELOPERS')}>
              <Award size={14} /> DEVELOPERS
            </ToggleButton>
            <ToggleButton $active={activeTab === 'PROJECTS'} onClick={() => setActiveTab('PROJECTS')}>
              <Folder size={14} /> PROJECTS
            </ToggleButton>
          </ToggleGroup>
          <CloseButton><X size={16} /></CloseButton>
        </div>
      </Header>

      <ContentArea>
        {activeTab === 'DEVELOPERS' ? (
          <>
            {/* ── Podium Area ── */}
            <PodiumContainer>
              {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const theme = getRankTheme(entry.rank);
                  
                  return (
                    <PodiumItem key={entry.id} className={`rank-${entry.rank}`}>
                      <div className="podium-content">
                        {entry.badge && <div className="badge-float">{renderBadge(entry.badge)}</div>}
                        <Avatar $borderColor={theme.color} $size={isFirst ? 75 : 60}>
                          {entry.initials}
                        </Avatar>
                        <span className="name">{entry.name}</span>
                        <span className="score" style={{ color: theme.color }}>{entry.score}%</span>
                      </div>
                      
                      <PodiumBase $rank={entry.rank} $color={theme.color} $bg={theme.bg} $border={theme.border}>
                        <div className="medal-float">
                          <MedalImg rank={entry.rank} color={theme.color} />
                        </div>
                      </PodiumBase>
                    </PodiumItem>
                  );
                })}
            </PodiumContainer>

            {/* ── List Area ── */}
            <ListContainer>
              {calculatedDevs.map((entry) => {
                const theme = getRankTheme((entry as any).rank);
                return (
                  <ListRow key={entry.id} $borderColor={theme.border}>
                    <div className="row-left">
                      <MedalImg rank={(entry as any).rank} color={theme.color} small />
                      <Avatar $borderColor={theme.color} $size={44} className="list-avatar">
                        {entry.initials}
                      </Avatar>
                    </div>

                    <div className="row-center">
                      <div className="name-badge">
                        <span className="name">{entry.name}</span>
                        {entry.badge && <span className="badge">{renderBadge(entry.badge)}</span>}
                      </div>
                      
                      <ProgressBarTrack>
                        <ProgressBarFill $level={(entry as any).score} $color={theme.color} />
                      </ProgressBarTrack>
                      
                      <div className="stats-row">
                        <span><Box size={10} style={{ color: 'rgba(255,255,255,0.4)' }} /> {entry.modules} modules</span>
                        <span className="success"><CheckSquare size={10} /> {entry.done} done</span>
                        <span className="active"><Zap size={10} fill="#f97316" color="#f97316" /> {entry.active} active</span>
                      </div>
                    </div>

                    <div className="row-right">
                      <span className="score" style={{ color: theme.color === 'rgba(255,255,255,0.2)' ? '#fff' : theme.color }}>{(entry as any).score}%</span>
                      <span className="score-label">AVG PROGRESS</span>
                    </div>
                  </ListRow>
                );
              })}
            </ListContainer>
          </>
        ) : (
          /* ── Projects Area ── */
          <ProjectsContainer>
            {/* ── Filters ── */}
            <FilterScroll>
              {projectFilters.map(f => (
                <FilterTag 
                  key={f} 
                  $active={activeProjectFilter === f}
                  onClick={() => setActiveProjectFilter(f)}
                >
                  {f}
                </FilterTag>
              ))}
            </FilterScroll>

            {calculatedProjects
              .filter(proj => activeProjectFilter === "All Projects" || proj.name === activeProjectFilter)
              .map(proj => {
              return (
                <ProjectCard key={proj.id}>
                  <div className="p-header">
                    <div className="ph-left">
                      <MedalImg rank={(proj as any).rank} color={(proj as any).rank === 1 ? '#fbbf24' : (proj as any).rank === 2 ? '#94a3b8' : '#d97706'} small />
                      <div className="status-dot" style={{ background: proj.themeColor }} />
                      <div className="p-titles">
                        <h3>{proj.name}</h3>
                        <span>{proj.team}</span>
                      </div>
                    </div>
                    <div className="ph-right">
                      <span className="p-score" style={{ color: proj.statusColor }}>{proj.progress}</span>
                      <span className="p-status" style={{ color: proj.statusColor }}>{proj.statusText}</span>
                    </div>
                  </div>

                  <div className="p-main-progress">
                    <ProgressBarTrack style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                      <ProgressBarFill $level={proj.progress} $color={proj.themeColor} style={{ borderRadius: '4px' }} />
                    </ProgressBarTrack>
                  </div>

                  <div className="p-stats-grid">
                    <div className="stat-box">
                      <span className="val" style={{ color: proj.themeColor }}>{proj.progress}%</span>
                      <span className="lbl">PROGRESS</span>
                    </div>
                    <div className="stat-box">
                      <span className="val">{proj.modules}</span>
                      <span className="lbl">MODULES</span>
                    </div>
                    <div className="stat-box">
                      <span className="val" style={{ color: '#34d399' }}>{proj.done}</span>
                      <span className="lbl">DONE</span>
                    </div>
                    <div className="stat-box">
                      <span className="val" style={{ color: '#fbbf24' }}>{proj.daysLeft}</span>
                      <span className="lbl">DAYS LEFT</span>
                    </div>
                  </div>

                  <div className="team-rankings-section">
                    <div className="tr-header">TEAM RANKINGS</div>
                    <div className="tr-list">
                      {proj.members.map((m: any, idx: number) => (
                        <div className="tr-row" key={m.id}>
                          <span className="tr-rank">#{idx + 1}</span>
                          <span className="tr-name">{m.name}</span>
                          <ProgressBarTrack style={{ height: '4px', flex: 1 }}>
                            <ProgressBarFill $level={m.score} $color={proj.themeColor} />
                          </ProgressBarTrack>
                          <span className="tr-score" style={{ color: proj.themeColor }}>{m.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ProjectCard>
              );
            })}
          </ProjectsContainer>
        )}

      </ContentArea>

      <Footer>
        <div className="f-left">
          <MedalImg rank={1} color="#fbbf24" small /> Rankings update in real-time
        </div>
        <div className="f-right">
          <span><Crown size={14} color="#fbbf24" /> Top</span>
          <span><Star size={14} color="#a855f7" /> Perfect</span>
          <span><Zap size={14} color="#34d399" /> Fast</span>
          <span><span title="All-Round Legend" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🌟</span> All-Round</span>
        </div>
      </Footer>
    </Container>
  );
};

// Custom SVG Medal to match the screenshot better
const MedalImg = ({ rank, color, small = false }: { rank: number; color: string; small?: boolean }) => {
  const size = small ? 24 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
      <path d="M11 6L8 14H24L21 6H11Z" fill="#60a5fa" />
      <circle cx="16" cy="18" r="10" fill={color} stroke="#000" strokeWidth="1" />
      <text x="16" y="22" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#000" textAnchor="middle">{rank}</text>
    </svg>
  );
};

/* ─── Styled Components ─── */

const Container = styled.div`
  background: #151828;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px 20px 32px;
  background: #1e2235;
  border-bottom: 1px solid rgba(0,0,0,0.2);

  .h-left {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title-row {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-family: var(--font-body);
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        margin: 0;
        letter-spacing: -0.01em;
      }
    }

    .subtitle {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      margin: 0;
      padding-left: 45px;
    }
  }

  .h-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  background: rgba(0,0,0,0.25);
  padding: 4px;
  border-radius: 8px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? '#6366f1' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.4)'};
  box-shadow: ${p => p.$active ? '0 4px 12px rgba(99,102,241,0.4)' : 'none'};

  &:hover {
    color: #fff;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
`;

const ContentArea = styled.div`
  padding: 24px 32px 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FilterScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 8px;
  
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
`;

const FilterTag = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${p => p.$active ? '#818cf8' : 'rgba(255,255,255,0.08)'};
  color: ${p => p.$active ? '#818cf8' : 'rgba(255,255,255,0.5)'};

  &:hover {
    background: ${p => p.$active ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)'};
  }
`;

/* ── Podium ── */
const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 12px;
  height: 380px;
  margin-top: 20px;
`;

const PodiumItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  position: relative;
  
  &.rank-1 { z-index: 3; }
  &.rank-2 { z-index: 2; margin-bottom: 20px; }
  &.rank-3 { z-index: 1; margin-bottom: 20px; }

  .podium-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin-bottom: 12px;
  }

  .badge-float {
    position: absolute;
    top: -28px;
    font-size: 1.3rem;
  }

  .name {
    margin-top: 16px;
    font-size: 1.05rem;
    font-weight: 800;
    color: #fff;
  }

  .score {
    margin-top: 4px;
    font-size: 1.6rem;
    font-weight: 900;
    font-family: var(--font-mono);
    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
  }
`;

const Avatar = styled.div<{ $borderColor: string; $size: number }>`
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  background: rgba(30,35,50,0.8);
  border: 2px solid ${p => p.$borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => p.$size * 0.4}px;
  font-weight: 400;
  color: rgba(255,255,255,0.6);
  box-shadow: 0 0 15px ${p => p.$borderColor}40;
`;

const PodiumBase = styled.div<{ $rank: number; $color: string; $bg: string; $border: string }>`
  width: 100%;
  height: ${p => p.$rank === 1 ? '190px' : p.$rank === 2 ? '140px' : '120px'};
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  position: relative;
  
  .medal-float {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

/* ── List Area ── */
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const ListRow = styled.div<{ $borderColor: string }>`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$borderColor};
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.04);
  }
  
  .row-left {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100px;
    flex-shrink: 0;

    .list-avatar {
      font-weight: 700;
      color: #fff;
    }
  }

  .row-center {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 20px;

    .name-badge {
      display: flex;
      align-items: center;
      gap: 8px;

      .name {
        font-size: 1.05rem;
        font-weight: 800;
        color: #fff;
      }
      .badge {
        font-size: 1.1rem;
      }
    }

    .stats-row {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.65rem;
      color: rgba(255,255,255,0.4);
      font-family: var(--font-mono);
      font-weight: 700;

      span { display: flex; align-items: center; gap: 4px; }
      .success { color: #34d399; }
      .active { color: rgba(255,255,255,0.5); }
    }
  }

  .row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    width: 120px;
    flex-shrink: 0;

    .score {
      font-size: 1.6rem;
      font-weight: 900;
      font-family: var(--font-mono);
      line-height: 1;
    }
    
    .score-label {
      font-size: 0.55rem;
      color: rgba(255,255,255,0.3);
      font-weight: 800;
      letter-spacing: 0.05em;
    }
  }
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $level: number; $color: string }>`
  height: 100%;
  width: ${p => p.$level}%;
  background: ${p => p.$color};
  border-radius: 4px;
  box-shadow: 0 0 10px ${p => p.$color}80;
  transition: width 1s ease-out;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #1e2235;
  border-top: 1px solid rgba(0,0,0,0.3);
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  font-weight: 600;

  .f-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .f-right {
    display: flex;
    gap: 20px;
    
    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

/* ── Projects View Styles ── */
const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProjectCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;

  .p-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .ph-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 10px currentColor;
      }

      .p-titles {
        display: flex;
        flex-direction: column;
        gap: 4px;

        h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #fff;
          font-weight: 800;
        }

        span {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }
      }
    }

    .ph-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .p-score {
        font-size: 2rem;
        font-weight: 900;
        font-family: var(--font-mono);
        line-height: 1;
      }
      .p-status {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
      }
    }
  }

  .p-main-progress {
    width: 100%;
  }

  .p-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .stat-box {
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.03);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .val {
        font-size: 1.4rem;
        font-weight: 900;
        font-family: var(--font-mono);
        color: #fff;
      }

      .lbl {
        font-size: 0.65rem;
        font-weight: 800;
        color: rgba(255,255,255,0.4);
        letter-spacing: 0.05em;
      }
    }
  }

  .team-rankings-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;

    .tr-header {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 800;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.1em;
      position: relative;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 35%;
        height: 1px;
        background: rgba(255,255,255,0.05);
      }
      &::before { left: 0; }
      &::after { right: 0; }
    }

    .tr-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .tr-row {
        display: flex;
        align-items: center;
        gap: 16px;

        .tr-rank {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          width: 30px;
        }

        .tr-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          width: 120px;
        }

        .tr-score {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          font-weight: 800;
          width: 40px;
          text-align: right;
        }
      }
    }
  }
`;

export default Leaderboard;

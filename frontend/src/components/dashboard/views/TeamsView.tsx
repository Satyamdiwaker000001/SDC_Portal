import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, ChevronRight, ChevronLeft,
  Check, Target, Zap, Crown, Trash2,
  Shield, Activity, Layers, Plus
} from 'lucide-react';
import { useSDCData } from '../../../hooks/useSDCData';
import { useSearchFilter } from '../../../context/SearchFilterContext';
import TacticalHeader from '../premium/TacticalHeader';
import TacticalFrame from '../premium/TacticalFrame';
import TacticalFilterBar from '../premium/TacticalFilterBar';
import toast from 'react-hot-toast';

/* ══════════════════════════════════════
   WIZARD COMPONENT
══════════════════════════════════════ */
const SquadWizard: React.FC<{
  members: any[];
  projects: any[];
  assignedProjectIds: Set<string>;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ members = [], projects = [], assignedProjectIds, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [squadName, setSquadName] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const toggleMember = (id: string) =>
    setMemberIds(p => (p || []).includes(id) ? (p || []).filter(x => x !== id) : [...(p || []), id]);
  const toggleProject = (id: string) =>
    setProjectIds(p => (p || []).includes(id) ? (p || []).filter(x => x !== id) : [...(p || []), id]);

  const availableProjects = (projects || []).filter((p: any) => p?.id && !assignedProjectIds.has(p.id));
  const leaderObj = (members || []).find((m: any) => m.id === leaderId);
  const allSelectedMembers = [...new Set([...(memberIds || []), ...(leaderId ? [leaderId] : [])])];

  const steps = [
    { id: 1, label: 'IDENTITY', icon: <Target size={15} />, title: 'Name your squad', hint: 'Give your squad a tactical designation' },
    { id: 2, label: 'COMMAND', icon: <Crown size={15} />, title: 'Assign a leader', hint: 'Select one operative to lead this squad' },
    { id: 3, label: 'ROSTER', icon: <Users size={15} />, title: 'Build the roster', hint: 'Click members to enlist them' },
    { id: 4, label: 'MISSIONS', icon: <Briefcase size={15} />, title: 'Link missions', hint: 'Assign available projects to this squad' },
  ];

  const canNext = () => {
    if (step === 1) return squadName.trim().length > 0;
    if (step === 2) return leaderId !== '';
    if (step === 3) return memberIds.length > 0;
    return true;
  };

  return (
    <WOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <WFrame
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <WLeftPanel>
          <WBrand>
            <div className="brand-icon"><Zap size={20} /></div>
            <span>Team Builder</span>
          </WBrand>

          <WStepList>
            <WStepConnector />
            {steps.map(s => (
              <WStepItem 
                key={s.id} 
                $active={step === s.id} 
                $done={step > s.id} 
                onClick={() => step > s.id && setStep(s.id)}
              >
                <div className="step-bullet">
                  {step > s.id ? <Check size={12} /> : s.icon}
                </div>
                <div className="step-text">
                  <span className="step-label">{s.label}</span>
                  <span className="step-title">{s.title}</span>
                </div>
                {step > s.id && <div className="step-done-dot" />}
              </WStepItem>
            ))}
          </WStepList>

          <WPreview>
            <div className="prev-header"><Shield size={11} /> Team Summary</div>
            <div className="prev-name">{squadName || <span style={{ opacity: 0.3 }}>——</span>}</div>
            <div className="prev-row"><Crown size={10} /><span>{leaderObj?.name || 'No leader yet'}</span></div>
            <div className="prev-row"><Users size={10} /><span>{allSelectedMembers.length} members</span></div>
            <div className="prev-row"><Briefcase size={10} /><span>{projectIds.length} projects linked</span></div>
            {allSelectedMembers.length > 0 && (
              <WAvatarRow>
                {allSelectedMembers.slice(0, 6).map((id, i) => {
                  const m = (members || []).find((x: any) => x.id === id);
                  return <WAvatarMini key={id} style={{ left: i * 20 }} $isLeader={id === leaderId}>{m?.name?.charAt(0)}</WAvatarMini>;
                })}
                {allSelectedMembers.length > 6 && <WAvatarMini style={{ left: 6 * 20 }} $isLeader={false}>+{allSelectedMembers.length - 6}</WAvatarMini>}
              </WAvatarRow>
            )}
          </WPreview>
        </WLeftPanel>

        <WRightPanel>
          <WRightHeader>
            <div>
              <div className="step-badge">STEP {step} / 4</div>
              <h2>{steps[step - 1]?.title || 'Step'}</h2>
              <p>{steps[step - 1]?.hint || 'Awaiting input'}</p>
            </div>
            <CloseX onClick={onClose}>✕</CloseX>
          </WRightHeader>

          <WContent>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <ContentPane key="s1">
                  <LargeInput placeholder="e.g. Alpha Strike, DevCore, UI Guild..." value={squadName} onChange={e => setSquadName(e.target.value)} autoFocus />
                  {squadName && (
                    <PreviewTag><Layers size={12} /><span>Team: <strong>{squadName}</strong></span></PreviewTag>
                  )}
                </ContentPane>
              )}

              {step === 2 && (
                <ContentPane key="s2">
                  <RosterGrid>
                    {(members || []).map((m: any) => (
                      <SelectableCard key={m.id} $selected={leaderId === m.id} $accent="#FBBF24" onClick={() => setLeaderId(m.id)} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                        <SAvatar $accent={leaderId === m.id ? '#FBBF24' : '#60A5FA'}>
                          {m.image && m.image !== 'N/A' ? <img src={m.image} alt="" /> : m.name?.charAt(0)}
                        </SAvatar>
                        <SInfo>
                          <div className="s-name">{m.name}</div>
                          <div className="s-role">{m.spec || m.role}</div>
                        </SInfo>
                        <AnimatePresence>
                          {leaderId === m.id && <SBadge key="lb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} $color="#FBBF24"><Crown size={9} /> LEADER</SBadge>}
                        </AnimatePresence>
                      </SelectableCard>
                    ))}
                  </RosterGrid>
                </ContentPane>
              )}

              {step === 3 && (
                <ContentPane key="s3">
                  <RosterGrid>
                    {(members || []).map((m: any) => {
                      const isLeader = m.id === leaderId;
                      const sel = memberIds.includes(m.id) || isLeader;
                      return (
                        <SelectableCard key={m.id} $selected={sel} $accent={isLeader ? '#FBBF24' : '#60A5FA'} onClick={() => !isLeader && toggleMember(m.id)} style={{ cursor: isLeader ? 'default' : 'pointer' }} whileHover={!isLeader ? { y: -3 } : {}} whileTap={!isLeader ? { scale: 0.97 } : {}}>
                          <SAvatar $accent={isLeader ? '#FBBF24' : '#60A5FA'}>
                            {m.image && m.image !== 'N/A' ? <img src={m.image} alt="" /> : m.name?.charAt(0)}
                          </SAvatar>
                          <SInfo>
                            <div className="s-name">{m.name}</div>
                            <div className="s-role">{m.spec || m.role}</div>
                          </SInfo>
                          <AnimatePresence>
                            {isLeader && <SBadge key="lb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} $color="#FBBF24"><Crown size={9} /> LEAD</SBadge>}
                            {!isLeader && sel && <SBadge key="mb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} $color="#60A5FA"><Check size={9} /> IN</SBadge>}
                          </AnimatePresence>
                        </SelectableCard>
                      );
                    })}
                  </RosterGrid>
                  <CountBar><Users size={12} /> {allSelectedMembers.length} member{allSelectedMembers.length !== 1 ? 's' : ''} selected</CountBar>
                </ContentPane>
              )}

              {step === 4 && (
                <ContentPane key="s4">
                  {availableProjects.length === 0 ? (
                    <NoItems><Briefcase size={32} /><p>All projects are already assigned to other squads.</p></NoItems>
                  ) : (
                    <RosterGrid>
                      {availableProjects.map((p: any) => {
                        const sel = projectIds.includes(p.id);
                        return (
                          <SelectableCard key={p.id} $selected={sel} $accent="#818CF8" onClick={() => toggleProject(p.id)} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                            <ProjIcon $selected={sel}><Briefcase size={16} /></ProjIcon>
                            <SInfo>
                              <div className="s-name">{p.title || p.name}</div>
                              <div className="s-role">{p.status || 'ACTIVE'}</div>
                            </SInfo>
                            <AnimatePresence>
                              {sel && <SBadge key="pb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} $color="#818CF8"><Check size={9} /> LINKED</SBadge>}
                            </AnimatePresence>
                          </SelectableCard>
                        );
                      })}
                    </RosterGrid>
                  )}
                  <ReviewBox>
                    <div className="rv-title"><Check size={11} /> Team Summary</div>
                    <div className="rv-row"><Target size={10} /><span>Team</span><strong>{squadName}</strong></div>
                    <div className="rv-row"><Crown size={10} style={{ color: '#FBBF24' }} /><span>Leader</span><strong>{leaderObj?.name}</strong></div>
                    <div className="rv-row"><Users size={10} /><span>Roster</span><strong>{allSelectedMembers.length} members</strong></div>
                    {projectIds.length > 0 && <div className="rv-row"><Briefcase size={10} style={{ color: '#818CF8' }} /><span>Projects</span><strong>{projectIds.length} linked</strong></div>}
                  </ReviewBox>
                </ContentPane>
              )}
            </AnimatePresence>
          </WContent>

          <WFooter>
            <ProgressDots>{steps.map(s => <Dot key={s.id} $active={step === s.id} $done={step > s.id} />)}</ProgressDots>
            <NavGroup>
              {step > 1 && <BackBtn onClick={() => setStep(s => s - 1)}><ChevronLeft size={15} /> Back</BackBtn>}
              {step < 4
                ? <NextBtn disabled={!canNext()} onClick={() => canNext() && setStep(s => s + 1)}>Continue <ChevronRight size={15} /></NextBtn>
                : <ForgeBtn onClick={() => onSubmit({ name: squadName, leaderId, memberIds: allSelectedMembers, projectIds })}><Zap size={15} /> Create Team</ForgeBtn>
              }
            </NavGroup>
          </WFooter>
        </WRightPanel>
      </WFrame>
    </WOverlay>
  );
};

/* ══════════════════════════════════════
   MAIN VIEW
══════════════════════════════════════ */
const TeamsView: React.FC = () => {
  const { teams = [], members = [], projects = [], refresh } = useSDCData() as any;
  const { searchQuery } = useSearchFilter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const sdc_user = JSON.parse(localStorage.getItem('sdc_user') || '{}');

  const assignedProjectIds = new Set<string>(
    (teams || []).flatMap((t: any) => (t?.projects || []).map((p: any) => p?.id || p))
  );

  const filteredTeams = (teams || []).filter((t: any) => {
    const leader = (members || []).find((m: any) => m.id === t.leaderId);
    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           leader?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async (_data: any) => {
    toast.loading('Creating Team...', { duration: 1000 });
    setTimeout(() => {
      toast.success('Team Created');
      setWizardOpen(false);
      refresh();
    }, 1200);
  };

  const deleteTeam = async (_id: string) => {
    if (!window.confirm('Delete this team?')) return;
    toast.loading('Deleting Team...', { duration: 800 });
    setTimeout(() => {
      toast.success('Team Deleted');
      refresh();
    }, 1000);
  };

  return (
    <ViewContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TacticalHeader 
        title="Teams & Squads" 
        subtitle={`System Online // Teams: ${teams?.length || 0}`}
        actions={sdc_user?.role === 'admin' && (
          <FormBtn onClick={() => setWizardOpen(true)}><Plus size={18} /> Create Team</FormBtn>
        )}
      />

      <TacticalFilterBar placeholder="Search by Team Name or Leader..." />

      <TeamGrid>
        {(filteredTeams || []).length > 0 ? (filteredTeams || []).map((team: any, i: number) => {
          const leader = (members || []).find((m: any) => m.id === team.leaderId);
          return (
            <TacticalFrame 
              key={team.id || i} 
              delay={i * 0.07}
              statusColor="var(--accent-secondary)"
            >
              <CardInner>
                <CardTop>
                  <TIconBox><Layers size={20} /></TIconBox>
                  {sdc_user?.role === 'admin' && <DelBtn onClick={() => deleteTeam(team.id)}><Trash2 size={14} /></DelBtn>}
                </CardTop>
                <div>
                  <TeamName>{team.name}</TeamName>
                  <LeadPill><Crown size={11} />{leader?.name || 'Unassigned'}</LeadPill>
                </div>
                <MemberRow>
                  <AvatarCluster>
                    {(team?.members || []).slice(0, 5).map((m: any, idx: number) => (
                      <SmallAvatar key={m?.id || idx} style={{ left: idx * 22 }} title={m?.name}>
                          {m?.image && m?.image !== 'N/A' ? <img src={m?.image} alt="" /> : m?.name?.charAt(0)}
                      </SmallAvatar>
                    ))}
                    {(team?.members || []).length > 5 && (
                      <SmallAvatar style={{ left: 5 * 22, background: 'rgba(96,165,250,0.15)', color: 'var(--accent-primary)' }}>+{(team.members || []).length - 5}</SmallAvatar>
                    )}
                  </AvatarCluster>
                  <MemberCount><Users size={11} />{team?.members?.length || 0}</MemberCount>
                </MemberRow>
              </CardInner>
            </TacticalFrame>
          );
        }) : (
          <EmptyZone>
            <Activity size={52} opacity={0.3} />
            <h3>NO SQUADS ONLINE</h3>
            <p>Initiate squad formation to begin.</p>
          </EmptyZone>
        )}
      </TeamGrid>

      <AnimatePresence>
        {wizardOpen && (
          <SquadWizard
            members={members} projects={projects}
            assignedProjectIds={assignedProjectIds}
            onClose={() => setWizardOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </ViewContainer>
  );
};

/* ══════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════ */
const pulseAnim = keyframes`0%,100%{opacity:.5}50%{opacity:1}`;

/* ══════════════════════════════════════
   TEAM LIST STYLES
══════════════════════════════════════ */
const ViewContainer = styled(motion.div)` padding: 40px; display: flex; flex-direction: column; gap: 40px; `;

const FormBtn = styled.button`
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none; border-radius: 14px; padding: 15px 30px; color: white;
  font-family: var(--font-heading); font-size: 0.8rem; font-weight: 900;
  letter-spacing: 0.06em; cursor: pointer; transition: 0.3s;
  box-shadow: 0 8px 25px rgba(96,165,250,0.25);
  &:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(96,165,250,0.4); }
`;

const TeamGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; `;

const CardInner = styled.div`
  padding: 26px; display: flex; flex-direction: column; gap: 18px; position: relative;
`;

const CardTop = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const TIconBox = styled.div` width: 46px; height: 46px; border-radius: 14px; background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-secondary); `;
const DelBtn = styled.button` width: 34px; height: 34px; background: rgba(251,113,133,0.06); border: 1px solid rgba(251,113,133,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent-error); cursor: pointer; transition: 0.3s; &:hover { background: var(--accent-error); color: white; border-color: var(--accent-error); } `;
const TeamName = styled.div` font-family: var(--font-heading); font-size: 1.2rem; font-weight: 900; margin-bottom: 10px; color: var(--text-main); `;
const LeadPill = styled.div` display: inline-flex; align-items: center; gap: 7px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); color: var(--accent-warning); border-radius: 100px; padding: 5px 13px; font-family: var(--font-mono); font-size: 0.58rem; font-weight: 800; `;
const MemberRow = styled.div` display: flex; align-items: center; justify-content: space-between; `;
const AvatarCluster = styled.div` position: relative; height: 34px; flex: 1; `;
const SmallAvatar = styled.div`
  position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(96,165,250,0.1);
  border: 2px solid var(--bg-main); display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 900; color: var(--accent-primary); overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const MemberCount = styled.div` display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); `;
const EmptyZone = styled.div` grid-column: 1/-1; padding: 80px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-dim); h3 { font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.2em; opacity: 0.5; } p { font-family: var(--font-mono); font-size: 0.7rem; opacity: 0.4; } `;

const WOverlay = styled(motion.div)`
  position: fixed; top: 70px; left: 0; right: 0; bottom: 0; z-index: 9999;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
`;

const WFrame = styled(motion.div)`
  width: 100%; max-width: 960px; height: 88vh; max-height: 740px;
  display: flex; border-radius: 28px; overflow: hidden;
  border: var(--border-glass);
  box-shadow: 0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(96,165,250,0.08);
`;

const WLeftPanel = styled.div`
  width: 260px; flex-shrink: 0;
  background: var(--bg-card);
  border-right: var(--border-glass);
  display: flex; flex-direction: column; padding: 32px 24px; gap: 36px;
`;

const WBrand = styled.div`
  display: flex; align-items: center; gap: 12px;
  .brand-icon { width: 36px; height: 36px; border-radius: 11px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; color: white; }
  span { font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: var(--accent-primary); letter-spacing: 0.1em; }
`;

const WStepList = styled.div` display: flex; flex-direction: column; gap: 4px; position: relative; flex: 1; `;
const WStepConnector = styled.div` position: absolute; left: 16px; top: 18px; bottom: 18px; width: 1px; background: var(--border-glass); z-index: 0; `;

const WStepItem = styled.div<{ $active: boolean; $done: boolean }>`
  display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px;
  cursor: ${p => p.$done ? 'pointer' : 'default'}; position: relative; z-index: 1; transition: 0.25s;
  background: ${p => p.$active ? 'rgba(96,165,250,0.1)' : 'transparent'};
  &:hover { background: ${p => p.$done ? 'rgba(96,165,250,0.07)' : p.$active ? 'rgba(96,165,250,0.1)' : 'transparent'}; }

  .step-bullet {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; z-index: 2; transition: 0.25s;
    background: ${p => p.$done ? 'var(--accent-primary)' : p.$active ? 'rgba(96,165,250,0.15)' : 'var(--bg-main)'};
    border: 2px solid ${p => p.$done || p.$active ? 'var(--accent-primary)' : 'var(--border-glass)'};
    color: ${p => p.$done ? 'white' : p.$active ? 'var(--accent-primary)' : 'var(--text-dim)'};
  }
  .step-text { display: flex; flex-direction: column; gap: 2px; }
  .step-label { font-family: var(--font-mono); font-size: 0.46rem; font-weight: 800; letter-spacing: 0.12em; color: ${p => p.$active ? 'var(--accent-primary)' : 'var(--text-dim)'}; }
  .step-title { font-size: 0.75rem; font-weight: 700; color: ${p => p.$active ? 'var(--text-main)' : 'var(--text-dim)'}; }
  .step-done-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary); margin-left: auto; flex-shrink: 0; animation: ${pulseAnim} 2s infinite; }
`;

const WPreview = styled.div`
  background: var(--bg-glass); border: var(--border-glass); border-radius: 18px; padding: 18px;
  display: flex; flex-direction: column; gap: 9px;
  .prev-header { display: flex; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: 0.48rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 4px; }
  .prev-name { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 900; color: var(--text-main); min-height: 22px; }
  .prev-row { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.58rem; color: var(--text-dim); }
`;

const WAvatarRow = styled.div` position: relative; height: 30px; margin-top: 4px; `;
const WAvatarMini = styled.div<{ $isLeader: boolean }>`
  position: absolute; width: 26px; height: 26px; border-radius: 50%;
  background: ${p => p.$isLeader ? 'rgba(251,191,36,0.2)' : 'rgba(96,165,250,0.12)'};
  border: 2px solid ${p => p.$isLeader ? '#FBBF24' : 'rgba(96,165,250,0.3)'};
  color: ${p => p.$isLeader ? '#FBBF24' : '#60A5FA'};
  display: flex; align-items: center; justify-content: center; font-size: 0.52rem; font-weight: 900;
`;

const WRightPanel = styled.div` flex: 1; display: flex; flex-direction: column; background: var(--bg-main); `;
const WRightHeader = styled.div`
  padding: 28px 32px 22px; border-bottom: var(--border-glass); display: flex; justify-content: space-between; align-items: flex-start;
  .step-badge { font-family: var(--font-mono); font-size: 0.48rem; font-weight: 800; letter-spacing: 0.15em; color: var(--accent-primary); margin-bottom: 8px; }
  h2 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main); }
  p { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-dim); }
`;

const CloseX = styled.button`
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; background: var(--bg-glass); border: var(--border-glass); color: var(--text-dim); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; transition: 0.3s;
  &:hover { background: var(--accent-error); color: white; border-color: var(--accent-error); transform: rotate(90deg); }
`;

const WContent = styled.div`
  flex: 1; overflow-y: auto; padding: 24px 32px;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 10px; }
`;

const ContentPane = styled(motion.div).attrs(() => ({
  initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 }, transition: { duration: 0.2 }
}))` display: flex; flex-direction: column; gap: 16px; `;

const LargeInput = styled.input`
  width: 100%; background: var(--bg-card); border: var(--border-glass); border-radius: 16px; padding: 18px 22px; font-family: var(--font-body); font-size: 1.05rem; font-weight: 600; color: var(--text-main); transition: 0.25s; outline: none;
  &:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(96,165,250,0.15); background: var(--bg-main); }
  &::placeholder { color: var(--text-dim); opacity: 0.5; }
`;

const PreviewTag = styled.div`
  display: flex; align-items: center; gap: 10px; border-radius: 12px; padding: 11px 16px; background: var(--bg-glass); border: var(--border-glow); font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-dim);
  strong { color: var(--text-main); }
`;

const RosterGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; `;

const SelectableCard = styled(motion.div)<{ $selected: boolean; $accent: string }>`
  position: relative; border-radius: 16px; padding: 14px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: border-color 0.2s;
  background: ${p => p.$selected ? `${p.$accent}10` : 'var(--bg-card)'};
  border: 1.5px solid ${p => p.$selected ? p.$accent : 'var(--border-glass)'};
  box-shadow: var(--shadow-premium);
  &:hover { border-color: ${p => p.$accent}; }
`;

const SAvatar = styled.div<{ $accent: string }>`
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0; background: ${p => `${p.$accent}18`}; border: 1px solid ${p => `${p.$accent}30`}; color: ${p => p.$accent}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.95rem; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const SInfo = styled.div`
  flex: 1; min-width: 0;
  .s-name { font-weight: 800; font-size: 0.82rem; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .s-role { font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); margin-top: 3px; }
`;

const SBadge = styled(motion.div)<{ $color: string }>`
  position: absolute; top: 7px; right: 7px; display: flex; align-items: center; gap: 3px; background: ${p => `${p.$color}18`}; border: 1px solid ${p => `${p.$color}40`}; color: ${p => p.$color}; border-radius: 100px; padding: 2px 7px; font-family: var(--font-mono); font-size: 0.46rem; font-weight: 900;
`;

const ProjIcon = styled.div<{ $selected: boolean }>`
  width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0; background: ${p => p.$selected ? 'rgba(129,140,248,0.15)' : 'rgba(129,140,248,0.08)'}; border: 1px solid rgba(129,140,248,0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-secondary);
`;

const CountBar = styled.div` display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.62rem; color: var(--accent-primary); font-weight: 800; padding: 9px 14px; border-radius: 10px; background: var(--bg-glass); border: var(--border-glow); `;
const NoItems = styled.div` display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 48px 20px; color: var(--text-dim); opacity: 0.5; p { font-family: var(--font-mono); font-size: 0.7rem; text-align: center; } `;

const ReviewBox = styled.div`
  background: var(--bg-glass); border: var(--border-glow); border-radius: 16px; padding: 18px 22px; display: flex; flex-direction: column; gap: 10px;
  .rv-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.5rem; color: var(--accent-primary); font-weight: 800; letter-spacing: 0.1em; margin-bottom: 6px; }
  .rv-row { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 0.66rem; span { color: var(--text-dim); flex: 0 0 68px; } strong { color: var(--text-main); } }
`;

const WFooter = styled.div` padding: 16px 32px; border-top: var(--border-glass); display: flex; align-items: center; justify-content: space-between; `;
const ProgressDots = styled.div` display: flex; gap: 8px; `;
const Dot = styled.div<{ $active: boolean; $done: boolean }>`
  height: 4px; border-radius: 4px; transition: all 0.35s; width: ${p => p.$active ? '22px' : '7px'}; background: ${p => p.$done || p.$active ? 'var(--accent-primary)' : 'var(--bg-glass)'}; border: ${p => p.$done || p.$active ? 'none' : 'var(--border-glass)'};
`;
const NavGroup = styled.div` display: flex; align-items: center; gap: 10px; `;
const BackBtn = styled.button` display: flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 11px; background: var(--bg-glass); border: var(--border-glass); color: var(--text-dim); font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: 0.25s; &:hover { color: var(--text-main); border-color: var(--accent-primary); } `;
const NextBtn = styled.button<{ disabled?: boolean }>`
  display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 12px; background: ${p => p.disabled ? 'var(--bg-glass)' : 'rgba(96,165,250,0.12)'}; border: ${p => p.disabled ? 'var(--border-glass)' : '1px solid rgba(96,165,250,0.35)'}; color: ${p => p.disabled ? 'var(--text-dim)' : 'var(--accent-primary)'}; font-family: var(--font-heading); font-size: 0.8rem; font-weight: 900; cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'}; transition: 0.25s; opacity: ${p => p.disabled ? 0.5 : 1};
  &:hover:not([disabled]) { background: var(--accent-primary); color: white; border-color: var(--accent-primary); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(96,165,250,0.3); }
`;
const ForgeBtn = styled.button` display: flex; align-items: center; gap: 10px; padding: 13px 26px; border-radius: 12px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border: none; color: white; font-family: var(--font-heading); font-size: 0.82rem; font-weight: 900; letter-spacing: 0.04em; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 20px rgba(96,165,250,0.3); &:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(96,165,250,0.45); } `;

export default TeamsView;

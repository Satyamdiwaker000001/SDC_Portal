import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Plus, Trash2, ShieldAlert, AlertCircle, Info, Send, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { Modal, FormGroup, SubmitButton } from '../AdminModals';
import { TacticalSelect } from '../TacticalSelect';

interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: 'Urgent' | 'Important' | 'Normal';
  timestamp: string;
  is_global: boolean;
}

const AnnouncementsView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    body: '',
    priority: 'Normal' as 'Normal' | 'Important' | 'Urgent',
    is_global: true,
    team_ids: [] as string[]
  });
  const [teams, setTeams] = useState<{id: string, name: string}[]>([]);

  const user = JSON.parse(localStorage.getItem('sdc_user') || '{}');
  const isAdmin = user.role === 'admin';

  const fetchAnnouncements = async () => {
    setLoading(true);
    // Simulate tactical broadcast synchronization [MOCK_INTEL]
    setTimeout(() => {
      setAnnouncements([
        { id: 1, title: 'CORE_SYSTEM_UPGRADE_v5.2', body: 'Nexus architecture has been successfully migrated to the new Titanium Framework. All operatives should sync their local environments.', priority: 'Important', timestamp: new Date().toISOString(), is_global: true },
        { id: 2, title: 'SQUAD_RECIPIENT_NOTICE', body: 'CYBER_VANGUARD has achieved 100% sync rate on the PhishGuard module. Bonus credits allocated to all squad members.', priority: 'Urgent', timestamp: new Date(Date.now() - 3600000).toISOString(), is_global: true },
        { id: 3, title: 'MAINTENANCE_PROTOCOL_UPCOMING', body: 'Scheduled maintenance on the central mission matrix this Friday at 03:00 UTC. Expect 15m of downlink latency.', priority: 'Normal', timestamp: new Date(Date.now() - 86400000).toISOString(), is_global: true },
        { id: 4, title: 'NEW_SQUAD_FORMATION: CORE_FORGE', body: 'Tactical squad CORE_FORGE has been forged to manage neural bridge infrastructure.', priority: 'Normal', timestamp: new Date(Date.now() - 172800000).toISOString(), is_global: false }
      ]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchAnnouncements();
    if (isAdmin) {
       // Mock teams for targeted broadcast
       setTeams([
         { id: 'T1', name: 'CYBER_VANGUARD' },
         { id: 'T2', name: 'UI_ELITE' },
         { id: 'T3', name: 'CORE_FORGE' }
       ]);
    }
  }, [isAdmin]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements/', newAnnouncement);
      toast.success('Announcement Sent');
      setIsModalOpen(false);
      setNewAnnouncement({ title: '', body: '', priority: 'Normal', is_global: true, team_ids: [] });
      fetchAnnouncements();
    } catch (err) {
      toast.error('Announcement Failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement Deleted');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Deletion Failed');
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'Urgent': return { icon: <ShieldAlert size={16} />, color: 'var(--accent-error)', label: 'Critical' };
      case 'Important': return { icon: <AlertCircle size={16} />, color: 'var(--accent-warning)', label: 'High Priority' };
      default: return { icon: <Info size={16} />, color: 'var(--accent-primary)', label: 'Standard' };
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header>
        <div className="title-block">
          <Radio size={24} className="pulse" />
          <h2>Terminal Feed</h2>
          <span className="status">System Online</span>
        </div>
        {isAdmin && (
          <BroadcastBtn onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Announcement
          </BroadcastBtn>
        )}
      </Header>

      <FeedGrid>
        <AnimatePresence>
          {loading ? (
            <LoadingState>Loading announcements...</LoadingState>
          ) : announcements.length > 0 ? (
            announcements.map((item, index) => {
              const info = getPriorityInfo(item.priority);
              return (
                <BroadcastCard
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  priorityColor={info.color}
                >
                  <CardHeader>
                    <div className="priority-tag" style={{ color: info.color }}>
                      {info.icon}
                      <span>{info.label} • {item.is_global ? 'Global' : 'Targeted'}</span>
                    </div>
                    {isAdmin && (
                        <DeleteBtn onClick={() => handleDelete(item.id)}>
                            <Trash2 size={14} />
                        </DeleteBtn>
                    )}
                  </CardHeader>
                  <CardBody>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </CardBody>
                  <CardFooter>
                    <span className="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
                  </CardFooter>
                </BroadcastCard>
              );
            })
          ) : (
            <EmptyState>
              <Radio size={48} />
              <p>No Active Announcements</p>
            </EmptyState>
          )}
        </AnimatePresence>
      </FeedGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Announcement"
      >
        <form onSubmit={handleBroadcast}>
           <FormGroup fullWidth>
              <label>Title</label>
              <input 
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                placeholder="Enter alert title..."
                required
              />
           </FormGroup>
           <FormGroup fullWidth>
              <TacticalSelect 
                label="Priority"
                options={[
                  { label: 'Normal (Standard)', value: 'Normal' },
                  { label: 'Important (High Priority)', value: 'Important' },
                  { label: 'Urgent (Critical Alert)', value: 'Urgent' }
                ]}
                value={newAnnouncement.priority}
                onChange={val => setNewAnnouncement({...newAnnouncement, priority: val as any})}
              />
           </FormGroup>
           <FormGroup fullWidth>
              <TacticalSelect 
                 label="Audience"
                 options={[
                    { label: 'Global (All Teams)', value: 'GLOBAL' },
                    { label: 'Targeted (Select Teams)', value: 'TARGETED' }
                 ]}
                 value={newAnnouncement.is_global ? 'GLOBAL' : 'TARGETED'}
                 onChange={val => setNewAnnouncement({...newAnnouncement, is_global: val === 'GLOBAL', team_ids: val === 'GLOBAL' ? [] : newAnnouncement.team_ids})}
              />
           </FormGroup>

           {!newAnnouncement.is_global && (
             <FormGroup fullWidth>
                <label>Select Target Teams</label>
                <TargetGrid>
                  {teams.length === 0 ? (
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', padding: '10px 0' }}>No Teams Available</div>
                  ) : (
                     teams.map(t => {
                        const isSelected = newAnnouncement.team_ids.includes(t.id);
                        return (
                          <TargetPill 
                            as={motion.div}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={t.id}
                            selected={isSelected}
                            onClick={() => {
                              if (isSelected) {
                                setNewAnnouncement({...newAnnouncement, team_ids: newAnnouncement.team_ids.filter(id => id !== t.id)});
                              } else {
                                setNewAnnouncement({...newAnnouncement, team_ids: [...newAnnouncement.team_ids, t.id]});
                              }
                            }}
                          >
                            <div className="indicator">
                               {isSelected ? <CheckCircle2 size={16} /> : <div className="circle-outline" />}
                            </div>
                            <div className="meta">
                               <span className="pill-name">{t.name}</span>
                               <span className="pill-id">{t.id}</span>
                            </div>
                          </TargetPill>
                        );
                     })
                  )}
                </TargetGrid>
             </FormGroup>
           )}

           <FormGroup fullWidth>
              <label>Message</label>
              <textarea 
                value={newAnnouncement.body}
                onChange={e => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
                placeholder="Compose announcement details..."
                required
              />
           </FormGroup>
           <SubmitButton type="submit">
              <Send size={18} /> Send Announcement
           </SubmitButton>
        </form>
      </Modal>
    </Container>
  );
};

/* --- STYLED COMPONENTS --- */

const Container = styled(motion.div)`
  padding: 40px;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 0; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .title-block {
    display: flex; align-items: center; gap: 15px;
    h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; margin: 0; }
    .status { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-success); opacity: 0.6; }
    .pulse { color: var(--accent-primary); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
  }
`;

const BroadcastBtn = styled.button`
  background: ${props => props.theme.mode === 'light' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0.05)'};
  border: 1px solid ${props => props.theme.mode === 'light' ? 'var(--accent-primary)' : 'rgba(96, 165, 250, 0.3)'};
  color: ${props => props.theme.mode === 'light' ? '#2563EB' : 'var(--accent-primary)'}; /* Darker blue in light mode */
  padding: 12px 24px;
  border-radius: 12px;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  transition: 0.3s;
  letter-spacing: 0.05em;
  &:hover { background: var(--accent-primary); color: white; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(96, 165, 250, 0.3); }
`;

const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const BroadcastCard = styled(motion.div)<{ priorityColor: string }>`
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: var(--border-glass);
  border-left: 4px solid ${props => props.priorityColor};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: 0.3s;
  &:hover { transform: translateY(-5px); border-color: ${props => props.priorityColor}40; background: rgba(255,255,255,0.02); }
`;

const CardHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  .priority-tag {
    display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.6rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.1em;
  }
`;

const CardBody = styled.div`
  h3 { font-size: 1.1rem; margin-bottom: 8px; color: var(--text-main); font-weight: 800; }
  p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.6; }
`;

const CardFooter = styled.div`
  .timestamp { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-dim); opacity: 0.5; }
`;

const DeleteBtn = styled.button`
  background: none; border: none; color: var(--text-dim); cursor: pointer; transition: 0.3s;
  &:hover { color: var(--accent-error); }
`;

const LoadingState = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 100px; font-family: var(--font-mono); font-size: 0.8rem;
  color: var(--accent-primary); letter-spacing: 0.2em;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 100px; color: var(--text-dim); opacity: 0.3; gap: 20px;
  p { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.1em; }
`;

const TargetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 15px;
  max-height: 200px;
  overflow-y: auto;
  padding: 5px;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 4px; }
`;

const TargetPill = styled(motion.div)<{ selected: boolean }>`
  background: ${props => props.selected 
    ? (props.theme.mode === 'light' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(96, 165, 250, 0.1)') 
    : (props.theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(0, 0, 0, 0.2)')};
  border: 1px solid ${props => props.selected 
    ? 'var(--accent-primary)' 
    : 'var(--border-glass)'};
  color: ${props => props.selected 
    ? (props.theme.mode === 'light' ? '#2563EB' : 'var(--accent-primary)') 
    : 'var(--text-dim)'};
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  box-shadow: ${props => props.selected ? '0 0 15px rgba(96, 165, 250, 0.15)' : 'none'};

  .indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.selected ? 'var(--accent-primary)' : 'var(--text-dim)'};
    .circle-outline {
      width: 14px; height: 14px; border-radius: 50%;
      border: 1px solid var(--border-glass);
      opacity: 0.5;
    }
  }
  
  .meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }
  
  .pill-name {
    font-size: 0.8rem;
    font-weight: 700;
  }
  .pill-id {
    font-size: 0.6rem;
    font-family: var(--font-mono);
    opacity: ${props => props.selected ? 0.9 : 0.5};
  }

  &:hover {
    border-color: ${props => props.selected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'};
    background: ${props => props.selected ? 'rgba(96, 165, 250, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

export default AnnouncementsView;

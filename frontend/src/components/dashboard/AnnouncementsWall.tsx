import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ShieldAlert, AlertCircle, Info, Bell, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WallContainer = styled.div`
  background: ${props => props.theme.bgCard};
  backdrop-filter: blur(12px);
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 2rem;
  height: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadow};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-secondary), transparent);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  h3 {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 0.2em;
    color: var(--text-main);
    margin: 0;
  }
`;

const Feed = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(45, 212, 191, 0.2);
    border-radius: 10px;
  }
`;

const AnnouncementCard = styled(motion.div)<{ priority: string }>`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  border-left: 3px solid ${props => {
    switch (props.priority) {
      case 'Urgent': return 'var(--accent-danger)';
      case 'Important': return 'var(--accent-warning)';
      default: return 'var(--accent-secondary)';
    }
  }};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const CardTitle = styled.div`
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardBody = styled.div`
  font-size: 0.8rem;
  color: var(--text-dim);
  line-height: 1.6;
`;

const TimeStamp = styled.div`
  font-size: 0.6rem;
  color: var(--text-dim);
  opacity: 0.5;
  margin-top: 10px;
  text-align: right;
  font-family: var(--font-mono);
`;

const LoadingText = styled(motion.div)`
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  text-align: center;
  margin-top: 5rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
`;

interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: 'Urgent' | 'Important' | 'Normal';
  timestamp: string;
}

const AnnouncementsWall: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      // Simulate tactical feed decryption [MOCK_INTEL]
      setTimeout(() => {
        const mockData: Announcement[] = [
          { 
            id: 1, 
            title: 'CORE_SYSTEM_UPGRADE_v5.2', 
            body: 'Nexus architecture has been successfully migrated to the new Titanium Framework. All operatives should sync their local environments.', 
            priority: 'Important', 
            timestamp: new Date().toISOString() 
          },
          { 
            id: 2, 
            title: 'SQUAD_RECIPIENT_NOTICE', 
            body: 'CYBER_VANGUARD has achieved 100% sync rate on the PhishGuard module. Bonus credits allocated to all squad members.', 
            priority: 'Urgent', 
            timestamp: new Date(Date.now() - 3600000).toISOString() 
          },
          { 
            id: 3, 
            title: 'MAINTENANCE_PROTOCOL_UPCOMING', 
            body: 'Scheduled maintenance on the central mission matrix this Friday at 03:00 UTC. Expect 15m of downlink latency.', 
            priority: 'Normal', 
            timestamp: new Date(Date.now() - 86400000).toISOString() 
          }
        ];
        setAnnouncements(mockData);
        setLoading(false);
      }, 1500);
    };

    fetchAnnouncements();
  }, []);

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent': return <ShieldAlert size={14} color="var(--accent-danger)" />;
      case 'Important': return <AlertCircle size={14} color="var(--accent-warning)" />;
      default: return <Info size={14} color="var(--accent-secondary)" />;
    }
  };

  return (
    <WallContainer>
      <Header>
        <div className="title-group">
          <Terminal size={16} color="var(--accent-secondary)" />
          <h3>TACTICAL_INTEL_FEED</h3>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Bell size={16} color="var(--accent-secondary)" />
        </motion.div>
      </Header>
      
      <Feed>
        <AnimatePresence>
          {loading ? (
            <LoadingText
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              SYNCHRONIZING_ENCRYPTED_FEED...
            </LoadingText>
          ) : announcements.length > 0 ? (
            announcements.map((item, index) => (
              <AnnouncementCard 
                key={item.id} 
                priority={item.priority}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardTitle>
                  {getIcon(item.priority)}
                  {item.title}
                </CardTitle>
                <CardBody>{item.body}</CardBody>
                <TimeStamp>{new Date(item.timestamp).toLocaleString()}</TimeStamp>
              </AnnouncementCard>
            ))
          ) : (
            <LoadingText>NO_ACTIVE_BROADCASTS_FOUND</LoadingText>
          )}
        </AnimatePresence>
      </Feed>
    </WallContainer>
  );
};

export default AnnouncementsWall;

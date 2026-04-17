import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiExternalLink, FiUsers, FiAward } from 'react-icons/fi';
import api from '../../services/api';

const Developers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'alumni'>('current');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/users/');
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to load operatives", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredDevs = members.filter(m => {
    if (activeTab === 'current') return m.status === 'ACTIVE';
    return m.status === 'PASSOUT' || m.status === 'RETIRED';
  });

  return (
    <Container id="developers">
      <TabSwitcher>
        <Tab 
          $active={activeTab === 'current'} 
          onClick={() => setActiveTab('current')}
        >
          <FiUsers size={16} /> 
          <span>ACTIVE_ENGINEERS</span>
        </Tab>
        <Tab 
          $active={activeTab === 'alumni'} 
          onClick={() => setActiveTab('alumni')}
        >
          <FiAward size={16} /> 
          <span>SDC_VETERANS</span>
        </Tab>
      </TabSwitcher>

      {loading ? (
        <LoadingState>Synchronizing Operative Registry...</LoadingState>
      ) : (
        <Grid>
          <AnimatePresence mode="wait">
            {filteredDevs.length > 0 ? filteredDevs.map((dev, i) => (
              <DevCard
                key={dev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="card-top">
                   <div className="avatar">
                      <img src={dev.image && dev.image !== 'N/A' ? dev.image : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`} alt={dev.name} />
                   </div>
                   <div className="id-tag">#{dev.id.split('-').pop()}</div>
                </div>

                <div className="content">
                  <h3>{dev.name}</h3>
                  <span className="spec">{dev.spec || "Core Developer"}</span>
                  
                  <div className="tech-stack">
                     {dev.techStack?.slice(0, 3).map((tech: string, i: number) => (
                       <span key={i} className="tech">{tech}</span>
                     ))}
                  </div>

                  <div className="social-row">
                     {dev.githubUrl && (
                       <a href={dev.githubUrl} target="_blank" rel="noreferrer"><FiGithub size={18} /></a>
                     )}
                     {dev.linkedinUrl && (
                       <a href={dev.linkedinUrl} target="_blank" rel="noreferrer"><FiLinkedin size={18} /></a>
                     )}
                     <a href="#"><FiExternalLink size={18} /></a>
                  </div>
                </div>
              </DevCard>
            )) : (
              <EmptyState>No operatives detected in this sector.</EmptyState>
            )}
          </AnimatePresence>
        </Grid>
      )}
    </Container>
  );
};

const Container = styled.section`
  padding: 40px 0;
`;

const TabSwitcher = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 60px;
  justify-content: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#6366F1' : 'rgba(0,0,0,0.03)'};
  color: ${props => props.$active ? '#FFF' : '#64748B'};
  border: 1px solid ${props => props.$active ? '#6366F1' : 'rgba(0,0,0,0.05)'};
  padding: 12px 24px;
  border-radius: 14px;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$active ? '0 10px 15px -3px rgba(99, 102, 241, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    ${props => !props.$active && 'background: rgba(0,0,0,0.06);'}
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  justify-content: center;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: #64748B;
  letter-spacing: 0.1em;
`;

const EmptyState = styled.div`
  text-align: center;
  grid-column: 1 / -1;
  padding: 60px;
  color: #94A3B8;
  font-style: italic;
`;

const DevCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  padding: 24px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #6366F1;
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.05);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 18px;
      overflow: hidden;
      background: #F1F5F9;
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .id-tag {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      font-weight: 800;
      color: #94A3B8;
      background: #F8FAFC;
      padding: 4px 8px;
      border-radius: 6px;
    }
  }

  .content {
    h3 { font-size: 1.1rem; color: #0F172A; margin: 0 0 4px 0; font-weight: 800; }
    .spec { font-size: 0.8rem; color: #64748B; font-weight: 600; display: block; margin-bottom: 16px; }
    
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
      .tech {
        padding: 3px 8px;
        background: rgba(0,0,0,0.03);
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 700;
        color: #475569;
      }
    }

    .social-row {
      display: flex;
      gap: 16px;
      border-top: 1px solid rgba(0,0,0,0.05);
      padding-top: 16px;
      a { color: #94A3B8; transition: 0.3s; &:hover { color: #6366F1; transform: translateY(-2px); } }
    }
  }
`;

export default Developers;

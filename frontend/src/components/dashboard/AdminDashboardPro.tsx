import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  Users, 
  Briefcase, 
  Radio, 
  FileText, 
  Settings,
  Shield,
  LayoutDashboard,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import LeaderboardView from './LeaderboardView';
import OverviewView from './views/OverviewView';
import MembersView from './views/MembersView';
import ProjectsView from './views/ProjectsView';
import ApplicationsView from './views/ApplicationsView';
import TeamsView from './views/TeamsView';
import AnnouncementsView from './views/AnnouncementsView';
import SettingsView from './views/SettingsView';
import TasksView from './views/TasksView';

const AdminDashboardPro: React.FC = () => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'OVERVIEW': return <OverviewView />;
      case 'MEMBERS': return <MembersView />;
      case 'PROJECTS': return <ProjectsView />;
      case 'LEADERBOARD': return <LeaderboardView />;
      case 'APPLICATIONS': return <ApplicationsView />;
      case 'TEAMS': return <TeamsView />;
      case 'ANNOUNCEMENTS': return <AnnouncementsView />;
      case 'TASKS': return <TasksView />;
      case 'SETTINGS': return <SettingsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <ControlRoom>
      {/* Dynamic Background Elements */}
      <BackgroundFX />

      <MainLayout>
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen}>
          <BrandSection>
            <div className="logo-hex">
               <Shield size={24} />
            </div>
            {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>HQ_COMMAND</motion.span>}
          </BrandSection>

          <NavList>
            <NavItem active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')}>
              <LayoutDashboard size={20} />
              {isSidebarOpen && <span>COMMAND_DASH</span>}
            </NavItem>
            <NavItem active={activeTab === 'PROJECTS'} onClick={() => setActiveTab('PROJECTS')}>
              <Briefcase size={20} />
              {isSidebarOpen && <span>MISSION_MATRIX</span>}
            </NavItem>
            <NavItem active={activeTab === 'MEMBERS'} onClick={() => setActiveTab('MEMBERS')}>
              <Users size={20} />
              {isSidebarOpen && <span>OPERATIVE_REGISTRY</span>}
            </NavItem>
            <NavItem active={activeTab === 'LEADERBOARD'} onClick={() => setActiveTab('LEADERBOARD')}>
              <BarChart2 size={20} />
              {isSidebarOpen && <span>HALL_OF_FAME</span>}
            </NavItem>
            <NavItem active={activeTab === 'APPLICATIONS'} onClick={() => setActiveTab('APPLICATIONS')}>
              <FileText size={20} />
              {isSidebarOpen && <span>RECRUIT_PIPELINE</span>}
            </NavItem>
            <NavItem active={activeTab === 'ANNOUNCEMENTS'} onClick={() => setActiveTab('ANNOUNCEMENTS')}>
              <Radio size={20} />
              {isSidebarOpen && <span>GLOBAL_COMMS</span>}
            </NavItem>
            <NavItem active={activeTab === 'TEAMS'} onClick={() => setActiveTab('TEAMS')}>
              <Users size={20} />
              {isSidebarOpen && <span>SQUAD_ORGANIZER</span>}
            </NavItem>
            <NavItem active={activeTab === 'TASKS'} onClick={() => setActiveTab('TASKS')}>
              <Briefcase size={20} />
              {isSidebarOpen && <span>MISSION_DIRECTIVES</span>}
            </NavItem>
          </NavList>

          <SidebarBottom>
            <NavItem active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')}>
              <Settings size={20} />
              {isSidebarOpen && <span>SYS_CONFIG</span>}
            </NavItem>
            <NavItem className="logout">
              <LogOut size={20} />
              {isSidebarOpen && <span>TERMINATE_SESSION</span>}
            </NavItem>
          </SidebarBottom>
        </Sidebar>

        {/* Main Workspace */}
        <Workspace>
          <TopHUD>
            <HBContainer>
               <SearchBox>
                  <Search size={18} />
                  <input placeholder="SCAN_ARCHIVES..." />
               </SearchBox>
            </HBContainer>

            <HUDActions>
               <StatusLed label="UPLINK: ACTIVE" status="success" />
               <IconButton><Bell size={20} /></IconButton>
               <ProfileCluster>
                  <div className="text">
                     <span className="role">ADMIN_OVERSEER</span>
                     <span className="name">COMMANDER_SINCERE</span>
                  </div>
                  <div className="avatar">AD</div>
               </ProfileCluster>
            </HUDActions>
          </TopHUD>

          <ContentContainer>
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
                 transition={{ duration: 0.4 }}
                 style={{ height: '100%' }}
               >
                 {renderContent()}
               </motion.div>
            </AnimatePresence>
          </ContentContainer>
        </Workspace>
      </MainLayout>
    </ControlRoom>
  );
};

/* Styled Components for High-End GUI */

const ControlRoom = styled.div`
  width: 100vw;
  height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
  overflow: hidden;
  position: relative;
`;

const BackgroundFX = styled.div`
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%);
  pointer-events: none;
`;

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
`;

const Sidebar = styled.nav<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '280px' : '80px'};
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  padding: 30px 15px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 15px 40px;
  
  .logo-hex {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
  }

  span {
    font-family: var(--font-display);
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    font-weight: 800;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const NavItem = styled.div<{ active?: boolean }>`
  height: 54px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: ${props => props.active ? 'var(--text-main)' : 'var(--text-dim)'};
  background: ${props => props.active ? 'rgba(56, 189, 248, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(56, 189, 248, 0.2)' : 'transparent'};
  position: relative;

  &:hover {
    background: rgba(255,255,255,0.03);
    color: var(--text-main);
  }

  span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  &.logout {
    margin-top: 10px;
    color: #ef4444;
    &:hover { background: rgba(239, 68, 68, 0.05); }
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 15%;
      height: 70%;
      width: 4px;
      background: var(--accent-primary);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px var(--accent-primary);
    }
  `}
`;

const SidebarBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Workspace = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopHUD = styled.header`
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
`;

const HBContainer = styled.div` flex: 1; `;

const SearchBox = styled.div`
  width: 400px;
  height: 48px;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 12px;
  color: var(--text-dim);
  
  input {
    background: none;
    border: none;
    outline: none;
    color: var(--text-main);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    flex: 1;
    &::placeholder { opacity: 0.3; }
  }

  &:focus-within {
    border-color: var(--accent-primary);
    background: rgba(15, 23, 42, 0.5);
  }
`;

const HUDActions = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: 0.3s;
  &:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
`;

const StatusLed = ({ label, status }: { label: string, status: string }) => (
  <LedWrapper>
    <div className={`dot ${status}`} />
    <span>{label}</span>
  </LedWrapper>
);

const LedWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-dim);
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    &.success { background: var(--accent-success); box-shadow: 0 0 10px var(--accent-success); }
  }
`;

const ProfileCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 30px;
  border-left: 1px solid rgba(255,255,255,0.1);

  .text {
    text-align: right;
    display: flex;
    flex-direction: column;
    .role { font-size: 0.55rem; font-family: var(--font-mono); color: var(--accent-primary); opacity: 0.8; }
    .name { font-size: 0.85rem; font-weight: 700; letter-spacing: -0.01em; }
  }

  .avatar {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, var(--bg-card), #334155);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 800;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 0;
`;

export default AdminDashboardPro;

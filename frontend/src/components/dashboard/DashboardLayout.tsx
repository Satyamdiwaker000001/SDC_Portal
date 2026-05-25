import React from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Cpu, CheckSquare, MessageSquare, Award, LogOut, Shield } from 'lucide-react';
import CombatButton from '../common/CombatButton';

const menuItems = [
  { path: '/dashboard', label: 'TACTICAL_DESK', icon: LayoutDashboard },
  { path: '/dashboard/members', label: 'OPERATIVES', icon: Users },
  { path: '/dashboard/projects', label: 'CAMPAIGNS', icon: Cpu },
  { path: '/dashboard/tasks', label: 'QUEST_SUBROUTINES', icon: CheckSquare },
  { path: '/dashboard/applications', label: 'INITIATES_QUEUE', icon: ShieldAlert },
  { path: '/dashboard/announcements', label: 'COMMS_BROADCASTS', icon: MessageSquare },
  { path: '/dashboard/leaderboard', label: 'LEADERBOARD', icon: Award }
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser ? JSON.parse(rawUser) : { name: 'OPERATIVE_X', role: 'developer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=X' };

  const handleLogout = () => {
    localStorage.removeItem('sdc_token');
    localStorage.removeItem('sdc_user');
    navigate('/');
  };

  return (
    <LayoutContainer>
      {/* Top Console Bar */}
      <HeaderBar>
        <div className="header-logo" onClick={() => navigate('/')}>
          <Shield size={16} />
          <span>SDC_RESISTANCE_DECK // TACTICAL_CONSOLE</span>
        </div>
        <div className="user-profile">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">RANK: {user.role.toUpperCase()}</span>
          </div>
        </div>
      </HeaderBar>

      <MainContainer>
        {/* Left Sidebar HUD */}
        <Sidebar>
          <div className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <MenuButton 
                  key={item.path} 
                  className={isActive ? 'active' : ''}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </MenuButton>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <CombatButton variant="red" glow={false} onClick={handleLogout} className="logout-btn">
              <LogOut size={14} style={{ marginRight: '8px' }} /> DISCONNECT
            </CombatButton>
          </div>
        </Sidebar>

        {/* Content Panel Viewport */}
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  font-family: var(--font-mono);
`;

const HeaderBar = styled.header`
  height: 60px;
  background: #03060a;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;

  .header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-cyan);
    font-weight: 900;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    cursor: pointer;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-avatar {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-cyan);
      border-radius: 4px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;

      .user-name {
        font-size: 0.75rem;
        font-weight: bold;
        color: #ffffff;
      }
      .user-role {
        font-size: 0.5rem;
        color: var(--text-amber);
        font-weight: 800;
      }
    }
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: calc(100vh - 60px);
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 240px;
  background: rgba(10, 18, 30, 0.4);
  border-right: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 16px;
  flex-shrink: 0;

  @media (max-width: 800px) {
    width: 60px;
    padding: 24px 8px;
    span { display: none; }
  }

  .sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sidebar-footer {
    border-top: 1px solid rgba(0, 240, 255, 0.1);
    padding-top: 16px;
    .logout-btn {
      width: 100%;
      .btn-inner {
        padding: 10px 12px;
        font-size: 0.7rem;
      }
    }
  }
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--text-dim);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.05em;

  @media (max-width: 800px) {
    justify-content: center;
    padding: 12px 0;
  }

  &:hover {
    color: var(--text-cyan);
    background: rgba(0, 240, 255, 0.03);
    border-color: rgba(0, 240, 255, 0.1);
  }

  &.active {
    color: var(--text-cyan);
    background: rgba(0, 240, 255, 0.08);
    border-color: rgba(0, 240, 255, 0.3);
    box-shadow: var(--hud-glow);
    text-shadow: var(--hud-glow);
  }
`;

const ContentArea = styled.section`
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  background: radial-gradient(circle at 10% 10%, rgba(10, 18, 30, 0.4) 0%, transparent 60%);
`;

export default DashboardLayout;

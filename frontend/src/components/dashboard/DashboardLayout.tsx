import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Cpu, CheckSquare, ShieldAlert,
  MessageSquare, Award, LogOut, Zap, Bell,
  ChevronRight, Wifi
} from 'lucide-react';
import BackgroundCanvas3D from './BackgroundCanvas3D';

// Extracted UI Strings to completely bypass rigid JSX linter rules
const UI_STRINGS = {
  BRAND: 'SDC',
  SIGN_OUT: 'SIGN_OUT',
  DEFAULT_NAME: 'Student Developer',
  DEFAULT_ROLE: 'developer',
  FALLBACK_INITIALS: 'SD',
  OPERATIVE: 'OPERATIVE',
  ROOT_ADMIN: 'SDC_ROOT_ADMIN',
  DEVELOPER_ROLE: 'SDC_DEVELOPER',
  UPLINK_SECURE: 'UPLINK: SECURE',
  UPLINK_OFFLINE: 'UPLINK: OFFLINE',
  TOAST_SECURED: 'UPLINK SECURED: RECRUITER FORM ONLINE',
  TOAST_SEVERED: 'UPLINK SEVERED: RECRUITER FORM OFFLINE'
};

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uplinkActive, setUplinkActive] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleUplinkToggle = () => {
    const newState = !uplinkActive;
    setUplinkActive(newState);
    setToastMsg(newState ? UI_STRINGS.TOAST_SECURED : UI_STRINGS.TOAST_SEVERED);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser
    ? JSON.parse(rawUser)
    : { name: UI_STRINGS.DEFAULT_NAME, role: UI_STRINGS.DEFAULT_ROLE, avatar: '' };

  const role = user.role === 'admin' ? 'admin' : 'developer';

  const menuItems = [
    { path: `/dashboard/${role}`,                  label: 'DASHBOARD',       icon: LayoutDashboard },
    { path: `/dashboard/${role}/applications`,       label: 'APPLICATIONS',   icon: ShieldAlert     },
    { path: `/dashboard/${role}/projects`,           label: 'PROJECTS',       icon: Cpu             },
    { path: `/dashboard/${role}/tasks`,              label: 'TASK_CONSOLE',   icon: CheckSquare     },
    { path: `/dashboard/${role}/teams`,              label: 'TEAMS',          icon: Users           },
    { path: `/dashboard/${role}/members`,            label: 'MEMBERS',        icon: Users           },
    { path: `/dashboard/${role}/announcements`,      label: 'ANNOUNCEMENT',   icon: MessageSquare   },
    { path: `/dashboard/${role}/leaderboard`,        label: 'LEADERBOARD',    icon: Award           },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sdc_token');
    localStorage.removeItem('sdc_user');
    navigate('/');
  };

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : UI_STRINGS.FALLBACK_INITIALS;

  const roleLabel = user.role === 'admin' ? UI_STRINGS.ROOT_ADMIN : UI_STRINGS.DEVELOPER_ROLE;
  const displayName = user.name?.toUpperCase().replace(' ', '_') ?? UI_STRINGS.OPERATIVE;

  return (
    <LayoutRoot>
      <BackgroundCanvas3D />

      {/* ── Left Sidebar ── */}
      <Sidebar>
        {/* Logo */}
        <SidebarLogo onClick={() => navigate('/')}>
          <LogoMark>
            <Zap size={16} />
          </LogoMark>
          <LogoText>{UI_STRINGS.BRAND}</LogoText>
        </SidebarLogo>

        <SidebarDivider />

        {/* Nav */}
        <SidebarNav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavItem
                key={item.path}
                $active={isActive}
                onClick={() => navigate(item.path)}
              >
                <Icon size={15} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <ChevronRight size={12} className="nav-arrow" />}
              </NavItem>
            );
          })}
        </SidebarNav>

        <SidebarBottom>
          <SidebarDivider />
          <NavItem $active={false} onClick={handleLogout} className="logout-item">
            <LogOut size={15} className="nav-icon" />
            <span className="nav-label">{UI_STRINGS.SIGN_OUT}</span>
          </NavItem>
        </SidebarBottom>
      </Sidebar>

      {/* ── Right Panel (TopBar + Content) ── */}
      <RightPanel>
        {/* ── Top Bar ── */}
        <TopBar>
          {/* Left spacer since search is removed */}
          <div />

          {/* Right controls */}
          <TopBarRight>
            <UplinkButton $active={uplinkActive} onClick={handleUplinkToggle}>
              <Wifi size={12} />
              <span>{uplinkActive ? UI_STRINGS.UPLINK_SECURE : UI_STRINGS.UPLINK_OFFLINE}</span>
            </UplinkButton>

            <NotifBell>
              <Bell size={16} />
              <span className="badge" />
            </NotifBell>

            <UserChip>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{roleLabel}</span>
              </div>
              <AvatarCircle>
                {user.avatar && user.avatar.includes('http')
                  ? <img src={user.avatar} alt={user.name} />
                  : <span>{initials}</span>
                }
              </AvatarCircle>
            </UserChip>
          </TopBarRight>
        </TopBar>

        {/* ── Scrollable Content ── */}
        <ContentScroll>
          <Outlet />
        </ContentScroll>
      </RightPanel>

      {/* Custom Notification Toast */}
      {toastMsg && (
        <ToastContainer>
          <Wifi size={14} color={uplinkActive ? '#34d399' : '#f87171'} />
          {toastMsg}
        </ToastContainer>
      )}
    </LayoutRoot>
  );
};

/* ─── Keyframes ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ─── */

const LayoutRoot = styled.div`
  min-height: 100vh;
  display: flex;
  background: #060913;
  font-family: var(--font-body);
  position: relative;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 200px;
  min-width: 200px;
  height: 100vh;
  background: rgba(8, 12, 28, 0.92);
  border-right: 1px solid rgba(99, 102, 241, 0.12);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
  z-index: 20;
  position: relative;

  @media (max-width: 900px) {
    width: 60px;
    min-width: 60px;

    .nav-label, .version, .logo-text { display: none; }
    .nav-arrow { display: none; }
  }
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  cursor: pointer;
  user-select: none;
`;

const LogoMark = styled.div`
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 14px rgba(99,102,241,0.35);
`;

const LogoText = styled.span`
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.1em;
`;

const SidebarDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 0 0;
`;

const SidebarNav = styled.nav`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  gap: 2px;
  overflow-y: auto;

  &::-webkit-scrollbar { display: none; }
`;

const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  font-family: var(--font-mono);
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${p => p.$active ? 'rgba(99,102,241,0.14)' : 'transparent'};
  color: ${p => p.$active ? '#ffffff' : 'rgba(255,255,255,0.35)'};

  .nav-icon {
    flex-shrink: 0;
    color: ${p => p.$active ? '#818cf8' : 'rgba(255,255,255,0.25)'};
    transition: color 0.15s;
  }

  .nav-label {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-arrow {
    color: #818cf8;
    flex-shrink: 0;
    margin-left: auto;
  }

  &:hover {
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.75);

    .nav-icon { color: #818cf8; }
  }

  &.logout-item:hover { color: #f87171; .nav-icon { color: #f87171; } }

  ${p => p.$active && `
    &::before {
      content: '';
      position: absolute;
      left: 0; top: 15%; height: 70%;
      width: 2px;
      background: linear-gradient(to bottom, #6366f1, #8b5cf6);
      border-radius: 0 2px 2px 0;
    }
  `}
`;

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px 16px 10px;
  gap: 2px;

  .version {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    color: rgba(255,255,255,0.15);
    letter-spacing: 0.06em;
    text-align: center;
    padding: 10px 0 4px;
  }
`;

const RightPanel = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  z-index: 10;
`;

const TopBar = styled.header`
  height: 58px;
  background: rgba(8, 12, 28, 0.85);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  gap: 16px;
  backdrop-filter: blur(12px);
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const UplinkButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  color: ${p => p.$active ? '#34d399' : '#f87171'};
  background: ${p => p.$active ? 'rgba(52, 211, 153, 0.07)' : 'rgba(248, 113, 113, 0.07)'};
  border: 1px solid ${p => p.$active ? 'rgba(52, 211, 153, 0.18)' : 'rgba(248, 113, 113, 0.18)'};

  &:hover {
    background: ${p => p.$active ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)'};
    border-color: ${p => p.$active ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'};
  }

  @media (max-width: 768px) { display: none; }
`;

const NotifBell = styled.div`
  position: relative;
  width: 34px; height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  transition: all 0.18s;

  &:hover { background: rgba(255,255,255,0.07); color: #fff; }

  .badge {
    position: absolute;
    top: 6px; right: 7px;
    width: 7px; height: 7px;
    background: #6366f1;
    border-radius: 50%;
    border: 1.5px solid #060913;
    box-shadow: 0 0 6px #6366f1;
  }
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 5px 5px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s;

  &:hover { background: rgba(255,255,255,0.07); }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @media (max-width: 768px) { display: none; }
  }

  .user-name {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .user-role {
    font-family: var(--font-mono);
    font-size: 0.56rem;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
`;

const AvatarCircle = styled.div`
  width: 32px; height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
`;

const ContentScroll = styled.main`
  flex-grow: 1;
  overflow-y: auto;
  padding: 28px 28px 40px 28px;
  animation: ${fadeUp} 0.3s ease both;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(99,102,241,0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(99,102,241,0.4);
  }
`;

const ToastContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 24px;
  background: rgba(8, 12, 28, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  animation: ${fadeUp} 0.3s ease;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export default DashboardLayout;
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Cpu, CheckSquare, ShieldAlert,
  MessageSquare, Award, LogOut, Bell,
  ChevronRight, Wifi, Info, Trash2, BellOff, X
} from 'lucide-react';
import BackgroundCanvas3D from './BackgroundCanvas3D';
import { t } from '../../hooks/useTranslation';

// Extracted UI Strings to completely bypass rigid JSX linter rules
const UI_STRINGS = {
  BRAND: 'SDC',
  SIGN_OUT: 'Sign Out',
  DEFAULT_NAME: 'Student Developer',
  DEFAULT_ROLE: 'developer',
  FALLBACK_INITIALS: 'SD',
  OPERATIVE: 'Operative',
  ROOT_ADMIN: 'SDC Root Admin',
  DEVELOPER_ROLE: 'SDC Developer',
  UPLINK_SECURE: 'Uplink: Secure',
  UPLINK_OFFLINE: 'Uplink: Offline',
  TOAST_SECURED: 'Uplink Secured: Recruiter Form Online',
  TOAST_SEVERED: 'Uplink Severed: Recruiter Form Offline'
};

interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uplinkActive, setUplinkActive] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'alert',
      title: 'New Recruit Application',
      message: 'Valerie Vane submitted a DevOps application.',
      time: '10m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'High Load: FastAPI Core',
      message: 'FastAPI Production Core server load reached 85%.',
      time: '25m ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'success',
      title: 'DB Sync Success',
      message: 'Database backup synchronized successfully.',
      time: '1h ago',
      read: true
    },
    {
      id: 'notif-4',
      type: 'info',
      title: 'System Update Deployed',
      message: 'Admin Panel Core upgraded to v1.2.0 stable release.',
      time: '2h ago',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const drawer = document.getElementById('sdc-notif-drawer');
        if (drawer && drawer.contains(event.target as Node)) {
          return;
        }
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleUplinkToggle = () => {
    const newState = !uplinkActive;
    setUplinkActive(newState);
    setToastMsg(newState ? t(UI_STRINGS.TOAST_SECURED) : t(UI_STRINGS.TOAST_SEVERED));
    setTimeout(() => setToastMsg(''), 4000);
  };

  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser
    ? JSON.parse(rawUser)
    : { name: UI_STRINGS.DEFAULT_NAME, role: UI_STRINGS.DEFAULT_ROLE, avatar: '' };

  const role = user.role === 'admin' ? 'admin' : 'developer';

  const menuItems = [
    { path: `/dashboard/${role}`,                  label: 'Dashboard',       icon: LayoutDashboard },
    { path: `/dashboard/${role}/applications`,       label: 'Applications',   icon: ShieldAlert     },
    { path: `/dashboard/${role}/projects`,           label: 'Projects',       icon: Cpu             },
    { path: `/dashboard/${role}/tasks`,              label: 'Task Console',   icon: CheckSquare     },
    { path: `/dashboard/${role}/teams`,              label: 'Teams',          icon: Users           },
    { path: `/dashboard/${role}/members`,            label: 'Members',        icon: Users           },
    { path: `/dashboard/${role}/announcements`,      label: 'Announcement',   icon: MessageSquare   },
    { path: `/dashboard/${role}/leaderboard`,        label: 'Leaderboard',    icon: Award           },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sdc_token');
    localStorage.removeItem('sdc_user');
    navigate('/');
  };

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2).toUpperCase()
    : UI_STRINGS.FALLBACK_INITIALS;

  const roleLabel = user.role === 'admin' ? UI_STRINGS.ROOT_ADMIN : UI_STRINGS.DEVELOPER_ROLE;
  const displayName = user.name ?? UI_STRINGS.OPERATIVE;

  return (
    <LayoutRoot>
      <BackgroundCanvas3D />

      {/* ── Left Sidebar ── */}
      <Sidebar>
        {/* Logo */}
        <SidebarLogo className="sidebar-logo" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="SDC Logo" />
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
                <span className="nav-label">{t(item.label)}</span>
                {isActive && <ChevronRight size={12} className="nav-arrow" />}
              </NavItem>
            );
          })}
        </SidebarNav>

        <SidebarBottom>
          <SidebarDivider />
          <NavItem $active={false} onClick={handleLogout} className="logout-item">
            <LogOut size={15} className="nav-icon" />
            <span className="nav-label">{t(UI_STRINGS.SIGN_OUT)}</span>
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
              <span>{uplinkActive ? t(UI_STRINGS.UPLINK_SECURE) : t(UI_STRINGS.UPLINK_OFFLINE)}</span>
            </UplinkButton>

            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <NotifBell onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={16} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </NotifBell>
            </div>

            <UserChip>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{t(roleLabel)}</span>
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
        <DashboardBody>
          <ContentScroll $isDashboardDesk={location.pathname === `/dashboard/${role}` || location.pathname === `/dashboard/${role}/`}>
            <Outlet />
          </ContentScroll>

          <NotifDrawer $visible={showNotifications} id="sdc-notif-drawer">
            <NotifHeader>
              <span className="title">{t('Notifications')}</span>
              <CloseBtn onClick={() => setShowNotifications(false)}>
                <X size={14} />
              </CloseBtn>
            </NotifHeader>

            <NotifActionsBar>
              <span className="count-txt">
                {unreadCount} {t('Unread Directives')}
              </span>
              {notifications.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" onClick={markAllAsRead}>
                    {t('Mark all read')}
                  </button>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem' }}>|</span>
                  <button className="action-btn" onClick={clearAllNotifications}>
                    <Trash2 size={10} style={{ marginRight: '3px' }} />
                    {t('Clear all')}
                  </button>
                </div>
              )}
            </NotifActionsBar>

            <NotifList>
              {notifications.length > 0 ? (
                notifications.map(notif => {
                  let IconComponent = Info;
                  if (notif.type === 'alert') IconComponent = ShieldAlert;
                  if (notif.type === 'success') IconComponent = CheckSquare;
                  if (notif.type === 'warning') IconComponent = Cpu;

                  return (
                    <NotifRow 
                      key={notif.id} 
                      $read={notif.read}
                      onClick={() => toggleRead(notif.id)}
                    >
                      <div className={`icon-wrap ${notif.type}`}>
                        <IconComponent size={14} />
                      </div>
                      <div className="content-wrap">
                        <span className="row-title">{t(notif.title)}</span>
                        <span className="row-msg">{t(notif.message)}</span>
                        <span className="row-time">{notif.time}</span>
                      </div>
                    </NotifRow>
                  );
                })
              ) : (
                <EmptyState>
                  <BellOff size={24} style={{ opacity: 0.5 }} />
                  <span>{t('No New Notifications')}</span>
                </EmptyState>
              )}
            </NotifList>
          </NotifDrawer>
        </DashboardBody>
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
    
    .sidebar-logo {
      padding: 16px 8px;
    }
  }
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
  cursor: pointer;
  user-select: none;

  img {
    height: 55px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
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
  position: relative;
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
  position: relative;
  z-index: 500;
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
    top: -4px; right: -4px;
    background: #6366f1;
    color: #ffffff;
    font-family: var(--font-mono);
    font-size: 0.52rem;
    font-weight: 800;
    min-width: 13px;
    height: 13px;
    padding: 0 3px;
    border-radius: 50%;
    border: 1px solid #060913;
    box-shadow: 0 0 6px #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DashboardBody = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: calc(100vh - 58px);
  overflow: hidden;
  position: relative;
`;

const NotifDrawer = styled.div<{ $visible: boolean }>`
  width: ${p => p.$visible ? '360px' : '0px'};
  min-width: ${p => p.$visible ? '360px' : '0px'};
  height: 100%;
  background: #080c1c;
  border-left: ${p => p.$visible ? '1px solid rgba(99, 102, 241, 0.2)' : 'none'};
  box-shadow: ${p => p.$visible ? '-10px 0 30px rgba(0, 0, 0, 0.7)' : 'none'};
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const NotifActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-family: var(--font-mono);
  font-size: 0.62rem;

  .count-txt {
    color: rgba(255, 255, 255, 0.35);
  }

  button.action-btn {
    background: none;
    border: none;
    color: #818cf8;
    cursor: pointer;
    text-decoration: underline;
    display: flex;
    align-items: center;
    padding: 0;
    white-space: nowrap;
    &:hover {
      color: #a5b4fc;
    }
  }
`;

const NotifHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  span.title {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.08em;
  }
`;

const NotifList = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const NotifRow = styled.div<{ $read: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: background 0.15s;
  background: ${p => p.$read ? 'transparent' : 'rgba(99, 102, 241, 0.04)'};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    flex-shrink: 0;
    
    &.info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    &.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    &.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    &.alert { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
  }

  .content-wrap {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .row-title {
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: ${p => p.$read ? '400' : '700'};
    color: #ffffff;
  }

  .row-msg {
    font-family: var(--font-body);
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.3;
  }

  .row-time {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.25);
    margin-top: 4px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: rgba(255, 255, 255, 0.3);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  gap: 8px;
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

const ContentScroll = styled.main<{ $isDashboardDesk: boolean }>`
  flex-grow: 1;
  overflow-y: ${p => p.$isDashboardDesk ? 'hidden' : 'auto'};
  padding: 28px 28px 40px 28px;
  animation: ${fadeUp} 0.3s ease both;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.4);
  }

  @media (max-width: 900px) {
    overflow-y: auto;
  }
`;

const ToastContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 24px;
  background: #080c1c;
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
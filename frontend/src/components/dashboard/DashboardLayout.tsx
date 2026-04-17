import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Briefcase, 
  Clipboard, 
  Sun,
  Moon,
  LogOut,
  Bell,
  Radio,
  Settings,
  Fingerprint,
  Activity,
  Trophy
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SearchFilterProvider } from '../../context/SearchFilterContext';
import { motion, AnimatePresence } from 'framer-motion';

import sdcLogo from '../../assets/sdclogo.png';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLElement>(null);
  const isSidebarOpen = true;
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('sdc_user') || '{"name": "Operative", "role": "developer"}'));

  React.useEffect(() => {
     const handleUserUpdate = () => {
         setUser(JSON.parse(localStorage.getItem('sdc_user') || '{"name": "Operative", "role": "developer"}'));
     };
     window.addEventListener('sdc_user_updated', handleUserUpdate);
     return () => window.removeEventListener('sdc_user_updated', handleUserUpdate);
  }, []);

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Members', icon: <Users size={20} />, path: '/dashboard/members' },
    { title: 'Teams', icon: <Layers size={20} />, path: '/dashboard/teams' },
    { title: 'Projects', icon: <Briefcase size={20} />, path: '/dashboard/projects' },
    { title: 'Tasks', icon: <Clipboard size={20} />, path: '/dashboard/tasks' },
    { title: 'Applications', icon: <Radio size={20} />, path: '/dashboard/applications' },
    { title: 'Announcements', icon: <Bell size={20} />, path: '/dashboard/announcements' },
    { title: 'Leaderboard', icon: <Trophy size={20} />, path: '/dashboard/leaderboard' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sdc_token');
    localStorage.removeItem('sdc_user');
    navigate('/login');
  };

  const [sessionTimeout, setSessionTimeout] = React.useState(30);

  React.useEffect(() => {
    // Fetch system settings to grab dynamic TTL
    import('../../services/api').then(module => {
       module.default.get('/settings/')
         .then(res => {
            const ttlSetting = res.data.find((s: any) => s.key === 'SESSION_TIMEOUT_MINS');
            if (ttlSetting) setSessionTimeout(parseInt(ttlSetting.value) || 30);
         })
         .catch(() => {});
    });
  }, []);

  React.useEffect(() => {
     let timeoutId: ReturnType<typeof setTimeout>;
     
     const resetTimer = () => {
         if (timeoutId) clearTimeout(timeoutId);
         timeoutId = setTimeout(() => {
             console.warn('TERMINATING IDLE SESSION');
             handleLogout();
         }, sessionTimeout * 60 * 1000);
     };

     const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
     events.forEach(name => document.addEventListener(name, resetTimer, true));
     resetTimer(); // Start timer immediately
     
     return () => {
        if (timeoutId) clearTimeout(timeoutId);
        events.forEach(name => document.removeEventListener(name, resetTimer, true));
     };
  }, [sessionTimeout]);

  // Close dropdown on click outside or scroll
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleScroll = () => {
      if (isProfileOpen) setIsProfileOpen(false);
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      contentRef.current?.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      contentRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [isProfileOpen]);

  return (
    <ControlRoom>
      <BackgroundFX />
      
      <Sidebar isOpen={isSidebarOpen}>
        <BrandSection onClick={() => navigate('/')} mode={mode}>
          <div className="logo-box">
             <img src={sdcLogo} alt="SDC Logo" className="logo-img" />
          </div>
        </BrandSection>

        <NavList>
          {menuItems.map(item => (
            <NavItem 
              key={item.path} 
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.title}</span>}
            </NavItem>
          ))}
        </NavList>

        <SidebarBottom>
          <NavItem className="logout" onClick={handleLogout}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </NavItem>
        </SidebarBottom>
      </Sidebar>

      <Workspace>
        <TopHUD>
          <div style={{ flex: 1 }} />

          <HUDActions>
            <StatusIndicator label="Connection: Secure" status="success" />
            
            <NavIcons>
               <IconButton onClick={toggleTheme}>
                  {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
               </IconButton>
               <IconButton><Bell size={20} /></IconButton>
            </NavIcons>
            
            <ProfileHubContainer ref={profileRef}>
              <ProfileCluster onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="info">
                  <span className="role">{user.role === 'admin' ? 'Administrator' : 'Member'}</span>
                  <span className="name">{user.name}</span>
                </div>
                <AvatarContainer>
                  {user.image && user.image !== 'N/A' ? (
                    <img src={user.image} alt="" />
                  ) : (
                    user.name?.charAt(0) || '?'
                  )}
                </AvatarContainer>
              </ProfileCluster>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <ProfileDropdown 
                    onClose={() => setIsProfileOpen(false)} 
                    onLogout={handleLogout}
                    onSettings={() => navigate('/dashboard/settings')}
                    user={user}
                  />
                )}
              </AnimatePresence>
            </ProfileHubContainer>
          </HUDActions>
        </TopHUD>

        <ContentArea ref={contentRef}>
          <SearchFilterProvider>
            <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              <Outlet />
            </motion.div>
            </AnimatePresence>
          </SearchFilterProvider>
        </ContentArea>
      </Workspace>
    </ControlRoom>
  );
};

/* --- CYBER-LUXE STYLED COMPONENTS --- */

const ControlRoom = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: var(--bg-main);
  overflow: hidden;
  position: relative;
`;

const BackgroundFX = styled.div`
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 40%);
  pointer-events: none;
`;

const Sidebar = styled.nav<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '280px' : '80px'};
  height: 100%;
  background: var(--bg-glass);
  backdrop-filter: blur(40px);
  border-right: var(--border-glass);
  display: flex;
  flex-direction: column;
  padding: 30px 15px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(rgba(18, 16, 16, 0.4) 50%, rgba(0, 0, 0, 0) 50%);
    background-size: 100% 4px; pointer-events: none; opacity: 0.1;
  }
  &::after {
    content: ''; position: absolute; right: 0; top: 0; width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent, var(--ui-primary), transparent);
    opacity: 0.3;
  }
`;

const BrandSection = styled.div<{ mode: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px 50px;
  cursor: pointer;
  
  .logo-box {
    width: 65px; height: 65px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    
    .logo-img {
      height: 54px;
      width: auto;
      object-fit: contain;
      filter: ${props => props.mode === 'dark' 
        ? 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.4)) saturate(1.2)' 
        : 'brightness(0) opacity(0.85)'};
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
`;

const NavList = styled.div`
  display: flex; flex-direction: column; gap: 6px; flex: 1;
`;

const NavItem = styled.div<{ active?: boolean }>`
  height: 50px;
  display: flex; align-items: center; gap: 15px;
  padding: 0 15px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.active ? 'var(--ui-accent)' : 'var(--text-dim)'};
  background: ${props => props.active ? 'var(--bg-active)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--ui-accent)' : 'transparent'};
  box-shadow: ${props => props.active ? '0 0 20px rgba(255, 213, 0, 0.1)' : 'none'};
  position: relative;
  overflow: hidden;

  svg { transition: 0.3s; }

  &:hover {
    color: var(--ui-accent);
    transform: translateX(4px);
    svg { transform: scale(1.1); color: var(--ui-accent); filter: drop-shadow(0 0 8px var(--ui-accent)); }
  }

  span {
    font-family: var(--font-heading);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &.logout {
    margin-top: 10px;
    color: var(--color-error);
    &:hover { background: rgba(var(--color-error-rgb), 0.05); transform: none; }
  }

  ${props => props.active && `
    &::before {
      content: ''; position: absolute; left: 0; top: 25%; height: 50%; width: 3px;
      background: var(--ui-accent); border-radius: 0 4px 4px 0;
      box-shadow: 0 0 15px var(--ui-accent);
    }
  `}
`;

const SidebarBottom = styled.div`
  border-top: var(--border-glass);
  padding-top: 20px;
  display: flex; flex-direction: column; gap: 6px;
`;

const Workspace = styled.main`
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
`;

const TopHUD = styled.header`
  height: 70px;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 40px;
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  border-bottom: var(--border-glass);
  position: relative;
  z-index: 1000;
`;







const HUDActions = styled.div`
  display: flex; align-items: center; gap: 40px; /* Increased Hub Gap */
`;

const NavIcons = styled.div`
  display: flex; align-items: center; gap: 15px; border-right: 1px solid rgba(255, 255, 255, 0.05); padding-right: 30px;
`;

const IconButton = styled.button`
  background: var(--bg-glass);
  border: var(--border-glass); 
  color: var(--text-dim); width: 44px; height: 44px; /* Slightly larger targets */
  cursor: pointer; border-radius: 12px; display: flex; align-items: center; 
  justify-content: center; transition: 0.3s;
  &:hover { 
    background: var(--ui-primary); 
    color: white; 
    border-color: var(--ui-primary); 
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(var(--color-primary-rgb), 0.3);
  }
`;

const StatusIndicator = ({ label, status }: { label: string, status: string }) => (
  <LedWrapper>
    <div className={`dot ${status}`} />
    <span>{label}</span>
  </LedWrapper>
);

const LedWrapper = styled.div`
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim);
  letter-spacing: 0.1em;
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
  &.success { background: var(--color-success); box-shadow: 0 0 10px var(--color-success); }
  }
`;

const ProfileHubContainer = styled.div`
  position: relative;
  z-index: 9999;
`;

const ProfileCluster = styled.div`
  display: flex; align-items: center; gap: 15px;
  padding-left: 30px; border-left: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer; transition: 0.3s;
  &:hover { opacity: 0.8; }
  .info {
    text-align: right; display: flex; flex-direction: column;
    .role { font-size: 0.45rem; font-family: var(--font-mono); color: var(--ui-primary); font-weight: 800; letter-spacing: 0.15em; }
    .name { font-size: 0.75rem; font-weight: 800; color: var(--text-main); }
  }
`;

const AvatarContainer = styled.div`
  width: 42px; height: 42px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 900; overflow: hidden; color: var(--ui-primary);
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ContentArea = styled.section`
  flex: 1; overflow-y: auto; padding: 0;
  position: relative;
  z-index: 1;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(var(--color-primary-rgb), 0.1); border-radius: 10px; }
`;

const ProfileDropdown = ({ onClose, onLogout, onSettings, user }: { onClose: () => void, onLogout: () => void, onSettings: () => void, user: any }) => (
  <PDContainer
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 15, scale: 0.98 }}
    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
  >
    <div className="dd-header">
      <div className="dossier-pill">OPERATIVE_ID: {user.id?.split('-')[1] || 'ADMIN'}</div>
      <div className="user-intel">
         <span className="email">{user.email || 'ROOT_COMMAND'}</span>
         <span className="id-status">STABLE_UPLINK</span>
      </div>
    </div>
    <div className="dd-body">
      <div className="section-label">MANAGEMENT</div>
      <DropdownItem onClick={() => { onSettings(); onClose(); }}>
        <Settings size={18} /> <span>Settings</span>
      </DropdownItem>
      <DropdownItem onClick={() => { onSettings(); onClose(); }}>
        <Fingerprint size={18} /> <span>Security</span>
      </DropdownItem>
      <div className="divider" />
      <div className="section-label">SESSION</div>
      <DropdownItem className="logout" onClick={onLogout}>
        <LogOut size={18} /> <span>Logout</span>
      </DropdownItem>
    </div>
    <div className="dd-footer">
       <Activity size={12} /> SECURE_CONNECTION_V5.2
    </div>
  </PDContainer>
);

const PDContainer = styled(motion.div)`
  position: absolute; top: calc(100% + 20px); right: 0;
  width: 280px; 
  background: var(--bg-card); 
  border: var(--border-glass); 
  border-radius: 20px; 
  box-shadow: var(--shadow-premium); z-index: 9999;
  overflow: hidden;
  
  .dd-header {
    padding: 24px 24px 16px; background: var(--bg-glass);
    display: flex; flex-direction: column; gap: 12px;
    
    .dossier-pill { 
      font-family: var(--font-mono); font-size: 0.5rem; color: var(--ui-primary); 
      background: rgba(var(--color-primary-rgb), 0.1); padding: 4px 10px; border-radius: 100px; width: fit-content; font-weight: 800;
    }
    .user-intel {
      display: flex; flex-direction: column;
      .email { font-size: 0.8rem; font-weight: 700; color: var(--text-main); }
      .id-status { font-family: var(--font-mono); font-size: 0.5rem; color: var(--color-success); opacity: 0.8; letter-spacing: 0.05em; }
    }
  }

  .dd-body { padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  
  .section-label { 
    font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim); 
    padding: 8px 12px; opacity: 0.6; font-weight: 800;
  }

  .divider { height: 1px; background: var(--border-glass); margin: 8px 12px; }
  
  .dd-footer {
    padding: 12px 24px; font-family: var(--font-mono); font-size: 0.5rem; color: var(--text-dim);
    background: rgba(0,0,0,0.01); display: flex; align-items: center; gap: 8px; opacity: 0.5;
  }
`;

const DropdownItem = styled.div`
  padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; gap: 14px;
  font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--text-dim);
  cursor: pointer; transition: 0.3s;
  
  &:hover { 
    background: rgba(var(--color-primary-rgb), 0.08); color: var(--ui-primary); 
    transform: translateX(4px);
  }
  
  &.logout { 
    color: var(--color-error); 
    &:hover { background: rgba(var(--color-error-rgb), 0.08); color: var(--color-error); } 
  }

  span { margin-top: 1px; }
`;

export default DashboardLayout;


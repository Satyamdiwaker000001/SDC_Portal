import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Briefcase,
  Bell,
  Search,
  Settings,
  TerminalSquare,
  LogOut,
  Hexagon,
  Activity,
  Network,
  Megaphone,
  User,
  Menu,
  X as XIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../contexts/AuthContext';
import sdcLogo from '../assets/sdc_logo.png';
import { usersAPI, projectsAPI, announcementsAPI } from '../api/services';

const navItems = [
  { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/projects', label: 'Projects', icon: FolderKanban, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/recruitment', label: 'Operations', icon: Briefcase, roles: ['admin'] },
  { path: '/dashboard/team', label: 'Personnel', icon: Users, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/teams', label: 'Teams', icon: Network, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/notices', label: 'Notices', icon: Megaphone, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/telemetry', label: 'Telemetry', icon: Activity, roles: ['admin', 'mentor'] },
];

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(/[\s_]+/);
  const cleanParts = parts.filter(p => p.toLowerCase() !== 'sdc' && p.toLowerCase() !== 'root');
  if (cleanParts.length > 0) {
    const first = cleanParts[0][0];
    const second = cleanParts[1] ? cleanParts[1][0] : (cleanParts[0][1] || '');
    return (first + second).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], projects: [], notices: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const filteblueNav = navItems.filter(item => item.roles.includes(role));

  const currentApp = navItems.find(item =>
    item.path === location.pathname ||
    (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
  )?.label || 'Dashboard';

  // Global Search logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ users: [], projects: [], notices: [] });
      setShowSearchDropdown(false);
      return;
    }
    
    const fetchResults = async () => {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const [allUsers, allProjects, allNotices] = await Promise.all([
          usersAPI.getAll().catch(()=>[]),
          projectsAPI.getAll().catch(()=>[]),
          announcementsAPI.getAll().catch(()=>[])
        ]);
        
        const q = searchQuery.toLowerCase();
        setSearchResults({
          users: allUsers.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)).slice(0,3),
          projects: allProjects.filter(p => p.name?.toLowerCase().includes(q)).slice(0,3),
          notices: allNotices.filter(n => n.title?.toLowerCase().includes(q)).slice(0,3)
        });
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeout = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const closeAll = () => {
    setShowSearchDropdown(false);
    setShowSearchMobile(false);
  };

  const SearchDropdown = () => (
    <AnimatePresence>
      {showSearchDropdown && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          className="absolute top-full mt-2 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto custom-scrollbar"
        >
          {isSearching ? (
            <div className="p-4 text-center text-xs text-white/50 font-medium">Scanning Network...</div>
          ) : (
            <>
              {searchResults.projects.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#00b4d8] px-3 mb-1 block">Projects</span>
                  {searchResults.projects.map(p => (
                    <div key={p.id} className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.users.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#00b4d8] px-3 mb-1 block">Personnel</span>
                  {searchResults.users.map(u => (
                    <div key={u.id} className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{u.email}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.notices.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#00b4d8] px-3 mb-1 block">Notices</span>
                  {searchResults.notices.map(n => (
                    <div key={n.id} className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <p className="text-sm font-bold text-white truncate">{n.title}</p>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.projects.length === 0 && searchResults.users.length === 0 && searchResults.notices.length === 0 && (
                <div className="p-4 text-center text-xs text-white/50 font-medium">No records found.</div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SidebarContent = ({ onNavClick }) => (
    <>
      {/* Logo Section */}
      <div className="h-24 flex items-center justify-center px-6 border-b border-white/5 relative overflow-hidden shrink-0">
        <div className="relative flex items-center justify-center shrink-0 z-10 w-full cursor-pointer transition-transform hover:scale-105 duration-300">
          <img src={sdcLogo} alt="SDC Logo" className="h-12 w-auto object-contain relative z-10" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {filteblueNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onNavClick}
            className={({ isActive }) => `relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden group ${isActive ? 'bg-[#00b4d8]/10 border border-[#00b4d8]/30 shadow-[0_0_20px_rgba(0,180,216,0.15)] text-white' : 'border border-transparent text-white/50 hover:bg-white/5 hover:text-white hover:border-white/10'}`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 shrink-0 ${isActive ? 'text-[#00b4d8] scale-110 drop-shadow-[0_0_8px_rgba(0,180,216,0.8)]' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-bold uppercase tracking-[0.15em] relative z-10 truncate">{item.label}</span>

                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveLine"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00b4d8] rounded-r-full shadow-[0_0_10px_#00b4d8]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout at bottom for mobile convenience */}
      <div className="px-3 pb-5 shrink-0 border-t border-white/5 pt-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div 
      className="flex h-screen w-full bg-[#020617] text-white selection:bg-[#00b4d8] selection:text-[#020617] font-sans relative overflow-hidden"
      onClick={closeAll}
    >

      {/* 🚀 Extreme Background Engine */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,180,216,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,180,216,0.05) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 100%)'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00b4d8]/10 to-transparent blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-600/10 blur-[150px] pointer-events-none mix-blend-screen" />
      </div>

      {/* ===== DESKTOP SIDEBAR (md+) ===== */}
      <aside className="hidden md:flex w-[260px] lg:w-[280px] h-full flex-col bg-white/[0.02] border-r border-white/10 relative z-40 shadow-[0_20px_40px_rgba(0,0,0,0.5)] shrink-0">
        <SidebarContent onNavClick={undefined} />
      </aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[280px] z-50 bg-[#0a1020] border-r border-white/10 flex flex-col shadow-2xl md:hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
              <SidebarContent onNavClick={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT COLUMN ===== */}
      <div className="flex-1 flex flex-col min-w-0 relative z-30 h-full overflow-hidden">

        {/* Floating Topbar */}
        <header className="h-16 md:h-20 bg-white/[0.02] border-b border-white/10 backdrop-blur-2xl flex items-center justify-between px-4 md:px-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] shrink-0 relative z-40">

          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={e => { e.stopPropagation(); setMobileSidebarOpen(v => !v); }}
              className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <TerminalSquare className="w-4 h-4 md:w-5 md:h-5 text-[#00b4d8]" />
            <h2 className="text-sm md:text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 truncate max-w-[150px] sm:max-w-none">
              {currentApp}
            </h2>
          </div>

          {/* Global Controls */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Desktop Search */}
            <div className="relative hidden lg:block" onClick={e => e.stopPropagation()}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Global Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-[#00b4d8]/50 focus:bg-white/10 transition-all w-56 xl:w-64 text-white placeholder:text-white/30"
                />
              </div>
              <SearchDropdown />
            </div>

            {/* Mobile Search toggle */}
            <button
              onClick={e => { e.stopPropagation(); setShowSearchMobile(v => !v); }}
              className="lg:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-[#00b4d8]/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00b4d8] transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-[#00b4d8]/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00b4d8] transition-all backdrop-blur-md relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 bg-[#00b4d8] rounded-full border-2 border-[#020617]"></span>
            </button>

            {/* Profile Avatar */}
            <div 
              title={`${user?.name || 'Operator'} (${role} Access)`}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#00b4d8]/20 border border-[#00b4d8]/50 flex items-center justify-center overflow-hidden backdrop-blur-md shrink-0"
            >
              {user ? (
                user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-white/80">
                    {getInitials(user?.name)}
                  </span>
                )
              ) : (
                <div className="w-full h-full bg-[#00b4d8] text-white flex items-center justify-center font-bold font-mono">U</div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout} 
              title="Logout / Disconnect Session"
              className="hidden sm:flex w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 items-center justify-center text-white/50 hover:text-rose-400 transition-all backdrop-blur-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* Mobile Search Bar (expands below topbar) */}
        <AnimatePresence>
          {showSearchMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-[#0a1020] border-b border-white/10 px-4 relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="py-3 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-[#00b4d8]/50 focus:bg-white/10 transition-all text-white placeholder:text-white/30"
                />
                <SearchDropdown />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 md:p-6 lg:p-8 custom-scrollbar relative">
          <Outlet />
        </main>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,180,216,0.5); }
      `}} />
    </div>
  );
}

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
  User
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
  { path: '/dashboard/telemetry', label: 'Telemetry', icon: Activity, roles: ['admin'] },
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

  const filteblueNav = navItems.filter(item => item.roles.includes(role));

  // Find current active app name for the header
  const currentApp = navItems.find(item =>
    item.path === location.pathname ||
    (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
  )?.label || 'Dashboard';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], projects: [], notices: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white selection:bg-[#00b4d8] selection:text-[#020617] font-sans relative overflow-hidden p-4 gap-4" onClick={() => { setShowSearchDropdown(false); setShowProfileDropdown(false); }}>

      {/* 🚀 Extreme Background Engine */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Tech Grid */}
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,180,216,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,180,216,0.05) 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 100%)'
          }}
        />
        {/* Deep Space Glows */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#00b4d8]/10 to-transparent blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-600/10 blur-[150px] pointer-events-none mix-blend-screen" />
      </div>

      {/* 🚀 Floating Sidebar */}
      <aside className="w-[280px] h-full bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-2xl flex flex-col relative z-40 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">

        {/* Logo Section */}
        <div className="h-28 flex items-center justify-center px-6 border-b border-white/5 relative overflow-hidden">
          <div className="relative flex items-center justify-center shrink-0 z-10 w-full cursor-pointer transition-transform hover:scale-105 duration-300">
            <img src={sdcLogo} alt="SDC Logo" className="h-14 w-auto object-contain relative z-10" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {filteblueNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden group ${isActive ? 'bg-[#00b4d8]/10 border border-[#00b4d8]/30 shadow-[0_0_20px_rgba(0,180,216,0.15)] text-white' : 'border border-transparent text-white/50 hover:bg-white/5 hover:text-white hover:border-white/10'}`}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'text-[#00b4d8] scale-110 drop-shadow-[0_0_8px_rgba(0,180,216,0.8)]' : 'group-hover:scale-110'}`} />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] relative z-10">{item.label}</span>

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

        {/* Removed User Footer from sidebar to keep it purely for navigation */}
      </aside>

      {/* 🚀 Main Content Column */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 relative z-30 h-full">

        {/* Floating Topbar */}
        <header className="h-20 bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-2xl flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] shrink-0 relative z-40">

          <div className="flex items-center gap-3">
            <TerminalSquare className="w-5 h-5 text-[#00b4d8]" />
            <h2 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              {currentApp}
            </h2>
          </div>

          {/* Global Controls */}
          <div className="flex items-center gap-4">

            {/* Global Search Bar */}
            <div className="relative hidden md:block" onClick={e => e.stopPropagation()}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Global Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-[#00b4d8]/50 focus:bg-white/10 transition-all w-64 text-white placeholder:text-white/30"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto custom-scrollbar"
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
            </div>

            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#00b4d8]/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00b4d8] transition-all backdrop-blur-md relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#00b4d8] rounded-full border-2 border-[#020617]"></span>
            </button>

            {/* Profile Avatar (Separate, static) */}
            <div 
              title={`${user?.name || 'Operator'} (${role} Access)`}
              className="w-10 h-10 rounded-full bg-[#00b4d8]/20 border border-[#00b4d8]/50 flex items-center justify-center overflow-hidden backdrop-blur-md"
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

            {/* Direct Logout Button (Separate) */}
            <button 
              onClick={logout} 
              title="Logout / Disconnect Session"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 flex items-center justify-center text-white/50 hover:text-rose-400 transition-all backdrop-blur-md cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 custom-scrollbar relative bg-black/10 rounded-[2rem] border border-white/5 shadow-inner">
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

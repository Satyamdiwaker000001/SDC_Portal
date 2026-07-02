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
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../contexts/AuthContext';
import sdcLogo from '../assets/sdc_logo.png';

const navItems = [
  { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/projects', label: 'Projects', icon: FolderKanban, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/recruitment', label: 'Operations', icon: Briefcase, roles: ['admin'] },
  { path: '/dashboard/team', label: 'Personnel', icon: Users, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/teams', label: 'Teams', icon: Network, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/notices', label: 'Notices', icon: Megaphone, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/telemetry', label: 'Telemetry', icon: Activity, roles: ['admin'] },
];

export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const filteblueNav = navItems.filter(item => item.roles.includes(role));
  
  // Find current active app name for the header
  const currentApp = navItems.find(item => 
    item.path === location.pathname || 
    (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
  )?.label || 'Dashboard';

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white selection:bg-[#00b4d8] selection:text-[#020617] font-sans relative overflow-hidden p-4 gap-4">
      
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
        <header className="h-20 bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-2xl flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] shrink-0">
          
          <div className="flex items-center gap-3">
            <TerminalSquare className="w-5 h-5 text-[#00b4d8]" />
            <h2 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              {currentApp}
            </h2>
          </div>

          {/* Global Controls */}
          <div className="flex items-center gap-4">
            
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#00b4d8]/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#00b4d8] transition-all backdrop-blur-md relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#00b4d8] rounded-full border-2 border-[#020617]"></span>
            </button>
            
            {/* Header Profile with Dropdown */}
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-[#00b4d8]/20 border border-[#00b4d8]/50 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform backdrop-blur-md cursor-pointer">
                {user ? (
                  user?.role === 'admin' ? (
                    <span className="text-sm font-black text-white/80">AD</span>
                  ) : user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-white/80">{user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : <User className="w-4 h-4 text-white/50" />}</span>
                  )
                ) : (
                  <div className="w-full h-full bg-[#00b4d8] text-white flex items-center justify-center font-bold font-mono">U</div>
                )}
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                  <p className="text-sm font-bold text-white truncate mb-1">{role === 'admin' ? 'Administrator' : (user?.full_name || 'Operator')}</p>
                  <p className="text-[10px] font-mono text-[#00b4d8] uppercase tracking-widest">{role} Access</p>
                </div>
                <div className="p-2">
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-wider">
                    <LogOut className="w-4 h-4" />
                    Disconnect Session
                  </button>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 custom-scrollbar relative bg-black/10 rounded-[2rem] border border-white/5 shadow-inner">
          <Outlet />
        </main>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,180,216,0.5); }
      `}} />
    </div>
  );
}

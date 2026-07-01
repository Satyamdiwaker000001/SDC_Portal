import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Briefcase, 
  Bell,
  Search,
  Menu
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/projects', label: 'Projects', icon: FolderKanban, roles: ['admin', 'developer', 'mentor'] },
  { path: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare, roles: ['admin', 'developer'] },
  { path: '/dashboard/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['admin'] },
  { path: '/dashboard/team', label: 'Team', icon: Users, roles: ['admin', 'developer', 'mentor'] },
];

export default function DashboardLayout() {
  const { user, role, logout } = useAuth();
  
  const filteredNav = navItems.filter(item => item.roles.includes(role));
  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-950">
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-surface-950 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-semibold tracking-wide">SDC Portal</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-500/10 text-brand-400' 
                    : 'text-surface-400 hover:bg-surface-800/50 hover:text-surface-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-800/50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-surface-500 truncate capitalize">{role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 border-b border-white/5 bg-surface-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-surface-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input 
                type="text" 
                placeholder="Search projects, tasks, or members..." 
                className="w-full bg-surface-800/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-surface-200 placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 focus:bg-surface-800 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            <button 
              onClick={logout}
              className="text-xs text-surface-400 hover:text-white mr-4 border-r border-white/10 pr-4 transition-colors"
            >
              Logout
            </button>

            <button className="relative p-2 text-surface-400 hover:text-white transition-colors rounded-full hover:bg-surface-800/50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border-2 border-surface-950"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-950 p-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

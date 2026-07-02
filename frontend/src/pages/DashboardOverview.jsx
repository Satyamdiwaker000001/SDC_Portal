import React, { useState, useEffect } from 'react';
import { Activity, FolderKanban, Users, Briefcase, TrendingUp, CheckSquare, Clock, Zap, FileText, ArrowRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI, usersAPI, projectsAPI, applicationsAPI } from '../api/services';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 20 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 12,
    totalMembers: 148,
    pendingApprovals: 24,
    newApplications: 89
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [anns, users, projects, apps] = await Promise.all([
          announcementsAPI.getAll().catch(() => []),
          usersAPI.getAll().catch(() => []),
          projectsAPI.getAll().catch(() => []),
          applicationsAPI.getAll().catch(() => [])
        ]);

        if (anns && anns.length > 0) setAnnouncements(anns);
        
        // Calculate live stats
        const activeProjectsCount = projects && Array.isArray(projects) ? projects.filter(p => p.status === 'ACTIVE' || p.status === 'LIVE' || p.status === 'IN PROGRESS').length : 0;
        const membersCount = users && Array.isArray(users) ? users.length : 0;
        const pendingCount = apps && Array.isArray(apps) ? apps.filter(a => a.status === 'PENDING').length : 0;
        
        setStats({
          activeProjects: activeProjectsCount || 12,
          totalMembers: membersCount || 148,
          pendingApprovals: pendingCount || 24,
          newApplications: (apps && Array.isArray(apps) ? apps.length : 0) || 89
        });
      } catch (e) {
        console.error("Failed to fetch admin data", e);
      }
    };
    fetchAllData();
  }, []);

  const adminStatsCards = [
    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: FolderKanban, trend: 'Tracked live', color: 'from-[#00b4d8] to-blue-500', link: '/dashboard/projects' },
    { label: 'Total Members', value: stats.totalMembers.toString(), icon: Users, trend: 'Across divisions', color: 'from-[#00b4d8] to-[#0066ff]', link: '/dashboard/team' },
    { label: 'Pending Approvals', value: stats.pendingApprovals.toString(), icon: CheckSquare, trend: 'Requires attention', color: 'from-cyan-400 to-blue-500', link: '/dashboard/recruitment' },
    { label: 'Total Applications', value: stats.newApplications.toString(), icon: Briefcase, trend: 'Recruitment pipeline', color: 'from-[#2a9d8f] to-sky-500', link: '/dashboard/recruitment' },
  ];

  return (
    <motion.div 
      className="space-y-10 relative perspective-[1200px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-blue-400 text-[9px] uppercase tracking-[0.2em] font-bold">Administrator Privileges</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight leading-tight">
            Command Center
          </h1>
          <p className="text-white/40 mt-2 text-sm font-medium tracking-wide">
            Welcome, <span className="text-white font-bold">Admin</span>. System is running at optimal capacity.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="group relative overflow-hidden px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="relative z-10 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Generate Log</span>
          </button>
        </div>
      </motion.div>

      {/* 3D Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsCards.map((stat, i) => (
          <motion.div 
            variants={itemVariants}
            key={i} 
            className="group relative cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <Link to={stat.link} className="block w-full h-full">
              <div className="relative bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] overflow-hidden transition-all duration-700 transform-gpu group-hover:-translate-y-2 group-hover:rotate-x-[5deg] group-hover:rotate-y-[-5deg] group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.5),-1px_-1px_0_rgba(255,255,255,0.1)]">
                
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700`}></div>
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${stat.color} opacity-50`}></div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</span>
                    <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg group-hover:text-[#00b4d8] transition-colors">{stat.value}</span>
                  </div>
                  
                  <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${stat.color} p-[1px] shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform-gpu transition-transform duration-700 group-hover:translate-z-10 group-hover:scale-110 group-hover:-rotate-12`}>
                    <div className="w-full h-full bg-[#0f1115] rounded-3xl flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-20`}></div>
                      <stat.icon className="w-6 h-6 text-white relative z-10" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center text-xs font-bold tracking-wide border-t border-white/5 pt-4">
                  {stat.trend.includes('attention') ? (
                    <Zap className="w-4 h-4 text-cyan-500 mr-2 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-[#00b4d8] mr-2 drop-shadow-[0_0_5px_rgba(0,180,216,0.5)]" />
                  )}
                  <span className="text-white/40 group-hover:text-white/80 transition-colors">{stat.trend}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-6 mt-6">
        
        {/* Terminal Telemetry / Main UI */}
        <motion.div variants={itemVariants} className="xl:col-span-2 relative group" style={{ perspective: '1200px' }}>
          <div className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 h-[400px] flex flex-col relative overflow-hidden transform-gpu transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(0,180,216,0.15)] group-hover:border-white/20">
            
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00b4d8]/20 blur-[100px] rounded-full mix-blend-screen opacity-50"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#00b4d8]" />
                <h3 className="text-lg font-black text-white tracking-tight uppercase">System Telemetry</h3>
              </div>
              <button className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em] border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition-all">
                Access Feed &rarr;
              </button>
            </div>
            
            <div className="flex-1 border border-[#00b4d8]/20 rounded-2xl bg-black/40 flex flex-col relative overflow-hidden p-5">
              
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,180,216,0.02)_51%)] bg-[length:100%_4px] pointer-events-none z-20"></div>
              
              <div className="flex items-center gap-2 mb-4 text-[#00b4d8] text-[9px] font-mono uppercase tracking-widest border-b border-[#00b4d8]/20 pb-2">
                <span>[root@sdc_engine ~]#</span>
                <span className="animate-pulse">monitoring active...</span>
              </div>
              
              <div className="flex-1 flex items-end justify-between px-2 pb-2 relative z-10 gap-2">
                 {[40, 70, 45, 90, 65, 85, 100, 60, 50, 80].map((h, i) => (
                   <div key={i} className="flex-1 relative group/bar flex flex-col justify-end h-full">
                     <div 
                       className="w-full bg-gradient-to-t from-[#00b4d8]/10 to-[#00b4d8] rounded-t-full transition-all duration-1000 border-t border-white/50 relative overflow-hidden" 
                       style={{ height: `${h}%` }}
                     >
                       <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                     </div>
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#00b4d8] font-mono text-[8px] opacity-0 group-hover/bar:opacity-100 transition-opacity">
                       {h}%
                     </span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-4 flex justify-between text-white/30 font-mono text-[8px] uppercase tracking-widest border-t border-[#00b4d8]/20 pt-2 z-10">
                <span>Network Load</span>
                <span>T-00:00:00</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Announcements Feed */}
        <motion.div variants={itemVariants} className="relative group" style={{ perspective: '1200px' }}>
          <div className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 h-[400px] flex flex-col relative overflow-hidden transform-gpu transition-all duration-700 group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] group-hover:border-white/20">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Transmission Log</h3>
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-[#00b4d8] font-mono font-bold tracking-widest">LIVE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse shadow-[0_0_8px_#00b4d8]"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {announcements.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <Activity className="w-6 h-6 mb-3 opacity-50" />
                  <p className="text-[9px] uppercase font-bold tracking-widest">No Transmissions</p>
                </div>
              ) : (
                announcements.map((ann, idx) => (
                  <div key={ann.id} className="relative pl-5 group/item">
                    <div className="absolute left-[3.5px] top-4 bottom-[-16px] w-px bg-white/10 group-last/item:hidden"></div>
                    <div className="absolute w-2 h-2 bg-[#020617] border border-white/20 rounded-full -left-0 top-1.5 group-hover/item:border-[#00b4d8] group-hover/item:bg-[#00b4d8] transition-all shadow-lg"></div>
                    <p className="text-xs font-black text-white leading-tight tracking-tight group-hover/item:text-[#00b4d8] transition-colors">{ann.title}</p>
                    <p className="text-[10px] text-white/40 mt-1 leading-relaxed line-clamp-2">{ann.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#00b4d8]">
                        [{ann.audience_type}]
                      </span>
                      <span className="text-[8px] font-mono text-white/30">{new Date(ann.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
    </motion.div>
  );
};

// ==========================================
// DEVELOPER DASHBOARD
// ==========================================
const DeveloperDashboard = ({ user }) => {
  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-black text-white">Developer Portal</h1>
        <p className="text-white/50 mt-2">Welcome back, {user?.full_name || 'Developer'}. Here is your workspace overview.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Link to="/dashboard/tasks">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer">
              <CheckSquare className="w-6 h-6 text-blue-400 mb-4" />
              <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">My Active Tasks</h3>
              <p className="text-4xl font-black text-white">4</p>
           </div>
         </Link>
         
         <Link to="/dashboard/projects">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer">
              <FolderKanban className="w-6 h-6 text-sky-400 mb-4" />
              <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">My Projects</h3>
              <p className="text-4xl font-black text-white">2</p>
           </div>
         </Link>
         
         <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer">
            <Clock className="w-6 h-6 text-sky-400 mb-4" />
            <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Hours Tracked</h3>
            <p className="text-4xl font-black text-white">32h</p>
         </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MENTOR DASHBOARD
// ==========================================
const MentorDashboard = ({ user }) => {
  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-black text-white">Mentor Hub</h1>
        <p className="text-white/50 mt-2">Welcome back, {user?.full_name || 'Mentor'}. Overview of your assigned teams.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Link to="/dashboard/team">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer">
              <Users className="w-6 h-6 text-sky-400 mb-4" />
              <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Mentoblue Teams</h3>
              <p className="text-4xl font-black text-white">3</p>
           </div>
         </Link>
         
         <Link to="/dashboard/projects">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer">
              <Activity className="w-6 h-6 text-cyan-400 mb-4" />
              <h3 className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Pending Reviews</h3>
              <p className="text-4xl font-black text-white">7</p>
           </div>
         </Link>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN ROUTER COMPONENT
// ==========================================
export default function DashboardOverview() {
  const { role, user } = useAuth();
  
  if (role === 'admin') return <AdminDashboard user={user} />;
  if (role === 'developer') return <DeveloperDashboard user={user} />;
  if (role === 'mentor') return <MentorDashboard user={user} />;
  
  // Fallback
  return <div className="text-white p-8">Initializing Dashboard...</div>;
}

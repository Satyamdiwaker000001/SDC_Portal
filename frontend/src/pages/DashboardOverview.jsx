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
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalMembers: 0,
    pendingApprovals: 0,
    newApplications: 0
  });
  const [selectedProject, setSelectedProject] = useState('All');

  // Interactive Mock Timeline Data for the graph (Fallback)
  const fallbackTimelineData = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    projects: [
      { name: 'SDC Portal v2', data: [15, 30, 45, 65, 80, 85], color: '#00b4d8', glow: 'rgba(0, 180, 216, 0.4)' },
      { name: 'Campus Connect', data: [0, 10, 25, 30, 45, 55], color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' }
    ]
  };

  const getRealTimelineData = () => {
    if (!projects || projects.length === 0) return fallbackTimelineData;
    const colors = ['#00b4d8', '#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];
    return {
      weeks: ['Start', 'Design', 'Dev', 'Testing', 'Review', 'Current'],
      projects: projects.map((p, i) => ({
        name: p.name,
        color: colors[i % colors.length],
        data: [0, Math.min(20, p.progress), Math.min(40, p.progress), Math.min(60, p.progress), Math.min(80, p.progress), p.progress]
      }))
    };
  };

  const currentTimelineData = getRealTimelineData();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [users, pData, apps] = await Promise.all([
          usersAPI.getAll().catch(() => []),
          projectsAPI.getAll().catch(() => []),
          applicationsAPI.getAll().catch(() => [])
        ]);

        const activeProjectsCount = pData && Array.isArray(pData) ? pData.filter(p => p.status === 'LIVE' || p.status === 'PENDING_SRS').length : 0;
        const membersCount = users && Array.isArray(users) ? users.length : 0;
        const pendingCount = apps && Array.isArray(apps) ? apps.filter(a => a.status === 'PENDING').length : 0;
        
        setStats({
          activeProjects: activeProjectsCount || 4,
          totalMembers: membersCount || 3,
          pendingApprovals: pendingCount || 2,
          newApplications: (apps && Array.isArray(apps) ? apps.length : 0) || 7
        });

        if (pData && Array.isArray(pData)) {
          // Map status to approximate progress percentage
          const mapped = pData.map(p => {
            let progress = 10;
            if (p.status === 'COMPLETED') progress = 100;
            else if (p.status === 'LIVE') progress = 75;
            else if (p.status === 'PENDING_SRS') progress = 35;
            return { ...p, progress };
          });
          setProjects(mapped);
        }
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

  // Helper to draw smooth cubic bezier curves for SVG
  const getSvgPath = (data, width, height) => {
    const paddingX = 40;
    const paddingY = 20;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - (val / 100) * chartHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpX1 = points[i].x + chartWidth / (data.length - 1) / 2;
      const cpY1 = points[i].y;
      const cpX2 = points[i + 1].x - chartWidth / (data.length - 1) / 2;
      const cpY2 = points[i + 1].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i+1].x} ${points[i+1].y}`;
    }
    return path;
  };

  // Helper to draw closed area under the path
  const getSvgAreaPath = (data, width, height) => {
    const paddingX = 40;
    const paddingY = 20;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - (val / 100) * chartHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpX1 = points[i].x + chartWidth / (data.length - 1) / 2;
      const cpY1 = points[i].y;
      const cpX2 = points[i + 1].x - chartWidth / (data.length - 1) / 2;
      const cpY2 = points[i + 1].y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i+1].x} ${points[i+1].y}`;
    }
    path += ` L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;
    return path;
  };

  return (
    <motion.div 
      className="space-y-8 relative perspective-[1200px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-full mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse"></div>
            <span className="text-[#00b4d8] text-[9px] uppercase tracking-widest font-bold">Command Center Active</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight leading-tight uppercase">
            Command Center
          </h1>
          <p className="text-white/40 mt-1 text-xs font-medium tracking-wide">
            Welcome, <span className="text-white font-bold">Admin</span>. System is running at optimal capacity.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsCards.map((stat, i) => (
          <motion.div 
            variants={itemVariants}
            key={i} 
            className="group relative cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <Link to={stat.link} className="block w-full h-full">
              <div className="relative bg-[#1c222b] border border-white/5 p-6 rounded-[2rem] overflow-hidden transition-all duration-500 transform-gpu group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${stat.color} opacity-40`}></div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</span>
                    <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg group-hover:text-[#00b4d8] transition-colors">{stat.value}</span>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} p-[1px] transform-gpu transition-transform duration-500 group-hover:scale-105`}>
                    <div className="w-full h-full bg-[#1c222b] rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}></div>
                      <stat.icon className="w-5 h-5 text-white relative z-10" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-[10px] font-bold tracking-wider border-t border-white/5 pt-4">
                  {stat.trend.includes('attention') ? (
                    <Zap className="w-3.5 h-3.5 text-cyan-500 mr-2 animate-pulse" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-[#00b4d8] mr-2" />
                  )}
                  <span className="text-white/30 group-hover:text-white/60 transition-colors uppercase">{stat.trend}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Full Width Project Progress Dashboard (Main Visual Chart + Project List) */}
      <motion.div variants={itemVariants} className="relative group" style={{ perspective: '1200px' }}>
        <div className="bg-[#1c222b] border border-white/5 rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,180,216,0.1)] hover:border-white/10">
          
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00b4d8]/10 blur-[100px] rounded-full mix-blend-screen opacity-30 pointer-events-none"></div>
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#00b4d8]" />
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Project Progress Analytics</h3>
                <p className="text-[11px] text-white/35 font-medium mt-0.5">Development progress tracking & velocity trends</p>
              </div>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedProject('All')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                  selectedProject === 'All'
                    ? 'bg-[#00b4d8] text-[#020617] border-[#00b4d8] shadow-[0_0_10px_rgba(0,180,216,0.3)]'
                    : 'bg-white/[0.03] text-white/40 border-white/8 hover:text-white hover:bg-white/5'
                }`}
              >
                All Projects
              </button>
              {currentTimelineData.projects.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedProject(p.name)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                    selectedProject === p.name
                      ? 'text-[#020617] border-current shadow-[0_0_10px_rgba(0,180,216,0.3)]'
                      : 'bg-white/[0.03] text-white/40 border-white/8 hover:text-white hover:bg-white/5'
                  }`}
                  style={selectedProject === p.name ? { backgroundColor: p.color, borderColor: p.color } : {}}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Visual Board */}
          <div className="flex flex-col lg:flex-row gap-6 relative z-10">
            {/* SVG Interactive Line Chart */}
            <div className="flex-1 bg-black/30 border border-white/6 rounded-2xl p-5 flex flex-col relative min-h-[300px]">
              {/* Chart Grid Lines & Text labels */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map(val => (
                  <div key={val} className="w-full flex items-center justify-between border-b border-white/[0.03] h-0">
                    <span className="text-[8px] font-mono text-white/20 -translate-y-2">{val}%</span>
                  </div>
                ))}
              </div>

              {/* The Graph Layer */}
              <div className="flex-1 relative z-10 min-h-[220px]">
                <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                  {/* Gradients definitions */}
                  <defs>
                    {currentTimelineData.projects.map(p => (
                      <linearGradient key={`grad-${p.name}`} id={`grad-${p.name.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={p.color} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={p.color} stopOpacity="0.0" />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Render Curves */}
                  {currentTimelineData.projects.map(p => {
                    const isDimmed = selectedProject !== 'All' && selectedProject !== p.name;
                    return (
                      <g key={p.name} className="transition-all duration-500" style={{ opacity: isDimmed ? 0.15 : 1.0 }}>
                        {/* Area Fill path */}
                        <path
                          d={getSvgAreaPath(p.data, 600, 240)}
                          fill={`url(#grad-${p.name.replace(/\s+/g, '')})`}
                        />
                        {/* Line path */}
                        <path
                          d={getSvgPath(p.data, 600, 240)}
                          fill="none"
                          stroke={p.color}
                          strokeWidth={selectedProject === p.name ? '3.5' : '2'}
                          strokeLinecap="round"
                          style={{ filter: `drop-shadow(0 0 4px ${p.color}50)` }}
                        />
                        {/* Data Points */}
                        {p.data.map((val, idx) => {
                          const paddingX = 40;
                          const paddingY = 20;
                          const chartWidth = 600 - paddingX * 2;
                          const chartHeight = 240 - paddingY * 2;
                          const cx = paddingX + (idx / (p.data.length - 1)) * chartWidth;
                          const cy = paddingY + chartHeight - (val / 100) * chartHeight;
                          return (
                            <circle
                              key={idx}
                              cx={cx}
                              cy={cy}
                              r={selectedProject === p.name ? '4.5' : '3'}
                              fill="#1c222b"
                              stroke={p.color}
                              strokeWidth={selectedProject === p.name ? '2.5' : '1.5'}
                            />
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Weeks Labels Row */}
              <div className="flex justify-between px-10 pt-3 border-t border-white/5 mt-2 text-white/30 font-mono text-[9px] uppercase tracking-widest relative z-10">
                {currentTimelineData.weeks.map(w => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>

            {/* Side Details Panel: Live Projects Listing */}
            <div className="w-full lg:w-80 bg-black/25 border border-white/6 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
                  Active Sprint Goals
                </h4>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {projects.length === 0 ? (
                    // Mock Projects display if API returns empty
                    fallbackTimelineData.projects.map(p => (
                      <div key={p.name} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-white/70">{p.name}</span>
                          <span className="font-mono font-bold" style={{ color: p.color }}>{p.data[p.data.length - 1]}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${p.data[p.data.length - 1]}%`, backgroundColor: p.color }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    projects.map(project => {
                      const colorMap = {
                        'COMPLETED': '#10b981',
                        'LIVE': '#00b4d8',
                        'PENDING_SRS': '#f59e0b',
                        'DRAFT': '#94a3b8'
                      };
                      const color = colorMap[project.status] || '#a0aec0';
                      return (
                        <div key={project.id} className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-white/75 truncate pr-2">{project.name}</span>
                            <span className="font-mono font-bold" style={{ color }}>{project.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${project.progress}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Progress Summary Metric */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
                  <span>Sprint Velocity</span>
                  <span className="text-[#00b4d8] font-mono">Good</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-white">82%</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mb-1">
                    ↑ 4.2% <span className="text-white/20">vs prev week</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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

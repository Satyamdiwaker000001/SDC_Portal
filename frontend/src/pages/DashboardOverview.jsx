import React, { useState, useEffect } from 'react';
import { 
  Activity, FolderKanban, Users, Briefcase, TrendingUp, CheckSquare, 
  Clock, Zap, FileText, ArrowRight, Terminal, CheckCircle2, XCircle, 
  ExternalLink, BarChart3, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI, usersAPI, projectsAPI, applicationsAPI, tasksAPI, teamsAPI } from '../api/services';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersList, pData, appsList] = await Promise.all([
          usersAPI.getAll().catch(() => []),
          projectsAPI.getAll().catch(() => []),
          applicationsAPI.getAll().catch(() => [])
        ]);

        const activeProjectsCount = pData ? pData.filter(p => p.status === 'LIVE' || p.status === 'PENDING_SRS').length : 0;
        const membersCount = usersList
          ? usersList.filter(user => {
              const role = (user.role || "").toLowerCase();
              return (
                user.membership_status === "active" &&
                role !== "admin"
              );
            }).length
          : 0;
        const pendingCount = appsList ? appsList.filter(a => a.status === 'PENDING').length : 0;
        
        setStats({
          activeProjects: activeProjectsCount,
          totalMembers: membersCount,
          pendingApprovals: pendingCount,
          newApplications: appsList ? appsList.length : 0
        });

        if (pData) {
          setProjects(pData);
        }
      } catch (e) {
        console.error("Failed to fetch admin dashboard data", e);
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
      className="space-y-8 relative"
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
            Welcome, <span className="text-white font-bold">{user?.name}</span>. System is running at optimal capacity.
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
                  <TrendingUp className="w-3.5 h-3.5 text-[#00b4d8] mr-2" />
                  <span className="text-white/30 group-hover:text-white/60 transition-colors uppercase">{stat.trend}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Projects Timeline Dashboard */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="bg-[#1c222b] border border-white/5 rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden transition-all duration-500 hover:border-[#00b4d8]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#00b4d8]" />
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Active Projects Progress</h3>
                <p className="text-[11px] text-white/35 font-medium mt-0.5">Real-time SDLC development status & completion</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
            {projects.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-xs text-white/40">No projects registered. Create a project to start tracking.</div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-black/35 border border-white/5 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-[#00b4d8]">{project.type}</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-wide mt-2">{project.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-white/60">{project.progress}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00b4d8] to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
                    <span>Status: <span className="text-[#00b4d8]">{project.status}</span></span>
                    <span>Deadline: <span className="text-white/60">{project.deadline}</span></span>
                  </div>
                </div>
              ))
            )}
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitTask, setSubmitTask] = useState(null);
  const [urls, setUrls] = useState({ url: '', demo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await tasksAPI.getAll(null, user.id);
      setTasks(allTasks);
    } catch (e) {
      console.error("Failed to load developer tasks", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user.id]);

  const handleStartTask = async (taskId) => {
    try {
      await tasksAPI.updateStatus(taskId, 'IN_PROGRESS');
      fetchTasks();
    } catch (e) {
      alert("Failed to start task");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!urls.url) return;
    setIsSubmitting(true);
    try {
      await tasksAPI.submit(submitTask.id, {
        submission_url: urls.url,
        submission_demo_url: urls.demo || null
      });
      setSubmitTask(null);
      setUrls({ url: '', demo: '' });
      fetchTasks();
    } catch (e) {
      alert("Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics calculations
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingVerify = tasks.filter(t => t.status === 'PENDING_VERIFICATION').length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-full mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse"></div>
            <span className="text-[#00b4d8] text-[9px] uppercase tracking-widest font-bold">Developer Workspace</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Developer CommandCenter</h1>
          <p className="text-white/40 mt-1 text-xs">
            Welcome back, <span className="text-white font-bold">{user.name}</span>. Implement code and sync outputs.
          </p>
        </div>
        <div className="bg-[#1c222b] border border-white/5 px-5 py-3 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Performance Score</span>
            <span className="text-lg font-black text-[#00b4d8] font-mono">{user.performance_score || 0} PTS</span>
          </div>
          <Zap className="w-6 h-6 text-[#00b4d8] animate-bounce" />
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: total, icon: FolderKanban, color: 'text-blue-400' },
          { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-amber-400' },
          { label: 'Awaiting Verify', value: pendingVerify, icon: Zap, color: 'text-cyan-400' },
          { label: 'Completed Rate', value: `${completionRate}%`, icon: CheckCircle2, color: 'text-emerald-400' }
        ].map((m, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-[#1c222b] border border-white/5 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <span className="text-2xl font-black text-white">{m.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Tasks Section */}
      <motion.div variants={itemVariants} className="bg-[#1c222b] border border-white/5 rounded-3xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00b4d8]" /> My Task Desk
        </h3>

        {loading ? (
          <div className="text-center py-8 text-white/40 text-xs font-mono">Syncing with task repository...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs font-mono">No tasks assigned to you. Enjoy the downtime!</div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-black/25 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:border-[#00b4d8]/20">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-white/50 uppercase tracking-widest">{task.phase_name || 'Planning'}</span>
                    {task.rejection_remarks && (
                      <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[8px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Re-submission Required
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase truncate">{task.title}</h4>
                  <p className="text-xs text-white/40 line-clamp-2">{task.description || 'No description provided.'}</p>
                  {task.due_date && <p className="text-[10px] text-white/30 font-bold uppercase">Due Date: {task.due_date}</p>}
                  {task.rejection_remarks && (
                    <div className="text-[10px] bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg text-rose-300 font-mono mt-2">
                      <strong>Rejection Reason:</strong> {task.rejection_remarks}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {task.status === 'PENDING' && (
                    <button 
                      onClick={() => handleStartTask(task.id)}
                      className="px-4 py-2 bg-[#00b4d8]/10 hover:bg-[#00b4d8]/20 border border-[#00b4d8]/30 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#00b4d8]"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => setSubmitTask(task)}
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-400"
                    >
                      Submit Code
                    </button>
                  )}
                  {task.status === 'PENDING_VERIFICATION' && (
                    <span className="px-3 py-1.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                      Awaiting Mentor
                    </span>
                  )}
                  {task.status === 'COMPLETED' && (
                    <span className="px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Task Submission Overlay Dialog */}
      {submitTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1c222b] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg space-y-6 shadow-2xl">
            <div>
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest">Workspace Handshake</span>
              <h3 className="text-lg font-black text-white uppercase mt-1">Submit Task Output</h3>
              <p className="text-xs text-white/40 mt-1">Deliver production link & demonstration resources for: <strong>{submitTask.title}</strong></p>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">GitHub PR/Submission Link *</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/..."
                  value={urls.url}
                  onChange={e => setUrls({ ...urls, url: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00b4d8]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Hosted Demo URL (Optional)</label>
                <input 
                  type="url"
                  placeholder="https://sdc-portal.com"
                  value={urls.demo}
                  onChange={e => setUrls({ ...urls, demo: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00b4d8]"
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setSubmitTask(null)}
                  className="px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-500 text-black hover:bg-emerald-400 font-black text-[10px] uppercase tracking-wider rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Transmitting...' : 'Transmit Link'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// MENTOR DASHBOARD
// ==========================================
const MentorDashboard = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [reviewTask, setReviewTask] = useState(null);
  const [decision, setDecision] = useState(''); // VERIFY | REJECT
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchMentorData = async () => {
    setLoading(true);
    try {
      // 1. Get all teams and projects
      const [allTeams, allProjects] = await Promise.all([
        teamsAPI.getAll().catch(() => []),
        projectsAPI.getAll().catch(() => [])
      ]);
      
      // Filter teams where this user is assigned as mentor
      const mentoredTeams = [];
      for (const t of allTeams) {
        const members = await teamsAPI.getMembers(t.id).catch(() => []);
        const hasMentor = members.some(m => m.user_id === user.id && m.designation === 'mentor');
        if (hasMentor) {
          mentoredTeams.push(t);
        }
      }
      setTeams(mentoredTeams);
      
      const teamIds = mentoredTeams.map(t => t.id);
      const supervisedProjects = allProjects.filter(p => teamIds.includes(p.team_id));
      setProjects(supervisedProjects);
      
      // 2. Fetch tasks awaiting review
      const allTasks = await tasksAPI.getAll().catch(() => []);
      const projIds = supervisedProjects.map(p => p.id);
      const reviews = allTasks.filter(t => t.status === 'PENDING_VERIFICATION' && projIds.includes(t.project_id));
      
      // Enrich review tasks with developer names
      const allUsers = await usersAPI.getAll().catch(() => []);
      const enrichedReviews = reviews.map(t => {
        const dev = allUsers.find(u => u.id === t.assigned_to);
        return {
          ...t,
          developer_name: dev ? dev.name : 'Unknown Developer'
        };
      });
      
      setPendingTasks(enrichedReviews);
    } catch (e) {
      console.error("Failed to load mentor metrics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, [user.id]);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!decision) return;
    setSubmittingReview(true);
    try {
      await tasksAPI.verify(reviewTask.id, {
        decision: decision,
        remarks: remarks || null
      });
      setReviewTask(null);
      setDecision('');
      setRemarks('');
      fetchMentorData();
    } catch (e) {
      alert("Failed to record verification choice");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded-full mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse"></div>
            <span className="text-[#00b4d8] text-[9px] uppercase tracking-widest font-bold">Mentor Operations</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Mentor Workspace</h1>
          <p className="text-white/40 mt-1 text-xs">
            Welcome back, <span className="text-white font-bold">{user.name}</span>. Oversee teams and verify task completions.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-[#1c222b] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider block">Supervised Teams</span>
            <span className="text-3xl font-black text-white">{teams.length}</span>
          </div>
          <Users className="w-6 h-6 text-[#00b4d8]" />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#1c222b] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider block">Assigned Projects</span>
            <span className="text-3xl font-black text-white">{projects.length}</span>
          </div>
          <FolderKanban className="w-6 h-6 text-[#00b4d8]" />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[#1c222b] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider block">Pending Verifications</span>
            <span className="text-3xl font-black text-white text-[#f59e0b]">{pendingTasks.length}</span>
          </div>
          <ShieldAlert className="w-6 h-6 text-[#f59e0b] animate-pulse" />
        </motion.div>
      </div>

      {/* Review Queue */}
      <motion.div variants={itemVariants} className="bg-[#1c222b] border border-white/5 rounded-3xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#f59e0b]" /> Verification Queue
        </h3>

        {loading ? (
          <div className="text-center py-8 text-white/40 text-xs font-mono">Syncing review queue...</div>
        ) : pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs font-mono">No tasks awaiting verification. Outstanding work!</div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="bg-black/25 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#00b4d8]/10 border border-[#00b4d8]/20 rounded text-[8px] font-bold text-[#00b4d8] uppercase tracking-widest">{task.phase_name || 'Planning'}</span>
                    <span className="text-[10px] text-white/40 font-medium">Assigned to: <strong className="text-white">{task.developer_name}</strong></span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase truncate">{task.title}</h4>
                  <p className="text-xs text-white/40 line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {task.submission_url && (
                      <a href={task.submission_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#00b4d8] hover:underline uppercase">
                        <ExternalLink className="w-3.5 h-3.5" /> Output Link
                      </a>
                    )}
                    {task.submission_demo_url && (
                      <a href={task.submission_demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2a9d8f] hover:underline uppercase">
                        <ExternalLink className="w-3.5 h-3.5" /> Demo Link
                      </a>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setReviewTask(task)}
                  className="px-4 py-2 bg-[#f59e0b] hover:bg-[#f59e0b]/80 border border-[#f59e0b]/30 rounded-xl text-[10px] font-black uppercase tracking-wider text-black self-end md:self-center"
                >
                  Verify / Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Review Dialog */}
      {reviewTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#1c222b] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg space-y-6 shadow-2xl">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#f59e0b] tracking-widest">Verification Dispatch</span>
              <h3 className="text-lg font-black text-white uppercase mt-1">Review Submission</h3>
              <p className="text-xs text-white/40 mt-1">Task: <strong>{reviewTask.title}</strong> by <strong>{reviewTask.developer_name}</strong></p>
            </div>
            
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setDecision('VERIFY')}
                  className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    decision === 'VERIFY' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Verify & Approve</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setDecision('REJECT')}
                  className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    decision === 'REJECT' 
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                      : 'bg-black/20 border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <XCircle className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Reject Task</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Remarks / Feedback {decision === 'REJECT' && '*'}
                </label>
                <textarea 
                  required={decision === 'REJECT'}
                  placeholder="Provide comments or modification requests here..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00b4d8] h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setReviewTask(null)}
                  className="px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReview || !decision}
                  className="px-5 py-2 bg-[#f59e0b] text-black hover:bg-[#f59e0b]/80 font-black text-[10px] uppercase tracking-wider rounded-xl disabled:opacity-50"
                >
                  {submittingReview ? 'Recording...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
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
  
  return <div className="text-white p-8">Initializing Dashboard...</div>;
}

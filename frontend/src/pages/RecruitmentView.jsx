import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI, settingsAPI } from '../api/services';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Briefcase, ShieldAlert, Phone, Mail, FileText, Search, Power, Download, Trash } from 'lucide-react';

const STATUS_COLORS = {
  'PENDING':    'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'SHORTLISTED':'bg-[#00b4d8]/10 text-[#00b4d8] border-[#00b4d8]/25',
  'SCHEDULED':  'bg-blue-400/10 text-blue-400 border-blue-400/25',
  'APPROVED':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  'ACCEPTED':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  'REJECTED':   'bg-red-500/10 text-red-400 border-red-500/25'
};

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export default function RecruitmentView() {
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLive, setIsLive] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [highlightedAppId, setHighlightedAppId] = useState(null);

  const fetchLiveStatus = async () => {
    try {
      const data = await settingsAPI.get('is_recruitment_live');
      setIsLive(data.value === 'true');
    } catch (e) {
      console.error("Failed to fetch live status", e);
    }
  };

  const toggleLiveStatus = async () => {
    let role = "All Roles";
    if (!isLive) {
      const res = window.prompt("Recruitment is opening. Enter the roles this is open for (e.g., 'Developers', 'Mentors', '1st Year', or 'All Roles'):", "All Roles");
      if (res === null) return;
      role = res.trim() || "All Roles";
    }
    
    setIsToggling(true);
    try {
      const newVal = !isLive ? 'true' : 'false';
      await settingsAPI.update('is_recruitment_live', newVal);
      if (!isLive) {
        await settingsAPI.update('recruitment_open_for', role);
      }
      setIsLive(!isLive);
    } catch (e) {
      console.error("Failed to toggle recruitment status", e);
    } finally {
      setIsToggling(false);
    }
  };

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const data = await applicationsAPI.getAll();
      setApplications(data || []);
    } catch (e) {
      console.error("Failed to load applications", e);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    fetchLiveStatus();
  }, []);

  const targetAppId = searchParams.get('id');

  // Deep-link handling: scroll and highlight matching candidate application
  useEffect(() => {
    if (!isLoading && targetAppId && Array.isArray(applications) && applications.length > 0) {
      const target = applications.find(a => a && String(a.id) === String(targetAppId));
      if (target) {
        setHighlightedAppId(target.id);
        const timer = setTimeout(() => {
          setHighlightedAppId(null);
        }, 4000);

        setTimeout(() => {
          const el = document.getElementById(`app-card-${target.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, targetAppId, applications, searchParams]);

  if (role !== 'admin') return <Navigate to="/dashboard" replace />;

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      // reload to fetch generated credentials if accepted/approved
      fetchApps();
    } catch (e) {
      console.error("Failed to update status", e);
      alert("Failed to update application status");
    }
  };

  // CSV Export logic
  const handleExportCSV = () => {
    const approvedApps = applications.filter(
      app => (app.status === 'APPROVED' || app.status === 'ACCEPTED') && app.generated_user_id
    );
    
    if (approvedApps.length === 0) {
      alert("No approved candidate credentials found to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Branch,User ID,Initial Password\n";

    approvedApps.forEach(app => {
      const row = `"${app.name}","${app.email}","${app.branch}","${app.generated_user_id}","${app.generated_password}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SDC_Approved_Credentials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'SCHEDULED').length,
    approved: applications.filter(a => a.status === 'APPROVED' || a.status === 'ACCEPTED').length,
  };

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-6 h-6 rounded-md bg-[#00b4d8]/10 flex items-center justify-center border border-[#00b4d8]/30">
               <Briefcase className="w-3 h-3 text-[#00b4d8]" />
             </div>
             <span className="text-[#00b4d8] text-xs font-bold tracking-widest uppercase">Operations Center</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase drop-shadow-md">
            Recruitment Pipeline
          </h1>
          <p className="text-white/40 mt-0.5 text-xs font-medium">
            Review incoming applications, manage interview statuses, and onboard new talent.
          </p>
        </div>
        
        {/* Actions Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-xs transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-[#00b4d8]" /> Export Credentials CSV
          </button>

          <button 
            onClick={toggleLiveStatus}
            disabled={isToggling}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border ${isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'} disabled:opacity-50 shrink-0`}
          >
            <Power className="w-4 h-4" /> {isLive ? 'Form is Live' : 'Form is Offline'}
          </button>
          
          <div className="relative w-full md:w-56 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1c222b] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-all uppercase tracking-wider cursor-pointer shrink-0"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="APPROVED">Approved / Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-[#1c222b] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
           <div>
             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Applications</p>
             <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
           </div>
        </div>
        <div className="bg-[#1c222b] border border-[#00b4d8]/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,180,216,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-[#00b4d8]/60 uppercase tracking-widest">Pending Review</p>
             <p className="text-2xl font-black text-[#00b4d8] mt-1">{stats.pending}</p>
           </div>
        </div>
        <div className="bg-[#1c222b] border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Shortlisted</p>
             <p className="text-2xl font-black text-blue-400 mt-1">{stats.shortlisted}</p>
           </div>
        </div>
        <div className="bg-[#1c222b] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest">Approved / Accepted</p>
             <p className="text-2xl font-black text-emerald-400 mt-1">{stats.approved}</p>
           </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="flex-1 bg-[#1c222b] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Table Header — hidden on mobile, shown on md+ */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest bg-black/20">
          <div className="col-span-3">Candidate Identity</div>
          <div className="col-span-3">Contact Details</div>
          <div className="col-span-2">Specialization</div>
          <div className="col-span-4 text-right">Status & Action</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-white/40 text-xs font-mono">Syncing candidates database...</div>
          ) : filteredApps.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-white/20">
               <ShieldAlert className="w-16 h-16 mb-4 opacity-40 text-blue-500" />
               <p className="font-black tracking-widest uppercase text-lg">No Candidates Found</p>
               <p className="text-xs mt-1 opacity-50 font-medium">The recruitment pipeline is empty for the current criteria.</p>
             </div>
          ) : (
            <AnimatePresence>
              {filteredApps.map((app, i) => {
                const isHighlighted = String(app.id) === String(highlightedAppId);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, ease: "easeOut" }}
                    key={app.id}
                    id={`app-card-${app.id}`}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-4 items-start md:items-center bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/5 hover:border-white/10 rounded-2xl group ${
                      isHighlighted
                        ? 'ring-4 ring-[#00b4d8] shadow-[0_0_35px_rgba(0,180,216,0.6)] scale-[1.01]'
                        : ''
                    }`}
                  >
                  {/* Candidate Identity */}
                  <div className="col-span-3 flex items-center gap-4 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0 text-[#00b4d8] font-black uppercase text-lg">
                      {app.name ? app.name.charAt(0) : '?'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{app.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Applied: {formatDate(app.created_at)}</p>
                    </div>
                  </div>
                  
                   {/* Contact Info */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3 text-white/30" />
                      <span className="text-xs font-medium text-white/60 truncate" title={app.email}>{app.email}</span>
                    </div>
                    {app.mobile_number && (
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 text-white/30" />
                        <span className="text-xs font-medium text-white/60 truncate">{app.mobile_number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/40 text-[10px]">
                      <span>{app.branch} ({app.admission_year})</span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-[#00b4d8] uppercase tracking-widest block mb-0.5">
                      {app.technical_specialization || app.batch_year || 'Developer'}
                    </span>
                    <span className="text-[10px] text-white/50 block mb-1.5">
                      {app.current_semester || 'N/A'}
                    </span>
                    <div className="flex gap-2">
                      {app.linkedin_url && (
                        <a href={app.linkedin_url} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                          LinkedIn
                        </a>
                      )}
                      {app.github_url && (
                        <a href={app.github_url} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Status / Action */}
                  <div className="col-span-4 flex items-center justify-end gap-3">
                    {app.generated_user_id && (
                      <div className="text-left bg-black/25 p-2.5 rounded-lg border border-white/5 font-mono text-[9px] text-white/50 shrink-0">
                        <span className="text-emerald-400 font-bold block">CREDENTIALS SEEDED:</span>
                        <span>ID: {app.generated_user_id}</span><br />
                        <span>PW: {app.generated_password}</span>
                      </div>
                    )}
                    <select
                      value={app.status || 'PENDING'}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg border cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00b4d8]/40 transition-all ${STATUS_COLORS[app.status || 'PENDING']} bg-transparent`}
                      style={{ minWidth: '130px' }}
                    >
                      <option value="PENDING"    className="bg-[#1c222b] text-white normal-case">⏳ Pending</option>
                      <option value="SHORTLISTED" className="bg-[#1c222b] text-white normal-case">⭐ Shortlist</option>
                      <option value="SCHEDULED"  className="bg-[#1c222b] text-white normal-case">📅 Schedule</option>
                      <option value="APPROVED"   className="bg-[#1c222b] text-white normal-case">✅ Approve</option>
                      <option value="ACCEPTED"   className="bg-[#1c222b] text-white normal-case">✅ Accept</option>
                      <option value="REJECTED"   className="bg-[#1c222b] text-white normal-case">❌ Reject</option>
                    </select>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this application?")) {
                          try {
                            await applicationsAPI.delete(app.id);
                            setApplications(prev => prev.filter(a => a.id !== app.id));
                          } catch {
                            alert("Failed to delete application");
                          }
                        }
                      }}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                      title="Delete Application"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          )}
        </div>
      </div>

    </div>
  );
}

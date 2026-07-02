import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI } from '../api/services';
import { Check, X, Briefcase, Server, ShieldAlert, Phone, Mail, FileText, Search } from 'lucide-react';

const MOCK_APPLICATIONS = [
  { id: 'mock-a1', name: 'Aarav Kumar', email: 'aarav.k@bca.edu', contact: '9876543210', class_name: 'BCA 1st Year', interested: 'Web Development', status: 'PENDING', timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), resume_url: '' },
  { id: 'mock-a2', name: 'Pooja Sharma', email: 'pooja.s@mca.edu', contact: '9876501234', class_name: 'MCA 1st Year', interested: 'AI/ML', status: 'SHORTLISTED', timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), resume_url: 'https://docs.google.com' },
  { id: 'mock-a3', name: 'Rohan Gupta', email: 'rohan.g@btech.edu', contact: '9800000001', class_name: 'B.Tech 2nd Year', interested: 'Cybersecurity', status: 'SCHEDULED', timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), resume_url: 'https://docs.google.com' },
  { id: 'mock-a4', name: 'Nisha Patel', email: 'nisha.p@bca.edu', contact: '9810000002', class_name: 'BCA 2nd Year', interested: 'Mobile Development', status: 'APPROVED', timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), resume_url: '' },
  { id: 'mock-a5', name: 'Manav Singh', email: 'manav.s@mca.edu', contact: '9820000003', class_name: 'MCA 2nd Year', interested: 'Blockchain', status: 'REJECTED', timestamp: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), resume_url: '' },
  { id: 'mock-a6', name: 'Divya Nair', email: 'divya.n@bca.edu', contact: '9830000004', class_name: 'BCA 3rd Year', interested: 'UI/UX Design', status: 'PENDING', timestamp: new Date(Date.now() - 1 * 24 * 3600000).toISOString(), resume_url: 'https://docs.google.com' },
  { id: 'mock-a7', name: 'Kartik Joshi', email: 'kartik.j@btech.edu', contact: '9840000005', class_name: 'B.Tech 3rd Year', interested: 'Web Development', status: 'SHORTLISTED', timestamp: new Date(Date.now() - 4 * 24 * 3600000).toISOString(), resume_url: '' },
];

const STATUS_COLORS = {
  'PENDING': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  'SHORTLISTED': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'SCHEDULED': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'APPROVED': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'REJECTED': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
};

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export default function RecruitmentView() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const data = await applicationsAPI.getAll();
      setApplications(data?.length ? data : MOCK_APPLICATIONS);
    } catch (e) {
      setApplications(MOCK_APPLICATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Filter logic
  const filteblueApps = applications.filter(app => {
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
    approved: applications.filter(a => a.status === 'APPROVED').length,
  };

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
               <Briefcase className="w-4 h-4 text-blue-400" />
             </div>
             <span className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase">Operations Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md">
            Recruitment Pipeline
          </h1>
          <p className="text-white/40 mt-1 text-sm font-medium">
            Review incoming applications, manage interview statuses, and onboard new talent.
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1c222b] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-all uppercase tracking-wider cursor-pointer shrink-0"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="APPROVED">Approved</option>
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
        <div className="bg-[#1c222b] border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(234,179,8,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-widest">Pending Review</p>
             <p className="text-2xl font-black text-indigo-500 mt-1">{stats.pending}</p>
           </div>
        </div>
        <div className="bg-[#1c222b] border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">In Pipeline (Shortlisted)</p>
             <p className="text-2xl font-black text-blue-400 mt-1">{stats.shortlisted}</p>
           </div>
        </div>
        <div className="bg-[#1c222b] border border-sky-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)]">
           <div>
             <p className="text-[10px] font-bold text-sky-400/60 uppercase tracking-widest">Approved</p>
             <p className="text-2xl font-black text-sky-400 mt-1">{stats.approved}</p>
           </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="flex-1 bg-[#1c222b] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest bg-black/20">
          <div className="col-span-3">Candidate Identity</div>
          <div className="col-span-2">Contact Info</div>
          <div className="col-span-2">Academic Class</div>
          <div className="col-span-2">Role Interest</div>
          <div className="col-span-3 text-right">Status & Action</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteblueApps.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-white/20">
               <ShieldAlert className="w-16 h-16 mb-4 opacity-40 text-blue-500" />
               <p className="font-black tracking-widest uppercase text-lg">No Candidates Found</p>
               <p className="text-sm mt-1 opacity-50 font-medium">The recruitment pipeline is empty for the current criteria.</p>
             </div>
          ) : (
            <AnimatePresence>
              {filteblueApps.map((app, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: "easeOut" }}
                  key={app.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/5 hover:border-white/10 rounded-2xl group"
                >
                  
                  {/* Candidate Identity */}
                  <div className="col-span-3 flex items-center gap-4 pr-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0 text-[#00b4d8] font-black uppercase text-lg">
                      {app.name ? app.name.charAt(0) : '?'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{app.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Applied: {formatDate(app.timestamp)}</p>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3 text-white/30" />
                      <span className="text-xs font-medium text-white/60 truncate" title={app.email}>{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-white/30" />
                      <span className="text-xs font-medium text-white/60 truncate">{app.contact || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Academic Class */}
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-white/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 block w-max">
                      {app.class_name || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Role Interest & Resume */}
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-[#00b4d8] uppercase tracking-widest block mb-1">
                      {app.interested || 'General'}
                    </span>
                    {app.resume_url ? (
                      <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                        <FileText className="w-3 h-3" /> View Resume
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1">
                        <X className="w-3 h-3" /> No Resume
                      </span>
                    )}
                  </div>
                  
                  {/* Status / Action */}
                  <div className="col-span-3 flex items-center justify-end gap-3">
                    
                    {/* Status Badge */}
                    <div className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center justify-center shrink-0 w-28 ${STATUS_COLORS[app.status || 'PENDING']}`}>
                      {app.status || 'PENDING'}
                    </div>

                    {/* Action Dropdown */}
                    <select
                      value={app.status || 'PENDING'}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="w-8 h-8 opacity-0 absolute cursor-pointer"
                      title="Update Status"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlist</option>
                      <option value="SCHEDULED">Schedule Interview</option>
                      <option value="APPROVED">Approve (Hire)</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                    
                    {/* Visible Action Button Trigger (Acts as proxy for the invisible select above) */}
                    <div className="relative group cursor-pointer">
                      <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400 transition-all pointer-events-none">
                        <Briefcase className="w-4 h-4" />
                      </button>
                      
                      {/* Note: The invisible select overlays this button, so clicking the button opens the select dropdown natively */}
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 180, 216, 0.5); }
      `}} />
    </div>
  );
}

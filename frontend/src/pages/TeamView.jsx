import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Shield, X, Code, Star, MoreVertical, Plus, Briefcase, Award, Phone, Trash2, GraduationCap, UserPlus, Upload, FileText, Fingerprint, Terminal, User } from 'lucide-react';
import { usersAPI, teamsAPI } from '../api/services';
import { useAuth } from '../contexts/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Modern Profile Card Component
const calculateAcademicYear = (user) => {
  if (user.isPassout) return "Passout (Alumni)";
  
  const joiningYear = user.joiningYear || user.admission_year;
  const joiningClass = user.joiningClass || '1st Year';
  
  if (!joiningYear) return 'N/A';
  
  let baseOffset = 0;
  if (joiningClass === '2nd Year') baseOffset = 1;
  else if (joiningClass === '3rd Year') baseOffset = 2;
  else if (joiningClass === 'Final Year') baseOffset = 3;

  const now = new Date();
  const currentYear = now.getFullYear();
  // Month is 0-indexed: 7 is August.
  const isAfterAug1 = now.getMonth() > 7 || (now.getMonth() === 7 && now.getDate() >= 1);
  const currentAcademicCycle = isAfterAug1 ? currentYear : currentYear - 1;
  
  const yearsPassed = (currentAcademicCycle - joiningYear) + baseOffset;
  
  if (yearsPassed < 0) return "Pre-Joining";
  if (yearsPassed === 0) return "1st Year";
  if (yearsPassed === 1) return "2nd Year";
  if (yearsPassed === 2) return "3rd Year";
  if (yearsPassed === 3) return "Final Year";
  return "Passout (Alumni)";
};

const ProfileCard = ({ user, isFlipped, onFlip, onMarkPassout, onDelete, currentUserRole }) => {
  const getRoleStyling = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case 'admin': return { text: 'Admin', icon: Shield };
      case 'mentor': return { text: 'Mentor', icon: Star };
      default: return { text: 'Developer', icon: Code };
    }
  };

  const style = getRoleStyling(user.role);
  const RoleIcon = style.icon;
  
  // Unified color scheme for all cards
  const THEME_BG = 'bg-violet-700'; // Deep violet for banner
  const THEME_HEX = '#a855f7'; // Bright violet for text accents
  const CARD_BG = 'bg-[#1c222b]'; // Dark dashboard card bg
  const CARD_BG_HEX = '#1c222b'; // For SVG cutout
  const TEXT_PRIMARY = 'text-white';
  const TEXT_SECONDARY = 'text-white/50';

  return (
    <motion.div
      variants={itemVariants}
      className="relative w-full h-[380px] cursor-pointer group"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
    >
      <div
        className="w-full h-full relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu hover:-translate-y-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-3xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT FACE */}
        <div
          className={`absolute inset-0 ${CARD_BG} rounded-3xl overflow-hidden flex flex-col border border-white/5`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Top Coloblue Banner with Curve */}
          <div className={`relative h-[130px] w-full ${THEME_BG}`}>
            {/* Subtle Texture (Vertical Stripes) */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,1)_50%,transparent_51%)] bg-[length:30px_100%]"></div>
            
            {/* Smooth Asymmetrical SVG Wave */}
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute -bottom-1 left-0 w-full h-12">
              <path d="M0,25 L0,0 C30,25 70,5 100,0 L100,25 Z" fill={CARD_BG_HEX} />
            </svg>

            {/* Header Text/Logo */}
            <div className="absolute top-5 w-full flex justify-center items-center gap-1.5 opacity-90">
              <span className="text-white font-black tracking-widest text-lg uppercase drop-shadow-md">SDC Portal</span>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 z-10">
            <div className={`w-[104px] h-[104px] rounded-full p-1 ${CARD_BG} shadow-xl`}>
              <div className="w-full h-full rounded-full border-2 overflow-hidden" style={{ borderColor: THEME_HEX }}>
                {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <img src={`https://ui-avatars.com/api/?name=${user.name || user.email}&background=${THEME_HEX.replace('#','')}&color=fff&bold=true&size=200`} alt={user.name} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-[72px] px-6 flex flex-col items-center text-center">
            <h3 className={`text-[20px] font-black ${TEXT_PRIMARY} tracking-tight leading-tight mb-0.5 truncate w-full`}>{user.name || user.email?.split('@')[0]}</h3>
            <p className={`text-[11px] font-medium ${TEXT_SECONDARY} mb-3 truncate w-full`}>{user.email}</p>
            
            <div className="w-40 h-[1.5px] bg-white/10 rounded-full mb-3"></div>
            
            <h4 className={`text-sm font-bold ${TEXT_PRIMARY} uppercase tracking-widest`}>Assigned Role</h4>
            <p className="text-xs font-semibold mt-1 mb-3" style={{ color: THEME_HEX }}>{style.text}</p>
            
            <div className="w-40 h-[1.5px] bg-white/10 rounded-full mb-3"></div>
            
            <h4 className={`text-sm font-bold ${TEXT_PRIMARY} uppercase tracking-widest`}>Academic Year</h4>
            <p className={`text-xs font-semibold mt-1 ${TEXT_SECONDARY}`}>{calculateAcademicYear(user)}</p>
          </div>

          {/* Footer */}
          <div className={`mt-auto h-9 ${THEME_BG} flex items-center justify-center relative z-20`}>
            <span className="text-white/80 text-[9px] font-bold tracking-[0.2em] uppercase">softwablueevelopmentcell.com</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className={`absolute inset-0 ${CARD_BG} rounded-3xl overflow-hidden flex flex-col border border-white/5 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Top Coloblue Banner with Curve (Same as front) */}
          <div className={`relative h-[130px] w-full ${THEME_BG} shrink-0`}>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,1)_50%,transparent_51%)] bg-[length:30px_100%]"></div>
            
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" className="absolute -bottom-1 left-0 w-full h-12">
              <path d="M0,25 L0,0 C30,25 70,5 100,0 L100,25 Z" fill={CARD_BG_HEX} />
            </svg>

            <div className="absolute top-5 w-full flex justify-center items-center gap-1.5 opacity-90">
              <span className="text-white font-black tracking-widest text-lg uppercase drop-shadow-md">Dossier</span>
            </div>
          </div>

          <div className="px-5 pb-3 pt-3 flex-1 flex flex-col">
            <div className="flex items-center justify-center gap-2 mb-2 shrink-0">
              <RoleIcon className="w-4 h-4" style={{ color: THEME_HEX }} />
              <h4 className={`text-xs font-black ${TEXT_PRIMARY} uppercase tracking-widest`}>Dossier Info</h4>
            </div>

            <div className="space-y-2 flex-1 flex flex-col justify-center my-auto">
              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Assigned Role</span>
                <span className="text-xs font-bold text-white">{style.text}</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Division</span>
                <span className="text-xs font-bold text-white">{user.branch || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Joined SDC</span>
                <span className="text-xs font-bold text-white">{user.joiningYear || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user.isPassout ? 'bg-cyan-500' : 'bg-sky-500'}`}></span>
                  <span className="text-xs font-bold text-white">{user.isPassout ? 'Alumni' : 'Active'}</span>
                </div>
              </div>
            </div>

            {currentUserRole === 'admin' ? (
              <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[11px] font-bold transition-all border border-blue-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
                {user.role?.toLowerCase() !== 'mentor' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMarkPassout(user.id); }}
                    disabled={user.isPassout}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${user.isPassout ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed' : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border-violet-500/20'}`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    {user.isPassout ? 'Alumni' : 'Passout'}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-auto text-[10px] font-bold text-white/30 text-center flex items-center justify-center gap-1 shrink-0">
                <X className="w-3 h-3" /> Tap to close
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className={`mt-auto h-9 ${THEME_BG} flex items-center justify-center relative z-20 shrink-0`}>
            <span className="text-white/80 text-[9px] font-bold tracking-[0.2em] uppercase">softwablueevelopmentcell.com</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};


export default function TeamView() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'developer', joiningYear: new Date().getFullYear(), joiningClass: '1st Year' });
  const [modalStatus, setModalStatus] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkStatus, setBulkStatus] = useState(null); // { type: 'success'|'error', msg: '' }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, t] = await Promise.all([
          usersAPI.getAll().catch(() => []),
          teamsAPI.getAll().catch(() => [])
        ]);
        setUsers(u && u.length > 0 ? u : []);
        setTeams(t && t.length > 0 ? t : []);
      } catch (e) {
        setUsers([]);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-card')) {
        setFlippedCardId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      setUsers(users.filter(u => u.id !== id));
      setFlippedCardId(null);
    } catch(e) {
      console.error(e);
    }
  };

  const handleMarkPassout = async (id) => {
    try {
      setUsers(users.map(u => u.id === id ? { ...u, isPassout: true } : u));
    } catch(e) {
      console.error(e);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalStatus('Adding member...');
    try {
      const createdUser = await usersAPI.create(newUser);
      setUsers([createdUser, ...users]);
      setModalStatus('');
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'developer', joiningYear: new Date().getFullYear(), joiningClass: '1st Year' });
    } catch (e) {
      setModalStatus('Error creating user.');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;
    
    setBulkStatus({ type: 'loading', msg: 'Uploading members...' });
    
    const formData = new FormData();
    formData.append('file', bulkFile);
    
    try {
      const response = await usersAPI.bulkUpload(formData);
      setBulkStatus({ type: 'success', msg: response.message || `Successfully uploaded.` });
      // Refresh user list
      const u = await usersAPI.getAll().catch(() => []);
      setUsers(u && u.length > 0 ? u : []);
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setBulkStatus(null);
        setBulkFile(null);
      }, 3000);
    } catch (e) {
      setBulkStatus({ type: 'error', msg: e?.response?.data?.detail || 'Error uploading file.' });
    }
  };

  return (
    <motion.div 
      className="space-y-10 relative pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            {/* Header section (Removed Personnel Registry) */}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Team Directory
          </h1>
          <p className="text-sm text-white/40 mt-1 font-medium tracking-wide">Manage organization hierarchy, members, and access levels.</p>
        </div>
        
        {role === 'admin' && (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Teams List (Organizational Units) */}
        <motion.div variants={itemVariants} className="xl:col-span-1 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Briefcase className="w-4 h-4 text-white/40" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Active Divisions</h3>
          </div>
          
          <div className="space-y-3">
            {teams.map(team => (
              <div key={team.id} className="p-5 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                <h4 className="text-white text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors mb-1">{team.name}</h4>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{team.description}</p>
              </div>
            ))}
          </div>

          {/* Team Composition Widget */}
          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-6">
              <Shield className="w-4 h-4 text-white/40" />
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Team Composition</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Mentor Stat */}
              <div className="bg-[#1c222b] p-4 rounded-2xl border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <span className="text-3xl font-black text-sky-400 mb-1">{users.filter(u => u.role === 'mentor').length}</span>
                <span className="text-[10px] font-bold text-sky-400/60 uppercase tracking-widest">Mentors</span>
              </div>

              {/* Developer Stat */}
              <div className="bg-[#1c222b] p-4 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <span className="text-3xl font-black text-blue-400 mb-1">{users.filter(u => u.role === 'developer').length}</span>
                <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Developers</span>
              </div>
            </div>
            
            {/* Alumni Stat */}
            <div className="mt-4 bg-[#1c222b] p-3.5 rounded-xl border border-cyan-500/20 flex items-center justify-between shadow-[0_0_10px_rgba(249,115,22,0.05)]">
               <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> Alumni Network</span>
               <span className="text-xl font-black text-cyan-400">{users.filter(u => u.isPassout).length}</span>
            </div>
          </div>
        </motion.div>

        {/* Members Grid */}
        <div className="xl:col-span-3">
          {users.filter(u => u.role !== 'admin').length === 0 ? (
            <div className="h-full min-h-[380px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/40">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-bold tracking-widest uppercase">No Members Found</p>
              <p className="text-xs mt-2 opacity-50">Add a Mentor or Developer to populate the registry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.filter(u => u.role !== 'admin').map((user) => (
                <ProfileCard 
                  key={user.id} 
                  user={user} 
                  isFlipped={flippedCardId === user.id}
                  onFlip={() => setFlippedCardId(flippedCardId === user.id ? null : user.id)}
                  onDelete={handleDeleteUser}
                  onMarkPassout={handleMarkPassout}
                  currentUserRole={role}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Premium Add Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-colors border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30">
                    <UserPlus className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">Add New Member</h2>
                </div>
                <p className="text-sm text-white/40 mb-8 ml-14">Register a new profile and assign system access levels.</p>
                
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Full Name</label>
                      <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all outline-none" placeholder="e.g. John Doe" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
                      <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all outline-none" placeholder="john@sdc.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Temporary Password</label>
                      <input required type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all outline-none" placeholder="Enter temporary password" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Joining Year</label>
                      <input required type="number" min="1990" max="2100" value={newUser.joiningYear} onChange={e => setNewUser({...newUser, joiningYear: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all outline-none" placeholder="e.g. 2024" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Joined As (Class)</label>
                      <div className="relative">
                        <select required value={newUser.joiningClass} onChange={e => setNewUser({...newUser, joiningClass: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all appearance-none cursor-pointer outline-none">
                          <option value="1st Year" className="bg-[#0a0a0a]">1st Year</option>
                          <option value="2nd Year" className="bg-[#0a0a0a]">2nd Year</option>
                          <option value="3rd Year" className="bg-[#0a0a0a]">3rd Year</option>
                          <option value="Final Year" className="bg-[#0a0a0a]">Final Year</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Role / Access Level</label>
                      <div className="relative">
                        <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all appearance-none cursor-pointer outline-none">
                          <option value="developer" className="bg-[#0a0a0a]">Developer</option>
                          <option value="mentor" className="bg-[#0a0a0a]">Mentor</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {modalStatus && (
                    <div className="text-xs text-blue-400 font-medium text-center bg-blue-500/10 py-2 rounded-lg border border-blue-500/20">
                      {modalStatus}
                    </div>
                  )}
                  
                  <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 mt-2 text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                    Create Member Profile
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !bulkStatus?.type?.includes('loading') && setIsBulkModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

              <button 
                type="button"
                onClick={() => !bulkStatus?.type?.includes('loading') && setIsBulkModalOpen(false)}
                className="absolute top-6 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-colors border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30">
                    <Upload className="w-6 h-6 text-sky-400" />
                  </div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">Bulk Upload</h2>
                </div>
                <p className="text-sm text-white/40 mb-8 ml-14">Upload a CSV file to add multiple members at once (Max 500).</p>
                
                <form onSubmit={handleBulkUpload} className="space-y-6">
                  
                  <div className="relative w-full border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <input 
                      type="file" 
                      accept=".csv"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => setBulkFile(e.target.files[0])}
                    />
                    <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-white/40 group-hover:text-white/80" />
                    </div>
                    <p className="text-white font-bold mb-1">{bulkFile ? bulkFile.name : "Click or drag CSV file here"}</p>
                    <p className="text-xs text-white/30 text-center px-4">
                      {bulkFile ? `${(bulkFile.size / 1024).toFixed(1)} KB` : "Requiblue columns: Name, Email, Password, Role, Branch, Admission Year"}
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={!bulkFile || bulkStatus?.type === 'loading'}
                    className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${!bulkFile || bulkStatus?.type === 'loading' ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)]'}`}
                  >
                    {bulkStatus?.type === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {bulkStatus?.type === 'loading' ? 'Uploading...' : 'Start Upload'}
                  </button>

                  {bulkStatus && (
                    <div className={`p-4 rounded-xl border text-sm font-medium ${bulkStatus.type === 'success' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      {bulkStatus.msg}
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

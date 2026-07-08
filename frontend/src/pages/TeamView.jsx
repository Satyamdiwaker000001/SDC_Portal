import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Shield, X, Code, Star, MoreVertical, Plus, Briefcase, Award, Phone, Trash2, GraduationCap, UserPlus, Upload, FileText, Fingerprint, Terminal, User, Edit3, Image, Camera } from 'lucide-react';
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

const ProfileCard = ({ user, isFlipped, onFlip, onMarkPassout, onDelete, onEdit, currentUserRole, currentUserId }) => {
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
  const THEME_BG = 'bg-[#00879e]'; // Global cyan dark banner
  const THEME_HEX = '#00b4d8'; // Global primary cyan accent
  const CARD_BG = 'bg-[#1c222b]'; // Dark dashboard card bg
  const CARD_BG_HEX = '#1c222b'; // For SVG cutout
  const TEXT_PRIMARY = 'text-white';
  const TEXT_SECONDARY = 'text-white/50';

  return (
    <motion.div
      variants={itemVariants}
      className="relative w-full h-[380px] group"
      style={{ perspective: '1200px' }}
    >
      <div
        className="w-full h-full relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-3xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT FACE — click to flip */}
        <div
          className={`absolute inset-0 ${CARD_BG} rounded-3xl overflow-hidden flex flex-col border border-white/5 cursor-pointer`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          onClick={onFlip}
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
                {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=${THEME_HEX.replace('#','')}&color=fff&bold=true&size=200`} alt={user.name} className="w-full h-full object-cover" />
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
            <span className="text-white/80 text-[9px] font-bold tracking-[0.2em] uppercase">softwaredevelopmentcell.com</span>
          </div>
        </div>

        {/* BACK FACE — clicks here should NOT flip back */}
        <div
          className={`absolute inset-0 ${CARD_BG} rounded-3xl overflow-hidden flex flex-col border border-white/5 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          onClick={(e) => e.stopPropagation()}
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
                <span className="text-xs font-bold text-white">{user.joiningYear || user.admission_year || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user.isPassout ? 'bg-cyan-500' : 'bg-sky-500'}`}></span>
                  <span className="text-xs font-bold text-white">{user.isPassout ? 'Alumni' : 'Active'}</span>
                </div>
              </div>
            </div>

            {currentUserRole === 'admin' || currentUserId === user.id ? (
              <div className="mt-auto grid grid-cols-2 gap-2 pt-3 border-t border-white/10 shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                  className={`flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-[10px] font-bold transition-all border border-white/10 ${currentUserRole !== 'admin' ? 'col-span-2' : ''}`}
                >
                  <Edit3 className="w-3 h-3" /> Edit Profile
                </button>
                {currentUserRole === 'admin' && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
                      className="flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-500/10 text-[#00b4d8] hover:bg-blue-500/20 text-[10px] font-bold transition-all border border-blue-500/20"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                    {user.role?.toLowerCase() !== 'mentor' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onMarkPassout(user.id); }}
                        disabled={user.isPassout}
                        className={`col-span-2 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all border ${user.isPassout ? 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed' : 'bg-[#00b4d8]/10 text-[#00b4d8] hover:bg-[#00b4d8]/20 border-[#00b4d8]/20'}`}
                      >
                        <GraduationCap className="w-3 h-3" />
                        {user.isPassout ? 'Alumni' : 'Mark as Passout'}
                      </button>
                    )}
                  </>
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
            <span className="text-white/80 text-[9px] font-bold tracking-[0.2em] uppercase">softwaredevelopmentcell.com</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};


export default function TeamView() {
  const { role, user: currentUser } = useAuth();
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

  // Edit User State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, t] = await Promise.all([
          usersAPI.getAll().catch(() => []),
          teamsAPI.getAll().catch(() => [])
        ]);
        const mapped = (u || []).map(usr => ({
          ...usr,
          isPassout: usr.membership_status === 'alumni'
        }));
        setUsers(mapped);
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
      await usersAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
      setFlippedCardId(null);
    } catch(e) {
      console.error(e);
      alert("Failed to delete user from database.");
    }
  };

  const handleMarkPassout = async (id) => {
    try {
      await usersAPI.toggleMembership(id, true);
      setUsers(users.map(u => u.id === id ? { ...u, isPassout: true, membership_status: 'alumni' } : u));
    } catch(e) {
      console.error(e);
      alert("Failed to mark user as passout/alumni");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editUserData) return;
    setIsSubmittingEdit(true);
    try {
      const updatedUser = await usersAPI.update(editUserData.id, {
        name: editUserData.name,
        role: editUserData.role,
        github_url: editUserData.github_url || null,
        linkedin_url: editUserData.linkedin_url || null,
        profile_image: editUserData.profile_image || null,
        branch: editUserData.branch || "N/A",
        admission_year: parseInt(editUserData.admission_year) || 0,
        passout_year: parseInt(editUserData.passout_year) || 0,
        tech_stack: typeof editUserData.tech_stack === 'string'
          ? editUserData.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(editUserData.tech_stack) ? editUserData.tech_stack : [])
      });
      setUsers(users.map(u => u.id === updatedUser.id ? { ...updatedUser, isPassout: updatedUser.membership_status === 'alumni' } : u));
      setEditModalOpen(false);
      setEditUserData(null);
    } catch(e) {
      alert(e.response?.data?.detail || "Failed to update user");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await usersAPI.uploadAvatar(editUserData.id, formData);
      setEditUserData({...editUserData, profile_image: res.url});
      setAvatarPreview(res.url);
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
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
            <div className="w-8 h-8 rounded-lg bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#00b4d8]" />
            </div>
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
              className="bg-[#00b4d8] hover:bg-[#00c8f0] text-[#020617] px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,180,216,0.3)] hover:shadow-[0_0_25px_rgba(0,180,216,0.5)] flex items-center gap-2 shrink-0"
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
                <h4 className="text-white text-base font-bold tracking-tight group-hover:text-[#00b4d8] transition-colors mb-1">{team.name}</h4>
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
                  onEdit={(u) => {
                     setEditUserData({
                       ...u,
                       tech_stack: Array.isArray(u.tech_stack) ? u.tech_stack.join(', ') : (u.tech_stack || '')
                     });
                     setAvatarPreview(u.profile_image || null);
                     setEditModalOpen(true);
                   }}
                  currentUserRole={role}
                  currentUserId={currentUser?.id}
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8]/8 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00b4d8]/5 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-[#00b4d8] hover:bg-[#00b4d8]/10 hover:border-[#00b4d8]/20 transition-colors border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-[#00b4d8]/15 border border-[#00b4d8]/30">
                    <UserPlus className="w-6 h-6 text-[#00b4d8]" />
                  </div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">Add New Member</h2>
                </div>
                <p className="text-sm text-white/40 mb-8 ml-14">Register a new profile and assign system access levels.</p>
                
                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Full Name</label>
                      <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all outline-none" placeholder="e.g. John Doe" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
                      <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all outline-none" placeholder="john@sdc.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Temporary Password</label>
                      <input required type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all outline-none" placeholder="Enter temporary password" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Joining Year</label>
                      <input required type="number" min="1990" max="2100" value={newUser.joiningYear} onChange={e => setNewUser({...newUser, joiningYear: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all outline-none" placeholder="e.g. 2024" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">Joined As (Class)</label>
                      <div className="relative">
                        <select required value={newUser.joiningClass} onChange={e => setNewUser({...newUser, joiningClass: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all appearance-none cursor-pointer outline-none">
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
                        <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b4d8]/50 focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all appearance-none cursor-pointer outline-none">
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
                    <div className="text-xs text-[#00b4d8] font-medium text-center bg-[#00b4d8]/10 py-2 rounded-lg border border-[#00b4d8]/20">
                      {modalStatus}
                    </div>
                  )}
                  
                  <button type="submit" className="w-full rounded-xl bg-[#00b4d8] hover:bg-[#00c8f0] py-3.5 mt-2 text-sm font-black text-[#020617] transition-all shadow-[0_0_15px_rgba(0,180,216,0.3)] hover:shadow-[0_0_25px_rgba(0,180,216,0.5)] uppercase tracking-wider">
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

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModalOpen && editUserData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#00b4d8]/20 to-transparent relative overflow-hidden shrink-0">
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/20 flex items-center justify-center border border-[#00b4d8]/30">
                       <Edit3 className="w-5 h-5 text-[#00b4d8]" />
                     </div>
                     <h2 className="text-lg font-black text-white tracking-widest uppercase">Edit Dossier</h2>
                   </div>
                   <button 
                     onClick={() => setEditModalOpen(false)}
                     className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="edit-user-form" onSubmit={handleEditUser} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Full Name</label>
                     <input 
                       type="text" required
                       value={editUserData.name}
                       onChange={e => setEditUserData({...editUserData, name: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                     />
                  </div>

                  {role === 'admin' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Assigned Role</label>
                       <select
                         required
                         value={editUserData.role}
                         onChange={e => setEditUserData({...editUserData, role: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                       >
                         <option value="developer" className="bg-[#0f172a]">Developer</option>
                         <option value="mentor" className="bg-[#0f172a]">Mentor</option>
                         <option value="admin" className="bg-[#0f172a]">Admin</option>
                       </select>
                    </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Branch / Division</label>
                     <input 
                       type="text"
                       placeholder="e.g. CSE, IT"
                       value={editUserData.branch || ''}
                       onChange={e => setEditUserData({...editUserData, branch: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Admission Year</label>
                       <input 
                         type="number"
                         value={editUserData.admission_year || ''}
                         onChange={e => setEditUserData({...editUserData, admission_year: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Passout Year</label>
                       <input 
                         type="number"
                         value={editUserData.passout_year || ''}
                         onChange={e => setEditUserData({...editUserData, passout_year: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Tech Stack (comma-separated)</label>
                     <input 
                       type="text"
                       placeholder="React, FastAPI, MySQL"
                       value={editUserData.tech_stack || ''}
                       onChange={e => setEditUserData({...editUserData, tech_stack: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">GitHub URL</label>
                     <input 
                       type="url"
                       placeholder="https://github.com/username"
                       value={editUserData.github_url || ''}
                       onChange={e => setEditUserData({...editUserData, github_url: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">LinkedIn URL</label>
                     <input 
                       type="url"
                       placeholder="https://linkedin.com/in/username"
                       value={editUserData.linkedin_url || ''}
                       onChange={e => setEditUserData({...editUserData, linkedin_url: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-sm"
                     />
                  </div>
                  
                  {/* Profile Image Upload Section */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Profile Photo</label>
                     
                     {/* Avatar Preview + Upload Button */}
                     <div className="flex items-center gap-4">
                       <div className="relative w-16 h-16 shrink-0">
                         <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00b4d8]/40 bg-white/5">
                           <img 
                             src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(editUserData?.name || 'User')}&background=00b4d8&color=fff&bold=true&size=128`}
                             alt="Avatar"
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <button
                           type="button"
                           onClick={() => avatarInputRef.current?.click()}
                           disabled={avatarUploading}
                           className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00b4d8] flex items-center justify-center hover:bg-[#00c8f0] transition-colors disabled:opacity-50"
                         >
                           {avatarUploading ? (
                             <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                           ) : (
                             <Camera className="w-3 h-3 text-white" />
                           )}
                         </button>
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-xs text-white/50 mb-2">Upload a photo or paste a URL below</p>
                         <button
                           type="button"
                           onClick={() => avatarInputRef.current?.click()}
                           disabled={avatarUploading}
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                         >
                           <Upload className="w-3 h-3" />
                           {avatarUploading ? 'Uploading...' : 'Upload Image'}
                         </button>
                       </div>
                       {/* Hidden file input */}
                       <input
                         ref={avatarInputRef}
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;
                           setAvatarUploading(true);
                           try {
                             const fd = new FormData();
                             fd.append('file', file);
                             const res = await usersAPI.uploadAvatar(editUserData.id, fd);
                             setAvatarPreview(res.url);
                             setEditUserData(prev => ({ ...prev, profile_image: res.url }));
                           } catch (err) {
                             alert('Image upload failed. Try a URL instead.');
                           } finally {
                             setAvatarUploading(false);
                             e.target.value = '';
                           }
                         }}
                       />
                     </div>

                     {/* URL Fallback input */}
                     <input 
                       type="url"
                       placeholder="Or paste image URL here..."
                       value={editUserData.profile_image || ''}
                       onChange={e => {
                         setEditUserData({...editUserData, profile_image: e.target.value});
                         setAvatarPreview(e.target.value || null);
                       }}
                       className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-[#00b4d8] focus:bg-white/10 transition-all font-medium text-xs placeholder:text-white/20"
                     />
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
                <button 
                  type="button" onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                >Cancel</button>
                <button 
                  form="edit-user-form" type="submit" disabled={isSubmittingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#00b4d8] text-[#020617] hover:bg-[#00c8f0] transition-all text-sm font-black uppercase tracking-widest disabled:opacity-50"
                >{isSubmittingEdit ? 'Saving...' : 'Save Updates'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

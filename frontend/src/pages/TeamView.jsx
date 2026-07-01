import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, UserPlus, Shield, X } from 'lucide-react';
import { usersAPI, teamsAPI } from '../api/services';
import { useAuth } from '../contexts/AuthContext';

export default function TeamView() {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'developer' });
  const [modalStatus, setModalStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, t] = await Promise.all([usersAPI.getAll(), teamsAPI.getAll()]);
        setUsers(u);
        setTeams(t);
      } catch (e) {
        console.error("Failed to fetch team data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalStatus('Creating...');
    try {
      const createdUser = await usersAPI.create(newUser);
      setUsers([createdUser, ...users]);
      setModalStatus('');
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'developer' });
    } catch (e) {
      setModalStatus('Error creating user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Team Directory</h1>
          <p className="text-surface-400 mt-1">Manage members and organizational structure.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
          >
            + Add Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Teams List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-medium text-surface-300 uppercase tracking-wider">Departments</h3>
          {isLoading ? <p className="text-sm text-surface-500">Loading...</p> : teams.map(team => (
            <div key={team.id} className="p-3 bg-surface-900/40 border border-white/5 rounded-xl cursor-pointer hover:bg-surface-800/40 transition-colors">
              <h4 className="text-white text-sm font-medium">{team.name}</h4>
              <p className="text-xs text-surface-500 mt-1">{team.description}</p>
            </div>
          ))}
        </div>

        {/* Members Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isLoading ? <p className="text-sm text-surface-500">Loading members...</p> : users.map((user, i) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-900/40 backdrop-blur-lg border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">{user.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{user.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider ${
                      user.role === 'admin' ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-800 text-surface-300'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500 truncate mt-1">{user.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-surface-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-surface-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-white mb-6">Create New Member</h2>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Full Name</label>
                  <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-surface-800/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Email</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-surface-800/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Temporary Password</label>
                  <input required type="text" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-surface-800/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Role</label>
                  <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-surface-800/50 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-500/50 focus:outline-none">
                    <option value="developer">Developer</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {modalStatus && <p className="text-sm text-brand-400">{modalStatus}</p>}
                
                <button type="submit" className="w-full inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-400 mt-4">
                  Create Member
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

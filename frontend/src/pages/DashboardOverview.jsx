import React from 'react';
import { Activity, FolderKanban, Users, Briefcase, TrendingUp, CheckSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI } from '../api/services';

const stats = [
  { label: 'Active Projects', value: '12', icon: FolderKanban, trend: '+2 this week' },
  { label: 'Total Members', value: '148', icon: Users, trend: '+12 this month' },
  { label: 'Open Tasks', value: '45', icon: Activity, trend: '15 overdue' },
  { label: 'Applications', value: '89', icon: Briefcase, trend: '+24 this week' },
];

const recentActivity = [
  { id: 1, action: 'Project "Alpha" was approved', user: 'Admin User', time: '2 hours ago' },
  { id: 2, action: 'Task "Database Normalization" completed', user: 'Dev Team', time: '5 hours ago' },
  { id: 3, action: 'New member applied for Web Dev role', user: 'System', time: '1 day ago' },
  { id: 4, action: 'Global Notice: Scheduled Maintenance', user: 'Admin User', time: '2 days ago' },
];

export default function DashboardOverview() {
  const { role, user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementsAPI.getAll();
        setAnnouncements(data);
      } catch (e) {
        console.error("Failed to fetch announcements", e);
      }
    };
    fetchAnnouncements();
  }, []);

  const getStatsForRole = () => {
    if (role === 'admin') {
      return [
        { label: 'Active Projects', value: '12', icon: FolderKanban, trend: '+2 this week' },
        { label: 'Total Members', value: '148', icon: Users, trend: '+12 this month' },
        { label: 'Open Tasks', value: '45', icon: Activity, trend: '15 overdue' },
        { label: 'Applications', value: '89', icon: Briefcase, trend: '+24 this week' },
      ];
    } else if (role === 'developer') {
      return [
        { label: 'My Active Tasks', value: '4', icon: CheckSquare, trend: '2 due today' },
        { label: 'My Projects', value: '2', icon: FolderKanban, trend: 'Alpha & Beta' },
        { label: 'Hours Tracked', value: '32h', icon: Clock, trend: 'This week' },
      ];
    } else {
      return [
        { label: 'Mentored Projects', value: '3', icon: FolderKanban, trend: 'All active' },
        { label: 'Pending Reviews', value: '7', icon: Activity, trend: 'Needs attention' },
      ];
    }
  };

  const activeStats = getStatsForRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {role === 'admin' ? 'Admin Dashboard' : role === 'developer' ? 'Developer Portal' : 'Mentor Hub'}
        </h1>
        <p className="text-surface-400 mt-1">Welcome back, {user.name}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${role === 'admin' ? 'lg:grid-cols-4' : role === 'developer' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {activeStats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-surface-900/40 backdrop-blur-lg border border-white/5 hover:border-white/10 hover:bg-surface-800/40 transition-all duration-300 p-5 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-surface-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-semibold text-white mt-1">{stat.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
              <span className="text-surface-400">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area Placeholder */}
        <div className="lg:col-span-2 bg-surface-900/40 backdrop-blur-lg border border-white/5 hover:border-white/10 hover:bg-surface-800/40 transition-all duration-300 rounded-xl p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4">Project Velocity</h3>
          <div className="flex-1 border border-white/5 rounded-lg border-dashed flex items-center justify-center">
            <p className="text-surface-500">Chart Visualization Area</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-surface-900/40 backdrop-blur-lg border border-white/5 hover:border-white/10 hover:bg-surface-800/40 transition-all duration-300 rounded-xl p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4">Global Announcements</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {announcements.length === 0 ? (
              <p className="text-sm text-surface-500">No recent announcements.</p>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="relative pl-4 border-l border-white/10 pb-4 last:pb-0">
                  <div className="absolute w-2 h-2 bg-brand-500 rounded-full -left-[4.5px] top-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <p className="text-sm text-surface-200">{ann.title}</p>
                  <p className="text-xs text-surface-400 mt-1">{ann.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-brand-400">{ann.audience_type}</span>
                    <span className="text-xs text-surface-500">{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

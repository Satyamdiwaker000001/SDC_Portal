import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, ExternalLink, GitBranch, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI } from '../api/services';

export default function ProjectsView() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch(e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects Registry</h1>
          <p className="text-surface-400 mt-1">Manage and track all ongoing SDC projects.</p>
        </div>
        {role === 'admin' && (
          <button className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95">
            + New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-surface-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-surface-400">No projects found.</p>
        ) : projects.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={project.id}
            className="bg-surface-900/40 backdrop-blur-lg border border-white/5 hover:border-white/10 hover:bg-surface-800/40 transition-all duration-300 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="h-32 bg-surface-800 relative group border-b border-white/5">
              {/* Mock Banner */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute top-4 right-4">
                <button className="p-1.5 rounded-md bg-surface-950/50 text-surface-400 hover:text-white backdrop-blur-md">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md ${
                  project.status === 'ACTIVE' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/20' :
                  project.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                  'bg-surface-500/20 text-surface-300 border border-surface-500/20'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
              <p className="text-sm text-surface-400 mt-1">{project.type || 'Web App'} • {project.team_id || 'Unassigned'}</p>
              
              <div className="mt-6 mt-auto">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-surface-300">Progress</span>
                  <span className="text-white font-medium">50%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `50%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                <button className="flex-1 inline-flex items-center justify-center rounded-lg bg-surface-800 px-4 py-1.5 text-xs font-medium text-surface-200 transition-all border border-white/5 hover:bg-surface-700 hover:text-white active:scale-95">
                  <GitBranch className="w-3.5 h-3.5 mr-1.5" /> Repo
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-lg bg-surface-800 px-4 py-1.5 text-xs font-medium text-surface-200 transition-all border border-white/5 hover:bg-surface-700 hover:text-white active:scale-95">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

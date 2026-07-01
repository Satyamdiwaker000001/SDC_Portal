import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { applicationsAPI } from '../api/services';

export default function RecruitmentView() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicationsAPI.getAll();
        setApplications(data);
      } catch (e) {
        console.error("Failed to fetch applications", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Recruitment Pipeline</h1>
          <p className="text-surface-400 mt-1">Review incoming applications for the next cohort.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface-900/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-semibold text-surface-500 uppercase tracking-wider">
          <div className="col-span-3">Candidate</div>
          <div className="col-span-3">Branch/Year</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3 text-right">Status / Actions</div>
        </div>

        <div className="divide-y divide-white/5 overflow-y-auto h-[calc(100%-48px)]">
          {isLoading ? (
             <div className="p-4 text-surface-400">Loading pipeline...</div>
          ) : applications.length === 0 ? (
             <div className="p-4 text-surface-400">No pending applications.</div>
          ) : applications.map((app, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={app.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-800/30 transition-colors group"
            >
              <div className="col-span-3">
                <h4 className="text-sm font-medium text-white">{app.name}</h4>
                <p className="text-xs text-surface-500">{app.email}</p>
              </div>
              <div className="col-span-3 text-sm text-surface-300">
                {app.branch}
              </div>
              <div className="col-span-3 text-sm text-surface-300">
                {app.apply_for}
              </div>
              <div className="col-span-3 text-right flex items-center justify-end gap-2">
                <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md inline-block mr-2 ${
                  app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                  app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                  'bg-surface-500/20 text-surface-300'
                }`}>
                  {app.status || 'PENDING'}
                </span>
                
                {app.status !== 'APPROVED' && app.status !== 'REJECTED' && (
                  <>
                    <button onClick={() => handleUpdateStatus(app.id, 'APPROVED')} className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">✓</button>
                    <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20">✕</button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

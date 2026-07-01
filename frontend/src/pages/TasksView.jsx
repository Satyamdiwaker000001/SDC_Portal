import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Circle, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../api/services';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'COMPLETED': return <CheckSquare className="w-5 h-5 text-emerald-400" />;
    case 'IN_PROGRESS': return <AlertCircle className="w-5 h-5 text-brand-400" />;
    default: return <Circle className="w-5 h-5 text-surface-500" />;
  }
};

export default function TasksView() {
  const [filter, setFilter] = useState('ALL');
  const { role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksAPI.getAll();
        setTasks(data);
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tasks Board</h1>
          <p className="text-surface-400 mt-1">Cross-project task management and assignments.</p>
        </div>
        {role === 'admin' && (
          <button className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95">
            + Create Task
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-surface-800 text-white border border-white/10' : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-surface-900/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-semibold text-surface-500 uppercase tracking-wider">
          <div className="col-span-6 md:col-span-5">Task</div>
          <div className="col-span-3 hidden md:block">Project</div>
          <div className="col-span-3">Assignee</div>
          <div className="col-span-3 md:col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y divide-white/5 overflow-y-auto h-[calc(100%-48px)]">
          {isLoading ? (
             <div className="p-4 text-surface-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
             <div className="p-4 text-surface-400">No tasks found.</div>
          ) : tasks
            .filter(t => filter === 'ALL' || t.status === filter)
            .map((task, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={task.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-800/30 transition-colors cursor-pointer group"
            >
              <div className="col-span-6 md:col-span-5 flex items-start gap-3">
                <div className="mt-0.5"><StatusIcon status={task.status} /></div>
                <div>
                  <h4 className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'text-surface-400 line-through' : 'text-white group-hover:text-brand-400 transition-colors'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-500 md:hidden">
                    <span>{task.project}</span>
                  </div>
                  {task.comments > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-surface-400">
                      <MessageSquare className="w-3 h-3" /> {task.comments}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-3 hidden md:block text-sm text-surface-300">
                {task.project_id || 'Global'}
              </div>
              <div className="col-span-3 text-sm text-surface-300 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <span className="text-[10px]">{(task.assigned_to || 'U').charAt(0)}</span>
                </div>
                <span className="truncate">{task.assigned_to || 'Unassigned'}</span>
              </div>
              <div className="col-span-3 md:col-span-1 text-right">
                <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md inline-block ${
                  task.status === 'IN_PROGRESS' ? 'bg-brand-500/20 text-brand-400' :
                  task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-surface-500/20 text-surface-300'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

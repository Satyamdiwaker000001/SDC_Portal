import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TerminalSquare, Server, AlertCircle, LayoutList, History, CheckCircle2, Clock, Zap, Target } from 'lucide-react';
import { tasksAPI, interactionsAPI, usersAPI } from '../api/services';

const MOCK_TASKS = [
  { id: 'mock-tk1', moduleName: 'AUTH_MODULE', title: 'Implement JWT Token Refresh', project_id: 'SDC Portal v2', assignedTo: 'Aryan Sharma', status: 'COMPLETED', progress: 100 },
  { id: 'mock-tk2', moduleName: 'FRONTEND_UI', title: 'Build Recruitment Pipeline Dashboard', project_id: 'SDC Portal v2', assignedTo: 'Priya Singh', status: 'IN_PROGRESS', progress: 75 },
  { id: 'mock-tk3', moduleName: 'ML_PIPELINE', title: 'Train Face Recognition Model v2', project_id: 'AI Attendance', assignedTo: 'Rahul Verma', status: 'IN_PROGRESS', progress: 45 },
  { id: 'mock-tk4', moduleName: 'API_GATEWAY', title: 'Setup API rate limiting & security headers', project_id: 'Cybersec Dashboard', assignedTo: 'Dev Kapoor', status: 'TODO', progress: 0 },
  { id: 'mock-tk5', moduleName: 'DB_SCHEMA', title: 'Design normalized schema for Alumni module', project_id: 'Alumni Connect', assignedTo: 'Sneha Patel', status: 'TODO', progress: 10 },
  { id: 'mock-tk6', moduleName: 'MOBILE_APP', title: 'Implement push notifications for events', project_id: 'Campus Connect', assignedTo: 'Anjali Mehta', status: 'REVIEW', progress: 90 },
];

const MOCK_LOGS = [
  { id: 'log-1', user_id: 'mock-u1', interaction_type: 'TASK_UPDATE', entity_type: 'TASK', entity_id: 'AUTH_MODULE', content: 'Marked task as COMPLETED' },
  { id: 'log-2', user_id: 'mock-u2', interaction_type: 'PROJECT_REVIEW', entity_type: 'PROJECT', entity_id: 'SDC Portal v2', content: 'SRS document approved with minor revisions' },
  { id: 'log-3', user_id: 'mock-u3', interaction_type: 'COMMENT', entity_type: 'TASK', entity_id: 'ML_PIPELINE', content: 'Epoch 50 completed, accuracy at 89.2%' },
  { id: 'log-4', user_id: 'mock-u5', interaction_type: 'STATUS_CHANGE', entity_type: 'APPLICATION', entity_id: 'APP_2025_007', content: 'Changed status from PENDING to SHORTLISTED' },
  { id: 'log-5', user_id: 'mock-u1', interaction_type: 'FILE_UPLOAD', entity_type: 'PROJECT', entity_id: 'Cybersec Dashboard', content: 'Uploaded security audit report v3.pdf' },
];

const MOCK_USERS = [
  { id: 'mock-u1', name: 'Aryan Sharma' },
  { id: 'mock-u2', name: 'Priya Singh' },
  { id: 'mock-u3', name: 'Rahul Verma' },
  { id: 'mock-u5', name: 'Dev Kapoor' },
];

const TASK_STATUS_COLORS = {
  'TODO': 'bg-white/10 text-white/50 border-white/20',
  'IN_PROGRESS': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'REVIEW': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'COMPLETED': 'bg-sky-500/20 text-sky-400 border-sky-500/30'
};

export default function TelemetryView() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'audit'
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksData, logsData, usersData] = await Promise.all([
        tasksAPI.getAll().catch(() => []),
        interactionsAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => [])
      ]);
      setTasks(tasksData?.length ? tasksData : MOCK_TASKS);
      setLogs(logsData?.length ? logsData : MOCK_LOGS);
      setUsers(usersData?.length ? usersData : MOCK_USERS);
    } catch (e) {
      setTasks(MOCK_TASKS);
      setLogs(MOCK_LOGS);
      setUsers(MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId.substring(0, 8);
  };

  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <Activity className="w-4 h-4 text-indigo-400" />
             </div>
             <span className="text-indigo-400 text-sm font-bold tracking-[0.2em] uppercase">System Analytics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md">
            Telemetry & Audit
          </h1>
          <p className="text-white/40 mt-1 text-sm font-medium">
            Monitor system-wide task execution and oversee critical entity modifications.
          </p>
        </div>
        
        {/* Sub-Navigation Tabs */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all z-10 ${activeTab === 'tasks' ? 'text-white' : 'text-white/50 hover:text-white'}`}
          >
            {activeTab === 'tasks' && (
              <motion.div layoutId="telemetryTabActive" className="absolute inset-0 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-lg border border-indigo-500/30 -z-10" />
            )}
            <LayoutList className="w-4 h-4" /> Task Modules
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all z-10 ${activeTab === 'audit' ? 'text-white' : 'text-white/50 hover:text-white'}`}
          >
            {activeTab === 'audit' && (
              <motion.div layoutId="telemetryTabActive" className="absolute inset-0 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-lg border border-indigo-500/30 -z-10" />
            )}
            <History className="w-4 h-4" /> Audit Logs
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[#1c222b] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full"></div>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' ? (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest bg-black/20">
                  <div className="col-span-3">Module Identity</div>
                  <div className="col-span-4">Objective / Title</div>
                  <div className="col-span-2">Assigned TL</div>
                  <div className="col-span-3 text-right">Execution Status</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                      <Target className="w-16 h-16 mb-4 opacity-40 text-indigo-500" />
                      <p className="font-black tracking-widest uppercase text-lg">No Active Modules</p>
                      <p className="text-sm mt-1 opacity-50 font-medium">Task tracking is currently empty.</p>
                    </div>
                  ) : (
                    tasks.map((task, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ease: "easeOut" }}
                        key={task.id || i}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/5 hover:border-white/10 rounded-2xl relative overflow-hidden"
                      >
                         {/* Module ID */}
                         <div className="col-span-3">
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg">
                             <TerminalSquare className="w-3.5 h-3.5 text-indigo-400" />
                             <span className="text-xs font-bold text-white/80">{task.moduleName || 'SYS_MOD'}</span>
                           </div>
                         </div>
                         
                         {/* Title */}
                         <div className="col-span-4 pr-4">
                           <p className="text-sm font-bold text-white truncate" title={task.title}>{task.title}</p>
                           {task.project_id && <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 truncate">Project: {task.project_id}</p>}
                         </div>

                         {/* Assigned */}
                         <div className="col-span-2">
                           <span className="text-xs font-bold text-indigo-400/80 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 block w-max truncate max-w-[120px]">
                             {task.assignedTo || 'Unassigned'}
                           </span>
                         </div>
                         
                         {/* Status & Progress */}
                         <div className="col-span-3 flex items-center justify-end gap-4">
                           <div className="flex-1 flex flex-col gap-1.5 items-end hidden lg:flex">
                              <span className="text-[10px] font-black text-white/50">{task.progress || 0}% Complete</span>
                              <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${task.progress || 0}%` }}></div>
                              </div>
                           </div>
                           <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center gap-1.5 shrink-0 ${TASK_STATUS_COLORS[task.status] || TASK_STATUS_COLORS['TODO']}`}>
                             {task.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : 
                              task.status === 'IN_PROGRESS' ? <Zap className="w-3 h-3" /> : 
                              <Clock className="w-3 h-3" />}
                             {task.status || 'TODO'}
                           </span>
                         </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest bg-black/20">
                  <div className="col-span-3">System Identity</div>
                  <div className="col-span-2">Action Type</div>
                  <div className="col-span-3">Target Entity</div>
                  <div className="col-span-4 text-right">Context Payload</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                      <AlertCircle className="w-16 h-16 mb-4 opacity-40 text-indigo-500" />
                      <p className="font-black tracking-widest uppercase text-lg">No Audit Trails</p>
                      <p className="text-sm mt-1 opacity-50 font-medium">System event logs are currently empty.</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, ease: "easeOut" }}
                        key={log.id || i}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/5 hover:border-white/10 rounded-xl"
                      >
                         <div className="col-span-3 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                             {getUserName(log.user_id).charAt(0)}
                           </div>
                           <span className="text-sm font-bold text-white/80 truncate">{getUserName(log.user_id)}</span>
                         </div>
                         
                         <div className="col-span-2">
                           <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">
                             {log.interaction_type || 'SYSTEM_EVENT'}
                           </span>
                         </div>

                         <div className="col-span-3">
                           <div className="flex items-center gap-1.5">
                             <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{log.entity_type}</span>
                             <span className="text-white/20">/</span>
                             <span className="text-xs font-bold text-white/60 truncate" title={log.entity_id}>{log.entity_id}</span>
                           </div>
                         </div>
                         
                         <div className="col-span-4 text-right">
                           {log.content ? (
                             <p className="text-xs text-white/50 truncate font-mono bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-white/5" title={log.content}>
                               "{log.content}"
                             </p>
                           ) : (
                             <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">No Payload</span>
                           )}
                         </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
      `}} />
    </div>
  );
}

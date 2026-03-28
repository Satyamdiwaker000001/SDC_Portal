import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Users, Archive } from 'lucide-react';

interface OverviewProps { activeCount: number; archiveCount: number; }

export const GlobalOverview = ({ activeCount, archiveCount }: OverviewProps) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
    <div className="flex justify-between items-end border-b-2 border-cyan-500/10 pb-8">
      <div>
        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none">Status_Monitor</h2>
        <div className="flex items-center gap-2 mt-3 text-cyan-500/40 uppercase font-black text-[9px] tracking-[0.4em]">
          <Activity size={12} className="animate-pulse" /> Live_Telemetry_Linked
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { label: 'Active_Operatives', val: `0${activeCount}`, icon: <Users size={24}/>, color: 'text-cyan-400' },
        { label: 'Node_Integrity', val: '99%', icon: <ShieldCheck size={24}/>, color: 'text-emerald-500' },
        { label: 'Retired_Archive', val: `0${archiveCount}`, icon: <Archive size={24}/>, color: 'text-slate-500' }
      ].map((stat, i) => (
        <div key={i} className="p-10 bg-slate-900/40 border-t-4 border-cyan-500/20 -skew-x-12 group hover:bg-cyan-500/5 transition-all">
          <div className="skew-x-12 flex justify-between items-center">
            <div>
              <div className={`text-5xl font-black italic ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] uppercase font-black text-slate-500 mt-2 tracking-widest flex items-center gap-2">
                <Zap size={10} className="text-cyan-500/30" /> {stat.label}
              </div>
            </div>
            <div className="text-slate-800 group-hover:text-cyan-400 transition-colors">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);
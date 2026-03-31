/* cspell:disable */
import React from 'react';
import { Zap } from 'lucide-react'; // ShieldCheck removed as it was unused

interface DevCardProps {
  user: {
    name: string;
    role: string;
    id: string;
    integrity: number;
    powerLevel: number;
    stack: string[];
    image?: string;
  };
}

export const DevCard: React.FC<DevCardProps> = ({ user }) => {
  return (
    <div className="w-full max-w-2xl bg-[#0a0a0a] border border-zinc-800 relative overflow-hidden group shadow-2xl">
      {/* Top Verification Bar */}
      <div className="bg-[#ff6600] px-4 py-1 flex justify-between items-center">
        <span className="text-[10px] font-black text-black tracking-[0.3em] uppercase">
          Personnel_Identity_Verified
        </span>
        <div className="w-3 h-3 border-2 border-black/20 rounded-sm flex items-center justify-center">
          <div className="w-1 h-1 bg-black/40 rounded-full" />
        </div>
      </div>

      <div className="p-8 flex flex-col md:flex-row gap-8">
        {/* Left Section: Photo & ID */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-56 border-2 border-[#ff6600]/30 relative p-1 bg-zinc-900/50">
            {/* Scanner Line Animation */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-[#ff6600] shadow-[0_0_15px_#ff6600] animate-scan z-10" />
            
            <div className="w-full h-full border border-zinc-800 flex items-center justify-center overflow-hidden bg-black">
              {user.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="flex flex-col items-center opacity-20">
                  <div className="w-16 h-16 border-2 border-zinc-500 rounded-full mb-2" />
                  <div className="w-20 h-12 border-2 border-zinc-500 rounded-t-full" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-[#ff6600]/10 border border-[#ff6600]/30 px-4 py-1">
             <span className="text-[10px] font-mono font-black text-[#ff6600]">ID: {user.id}</span>
          </div>
        </div>

        {/* Right Section: Intel & Stats */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter leading-none">
              {user.name.replace(/\s+/g, '_')}
            </h2>
            {/* FIXED: Changed closing tag from </h2> to </p> */}
            <p className="text-[#ff6600] text-[10px] font-black tracking-[0.4em] uppercase mt-2">
              {user.role}
            </p>
          </div>

          <div className="h-px bg-zinc-800 w-full" />

          {/* Progress Bars */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-500">
                <span>Integrity</span>
                <span className="text-[#ff6600]">{user.integrity}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
                <div 
                  className="h-full bg-[#ff6600] shadow-[0_0_10px_#ff6600] transition-all duration-1000" 
                  style={{ width: `${user.integrity}%` }} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-500">
                <span>Power_Level</span>
                <span className="text-[#ff6600]">{user.powerLevel}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
                <div 
                  className="h-full bg-[#ff6600] shadow-[0_0_10px_#ff6600] transition-all duration-1000" 
                  style={{ width: `${Math.min((user.powerLevel / 2000) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="pt-2">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3">Authorized_Stack</p>
            <div className="flex flex-wrap gap-2">
              {user.stack.map((tech) => (
                <div key={tech} className="border border-zinc-800 bg-zinc-900/50 px-3 py-1 rounded-sm">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Icon */}
      <div className="absolute bottom-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
        <Zap size={24} className="text-[#ff6600]" />
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
import { Users, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ProfileFrame } from '../shared/ProfileFrame';
import type { Team, Member } from '../../types';

interface TeamWithMembers extends Team {
  membersList: Member[];
  leader: Member | undefined;
}

export const TeamsView = ({ onJump }: { onJump: (id: string) => void }) => {
  const { teams, members } = useStore();

  const teamsExtended: TeamWithMembers[] = teams.map(team => ({
    ...team,
    membersList: members.filter(m => team.memberIds.includes(m.id)),
    leader: members.find(m => m.id === team.leaderId)
  }));

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-2 border-cyan-500/20 pb-8">
        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter">Squad_Database</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamsExtended.map((team) => (
          <div key={team.id} className="group bg-slate-900 border-t-2 border-white/5 -skew-x-12 p-8 hover:border-cyan-500/50 transition-all cursor-none">
            <div className="skew-x-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{team.name}</h3>
                  <div className="text-[8px] text-cyan-500 font-bold uppercase mt-1 tracking-[0.3em]">Sector_Assigned</div>
                </div>
                <div className="p-3 bg-white/5 -skew-x-12">
                  <Users size={24} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                {team.leader && (
                  <div onClick={() => onJump(team.leader!.id)} className="p-4 bg-cyan-500/5 border-l-2 border-cyan-500 flex items-center justify-between group/lead hover:bg-cyan-500/10 transition-all">
                    <div className="flex items-center gap-4">
                      <ProfileFrame imageUrl={team.leader.image} size="sm" status={team.leader.status} />
                      <div className="text-xs font-black text-white uppercase italic">{team.leader.name}</div>
                    </div>
                    <Shield size={14} className="text-cyan-400" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {team.membersList.filter(m => m.id !== team.leaderId).map(m => (
                    <ProfileFrame key={m.id} imageUrl={m.image} size="sm" status={m.status} onClick={() => onJump(m.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
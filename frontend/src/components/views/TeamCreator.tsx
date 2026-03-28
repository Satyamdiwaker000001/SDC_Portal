import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { useStore } from '../../store/useStore';

type UploadMode = 'MANUAL' | 'BULK';

interface BulkTeamData {
  name: string;
  leaderName: string;
  memberNames: string;
  projectNames?: string;
}

export const TeamCreator = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<UploadMode>('MANUAL');
  const [teamName, setTeamName] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [bulkTeams, setBulkTeams] = useState<BulkTeamData[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'validating' | 'success'>('idle');
  const { createTeam, createTeamBulk, members } = useStore();

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName && leaderId && selectedMembers.length > 0) {
      createTeam({
        name: teamName,
        leaderId,
        memberIds: selectedMembers,
      });
      onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('parsing');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setUploadStatus('validating');
        validateAndProcessBulkData(results.data as unknown[]);
      },
      error: (error) => {
        setBulkErrors([`File parsing error: ${error.message}`]);
        setUploadStatus('idle');
      }
    });
  };

  const validateAndProcessBulkData = (data: unknown[]) => {
    const errors: string[] = [];
    const validTeams: BulkTeamData[] = [];

    data.forEach((row: any, index: number) => {
      const rowNum = index + 2;
      
      if (!row.name || !row.name.trim()) {
        errors.push(`Row ${rowNum}: Team name is required`);
        return;
      }

      if (!row.leaderName || !row.leaderName.trim()) {
        errors.push(`Row ${rowNum}: Leader name is required`);
        return;
      }

      if (!row.memberNames || !row.memberNames.trim()) {
        errors.push(`Row ${rowNum}: Member names are required (comma-separated)`);
        return;
      }

      const leaderExists = members.find(m => 
        m.name.toLowerCase() === row.leaderName.trim().toLowerCase()
      );
      if (!leaderExists) {
        errors.push(`Row ${rowNum}: Leader "${row.leaderName}" not found in member registry`);
        return;
      }

      const memberNames = row.memberNames.split(',').map((name: string) => name.trim());
      const invalidMembers = memberNames.filter((name: string) => 
        !members.find(m => m.name.toLowerCase() === name.toLowerCase())
      );
      if (invalidMembers.length > 0) {
        errors.push(`Row ${rowNum}: Invalid members: ${invalidMembers.join(', ')}`);
        return;
      }

      validTeams.push({
        name: row.name.trim(),
        leaderName: row.leaderName.trim(),
        memberNames: row.memberNames,
        projectNames: row.projectNames?.trim() || ''
      });
    });

    setBulkTeams(validTeams);
    setBulkErrors(errors);
    setUploadStatus(errors.length === 0 ? 'success' : 'idle');
  };

  const handleBulkSubmit = () => {
    if (bulkTeams.length === 0) return;

    createTeamBulk(bulkTeams);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-4xl bg-slate-950/95 border-2 border-cyan-500/30 backdrop-blur-3xl rounded-none shadow-[0_0_100px_rgba(0,0,0,1)]"
    >
      <div className="flex justify-between items-center px-8 py-6 border-b-2 border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-500 text-black -skew-x-12 shadow-[0_0_20px_rgba(34,211,238,0.6)]">
            <Plus size={20} className="skew-x-12" />
          </div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tight">Create Team</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex p-4 border-b border-cyan-500/20">
        <div className="flex bg-slate-900/50 border border-white/10 p-1 rounded-none">
          {(['MANUAL', 'BULK'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setBulkErrors([]);
                setBulkTeams([]);
              }}
              className={`px-6 py-2 text-[9px] font-black tracking-widest transition-all ${
                mode === m 
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.4)]' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {m === 'MANUAL' ? 'MANUAL_CREATE' : 'BULK_UPLOAD'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {mode === 'MANUAL' ? (
            <form key="manual" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-white/10 rounded-none text-white font-bold uppercase tracking-wide focus:border-cyan-500 focus:outline-none -skew-x-12"
                  placeholder="e.g. Gamma Force"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Team Leader</label>
                <div className="relative">
                  <select
                    value={leaderId}
                    onChange={(e) => setLeaderId(e.target.value)}
                    className="w-full p-4 bg-slate-900 border border-white/10 rounded-none text-white font-bold uppercase tracking-wide focus:border-cyan-500 focus:outline-none appearance-none -skew-x-12"
                    required
                  >
                    <option value="">Select Leader</option>
                    {members.filter(m => m.status === 'ONLINE').map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.spec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Team Members</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMembers(!showMembers)}
                    className="w-full p-4 bg-slate-900 border border-white/10 rounded-none text-left text-white font-bold uppercase -skew-x-12 flex items-center justify-between"
                  >
                    {selectedMembers.length > 0 
                      ? `${selectedMembers.length} members selected` 
                      : 'Select members'
                    }
                    <ChevronDown className={`transition-transform ${showMembers ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  <AnimatePresence>
                    {showMembers && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute z-10 w-full mt-1 bg-slate-900 border-x border-b border-white/10 max-h-60 overflow-y-auto rounded-b"
                      >
                        {members.filter(m => m.id !== leaderId).map(member => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleMember(member.id)}
                            className={`w-full p-3 text-left border-b border-white/5 last:border-b-0 hover:bg-slate-800 flex items-center gap-3 text-sm font-bold uppercase ${
                              selectedMembers.includes(member.id) ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${selectedMembers.includes(member.id) ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                            {member.name} - {member.spec}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!teamName || !leaderId || selectedMembers.length === 0}
                className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-500 text-black font-black uppercase tracking-widest text-lg -skew-x-12 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="skew-x-12 block">Deploy Team</span>
              </button>
            </form>
          ) : (
            <motion.div key="bulk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">
                    <FileSpreadsheet size={16} /> Upload_Spreadsheet
                  </label>
                  <p className="text-[10px] text-slate-400">Required columns: name, leaderName, memberNames, (optional) projectNames</p>
                </div>
                <a
                  href="/team-template.csv"
                  download="team-template.csv"
                  className="px-4 py-2 text-[8px] font-black text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/10 transition-colors uppercase tracking-widest whitespace-nowrap ml-4"
                >
                  ⬇ Download_Template
                </a>
              </div>
              
              <div className="relative border-2 border-dashed border-cyan-500/30 p-8 text-center hover:border-cyan-500/60 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <FileSpreadsheet size={32} className="text-cyan-500/40" />
                  <div>
                    <p className="text-white font-bold uppercase">Drop CSV or Excel file here</p>
                    <p className="text-slate-400 text-[12px] mt-1">Or click to browse</p>
                  </div>
                </div>
              </div>

              {uploadStatus === 'parsing' && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-sm font-bold uppercase animate-pulse">
                  Parsing spreadsheet...
                </div>
              )}

              {uploadStatus === 'validating' && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-sm font-bold uppercase animate-pulse">
                  Validating data...
                </div>
              )}

              {bulkErrors.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded space-y-2"
                >
                  <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-sm">
                    <AlertCircle size={16} /> Validation_Errors
                  </div>
                  <div className="space-y-1">
                    {bulkErrors.map((error, idx) => (
                      <p key={idx} className="text-red-300 text-[12px]">{error}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {bulkTeams.length > 0 && uploadStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm mb-3">
                      <CheckCircle2 size={16} /> Preview ({bulkTeams.length} teams)
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {bulkTeams.map((team, idx) => (
                        <div key={idx} className="p-3 bg-slate-900/50 border border-emerald-500/20 rounded text-[12px]">
                          <div className="font-bold text-white mb-1">{team.name}</div>
                          <div className="text-emerald-400">👤 Leader: {team.leaderName}</div>
                          <div className="text-slate-300">👥 Members: {team.memberNames}</div>
                          {team.projectNames && (
                            <div className="text-cyan-400">📊 Projects: {team.projectNames}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleBulkSubmit}
                    className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-500 text-black font-black uppercase tracking-widest text-lg -skew-x-12 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all"
                  >
                    <span className="skew-x-12 block">Deploy All Teams</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

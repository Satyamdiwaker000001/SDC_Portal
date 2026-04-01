/* cspell:disable */
import { useState } from "react";
import { Send, CheckCircle, Phone, User, Mail, GitBranch, ShieldCheck, ChevronDown } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function RecruitmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    contact: "", 
    class: "", 
    interested: "Highly_Interested"
  });

  const options = [
    { value: "Highly_Interested", label: "Status: Highly_Interested" },
    { value: "Seeking_Intel", label: "Status: Seeking_Intel" },
    { value: "Neutral", label: "Status: Neutral" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020203] p-6 selection:bg-sky-500/30 relative overflow-x-hidden font-sans">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)`, 
             backgroundSize: '45px 45px' 
           }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-16 text-center border border-emerald-500/20 bg-black rounded-sm shadow-[0_0_50px_-12px_#10b98133]"
            >
               <CheckCircle className="mx-auto text-emerald-500 mb-6 animate-pulse" size={50} />
               <h3 className="text-white font-black uppercase tracking-[0.3em] text-xl italic leading-tight">Uplink_Complete</h3>
               <p className="text-zinc-600 text-[10px] mt-4 font-mono uppercase tracking-widest">Dossier Transmitted to SDC_Core.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-black border border-white/5 p-8 md:p-12 rounded-sm relative shadow-[0_0_80px_-20px_#0ea5e922]">
                
                {/* Visual Blue Left Marker */}
                <div className="absolute left-0 top-12 h-16 w-0.5 bg-sky-500 shadow-[0_0_15px_#0ea5e9]" />

                {/* --- HEADER --- */}
                <div className="mb-10">
                    <p className="text-sky-500 text-[9px] font-black uppercase tracking-[0.5em] mb-2 opacity-80">Initialize_Join_Protocol</p>
                    <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none text-white flex flex-wrap gap-x-4">
                        <span className="text-white">SDC</span> 
                        <span className="text-sky-500 drop-shadow-[0_0_20px_#0ea5e999]">JOIN_PROTOCOL</span>
                    </h2>
                </div>

                {/* --- INPUTS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <User size={12} className="text-sky-500" /> Full_Identity
                        </label>
                        <input required placeholder="SATYAM_DIWAKER" className="w-full bg-[#050505] border border-white/5 p-4 text-[11px] text-zinc-300 outline-none focus:border-sky-500 transition-all font-mono placeholder:text-zinc-800" 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Mail size={12} className="text-sky-500" /> Secure_Email
                        </label>
                        <input required type="email" placeholder="CORE@SDC.COM" className="w-full bg-[#050505] border border-white/5 p-4 text-[11px] text-zinc-300 outline-none focus:border-sky-500 transition-all font-mono placeholder:text-zinc-800" 
                        onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <Phone size={12} className="text-sky-500" /> Contact_Node <span className="text-zinc-700 text-[7px] italic tracking-widest">(WhatsApp Recom.)</span>
                        </label>
                        <input required placeholder="+91_XXXXXXXXXX" className="w-full bg-[#050505] border border-white/5 p-4 text-[11px] text-zinc-300 outline-none focus:border-sky-500 transition-all font-mono placeholder:text-zinc-800" 
                        onChange={e => setFormData({...formData, contact: e.target.value})} />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <GitBranch size={12} className="text-sky-500" /> Classification
                        </label>
                        <input required placeholder="B.TECH_2ND_YEAR" className="w-full bg-[#050505] border border-white/5 p-4 text-[11px] text-zinc-300 outline-none focus:border-sky-500 transition-all font-mono placeholder:text-zinc-800" 
                        onChange={e => setFormData({...formData, class: e.target.value})} />
                    </div>

                    {/* --- CUSTOM DROPDOWN (Fixed Overlap) --- */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                           <ShieldCheck size={12} className="text-sky-500" /> Intent_Confirmation
                        </label>
                        
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full bg-[#050505] border border-white/5 p-4 text-[11px] text-white flex justify-between items-center font-black uppercase transition-all hover:bg-sky-500/5 focus:border-sky-500"
                          >
                            <span>Status: {formData.interested}</span>
                            <ChevronDown size={14} className={`text-sky-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border-x border-b border-white/10 bg-black mt-1"
                              >
                                {options.map((opt) => (
                                  <div 
                                    key={opt.value}
                                    onClick={() => {
                                      setFormData({...formData, interested: opt.value});
                                      setIsOpen(false);
                                    }}
                                    className="p-4 text-[11px] font-black uppercase text-zinc-500 hover:bg-sky-500 hover:text-black cursor-pointer transition-all border-t border-white/5"
                                  >
                                    {opt.label}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <button 
                  type="submit" 
                  className="w-full mt-10 py-5 bg-sky-500 hover:shadow-[0_0_40px_#0ea5e988] text-black font-black text-[11px] uppercase flex items-center justify-center gap-4 transition-all duration-300 [clip-path:polygon(0_0,97%_0,100%_35%,100%_100%,3%_100%,0_65%)] group"
                >
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /> 
                    Transmit_Application_Dossier
                </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
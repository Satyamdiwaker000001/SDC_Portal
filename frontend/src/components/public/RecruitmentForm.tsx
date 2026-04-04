import { useState } from "react";
import { Send, CheckCircle, Phone, User, Mail, GitBranch, ShieldCheck, ChevronDown } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { soundManager } from "../../utils/SoundManager";
import { HackyText } from "../../components/shared/HackyText";

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
    soundManager.playConfirm();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6 selection:bg-sky-200 relative overflow-x-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
      </div>

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
              className="p-20 text-center kpr-card border-2 border-emerald-200 bg-white shadow-2xl relative"
              style={{ borderRadius: '0 4rem 4rem 0' }}
            >
               <div className="kpr-marker left-4 top-4 opacity-20" />
               <CheckCircle className="mx-auto text-emerald-500 mb-8 animate-pulse" size={64} />
               <h3 className="text-carbon-black-DEFAULT font-black uppercase tracking-tight text-3xl italic leading-tight">Uplink_Complete</h3>
               <p className="kpr-mono text-slate-grey-400 text-[10px] mt-6 uppercase tracking-widest">Dossier Transmitted to SDC_Core Registry.</p>
               <div className="mt-12 kpr-mono text-[8px] opacity-10">TS // {new Date().toISOString()}</div>
            </motion.div>
          ) : (
            <div className="kpr-card border-2 border-slate-grey-200 p-10 md:p-16 rounded-xl bg-white/90 backdrop-blur-md relative shadow-2xl overflow-hidden"
                 style={{ borderRadius: '0 4rem 4rem 0' }}>
                
                <div className="kpr-marker left-4 top-4 opacity-20" />
                <div className="kpr-marker right-4 bottom-4 opacity-20" />

                {/* --- HEADER --- */}
                <div className="mb-14">
                    <p className="kpr-mono text-sky-500 text-[9px] mb-4 opacity-80">Initialize_Join_Protocol</p>
                    <HackyText 
                      text="JOIN_PROTOCOL" 
                      className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-carbon-black-DEFAULT" 
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* --- INPUTS --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                      <div className="space-y-3 group">
                          <label className="kpr-mono text-[10px] opacity-40 ml-1 flex items-center gap-2">
                             <User size={12} className="text-sky-500" /> Full_Identity
                          </label>
                          <input required placeholder="OPERATIVE_NAME" className="w-full bg-slate-grey-50 border-2 border-slate-grey-100 p-5 text-[12px] text-carbon-black-DEFAULT outline-none focus:border-sky-500 focus:bg-white transition-all font-bold rounded-xl placeholder:text-slate-grey-200" 
                          onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>

                      <div className="space-y-3 group">
                          <label className="kpr-mono text-[10px] opacity-40 ml-1 flex items-center gap-2">
                             <Mail size={12} className="text-sky-500" /> Secure_Email
                          </label>
                          <input required type="email" placeholder="CORE@SDC_SYSTEM" className="w-full bg-slate-grey-50 border-2 border-slate-grey-100 p-5 text-[12px] text-carbon-black-DEFAULT outline-none focus:border-sky-500 focus:bg-white transition-all font-bold rounded-xl placeholder:text-slate-grey-200" 
                          onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>

                      <div className="space-y-3 group">
                          <label className="kpr-mono text-[10px] opacity-40 ml-1 flex items-center gap-2">
                             <Phone size={12} className="text-sky-500" /> Contact_Node
                          </label>
                          <input required placeholder="+91_SIGNAL_ID" className="w-full bg-slate-grey-50 border-2 border-slate-grey-100 p-5 text-[12px] text-carbon-black-DEFAULT outline-none focus:border-sky-500 focus:bg-white transition-all font-bold rounded-xl placeholder:text-slate-grey-200" 
                          onChange={e => setFormData({...formData, contact: e.target.value})} />
                      </div>

                      <div className="space-y-3 group">
                          <label className="kpr-mono text-[10px] opacity-40 ml-1 flex items-center gap-2">
                             <GitBranch size={12} className="text-sky-500" /> Classification
                          </label>
                          <input required placeholder="ENG_CLASS_202X" className="w-full bg-slate-grey-50 border-2 border-slate-grey-100 p-5 text-[12px] text-carbon-black-DEFAULT outline-none focus:border-sky-500 focus:bg-white transition-all font-bold rounded-xl placeholder:text-slate-grey-200" 
                          onChange={e => setFormData({...formData, class: e.target.value})} />
                      </div>

                      {/* --- CUSTOM DROPDOWN --- */}
                      <div className="md:col-span-2 space-y-3">
                          <label className="kpr-mono text-[10px] opacity-40 ml-1 flex items-center gap-2">
                             <ShieldCheck size={12} className="text-sky-500" /> Intent_Confirmation
                          </label>
                          
                          <div className="relative">
                            <button 
                              type="button"
                              onMouseEnter={() => soundManager.playHover()}
                              onClick={() => { soundManager.playClick(); setIsOpen(!isOpen); }}
                              className="w-full bg-slate-grey-50 border-2 border-slate-grey-100 p-5 text-[12px] text-carbon-black-DEFAULT flex justify-between items-center font-bold uppercase transition-all hover:bg-white focus:border-sky-500 rounded-xl"
                            >
                              <span>Status: {formData.interested}</span>
                              <ChevronDown size={16} className={`text-sky-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute left-0 right-0 z-50 bg-white border-2 border-slate-grey-200 mt-2 rounded-xl shadow-2xl overflow-hidden"
                                >
                                  {options.map((opt) => (
                                    <div 
                                      key={opt.value}
                                      onClick={() => {
                                        soundManager.playClick();
                                        setFormData({...formData, interested: opt.value});
                                        setIsOpen(false);
                                      }}
                                      className="p-5 text-[11px] kpr-mono text-slate-grey-500 hover:bg-sky-500 hover:text-white cursor-pointer transition-all border-b border-slate-grey-50 last:border-b-0"
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
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full mt-10 p-6 bg-carbon-black-DEFAULT text-white kpr-mono kpr-btn hover:bg-sky-500 transition-all flex items-center justify-center gap-4 relative shadow-xl font-black uppercase text-xs tracking-widest"
                  >
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /> 
                      Transmit_Application_Dossier
                  </button>
                </form>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-12 right-12 z-0 hidden lg:block opacity-20">
         <div className="kpr-mono text-[8px] space-y-1 text-right">
            <p>LAT: 27.1767° N</p>
            <p>LNG: 78.0081° E</p>
            <p>FREQ: 433.92 MHZ</p>
         </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Command, Terminal, User } from 'lucide-react';
import Barcode from 'react-barcode';
import sdcLogo from '../assets/sdc_logo.png';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Terminal typing effect
  const fullText = "initiating secure handshake...\nauthenticating cblueentials...\naccess granted.";
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // (Removed Card slide-out z-index toggle)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Valid cblueentials! Flip the card.
      setIsFlipped(true);
      // Wait for 3 seconds before navigating to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError('Invalid cblueentials or server error.');
      setIsLoading(false); // Only stop loading if error so flip stays smooth
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden font-sans text-white">
      
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
        {/* Elegant Dot Grid */}
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
               backgroundSize: '24px 24px',
               maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)',
               WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 100%)'
             }} 
        />
        
        {/* Extremely Soft Orbs for Depth */}
        <motion.div 
          animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#00b4d8]/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 translate-x-1/4 translate-y-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0066ff]/10 blur-[150px] rounded-full" 
        />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative">
        
        {/* Left Side: Branding / Abstract */}
        <motion.div 
          initial={{ opacity: 0, x: -50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.3 }}
          className="hidden md:flex flex-col items-start w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-all text-xs font-semibold tracking-wide mb-12 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4 transition-transform" /> Back to Portal
          </Link>
          <img src={sdcLogo} alt="SDC Logo" className="w-32 h-auto mb-8 opacity-90" />
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight mb-5 text-white">
            System<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Access.</span>
          </h1>
          <p className="text-white/60 text-[15px] font-normal leading-relaxed max-w-sm">
            Authenticate to access the core infrastructure, manage projects, and oversee system operations securely.
          </p>

          {/* Clean Corporate Terminal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 p-5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-sm w-full backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            <div className="flex justify-between items-center mb-5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest mr-2">auth-service</span>
            </div>
            <div className="text-blue-300/80 mb-2 text-[11px] uppercase tracking-widest flex items-center gap-2">
              <span className="text-white/30">➜</span> user@sdc-core ~ %
            </div>
            <div className="text-white/70 whitespace-pre-line min-h-[4rem] text-[13px] leading-relaxed pl-2">
              {terminalText}
              <span className="animate-pulse inline-block w-1.5 h-3.5 bg-white/50 ml-1 align-middle" />
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Majestic Animated Glass Login Card */}
        <div 
          className="relative w-full max-w-[420px] h-[550px] sm:h-[600px] mt-12 md:mt-0 p-2 md:p-4 mx-auto flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          
          {/* Mobile Back Link */}
          <Link to="/" className="md:hidden absolute -top-8 left-0 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase group z-50">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>

          {/* Majestic Animated Background Orbs */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-gradient-to-br from-[#00e5ff]/20 to-[#00b4d8]/0 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-gradient-to-tr from-[#0066ff]/20 to-[#00b4d8]/0 rounded-full blur-3xl"
            />
          </div>

          {/* The Premium Glass Card Container (3D Wrapper) */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotateX: 0,
              rotateY: isFlipped ? 180 : 0
            }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1] // Custom spring-like easing
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full z-20 group"
          >
            {/* FRONT FACE (Login Form) */}
            <div 
              style={{ backfaceVisibility: "hidden" }}
              className="relative w-full bg-[#020617]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
            >
            {/* Subtle internal shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

            {/* Static wrapper for content */}
            <div className="relative z-10">
              {/* Top decorative elements */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-50" />
              <div className="flex justify-center mb-8">
                <div className="w-12 h-1.5 rounded-full bg-white/10" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-2 drop-shadow-sm">Welcome Back</h2>
                <p className="text-white/40 text-xs sm:text-sm font-medium tracking-wide">Enter your details to access the portal.</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, mb: 0 }} animate={{ opacity: 1, height: 'auto', mb: 20 }} exit={{ opacity: 0, height: 0, mb: 0 }}
                    className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 overflow-hidden"
                  >
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                    <p className="text-blue-400 text-xs font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.15em] ml-1">Email Address</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-white/30 group-focus-within/input:text-[#00e5ff] transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300"
                      placeholder="developer@sdc.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.15em]">Password</label>
                    <a href="#" className="text-[10px] font-semibold text-[#00b4d8] hover:text-[#00e5ff] transition-colors">Forgot?</a>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-white/30 group-focus-within/input:text-[#00e5ff] transition-colors duration-300" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full mt-8 overflow-hidden bg-gradient-to-r from-[#00b4d8] to-[#0066ff] text-white font-bold text-sm uppercase tracking-[0.2em] py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,180,216,0.5)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed group/btn"
                >
                  <span className="relative z-10 drop-shadow-md">
                    {isLoading ? 'Authenticating...' : 'VERIFY'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              </form>
              
              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-[10px] font-medium text-white/30 tracking-wider uppercase">
                  Secure portal for SDC Core Members. <br />
                  Unauthorized access is strictly prohibited.
                </p>
              </div>
            </div>
            </div> {/* END FRONT FACE */}

            {/* BACK FACE (ID Card) */}
            <div 
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 w-full h-full bg-[#0a101f] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col items-center justify-between py-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            >
               {/* Curved Header Background */}
               <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-br from-[#00b4d8]/20 to-[#0066ff]/10 rounded-b-[50%] border-b border-[#00e5ff]/20 shadow-[0_10px_30px_rgba(0,180,216,0.1)]" />
               <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

               {/* Top left mini logo/text */}
               <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                 <div className="w-4 h-4 bg-[#00e5ff] rotate-45 rounded-sm" />
                 <span className="text-white font-bold text-[10px] tracking-widest uppercase">SDC Core</span>
               </div>

               {/* TOP SECTION: Photo, Name, Role */}
               <div className="flex flex-col items-center z-10 w-full mt-2">
                 {/* Profile Photo */}
                 <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#0a101f] p-1 mb-8 shadow-[0_15px_25px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#00e5ff] to-[#0066ff]">
                   <div className="w-full h-full rounded-full overflow-hidden bg-[#020617] relative flex items-center justify-center">
                     {user?.role === 'admin' ? (
                       <span className="text-4xl font-black text-white/80">AD</span>
                     ) : user?.profile_image_url ? (
                        <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover grayscale contrast-125" />
                     ) : (
                        <span className="text-4xl font-black text-white/80">{user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : <User className="w-12 h-12 text-white/50" />}</span>
                     )}
                   </div>
                 </div>

                 {/* Name & Role */}
                 <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 uppercase tracking-widest mb-1 drop-shadow-md text-center px-4 leading-tight">
                   {user?.role === 'admin' ? 'Admin' : (user?.full_name || user?.email?.split('@')[0] || 'Authorized')}
                 </h3>
                 <p className="text-[#00e5ff] text-[11px] font-bold uppercase tracking-[0.25em] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                   {user?.role || 'Developer'}
                 </p>
               </div>

               {/* MIDDLE SECTION: Details Flex Column List */}
               <div className="z-10 w-[80%] flex flex-col gap-3 mt-4 mb-2 bg-black/20 p-4 rounded-xl border border-white/5">
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Emp ID</span>
                   <span className="text-white text-[11px] font-black uppercase tracking-wider">{user?.id?.toString().padStart(6, '0') || 'SDC-001'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Department</span>
                   <span className="text-white text-[11px] font-black uppercase tracking-wider">Engineering</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Status</span>
                   <span className="text-[#00e5ff] text-[11px] font-black uppercase tracking-wider drop-shadow-[0_0_5px_rgba(0,229,255,0.6)] animate-pulse">GRANTED</span>
                 </div>
               </div>

               {/* BOTTOM SECTION: Barcode & Loader */}
               <div className="z-10 w-full flex flex-col items-center mt-auto pt-2">
                 {/* Real Barcode representation */}
                 <div className="flex justify-center w-[75%] mb-4 opacity-70 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                   <Barcode 
                     value={`01${user?.id?.toString().padStart(10, '0') || '0000000000'}`} 
                     width={1.2} 
                     height={40} 
                     displayValue={true} 
                     fontSize={9}
                     font="monospace"
                     margin={0} 
                     background="transparent" 
                     lineColor="#ffffff" 
                   />
                 </div>

                 {/* Custom Loader */}
                 <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                   <div className="w-3 h-3 rounded-full border-2 border-[#00e5ff]/30 border-t-[#00e5ff] animate-spin" />
                   <span className="text-white/50 text-[9px] font-mono uppercase tracking-[0.15em] animate-pulse">Initializing...</span>
                 </div>
               </div>

            </div> {/* END BACK FACE */}
          </motion.div>

        </div>

      </div>
    </div>
  );
}

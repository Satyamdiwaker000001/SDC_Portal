/* cspell:disable */
import { useState, useEffect } from "react";
import { ChevronRight, Target, Info, ShieldCheck, Zap } from "lucide-react";
import logo from "../../assets/SDC.png"; 
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRecruitmentLive, setIsRecruitmentLive] = useState(false);

  // --- LOGIC: Track Scroll & Recruitment Status ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkRecruitmentStatus = () => {
      const status = localStorage.getItem("SDC_RECRUITMENT_STATUS");
      setIsRecruitmentLive(status === "LIVE");
    };

    // Initial checks
    handleScroll();
    checkRecruitmentStatus();

    // Event Listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkRecruitmentStatus); // Sync across tabs
    
    // Interval check as a fallback for same-tab updates
    const interval = setInterval(checkRecruitmentStatus, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkRecruitmentStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] px-10 flex items-center transition-all duration-500 ease-in-out ${
        isScrolled 
          ? "h-20 bg-[#020203]/90 backdrop-blur-xl border-b border-sky-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
          : "h-28 bg-transparent"
      }`}
    >
      
      {/* --- LEFT SIDE: SDC Logo --- */}
      <div className="flex-none">
        <Link to="/" className="block">
          <img 
            src={logo} 
            alt="SDC Logo" 
            className={`object-contain transition-all duration-500 brightness-125 hover:scale-105 ${
              isScrolled ? "w-24 drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]" : "w-32 drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]"
            }`} 
          />
        </Link>
      </div>

      {/* --- CENTER: Nav Links --- */}
      <div className="flex-1 hidden md:flex items-center justify-center gap-10">
        {[
          { label: "Projects", path: "/projects", icon: Target },
          { label: "About_Us", path: "/about", icon: Info }
        ].map((link) => (
          <Link 
            key={link.label}
            to={link.path} 
            className={`group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300 ${
              isScrolled ? "text-zinc-300 hover:text-sky-400" : "text-zinc-500 hover:text-white"
            }`}
          >
            <link.icon size={14} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
            <span className="relative">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-sky-500 transition-all duration-500 group-hover:w-full" />
            </span>
          </Link>
        ))}

        {/* DYNAMIC RECRUITMENT BUTTON: Only shows when Admin toggles GO_LIVE */}
        {isRecruitmentLive && (
          <Link 
            to="/apply" 
            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 hover:text-white transition-all duration-300 animate-pulse hover:animate-none"
          >
            <Zap size={14} className="fill-emerald-500/20" />
            <span className="relative">
              Join_SDC
              <span className="absolute -bottom-1 left-0 w-full h-px bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            </span>
          </Link>
        )}
      </div>
      
      {/* --- RIGHT SIDE: Tactical Button --- */}
      <div className="flex-none flex items-center gap-6">
        <div className={`hidden lg:flex flex-col items-end mr-4 transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-40"}`}>
          <span className="text-[8px] font-black text-sky-500/50 uppercase tracking-widest italic">UPLINK_STATUS</span>
          <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
            <ShieldCheck size={10} className="animate-pulse" /> SECURE_NODE
          </span>
        </div>

        <button 
          onClick={handleLoginRedirect}
          className={`group px-10 py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 active:scale-95 ${
            isScrolled 
              ? "bg-sky-500 text-black hover:bg-white shadow-[0_0_20px_rgba(14,165,233,0.2)]" 
              : "bg-zinc-100 text-black hover:bg-sky-500"
          }`}
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 30%, 100% 100%, 8% 100%, 0 70%)' }}
        >
          <span className="relative flex items-center justify-center gap-2 italic">
              INITIALIZE_BOOT <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </nav>
  );
}
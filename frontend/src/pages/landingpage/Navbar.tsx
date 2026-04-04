import { useState, useEffect } from "react";
import logo from "../../assets/SDC.png"; 
import { useNavigate, Link } from "react-router-dom";
import { HackyText } from "../../components/shared/HackyText";
import { soundManager } from "../../utils/SoundManager";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[1000] px-6 lg:px-12 flex items-center justify-between transition-all duration-500 ease-in-out border-b ${
        isScrolled 
          ? "h-20 bg-black text-white border-white/10 shadow-2xl" 
          : "h-28 bg-white text-black border-transparent"
      }`}
    >
      {/* 01_LOGO_STATION */}
      <div className="flex items-center gap-8 h-full">
        <Link to="/" onClick={() => soundManager.playClick()} className="flex items-center gap-6 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="SDC" 
              className={`object-contain transition-all duration-500 ${
                isScrolled ? "w-12 invert brightness-200" : "w-14 grayscale"
              } group-hover:scale-110`} 
            />
            <div className={`absolute -bottom-2 left-0 h-0.5 bg-kpr-green transition-all w-0 group-hover:w-full`} />
          </div>
          <div className="flex flex-col">
             <span className={`kpr-mono text-[10px] font-black tracking-widest leading-none transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-black'}`}>
               SOFTWARE
             </span>
             <span className={`kpr-mono text-[10px] font-black tracking-widest leading-none transition-colors duration-500 opacity-40 ${isScrolled ? 'text-white' : 'text-black'}`}>
               DEVELOPMENT_CELL
             </span>
          </div>
        </Link>
        <div className={`w-[1px] h-8 opacity-10 hidden lg:block transition-colors duration-500 ${isScrolled ? 'bg-white' : 'bg-black'}`} />
      </div>

      {/* 02_NAVIGATION_ARRAY */}
      <div className="flex-1 hidden md:flex items-center justify-center gap-16">
        {[
          { label: "PROJECTS", path: "/projects" },
          { label: "SYSTEMS", path: "/about" },
          { label: "NETWORK", path: "/network" }
        ].map((link) => (
          <Link 
            key={link.label}
            to={link.path} 
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative py-2"
          >
            <HackyText 
              text={link.label} 
              className={`text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
                isScrolled ? "text-white" : "text-black"
              } group-hover:text-kpr-green`}
            />
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-kpr-green transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>
      
      {/* 03_SYSTEM_ACCESS */}
      <div className="flex items-center gap-12">
        <div className="hidden xl:flex flex-col items-end">
           <span className="kpr-mono-label opacity-30">UPLINK_STATUS</span>
           <span className={`kpr-mono-value ${isScrolled ? 'text-white' : 'text-black'}`}>SYSTEM_READY_STABLE</span>
        </div>
        
        <button 
          onClick={() => { soundManager.playConfirm(); navigate("/login"); }}
          onMouseEnter={() => soundManager.playHover()}
          className={`px-10 py-3 font-black uppercase text-[10px] tracking-widest transition-all ${
            isScrolled 
              ? "bg-white text-black hover:bg-kpr-green" 
              : "bg-black text-white hover:bg-kpr-green hover:text-black"
          }`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
        >
          AUTH_UPLINK
        </button>
      </div>

      {/* Technical Indicators */}
      <div className="absolute top-0 right-12 h-px w-24 bg-kpr-green opacity-30" />
      <div className="absolute bottom-0 left-12 h-px w-24 bg-kpr-green opacity-30" />
    </nav>
  );
}
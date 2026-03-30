/* cspell:disable */
import { ChevronRight } from "lucide-react";
import logo2 from "../../assets/logo2.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    /* Z-Index 999 fixed. Red shadow replaced with Orange subtle glow */
    <nav className="fixed top-0 left-0 w-full h-24 z-[999] px-8 flex items-center justify-between transition-all duration-700 ease-in-out bg-black/95 backdrop-blur-xl border-b-2 border-orange-500 shadow-[0_10px_40px_rgba(249,115,22,0.1)]">
      
      {/* Left Side: Logo & Industrial Branding */}
      <div className="flex items-center gap-6">
        <img 
          src={logo2} 
          alt="SDC Logo" 
          className="w-24 h-24 object-contain brightness-125 transition-transform hover:scale-105 duration-500" 
        />
        
        {/* Vertical Orange Bar */}
        <div className="flex flex-col border-l-4 pl-6 py-2 border-orange-500">
          <span className="text-[22px] font-black tracking-tighter uppercase italic leading-tight text-white">
            SOFTWARE DEVELOPMENT CELL
          </span>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">
            CELL_OPERATIONS: <span className="text-orange-500/80">ACTIVE</span> // PROTOCOL_V4.0
          </span>
        </div>
      </div>
      
      {/* Right Side: Initialize Button (Orange Slant) */}
      <button 
        onClick={handleLoginRedirect}
        className="group px-10 py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 bg-orange-500 text-black shadow-[4px_4px_0_#ffffff] hover:bg-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95"
        style={{ clipPath: 'polygon(0 0, 92% 0, 100% 30%, 100% 100%, 8% 100%, 0 70%)' }}
      >
        <span className="relative flex items-center justify-center gap-2">
            INITIALIZE_BOOT <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    </nav>
  );
}
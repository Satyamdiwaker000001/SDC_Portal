/* cspell:disable */
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import HeroWelcome from "./HeroWelcome";
import FoundersSection from "./FoundersSection";
import DevelopersSection from "./DevelopersSection";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const mainContainer = useRef<HTMLDivElement>(null);
  const foundersSectionRef = useRef<HTMLElement>(null);
  const devsSectionRef = useRef<HTMLElement>(null);

  // LOGIC: Data initialization from LocalStorage
  const [dynamicContent] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem('sdc_landing_cache');
      return cachedData ? JSON.parse(cachedData) : {
        adminAlias: "ADMIN_ROOT",
        version: "v2.0.4",
        status: "OPERATIONAL"
      };
    }
    return { adminAlias: "ADMIN_ROOT", version: "v2.0.4", status: "OPERATIONAL" };
  });

  useLayoutEffect(() => {
    document.documentElement.style.scrollbarWidth = 'none';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      gsap.from(".welcome-content", { 
        opacity: 0, 
        scale: 0.98, 
        y: 30, 
        duration: 1.2, 
        ease: "power3.out", 
        delay: 0.3 
      });

      // 2. Founders Pinning Logic
      gsap.timeline({
        scrollTrigger: {
          trigger: "#founders_section_trigger",
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      })
      .from(".founders-header", { opacity: 0, y: 20, duration: 1 }, 0)
      .from(".founder-card", { 
        opacity: 0, 
        y: 40, 
        stagger: 0.1, 
        duration: 1,
        ease: "power2.out" 
      }, 0.2);

    }, mainContainer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainContainer} className="bg-[#020203] min-h-screen text-zinc-300 font-sans overflow-x-hidden antialiased selection:bg-sky-500/30">

      {/* --- BACKDROP: Clean Radial Depth (Grid Removed) --- */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#0ea5e905,transparent_70%)] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10">
        <HeroWelcome />
      </main>

      <section id="founders_section_trigger" className="w-full relative z-10 border-t border-white/5">
        <FoundersSection ref={foundersSectionRef} />
      </section>

      <section id="devs_section_trigger" className="w-full relative z-10 bg-[#020203]">
        <DevelopersSection ref={devsSectionRef} />
      </section>

      {/* --- TACTICAL FOOTER --- */}
      <footer className="relative z-10 bg-[#020203] border-t border-sky-500/20 py-16 px-10 overflow-hidden">

        {/* Decorative Top Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-sky-500/40 to-transparent" />
        
        {/* Animated Bottom Scanner Pattern */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[repeating-linear-gradient(90deg,#0ea5e911,#0ea5e911_10px,transparent_10px,transparent_20px)] opacity-20" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">

          {/* LEFT: MISSION CODE */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-sky-500 shadow-[0_0_15px_#0ea5e9]" />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">SDC_CORE_TERMINAL</h3>
                <p className="text-[9px] font-mono text-sky-500/60 uppercase tracking-[0.3em] mt-1">Status: Global_Uplink_Established</p>
              </div>
            </div>
            <p className="max-w-sm text-[10px] font-bold text-zinc-600 uppercase leading-relaxed tracking-widest">
              This portal is an authorized entry point for SDC operatives. All actions are logged under Protocol_2.0. Unauthorized access will trigger a system-wide lockout.
            </p>
          </div>

          {/* CENTER: LIVE SYSTEM MONITOR */}
          <div className="flex-1 max-w-md w-full bg-sky-500/5 border border-sky-500/10 p-6 relative">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-sky-500 text-black text-[8px] font-black uppercase">Active_Session</div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase">Current_Operator</p>
                <p className="text-[11px] font-mono font-black text-white uppercase tracking-wider">{dynamicContent.adminAlias}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase">System_Build</p>
                <p className="text-[11px] font-mono font-black text-sky-400 uppercase tracking-wider">{dynamicContent.version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase">Response_Time</p>
                <p className="text-[11px] font-mono font-black text-emerald-500 uppercase tracking-wider">0.002ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black text-zinc-500 uppercase">Encryption</p>
                <p className="text-[11px] font-mono font-black text-white uppercase tracking-wider">AES_256_GCM</p>
              </div>
            </div>

            {/* Scanning Bar Animation */}
            <div className="mt-6 h-0.5 w-full bg-zinc-900 overflow-hidden relative">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/3 bg-linear-to-r from-transparent via-sky-500 to-transparent"
              />
            </div>
          </div>

          {/* RIGHT: TACTICAL EXIT */}
          <div className="text-right flex flex-col items-end gap-4">
            <div className="flex gap-4 opacity-40">
              {["GITHUB", "DISCORD", "X"].map(link => (
                <span key={link} className="text-[9px] font-black text-white hover:text-sky-400 cursor-pointer transition-colors tracking-widest border-b border-transparent hover:border-sky-500 pb-1 uppercase">{link}</span>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">
                © 2026 // SDC_LOG_001
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Style Injector */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; background-color: #020203; }
      `}</style>
    </div>
  );
}
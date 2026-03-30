/* cspell:disable */
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";
import HeroWelcome from "./HeroWelcome"; 
import FoundersSection from "./FoundersSection"; 
import DevelopersSection from "./DevelopersSection"; // New Import

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const mainContainer = useRef<HTMLDivElement>(null);
  const foundersSectionRef = useRef<HTMLElement>(null);
  const devsSectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    document.documentElement.style.scrollbarWidth = 'none';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      gsap.from(".welcome-content", {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
      });

      // 2. Founders Section Pin & Reveal
      gsap.timeline({
        scrollTrigger: {
          trigger: "#founders_section_trigger",
          start: "top top", 
          end: "+=150%", 
          scrub: 1, 
          pin: true, 
          anticipatePin: 1
        }
      })
      .from(".founders-header", { opacity: 0, scale: 0.9, y: 30, duration: 1 }, 0)
      .from(".founder-card", { opacity: 0, y: 50, scale: 0.9, stagger: 0.2, duration: 1 }, 0);

      // 3. Developers Section Reveal (Simple Stagger)
      gsap.from(".dev-card", {
        scrollTrigger: {
          trigger: "#devs_section_trigger",
          start: "top 80%", // Jab section ka top 80% screen par aaye
        },
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 1.2,
        ease: "expo.out"
      });

    }, mainContainer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainContainer} className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-x-hidden antialiased">
      
      {/* Background Grid Accent (Industrial Orange) */}
      <div className="fixed inset-0 opacity-[0.07] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `radial-gradient(#f97316 0.8px, transparent 0.8px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />

      <Navbar />

      {/* PHASE 1: Welcome */}
      <main className="relative z-10">
        <HeroWelcome />
      </main>

      {/* PHASE 2: Founders (Pinned) */}
      <section id="founders_section_trigger" className="w-full relative z-10">
        <FoundersSection ref={foundersSectionRef} />
      </section>

      {/* PHASE 3: Developers (Scroll Reveal) */}
      <section id="devs_section_trigger" className="w-full relative z-10 bg-[#050505]">
        <DevelopersSection ref={devsSectionRef} />
      </section>

      {/* Tactical Footer Buffer */}
      <div className="h-[40vh] bg-black border-t-2 border-orange-500/10 flex flex-col items-center justify-center relative z-10">
          <div className="w-20 h-1 bg-orange-500 mb-4 opacity-50" />
          <p className="text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
            End_of_Operations // SDC_Portal_Core
          </p>
      </div>
    </div>
  );
}
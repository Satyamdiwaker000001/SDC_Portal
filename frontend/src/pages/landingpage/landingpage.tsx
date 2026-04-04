import { useEffect } from "react";
import Navbar from "./Navbar";
import HeroDiscover from "./HeroDiscover";
import FoundersSection from "./FoundersSection";
import DevelopersSection from "./DevelopersSection";
import MissionTechnical from "./MissionTechnical";
import { soundManager } from "../../utils/SoundManager";

export default function LandingPage() {
  useEffect(() => {
    // Initial entry haptics
    const timer = setTimeout(() => {
      soundManager.playSlide();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col w-full relative bg-white pt-28">
      <Navbar />
      
      {/* 01_HERO_SECTION */}
      <section className="min-h-[90vh] flex items-center justify-center relative border-b border-black/5">
        <HeroDiscover />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-10">
          <span className="kpr-mono-label font-black">SCROLL_TO_INITIATE</span>
          <div className="w-[1px] h-12 bg-black animate-bounce" />
        </div>
      </section>

      {/* 02_FOUNDERS_REGISTRY */}
      <FoundersSection />

      {/* 03_OPERATIVE_REGISTRY */}
      <DevelopersSection />

      {/* 04_MISSION_TECHNICAL */}
      <section className="min-h-screen py-48 bg-black text-white overflow-hidden relative">
        <MissionTechnical />
      </section>

      {/* 04_FOOTER_TECHNICAL */}
      <footer className="py-24 px-12 border-t border-kpr-grey bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-black italic tracking-tighter">SDC_CORE</h2>
            <p className="kpr-mono-label max-w-sm">
              ENGINEERING THE DIGITAL FRONTIER THROUGH RIGOROUS SYSTEM ARCHITECTURE AND IMMERSIVE DESIGN.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <span className="kpr-mono-label">CONNECT</span>
              <ul className="kpr-mono-value space-y-2">
                <li className="hover:text-kpr-green cursor-pointer">GITHUB</li>
                <li className="hover:text-kpr-green cursor-pointer">LINKEDIN</li>
                <li className="hover:text-kpr-green cursor-pointer">INSTAGRAM</li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="kpr-mono-label">SYSTEM</span>
              <ul className="kpr-mono-value space-y-2">
                <li className="hover:text-kpr-green cursor-pointer">NODE_LOGS</li>
                <li className="hover:text-kpr-green cursor-pointer">CORE_V4</li>
                <li className="hover:text-kpr-green cursor-pointer">ARCHIVE</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 pt-12 border-t border-kpr-grey flex justify-between items-center bg-white">
          <span className="kpr-mono-label">© 2024 SDC_CELL // ALL RIGHTS RESERVED</span>
          <span className="kpr-mono-label">UPLINK_STATUS_STABLE</span>
        </div>
      </footer>

    </div>
  );
}
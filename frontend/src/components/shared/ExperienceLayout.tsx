import React from 'react';
import { SoundToggle } from './SoundToggle';

interface ExperienceLayoutProps {
  children: React.ReactNode;
}

export const ExperienceLayout: React.FC<ExperienceLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-kpr-white selection:bg-kpr-green">
      
      {/* 1. LAYER_CONTENT_BASE */}
      <main className="relative z-[2] w-full min-h-screen">
        {children}
      </main>

      {/* 2. LAYER_SYSTEM_CONTROLS */}
      <div className="fixed top-12 left-12 z-50 flex items-center gap-6">
        <div className="hidden md:block">
           <p className="kpr-mono-label opacity-40 mb-1 leading-none">SYSTEM_UPLINK</p>
           <p className="kpr-mono-value leading-none">ACTIVE_NODE_AGRA_01</p>
        </div>
      </div>

      <div className="fixed bottom-12 right-12 z-50 flex flex-col items-end gap-6">
        <div className="text-right hidden md:block">
           <p className="kpr-mono-label opacity-40 mb-1 leading-none">PAGE_REF</p>
           <p className="kpr-mono-value leading-none">PGE-001</p>
        </div>
        <SoundToggle />
      </div>
    </div>
  );
};

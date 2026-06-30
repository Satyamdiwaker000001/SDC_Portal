import React from 'react';
import { TransitionOverlay, usePageTransition } from '../../components/ui/TransitionOverlay';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import FoundersSection from '../../components/landing/FoundersSection';
import DevelopersSection from '../../components/landing/DevelopersSection';
import ProjectsSection from '../../components/landing/ProjectsSection';
import RecruitmentSection from '../../components/landing/RecruitmentSection';

const LandingPage = () => {
  const { isLoading } = usePageTransition();

  return (
    <div className="min-h-screen bg-bg">
      <TransitionOverlay isLoading={isLoading} />
      
      <Navbar />
      
      <main className="relative">
        <Hero />
        <FoundersSection />
        <DevelopersSection />
        <ProjectsSection />
        <RecruitmentSection />
      </main>

      <footer className="bg-bg-elevated border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
                <span className="font-pixel text-xs text-bg font-bold">SDC</span>
              </div>
              <div>
                <p className="font-display font-bold text-fg">SOFTWARE DEVELOPMENT CELL</p>
                <p className="font-mono text-xs text-fg-muted">Build Together. Grow Together. Lead Tomorrow.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-accent-cyan transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-accent-magenta transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-accent-cyan transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-10.544-9.317-4.983 5.527 5.377 5.772L0 16.27l9.294-9.83-5.44-5.496 10.163 8.847-9.531-10.077z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-accent-magenta transition-colors" aria-label="Discord">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.065.065 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.214.076.076 0 0 0 .041-.106 13.107 13.107 0 0 0-.182-.841.077.077 0 1 0-.135.128c.9 2.839 3.866 5.222 7.14 5.222 3.275 0 6.24-2.384 7.14-5.222a.077.077 0 1 0-.136-.127 13.14 13.14 0 0 1-.176.84.076.076 0 0 0 .04.107.077.077 0 0 0 0 .083.028c1.993-.89 4.768-2.279 6.945-4.285a.068.068 0 0 0 .03-.055c.438-4.645-.48-9.275-3.362-13.703a.061.061 0 0 0-.03-.027zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
            
            <p className="font-mono text-xs text-fg-muted md:hidden">© 2024 SDC. All rights reserved.</p>
          </div>
          
          <p className="hidden md:block mt-8 text-center font-mono text-xs text-fg-muted">© 2024 SDC. All rights reserved. Built with React, Three.js & GSAP.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
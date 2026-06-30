import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import ArcadeButton from './ArcadeButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  const sections = ['hero', 'founders', 'developers', 'projects', 'recruitment'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      const sectionPositions = sections.map(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top, bottom: rect.bottom };
        }
        return null;
      }).filter(Boolean);

      for (const section of sectionPositions) {
        if (section && section.top <= 100 && section.bottom >= 100) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { id: 'projects', label: 'PROJECTS' },
    { id: 'founders', label: 'FOUNDERS' },
    { id: 'developers', label: 'DEVELOPERS' },
    { id: 'recruitment', label: 'RECRUITMENT' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-bg-elevated/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          
          {/* Left: Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-12 h-12 rounded-full border-2 border-accent-cyan/50 flex items-center justify-center hover:bg-accent-cyan/10 transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className="text-accent-cyan" /> : <Menu size={24} className="text-accent-cyan" />}
          </button>

          {/* Logo - Left on mobile, Center on desktop */}
          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-accent-cyan/50 transition-colors"
              aria-label="SDC Home"
            >
              <div className="w-8 h-8 h-8 rounded bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
                <span className="font-pixel text-[8px] text-bg font-bold">SDC</span>
              </div>
              <span className="hidden sm:block font-display font-bold text-lg text-fg">SOFTWARE DEVELOPMENT CELL</span>
            </button>
          </div>

          {/* Right: Desktop Nav Links + Login */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-pixel text-xs px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                  activeSection === link.id
                    ? 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30'
                    : 'text-fg-muted hover:text-fg hover:bg-card border border-transparent'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-accent-cyan"
                  />
                )}
              </button>
            ))}
            <ArcadeButton variant="primary" className="ml-2" onClick={() => scrollToSection('recruitment')}>
              JOIN SDC
            </ArcadeButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Game Boy Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 mx-auto max-w-md bg-card border-t-4 border-accent-cyan rounded-t-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <span className="font-pixel text-sm text-accent-cyan">SDC MENU</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent-cyan/10 hover:border-accent-cyan transition-colors"
                >
                  <X size={20} className="text-fg-muted" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-2 mb-6">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(link.id)}
                    className={`font-pixel text-sm px-4 py-3 rounded-lg text-left transition-all ${
                      activeSection === link.id
                        ? 'text-accent-cyan bg-accent-cyan/10 border-l-4 border-accent-cyan'
                        : 'text-fg hover:text-accent-cyan hover:bg-card'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {link.label}
                      <ChevronDown size={16} className="text-fg-muted" />
                    </span>
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  onClick={() => scrollToSection('recruitment')}
                  className="font-pixel text-sm px-4 py-3 rounded-lg bg-accent-cyan text-bg font-bold hover:bg-accent-cyan/90 transition-colors"
                >
                  JOIN SDC
                </motion.button>
              </nav>

              {/* Social Links */}
              <div className="flex justify-center gap-4 pt-4 border-t border-border">
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
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.065.065 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-.214.076.076 0 0 0 .041-.106 13.107 13.107 0 0 0-.182-.841.077.077 0 1 0-.135.128c.9 2.839 3.866 5.222 7.14 5.222 3.275 0 6.24-2.384 7.14-5.222a.077.077 0 1 0-.136-.127 13.14 13.14 0 0 1-.176.84.076.076 0 0 0 .04.107.077.077 0 0 0 .083.028c1.993-.89 4.768-2.279 6.945-4.285a.068.068 0 0 0 .03-.055c.438-4.645-.48-9.275-3.362-13.703a.061.061 0 0 0-.03-.027zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418z"/></svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mouse, ArrowDown } from 'lucide-react';
import ArcadeButton from './ArcadeButton';
import HeroCanvas3D from './HeroCanvas3D';

const Hero = () => {
  const heroRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    const scrollTimer = setTimeout(() => setShowScroll(true), 2000);
    return () => { clearTimeout(timer); clearTimeout(scrollTimer); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setShowScroll(false);
      else setShowScroll(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={heroRef} 
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
    >
      <HeroCanvas3D heroSectionRef={heroRef} />

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        backgroundSize: '100% 4px',
        opacity: 0.3,
        zIndex: 10,
      }} />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan uppercase tracking-widest mb-6 px-4 py-1.5 border border-accent-cyan/30 rounded-full bg-accent-cyan/10">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            SOFTWARE DEVELOPMENT CELL
          </span>
          
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-[9rem] text-fg tracking-tight uppercase leading-[1.05] mb-6">
            BUILD <span className="text-accent-cyan">TOGETHER</span>
            <br />
            <span className="text-accent-magenta">GROW</span> TOGETHER
            <br />
            LEAD <span className="text-accent-gold">TOMORROW</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-fg-muted leading-relaxed mb-10">
            A student-run technical organization bridging academic learning with professional software engineering. 
            Real projects. Senior mentorship. Industry practices. Portfolio that matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ArcadeButton 
              variant="primary" 
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="group"
            >
              <span className="flex items-center gap-2">
                EXPLORE PROJECTS
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </span>
            </ArcadeButton>
            <ArcadeButton 
              variant="secondary" 
              size="lg"
              onClick={() => scrollToSection('recruitment')}
            >
              JOIN SDC
            </ArcadeButton>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 px-4"
        >
          <StatItem value="50+" label="PROJECTS SHIPPED" />
          <StatItem value="200+" label="DEVELOPERS TRAINED" />
          <StatItem value="15+" label="TEAMS FORMED" />
          <StatItem value="8+" label="YEARS ACTIVE" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-muted"
            onClick={() => scrollToSection('founders')}
          >
            <span className="font-mono text-xs uppercase tracking-widest">SCROLL TO EXPLORE</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 border-2 border-accent-cyan/50 rounded-full flex items-start justify-center p-1.5"
            >
              <Mouse className="w-4 h-6 text-accent-cyan" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Synthwave Grid */}
      <div className="absolute bottom-0 w-full h-[50vh] synthwave-grid z-0 opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-bg via-bg/80 to-transparent z-0 pointer-events-none" />
    </section>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-fg mb-1 tabular-nums">
      <span className="text-accent-cyan">{value}</span>
    </div>
    <div className="font-mono text-xs text-fg-muted uppercase tracking-wider">{label}</div>
  </div>
);

export default Hero;
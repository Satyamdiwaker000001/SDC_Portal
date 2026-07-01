import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import sdcLogo from '../assets/sdc_logo.png';
import head1 from '../assets/heads/Dr. Rahul Rastogi.jpg';
import head2 from '../assets/heads/Mr. Prateek Agrawal.jpeg';
import founderAyush from '../assets/founders/Ayush.jpg';
import founderTushar from '../assets/founders/Tushar.jpg';


// Reusable animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// SVG Icons
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Profile Card Component (ID Badge Flip Card)
const ProfileCard = ({ name, role, image, linkedin, github }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="relative w-full max-w-[280px] mx-auto aspect-[5/8] cursor-pointer group my-8"
      style={{ perspective: '1200px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D Flip Container */}
      <div
        className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] transform-gpu shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-[2rem]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >

        {/* FRONT FACE (The Identity) */}
        <div
          className="absolute inset-0 bg-[#1c222b] rounded-[2rem] overflow-hidden flex flex-col border border-white/10"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Top Teal Section */}
          <div className="bg-[#00b4d8] h-36 w-full relative rounded-t-[2rem]">
            {/* 3 Dots Decoration */}
            <div className="absolute top-8 right-8 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
          </div>

          {/* Square Portrait over the edge */}
          <div className="absolute top-12 left-6 w-32 h-32 bg-white p-1 rounded-sm shadow-xl z-10">
            <img src={image} alt={name} className="w-full h-full object-cover object-top" />
          </div>

          {/* Middle Section (Name & Role) */}
          <div className="flex-1 mt-12 px-6 flex flex-col relative">
            <div className="absolute right-6 top-2 text-white/20 text-4xl font-light">↘</div>
            <h3 className="text-3xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight">
              {name.split(' ')[0]}<br />
              <span className="text-white/90">{name.split(' ').slice(1).join(' ')}</span>
            </h3>
            <div className="bg-[#00b4d8] text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full self-start mb-4 shadow-lg shadow-[#00b4d8]/20">
              {role}
            </div>
            <p className="text-white/40 text-[10px] leading-relaxed pr-4">
              Official member of the cell. Access granted to all SDC technical operations.
            </p>
          </div>

          {/* Bottom Section (Contacts) */}
          <div className="h-20 border-t border-white/5 mx-6 flex items-center justify-between pb-2">
            <div className="flex flex-col">
              <span className="text-[#00b4d8] text-[9px] font-bold uppercase tracking-widest mb-1">Contact</span>
              <span className="text-white/50 text-[10px]">Click card to flip &rarr;</span>
            </div>
            <div className="flex gap-4">
              {linkedin && (
                <a href={linkedin} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#00b4d8] transition-colors">
                  <LinkedInIcon />
                </a>
              )}
              {github && (
                <a href={github} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#00b4d8] transition-colors">
                  <GithubIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE (Company Details) */}
        <div
          className="absolute inset-0 bg-[#1c222b] rounded-[2rem] overflow-hidden flex flex-col border border-white/10"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Top Teal Section */}
          <div className="bg-[#00b4d8] h-[45%] w-full rounded-bl-[4rem] relative flex flex-col p-8 z-10 shadow-2xl">
            <div className="flex gap-1.5 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/50"></div>
            </div>
            <h3 className="text-3xl font-extrabold text-white leading-tight mb-2 tracking-tight">Software<br />Development<br />Cell</h3>
            <p className="text-white/90 text-xs font-medium">Smart steps toward mastery.</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/50 text-[10px] tracking-[0.3em] font-mono font-bold whitespace-nowrap">
              EST. 2024
            </div>
          </div>

          {/* Middle Section (Tech image) */}
          <div className="absolute inset-0 top-[30%] bottom-[10%] overflow-hidden bg-black z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c222b] via-transparent to-[#1c222b] z-10"></div>
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80" alt="Tech Background" className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
          </div>

          {/* Bottom Teal Curve */}
          <div className="absolute bottom-0 right-0 w-full h-[25%] bg-[#00b4d8] rounded-tl-[3rem] p-6 flex items-center gap-5 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
            <div className="w-10 h-10 border-2 border-white/50 flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-white/80"></div>
            </div>
            <p className="text-white/90 text-[9px] leading-relaxed font-medium">
              Authorized badge holder. Committed to bridging the gap between academia and industry.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// Interactive Folder Project Card
const ProjectCard = ({ title, desc, image, tags, link }) => (
  <motion.div variants={fadeInUp} className="group relative w-full h-[380px] cursor-pointer mt-10" style={{ perspective: '1200px' }}>

    {/* Folder Back Tab */}
    <div className="absolute top-0 left-0 w-2/5 h-12 bg-[#2a9d8f]/30 border-t border-l border-r border-[#2a9d8f]/50 rounded-t-2xl z-0 transition-colors group-hover:bg-[#2a9d8f]/40 flex items-center px-4">
      <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse"></div>
      <span className="ml-2 text-[#00e5ff] text-[9px] font-mono uppercase tracking-widest font-bold">Project File</span>
    </div>

    {/* Folder Back Body */}
    <div className="absolute top-11 left-0 w-full h-[calc(100%-44px)] bg-[#1c222b] border border-white/10 rounded-b-3xl rounded-tr-3xl z-0 shadow-inner"></div>

    {/* The Document (Slides up on hover) */}
    <div className="absolute top-14 left-4 right-4 h-[300px] bg-white rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-24 group-hover:rotate-[-3deg] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="h-40 w-full overflow-hidden relative border-b border-gray-200">
        <div className="absolute inset-0 bg-[#00b4d8]/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
        <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
      </div>
      <div className="p-6 bg-[#f8f9fa] h-full relative">
        {/* Top Secret Stamp */}
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#2a9d8f] text-white text-[8px] font-bold px-2 py-1 uppercase tracking-widest rotate-[15deg] shadow-md border border-[#2a9d8f]/50">
          Confidential
        </div>
        <h3 className="text-gray-900 font-extrabold text-lg mb-2 leading-tight">{title}</h3>
        <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>

    {/* Folder Front Flap */}
    <div className="absolute bottom-0 left-0 w-full h-[72%] bg-gradient-to-br from-[#00b4d8] to-[#2a9d8f] border-t border-white/20 rounded-3xl z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] transition-transform duration-700 ease-out origin-bottom group-hover:[transform:rotateX(-25deg)] flex flex-col justify-end p-8">

      {/* Flap crease/handle detail */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-black/10 rounded-full shadow-inner"></div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="bg-black/20 text-white font-bold text-[9px] font-mono uppercase px-2 py-1 rounded shadow-sm backdrop-blur-md">{tag}</span>
        ))}
      </div>
      <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">{title}</h3>
      <a href={link} className="inline-flex items-center text-white/90 text-[10px] font-mono uppercase tracking-[0.2em] font-bold hover:text-white transition-colors group/link mt-3">
        Access File <span className="ml-2 group-hover/link:translate-x-1 transition-transform">&rarr;</span>
      </a>
    </div>
  </motion.div>
);


export default function LandingPage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['About', 'Founders', 'Projects', 'Mentors'];

  const handleNavClick = (link) => {
    if (link === 'About') return;
    const el = document.getElementById(link.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="bg-[#020617] w-full min-h-screen font-sans text-white selection:bg-[#0066ff] selection:text-white">

      {/* ===== NAVBAR ===== */}
      <nav className={`fixed w-full z-50 transition-all duration-500 flex justify-center ${scrolled ? 'top-3' : 'top-6'
        }`}>
        <div className={`w-[95%] max-w-7xl px-4 lg:px-6 py-2.5 grid grid-cols-3 items-center rounded-full border transition-all duration-500 ${scrolled
            ? 'bg-[#020617]/70 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-[#020617]/30 backdrop-blur-md border-white/5 shadow-lg'
          }`}>

          {/* LEFT: Logo only — no text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={sdcLogo} alt="SDC Logo" className="h-10 w-auto object-contain ml-2" />
          </motion.div>

          {/* CENTER: Nav Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center justify-center gap-1"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                onClick={() => handleNavClick(link)}
                className="relative px-5 py-2 text-[13px] text-white/70 font-medium tracking-wide hover:text-white transition-all duration-300 rounded-full bg-white/[0.02] border border-transparent hover:bg-white/[0.08] hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] mx-0.5"
              >
                {link}
              </motion.button>
            ))}
          </motion.div>

          {/* RIGHT: CTA + Mobile toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-end gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-2 relative group px-5 py-2 rounded-full bg-white/[0.05] border border-white/10 hover:border-[#00b4d8]/50 hover:bg-[#00b4d8]/10 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00b4d8]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative z-10 text-white text-[12px] font-medium tracking-wider group-hover:text-white transition-colors">
                Member Access
              </span>
              <svg className="w-3.5 h-3.5 relative z-10 text-white/50 group-hover:text-[#00b4d8] transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="px-8 py-6 flex flex-col gap-4">
                {navLinks.map(link => (
                  <button key={link} onClick={() => setMenuOpen(false)}
                    className="text-white/70 text-sm font-medium hover:text-[#00b4d8] transition-colors text-left">
                    {link}
                  </button>
                ))}
                <button onClick={() => navigate('/login')}
                  className="bg-[#00b4d8] text-black font-black text-xs uppercase tracking-widest px-6 py-3 w-full mt-2">
                  Member Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


      {/* ======= HERO SECTION ======= */}
      <section className="relative min-h-[85vh] py-32 w-full flex flex-col items-center justify-center overflow-hidden bg-[#020617] pt-40">

        {/* Background: Animated Grid & Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Animated Grid */}
          <div className="absolute inset-0" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                 backgroundSize: '4rem 4rem',
                 maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)',
                 WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%)'
               }} 
          />
          {/* Primary Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-[#00b4d8]/20 to-[#0066ff]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          
          {/* Floating Tech Symbols */}
          {[
            { symbol: '< />', top: '20%', left: '15%', delay: 0 },
            { symbol: '{ }', top: '70%', left: '10%', delay: 1 },
            { symbol: '[ ]', top: '30%', right: '15%', delay: 2 },
            { symbol: '();', top: '65%', right: '12%', delay: 1.5 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }} animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 6, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
              className="absolute text-white/10 font-mono font-bold text-4xl select-none"
              style={{ top: item.top, left: item.left, right: item.right }}
            >
              {item.symbol}
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 border border-[#00b4d8]/30 bg-[#00b4d8]/10 px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
            <span className="text-[#00b4d8] text-[11px] font-semibold uppercase tracking-[0.25em]">Software Development Cell · Est. 2024</span>
          </motion.div>

          {/* Main headline — word-by-word reveal */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-black text-white leading-[1.1] tracking-tight drop-shadow-lg"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              Smart steps toward
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6 relative">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-black leading-[1.1] tracking-tight relative z-10"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                backgroundImage: 'linear-gradient(to right, #00e5ff, #0066ff, #00b4d8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(0, 180, 216, 0.3))'
              }}
            >
              technical mastery.
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            className="text-white/50 text-base font-light max-w-xl leading-relaxed mb-8"
          >
            Empowering students to bridge the gap between academia and industry.
            Join the official technical powerhouse of the institution.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-wrap gap-5 justify-center mb-10 w-full"
          >
            <button onClick={() => navigate('/login')}
              className="relative overflow-hidden bg-gradient-to-r from-[#00b4d8] to-[#0066ff] text-white font-black text-[13px] uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,180,216,0.6)] group"
            >
              <span className="relative z-10 drop-shadow-md">Initialize Access</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
            <button className="bg-white/5 border border-white/20 text-white font-semibold text-[13px] uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-[#00b4d8]/50 hover:text-[#00b4d8] backdrop-blur-md">
              Explore Projects
            </button>
          </motion.div>

          {/* Bottom stats bar — glass pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.95, duration: 0.7, type: "spring", bounce: 0.4 }}
            className="w-full max-w-3xl bg-[#020617]/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-10 py-6 grid grid-cols-3 divide-x divide-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
          >
            {[
              { value: '50+', label: 'Active Members' },
              { value: '20+', label: 'Projects Built' },
              { value: '2yr', label: 'Of Excellence' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 px-4 relative overflow-hidden">
                <span className="text-4xl font-black text-white tracking-tight group-hover:scale-110 transition-transform duration-500 ease-out">{value}</span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold group-hover:text-[#00b4d8] transition-colors duration-300">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
        >
          <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>

      </section>


      {/* 2. Heads of SDC */}
      <section className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="border border-white/20 text-white/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium">The Visionaries</span>
            <h2 className="text-5xl font-medium mt-8 tracking-tight leading-tight text-center">Heads of SDC</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full place-items-center">
            {/* Heads (With Github) */}
            <ProfileCard
              name="Dr. Rahul Rastogi" role="Head of SDC"
              image={head1}
              linkedin="https://www.linkedin.com/in/dr-rahul-rastogi-a1413439/"
            />
            <ProfileCard
              name="Mr. Prateek Agrawal" role="Co-Head of SDC"
              image={head2}
              linkedin="https://www.linkedin.com/in/erprateek/"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Founders */}
      <section id="founders" className="py-24 px-6 lg:px-24 bg-[#0a192f]/30 border-y border-white/5 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="border border-white/20 text-white/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium">The Origin</span>
            <h2 className="text-5xl font-medium mt-8 tracking-tight leading-tight text-center">Founders</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="flex flex-wrap justify-center gap-8 w-full">
            <ProfileCard name="Er. Ayush Shrivastava" role="Founder" image={founderAyush} linkedin="https://www.linkedin.com/in/ayush-shrivastava-218299239/" />
            <ProfileCard name="Er. Nandini Saxena" role="Founder" image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" linkedin="https://www.linkedin.com/in/nandini-saxena-a8000031a/" />
            <ProfileCard name="Er. Shivang Chauhan" role="Founder" image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" linkedin="https://www.linkedin.com/in/shivangch-csdev/" />
            <ProfileCard name="Er. Prashant Singh" role="Founder" image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" linkedin="https://www.linkedin.com/in/prashant-singh-69b88a302/" />
            <ProfileCard name="Er. Tushar" role="Founder" image={founderTushar} linkedin="https://www.linkedin.com/in/tushar-772477232/" />
          </motion.div>
        </div>
      </section>

      {/* 4. Developers (Divisions) */}
      <section className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="text-[#00e5ff] tracking-widest text-sm font-medium uppercase mb-4 block">The Engine</span>
            <h2 className="text-5xl font-medium tracking-tight text-center">Lead Developers</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full place-items-center">
            <ProfileCard
              name="Elena Rostova" role="Web Dev Lead"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
              linkedin="#" github="#"
            />
            <ProfileCard
              name="Marcus Doe" role="App Dev Lead"
              image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80"
              linkedin="#" github="#"
            />
            <ProfileCard
              name="Aisha Khan" role="AI/ML Lead"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
              linkedin="#" github="#"
            />
          </motion.div>
        </div>
      </section>

      {/* 5. Mentors */}
      <section id="mentors" className="py-24 px-6 lg:px-24 bg-[#0a192f]/30 border-y border-white/5 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-20 w-full">
            <h2 className="text-5xl font-medium tracking-tight mb-4">Our Mentors</h2>
            <p className="text-xl text-white/50 font-light mb-12">Guiding the next generation of engineers.</p>
            <div className="flex gap-12 items-center justify-center">
              <div className="text-center">
                <h4 className="text-4xl font-medium text-white">50+</h4>
                <p className="text-[#00e5ff] text-xs uppercase tracking-widest mt-2">Active Mentors</p>
              </div>
              <div className="w-px h-16 bg-white/20"></div>
              <div className="text-center">
                <h4 className="text-4xl font-medium text-white">1:1</h4>
                <p className="text-[#00e5ff] text-xs uppercase tracking-widest mt-2">Guidance Ratio</p>
              </div>
            </div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full place-items-center">
            <ProfileCard name="David Kim" role="Senior Mentor" image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" linkedin="#" />
            <ProfileCard name="Priya Patel" role="UI/UX Mentor" image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" linkedin="#" />
            <ProfileCard name="Tom Wilson" role="Backend Mentor" image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" linkedin="#" />
            <ProfileCard name="Nina Smith" role="DevOps Mentor" image="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&q=80" linkedin="#" />
          </motion.div>
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-20 flex flex-col items-center">
            <span className="text-[#00e5ff] tracking-widest text-sm font-medium uppercase mb-4 block">Output</span>
            <h2 className="text-5xl font-medium tracking-tight text-center">Flagship Projects</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full place-items-center">
            <ProjectCard
              title="SDC Internal Portal"
              desc="A comprehensive internal management system streamlining cell operations, attendance, and recruitment tracking."
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"
              tags={["React", "FastAPI", "PostgreSQL"]} link="#"
            />
            <ProjectCard
              title="Project Beta Open Source"
              desc="An open-source initiative driving collaborative engineering. Members contribute to real-world libraries."
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"
              tags={["Python", "Machine Learning", "Docker"]} link="#"
            />
            <ProjectCard
              title="Hackathon Nexus"
              desc="A unified platform for hosting and managing national-level competitive coding events and symposiums."
              image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80"
              tags={["Next.js", "Node.js", "MongoDB"]} link="#"
            />
          </motion.div>
        </div>
      </section>

      {/* 6. Recruitment Form (Interactive Slide-Out Envelope) */}
      <section className="py-40 px-6 lg:px-24 relative overflow-hidden flex justify-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#00b4d8] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="w-full max-w-5xl relative min-h-[550px] flex items-center justify-center">

          {/* The Envelope / Folder Cover (Left Side, Goes to Background) */}
          <motion.div
            initial={{ x: "0%", scale: 1, zIndex: 20 }}
            animate={isFormOpen ? { x: "-20%", scale: 0.9, zIndex: 10 } : { x: "0%", scale: 1, zIndex: 20 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute w-full md:w-[55%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[3rem]"
          >
            <div className="bg-[#1c222b] border border-white/10 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b4d8] blur-[100px] opacity-20 rounded-full"></div>
              <div className="absolute -left-10 bottom-10 w-4 h-40 bg-[#2a9d8f] rounded-full blur-xl opacity-50"></div>

              <div className="relative z-10">
                <span className="text-[#00b4d8] font-mono uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Application 2026</span>
                <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-lg">
                  Ready to<br /><span className="text-white/60">Take Control?</span>
                </h2>
                <p className="text-white/40 text-sm mb-12 max-w-md leading-relaxed">
                  Become an official member of the Software Development Cell. Gain access to exclusive repositories, mentorship, and flagship projects.
                </p>

                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="group flex items-center gap-4 bg-gradient-to-r from-[#00b4d8] to-[#2a9d8f] px-8 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] transition-all hover:scale-105"
                >
                  {isFormOpen ? 'Close Envelope' : 'Extract Form'}
                  <span className={`transition-transform duration-500 ${isFormOpen ? '-rotate-180' : 'group-hover:translate-x-2'}`}>
                    &rarr;
                  </span>
                </button>
              </div>

              {/* Folder Tab Visual */}
              <div className="absolute top-0 right-10 w-24 h-4 bg-[#00b4d8]/20 rounded-b-xl border-b border-x border-[#00b4d8]/50"></div>
            </div>
          </motion.div>

          {/* The Form Document (Right Side, Slides Out and Comes Forward) */}
          <motion.div
            initial={{ x: "0%", scale: 0.9, zIndex: 10, opacity: 0 }}
            animate={isFormOpen ?
              { x: ["0%", "85%", "35%"], scale: [0.9, 1, 1.05], zIndex: [10, 10, 30], opacity: [0, 1, 1] }
              : { x: "0%", scale: 0.9, zIndex: 10, opacity: 0 }
            }
            transition={isFormOpen ? { duration: 1.5, times: [0, 0.6, 1], ease: "easeInOut" } : { duration: 0.8, ease: "easeInOut" }}
            className={`absolute w-full md:w-[45%] ${!isFormOpen ? 'pointer-events-none' : ''}`}
          >
            <div className="bg-[#f8f9fa] border border-gray-300 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative">

              {/* Form Paper Styling */}
              <div className="absolute top-0 right-10 w-16 h-8 bg-[#e63946] text-white text-[8px] font-bold flex items-center justify-center uppercase tracking-widest shadow-md">
                Strictly<br />Confidential
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-8 border-b-2 border-black/10 pb-4 inline-block">Official Application</h3>

              <form className="space-y-6">
                <div>
                  <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Full Legal Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                </div>
                <div>
                  <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">University Email</label>
                  <input type="email" placeholder="john.doe@university.edu" className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                </div>
                <div>
                  <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Primary Division</label>
                  <select className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-[#00b4d8] transition-colors appearance-none rounded-none cursor-pointer">
                    <option value="" disabled selected>Select Assignment...</option>
                    <option value="web">Web Development</option>
                    <option value="app">Mobile App Development</option>
                    <option value="ai">Artificial Intelligence</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button type="button" className="w-full bg-[#1c222b] text-white font-bold tracking-widest uppercase text-xs py-4 rounded-full hover:bg-black transition-colors hover:shadow-xl">
                    Submit to Records
                  </button>
                </div>
              </form>

              {/* Paper texture lines */}
              <div className="absolute bottom-6 left-12 w-[80%] h-[1px] bg-black/5"></div>
              <div className="absolute bottom-8 left-12 w-[60%] h-[1px] bg-black/5"></div>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}

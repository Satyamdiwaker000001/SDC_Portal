import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import sdcLogo from '../assets/sdc_logo.png';
import head1 from '../assets/heads/Dr. Rahul Rastogi.jpg';
import head2 from '../assets/heads/Mr. Prateek Agrawal.jpeg';
import founderAyush from '../assets/founders/Ayush.jpg';
import founderTushar from '../assets/founders/Tushar.jpg';
import { projectsAPI, applicationsAPI, settingsAPI, usersAPI } from '../api/services';
import client from '../api/client';


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

// Profile Card Component (ID Badge Flip Card with Portfolio Link)
const ProfileCard = ({ id, name, role, image, linkedin, github, projectsCount, onOpenPortfolio }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="relative w-full max-w-[280px] mx-auto aspect-[5/8.5] cursor-pointer group my-8"
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
            <h3 className="text-3xl font-extrabold text-white leading-[1.1] mb-3 tracking-tight">
              {name.split(' ')[0]}<br />
              <span className="text-white/90">{name.split(' ').slice(1).join(' ')}</span>
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#00b4d8] text-white text-[11px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-lg shadow-[#00b4d8]/20">
                {role}
              </div>
              {projectsCount !== undefined && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
                </span>
              )}
            </div>

            {/* View Portfolio Button */}
            {id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPortfolio(id);
                }}
                className="mt-1 bg-white/10 hover:bg-[#00b4d8] text-white text-[10px] font-mono uppercase font-bold tracking-widest py-2 px-4 rounded-xl border border-white/20 hover:border-transparent transition-all flex items-center justify-center gap-1.5 shadow-md group/btn"
              >
                <span>⚡ View Portfolio</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </button>
            )}
          </div>

          {/* Bottom Section (Contacts) */}
          <div className="h-16 border-t border-white/5 mx-6 flex items-center justify-between pb-2">
            <div className="flex flex-col">
              <span className="text-[#00b4d8] text-[9px] font-bold uppercase tracking-widest mb-0.5">Contact</span>
              <span className="text-white/50 text-[9px]">Click card to flip &rarr;</span>
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
          <div className="absolute bottom-0 right-0 w-full h-[25%] bg-[#00b4d8] rounded-tl-[3rem] p-6 flex flex-col justify-center gap-2 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
            <p className="text-white/90 text-[9px] leading-relaxed font-medium">
              Authorized badge holder. Committed to bridging academia and software engineering.
            </p>
            {id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPortfolio(id);
                }}
                className="bg-white/20 hover:bg-white text-gray-900 hover:text-black font-bold text-[9px] uppercase tracking-widest py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                Open Full Portfolio
              </button>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// Member Portfolio Showcase Modal Component
const MemberPortfolioModal = ({ userId, onClose }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const data = await usersAPI.getPortfolio(userId);
        setPortfolioData(data);
      } catch (err) {
        console.error("Failed to load developer portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl bg-[#1c222b] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors text-lg font-bold z-20"
        >
          ✕
        </button>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white/60 text-xs tracking-widest uppercase font-mono">Retrieving Member Telemetry...</p>
          </div>
        ) : portfolioData ? (
          <div>
            {/* Top Header Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-white/10 pb-6 mb-6">
              <img
                src={portfolioData.user.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
                alt={portfolioData.user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#00b4d8] shadow-xl shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{portfolioData.user.name}</h2>
                  <span className="bg-[#00b4d8]/20 border border-[#00b4d8]/50 text-[#00b4d8] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {portfolioData.user.role}
                  </span>
                </div>
                <p className="text-white/50 text-xs font-mono mb-4">
                  {portfolioData.user.branch || "Engineering"} • Batch {portfolioData.user.admission_year || "2023"}–{portfolioData.user.passout_year || "2027"}
                </p>

                {/* Tech Stack Pills */}
                {portfolioData.user.tech_stack && portfolioData.user.tech_stack.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-4">
                    {portfolioData.user.tech_stack.map((tech, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 text-white/80 text-[9px] font-mono uppercase px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  {portfolioData.user.github_url && (
                    <a href={portfolioData.user.github_url} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#00b4d8] text-xs font-mono flex items-center gap-1.5 transition-colors">
                      <GithubIcon /> GitHub Profile
                    </a>
                  )}
                  {portfolioData.user.linkedin_url && (
                    <a href={portfolioData.user.linkedin_url} target="_blank" rel="noreferrer" className="text-white/70 hover:text-[#00b4d8] text-xs font-mono flex items-center gap-1.5 transition-colors">
                      <LinkedInIcon /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Telemetry Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-white">{portfolioData.stats.total_projects}</span>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono mt-1">Total Projects</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-emerald-400">{portfolioData.stats.live_projects}</span>
                <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono mt-1">Live Projects</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-[#00b4d8]">{portfolioData.user.performance_score} XP</span>
                <p className="text-[10px] text-[#00b4d8]/80 uppercase tracking-widest font-mono mt-1">XP Score</p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-cyan-400">{portfolioData.stats.completed_tasks}</span>
                <p className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-mono mt-1">Tasks Completed</p>
              </div>
            </div>

            {/* Projects Portfolio Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" /> Member Projects & Hosted Work
              </h3>

              {portfolioData.projects && portfolioData.projects.length > 0 ? (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {portfolioData.projects.map((p) => (
                    <div key={p.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-[#00b4d8]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-bold text-white">{p.name}</h4>
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                            p.is_live ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          }`}>
                            {p.is_live ? '🟢 LIVE SITE' : p.status}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed mb-3">{p.short_description || p.full_description || "Software Development Cell Project"}</p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1.5">
                          <div className="bg-gradient-to-r from-[#00b4d8] to-cyan-400 h-full rounded-full" style={{ width: `${p.progress || 0}%` }} />
                        </div>
                        <span className="text-white/40 text-[9px] font-mono">SDLC Progress: {p.progress || 0}%</span>
                      </div>

                      {/* Links Column */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                        {p.is_live && p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> 🌐 Live Hosted Link
                          </a>
                        )}
                        {p.github_repo && (
                          <a
                            href={p.github_repo}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-3 py-1.5 rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
                          >
                            <GithubIcon /> Repository Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest">No active project assignments recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-white/50 text-xs font-mono">Failed to load member portfolio telemetry.</div>
        )}
      </motion.div>
    </div>
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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [founders, setFounders] = useState([]);
  const [dbHeads, setDbHeads] = useState([]);
  const [dbDevelopers, setDbDevelopers] = useState([]);
  const [activeDevelopers, setActiveDevelopers] = useState([]);
  const [alumniDevelopers, setAlumniDevelopers] = useState([]);
  const [inactiveMembers, setInactiveMembers] = useState([]);
  const [dbMentors, setDbMentors] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedPortfolioUserId, setSelectedPortfolioUserId] = useState(null);

  // Recruitment Form State
  const [isLive, setIsLive] = useState(false);
  const [recruitmentTarget, setRecruitmentTarget] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    branch: '',
    admission_year: new Date().getFullYear(),
    passout_year: new Date().getFullYear() + 3,
    batch_year: '2025-26',
    current_semester: '',
    technical_specialization: '',
    additional_information: '',
    linkedin_url: '',
    github_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const [projData, settingsData, settingsTargetData, statsData, developerData, mentorData, founderData, headData, allUsersData] = await Promise.all([
          projectsAPI.getAll().catch(() => []),
          settingsAPI.get('is_recruitment_live').catch(() => null),
          settingsAPI.get('recruitment_open_for').catch(() => null),
          client.get('/users/public/stats').catch(() => null),
          usersAPI.getPublicRoster('developer').catch(() => []),
          usersAPI.getPublicRoster('mentor').catch(() => []),
          usersAPI.getPublicRoster('founder').catch(() => []),
          usersAPI.getPublicRoster('head').catch(() => []),
          usersAPI.getPublicRoster().catch(() => []),
        ]);

        // Show all projects returned by API
        setCompletedProjects(projData);
        setTotalProjects(projData.length);
        setIsLive(settingsData?.value === 'true');

        let targetValue = settingsTargetData?.value;
        if (!targetValue || targetValue === 'false' || targetValue === 'null') {
          targetValue = "All Roles";
        }
        setRecruitmentTarget(targetValue);

        const stats = statsData?.data || {};
        setTotalMembers(stats.members || 0);

        // Active developers only (role=developer, membership_status=active, is_active=true)
        setActiveDevelopers(developerData.filter(u => u.membership_status === 'active' && u.is_active !== false));
        setDbDevelopers(developerData);
        setDbMentors(mentorData);
        setFounders(founderData);
        setDbHeads(headData);

        // Alumni & Inactive members (membership_status === 'alumni' || is_active === false)
        const inactiveOrAlumni = allUsersData.filter(u => u.membership_status === 'alumni' || u.is_active === false);
        setAlumniDevelopers(inactiveOrAlumni);
        setInactiveMembers(inactiveOrAlumni);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isLive) return;

    // Validate college email domain (@rbmi.in)
    const emailLower = (formData.email || "").trim().toLowerCase();
    const validDomains = ["@rbmi.in", "@sdc.edu"];
    if (!validDomains.some(domain => emailLower.endsWith(domain))) {
      alert("Please enter a valid college email ending with @rbmi.in (e.g. cs23satyam@rbmi.in).");
      return;
    }

    // Validate positive admission and passout years
    const admYear = Number(formData.admission_year);
    const passYear = Number(formData.passout_year);
    if (isNaN(admYear) || admYear <= 1990 || admYear > 2100) {
      alert("Please enter a valid positive admission year (e.g. 2023).");
      return;
    }
    if (isNaN(passYear) || passYear <= 1990 || passYear > 2100) {
      alert("Please enter a valid positive passout year (e.g. 2027).");
      return;
    }
    if (passYear < admYear) {
      alert("Passout year cannot be earlier than admission year.");
      return;
    }

    // Validate mobile number
    const cleanMobile = (formData.mobile_number || "").replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await applicationsAPI.create({ ...formData, email: emailLower });
      setSubmitSuccess(true);
      setTimeout(() => setIsFormOpen(false), 3000);
    } catch (e) {
      console.error(e);
      const detail = e.response?.data?.detail;
      const errorMsg = Array.isArray(detail) ? detail.map(d => d.msg).join('\n') : (detail || 'Failed to submit application.');
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyNowClick = () => {
    setIsFormOpen(true);
    const element = document.getElementById('application-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['About', 'Founders', 'Mentors', 'Alumni', 'Projects'];

  const handleNavClick = (link) => {
    const el = document.getElementById(link.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
        >
          {/* Glowing backgrounds */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-[#0066ff]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-[#00b4d8]/10 rounded-full blur-[60px] pointer-events-none animate-pulse"></div>

          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.1,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }
            }}
            className="relative max-w-[280px] md:max-w-[420px] px-6 select-none"
          >
            <img
              src="/rbmi_clean.png"
              alt="RBMI Logo"
              className="w-full h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,102,255,0.25)]"
            />
          </motion.div>

          {/* Premium Progress Bar */}
          <div className="w-[180px] md:w-[240px] h-[3px] bg-white/10 rounded-full mt-10 overflow-hidden relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute h-full left-0 top-0 bg-gradient-to-r from-[#00b4d8] to-blue-600 rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]"
            />
          </div>

          {/* Minimal Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 mt-4 select-none font-mono"
          >
            Initializing Portal
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#020617] w-full min-h-screen overflow-x-hidden font-sans text-white selection:bg-[#0066ff] selection:text-white"
        >

          {/* ===== NAVBAR ===== */}
          <nav className={`fixed w-full z-50 transition-all duration-500 flex flex-col items-center ${scrolled ? 'top-3' : 'top-4'}`}>
            {/* Main bar */}
            <div className={`w-[95%] max-w-7xl px-4 lg:px-6 py-3 flex items-center justify-between rounded-2xl md:rounded-full border transition-all duration-500 ${scrolled
              ? 'bg-[#020617]/80 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-[#020617]/40 backdrop-blur-md border-white/5 shadow-lg'
              }`}>

              {/* LEFT: Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                className="flex items-center cursor-pointer shrink-0"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img src={sdcLogo} alt="SDC Logo" className="h-9 md:h-10 w-auto object-contain" />
              </motion.div>

              {/* CENTER: Nav Links — desktop only */}
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
                className="flex items-center gap-3"
              >
                {/* Desktop login CTA */}
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

                {/* Mobile: login button (compact) */}
                <button
                  onClick={() => navigate('/login')}
                  className="md:hidden px-4 py-2 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-xs font-bold tracking-wider"
                >
                  Login
                </button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden flex flex-col gap-[5px] p-2 rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu"
                >
                  <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                  <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </button>
              </motion.div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ originY: 0 }}
                  className="md:hidden w-[95%] max-w-7xl mt-2 bg-[#0a1020]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-4 flex flex-col gap-1">
                    {navLinks.map(link => (
                      <button
                        key={link}
                        onClick={() => { handleNavClick(link); setMenuOpen(false); }}
                        className="text-white/70 text-sm font-medium hover:text-white hover:bg-white/5 transition-all text-left px-4 py-3 rounded-xl"
                      >
                        {link}
                      </button>
                    ))}
                    <div className="border-t border-white/5 mt-2 pt-3">
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-[#00b4d8] to-blue-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all"
                      >
                        Member Access →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>


          {/* ======= HERO SECTION ======= */}
          <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#020617] pt-28 pb-16">

            {/* Recruitment Alert Banner */}
            <AnimatePresence>
              {isLive && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-20 w-[92%] sm:w-[90%] max-w-2xl px-4 sm:px-6 py-2.5 sm:py-3 mb-8 sm:mb-12 rounded-2xl sm:rounded-full bg-gradient-to-r from-emerald-500/10 via-emerald-400/20 to-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center"
                >
                  <div className="flex items-center justify-center gap-2 shrink-0">
                    <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 font-bold text-[10px] sm:text-sm tracking-wide uppercase">Recruitment Live:</span>
                  </div>
                  <span className="text-white text-[11px] sm:text-sm font-medium leading-tight">Accepting applications for <strong className="text-emerald-300">{recruitmentTarget}</strong></span>
                  <button onClick={handleApplyNowClick} className="w-full sm:w-auto sm:ml-auto bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors mt-1 sm:mt-0 shrink-0">Apply Now</button>
                </motion.div>
              )}
            </AnimatePresence>

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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-[#00b4d8]/20 to-[#0066ff]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Floating Tech Symbols — hidden on mobile for cleaner look */}
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
                  className="hidden md:block absolute text-white/10 font-mono font-bold text-4xl select-none"
                  style={{ top: item.top, left: item.left, right: item.right }}
                >
                  {item.symbol}
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-4xl mx-auto w-full">

              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 border border-[#00b4d8]/30 bg-[#00b4d8]/10 px-3 py-1.5 rounded-full mb-6 max-w-full"
              >
                <span className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse shrink-0" />
                <span className="text-[#00b4d8] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] truncate">
                  Software Development Cell · Est. 2024
                </span>
              </motion.div>

              {/* Main headline */}
              <div className="overflow-hidden mb-1">
                <motion.h1
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black text-white leading-[1.1] tracking-tight drop-shadow-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  Smart steps toward
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-6 relative">
                <motion.h1
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black leading-[1.1] tracking-tight relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{
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
                className="text-white/50 text-sm sm:text-base font-light max-w-xl leading-relaxed mb-8 px-2"
              >
                Empowering students to bridge the gap between academia and industry.
                Join the official technical powerhouse of the institution.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-10 w-full px-2"
              >
                <button onClick={() => navigate('/login')}
                  className="relative overflow-hidden bg-gradient-to-r from-[#00b4d8] to-[#0066ff] text-white font-black text-[13px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,180,216,0.6)] group w-full sm:w-auto"
                >
                  <span className="relative z-10 drop-shadow-md">Initialize Access</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
                <button onClick={() => handleNavClick('Projects')} className="bg-white/5 border border-white/20 text-white font-semibold text-[13px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-[#00b4d8]/50 hover:text-[#00b4d8] backdrop-blur-md w-full sm:w-auto">
                  Explore Projects
                </button>
              </motion.div>

              {/* Bottom stats bar — glass pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.95, duration: 0.7, type: "spring", bounce: 0.4 }}
                className="w-full max-w-2xl bg-[#020617]/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-3 divide-x divide-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group"
              >
                {[
                  { value: totalMembers, label: 'Members' },
                  { value: totalProjects, label: 'Projects' },
                  { value: '2yr', label: 'Excellence' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 px-2 sm:px-4">
                    <span className="text-2xl sm:text-4xl font-black text-white tracking-tight group-hover:scale-110 transition-transform duration-500 ease-out">{value}</span>
                    <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold group-hover:text-[#00b4d8] transition-colors duration-300">{label}</span>
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


          {/* ======= 1.5 ABOUT SDC SECTION ======= */}
          <section id="about" className="py-32 px-6 lg:px-24 bg-[#0a192f]/20 border-y border-white/5 flex flex-col items-center justify-center min-h-[90vh] w-full relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
              <div className="text-center mb-24 flex flex-col items-center max-w-3xl">
                <span className="border border-white/20 text-[#00b4d8] px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold bg-[#00b4d8]/5">The Foundation</span>
                <h2 className="text-4xl md:text-5xl font-black mt-8 tracking-tight leading-tight text-center uppercase">About the Cell</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#00b4d8] to-blue-500 rounded-full mt-6 mb-6"></div>
                <p className="text-white/50 text-base md:text-lg font-light leading-relaxed">
                  Software Development Cell (SDC) is the official technical engineering powerhouse of the institution. We build production-ready software solutions while establishing strict professional software engineering culture.
                </p>
              </div>

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
              >
                {[
                  {
                    title: "Production Engineering",
                    desc: "We build enterprise-grade software to optimize cell and institution operations, keeping everything 100% database-driven.",
                    icon: "⚙️"
                  },
                  {
                    title: "Rigorous SDLC",
                    desc: "We model workflows according to industry standards, leveraging 7 stages of development and 16 mandatory software engineering documents.",
                    icon: "📋"
                  },
                  {
                    title: "Real-time Telemetry",
                    desc: "Task velocity, leaderboard score, and application reviews are monitored in real time, driving transparency and active contribution.",
                    icon: "⚡"
                  },
                  {
                    title: "Mentorship-Led",
                    desc: "Guided directly by senior institutional heads and industry-aligned alumni, fostering a growth-oriented community.",
                    icon: "🎓"
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx} variants={fadeInUp}
                    className="bg-white/[0.02] border border-white/10 hover:border-[#00b4d8]/30 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 backdrop-blur-md flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00b4d8]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-4xl mb-6">{feature.icon}</div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wide mb-3 group-hover:text-[#00b4d8] transition-colors">{feature.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>


          {/* 2. Heads of SDC */}
          {dbHeads.length > 0 && (
            <section className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                <div className="text-center mb-20 flex flex-col items-center">
                  <span className="border border-white/20 text-white/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium">The Visionaries</span>
                  <h2 className="text-5xl font-medium mt-8 tracking-tight leading-tight text-center">Heads of SDC</h2>
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full place-items-center">
                  {dbHeads.map(head => (
                    <ProfileCard
                      key={head.id}
                      id={head.id}
                      name={head.name}
                      role={head.role === 'head' ? 'Head of SDC' : head.role}
                      image={head.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                      linkedin={head.linkedin_url || "#"}
                      github={head.github_url || "#"}
                      projectsCount={head.projects_count}
                      onOpenPortfolio={(id) => setSelectedPortfolioUserId(id)}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* 3. Founders */}
          {founders.length > 0 && (
            <section id="founders" className="py-24 px-6 lg:px-24 bg-[#0a192f]/30 border-y border-white/5 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">
                <div className="text-center mb-20 flex flex-col items-center">
                  <span className="border border-white/20 text-white/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium">The Origin</span>
                  <h2 className="text-5xl font-medium mt-8 tracking-tight leading-tight text-center">Founders</h2>
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="flex flex-wrap justify-center gap-8 w-full">
                  {founders.map(founder => (
                    <ProfileCard
                      key={founder.id}
                      id={founder.id}
                      name={founder.name}
                      role="Founder"
                      image={founder.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
                      linkedin={founder.linkedin_url || "#"}
                      github={founder.github_url || "#"}
                      projectsCount={founder.projects_count}
                      onOpenPortfolio={(id) => setSelectedPortfolioUserId(id)}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* 4. Developers (Divisions) — Active & Alumni */}
          {activeDevelopers.length > 0 && (
            <section className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-20 flex flex-col items-center">
                  <span className="text-[#00e5ff] tracking-widest text-sm font-medium uppercase mb-4 block">The Engine</span>
                  <h2 className="text-5xl font-medium tracking-tight text-center">Developers</h2>
                </div>

                <div className="w-full mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Active Developers</span>
                  </div>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full place-items-center">
                    {activeDevelopers.map(dev => (
                      <ProfileCard
                        key={dev.id}
                        id={dev.id}
                        name={dev.name}
                        role={dev.role === 'developer' ? 'Active Developer' : dev.role}
                        image={dev.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
                        linkedin={dev.linkedin_url || "#"}
                        github={dev.github_url || "#"}
                        projectsCount={dev.projects_count}
                        onOpenPortfolio={(id) => setSelectedPortfolioUserId(id)}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Mentors */}
          {dbMentors.length > 0 && (
            <section id="mentors" className="py-24 px-6 lg:px-24 bg-[#0a192f]/30 border-y border-white/5 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-20 w-full">
                  <h2 className="text-5xl font-medium tracking-tight mb-4">Our Mentors</h2>
                  <p className="text-xl text-white/50 font-light mb-12">Guiding the next generation of engineers.</p>
                  <div className="flex gap-12 items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-4xl font-medium text-white">{dbMentors.length}</h4>
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
                  {dbMentors.map(mentor => (
                    <ProfileCard
                      key={mentor.id}
                      id={mentor.id}
                      name={mentor.name}
                      role="SDC Mentor"
                      image={mentor.profile_image || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"}
                      linkedin={mentor.linkedin_url || "#"}
                      projectsCount={mentor.projects_count}
                      onOpenPortfolio={(id) => setSelectedPortfolioUserId(id)}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* 6. Alumni */}
          {alumniDevelopers.length > 0 && (
            <section id="alumni" className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-20 flex flex-col items-center">
                  <span className="text-[#00e5ff] tracking-widest text-sm font-medium uppercase mb-4 block">The Legacy</span>
                  <h2 className="text-5xl font-medium tracking-tight text-center">Alumni & Non-Active Members</h2>
                </div>

                <div className="w-full mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Alumni & Non-Active Roster</span>
                  </div>
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full place-items-center">
                  {alumniDevelopers.map(dev => (
                    <ProfileCard
                      key={dev.id}
                      id={dev.id}
                      name={dev.name}
                      role={dev.membership_status === 'alumni' ? 'SDC Alumni' : 'Inactive Member'}
                      image={dev.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
                      linkedin={dev.linkedin_url || "#"}
                      github={dev.github_url || "#"}
                      projectsCount={dev.projects_count}
                      onOpenPortfolio={(id) => setSelectedPortfolioUserId(id)}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* 7. Projects */}
          {completedProjects.length > 0 && (
            <section id="projects" className="py-24 px-6 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <div className="text-center mb-20 flex flex-col items-center">
                  <span className="text-[#00e5ff] tracking-widest text-sm font-medium uppercase mb-4 block">Output</span>
                  <h2 className="text-5xl font-medium tracking-tight text-center">Flagship Projects</h2>
                </div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full place-items-center">
                  {completedProjects.map(p => (
                    <ProjectCard
                      key={p.id}
                      title={p.name}
                      desc={p.short_description || p.full_description || "Official flagship project developed by Software Development Cell members."}
                      image={p.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80"}
                      tags={[p.type ? p.type.replace('_', ' ') : "Web App"]}
                      link={p.live_url || "#"}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* 6. Recruitment Form */}

          {/* ===== MOBILE: Full-screen bottom-sheet modal (rendered at root level so overflow-hidden never clips it) ===== */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] md:hidden flex items-end justify-center"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                  onClick={() => setIsFormOpen(false)}
                />
                {/* Bottom Sheet */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="relative w-full max-h-[90vh] bg-white rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0 bg-white">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">Official Application</h3>
                      <p className="text-[10px] text-[#00b4d8] uppercase tracking-widest font-bold mt-0.5">SDC · Application 2026</p>
                    </div>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scrollable Form Body */}
                  <div className="overflow-y-auto flex-1 px-5 py-4">
                    {submitSuccess ? (
                      <div className="flex flex-col items-center justify-center text-center space-y-3 py-12">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">✓</div>
                        <h3 className="text-xl font-black text-slate-800">Application Received!</h3>
                        <p className="text-sm text-slate-500">Your application has been securely routed to the Operations Center.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleApply} className="space-y-4 pb-8">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name *</label>
                          <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">University Email *</label>
                          <input required type="email" placeholder="name@university.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mobile Number *</label>
                          <input required type="tel" placeholder="+91 99999 99999" value={formData.mobile_number} onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Branch *</label>
                            <select required value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent cursor-pointer">
                              <option value="" disabled>Select...</option>
                              <option value="Web Development">Web Dev</option>
                              <option value="Mobile App Development">Mobile Dev</option>
                              <option value="Artificial Intelligence">AI / ML</option>
                              <option value="Cybersecurity">Cybersecurity</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Semester *</label>
                            <select required value={formData.current_semester} onChange={e => setFormData({ ...formData, current_semester: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent cursor-pointer">
                              <option value="" disabled>Select...</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={`Semester ${s}`}>Sem {s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Admission Year *</label>
                            <input required type="number" value={formData.admission_year} onChange={e => setFormData({ ...formData, admission_year: parseInt(e.target.value) })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Passout Year *</label>
                            <input required type="number" value={formData.passout_year} onChange={e => setFormData({ ...formData, passout_year: parseInt(e.target.value) })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Technical Specialization *</label>
                          <input required type="text" placeholder="Frontend, Backend, Design..." value={formData.technical_specialization} onChange={e => setFormData({ ...formData, technical_specialization: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">LinkedIn URL</label>
                          <input type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">GitHub URL</label>
                          <input type="url" placeholder="https://github.com/..." value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Additional Info</label>
                          <textarea placeholder="Tell us about yourself..." value={formData.additional_information} onChange={e => setFormData({ ...formData, additional_information: e.target.value })} className="w-full border-b-2 border-gray-200 py-2.5 text-gray-900 text-sm placeholder:text-slate-300 focus:outline-none focus:border-[#00b4d8] transition-colors bg-transparent resize-none" rows="2" />
                        </div>
                        <div className="pt-3">
                          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#00b4d8] to-blue-600 text-white font-bold tracking-widest uppercase text-xs py-4 rounded-2xl hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] transition-all disabled:opacity-50">
                            {isSubmitting ? 'Transmitting...' : 'Submit Application'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <section id="application-section" className="py-20 md:py-40 px-5 lg:px-24 relative flex justify-center">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#00b4d8] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            {/* ===== DESKTOP: Original slide-out animation ===== */}
            <div className="w-full max-w-5xl relative min-h-[550px] hidden md:flex items-center justify-center">

              {/* The Envelope / Folder Cover */}
              <motion.div
                initial={{ x: "0%", scale: 1, zIndex: 20 }}
                animate={isFormOpen ? { x: "-20%", scale: 0.9, zIndex: 10 } : { x: "0%", scale: 1, zIndex: 20 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute w-full md:w-[55%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[3rem]"
              >
                <div className="bg-[#1c222b] border border-white/10 rounded-[3rem] p-16 relative overflow-hidden">
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
                      onClick={() => { if (isLive) setIsFormOpen(!isFormOpen); }}
                      disabled={!isLive}
                      className={`group flex items-center gap-4 px-8 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${isLive ? 'bg-gradient-to-r from-[#00b4d8] to-[#2a9d8f] hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] hover:scale-105 cursor-pointer' : 'bg-gray-600/50 cursor-not-allowed opacity-50'}`}
                    >
                      {!isLive ? 'Recruitment Closed' : (isFormOpen ? 'Close Envelope' : 'Extract Form')}
                      {isLive && (
                        <span className={`transition-transform duration-500 ${isFormOpen ? '-rotate-180' : 'group-hover:translate-x-2'}`}>&rarr;</span>
                      )}
                    </button>
                  </div>
                  <div className="absolute top-0 right-10 w-24 h-4 bg-[#00b4d8]/20 rounded-b-xl border-b border-x border-[#00b4d8]/50"></div>
                </div>
              </motion.div>

              {/* The Form Document — slides out to the right */}
              <motion.div
                initial={{ x: "0%", scale: 0.9, zIndex: 10, opacity: 0 }}
                animate={isFormOpen ?
                  { x: ["0%", "85%", "35%"], scale: [0.9, 1, 1.05], zIndex: [10, 10, 30], opacity: [0, 1, 1] }
                  : { x: "0%", scale: 0.9, zIndex: 10, opacity: 0 }
                }
                transition={isFormOpen ? { duration: 1.5, times: [0, 0.6, 1], ease: "easeInOut" } : { duration: 0.8, ease: "easeInOut" }}
                className={`absolute w-full md:w-[45%] ${!isFormOpen ? 'pointer-events-none' : ''}`}
              >
                <div className="bg-[#f8f9fa] border border-gray-300 rounded-[3rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute top-0 right-10 w-16 h-8 bg-[#e63946] text-white text-[8px] font-bold flex items-center justify-center uppercase tracking-widest shadow-md">
                    Strictly<br />Confidential
                  </div>
                  {submitSuccess ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4">✓</div>
                      <h3 className="text-2xl font-black text-slate-800">Application Received</h3>
                      <p className="text-sm text-slate-500 font-medium">Your application has been securely routed to the Operations Center.</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-8 border-b-2 border-black/10 pb-4 inline-block">Official Application</h3>
                      <form onSubmit={handleApply} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Full Legal Name</label>
                          <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">University Email</label>
                            <input required type="email" placeholder="john@university.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Mobile Number</label>
                            <input required type="tel" placeholder="+91 99999 99999" value={formData.mobile_number} onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Primary Division</label>
                            <select required value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none cursor-pointer">
                              <option value="" disabled>Select Assignment...</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Mobile App Development">Mobile App Development</option>
                              <option value="Artificial Intelligence">Artificial Intelligence</option>
                              <option value="Cybersecurity">Cybersecurity</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Current Semester</label>
                            <select required value={formData.current_semester} onChange={e => setFormData({ ...formData, current_semester: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none cursor-pointer">
                              <option value="" disabled>Select Semester...</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Admission Yr</label>
                            <input required type="number" value={formData.admission_year} onChange={e => setFormData({ ...formData, admission_year: parseInt(e.target.value) })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Passout Yr</label>
                            <input required type="number" value={formData.passout_year} onChange={e => setFormData({ ...formData, passout_year: parseInt(e.target.value) })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Technical Specialization</label>
                          <input required type="text" placeholder="Frontend, Backend, Design, DevOps..." value={formData.technical_specialization} onChange={e => setFormData({ ...formData, technical_specialization: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">LinkedIn Profile URL</label>
                            <input type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                          <div>
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">GitHub Profile URL</label>
                            <input type="url" placeholder="https://github.com/..." value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 block">Additional Information (Optional)</label>
                          <textarea placeholder="Tell us more about your projects, skills, etc..." value={formData.additional_information} onChange={e => setFormData({ ...formData, additional_information: e.target.value })} className="w-full bg-transparent border-b-2 border-gray-300 py-2 text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00b4d8] transition-colors rounded-none resize-none" rows="2" />
                        </div>
                        <div className="pt-6">
                          <button type="submit" disabled={isSubmitting} className="w-full bg-[#1c222b] text-white font-bold tracking-widest uppercase text-xs py-4 rounded-full hover:bg-black transition-colors hover:shadow-xl disabled:opacity-50">
                            {isSubmitting ? 'Transmitting...' : 'Submit to Records'}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                  <div className="absolute bottom-6 left-12 w-[80%] h-[1px] bg-black/5"></div>
                  <div className="absolute bottom-8 left-12 w-[60%] h-[1px] bg-black/5"></div>
                </div>
              </motion.div>
            </div>

            {/* ===== MOBILE: Envelope card (button only) ===== */}
            <div className="md:hidden w-full max-w-xl">
              <div className="bg-[#1c222b] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00b4d8] blur-[80px] opacity-20 rounded-full"></div>
                <div className="relative z-10">
                  <span className="text-[#00b4d8] font-mono uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Application 2026</span>
                  <h2 className="text-3xl font-extrabold tracking-tight leading-[1.15] mb-4 text-white">
                    Ready to<br /><span className="text-white/60">Take Control?</span>
                  </h2>
                  <p className="text-white/40 text-sm mb-8 leading-relaxed">
                    Become an official member of the Software Development Cell. Gain access to exclusive repositories, mentorship, and flagship projects.
                  </p>
                  <button
                    onClick={() => { if (isLive) setIsFormOpen(!isFormOpen); }}
                    disabled={!isLive}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all ${isLive ? 'bg-gradient-to-r from-[#00b4d8] to-[#2a9d8f] hover:shadow-[0_0_30px_rgba(0,180,216,0.5)] cursor-pointer' : 'bg-gray-600/50 cursor-not-allowed opacity-50'}`}
                  >
                    {!isLive ? 'Recruitment Closed' : 'Apply Now →'}
                  </button>
                </div>
                <div className="absolute top-0 right-8 w-20 h-3 bg-[#00b4d8]/20 rounded-b-lg border-b border-x border-[#00b4d8]/50"></div>
              </div>
            </div>

          </section>

          {/* ======= FOOTER ======= */}
          <footer className="bg-[#050b18] border-t border-white/5 py-12 px-6 lg:px-24 w-full text-white/50 text-xs font-medium">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-3">
                  <img src={sdcLogo} alt="SDC Logo" className="h-8 w-auto opacity-80" />
                  <span className="text-white font-extrabold text-sm uppercase tracking-widest">Software Development Cell</span>
                </div>
                <p className="mt-1 text-white/30 text-center md:text-left">Smart steps toward technical mastery.</p>
              </div>

              <div className="flex flex-wrap gap-8 justify-center uppercase tracking-widest text-[10px] font-bold">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => handleNavClick(link)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {link}
                  </button>
                ))}
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">Portal Access</button>
              </div>

              <div className="text-center md:text-right text-white/30">
                <p>© {new Date().getFullYear()} Software Development Cell. All rights reserved.</p>
                <p className="mt-1 font-mono text-[9px]">Designed & engineered by SDC Developers.</p>
              </div>
            </div>
          </footer>

          {/* Developer Portfolio Showcase Modal */}
          {selectedPortfolioUserId && (
            <MemberPortfolioModal
              userId={selectedPortfolioUserId}
              onClose={() => setSelectedPortfolioUserId(null)}
            />
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useRef, useState } from 'react';

/* ════════════════════════════════════════════════════════════
   SDC PORTAL — ENHANCED LANDING PAGE
   Stitch "Obsidian Nexus" Design System
   Toxic Green #00ff41 + Electric Cyan #00e3fd on #0a0a0b
════════════════════════════════════════════════════════════ */

const IMG = {
  heroBg:      'https://lh3.googleusercontent.com/aida/ADBb0uiZoKLogJ3UzL29dPoRevkjSmBO1cWruQ-axaBu7jcgmMQ3pIVJHa65Y03hwnJNptV9zg8ftzdYFH-wLYdZ1yYpWNB0WNmKd8cmdJiXzSp8aOl53rx1yFQzMZ_7J6j2JhT7CGvdgQpLbn8voZzE0sW5wX7z0r2-cykiNwnBoEx3avOdE20UpWPMS8KbgQfQwoQRjDHQz4r1AQyhksBMibkVDdss9SkoXn0qTzwTHQWkRl27GHcfdQ8Wj00',
  warrior:     'https://lh3.googleusercontent.com/aida/ADBb0ugklWcpNxhNGUWSHJSPrxWEPM1eY9yzKpU5IeMiOhfeArStwTPgdzT_0u5pfsh9wn_OKnHAfz46NBrSMRUh4OVQe66TnXukI6X9uKSky4HgGZW1UhPgThFrJRsKMFeJdDHTNMWOgBN61uLkUUAy-G3zNPDU7AFXe4I42zH_IGuUxaXz_GLKPcI3JJ7cV7H0YJsZJ6DHXZ2SU_SOKwYjms7zVelsfdKc0n58HPvC9kcaR81eU_a1nH3RufE',
  infiltrator: 'https://lh3.googleusercontent.com/aida/ADBb0ug2yRrz1Au1g42r94BB3bcJ7bmq7bhAJbwQJOW82ScnGvfTKxKY6ThUViBIQIfspUsSQqbfIBsJLu0GRX1xtMgLjewEhw6g30qocqUSOCC1dEdw630fSlSvLkV3Xzim8Tmc_BTdCWSWi0_Uoc0HoVK4zdAf_8dAfbUyeeAI0o40wDta5hf-gHYSiNlzIbbqds4gnxNEmnpTrVM1Ox5Qn9L43PXEQ3WJoFlRTI5ZW979TF0Z6N_7QhrYZHI',
  droid:       'https://lh3.googleusercontent.com/aida/ADBb0uhpw3MXNE7JYjpL2RBGjmu0qWycXcdpwqm9YdRbh1nvCkN5hrMoH9b2x1M5ANSUW7uFstPloiSEoGau3Ag9X1wuvdWf9CRA6iVI-5XLWWCZVEioRYOKS4eh3AZ_7RYNSDDMjb88CbSXDPI_ndWfAZf6KRIzC_OVa3F4SqBsbe76d3obb33qesEsVLg9WjZoxXwe4SS28OSaQNXiMjVA09cXRVSkosOdP6j-8_LYrr3q2NuTuY0n_j31rpiJ1cHXPI4GtlSYw',
  jungle:      'https://lh3.googleusercontent.com/aida/ADBb0uhu3vmFpAUVVBbTnhA8Rb8D5sSuxwn5mLkgOKL23TmBYjK7M86_JfFuUwKgZePMZR6ruVczyMnuMd8kgmuFQ_ixYEoFIpckvKCna0eYIO9gPTmNTkvfBdBtxsRFLzdog2cyfufBkuXhaIfAzr_2t89Kk_znKkPBd2H3B4EUuSl2cEDn8GCzk8sdJxdH7Ywet0fUn3JIG3JyNiMVqKFFz6C5RKadElV-6gB1f-eWt9hEQ6BNQrqWYkC2HWE',
};

const founders = [
  {
    name: "Prof. Arvind Sharma",
    role: "FACULTY ADVISOR",
    dept: "CSE Department \u00b7 Professor",
    quote: "Engineering tomorrow\u2019s solutions, today.",
    color: "#00ff41",
    glow: "rgba(0,255,65,0.18)",
    img: IMG.warrior,
    spec: "Distributed Systems & AI",
    year: "Est. 2022",
    initials: "AS",
  },
  {
    name: "Rohan Verma",
    role: "FOUNDING PRESIDENT",
    dept: "CSE \u00b7 Batch of 2024",
    quote: "Code is the weapon of the future.",
    color: "#00e3fd",
    glow: "rgba(0,227,253,0.18)",
    img: IMG.infiltrator,
    spec: "Full Stack & DevOps",
    year: "Batch 2024",
    initials: "RV",
  },
  {
    name: "Priya Nair",
    role: "FOUNDING TECH LEAD",
    dept: "CSE \u00b7 Batch of 2024",
    quote: "Design speaks before words can.",
    color: "#ffb2b8",
    glow: "rgba(255,178,184,0.18)",
    img: IMG.droid,
    spec: "UI/UX & Systems Design",
    year: "Batch 2024",
    initials: "PN",
  },
];

const alumni = [
  { name: "Arjun Mehta",    batch: "2023", stack: ["React","Node.js","AWS"],        role: "FULL STACK",  color: "#00ff41", company: "Google",    initials: "AM" },
  { name: "Sneha Kapoor",   batch: "2023", stack: ["Flutter","Firebase","Dart"],    role: "MOBILE DEV",  color: "#00e3fd", company: "Flipkart",  initials: "SK" },
  { name: "Dev Rathore",    batch: "2022", stack: ["Python","ML","TensorFlow"],     role: "AI / ML",     color: "#ffb2b8", company: "Microsoft", initials: "DR" },
  { name: "Anika Singh",    batch: "2023", stack: ["Figma","CSS","React"],          role: "UI / UX",     color: "#00ff41", company: "Razorpay",  initials: "AS" },
  { name: "Karan Joshi",    batch: "2022", stack: ["Docker","K8s","CI/CD"],         role: "DEVOPS",      color: "#00e3fd", company: "Swiggy",    initials: "KJ" },
  { name: "Meghna Iyer",    batch: "2024", stack: ["MySQL","Redis","PostgreSQL"],   role: "DATABASE",    color: "#ffb2b8", company: "PhonePe",   initials: "MI" },
];

const projects = [
  { name: "SDC Portal",      desc: "Central hub for all SDC activities, member management and project tracking.",       tech: ["React","FastAPI","MySQL"],       status: "LIVE",   color: "#00ff41" },
  { name: "CollegeConnect",  desc: "Campus social platform for events, notice boards, and academic resources.",          tech: ["Next.js","MongoDB","Redis"],     status: "IN DEV", color: "#00e3fd" },
  { name: "AutoGrade AI",    desc: "ML-powered assignment grading assistant built for faculty use.",                     tech: ["Python","TensorFlow","FastAPI"], status: "BETA",   color: "#ffb2b8" },
  { name: "CampusMap AR",    desc: "Augmented reality campus navigation app for new students.",                          tech: ["Flutter","ARCore","Firebase"],   status: "IN DEV", color: "#00ff41" },
  { name: "OpenLib",         desc: "Digital library management with QR-based borrowing system.",                         tech: ["React","Node.js","PostgreSQL"],  status: "LIVE",   color: "#00e3fd" },
  { name: "HackTrack",       desc: "Hackathon management and intelligent team formation platform.",                      tech: ["Vue.js","Supabase","Tailwind"],  status: "LIVE",   color: "#ffb2b8" },
];

/* ── Shared style helpers ─────────────────────────────────── */
const mono = "'JetBrains Mono', monospace";
const display = "'Sora', sans-serif";
const body = "'Inter', sans-serif";

const glass = (opacity = 0.55, border = "rgba(0,255,65,0.12)"): React.CSSProperties => ({
  background: `rgba(18,18,20,${opacity})`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${border}`,
});

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */
const LandingPage: React.FC = () => {
  const heroBgRef  = useRef<HTMLImageElement>(null);
  const [scrollY,  setScrollY]  = useState(0);
  const [activeSection, setActive] = useState("home");

  /* parallax bg */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!heroBgRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      heroBgRef.current.style.transform = `scale(1.1) translate(${x}px,${y}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active section */
  useEffect(() => {
    const ids = ["home","about","founders","alumni","projects","join"];
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const navScrolled = scrollY > 60;

  return (
    <div style={{ background: "#0a0a0b", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>

      {/* ── Film grain ── */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", opacity: 0.022, pointerEvents: "none", zIndex: 9999 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)", pointerEvents: "none", zIndex: 9998 }} />

      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <SDCNavbar scrolled={navScrolled} active={activeSection} onNav={scrollTo} />

      {/* ══ HERO ════════════════════════════════════════════ */}
      <HeroSection heroBgRef={heroBgRef} onNav={scrollTo} />

      {/* ══ ABOUT ═══════════════════════════════════════════ */}
      <AboutSection />

      {/* ══ FOUNDERS ════════════════════════════════════════ */}
      <FoundersSection />

      {/* ══ ALUMNI ══════════════════════════════════════════ */}
      <AlumniSection />

      {/* ══ PROJECTS ════════════════════════════════════════ */}
      <ProjectsSection />

      {/* ══ JOIN FORM ════════════════════════════════════════ */}
      <JoinSection />

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <SDCFooter onNav={scrollTo} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════ */
interface NavProps { scrolled: boolean; active: string; onNav: (id: string) => void; }

const SDCNavbar: React.FC<NavProps> = ({ scrolled, active, onNav }) => {
  const links = [
    { id: "about",    label: "ABOUT"    },
    { id: "projects", label: "PROJECTS" },
    { id: "founders", label: "FOUNDERS" },
    { id: "alumni",   label: "ALUMNI"   },
    { id: "join",     label: "JOIN"     },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
      height: "70px",
      background: scrolled ? "rgba(10,10,11,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,255,65,0.1)" : "1px solid transparent",
      boxShadow: scrolled ? "0 0 40px rgba(0,0,0,0.7)" : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 64px",
      transition: "all 0.35s ease",
    }}>
      {/* Logo */}
      <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: "14px", background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ position: "relative", width: "38px", height: "38px", flexShrink: 0 }}>
          <svg viewBox="0 0 38 38" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "rotate-slow 14s linear infinite" }}>
            <circle cx="19" cy="19" r="17" fill="none" stroke="#00ff41" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />
          </svg>
          <div style={{ position: "absolute", inset: "7px", background: "linear-gradient(135deg, #00ff41, #00e3fd)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(0,255,65,0.6)" }}>
            <span style={{ fontFamily: mono, fontSize: "0.58rem", fontWeight: 700, color: "#003907", letterSpacing: "0.05em" }}>SDC</span>
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: display, fontSize: "0.95rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>SDC</div>
          <div style={{ fontFamily: mono, fontSize: "0.48rem", color: "#84967e", letterSpacing: "0.14em", marginTop: "2px" }}>PORTAL // v1.0</div>
        </div>
      </button>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {links.map((l) => (
          <button key={l.id} onClick={() => onNav(l.id)}
            style={{
              fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
              color: active === l.id ? "#00ff41" : "#6b7e67",
              background: active === l.id ? "rgba(0,255,65,0.07)" : "transparent",
              border: active === l.id ? "1px solid rgba(0,255,65,0.2)" : "1px solid transparent",
              padding: "7px 14px", cursor: "pointer",
              textShadow: active === l.id ? "0 0 10px rgba(0,255,65,0.5)" : "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (active !== l.id) (e.currentTarget as HTMLElement).style.color = "#c5d9c0"; }}
            onMouseLeave={e => { if (active !== l.id) (e.currentTarget as HTMLElement).style.color = "#6b7e67"; }}
          >{l.label}</button>
        ))}
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={() => window.location.href = "/login"}
          style={{
            fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
            color: "#c5d9c0", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(197,217,192,0.2)", padding: "8px 20px", cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.4)"; el.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#c5d9c0"; el.style.borderColor = "rgba(197,217,192,0.2)"; el.style.background = "rgba(255,255,255,0.04)"; }}
        >LOGIN</button>
        <button onClick={() => window.location.href = "/register"}
          style={{
            fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
            color: "#003907", background: "linear-gradient(135deg, #00ff41, #00e639)",
            border: "none", padding: "9px 22px", cursor: "pointer",
            boxShadow: "0 0 18px rgba(0,255,65,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.05)"; el.style.boxShadow = "0 0 28px rgba(0,255,65,0.6)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1)"; el.style.boxShadow = "0 0 18px rgba(0,255,65,0.35)"; }}
        >REGISTER</button>
      </div>
    </nav>
  );
};

/* ══════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════ */
const HeroSection: React.FC<{ heroBgRef: React.RefObject<HTMLImageElement>; onNav: (id: string) => void }> = ({ heroBgRef, onNav }) => (
  <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
    {/* BG image */}
    <img ref={heroBgRef} src={IMG.heroBg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1)", transition: "transform 0.08s linear", zIndex: 0 }} />
    {/* Overlays */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,10,11,0.97) 42%, rgba(10,10,11,0.65) 70%, rgba(10,10,11,0.35) 100%)", zIndex: 1 }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,11,0.98) 0%, transparent 55%)", zIndex: 1 }} />
    {/* Grid dots */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(0,255,65,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px", zIndex: 1, pointerEvents: "none" }} />
    {/* Scanline */}
    <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "2px", background: "linear-gradient(to right, transparent, rgba(0,255,65,0.1), transparent)", position: "absolute", animation: "scanline 8s linear infinite" }} />
    </div>

    {/* HUD corner brackets */}
    {[
      { top: "88px", left: "52px" },
      { top: "88px", right: "52px" },
      { bottom: "48px", left: "52px" },
      { bottom: "48px", right: "52px" },
    ].map((pos, i) => (
      <div key={i} style={{ position: "absolute", ...pos, zIndex: 4, color: "rgba(0,255,65,0.35)", pointerEvents: "none" }}>
        <div className={["hud-tl","hud-tr","hud-bl","hud-br"][i]} />
      </div>
    ))}

    {/* Top HUD status line */}
    <div style={{ position: "absolute", top: "90px", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", alignItems: "center", gap: "16px", fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(132,150,126,0.6)", pointerEvents: "none", whiteSpace: "nowrap" }}>
      <span>SYS // ONLINE</span>
      <span style={{ color: "rgba(0,255,65,0.4)" }}>•</span>
      <span>SDC_PORTAL_v1.0</span>
      <span style={{ color: "rgba(0,255,65,0.4)" }}>•</span>
      <span>NODE: CSE_SANCTUARY_01</span>
    </div>

    {/* Hero content */}
    <div style={{ position: "relative", zIndex: 10, padding: "0 64px", maxWidth: "800px", paddingTop: "80px" }}>
      {/* Online badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff41", boxShadow: "0 0 10px #00ff41, 0 0 20px rgba(0,255,65,0.4)", animation: "pulse-glow 2s infinite" }} />
        <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.22em", color: "#00ff41", fontWeight: 700 }}>
          SYSTEM ONLINE — ACCEPTING RECRUITS
        </span>
      </div>

      {/* Big headline */}
      <div style={{ marginBottom: "28px", lineHeight: 1 }}>
        <div style={{ fontFamily: display, fontSize: "clamp(3rem, 6.5vw, 5.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: "4px" }}>
          SOFTWARE
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: display, fontSize: "clamp(3rem, 6.5vw, 5.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#00ff41", textShadow: "0 0 40px rgba(0,255,65,0.45), 0 0 80px rgba(0,255,65,0.15)", marginBottom: "4px" }}>
            DEVELOPMENT
          </div>
          {/* Underline accent */}
          <div style={{ position: "absolute", bottom: "8px", left: 0, right: 0, height: "2px", background: "linear-gradient(to right, #00ff41, #00e3fd, transparent)", opacity: 0.6 }} />
        </div>
        <div style={{ fontFamily: display, fontSize: "clamp(3rem, 6.5vw, 5.8rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff" }}>
          CELL
        </div>
      </div>

      <p style={{ fontFamily: body, fontSize: "1.05rem", lineHeight: 1.75, color: "#8fa889", maxWidth: "510px", marginBottom: "44px" }}>
        The elite engineering guild of our institution. We build, ship, and deploy real-world software — from web platforms to ML systems. Open to all who dare to create.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "0", marginBottom: "48px", borderTop: "1px solid rgba(0,255,65,0.1)", borderBottom: "1px solid rgba(0,255,65,0.1)", padding: "20px 0" }}>
        {[
          { val: "50+",   lbl: "ACTIVE DEVS" },
          { val: "20+",   lbl: "PROJECTS"    },
          { val: "3 YRS", lbl: "RUNNING"     },
          { val: "100%",  lbl: "OPEN SOURCE" },
        ].map((s, i) => (
          <div key={s.lbl} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", paddingRight: "24px", borderRight: i < 3 ? "1px solid rgba(0,255,65,0.08)" : "none", paddingLeft: i > 0 ? "24px" : 0 }}>
            <span style={{ fontFamily: display, fontSize: "1.85rem", fontWeight: 800, color: "#00ff41", textShadow: "0 0 15px rgba(0,255,65,0.35)", letterSpacing: "-0.02em" }}>{s.val}</span>
            <span style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: "#4a5e47", fontWeight: 700 }}>{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <button onClick={() => onNav("projects")}
          style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", background: "#00ff41", color: "#003907", padding: "15px 34px", border: "none", cursor: "pointer", boxShadow: "0 0 24px rgba(0,255,65,0.45)", transition: "all 0.2s" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px) scale(1.03)"; el.style.boxShadow = "0 8px 32px rgba(0,255,65,0.55)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0) scale(1)"; el.style.boxShadow = "0 0 24px rgba(0,255,65,0.45)"; }}
        >[E] VIEW PROJECTS</button>

        <button onClick={() => onNav("join")}
          style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", background: "transparent", color: "#00e3fd", padding: "15px 34px", border: "1px solid rgba(0,227,253,0.35)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(0,227,253,0.08)"; el.style.borderColor = "#00e3fd"; el.style.boxShadow = "0 0 18px rgba(0,218,243,0.2)"; el.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "rgba(0,227,253,0.35)"; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
        >JOIN SDC</button>

        <button onClick={() => onNav("about")}
          style={{ fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", background: "transparent", color: "#4a5e47", padding: "15px 34px", border: "1px solid rgba(74,94,71,0.3)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#8fa889"; el.style.borderColor = "rgba(143,168,137,0.4)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#4a5e47"; el.style.borderColor = "rgba(74,94,71,0.3)"; }}
        >LEARN MORE</button>
      </div>
    </div>

    {/* Character fade-in right */}
    <div style={{ position: "absolute", right: 0, bottom: 0, width: "44%", height: "90%", zIndex: 5, pointerEvents: "none",
      maskImage: "linear-gradient(to right, transparent 0%, black 30%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)" }}>
      <img src={IMG.warrior} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", opacity: 0.65 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(10,10,11,0.95) 100%)" }} />
    </div>

    {/* Scroll indicator */}
    <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <span style={{ fontFamily: mono, fontSize: "0.52rem", letterSpacing: "0.22em", color: "#3b4b37" }}>SCROLL</span>
      <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, #00ff41, transparent)", animation: "pulse-glow 2s infinite" }} />
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════
   ABOUT SECTION
══════════════════════════════════════════════════════════ */
const AboutSection: React.FC = () => (
  <section id="about" style={{ padding: "110px 64px", background: "linear-gradient(180deg, #0a0a0b 0%, #111113 100%)", position: "relative", overflow: "hidden" }}>
    <SectionDivider color="rgba(0,255,65,0.12)" label="SECTION::ABOUT // ID_02" />

    {/* Ambient glow blobs */}
    <div style={{ position: "absolute", top: "20%", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div style={{ maxWidth: "1160px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
      {/* Image collage left */}
      <div style={{ position: "relative", height: "500px" }}>
        {/* Main image */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "70%", height: "320px", overflow: "hidden", border: "1px solid rgba(0,255,65,0.15)" }}>
          <img src={IMG.jungle} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.5) brightness(0.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,255,65,0.08) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", top: "12px", left: "12px", color: "rgba(0,255,65,0.4)" }}><div className="hud-tl" /></div>
          <div style={{ position: "absolute", bottom: "12px", right: "12px", color: "rgba(0,255,65,0.4)" }}><div className="hud-br" /></div>
        </div>

        {/* Floating glass card */}
        <div style={{ position: "absolute", bottom: "20px", right: 0, width: "66%", ...glass(0.6, "rgba(0,227,253,0.2)"), padding: "24px" }}>
          <div style={{ color: "rgba(0,227,253,0.5)", marginBottom: "10px" }}><div className="hud-tl" /></div>
          <div style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.15em", color: "#00e3fd", marginBottom: "10px", fontWeight: 700 }}>MISSION_STATEMENT</div>
          <p style={{ fontFamily: body, fontSize: "0.88rem", lineHeight: 1.65, color: "#8fa889", marginBottom: "16px" }}>
            &ldquo;To build tomorrow&rsquo;s engineers by building today&rsquo;s products.&rdquo;
          </p>
          {/* Segmented bar */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <div key={i} style={{ width: "14px", height: "6px", background: i <= 8 ? "#00e3fd" : "rgba(0,218,243,0.15)", boxShadow: i <= 8 ? "0 0 6px rgba(0,218,243,0.6)" : "none" }} />
            ))}
            <span style={{ fontFamily: mono, fontSize: "0.52rem", color: "#00e3fd", marginLeft: "8px", letterSpacing: "0.1em" }}>80%</span>
          </div>
        </div>

        {/* Small stat bubble */}
        <div style={{ position: "absolute", top: "200px", right: "10px", ...glass(0.8, "rgba(0,255,65,0.2)"), padding: "14px 18px", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: "1.5rem", fontWeight: 800, color: "#00ff41", textShadow: "0 0 12px rgba(0,255,65,0.4)" }}>3+</div>
          <div style={{ fontFamily: mono, fontSize: "0.5rem", color: "#4a5e47", letterSpacing: "0.14em", marginTop: "3px" }}>YEARS</div>
        </div>
      </div>

      {/* Text right */}
      <div>
        <SectionTag color="#00ff41" line>ABOUT // SDC</SectionTag>
        <h2 style={{ fontFamily: display, fontSize: "clamp(2rem, 3.2vw, 2.8rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: "20px", lineHeight: 1.1 }}>
          We Are The<br />
          <span style={{ color: "#00ff41", textShadow: "0 0 24px rgba(0,255,65,0.3)" }}>Engineering Vanguard</span>
        </h2>
        <p style={{ fontFamily: body, fontSize: "0.95rem", lineHeight: 1.8, color: "#8fa889", marginBottom: "18px" }}>
          The Software Development Cell (SDC) is the premier technical club of our college&rsquo;s Computer Science department. Founded to bridge the gap between classroom theory and real-world engineering, SDC is where passion meets execution.
        </p>
        <p style={{ fontFamily: body, fontSize: "0.92rem", lineHeight: 1.8, color: "#5a6e57", marginBottom: "36px" }}>
          From web platforms to ML pipelines — our members build and deploy real products, all open-source and production-grade.
        </p>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { icon: "⚡", title: "Workshops", desc: "Weekly technical sessions & hackathons" },
            { icon: "🚀", title: "Real Products", desc: "Deployed apps used by thousands" },
            { icon: "🔗", title: "Mentorship", desc: "Industry network & internship pipeline" },
            { icon: "🧠", title: "Open Source", desc: "All code public, contributions welcome" },
          ].map((f) => (
            <div key={f.title} style={{ ...glass(0.4, "rgba(0,255,65,0.08)"), padding: "16px", display: "flex", gap: "12px", alignItems: "flex-start", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,65,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,255,65,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,65,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(18,18,20,0.4)"; }}
            >
              <div style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: display, fontSize: "0.85rem", fontWeight: 700, color: "#e5e2e3", marginBottom: "3px" }}>{f.title}</div>
                <div style={{ fontFamily: body, fontSize: "0.78rem", color: "#5a6e57", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════
   FOUNDERS SECTION
══════════════════════════════════════════════════════════ */
const FoundersSection: React.FC = () => (
  <section id="founders" style={{ padding: "110px 64px", background: "#0d0d0f", position: "relative", overflow: "hidden" }}>
    <SectionDivider color="rgba(0,255,65,0.1)" label="SECTION::FOUNDERS // ID_03" />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(0,255,65,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
      <SectionHeader
        tag="FOUNDING ARCHITECTS"
        tagColor="#00ff41"
        title="Founders of SDC"
        subtitle="The visionaries who assembled the first squad and set the mission."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        {founders.map((f) => <FounderCard key={f.name} f={f} />)}
      </div>
    </div>
  </section>
);

const FounderCard: React.FC<{ f: typeof founders[0] }> = ({ f }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        background: hov ? "rgba(22,22,24,0.98)" : "rgba(16,16,18,0.7)",
        border: `1px solid ${hov ? f.color + "45" : "rgba(59,75,55,0.35)"}`,
        padding: "32px 28px",
        boxShadow: hov ? `0 24px 48px rgba(0,0,0,0.6), 0 0 24px ${f.glow}` : "none",
        transform: hov ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>

      {/* Background character silhouette */}
      <div style={{ position: "absolute", right: "-24px", bottom: 0, width: "180px", height: "220px", opacity: hov ? 0.1 : 0.05, transition: "opacity 0.3s", pointerEvents: "none" }}>
        <img src={f.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>

      {/* Top glow line on hover */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${f.color}60, transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />

      {/* HUD brackets */}
      <div style={{ position: "absolute", top: "12px", left: "12px", color: f.color, opacity: hov ? 0.8 : 0.3, transition: "opacity 0.2s" }}><div className="hud-tl" /></div>
      <div style={{ position: "absolute", bottom: "12px", right: "12px", color: f.color, opacity: hov ? 0.8 : 0.3, transition: "opacity 0.2s" }}><div className="hud-br" /></div>

      {/* Role badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${f.color}12`, border: `1px solid ${f.color}28`, padding: "4px 12px", marginBottom: "20px" }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.color, boxShadow: `0 0 6px ${f.color}`, animation: "pulse-glow 2s infinite" }} />
        <span style={{ fontFamily: mono, fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.16em", color: f.color }}>{f.role}</span>
      </div>

      {/* Avatar + Name row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <div style={{ width: "72px", height: "72px", flexShrink: 0, border: `2px solid ${f.color}30`, overflow: "hidden", position: "relative", background: "rgba(0,0,0,0.5)" }}>
          <img src={f.img} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "saturate(0.55) brightness(0.8)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${f.color}18 0%, transparent 100%)` }} />
          {/* Initials fallback overlay */}
          <div style={{ position: "absolute", bottom: "4px", right: "4px", fontFamily: mono, fontSize: "0.48rem", color: f.color, fontWeight: 700, letterSpacing: "0.08em", opacity: 0.8 }}>{f.initials}</div>
        </div>
        <div>
          <h3 style={{ fontFamily: display, fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.01em", marginBottom: "4px" }}>{f.name}</h3>
          <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#5a6e57", letterSpacing: "0.06em" }}>{f.dept}</div>
        </div>
      </div>

      {/* Spec row */}
      <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#5a6e57", letterSpacing: "0.08em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: f.color, fontSize: "0.7rem" }}>▸</span>
        <span style={{ color: "#8fa889" }}>{f.spec}</span>
        <span style={{ marginLeft: "auto", color: f.color, fontSize: "0.55rem", letterSpacing: "0.1em" }}>{f.year}</span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: `linear-gradient(to right, ${f.color}18, transparent)`, marginBottom: "14px" }} />

      {/* Quote */}
      <p style={{ fontFamily: body, fontSize: "0.83rem", lineHeight: 1.65, color: "#8fa889", fontStyle: "italic", marginBottom: "20px" }}>
        &ldquo;{f.quote}&rdquo;
      </p>

      {/* Social buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        {["GITHUB","LINKEDIN","EMAIL"].map((s) => (
          <button key={s}
            style={{ fontFamily: mono, fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.1em", color: "#4a5e47", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(59,75,55,0.35)", padding: "6px 10px", cursor: "pointer", transition: "all 0.2s", flex: 1 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = f.color; el.style.borderColor = `${f.color}45`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#4a5e47"; el.style.borderColor = "rgba(59,75,55,0.35)"; }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   ALUMNI SECTION
══════════════════════════════════════════════════════════ */
const AlumniSection: React.FC = () => (
  <section id="alumni" style={{ padding: "110px 64px", background: "linear-gradient(180deg, #0d0d0f 0%, #0a0a0b 100%)", position: "relative", overflow: "hidden" }}>
    <SectionDivider color="rgba(0,227,253,0.1)" label="SECTION::ALUMNI // ID_04" />
    <div style={{ position: "absolute", top: "30%", right: "-80px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,227,253,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
      <SectionHeader
        tag="DEPLOYED OPERATIVES"
        tagColor="#00e3fd"
        title="Alumni Developers"
        subtitle="Passed-out members now building at the world\u2019s top tech companies."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {alumni.map((dev) => <AlumniCard key={dev.name} dev={dev} />)}
      </div>
    </div>
  </section>
);

const AlumniCard: React.FC<{ dev: typeof alumni[0] }> = ({ dev }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: hov ? "rgba(20,20,22,0.95)" : "rgba(14,14,16,0.6)",
        border: `1px solid ${hov ? dev.color + "40" : "rgba(42,52,40,0.5)"}`,
        padding: "24px",
        boxShadow: hov ? `0 16px 36px rgba(0,0,0,0.5), 0 0 18px ${dev.color}18` : "none",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
      }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${dev.color}50, transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />
      <div style={{ position: "absolute", top: "10px", left: "10px", color: dev.color, opacity: hov ? 0.7 : 0.2, transition: "opacity 0.2s" }}><div className="hud-tl" /></div>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
        {/* Avatar circle */}
        <div style={{
          width: "48px", height: "48px", flexShrink: 0,
          background: `linear-gradient(135deg, ${dev.color}20, ${dev.color}08)`,
          border: `1.5px solid ${dev.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: display, fontSize: "0.95rem", fontWeight: 800, color: dev.color }}>{dev.initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: display, fontSize: "1rem", fontWeight: 700, color: "#e5e2e3", marginBottom: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dev.name}</h3>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${dev.color}12`, border: `1px solid ${dev.color}22`, padding: "2px 8px" }}>
            <span style={{ fontFamily: mono, fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", color: dev.color }}>{dev.role}</span>
          </div>
        </div>
      </div>

      {/* Company + Batch */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(42,52,40,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dev.color, boxShadow: `0 0 6px ${dev.color}`, animation: "pulse-glow 2s infinite" }} />
          <span style={{ fontFamily: display, fontSize: "0.85rem", fontWeight: 700, color: "#c5d9c0" }}>@ {dev.company}</span>
        </div>
        <span style={{ fontFamily: mono, fontSize: "0.55rem", color: "#3b4b37", letterSpacing: "0.1em" }}>BATCH {dev.batch}</span>
      </div>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {dev.stack.map((skill) => (
          <span key={skill} style={{ fontFamily: mono, fontSize: "0.56rem", letterSpacing: "0.06em", color: "#6b7e67", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(42,52,40,0.4)", padding: "3px 9px" }}>{skill}</span>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   PROJECTS SECTION
══════════════════════════════════════════════════════════ */
const ProjectsSection: React.FC = () => (
  <section id="projects" style={{ padding: "110px 64px", background: "#0a0a0b", position: "relative", overflow: "hidden" }}>
    <SectionDivider color="rgba(255,178,184,0.1)" label="SECTION::PROJECTS // ID_05" />
    <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(255,178,184,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

    <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
      <SectionHeader
        tag="MISSION ARCHIVE"
        tagColor="#ffb2b8"
        title="Our Projects"
        subtitle="From concept to deployment \u2014 real products built by our members."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {projects.map((p) => <ProjectCard key={p.name} p={p} />)}
      </div>
    </div>
  </section>
);

const ProjectCard: React.FC<{ p: typeof projects[0] }> = ({ p }) => {
  const [hov, setHov] = useState(false);
  const statusColors: Record<string, string> = { LIVE: "#00ff41", "IN DEV": "#00e3fd", BETA: "#ffb2b8" };
  const sc = statusColors[p.status] ?? p.color;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: hov ? "rgba(20,20,22,0.98)" : "rgba(14,14,16,0.6)",
        border: `1px solid ${hov ? p.color + "40" : "rgba(42,52,40,0.4)"}`,
        padding: "28px",
        boxShadow: hov ? `0 20px 40px rgba(0,0,0,0.55), 0 0 20px ${p.color}14` : "none",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${p.color}55, transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ width: "42px", height: "42px", background: `${p.color}12`, border: `1px solid ${p.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: p.color, fontSize: "18px" }}>⬡</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: `${sc}12`, border: `1px solid ${sc}28`, padding: "5px 11px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc, boxShadow: `0 0 6px ${sc}`, animation: p.status === "LIVE" ? "pulse-glow 1.5s infinite" : "none" }} />
          <span style={{ fontFamily: mono, fontSize: "0.55rem", fontWeight: 700, color: sc, letterSpacing: "0.14em" }}>{p.status}</span>
        </div>
      </div>

      <h3 style={{ fontFamily: display, fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: "10px", letterSpacing: "-0.01em" }}>{p.name}</h3>
      <p style={{ fontFamily: body, fontSize: "0.83rem", lineHeight: 1.7, color: "#6b7e67", marginBottom: "22px", flex: 1 }}>{p.desc}</p>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px dashed rgba(42,52,40,0.4)", paddingTop: "16px" }}>
        {p.tech.map((t) => (
          <span key={t} style={{ fontFamily: mono, fontSize: "0.57rem", color: "#6b7e67", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(42,52,40,0.4)", padding: "3px 9px" }}>{t}</span>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "10px", right: "10px", color: p.color, opacity: hov ? 0.55 : 0.15, transition: "opacity 0.2s" }}><div className="hud-br" /></div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   JOIN / CONTACT FORM SECTION
══════════════════════════════════════════════════════════ */
const JoinSection: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", branch: "", semester: "", role: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", branch: "", semester: "", role: "", message: "" });
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focused === field ? "rgba(0,255,65,0.04)" : "rgba(10,10,11,0.8)",
    border: "none",
    borderBottom: `2px solid ${focused === field ? "#00ff41" : "rgba(59,75,55,0.4)"}`,
    color: "#e5e2e3",
    fontFamily: body,
    fontSize: "0.9rem",
    padding: "12px 14px 10px",
    outline: "none",
    transition: "all 0.25s ease",
    caretColor: "#00ff41",
    boxShadow: focused === field ? "0 4px 20px rgba(0,255,65,0.08)" : "none",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: mono,
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#4a5e47",
    marginBottom: "8px",
    display: "block",
    transition: "color 0.2s",
  };

  return (
    <section id="join" style={{ padding: "110px 64px", background: "linear-gradient(180deg, #0a0a0b 0%, #0d0d0f 100%)", position: "relative", overflow: "hidden" }}>
      <SectionDivider color="rgba(0,227,253,0.12)" label="SECTION::JOIN // ID_06" />

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "20%", left: "-60px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "-60px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(0,227,253,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1160px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "center" }}>
        {/* Left — text */}
        <div>
          <SectionTag color="#00e3fd" line>RECRUITMENT // OPEN</SectionTag>
          <h2 style={{ fontFamily: display, fontSize: "clamp(2rem, 3.2vw, 2.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: "20px", lineHeight: 1.1 }}>
            Ready to Build?<br />
            <span style={{ color: "#00e3fd", textShadow: "0 0 24px rgba(0,227,253,0.3)" }}>Join the Cell.</span>
          </h2>
          <p style={{ fontFamily: body, fontSize: "0.95rem", lineHeight: 1.8, color: "#8fa889", marginBottom: "36px" }}>
            Whether you&rsquo;re a coder, designer, or someone who just loves building things — SDC has a place for you. Fill in the form and our team will reach out within 48 hours.
          </p>

          {/* Requirements */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { val: "Any CSE/IT student",   lbl: "ELIGIBILITY" },
              { val: "Passion for building", lbl: "REQUIREMENT" },
              { val: "Open to all branches", lbl: "BRANCHES"    },
              { val: "Sem 1 — Sem 8",        lbl: "SEMESTERS"   },
            ].map((r) => (
              <div key={r.lbl} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00e3fd", boxShadow: "0 0 8px rgba(0,218,243,0.5)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: mono, fontSize: "0.56rem", color: "#3b4b37", letterSpacing: "0.14em", marginBottom: "2px" }}>{r.lbl}</div>
                  <div style={{ fontFamily: body, fontSize: "0.88rem", color: "#c5d9c0" }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ ...glass(0.5, "rgba(0,255,65,0.1)"), padding: "40px", position: "relative" }}>
          {/* Top glow */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(0,255,65,0.5), rgba(0,227,253,0.4), transparent)" }} />
          {/* HUD corners */}
          <div style={{ position: "absolute", top: "12px", left: "12px", color: "rgba(0,255,65,0.4)" }}><div className="hud-tl" /></div>
          <div style={{ position: "absolute", bottom: "12px", right: "12px", color: "rgba(0,227,253,0.4)" }}><div className="hud-br" /></div>

          {/* Form title */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00e3fd", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff41", boxShadow: "0 0 8px #00ff41", animation: "pulse-glow 2s infinite" }} />
              APPLICATION_FORM // SECURE_CHANNEL
            </div>
            <h3 style={{ fontFamily: display, fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>Enlist Now</h3>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontFamily: display, fontSize: "2rem", fontWeight: 800, color: "#00ff41", textShadow: "0 0 24px rgba(0,255,65,0.5)", marginBottom: "12px" }}>✓ SUBMITTED</div>
              <div style={{ fontFamily: mono, fontSize: "0.65rem", color: "#4a5e47", letterSpacing: "0.15em" }}>WE WILL CONTACT YOU WITHIN 48HRS</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>FULL NAME</label>
                  <input type="text" required placeholder="e.g. Arjun Mehta" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    style={inputStyle("name")} />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL ADDRESS</label>
                  <input type="email" required placeholder="your@college.edu" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    style={inputStyle("email")} />
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle}>BRANCH</label>
                  <select required value={form.branch}
                    onChange={e => setForm({ ...form, branch: e.target.value })}
                    onFocus={() => setFocused("branch")} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("branch"), appearance: "none", cursor: "pointer" }}>
                    <option value="" disabled>Select branch</option>
                    {["CSE","IT","ECE","ME","CE","EE"].map(b => <option key={b} value={b} style={{ background: "#111" }}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>SEMESTER</label>
                  <select required value={form.semester}
                    onChange={e => setForm({ ...form, semester: e.target.value })}
                    onFocus={() => setFocused("semester")} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("semester"), appearance: "none", cursor: "pointer" }}>
                    <option value="" disabled>Select sem</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s} style={{ background: "#111" }}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              {/* Role */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>PREFERRED ROLE</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["FRONTEND","BACKEND","MOBILE","UI/UX","DEVOPS","AI/ML"].map((role) => (
                    <button type="button" key={role}
                      onClick={() => setForm({ ...form, role })}
                      style={{
                        fontFamily: mono, fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em",
                        background: form.role === role ? "rgba(0,255,65,0.12)" : "rgba(0,0,0,0.4)",
                        color: form.role === role ? "#00ff41" : "#4a5e47",
                        border: `1px solid ${form.role === role ? "rgba(0,255,65,0.4)" : "rgba(42,52,40,0.4)"}`,
                        padding: "7px 12px", cursor: "pointer", transition: "all 0.2s",
                        boxShadow: form.role === role ? "0 0 10px rgba(0,255,65,0.15)" : "none",
                      }}>{role}</button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>WHY SDC? (OPTIONAL)</label>
                <textarea placeholder="Tell us what you'd like to build..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  rows={3}
                  style={{ ...inputStyle("message"), resize: "none", borderBottom: "none", border: `1px solid ${focused === "message" ? "rgba(0,255,65,0.4)" : "rgba(59,75,55,0.3)"}` }} />
              </div>

              {/* Submit */}
              <button type="submit"
                style={{
                  width: "100%", fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em",
                  background: "linear-gradient(135deg, #00ff41, #00e639)",
                  color: "#003907", padding: "16px", border: "none", cursor: "pointer",
                  boxShadow: "0 0 24px rgba(0,255,65,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,255,65,0.5)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 0 24px rgba(0,255,65,0.35)"; }}
              >[SUBMIT] ENLIST APPLICATION</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
const SDCFooter: React.FC<{ onNav: (id: string) => void }> = ({ onNav }) => (
  <footer style={{ background: "#060607", borderTop: "1px solid rgba(0,255,65,0.08)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(0,255,65,0.35), rgba(0,227,253,0.25), transparent)" }} />

    <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "60px 64px 0" }}>
      {/* Top grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #00ff41, #00e3fd)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(0,255,65,0.35)" }}>
              <span style={{ fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, color: "#003907" }}>SDC</span>
            </div>
            <div>
              <div style={{ fontFamily: display, fontSize: "0.92rem", fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>SOFTWARE DEVELOPMENT CELL</div>
              <div style={{ fontFamily: mono, fontSize: "0.48rem", color: "#4a5e47", letterSpacing: "0.12em", marginTop: "2px" }}>BUILD · SHIP · LEAD</div>
            </div>
          </div>
          <p style={{ fontFamily: body, fontSize: "0.82rem", lineHeight: 1.7, color: "#5a6e57", maxWidth: "250px", marginBottom: "22px" }}>
            The premier engineering guild where students become builders and builders become leaders.
          </p>
          {/* Socials */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[["GH","GitHub"],["LI","LinkedIn"],["TW","Twitter"],["YT","YouTube"]].map(([abbr, title]) => (
              <a key={abbr} href="#" title={title}
                style={{ width: "34px", height: "34px", background: "rgba(22,22,24,0.8)", border: "1px solid rgba(42,52,40,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: "0.58rem", fontWeight: 700, color: "#4a5e47", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#00ff41"; el.style.borderColor = "rgba(0,255,65,0.4)"; el.style.boxShadow = "0 0 12px rgba(0,255,65,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#4a5e47"; el.style.borderColor = "rgba(42,52,40,0.5)"; el.style.boxShadow = "none"; }}
              >{abbr}</a>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div>
          <FooterHeading color="#00ff41">NAVIGATE</FooterHeading>
          {[["home","Home"],["about","About"],["projects","Projects"],["founders","Founders"],["alumni","Alumni"],["join","Join SDC"]].map(([id, label]) => (
            <FooterLink key={id} onClick={() => onNav(id)}>{label}</FooterLink>
          ))}
        </div>

        {/* Resources */}
        <div>
          <FooterHeading color="#00e3fd">RESOURCES</FooterHeading>
          {["GitHub Org","Documentation","Open Source","Research Papers","Design System","API Docs"].map((item) => (
            <FooterLink key={item}>{item}</FooterLink>
          ))}
        </div>

        {/* Contact */}
        <div>
          <FooterHeading color="#ffb2b8">CONTACT</FooterHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { lbl: "EMAIL",    val: "sdc@college.edu"         },
              { lbl: "LOCATION", val: "CSE Block, Room 204"     },
              { lbl: "HOURS",    val: "Mon\u2013Fri, 4\u20138 PM" },
              { lbl: "DISCORD",  val: "discord.gg/sdc-portal"   },
            ].map((c) => (
              <div key={c.lbl}>
                <div style={{ fontFamily: mono, fontSize: "0.55rem", color: "#3b4b37", letterSpacing: "0.14em", marginBottom: "3px" }}>{c.lbl}</div>
                <div style={{ fontFamily: body, fontSize: "0.82rem", color: "#8fa889" }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(42,52,40,0.6), transparent)", marginBottom: "22px" }} />

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
        <span style={{ fontFamily: mono, fontSize: "0.58rem", color: "#2e3e2b", letterSpacing: "0.1em" }}>
          © 2026 SDC_PORTAL // SOFTWARE_DEVELOPMENT_CELL // ALL_RIGHTS_RESERVED
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["PRIVACY","TERMS","CODE OF CONDUCT"].map((l) => (
            <span key={l} style={{ fontFamily: mono, fontSize: "0.57rem", color: "#2e3e2b", letterSpacing: "0.08em", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#6b7e67"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#2e3e2b"}
            >{l}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ══════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
══════════════════════════════════════════════════════════ */
const SectionDivider: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
    <div style={{ position: "absolute", top: "18px", left: "64px", fontFamily: mono, fontSize: "0.52rem", color: "#2e3e2b", letterSpacing: "0.14em" }}>{label}</div>
  </>
);

const SectionTag: React.FC<{ color: string; children: React.ReactNode; line?: boolean }> = ({ color, children, line }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
    {line && <span style={{ width: "28px", height: "1px", background: color, display: "inline-block", opacity: 0.7 }} />}
    <span style={{ fontFamily: mono, fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.2em", color }}>{children}</span>
  </div>
);

const SectionHeader: React.FC<{ tag: string; tagColor: string; title: string; subtitle: string }> = ({ tag, tagColor, title, subtitle }) => (
  <div style={{ textAlign: "center", marginBottom: "56px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "16px" }}>
      <span style={{ width: "40px", height: "1px", background: tagColor, opacity: 0.5 }} />
      <span style={{ fontFamily: mono, fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.22em", color: tagColor }}>{tag}</span>
      <span style={{ width: "40px", height: "1px", background: tagColor, opacity: 0.5 }} />
    </div>
    <h2 style={{ fontFamily: display, fontSize: "clamp(2rem, 3.5vw, 2.9rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", marginBottom: "14px", lineHeight: 1.1 }}>{title}</h2>
    <p style={{ fontFamily: body, fontSize: "0.93rem", color: "#5a6e57", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>{subtitle}</p>
  </div>
);

const FooterHeading: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div style={{ fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color, marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
    <span style={{ width: "14px", height: "1px", background: color, display: "inline-block" }} />
    {children}
  </div>
);

const FooterLink: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <div onClick={onClick}
    style={{ fontFamily: body, fontSize: "0.83rem", color: "#5a6e57", marginBottom: "10px", cursor: "pointer", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "8px" }}
    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#c5d9c0"}
    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#5a6e57"}
  >
    <span style={{ color: "#2e3e2b", fontSize: "0.6rem" }}>▸</span>
    {children}
  </div>
);

export default LandingPage;

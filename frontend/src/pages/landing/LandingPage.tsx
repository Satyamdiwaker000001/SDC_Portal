import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../../assets/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';
import founderVideo from '../../assets/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';

const founders = [
  { name: "Prof. Arvind Sharma", role: "FACULTY ADVISOR", spec: "Distributed Systems & AI", initials: "AS", linkedin: "https://linkedin.com" },
  { name: "Rohan Verma", role: "FOUNDING PRESIDENT", spec: "Full Stack & DevOps", initials: "RV", linkedin: "https://linkedin.com" },
  { name: "Priya Nair", role: "FOUNDING TECH LEAD", spec: "UI/UX & Systems Design", initials: "PN", linkedin: "https://linkedin.com" },
];

const activeDevelopers = [
  { name: "Aman Gupta", role: "LEAD DEVELOPER", spec: "Frontend & Web3", company: "SDC", initials: "AG", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Sneha Rao", role: "UI/UX DESIGNER", spec: "Figma & React", company: "SDC", initials: "SR", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Kunal Jain", role: "BACKEND DEV", spec: "Node.js & AWS", company: "SDC", initials: "KJ", github: "https://github.com", linkedin: "https://linkedin.com" },
];

const alumni = [
  { name: "Arjun Mehta", batch: "2023", role: "FULL STACK", company: "Google", initials: "AM", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Sneha Kapoor", batch: "2023", role: "MOBILE DEV", company: "Flipkart", initials: "SK", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Dev Rathore", batch: "2022", role: "AI / ML", company: "Microsoft", initials: "DR", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Anika Singh", batch: "2023", role: "UI / UX", company: "Razorpay", initials: "AS", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Karan Joshi", batch: "2022", role: "DEVOPS", company: "Swiggy", initials: "KJ", github: "https://github.com", linkedin: "https://linkedin.com" },
  { name: "Meghna Iyer", batch: "2024", role: "DATABASE", company: "PhonePe", initials: "MI", github: "https://github.com", linkedin: "https://linkedin.com" },
];

/* ══════════════════════════════════════════════════════════
   HERO SECTION (Kept as requested)
══════════════════════════════════════════════════════════ */
const HeroSection: React.FC<{ onNav: (id: string) => void }> = ({ onNav }) => (
  <section id="home" style={{ position: "relative", width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
    {/* Background Video Container */}
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden", background: "#000" }}>
      <video 
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        autoPlay muted loop playsInline
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime >= 9) {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play();
          }
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.9) 100%)", zIndex: 1 }} />
    </div>

    {/* UI Layer */}
    <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", width: "100%", marginTop: "64px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 84px)", fontStyle: "italic", color: "#fff", maxWidth: "900px", lineHeight: 1.1, margin: 0, fontWeight: 400, letterSpacing: "-0.02em" }}>
        Built for the curious
      </h1>
      <div style={{ marginTop: "48px", width: "100%", maxWidth: "512px", position: "relative" }}>
        <div className="liquid-glass" style={{ borderRadius: "9999px", padding: "8px", display: "flex", alignItems: "center", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
           <input type="text" placeholder="Join the expedition..." style={{ background: "transparent", border: "none", outline: "none", width: "100%", padding: "0 24px", color: "#e2e2e2", fontFamily: "var(--font-body)", fontSize: "16px" }} />
           <button onClick={() => onNav("join")} style={{ background: "#fff", color: "#131313", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0, transition: "transform 0.2s" }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
             <span style={{ fontSize: "20px", fontWeight: 700 }}>→</span>
           </button>
        </div>
        <div style={{ position: "absolute", top: "100%", marginTop: "64px", left: "50%", transform: "translateX(-50%)", width: "100%" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", marginBottom: "16px", textTransform: "uppercase" }}>A new dimension of spatial exploration.</p>
          <GlassButton onClick={() => onNav("join")}>
            Manifesto
          </GlassButton>
        </div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════
   FOUNDERS SECTION
══════════════════════════════════════════════════════════ */
const FoundersSection: React.FC = () => (
  <section id="founders" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", overflow: "hidden" }}>
    {/* Video Background for Founders */}
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
      <video style={{ width: "100%", height: "100%", objectFit: "cover" }} autoPlay muted loop playsInline>
        <source src={founderVideo} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,11,1) 0%, rgba(10,10,11,0.6) 20%, rgba(10,10,11,0.6) 80%, rgba(10,10,11,1) 100%)", zIndex: 1 }} />
    </div>

    <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontStyle: "italic", color: "#fff", marginBottom: "80px", textAlign: "center" }}>
        Architects of the Cell
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", width: "100%" }}>
        {founders.map((f, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 32px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#fff" }}>{f.initials}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", marginBottom: "8px" }}>{f.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(255,255,255,0.8)", marginBottom: "16px", textTransform: "uppercase" }}>{f.role}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>{f.spec}</p>
            
            <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              <a href={f.linkedin} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>work</span>
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════
   DEVELOPERS SECTION
══════════════════════════════════════════════════════════ */
const DevelopersSection: React.FC = () => (
  <section id="developers" style={{ padding: "120px 24px", background: "#000", display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ maxWidth: "1200px", width: "100%" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontStyle: "italic", color: "#fff", marginBottom: "24px", textAlign: "center" }}>
        Our Developers
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: "80px", maxWidth: "600px", margin: "0 auto 80px" }}>
        The engineering force behind our products. Divided into currently active core members and our esteemed alumni network.
      </p>

      {/* ACTIVE DEVELOPERS */}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#fff", marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>Active Core</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "80px" }}>
        {activeDevelopers.map((a, idx) => (
          <GlassCard key={idx} hoverEffect={true}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#fff" }}>{a.initials}</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", color: "#00e3fd" }}>ACTIVE</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#fff", marginBottom: "4px" }}>{a.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>{a.role}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>business</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#fff" }}>{a.company}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={a.github} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                </a>
                <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>work</span>
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ALUMNI DEVELOPERS */}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#fff", marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>Alumni Network</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {alumni.map((a, idx) => (
          <GlassCard key={idx} hoverEffect={true}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#fff" }}>{a.initials}</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Batch '{a.batch}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#fff", marginBottom: "4px" }}>{a.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>{a.role}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>business</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#fff" }}>{a.company}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={a.github} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                </a>
                <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: "#fff", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>work</span>
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════
   JOIN SECTION
══════════════════════════════════════════════════════════ */
const JoinSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="join" style={{ padding: "160px 24px", background: "linear-gradient(to top, rgba(255,255,255,0.02) 0%, transparent 100%)", display: "flex", justifyContent: "center" }}>
      <GlassCard style={{ maxWidth: "800px", width: "100%", padding: "80px 32px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 72px)", fontStyle: "italic", color: "#fff", marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Ready to build?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "400px", margin: "0 auto 48px", lineHeight: 1.6 }}>
          Join the community of builders, designers, and engineers shaping the future.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <GlassButton variant="primary" onClick={() => navigate("/register")}>
            Apply Now
          </GlassButton>
          <GlassButton variant="outline" onClick={() => window.location.href = "mailto:contact@sdc.edu"}>
            Contact Us
          </GlassButton>
        </div>
      </GlassCard>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */
const LandingPage: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#000", position: "relative" }}>
      <HeroSection onNav={scrollTo} />
      <FoundersSection />
      <DevelopersSection />
      <JoinSection />
    </div>
  );
};

export default LandingPage;

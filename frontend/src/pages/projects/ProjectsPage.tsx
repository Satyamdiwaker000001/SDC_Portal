import React from 'react';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';

const projects = [
  { name: "SDC Portal",      desc: "Central hub for all SDC activities, member management and project tracking.",       tech: ["React","FastAPI","MySQL"],       status: "LIVE" },
  { name: "CollegeConnect",  desc: "Campus social platform for events, notice boards, and academic resources.",          tech: ["Next.js","MongoDB","Redis"],     status: "IN DEV" },
  { name: "AutoGrade AI",    desc: "ML-powered assignment grading assistant built for faculty use.",                     tech: ["Python","TensorFlow","FastAPI"], status: "BETA" },
  { name: "CampusMap AR",    desc: "Augmented reality campus navigation app for new students.",                          tech: ["Flutter","ARCore","Firebase"],   status: "IN DEV" },
  { name: "OpenLib",         desc: "Digital library management with QR-based borrowing system.",                         tech: ["React","Node.js","PostgreSQL"],  status: "LIVE" },
  { name: "HackTrack",       desc: "Hackathon management and intelligent team formation platform.",                      tech: ["Vue.js","Supabase","Tailwind"],  status: "LIVE" },
];

const ProjectsPage: React.FC = () => {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px", display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "24px", paddingRight: "24px" }}>
      
      <div style={{ maxWidth: "1000px", width: "100%", textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 72px)", fontStyle: "italic", color: "#fff", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "24px" }}>
          Mission Archive
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          From concept to deployment — real products built by our members. Explore the systems we've shipped to production.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", maxWidth: "1200px", width: "100%" }}>
        {projects.map((p, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#fff" }}>code_blocks</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: "9999px" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>{p.status}</span>
              </div>
            </div>
            
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", fontWeight: 400, marginBottom: "12px" }}>{p.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "32px", flexGrow: 1 }}>{p.desc}</p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", marginTop: "auto" }}>
              {p.tech.map((t) => (
                <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: "9999px" }}>{t}</span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ marginTop: "80px" }}>
        <GlassButton variant="outline" onClick={() => window.open('https://github.com', '_blank')}>
          View on GitHub <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
        </GlassButton>
      </div>

    </div>
  );
};

export default ProjectsPage;

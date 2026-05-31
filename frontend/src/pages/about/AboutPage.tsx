import React from 'react';
import GlassCard from '../../components/common/GlassCard';

const AboutPage: React.FC = () => {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "120px", display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "24px", paddingRight: "24px" }}>
      
      <div style={{ maxWidth: "1000px", width: "100%", textAlign: "center", marginBottom: "80px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 72px)", fontStyle: "italic", color: "#fff", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: "24px" }}>
          The Engineering Vanguard
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          The Software Development Cell (SDC) is the premier technical club. Founded to bridge the gap between classroom theory and real-world engineering, SDC is where passion meets execution.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", maxWidth: "1000px", width: "100%" }}>
        {[
          { icon: "bolt", title: "Workshops", desc: "Weekly technical sessions & hackathons pushing the limits of our knowledge." },
          { icon: "rocket_launch", title: "Real Products", desc: "Deployed applications used by thousands across the campus." },
          { icon: "hub", title: "Mentorship", desc: "Direct industry network access and an established internship pipeline." },
          { icon: "code", title: "Open Source", desc: "All our code is public, and external contributions are always welcome." },
        ].map((feature, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#fff" }}>{feature.icon}</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#fff", fontWeight: 400, fontStyle: "italic" }}>{feature.title}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{feature.desc}</p>
          </GlassCard>
        ))}
      </div>

      <div style={{ marginTop: "120px", maxWidth: "800px", width: "100%" }}>
        <GlassCard style={{ textAlign: "center", padding: "64px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "42px", color: "#fff", fontStyle: "italic", marginBottom: "24px" }}>Our Mission</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontStyle: "italic" }}>
            "To build tomorrow's engineers by building today's products."
          </p>
        </GlassCard>
      </div>

    </div>
  );
};

export default AboutPage;

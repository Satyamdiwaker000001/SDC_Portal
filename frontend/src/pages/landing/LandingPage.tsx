import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import { FloatingIconsHero } from '@/components/ui/floating-icons-hero-section';

// --- Original Stylized Company Logo SVG Components ---

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z" fill="#4285F4"/>
        <path d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z" fill="#34A853"/>
        <path d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z" fill="#FBBC05"/>
        <path d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z" fill="#EA4335"/>
    </svg>
);

const IconApple = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-zinc-800" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.482 15.334C16.274 16.146 15.238 17.554 15.238 19.138C15.238 21.694 17.062 22.846 19.33 22.99C21.682 23.122 23.53 21.73 23.53 19.138C23.53 16.57 21.742 15.334 19.438 15.334C18.23 15.334 17.482 15.334 17.482 15.334ZM19.438 1.018C17.074 1.018 15.238 2.41 15.238 4.982C15.238 7.554 17.062 8.702 19.33 8.842C21.682 8.974 23.53 7.582 23.53 4.982C23.518 2.41 21.742 1.018 19.438 1.018Z" />
    </svg>
);

const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022"/>
        <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00"/>
        <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF"/>
        <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900"/>
    </svg>
);

const IconFigma = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" fill="#2C2C2C"/>
        <path d="M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5V7z" fill="#0ACF83"/>
        <path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 5-5v10z" fill="#A259FF"/>
        <path d="M12 17a5 5 0 0 1-5-5h10a5 5 0 0 1-5 5z" fill="#F24E1E"/>
        <path d="M7 12a5 5 0 0 1 5 5v-5H7z" fill="#FF7262"/>
    </svg>
);

const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-zinc-800" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
);

const IconSlack = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="#36C5F0"/><path d="M9 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#2EB67D"/><path d="M14 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" fill="#ECB22E"/><path d="M15.5 15a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" fill="#E01E5A"/><path d="M10 14h4v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5V14Z" fill="#E01E5A"/><path d="M8.5 14a1.5 1.5 0 0 0 1.5 1.5h1.5v-1a1.5 1.5 0 0 0-1.5-1.5H8.5v1Z" fill="#ECB22E"/><path d="M15.5 10a1.5 1.5 0 0 0-1.5-1.5H12.5v4a1.5 1.5 0 0 0 1.5 1.5h1.5v-4Z" fill="#36C5F0"/><path d="M14 8.5a1.5 1.5 0 0 0-1.5-1.5h-1v4a1.5 1.5 0 0 0 1.5 1.5h1v-4Z" fill="#2EB67D"/>
    </svg>
);

const IconNotion = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-zinc-800" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm.111 5.889h3.222v10.222h-3.222V7.889zm-4.333 0h3.222v10.222H7.778V7.889z"/>
    </svg>
);

const IconVercel = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-zinc-900" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2z"/>
    </svg>
);

const IconStripe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="#635BFF"/><path d="M6 7H18V9H6V7Z" fill="white"/><path d="M6 11H18V13H6V11Z" fill="white"/><path d="M6 15H14V17H6V15Z" fill="white"/>
    </svg>
);

const IconDiscord = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.482a1.88 1.88 0 0 0-1.635-.482C17.398 3.42 16.02 3 12 3s-5.398.42-6.682 1.001a1.88 1.88 0 0 0-1.635.483c-1.875 1.2-2.325 3.61-1.568 5.711 1.62 4.47 5.063 7.8 9.885 7.8s8.265-3.33 9.885-7.8c.757-2.1-.307-4.51-1.568-5.711ZM8.45 13.4c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Zm7.1 0c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Z" fill="#5865F2"/>
    </svg>
);

const IconX = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-zinc-900" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.03 19.75h1.866L7.156 4.25H5.16l11.874 15.5z"/>
    </svg>
);

const IconSpotify = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.125 14.175c-.188.3-.563.413-.863.225-2.437-1.5-5.5-1.725-9.15-1.012-.338.088-.675-.15-.763-.488-.088-.337.15-.675.488-.762 3.937-.787 7.287-.525 9.975 1.125.3.187.412.562.225.862zm.9-2.7c-.225.363-.675.488-1.037.263-2.7-1.65-6.825-2.1-9.975-1.162-.413.113-.825-.15-1-.562-.15-.413.15-.825.563-1 .362-.112 3.487-.975 6.6 1.312.362.225.487.675.262 1.038v.112zm.113-2.887c-3.225-1.875-8.55-2.025-11.512-1.125-.487.15-.975-.15-1.125-.637-.15-.488.15-.975.638-1.125 3.337-.975 9.15-.787 12.825 1.312.45.263.6.825.337 1.275-.263.45-.825.6-1.275.337v-.038z" fill="#1DB954"/>
    </svg>
);

const IconDropbox = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8l-6 4 6 4 6-4-6-4z" fill="#0061FF"/><path d="M6 12l6 4 6-4-6-4-6 4z" fill="#007BFF"/><path d="M12 16l6-4-6-4-6 4 6 4z" fill="#4DA3FF"/><path d="M18 12l-6-4-6 4 6 4 6-4z" fill="#0061FF"/>
    </svg>
);

const IconTwitch = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.149 0L.707 3.028v17.944h5.66v3.028h3.028l3.028-3.028h4.243l7.07-7.07V0H2.15zm19.799 13.434l-3.535 3.535h-4.95l-3.029 3.029v-3.03H5.14V1.414h16.808v12.02z" fill="#9146FF"/><path d="M15.53 5.303h2.12v6.36h-2.12v-6.36zm-4.95 0h2.12v6.36h-2.12v-6.36z" fill="#9146FF"/>
    </svg>
);

const IconLinear = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="linear-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5E5CE6" /><stop offset="100%" stopColor="#2C2C2C" /></linearGradient></defs><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4 9h8v2H8v-2z" fill="url(#linear-grad)"/>
    </svg>
);

const IconYouTube = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.582 6.186A2.482 2.482 0 0 0 19.82 4.42C18.1 4 12 4 12 4s-6.1 0-7.82.42c-.98.26-1.74.98-1.762 1.766C2 7.94 2 12 2 12s0 4.06.418 5.814c.022.786.782 1.506 1.762 1.766C6.1 20 12 20 12 20s6.1 0 7.82-.42c.98-.26 1.74-.98 1.762-1.766C22 16.06 22 12 22 12s0-4.06-.418-5.814zM9.75 15.5V8.5L15.75 12 9.75 15.5z" fill="#FF0000"/>
    </svg>
);

const demoIcons = [
  { id: 1, icon: IconGoogle, className: 'top-[10%] left-[10%]' },
  { id: 2, icon: IconApple, className: 'top-[20%] right-[8%]' },
  { id: 3, icon: IconMicrosoft, className: 'top-[80%] left-[10%]' },
  { id: 4, icon: IconFigma, className: 'bottom-[10%] right-[10%]' },
  { id: 5, icon: IconGitHub, className: 'top-[5%] left-[30%]' },
  { id: 6, icon: IconSlack, className: 'top-[5%] right-[30%]' },
  { id: 7, icon: IconVercel, className: 'bottom-[8%] left-[25%]' },
  { id: 8, icon: IconStripe, className: 'top-[40%] left-[15%]' },
  { id: 9, icon: IconDiscord, className: 'top-[75%] right-[25%]' },
  { id: 10, icon: IconX, className: 'top-[90%] left-[70%]' },
  { id: 11, icon: IconNotion, className: 'top-[50%] right-[5%]' },
  { id: 12, icon: IconSpotify, className: 'top-[55%] left-[5%]' },
  { id: 13, icon: IconDropbox, className: 'top-[5%] left-[55%]' },
  { id: 14, icon: IconTwitch, className: 'bottom-[5%] right-[45%]' },
  { id: 15, icon: IconLinear, className: 'top-[25%] right-[20%]' },
  { id: 16, icon: IconYouTube, className: 'top-[60%] left-[30%]' },
];

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
   HERO SECTION (Updated with Floating Icons & Video BG)
   ══════════════════════════════════════════════════════════ */
const HeroSection: React.FC<{ onNav: (id: string) => void }> = () => (
  <FloatingIconsHero
    title="Built for the curious"
    subtitle="Explore a universe of possibilities with our platform, connecting you to the tools and technologies that shape the future."
    ctaText="Join the Expedition"
    ctaHref="#join"
    icons={demoIcons}
  />
);

/* ══════════════════════════════════════════════════════════
   FOUNDERS SECTION
══════════════════════════════════════════════════════════ */
const FoundersSection: React.FC = () => (
  <section id="founders" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 24px", overflow: "hidden", background: "#ffffff" }}>
    <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontStyle: "italic", color: "#18181b", marginBottom: "80px", textAlign: "center" }}>
        Architects of the Cell
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", width: "100%" }}>
        {founders.map((f, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 32px", background: "rgba(0, 0, 0, 0.015)", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", border: "1px solid rgba(0,0,0,0.08)" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#18181b" }}>{f.initials}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#18181b", marginBottom: "8px" }}>{f.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(24,24,27,0.7)", marginBottom: "16px", textTransform: "uppercase" }}>{f.role}</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(24,24,27,0.5)", marginBottom: "24px" }}>{f.spec}</p>
            
            <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
              <a href={f.linkedin} target="_blank" rel="noreferrer" style={{ color: "#18181b", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
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
  <section id="developers" style={{ padding: "120px 24px", background: "#fcfcfc", display: "flex", flexDirection: "column", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
    <div style={{ maxWidth: "1200px", width: "100%" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontStyle: "italic", color: "#18181b", marginBottom: "24px", textAlign: "center" }}>
        Our Developers
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(24,24,27,0.6)", textAlign: "center", marginBottom: "80px", maxWidth: "600px", margin: "0 auto 80px" }}>
        The engineering force behind our products. Divided into currently active core members and our esteemed alumni network.
      </p>

      {/* ACTIVE DEVELOPERS */}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#18181b", marginBottom: "40px", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "16px" }}>Active Core</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "80px" }}>
        {activeDevelopers.map((a, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ background: "rgba(0, 0, 0, 0.015)", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#18181b" }}>{a.initials}</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", color: "#2563eb", fontWeight: 600 }}>ACTIVE</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#18181b", marginBottom: "4px" }}>{a.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(24,24,27,0.6)", marginBottom: "24px" }}>{a.role}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(24,24,27,0.4)" }}>business</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#18181b" }}>{a.company}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={a.github} target="_blank" rel="noreferrer" style={{ color: "#18181b", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                </a>
                <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: "#18181b", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>work</span>
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ALUMNI DEVELOPERS */}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#18181b", marginBottom: "40px", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "16px" }}>Alumni Network</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
        {alumni.map((a, idx) => (
          <GlassCard key={idx} hoverEffect={true} style={{ background: "rgba(0, 0, 0, 0.015)", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#18181b" }}>{a.initials}</span>
              </div>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.1em", color: "rgba(24,24,27,0.5)", fontWeight: 500 }}>Batch '{a.batch}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#18181b", marginBottom: "4px" }}>{a.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(24,24,27,0.6)", marginBottom: "24px" }}>{a.role}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(24,24,27,0.4)" }}>business</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#18181b" }}>{a.company}</span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={a.github} target="_blank" rel="noreferrer" style={{ color: "#18181b", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>code</span>
                </a>
                <a href={a.linkedin} target="_blank" rel="noreferrer" style={{ color: "#18181b", opacity: 0.6, transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
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
    <section id="join" style={{ padding: "160px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.02) 0%, transparent 100%)", display: "flex", justifyContent: "center" }}>
      <GlassCard style={{ maxWidth: "800px", width: "100%", padding: "80px 32px", textAlign: "center", background: "rgba(0,0,0,0.015)", border: "1px solid rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 72px)", fontStyle: "italic", color: "#18181b", marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Ready to build?
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(24,24,27,0.6)", maxWidth: "400px", margin: "0 auto 48px", lineHeight: 1.6 }}>
          Join the community of builders, designers, and engineers shaping the future.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <GlassButton 
            variant="primary" 
            onClick={() => navigate("/register")}
            style={{ background: "#18181b", color: "#fff" }}
          >
            Apply Now
          </GlassButton>
          <GlassButton 
            variant="outline" 
            onClick={() => window.location.href = "mailto:contact@sdc.edu"}
            style={{ color: "#18181b", border: "1px solid rgba(24,24,27,0.3)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(24,24,27,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
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
    <div style={{ background: "#ffffff", position: "relative" }}>
      <HeroSection onNav={scrollTo} />
      <FoundersSection />
      <DevelopersSection />
      <JoinSection />
    </div>
  );
};

export default LandingPage;

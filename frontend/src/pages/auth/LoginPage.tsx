import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'COMPILING' | 'ERROR'>('IDLE');
  const [showPassword, setShowPassword] = useState(false);
  const [bgLoadingText, setBgLoadingText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const text = "LOADING...";
    let i = 0;
    const interval = setInterval(() => {
      setBgLoadingText(text.substring(0, i));
      i++;
      if (i > text.length + 8) i = 0; // Gives a pause before restarting
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('ERROR');
      return;
    }

    setStatus('COMPILING');
    setTimeout(() => {
      // Set dummy token for bypass auth
      localStorage.setItem('sdc_token', 'mock_resistance_uplink_token_v6');
      localStorage.setItem('sdc_user', JSON.stringify({
        id: 'OP-001',
        name: 'COMMANDER_SINCERE',
        email: email,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Commander'
      }));
      navigate('/dashboard');
    }, 1200);
  };

  const mono = "'JetBrains Mono', 'Fira Code', monospace";
  const display = "'Inter', 'Outfit', sans-serif";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "#060607",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Ambience */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,136,255,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,227,253,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,136,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      {/* Jarvis HUD Animation */}
      <style>
        {`
          @keyframes spinClockwise {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes spinCounterClockwise {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(-360deg); }
          }
          @keyframes pulseOpacity {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes spinGlobeY {
            0% { transform: translate(-50%, -50%) rotateX(15deg) rotateY(0deg); }
            100% { transform: translate(-50%, -50%) rotateX(15deg) rotateY(360deg); }
          }
        `}
      </style>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", pointerEvents: "none", zIndex: 0, opacity: 0.35, perspective: "1000px" }}>
        {/* Outer Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%", border: "2px dashed rgba(0,136,255,0.2)", borderRadius: "50%", animation: "spinClockwise 40s linear infinite" }} />
        {/* Middle Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "80%", height: "80%", border: "4px solid rgba(0,227,253,0.05)", borderTopColor: "rgba(0,136,255,0.4)", borderBottomColor: "rgba(0,136,255,0.4)", borderRadius: "50%", animation: "spinCounterClockwise 25s linear infinite" }} />
        {/* Inner Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "60%", height: "60%", border: "1px dotted rgba(0,227,253,0.5)", borderRadius: "50%", animation: "spinClockwise 15s linear infinite" }} />
        
        {/* Core Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(0,136,255,0.1) 0%, transparent 70%)", borderRadius: "50%", animation: "pulseOpacity 4s ease-in-out infinite" }} />
      </div>

      {/* Animated Tech/Computer Text Background */}
      <style>
        {`
          @keyframes scrollLoginBg {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
        `}
      </style>
      
      {/* Left side scrolling text */}
      <div style={{ position: "absolute", top: 0, left: "40px", bottom: 0, width: "250px", overflow: "hidden", zIndex: 1, pointerEvents: "none", opacity: 0.15, maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: mono, fontSize: "0.6rem", color: "#0088ff", animation: "scrollLoginBg 45s linear infinite", whiteSpace: "pre", letterSpacing: "0.15em", lineHeight: 1.8 }}>
          {Array(15).fill(`> INITIALIZING SECURE UPLINK...\n> ENCRYPTION PROTOCOL: ACTIVE\n> WAITING FOR OP_CREDENTIALS\n// SDC_NODE_01_CONNECTED\n0x0A99 0x1BFF\n0x2C44 0x88EF`).join("\n\n")}
        </div>
      </div>
      
      {/* Small Top-Right Jarvis HUD */}
      <div style={{ position: "absolute", top: "40px", right: "40px", width: "150px", height: "150px", pointerEvents: "none", zIndex: 0, opacity: 0.35 }}>
        {/* Outer Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%", border: "1px dashed rgba(0,136,255,0.3)", borderRadius: "50%", animation: "spinClockwise 30s linear infinite" }} />
        {/* Middle Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "80%", height: "80%", border: "2px solid rgba(0,227,253,0.05)", borderTopColor: "rgba(0,136,255,0.4)", borderBottomColor: "rgba(0,136,255,0.4)", borderRadius: "50%", animation: "spinCounterClockwise 20s linear infinite" }} />
        {/* Inner Ring (Prominent Dotted) */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "65%", height: "65%", border: "4px dotted rgba(0,227,253,0.9)", borderRadius: "50%", animation: "spinClockwise 12s linear infinite" }} />
        {/* Extra Inner Dotted Ring */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "45%", height: "45%", border: "2px dotted rgba(0,136,255,0.7)", borderRadius: "50%", animation: "spinCounterClockwise 8s linear infinite" }} />
        {/* Core Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(0,136,255,0.15) 0%, transparent 70%)", borderRadius: "50%", animation: "pulseOpacity 3s ease-in-out infinite" }} />
      </div>

      {/* Small Bottom-Right Globe HUD */}
      <div style={{ position: "absolute", bottom: "40px", right: "40px", width: "160px", height: "160px", pointerEvents: "none", zIndex: 0, opacity: 0.45, perspective: "800px" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: "spinGlobeY 18s linear infinite" }}>
          {/* Longitude lines (every 30 degrees) */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div key={`long-${deg}`} style={{ position: "absolute", inset: 0, border: "1px solid rgba(0,227,253,0.3)", borderRadius: "50%", transform: `rotateY(${deg}deg)` }} />
          ))}

          {/* Latitude lines */}
          {/* Equator (0 deg) */}
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(0,136,255,0.6)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(0px)" }} />
          
          {/* 30 deg N/S: size 138.5px, Z 40px */}
          <div style={{ position: "absolute", top: "10.75px", left: "10.75px", width: "138.5px", height: "138.5px", border: "1px solid rgba(0,136,255,0.4)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(40px)" }} />
          <div style={{ position: "absolute", top: "10.75px", left: "10.75px", width: "138.5px", height: "138.5px", border: "1px solid rgba(0,136,255,0.4)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(-40px)" }} />

          {/* 45 deg N/S: size 113.1px, Z 56.5px */}
          <div style={{ position: "absolute", top: "23.45px", left: "23.45px", width: "113.1px", height: "113.1px", border: "1px solid rgba(0,136,255,0.3)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(56.5px)" }} />
          <div style={{ position: "absolute", top: "23.45px", left: "23.45px", width: "113.1px", height: "113.1px", border: "1px solid rgba(0,136,255,0.3)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(-56.5px)" }} />

          {/* 60 deg N/S: size 80px, Z 69.2px */}
          <div style={{ position: "absolute", top: "40px", left: "40px", width: "80px", height: "80px", border: "1px solid rgba(0,136,255,0.2)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(69.2px)" }} />
          <div style={{ position: "absolute", top: "40px", left: "40px", width: "80px", height: "80px", border: "1px solid rgba(0,136,255,0.2)", borderRadius: "50%", transform: "rotateX(90deg) translateZ(-69.2px)" }} />
          
          {/* Axis Line */}
          <div style={{ position: "absolute", top: "-15%", bottom: "-15%", left: "50%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(0,227,253,0.8), transparent)", transform: "translateX(-50%)" }} />
        </div>
        {/* Core Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: "radial-gradient(circle, rgba(0,136,255,0.2) 0%, transparent 70%)", borderRadius: "50%", animation: "pulseOpacity 4s ease-in-out infinite" }} />
      </div>

      {/* Vertical LOADING Animation between the two right widgets */}
      <div style={{ position: "absolute", top: "50%", right: "115px", transform: "translate(50%, -50%) rotate(90deg)", fontFamily: mono, fontSize: "0.85rem", fontWeight: 800, color: "rgba(0,227,253,0.5)", letterSpacing: "0.5em", whiteSpace: "nowrap", zIndex: 1, pointerEvents: "none", minWidth: "150px" }}>
        {bgLoadingText}
      </div>

      {/* Alert Top */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px", fontFamily: mono, fontSize: "0.65rem",
        color: "#0088ff", border: "1px solid rgba(0,136,255,0.2)", padding: "8px 16px", borderRadius: "4px",
        background: "rgba(0,136,255,0.05)", marginBottom: "32px", letterSpacing: "0.08em", zIndex: 10,
        boxShadow: "0 0 20px rgba(0,136,255,0.1)"
      }}>
        <ShieldAlert size={16} />
        <span>{t('SECURE PORTAL: INTERNAL ACCESS ONLY')}</span>
      </div>

      {/* Main Glassmorphic Card */}
      <div style={{
        width: "100%", maxWidth: "440px", background: "rgba(14,14,16,0.6)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,136,255,0.15)", borderRadius: "12px", padding: "40px 32px", position: "relative", zIndex: 10,
        boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,136,255,0.05)"
      }}>
        {/* Glow behind card */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "12px", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        {/* Header with Logo */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <img src="/logo.png" alt="SDC Logo" style={{ height: "70px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 0 15px rgba(0,136,255,0.4))" }} />
          <div>
            <h3 style={{ fontFamily: display, fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "0.05em", marginBottom: "6px" }}>
              {t('UPLINK PROTOCOL', 'UPLINK PROTOCOL')}
            </h3>
            <p style={{ fontFamily: mono, fontSize: "0.65rem", color: "#6b7e67", letterSpacing: "0.05em" }}>
              {t('Authenticate to access SDC command grid.', 'Authenticate to access SDC command grid.')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          
          {/* Email Group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, color: "#84967e", letterSpacing: "0.1em" }}>{t('OPERATIVE EMAIL')}</label>
            <input 
              type="email" 
              placeholder="e.g. recruit@sdc.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'COMPILING'}
              style={{
                background: "rgba(5,6,8,0.7)", border: "1px solid rgba(0,136,255,0.2)", borderRadius: "6px",
                padding: "14px 16px", color: "#fff", fontFamily: mono, fontSize: "0.8rem", outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0088ff"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0,136,255,0.15)"; e.currentTarget.style.background = "rgba(0,136,255,0.02)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,136,255,0.2)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(5,6,8,0.7)"; }}
            />
          </div>

          {/* Password Group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: mono, fontSize: "0.6rem", fontWeight: 700, color: "#84967e", letterSpacing: "0.1em" }}>{t('ENCRYPTION KEY')}</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'COMPILING'}
                style={{
                  width: "100%", background: "rgba(5,6,8,0.7)", border: "1px solid rgba(0,136,255,0.2)", borderRadius: "6px",
                  padding: "14px 44px 14px 16px", color: "#fff", fontFamily: mono, fontSize: "0.8rem", outline: "none",
                  transition: "all 0.3s ease", boxSizing: "border-box"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0088ff"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0,136,255,0.15)"; e.currentTarget.style.background = "rgba(0,136,255,0.02)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,136,255,0.2)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(5,6,8,0.7)"; }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "12px", background: "none", border: "none", color: "#6b7e67",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {status === 'ERROR' && (
            <div style={{
              background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", padding: "10px",
              borderRadius: "4px", color: "#ff8888", fontFamily: mono, fontSize: "0.65rem", fontWeight: 700,
              textAlign: "center", letterSpacing: "0.05em"
            }}>
              {t('ACCESS DENIED: INVALID CREDENTIALS', 'ACCESS DENIED: INVALID CREDENTIALS')}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
            
            <button type="submit" disabled={status === 'COMPILING'}
              style={{
                fontFamily: mono, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#001133",
                background: "linear-gradient(135deg, #0088ff, #00e3fd)", border: "none", padding: "12px 28px",
                borderRadius: "4px", cursor: "pointer", transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(0,136,255,0.4)"
              }}
              onMouseEnter={(e) => { if (status !== 'COMPILING') { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,136,255,0.6)"; } }}
              onMouseLeave={(e) => { if (status !== 'COMPILING') { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,136,255,0.4)"; } }}
            >
              {status === 'COMPILING' ? t('AUTHENTICATING...', 'AUTHENTICATING...') : t('SECURE UPLINK', 'SECURE UPLINK')}
            </button>

            <button type="button" onClick={() => navigate('/')}
              style={{
                fontFamily: mono, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", color: "#84967e",
                background: "transparent", border: "none", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#84967e"}
            >
              {t('ABORT MISSION', 'ABORT MISSION')}
            </button>

          </div>
        </form>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "40px", fontFamily: mono, fontSize: "0.55rem", color: "rgba(132,150,126,0.6)", letterSpacing: "0.15em", fontWeight: 700, zIndex: 10 }}>
        {t('SDC PORTAL | SECURE ACCESS TERMINAL', 'SDC PORTAL | SECURE ACCESS TERMINAL')}
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';

const SVGWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      width: '100%', 
      height: '100%', 
      filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.75))'
    }}
  >
    {children}
  </svg>
);

export const RavenAvatar: React.FC = () => (
  <SVGWrapper>
    {/* Background soft glow circle */}
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Raven Head Silhouette facing right */}
    <path 
      d="M26 68 
         C28 58, 30 48, 42 36 
         C52 26, 68 20, 82 25 
         C76 34, 70 42, 60 45 
         C52 47, 46 50, 44 56 
         C40 64, 42 74, 38 80 
         C31 77, 27 72, 26 68 Z" 
      fill="#050a12" 
      stroke="#00e5ff" 
      strokeWidth="2" 
    />
    <path d="M43 37 C46 45, 48 56, 42 64" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Glowing Eye */}
    <circle cx="62" cy="33" r="2" fill="#00e5ff" />
    {/* Feather cuts */}
    <path d="M32 60 L 39 53" stroke="#00e5ff" strokeWidth="1.5" />
    <path d="M28 66 L 35 58" stroke="#00e5ff" strokeWidth="1.5" />
  </SVGWrapper>
);

export const Neo3Blad3Avatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Shoulders / Collar */}
    <path d="M25 80 L 33 66 C 36 60, 42 58, 50 58 C 58 58, 64 60, 67 66 L 75 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Neck */}
    <path d="M44 58 L 44 64 M 56 58 L 56 64" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Face */}
    <path d="M38 34 C 38 34, 34 46, 36 56 C 38 64, 44 68, 50 68 C 56 68, 62 64, 64 56 C 66 46, 62 34, 62 34 Z" fill="#050a12" stroke="#00e5ff" strokeWidth="2" />
    {/* Spiky hair */}
    <path d="M35 34 L 31 28 L 38 27 L 40 16 L 47 21 L 52 11 L 57 21 L 64 16 L 66 27 L 73 28 L 69 34" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Hacking glasses */}
    <path d="M37 43 H 63 V 51 H 37 Z" fill="#060d16" stroke="#00e5ff" strokeWidth="2" />
    <line x1="37" y1="47" x2="63" y2="47" stroke="#00e5ff" strokeWidth="1" />
  </SVGWrapper>
);

export const PhantomOpsAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Outer Hood */}
    <path d="M22 80 C 22 52, 30 30, 50 20 C 70 30, 78 52, 78 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Inner shadow layer */}
    <path d="M34 80 C 34 60, 42 46, 50 46 C 58 46, 66 60, 66 80 Z" fill="#060d16" />
    {/* Cyber Mask & Shades */}
    <path d="M38 72 C 38 65, 42 55, 50 55 C 58 55, 62 65, 62 72 Z" fill="#050a12" stroke="#00e5ff" strokeWidth="1.5" />
    <path d="M41 59 H 47 V 63 H 41 Z M 59 59 H 53 V 63 H 59 Z" fill="#00e5ff" stroke="#00e5ff" strokeWidth="1" />
    <line x1="47" y1="61" x2="53" y2="61" stroke="#00e5ff" strokeWidth="1.5" />
  </SVGWrapper>
);

export const CircuitBreakerAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Collar */}
    <path d="M24 80 L 32 64 H 68 L 76 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Helmet */}
    <circle cx="50" cy="44" r="20" fill="#050a12" stroke="#00e5ff" strokeWidth="2" />
    {/* Cyber Visor */}
    <path d="M33 38 H 67 V 48 H 33 Z" fill="#060d16" stroke="#00e5ff" strokeWidth="2" />
    <line x1="33" y1="43" x2="67" y2="43" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Antennas */}
    <line x1="33" y1="32" x2="27" y2="24" stroke="#00e5ff" strokeWidth="2" />
    <line x1="67" y1="32" x2="73" y2="24" stroke="#00e5ff" strokeWidth="2" />
    <circle cx="27" cy="24" r="1.5" fill="#00e5ff" />
    <circle cx="73" cy="24" r="1.5" fill="#00e5ff" />
  </SVGWrapper>
);

export const NeuralSpikeAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Shoulders */}
    <path d="M26 80 L 32 70 L 40 68 L 50 70 L 60 68 L 68 70 L 74 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Head */}
    <path d="M38 38 C 38 38, 34 46, 36 56 C 38 64, 44 66, 50 66 C 56 66, 62 64, 64 56 C 66 46, 62 38, 62 38 Z" fill="#050a12" stroke="#00e5ff" strokeWidth="2" />
    {/* Spiky Hair */}
    <path d="M38 38 L 32 26 L 43 30 L 50 14 L 57 30 L 68 26 L 62 38" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Round target spectacles */}
    <circle cx="43" cy="48" r="6" fill="#060d16" stroke="#00e5ff" strokeWidth="1.5" />
    <circle cx="57" cy="48" r="6" fill="#060d16" stroke="#00e5ff" strokeWidth="1.5" />
    <line x1="37" y1="48" x2="63" y2="48" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Target reticle ticks */}
    <path d="M43 42 V 45 M 43 51 V 54" stroke="#00e5ff" strokeWidth="1" />
    <path d="M57 42 V 45 M 57 51 V 54" stroke="#00e5ff" strokeWidth="1" />
  </SVGWrapper>
);

export const GhostCodeAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Deep Dark Hood */}
    <path d="M22 80 C 22 42, 30 20, 50 20 C 70 20, 78 42, 78 80 Z" fill="#050a12" stroke="#00e5ff" strokeWidth="2" />
    <path d="M34 80 C 34 62, 42 48, 50 48 C 58 48, 66 62, 66 80 Z" fill="#060d16" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Slit glowing eyes */}
    <polygon points="40,58 46,55 43,61" fill="#00e5ff" />
    <polygon points="60,58 54,55 57,61" fill="#00e5ff" />
  </SVGWrapper>
);

export const ZeroDayAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Neck collar shroud */}
    <path d="M26 80 L 32 64 C 36 58, 42 56, 50 56 C 58 56, 64 58, 68 64 L 74 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* Android sleek face */}
    <path d="M35 44 C 35 30, 41 24, 50 24 C 59 24, 65 30, 65 44 C 65 54, 59 60, 50 60 C 41 60, 35 54, 35 44 Z" fill="#060d16" stroke="#00e5ff" strokeWidth="2" />
    {/* Solid glowing horizontal eyes */}
    <ellipse cx="44" cy="42" rx="4" ry="1.5" fill="#00e5ff" />
    <ellipse cx="56" cy="42" rx="4" ry="1.5" fill="#00e5ff" />
  </SVGWrapper>
);

export const DataStrikerAvatar: React.FC = () => (
  <SVGWrapper>
    <circle cx="50" cy="50" r="42" fill="rgba(0, 229, 255, 0.05)" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
    {/* Heavy Shoulders */}
    <path d="M22 80 L 30 66 H 70 L 78 80" stroke="#00e5ff" strokeWidth="2" fill="#050a12" />
    {/* VR/Strike Helmet */}
    <rect x="31" y="24" width="38" height="36" rx="6" fill="#050a12" stroke="#00e5ff" strokeWidth="2" />
    {/* Horizontal visor screen */}
    <path d="M31 36 H 69 V 46 H 31 Z" fill="#060d16" stroke="#00e5ff" strokeWidth="2" />
    <line x1="31" y1="41" x2="69" y2="41" stroke="#00e5ff" strokeWidth="1.5" />
    {/* Helmet stripes */}
    <line x1="42" y1="28" x2="42" y2="32" stroke="#00e5ff" strokeWidth="1.5" />
    <line x1="50" y1="28" x2="50" y2="32" stroke="#00e5ff" strokeWidth="1.5" />
    <line x1="58" y1="28" x2="58" y2="32" stroke="#00e5ff" strokeWidth="1.5" />
  </SVGWrapper>
);

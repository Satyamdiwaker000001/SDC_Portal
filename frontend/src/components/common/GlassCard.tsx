import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style, className = "", onClick, hoverEffect = false }) => {
  return (
    <div 
      className={`liquid-glass ${className}`}
      onClick={onClick}
      style={{
        padding: "32px",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        cursor: onClick ? "pointer" : "default",
        transform: "translateY(0)",
        ...style
      }}
      onMouseEnter={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
        }
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;

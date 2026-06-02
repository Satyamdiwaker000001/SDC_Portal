import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  hoverBg?: string;
  hoverBorder?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  className = "", 
  onClick, 
  hoverEffect = false,
  hoverBg,
  hoverBorder
}) => {
  const defaultBg = style?.background || "rgba(255, 255, 255, 0.03)";
  const defaultBorderColor = style?.borderColor || "rgba(255, 255, 255, 0.05)";
  
  const effectiveHoverBg = hoverBg || (style?.background ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.06)");
  const effectiveHoverBorder = hoverBorder || (style?.borderColor ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.15)");

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
          e.currentTarget.style.background = effectiveHoverBg;
          e.currentTarget.style.borderColor = effectiveHoverBorder;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.background = defaultBg as string;
          e.currentTarget.style.borderColor = defaultBorderColor as string;
        }
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;

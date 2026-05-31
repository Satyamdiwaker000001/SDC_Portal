import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'glass';
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ variant = 'glass', children, style, ...props }) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      padding: "12px 32px",
      borderRadius: "9999px",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      ...style
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          background: "#fff",
          color: "#131313",
        };
      case 'outline':
        return {
          ...base,
          background: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)",
        };
      case 'glass':
      default:
        return {
          ...base,
          background: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        };
    }
  };

  return (
    <button 
      {...(variant === 'glass' ? { className: `liquid-glass ${props.className || ''}` } : { className: props.className })}
      style={getStyles()}
      onMouseEnter={(e) => {
        if (variant === 'glass') e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        else if (variant === 'outline') e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        else if (variant === 'primary') e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        if (variant === 'glass') e.currentTarget.style.background = "transparent";
        else if (variant === 'outline') e.currentTarget.style.background = "transparent";
        else if (variant === 'primary') e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
      onMouseUp={(e) => e.currentTarget.style.transform = variant === 'primary' ? "scale(1.05)" : "scale(1)"}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;

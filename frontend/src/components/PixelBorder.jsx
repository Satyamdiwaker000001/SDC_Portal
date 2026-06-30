import React from 'react';

const PixelBorder = ({ children, className = '', color = 'var(--color-retro-dark)' }) => {
  return (
    <div 
      className={`relative bg-retro-bg border-4 ${className}`}
      style={{ borderColor: color, boxShadow: `6px 6px 0px 0px ${color}` }}
    >
      {/* Corner cutouts for pixel effect */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-retro-bg" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-retro-bg" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-retro-bg" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-retro-bg" />
      
      {/* Inset highlight */}
      <div className="relative z-10 w-full h-full p-4 border-t-2 border-l-2 border-white/10">
        {children}
      </div>
    </div>
  );
};

export default PixelBorder;

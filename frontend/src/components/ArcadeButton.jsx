import React from 'react';

const ArcadeButton = ({ children, className = '', onClick, variant = 'primary', ...props }) => {
  // Variants for different button colors
  const variants = {
    primary: 'bg-retro-yellow text-retro-dark pixel-shadow-sm hover:pixel-shadow-sm',
    secondary: 'bg-retro-bg text-white border-2 border-retro-dark pixel-shadow hover:pixel-shadow',
    accent: 'bg-retro-cyan text-retro-dark pixel-shadow-sm hover:pixel-shadow-sm',
    danger: 'bg-retro-red text-white pixel-shadow hover:pixel-shadow',
    nav: 'bg-retro-bg text-white border-2 border-retro-dark shadow-[4px_4px_0px_0px_#1A1A1A] hover:bg-gray-800'
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center 
        px-6 py-3 font-pixel text-xs sm:text-sm uppercase tracking-widest
        transition-all duration-100 ease-in-out
        active:translate-y-1 active:shadow-[1px_1px_0px_0px_#1A1A1A]
        focus:outline-none focus:ring-2 focus:ring-retro-cyan focus:ring-offset-2 focus:ring-offset-retro-bg
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Optional inset highlight for physical button feel */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-white/20 pointer-events-none" />
    </button>
  );
};

export default ArcadeButton;

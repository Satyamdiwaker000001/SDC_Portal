import React from 'react';
import Tilt from 'react-parallax-tilt';

export const PixelCard = ({ 
  children, 
  className = '', 
  hoverGlow = true, 
  onClick 
}) => {
  const Component = onClick ? 'button' : 'div';
  
  const cardContent = (
    <div
      className={`
        relative bg-bg-card border border-border-glow rounded-xl p-6
        transition-all duration-300
        ${hoverGlow ? 'hover:border-accent-cyan hover:shadow-[0_0_30px_rgba(0,255,245,0.2)]' : ''}
        ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
      }}
    >
      <div className="absolute inset-0 border border-accent-cyan/20 rounded-xl pointer-events-none opacity-0 transition-opacity duration-300" />
      {children}
    </div>
  );

  if (hoverGlow && !onClick) {
    return (
      <Tilt
        options={{
          max: 8,
          speed: 400,
          glare: true,
          'max-glare': 0.15,
          scale: 1.02,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {cardContent}
      </Tilt>
    );
  }

  return <Component onClick={onClick}>{cardContent}</Component>;
};

export const PixelCardHeader = ({ 
  title, 
  subtitle, 
  badge, 
  icon 
}) => (
  <div className="flex items-start gap-3 mb-4">
    {icon && (
      <div className="w-12 h-12 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-display text-lg text-fg-primary truncate">{title}</h3>
        {badge && (
          <span className="px-2 py-0.5 text-xs font-mono bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-fg-muted">{subtitle}</p>}
    </div>
  </div>
);
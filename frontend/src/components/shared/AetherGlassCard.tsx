import React from 'react';
import { cn } from '../../utils/cn';

interface AetherGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function AetherGlassCard({ children, className, onClick }: AetherGlassCardProps) {
  return (
    <div
      className={cn(
        "crystal-card p-6 relative overflow-hidden group",
        onClick && "cursor-pointer crystal-card-hover",
        className
      )}
      onClick={onClick}
    >
      {/* Dynamic Shine Sweep */}
      <div 
        className={cn(
          "absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-tr from-transparent via-white/40 to-transparent",
          "-translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
        )}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
      
      {/* Meaningful Gaming Accent Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-sky-400/50 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

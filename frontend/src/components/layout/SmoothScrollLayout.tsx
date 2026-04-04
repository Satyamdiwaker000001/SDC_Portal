import React, { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out quart
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent w-full text-carbon-black-100 dark:text-bright-snow-900">
      {/* Lens Flare Effect */}
      <div className="pointer-events-none fixed top-0 right-0 w-[80vw] h-[80vh] bg-bright-snow-DEFAULT opacity-5 blur-[120px] mix-blend-screen rounded-full z-0 pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}

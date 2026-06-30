import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArcadeButton from './ArcadeButton';

const IntroScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleComplete = React.useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 800); // Wait for exit animation
  }, [onComplete]);

  // Fallback to auto-skip if user does nothing for a long time
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 15000);
    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0E1A] overflow-hidden"
        >
          {/* Subtle starfield in background */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0E1A] to-[#000000]"></div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col items-center p-8 bg-black/40 border-2 border-retro-cyan backdrop-blur-sm rounded-lg"
            style={{ boxShadow: "0 0 20px rgba(197, 246, 255, 0.2), inset 0 0 20px rgba(197, 246, 255, 0.1)" }}
          >
            <h1 className="font-pixel text-xl md:text-2xl text-white text-center mb-10 leading-relaxed text-shadow-pixel">
              DO YOU WANT TO ENTER<br/><span className="text-retro-cyan">THE RETRO WORLD?</span>
            </h1>
            
            <div className="flex gap-6 mb-8">
              <ArcadeButton onClick={handleComplete} variant="primary" className="!bg-[#16A34A] !text-white !border-[#065F46] hover:!bg-[#15803D]">
                YES
              </ArcadeButton>
              <ArcadeButton onClick={handleComplete} variant="danger" className="!bg-[#DC2626] !text-white !border-[#991B1B] hover:!bg-[#B91C1C]">
                NO
              </ArcadeButton>
            </div>
            
            <button 
              onClick={handleComplete}
              className="font-pixel text-[10px] md:text-xs bg-retro-yellow text-black px-4 py-2 hover:bg-white transition-colors"
            >
              SKIP INTRO
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;

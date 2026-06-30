import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loaderMessages = [
  'INITIALIZING SDC OS...',
  'LOADING NEURAL INTERFACE...',
  'CALIBRATING HOLOGRAPHIC DISPLAY...',
  'SYNCING WITH SATELLITE NETWORK...',
  'DECRYPTING CLASSIFIED DATA...',
  'SYSTEM READY.',
];

const TerminalLine = ({ text, delay }) => {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      const typeTimer = setInterval(() => {
        if (charIndex < text.length) {
          setTyped(text.slice(0, charIndex + 1));
          setCharIndex((i) => i + 1);
        } else {
          clearInterval(typeTimer);
        }
      }, 30);
      return () => clearInterval(typeTimer);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, charIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-mono text-xs text-accent-cyan"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      <span className="text-accent-gold">[SDC]</span> {typed}
      {visible && charIndex === text.length && <span className="animate-pulse text-accent-cyan">_</span>}
    </motion.div>
  );
};

export const TransitionOverlay = ({ isLoading, onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % (loaderMessages.length - 1));
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(() => {
            setShowComplete(true);
            setTimeout(() => onComplete?.(), 500);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, onComplete]);

  if (!isLoading && !showComplete) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading || showComplete ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-deep"
          style={{ backgroundColor: '#050508' }}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-border-glow rounded-full border-t-accent-cyan animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-3xl font-bold text-accent-cyan"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  SDC
                </motion.span>
              </div>
            </div>

            <div className="w-80 px-4">
              <div className="bg-bg-card border border-border-glow rounded p-4 mb-4 overflow-hidden">
                <div className="space-y-2 min-h-[120px]">
                  {loaderMessages.slice(0, loaderMessages.length - 1).map((msg, i) => (
                    <TerminalLine key={i} text={msg} delay={i * 800} />
                  ))}
                  <AnimatePresence mode="wait">
                    {showComplete && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-mono text-xs text-accent-green"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        <span className="text-accent-gold">]</span> {loaderMessages[loaderMessages.length - 1]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-bg-deep border border-border-glow rounded overflow-hidden h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-magenta"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 245, 0.6)' }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: showComplete ? 1 : 0 }}
                className="mt-3 text-center font-mono text-xs text-fg-muted"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {showComplete ? 'PRESS ANY KEY TO CONTINUE' : `BOOT PROGRESS: ${Math.floor(progress)}%`}
              </motion.p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-fg-muted text-xs">
            <kbd className="px-2 py-1 bg-bg-card border border-border-glow rounded">ESC</kbd>
            <span>SKIP</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export const usePageTransition = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return { isLoading, setIsLoading };
};
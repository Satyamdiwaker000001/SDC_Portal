/* cspell:disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../../utils/SoundManager';

interface HackyTextProps {
  text: string;
  className?: string;
  playOnHover?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

export const HackyText: React.FC<HackyTextProps> = ({ text, className, playOnHover = true }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    soundManager.playHover();

    intervalRef.current = window.setInterval(() => {
      setDisplayText(text.split("").map((_, index) => {
        if (index < iteration) return text[index];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (!playOnHover) {
       startScramble();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, playOnHover, startScramble]);

  return (
    <span 
      className={className}
      onMouseEnter={() => {
        if (playOnHover) {
          startScramble();
        }
      }}
    >
      {displayText}
    </span>
  );
};

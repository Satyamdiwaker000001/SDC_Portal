import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

export const GlitchTitle = styled(motion.h1)`
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  position: relative;
  color: white;
  
  &:hover {
    animation: ${glitch} 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: -2px;
      width: 100%;
      height: 100%;
      background: var(--bg-dark);
      color: var(--accent-primary);
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
    }
  }
`;

export const HUDBorder = styled.div`
  position: relative;
  border: 1px solid rgba(238, 28, 37, 0.1);
  padding: 30px;
  background: rgba(10, 5, 5, 0.6);
  backdrop-filter: blur(10px);
  
  &::before, &::after, .corner-tl, .corner-br {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent-secondary);
  }
  
  &::before { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
  &::after { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
  
  .corner-bl {
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent-secondary);
    border-right: 0;
    border-top: 0;
  }
  
  .corner-br {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent-secondary);
    border-left: 0;
    border-top: 0;
  }
`;

export const TerminalText: React.FC<{ text: string, speed?: number }> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return (
    <span className="terminal-typing" style={{ color: 'white', fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '0.05em' }}>
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ borderLeft: '10px solid var(--accent-secondary)', marginLeft: '6px' }}
      />
    </span>
  );
};

export const DecoLine = styled(motion.div)`
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  width: 100%;
  margin: 20px 0;
  opacity: 0.4;
`;

export const TacticalBadge = styled.span`
  background: rgba(238, 28, 37, 0.1);
  border-left: 3px solid var(--accent-secondary);
  color: var(--accent-secondary);
  padding: 5px 14px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 800;
`;

export const BrutalistCard = styled(motion.div)`
  background: rgba(10, 5, 5, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 35px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-primary);
    box-shadow: 0 10px 30px rgba(238, 28, 37, 0.1);
  }
`;

export const BrutalistHeader = styled.div`
  margin-bottom: 60px;
  .id {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--accent-primary);
    font-weight: 900;
    letter-spacing: 0.3em;
    display: block;
    margin-bottom: 12px;
  }
  h2 {
    font-family: var(--font-display);
    font-size: 2.75rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: white;
  }
  @media (max-width: 768px) { h2 { font-size: 2rem; } }
`;

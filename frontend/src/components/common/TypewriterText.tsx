import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSound } from '../../context/SoundContext';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  glitch?: boolean;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 0,
  glitch = false,
  className
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const { playTypeClick } = useSound();

  useEffect(() => {
    let index = 0;
    let timer: ReturnType<typeof setInterval>;

    const startTyping = () => {
      timer = setInterval(() => {
        if (index < text.length) {
          const char = text.charAt(index);
          setDisplayedText((prev) => prev + char);
          if (char !== ' ') {
            playTypeClick();
          }
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [text, speed, delay]);

  return (
    <TextContainer
      className={`${className} ${glitch ? 'cyber-glitch' : ''}`}
      data-text={displayedText}
    >
      {displayedText}
      <Cursor className="blink">_</Cursor>
    </TextContainer>
  );
};

const TextContainer = styled.span`
  font-family: var(--font-mono);
  font-weight: bold;
`;

const Cursor = styled.span`
  color: var(--text-cyan);
  &.blink {
    animation: blink-anim 0.8s infinite steps(2);
  }
  @keyframes blink-anim {
    to { opacity: 0; }
  }
`;

export default TypewriterText;

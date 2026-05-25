import React from 'react';
import styled from 'styled-components';
import { useSound } from '../../context/SoundContext';

interface CombatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'red' | 'amber';
  glow?: boolean;
  children: React.ReactNode;
}

const CombatButton: React.FC<CombatButtonProps> = ({
  variant = 'cyan',
  glow = true,
  children,
  onClick,
  onMouseEnter,
  ...props
}) => {
  const { playHover, playClick } = useSound();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <StyledButton
      $variant={variant}
      $glow={glow}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      <div className="btn-inner">
        <span className="tech-corner tl" />
        <span className="tech-corner br" />
        <span className="btn-text">{children}</span>
      </div>
    </StyledButton>
  );
};

const StyledButton = styled.button<{ $variant: 'cyan' | 'red' | 'amber'; $glow: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;

  --color-theme: ${props => 
    props.$variant === 'red' ? 'var(--border-red)' : 
    props.$variant === 'amber' ? 'var(--border-amber)' : 
    'var(--border-cyan)'
  };
  
  --shadow-theme: ${props => 
    props.$variant === 'red' ? 'var(--hud-glow-red)' : 
    props.$variant === 'amber' ? 'var(--hud-glow-amber)' : 
    'var(--hud-glow)'
  };

  .btn-inner {
    background: rgba(10, 18, 30, 0.6);
    border: 1px solid var(--color-theme);
    padding: 12px 24px;
    color: var(--color-theme);
    position: relative;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: all 0.2s ease;
    box-shadow: ${props => props.$glow ? 'var(--shadow-theme)' : 'none'};

    &:hover {
      background: var(--color-theme);
      color: #050a12;
      box-shadow: 0 0 20px var(--color-theme);
    }
  }

  .tech-corner {
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid var(--color-theme);
    pointer-events: none;
    &.tl {
      top: -2px; left: -2px;
      border-right: none; border-bottom: none;
    }
    &.br {
      bottom: -2px; right: -2px;
      border-left: none; border-top: none;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default CombatButton;

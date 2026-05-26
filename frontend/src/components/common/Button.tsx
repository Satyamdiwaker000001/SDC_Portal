import React from 'react';
import styled from 'styled-components';
import { useSound } from '../../context/SoundContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'red' | 'amber';
  glow?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'cyan',
  glow = true,
  children,
  onClick,
  onMouseEnter,
  ...props
}) => {
  const { playHover, playClick } = useSound();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    try { playHover(); } catch (_) {}
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    try { playClick(); } catch (_) {}
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
      <span className="btn-text">{children}</span>
    </StyledButton>
  );
};

const StyledButton = styled.button<{ $variant: 'cyan' | 'red' | 'amber'; $glow: boolean }>`
  background: ${props =>
    props.$variant === 'red' ? 'rgba(244, 63, 94, 0.1)' :
    props.$variant === 'amber' ? 'rgba(245, 158, 11, 0.1)' :
    'rgba(99, 102, 241, 0.1)'
  };
  border: 1.5px solid ${props =>
    props.$variant === 'red' ? 'var(--border-red)' :
    props.$variant === 'amber' ? 'var(--border-amber)' :
    'var(--border-cyan)'
  };
  color: ${props =>
    props.$variant === 'red' ? 'var(--text-red)' :
    props.$variant === 'amber' ? 'var(--text-amber)' :
    'var(--text-cyan)'
  };
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover {
    background: ${props =>
      props.$variant === 'red' ? 'var(--border-red)' :
      props.$variant === 'amber' ? 'var(--border-amber)' :
      'var(--border-cyan)'
    };
    color: #060813;
    box-shadow: ${props =>
      !props.$glow ? 'none' :
      props.$variant === 'red' ? '0 0 15px rgba(244, 63, 94, 0.4)' :
      props.$variant === 'amber' ? '0 0 15px rgba(245, 158, 11, 0.4)' :
      '0 0 15px rgba(99, 102, 241, 0.4)'
    };
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--text-dim);
    box-shadow: none;
    transform: none;
  }
`;

export default Button;

import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-heading);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: var(--radius-md);
  transition: all var(--transition-speed);
  cursor: pointer;
  border: 1px solid transparent;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;

  /* Sizes */
  ${props => {
    switch (props.size) {
      case 'sm': return css`padding: 0 12px; height: 32px; font-size: 0.65rem;`;
      case 'lg': return css`padding: 0 24px; height: 48px; font-size: 0.85rem;`;
      case 'xl': return css`padding: 0 32px; height: 56px; font-size: 0.95rem;`;
      default: return css`padding: 0 20px; height: 42px; font-size: 0.75rem;`;
    }
  }}

  /* Variants */
  ${props => {
    switch (props.variant) {
      case 'secondary': return css`
        background: transparent;
        border-color: var(--ui-secondary);
        color: var(--ui-secondary);
        &:hover:not(:disabled) {
          background: rgba(var(--color-secondary-rgb), 0.05);
          box-shadow: 0 4px 15px rgba(0, 118, 228, 0.2);
        }
      `;
      case 'danger': return css`
        background: var(--accent-error, #FB7185);
        color: white;
        &:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: 0 4px 20px rgba(251, 113, 133, 0.4);
        }
      `;
      case 'ghost': return css`
        background: transparent;
        color: var(--text-main);
        &:hover:not(:disabled) {
          background: var(--bg-card);
          color: var(--ui-primary);
        }
      `;
      default: return css`
        background: var(--ui-primary);
        color: white;
        &:hover:not(:disabled) {
          filter: brightness(1.2);
          box-shadow: 0 6px 20px rgba(0, 41, 107, 0.4);
        }
      `;
    }
  }}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
  }

  /* Clip-path for tactical look (Optional, can be toggled) */
  clip-path: polygon(
    0 0, 
    calc(100% - 10px) 0, 
    100% 10px, 
    100% 100%, 
    10px 100%, 
    0 calc(100% - 10px)
  );
`;

const CyberButton: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { variant = 'primary', size = 'md', isLoading, children, iconLeft, iconRight, ...props }, 
  ref
) => {
  return (
    <StyledButton ref={ref} variant={variant} size={size} {...props}>
      {isLoading ? <div className="spinner" /> : iconLeft}
      {!isLoading && children}
      {!isLoading && iconRight}
    </StyledButton>
  );
});

CyberButton.displayName = 'CyberButton';

export default CyberButton;

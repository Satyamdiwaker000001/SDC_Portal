import React from 'react';
import styled from 'styled-components';

interface BunkerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cyan' | 'red' | 'amber';
  glow?: boolean;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

const BunkerCard: React.FC<BunkerCardProps> = ({
  variant = 'cyan',
  glow = true,
  label,
  className,
  children,
  ...props
}) => {
  return (
    <StyledCard $variant={variant} $glow={glow} className={className} {...props}>
      {label && (
        <CardLabel className="card-label">
          <span className="dot" /> {label}
        </CardLabel>
      )}
      <div className="card-corners tl" />
      <div className="card-corners tr" />
      <div className="card-corners bl" />
      <div className="card-corners br" />
      <div className="card-content">{children}</div>
    </StyledCard>
  );
};

const StyledCard = styled.div<{ $variant: 'cyan' | 'red' | 'amber'; $glow: boolean }>`
  background: var(--bg-panel);
  border: 1px solid ${props => 
    props.$variant === 'red' ? 'rgba(239, 35, 60, 0.4)' : 
    props.$variant === 'amber' ? 'rgba(255, 170, 0, 0.4)' : 
    'rgba(0, 240, 255, 0.25)'
  };
  border-radius: 4px;
  position: relative;
  backdrop-filter: blur(12px);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${props => 
    !props.$glow ? 'none' :
    props.$variant === 'red' ? '0 0 15px rgba(239, 35, 60, 0.1)' : 
    props.$variant === 'amber' ? '0 0 15px rgba(255, 170, 0, 0.1)' : 
    '0 0 15px rgba(0, 240, 255, 0.08)'
  };

  &:hover {
    border-color: ${props => 
      props.$variant === 'red' ? 'var(--border-red)' : 
      props.$variant === 'amber' ? 'var(--border-amber)' : 
      'var(--border-cyan)'
    };
    box-shadow: ${props => 
      props.$variant === 'red' ? 'var(--hud-glow-red)' : 
      props.$variant === 'amber' ? 'var(--hud-glow-amber)' : 
      'var(--hud-glow)'
    };
  }

  .card-corners {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid ${props => 
      props.$variant === 'red' ? 'var(--border-red)' : 
      props.$variant === 'amber' ? 'var(--border-amber)' : 
      'var(--border-cyan)'
    };
    pointer-events: none;

    &.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
    &.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
    &.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
    &.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  }
`;

const CardLabel = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background: var(--bg-main);
  padding: 0 10px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--text-dim);
  border: 1px solid rgba(127, 140, 157, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;

  .dot {
    width: 6px;
    height: 6px;
    background: var(--border-cyan);
    border-radius: 50%;
    box-shadow: var(--hud-glow);
  }
`;

export default BunkerCard;

import React from 'react';
import styled from 'styled-components';

interface CardProps {
  variant?: 'cyan' | 'red' | 'amber' | 'pink';
  glow?: boolean;
  label?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  id?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'cyan',
  glow = true,
  label,
  className,
  children,
  style,
  onClick,
  id,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $glow={glow}
      $hasLabel={!!label}
      className={className}
      style={style}
      onClick={onClick}
      id={id}
    >
      {label && (
        <CardLabel className="card-label" $variant={variant}>
          <span className="dot" /> {label}
        </CardLabel>
      )}
      <div className="card-content">{children}</div>
    </StyledCard>
  );
};

const StyledCard = styled.div<{
  $variant: 'cyan' | 'red' | 'amber' | 'pink';
  $glow: boolean;
  $hasLabel: boolean;
}>`
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid ${props =>
    props.$variant === 'red' ? 'rgba(244, 63, 94, 0.15)' :
    props.$variant === 'amber' ? 'rgba(245, 158, 11, 0.15)' :
    props.$variant === 'pink' ? 'rgba(168, 85, 247, 0.15)' :
    'rgba(99, 102, 241, 0.15)'
  };
  border-radius: 12px;
  position: relative;
  backdrop-filter: blur(16px);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: ${props =>
      props.$variant === 'red' ? 'var(--border-red)' :
      props.$variant === 'amber' ? 'var(--border-amber)' :
      props.$variant === 'pink' ? 'var(--border-pink)' :
      'var(--border-cyan)'
    };
    transform: translateY(-2px);
    box-shadow: ${props =>
      !props.$glow ? '0 10px 30px rgba(0, 0, 0, 0.3)' :
      props.$variant === 'red' ? 'var(--hud-glow-red)' :
      props.$variant === 'amber' ? 'var(--hud-glow-amber)' :
      props.$variant === 'pink' ? 'var(--hud-glow-pink)' :
      'var(--hud-glow)'
    };
  }

  .card-content {
    margin-top: ${props => props.$hasLabel ? '4px' : '0'};
    color: var(--text-primary);
  }
`;

const CardLabel = styled.div<{ $variant: 'cyan' | 'red' | 'amber' | 'pink' }>`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  text-transform: uppercase;

  .dot {
    width: 8px;
    height: 8px;
    background: ${props =>
      props.$variant === 'red' ? 'var(--border-red)' :
      props.$variant === 'amber' ? 'var(--border-amber)' :
      props.$variant === 'pink' ? 'var(--border-pink)' :
      'var(--border-cyan)'
    };
    border-radius: 50%;
    box-shadow: ${props =>
      props.$variant === 'red' ? '0 0 8px var(--border-red)' :
      props.$variant === 'amber' ? '0 0 8px var(--border-amber)' :
      props.$variant === 'pink' ? '0 0 8px var(--border-pink)' :
      '0 0 8px var(--border-cyan)'
    };
  }
`;

export default Card;

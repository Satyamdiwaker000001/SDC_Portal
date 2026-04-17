import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface FrostCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  team?: string;
  type?: string;
  desc?: string;
  accentColor?: string;
  isHoverable?: boolean;
  isGlowing?: boolean;
  elevation?: 'low' | 'medium' | 'high';
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled(motion.div)<FrostCardProps>`
  position: relative;
  background: var(--bg-glass);
  backdrop-filter: var(--glass-blur);
  border: var(--border-glass);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  overflow: hidden;
  transition: all var(--transition-speed);

  /* Elevation Shadows */
  ${props => {
    switch (props.elevation) {
      case 'low': return css`box-shadow: var(--shadow-sm);`;
      case 'high': return css`box-shadow: var(--shadow-2xl);`;
      default: return css`box-shadow: var(--shadow-lg);`;
    }
  }}

  /* Hover Effects */
  ${props => props.isHoverable && css`
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-2xl);
      border-color: var(--ui-accent);
      &::after { opacity: 0.1; }
    }
  `}

  /* Glow Effect */
  ${props => props.isGlowing && css`
    &::before {
      content: '';
      position: absolute;
      inset: -1px;
      padding: 1px;
      border-radius: inherit;
      background: linear-gradient(135deg, ${props.accentColor || 'var(--ui-accent)'}, transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.5;
    }
  `}

  /* Interior Glow Accent Overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 200px; height: 200px;
    background: radial-gradient(circle, ${props => props.accentColor || 'var(--ui-accent)'}15 0%, transparent 70%);
    pointer-events: none;
    opacity: 0.05;
    transition: opacity 0.3s;
  }
`;

const FrostCard: React.FC<FrostCardProps> = ({ 
  children, 
  title,
  subtitle,
  description,
  team,
  type,
  desc,
  isHoverable = true, 
  elevation = 'medium',
  ...props 
}) => {
  const finalDesc = description || desc;
  const finalSubtitle = subtitle || (type && team ? `${type} // ${team}` : type || team);

  return (
    <StyledCard
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      isHoverable={isHoverable}
      elevation={elevation}
      {...props}
    >
      {(title || finalSubtitle || finalDesc) && (
        <CardHeader>
          {finalSubtitle && <span className="subtitle">{finalSubtitle}</span>}
          {title && <h3 className="title">{title}</h3>}
          {finalDesc && <p className="description">{finalDesc}</p>}
        </CardHeader>
      )}
      {children}
    </StyledCard>
  );
};

const CardHeader = styled.div`
  margin-bottom: var(--space-md);
  .subtitle {
    font-family: var(--font-mono); font-size: 0.6rem; color: var(--ui-accent);
    text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 4px;
  }
  .title {
    font-family: var(--font-heading); font-size: 1rem; color: var(--text-main);
    letter-spacing: 0.05em; margin-bottom: 8px;
  }
  .description {
    font-size: var(--text-sm); color: var(--text-dim); line-height: 1.5;
  }
`;

export default FrostCard;

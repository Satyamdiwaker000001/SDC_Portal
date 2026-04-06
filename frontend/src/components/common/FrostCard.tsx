import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface FrostCardProps {
  title: string;
  type: string;
  team: string;
  desc: string;
  children?: React.ReactNode;
}

const FrostCard: React.FC<FrostCardProps> = ({ title, type, team, desc, children }) => {
  return (
    <StyledWrapper
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="card-wrap">
        <div className="card-body">
          <div className="card-top">
            <span className="type-tag">{type}</span>
            <span className="team-tag">{team}</span>
          </div>
          
          <h3 className="title">{title}</h3>
          <p className="description">{desc}</p>
          
          <div className="card-footer">
            {children}
          </div>
        </div>
        
        {/* Shadow and Edge layers from user design logic */}
        <div className="card-shadow" />
        <div className="card-edge" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(motion.div)`
  --snow: #FFFAFB;
  --onyx: #131515;
  --verdigris: #339989;
  --pearl-aqua: #7DE2D1;
  --anim--hover-time: 400ms;
  --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);

  .card-wrap {
    position: relative;
    z-index: 2;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    width: 100%;
    height: 450px;
    cursor: pointer;
  }

  .card-body {
    position: relative;
    z-index: 3;
    background: linear-gradient(
      135deg,
      rgba(255, 250, 251, 0.8),
      rgba(255, 255, 255, 0.2)
    );
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 
      inset 0 0.5em 1em rgba(255, 255, 255, 0.8),
      0 10px 30px rgba(0, 0, 0, 0.02);
    transform: translateY(0px);
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }

  .card-shadow {
    position: absolute;
    inset: 0;
    background: rgba(19, 21, 21, 0.02);
    border-radius: 20px;
    transform: translateY(0px);
    z-index: 1;
    filter: blur(10px);
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }

  .card-edge {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      var(--pearl-aqua),
      transparent
    );
    border-radius: 20px;
    z-index: 2;
    opacity: 0.1;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }

  /* Interaction Logic - Optimized for Stability */
  .card-wrap:hover .card-body {
    transform: translateY(-4px);
    border-color: var(--pearl-aqua);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  }

  .card-wrap:hover .card-shadow {
    transform: translateY(8px);
    opacity: 0.05;
  }

  .card-wrap:hover .card-edge {
    opacity: 0.3;
  }

  /* Typography */
  .card-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .type-tag {
    font-family: var(--font-heading);
    font-size: 0.65rem;
    color: var(--verdigris);
    letter-spacing: 0.2em;
  }

  .team-tag {
    font-family: var(--font-body);
    font-size: 0.6rem;
    color: var(--onyx);
    opacity: 0.5;
    letter-spacing: 0.1em;
  }

  .title {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: var(--onyx);
  }

  .description {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--onyx);
    opacity: 0.8;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    margin-top: auto;
  }
`;

export default FrostCard;

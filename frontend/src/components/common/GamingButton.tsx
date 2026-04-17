import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const GamingButton: React.FC<ButtonProps> = ({ label, onClick, type = 'button' }) => {
  return (
    <StyledWrapper>
      <div className="button-wrap">
        <button type={type} onClick={onClick}>
          <span>{label}</span>
        </button>
        <div className="button-shadow" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  --anim--hover-time: 400ms;
  --anim--hover-ease: cubic-bezier(0.25, 1, 0.5, 1);
  --sky-blue: #87CEEB;
  --deep-sky: #0095FF;
  --snow: #FFFAFB;
  --onyx: #131515;

  @property --angle-1 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -75deg;
  }

  @property --angle-2 {
    syntax: "<angle>";
    inherits: false;
    initial-value: -45deg;
  }

  .button-wrap {
    position: relative;
    z-index: 2;
    border-radius: 999vw;
    background: transparent;
    pointer-events: auto;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    display: inline-block;
  }

  .button-shadow {
    --shadow-cuttoff-fix: 2em;
    position: absolute;
    width: calc(100% + var(--shadow-cuttoff-fix));
    height: calc(100% + var(--shadow-cuttoff-fix));
    top: calc(0% - var(--shadow-cuttoff-fix) / 2);
    left: calc(0% - var(--shadow-cuttoff-fix) / 2);
    filter: blur(clamp(2px, 0.125em, 12px));
    overflow: visible;
    pointer-events: none;
  }

  .button-shadow::after {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 0;
    border-radius: 999vw;
    background: linear-gradient(180deg, rgba(0, 149, 255, 0.2), rgba(135, 206, 235, 0.1));
    width: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    height: calc(100% - var(--shadow-cuttoff-fix) - 0.25em);
    top: calc(var(--shadow-cuttoff-fix) - 0.5em);
    left: calc(var(--shadow-cuttoff-fix) - 0.875em);
    padding: 0.125em;
    box-sizing: border-box;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    overflow: visible;
    opacity: 1;
  }

  button {
    --border-width: clamp(1px, 0.0625em, 4px);
    all: unset;
    display: inline-block;
    cursor: pointer;
    position: relative;
    z-index: 3;
    background: linear-gradient(
      -75deg,
      rgba(135, 206, 235, 0.1),
      rgba(0, 149, 255, 0.3),
      rgba(135, 206, 235, 0.1)
    );
    border-radius: 999vw;
    box-shadow:
      inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 1),
      0 0.25em 0.125em -0.125em rgba(0, 149, 255, 0.3),
      0 0 0.1em 0.25em inset rgba(135, 206, 235, 0.2),
      0 0 0 0 white;
    backdrop-filter: blur(clamp(1px, 0.125em, 4px));
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
  }

  button:hover {
    transform: scale(0.975);
    backdrop-filter: blur(0.01em);
    box-shadow:
      inset 0 0.125em 0.125em rgba(0, 0, 0, 0.05),
      inset 0 -0.125em 0.125em rgba(255, 255, 255, 1),
      0 0.15em 0.05em -0.1em rgba(0, 149, 255, 0.4),
      0 0 0.05em 0.1em inset rgba(135, 206, 235, 0.5);
  }

  button span {
    position: relative;
    display: block;
    user-select: none;
    font-family: 'Cinzel', serif;
    letter-spacing: 0.1em;
    font-weight: 500;
    font-size: 1em;
    color: var(--onyx);
    text-shadow: 0em 0.25em 0.05em rgba(0, 0, 0, 0.1);
    transition: all var(--anim--hover-time) var(--anim--hover-ease);
    padding: 12px 32px;
  }

  button::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: -2px;
    border-radius: 999vw;
    padding: var(--border-width);
    box-sizing: border-box;
    background: conic-gradient(
        from var(--angle-1) at 50% 50%,
        var(--deep-sky),
        transparent 5% 40%,
        var(--sky-blue) 50%,
        transparent 60% 95%,
        var(--deep-sky)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    transition: all var(--anim--hover-time) var(--anim--hover-ease), --angle-1 500ms ease;
  }

  button:hover::after {
    --angle-1: -125deg;
  }

  .button-wrap:has(button:active) {
    transform: rotate3d(1, 0, 0, 25deg);
  }
`;

export default GamingButton;

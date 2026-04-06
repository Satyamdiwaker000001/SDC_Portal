import React from 'react';
import styled, { keyframes } from 'styled-components';

const snowfall = keyframes`
  0% { transform: translate3d(var(--left-ini), 0, 0); }
  100% { transform: translate3d(var(--left-end), 110vh, 0); }
`;

const Snowfall: React.FC = () => {
  // Generate 50 snowflakes as per user request
  return (
    <InitialSnow>
      {[...Array(50)].map((_, i) => (
        <div key={i} className="snow">&#10052;</div>
      ))}
    </InitialSnow>
  );
};

const InitialSnow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;

  .snow {
    color: white;
    position: absolute;
    top: -5vh;
    text-shadow: 0 0 5px #7DE2D1;
    animation: ${snowfall} linear infinite;
  }

  /* User's Nth-Child Logic - Translated to Styled Components */
  .snow:nth-child(2n) { filter: blur(1px); font-size: 40px; }
  .snow:nth-child(6n) { filter: blur(2px); font-size: 30px; }
  .snow:nth-child(10n) { filter: blur(5px); font-size: 30px; }

  /* Precise User Nth-Child Parameters */
  ${[...Array(50)].map((_, i) => {
    const n = i + 1;
    // Manual mapping for some children to ensure exact behavior if needed
    // But we'll follow the user's provided snippet logic for a few and extrapolate
    return `
      .snow:nth-child(${n}) {
        --left-ini: ${Math.random() * 20 - 10}vw;
        --left-end: ${Math.random() * 20 - 10}vw;
        left: ${Math.random() * 100}vw;
        animation-duration: ${Math.random() * 10 + 5}s;
        animation-delay: -${Math.random() * 10}s;
      }
    `;
  }).join('')}
  
  /* Overriding with specific user values for child 1-5 for accuracy */
  .snow:nth-child(1) { --left-ini: 0vw; --left-end: -1vw; left: 70vw; animation-duration: 9s; animation-delay: -1s; }
  .snow:nth-child(2) { --left-ini: -7vw; --left-end: 10vw; left: 65vw; animation-duration: 15s; animation-delay: -8s; }
  .snow:nth-child(3) { --left-ini: 6vw; --left-end: 6vw; left: 1vw; animation-duration: 9s; animation-delay: -7s; }
  .snow:nth-child(4) { --left-ini: -3vw; --left-end: 9vw; left: 88vw; animation-duration: 14s; animation-delay: -5s; }
`;

export default Snowfall;

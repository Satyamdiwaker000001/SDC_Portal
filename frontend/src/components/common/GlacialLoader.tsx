import React from 'react';
import styled, { keyframes } from 'styled-components';

const snowLoader = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(90deg); }
`;

const snowLoaderZoom = keyframes`
  from { transform: scale(1, 1) rotateZ(0deg); color: rgba(200, 241, 255, 0.8); }
  to { color: #131515; transform: scale(300, 300) rotateZ(360deg); }
`;

const GlacialLoader: React.FC = () => {
  return (
    <LoaderWrapper>
      <div className="loader-icon-1">&#10052;</div>
      <div className="loader-text">SCANNING_FROST_DATA...</div>
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  z-index: 5000;
  background: radial-gradient(
    circle,
    #7DE2D1 0%,
    rgba(71, 196, 255, 0.8) 68%,
    #339989 100%
  );

  .loader-icon-1 {
    font-size: 80px;
    color: rgba(200, 241, 255, 0.8);
    text-shadow: 1px 1px 1px #47c4ff, -1px -1px 1px white;
    animation: 
      ${snowLoader} 0.5s 9 linear alternate-reverse forwards,
      ${snowLoaderZoom} 5s forwards;
    animation-delay: 0s, 4.5s;
  }

  .loader-text {
    font-size: 1rem;
    letter-spacing: 0.5em;
    font-family: 'Cinzel', serif;
    color: rgba(200, 241, 255, 1);
    margin-top: 20px;
  }
`;

export default GlacialLoader;

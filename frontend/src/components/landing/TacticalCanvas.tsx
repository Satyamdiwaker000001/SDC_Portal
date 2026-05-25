import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import styled from 'styled-components';
import ResistanceCore from './ResistanceCore';

const TacticalCanvas: React.FC = () => {
  return (
    <CanvasContainer>
      <Suspense fallback={
        <CanvasFallback>
          <div className="scanner-line" />
          <span className="load-text">UPLINKING_3D_CORE_DOME...</span>
        </CanvasFallback>
      }>
        <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
          <ResistanceCore />
        </Canvas>
      </Suspense>
    </CanvasContainer>
  );
};

const CanvasContainer = styled.div`
  width: 100%;
  height: 450px;
  position: relative;
  background: radial-gradient(circle at center, rgba(10, 18, 30, 0.4) 0%, transparent 70%);
  border: 1px dashed rgba(0, 240, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
`;

const CanvasFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  position: relative;

  .scanner-line {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 2px;
    background: var(--border-cyan);
    opacity: 0.5;
    box-shadow: var(--hud-glow);
    animation: scanning-anim 2.5s linear infinite;
  }

  @keyframes scanning-anim {
    0% { transform: translateY(0); }
    100% { transform: translateY(450px); }
  }
`;

export default TacticalCanvas;

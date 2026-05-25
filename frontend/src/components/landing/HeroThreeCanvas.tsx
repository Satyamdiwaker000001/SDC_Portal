import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial } from '@react-three/drei';
import styled from 'styled-components';
import * as THREE from 'three';
import { useSound } from '../../context/SoundContext';

// 3D Nexus Breach Mesh Node
const NexusBreachNode: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  const { playHover } = useSound();

  // Create random particle coordinates for the floating data cloud
  const particleCount = 250;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create a sphere shell of floating particles
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.4 + Math.random() * 0.8; // radius between 2.4 and 3.2
      
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedMultiplier = hovered ? 2.5 : 1.0;

    // Rotate core mesh
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.25 * speedMultiplier;
      meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.15;
      
      // Pulse scale to represent a beating neural core
      const pulse = 1.0 + Math.sin(time * 2.0) * 0.04;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    // Rotate scanner shield ring
    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.4 * speedMultiplier;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }

    // Rotate particle cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -time * 0.08 * speedMultiplier;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    playHover();
  };

  return (
    <>
      {/* Dynamic Cyberpunk Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 6, 6]} intensity={1.5} color={hovered ? "#ef233c" : "#00f0ff"} />
      <pointLight position={[-6, -6, -6]} intensity={0.8} color="#ef233c" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffaa00" />

      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.4}>
        {/* Core Wireframe Mesh representing the breached neural grid */}
        <mesh 
          ref={meshRef}
          onPointerOver={handlePointerOver}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[1.5, 20, 20]} />
          <meshStandardMaterial 
            color={hovered ? "#ef233c" : "#00f0ff"}
            wireframe
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>

        {/* Outer glowing security scanner shield ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[2.1, 0.05, 10, 40]} />
          <meshStandardMaterial 
            color={hovered ? "#ffaa00" : "#ef233c"} 
            emissive={hovered ? "#ef233c" : "#00f0ff"}
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>

        {/* Drifting packet particles */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            color={hovered ? "#ffaa00" : "#00f0ff"}
            size={0.06}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.8}
          />
        </points>
      </Float>
    </>
  );
};

// Canvas Wrapper Component
const HeroThreeCanvas: React.FC = () => {
  return (
    <CanvasWrapper>
      <Suspense fallback={
        <CanvasFallback>
          <div className="scanner-line" />
          <span className="load-text">CONNECTING_NEURAL_VIEWPORT...</span>
        </CanvasFallback>
      }>
        <Canvas camera={{ position: [0, 0, 6.0], fov: 45 }}>
          <NexusBreachNode />
        </Canvas>
      </Suspense>
      {/* Decorative corners to resemble military HUD HUD */}
      <div className="hud-corner top-left" />
      <div className="hud-corner top-right" />
      <div className="hud-corner bottom-left" />
      <div className="hud-corner bottom-right" />
      <div className="hud-scanner-bar" />
    </CanvasWrapper>
  );
};

const CanvasWrapper = styled.div`
  width: 100%;
  height: 480px;
  position: relative;
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 6px;
  background: rgba(10, 18, 30, 0.2);
  box-shadow: inset 0 0 30px rgba(0, 240, 255, 0.05);
  overflow: hidden;
  backdrop-filter: blur(4px);

  @media (max-width: 900px) {
    height: 350px;
  }

  .hud-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border-color: var(--border-cyan);
    border-style: solid;
    pointer-events: none;
    opacity: 0.7;

    &.top-left { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
    &.top-right { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
    &.bottom-left { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
    &.bottom-right { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }
  }

  .hud-scanner-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent);
    pointer-events: none;
    animation: scanner-sweep 4.0s ease-in-out infinite;
  }

  @keyframes scanner-sweep {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(480px); opacity: 0; }
  }
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
  font-size: 0.65rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  position: relative;

  .scanner-line {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 2px;
    background: var(--border-cyan);
    opacity: 0.4;
    box-shadow: var(--hud-glow);
    animation: scanning-anim 2.0s linear infinite;
  }

  @keyframes scanning-anim {
    0% { transform: translateY(0); }
    100% { transform: translateY(350px); }
  }
`;

export default HeroThreeCanvas;

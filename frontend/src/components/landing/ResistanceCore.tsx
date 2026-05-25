import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSound } from '../../context/SoundContext';

const ResistanceCore: React.FC = () => {
  const coreMesh = useRef<THREE.Mesh>(null);
  const ringMesh1 = useRef<THREE.Mesh>(null);
  const ringMesh2 = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { playHover } = useSound();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = hovered ? 3 : 1;

    if (coreMesh.current) {
      coreMesh.current.rotation.y = time * 0.4 * speed;
      coreMesh.current.rotation.x = Math.sin(time / 2) * 0.15;
    }
    if (ringMesh1.current) {
      ringMesh1.current.rotation.x = time * 0.25;
      ringMesh1.current.rotation.y = time * 0.1;
    }
    if (ringMesh2.current) {
      ringMesh2.current.rotation.y = -time * 0.3;
      ringMesh2.current.rotation.z = time * 0.15;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    playHover();
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ef233c" />
      <pointLight position={[0, 0, 5]} intensity={1} color="#ffaa00" />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        {/* Main core capsule - glowing red/cyan node */}
        <mesh 
          ref={coreMesh}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <dodecahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial 
            color={hovered ? "#ef233c" : "#00f0ff"} 
            wireframe
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Small solid inner core */}
        <mesh>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial 
            color={hovered ? "#ffaa00" : "#ffffff"} 
            emissive={hovered ? "#ef233c" : "#00f0ff"}
            emissiveIntensity={1.5}
            roughness={0}
            metalness={1}
          />
        </mesh>

        {/* Outer Orbit Ring 1 - Cyan Node Belt */}
        <mesh ref={ringMesh1}>
          <torusGeometry args={[3.2, 0.04, 8, 48]} />
          <meshStandardMaterial 
            color="#00f0ff" 
            transparent 
            opacity={0.3}
          />
        </mesh>

        {/* Outer Orbit Ring 2 - Red Security Ring */}
        <mesh ref={ringMesh2}>
          <torusGeometry args={[2.7, 0.03, 8, 36]} />
          <meshStandardMaterial 
            color="#ef233c" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      </Float>
    </>
  );
};

export default ResistanceCore;

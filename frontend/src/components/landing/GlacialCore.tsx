import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const GlacialCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(time / 4) * 0.2;
      meshRef.current.rotation.y = Math.sin(time / 2) * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7DE2D1" />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* The Core Crystal - Solid and Stable */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#7DE2D1"
            emissiveIntensity={0.1}
            roughness={0}
            metalness={1}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Outer Crystalline Fragments - Stable Wireframe */}
        <mesh ref={outerRef}>
          <dodecahedronGeometry args={[3.2, 0]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            wireframe 
            transparent 
            opacity={0.05}
          />
        </mesh>
      </Float>
    </>
  );
};

export default GlacialCore;

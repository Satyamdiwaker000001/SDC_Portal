import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const ConstellationScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);

  const particleCount = 80;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0006;
      groupRef.current.rotation.x += 0.0002;
    }

    if (particleRef.current) {
      const positionAttr = particleRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let x = positionAttr.getX(i) + velocities[i * 3];
        let y = positionAttr.getY(i) + velocities[i * 3 + 1];
        let z = positionAttr.getZ(i) + velocities[i * 3 + 2];

        if (Math.abs(x) > 15) velocities[i * 3] *= -1;
        if (Math.abs(y) > 15) velocities[i * 3 + 1] *= -1;
        if (Math.abs(z) > 15) velocities[i * 3 + 2] *= -1;

        positionAttr.setXYZ(i, x, y, z);
      }
      positionAttr.needsUpdate = true;
    }

    if (groupRef.current) {
      const targetX = state.pointer.x * 0.15;
      const targetY = -state.pointer.y * 0.15;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0.5} fade speed={1.0} />
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#818cf8"
          size={0.08}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh position={[-6, 3, -8]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[6, -4, -6]}>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const BackgroundCanvas3D: React.FC = () => {
  return (
    <CanvasContainer>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#a855f7" />
        <ConstellationScene />
      </Canvas>
    </CanvasContainer>
  );
};

const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.75;
`;

export default BackgroundCanvas3D;

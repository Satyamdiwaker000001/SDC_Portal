import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { initScene, disposeScene } from '../scene/init';
import { createHeroModel, updateModelUniforms } from '../scene/model';
import { startLoop, stopLoop } from '../scene/loop';
import {
  createEntranceAnimation,
  createScrollAnimation,
  createMouseTracking,
  killAllAnimations,
} from '../animations/gsap';

const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

const HeroCanvas3D = ({ heroSectionRef }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const { scene, camera, renderer, onResize } = initScene(containerRef.current);

    const { group, mainMat, wireMat, innerMesh, particles } = createHeroModel();
    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xFF00FF, 2, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xC5F6FF, 2, 20);
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xF2D027, 1.5, 15);
    pointLight3.position.set(0, 5, -3);
    scene.add(pointLight3);

    sceneRef.current = { scene, camera, renderer, onResize };
    modelRef.current = { group, mainMat, wireMat, innerMesh, particles };

    let mouseTracker = null;

    if (!prefersReducedMotion) {
      const entrance = createEntranceAnimation(group);
      entrance.eventCallback('onComplete', () => {
        setIsReady(true);
      });

      if (heroSectionRef?.current) {
        createScrollAnimation(group, heroSectionRef.current);
      }

      mouseTracker = createMouseTracking(group, containerRef.current);
    } else {
      group.scale.set(1, 1, 1);
      setTimeout(() => setIsReady(true), 0);
    }

    startLoop(scene, camera, renderer, (elapsed) => {
      updateModelUniforms(mainMat, wireMat, elapsed);

      if (!prefersReducedMotion) {
        innerMesh.rotation.x = elapsed * 0.5;
        innerMesh.rotation.y = elapsed * 0.3;

        particles.rotation.y = elapsed * 0.1;
        particles.rotation.x = elapsed * 0.05;

        pointLight1.position.x = Math.sin(elapsed * 0.7) * 4;
        pointLight1.position.z = Math.cos(elapsed * 0.7) * 4;

        pointLight2.position.x = Math.cos(elapsed * 0.5) * 4;
        pointLight2.position.z = Math.sin(elapsed * 0.5) * 4;
      }
    });

    return () => {
      stopLoop();
      killAllAnimations();
      if (mouseTracker) mouseTracker.destroy();
      disposeScene(scene, camera, renderer, onResize);
      sceneRef.current = null;
      modelRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`hero-3d-canvas ${isReady ? 'hero-3d-canvas--ready' : ''}`}
      aria-hidden="true"
    />
  );
};

export default HeroCanvas3D;

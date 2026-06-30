import * as THREE from 'three';

let animationFrameId = null;

export function startLoop(scene, camera, renderer, callback) {
  const clock = new THREE.Clock();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    if (callback) callback(elapsed);

    renderer.render(scene, camera);
  };

  animate();
}

export function stopLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

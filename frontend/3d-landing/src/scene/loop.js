export function startRenderLoop(renderer, scene, camera, onFrame) {
  let frameId = null;
  
  function animate() {
    frameId = requestAnimationFrame(animate);
    onFrame?.();
    renderer.render(scene, camera);
  }
  
  animate();
  
  return () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };
}
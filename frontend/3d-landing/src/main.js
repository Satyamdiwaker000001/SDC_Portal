import './style.css';
import { initScene } from './scene/init.js';
import { createModel, animateModel } from './scene/model.js';
import { startRenderLoop } from './scene/loop.js';
import { initAnimations, cleanupAnimations } from './animations/gsap.js';

let scene, camera, renderer, model;
let animationId = null;
let isInitialized = false;

async function init() {
  const canvas = document.getElementById('hero-canvas');
  
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }

  try {
    const initResult = initScene(canvas);
    scene = initResult.scene;
    camera = initResult.camera;
    renderer = initResult.renderer;

    model = createModel();
    scene.add(model.group);

    startRenderLoop(renderer, scene, camera, () => {
      if (model && typeof animateModel === 'function') {
        animateModel(model, performance.now() * 0.001);
      }
    });

    initAnimations(model, camera, renderer);

    isInitialized = true;
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    document.body.classList.add('loaded');
    
  } catch (error) {
    console.error('Failed to initialize 3D scene:', error);
    document.body.classList.add('loaded', 'fallback');
  }
}

function handleResize() {
  if (!renderer || !camera) return;
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function cleanup() {
  window.removeEventListener('resize', handleResize);
  cleanupAnimations();
  
  if (renderer) {
    renderer.dispose();
    if (renderer.domElement?.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
  
  if (scene) {
    scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', cleanup);

export { scene, camera, renderer, model };
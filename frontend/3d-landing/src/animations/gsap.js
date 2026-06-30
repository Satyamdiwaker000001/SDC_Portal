import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

let scrollTriggers = [];
let mouseTracker = null;
let clickHandler = null;

export function initAnimations(model, camera, renderer) {
  const { group, mainMaterial, wireMaterial, core, mainMesh } = model;
  
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from(group.scale, { x: 0, y: 0, z: 0, duration: 1.5 })
    .from(group.rotation, { y: Math.PI, duration: 2 }, 0)
    .to(model.mainMaterial.uniforms.uMorphFactor, { value: 1, duration: 2 }, 0.5)
    .from(core.scale, { x: 0, y: 0, z: 0, duration: 1 }, 0.5)
    .from(core.material, { emissiveIntensity: 0, duration: 1.5 }, 0.5)
    .from({ opacity: 0 }, {
      duration: 1,
      onUpdate: function() {
        document.querySelector('#overlay')?.style.setProperty('opacity', this.targets()[0].opacity);
      }
    }, 0);
  
  document.querySelector('#overlay')?.style.setProperty('opacity', '0');
  
  gsap.to(group.rotation, {
    y: '+=2*PI',
    duration: 30,
    ease: 'none',
    repeat: -1,
  });
  
  mouseTracker = initMouseTracking(group, camera);
  
  clickHandler = initClickToExplode(model, camera, renderer);
  
  initScrollAnimations(model, camera);
  
  initStatCounters();
}

function initMouseTracking(group, camera) {
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  
  function onMouseMove(event) {
    target.x = (event.clientX / window.innerWidth - 0.5) * 0.5;
    target.y = (event.clientY / window.innerHeight - 0.5) * 0.3;
  }
  
  window.addEventListener('mousemove', onMouseMove);
  
  function update() {
    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;
    
    group.rotation.y += (current.x - group.rotation.y * 0.1) * 0.02;
    group.rotation.x += (current.y - group.rotation.x * 0.1) * 0.02;
    
    camera.position.x += (current.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-current.y * 2 - camera.position.y) * 0.02;
    
    requestAnimationFrame(update);
  }
  
  update();
  
  return { destroy: () => window.removeEventListener('mousemove', onMouseMove) };
}

function initClickToExplode(model, camera, renderer) {
  const { group, mainMesh, mainMaterial, wireMesh, particles, core, ring, ring2 } = model;
  let isExploded = false;
  let explodeTimeline = null;
  const canvas = renderer.domElement;
  
  function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObject(mainMesh, true);
    
    if (intersects.length > 0) {
      toggleExplode(model);
    }
  }
  
  function toggleExplode(model) {
    if (explodeTimeline) {
      explodeTimeline.kill();
    }
    
    if (!isExploded) {
      explode(model);
    } else {
      implode(model);
    }
    isExploded = !isExploded;
  }
  
  function explode(model) {
    const { group, mainMaterial, wireMesh, particles, core, ring, ring2 } = model;
    
    const fresnelColor = mainMaterial.uniforms.uFresnelColor.value;
    const wireColor = wireMesh.material.uniforms.uWireColor.value;
    const particleColor = particles.material.uniforms.uColor.value;
    
    explodeTimeline = gsap.timeline({
      onComplete: () => {
        gsap.to(mainMaterial.uniforms.uIntensity, { value: 0.5, duration: 1 });
        gsap.to(wireColor, { r: 1, g: 0, b: 1, duration: 1 });
      }
    });
    
    explodeTimeline
      .to(mainMaterial.uniforms.uMorphFactor, { value: 2, duration: 1.5, ease: 'power2.out' }, 0)
      .to(group.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.5, ease: 'power2.out' }, 0)
      .to(core.scale, { x: 2, y: 2, z: 2, duration: 1.5, ease: 'elastic.out(1, 0.5)' }, 0)
      .to(core.material, { emissiveIntensity: 2, duration: 1 }, 0)
      .to(ring.scale, { x: 2, y: 2, z: 1, duration: 1.5, ease: 'power2.out' }, 0)
      .to(ring.material, { opacity: 0.4, duration: 1 }, 0)
      .to(ring2.scale, { x: 3, y: 3, z: 1, duration: 1.5, ease: 'power2.out' }, 0)
      .to(ring2.material, { opacity: 0.2, duration: 1 }, 0)
      .to(fresnelColor, { r: 1, g: 0, b: 1, duration: 1 }, 0)
      .to(particleColor, { r: 1, g: 0, b: 1, duration: 1 }, 0);
    
    gsap.to(group.rotation, { y: '+=4*PI', duration: 2, ease: 'power2.out' }, 0);
  }
  
  function implode(model) {
    const { group, mainMaterial, wireMesh, particles, core, ring, ring2 } = model;
    
    const fresnelColor = mainMaterial.uniforms.uFresnelColor.value;
    const wireColor = wireMesh.material.uniforms.uWireColor.value;
    const particleColor = particles.material.uniforms.uColor.value;
    
    explodeTimeline = gsap.timeline({
      onComplete: () => {
        gsap.to(mainMaterial.uniforms.uIntensity, { value: 1, duration: 1 });
        gsap.to(wireColor, { r: 0, g: 1, b: 0.53, duration: 1 });
      }
    });
    
    explodeTimeline
      .to(mainMaterial.uniforms.uMorphFactor, { value: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(group.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(core.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' }, 0)
      .to(core.material, { emissiveIntensity: 0.5, duration: 1 }, 0)
      .to(ring.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(ring.material, { opacity: 0.15, duration: 1 }, 0)
      .to(ring2.scale, { x: 1.3, y: 1.3, z: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
      .to(ring2.material, { opacity: 0.08, duration: 1 }, 0)
      .to(fresnelColor, { r: 0, g: 1, b: 0.53, duration: 1 }, 0)
      .to(particleColor, { r: 0, g: 1, b: 0.53, duration: 1 }, 0);
    
    gsap.to(group.rotation, { y: group.rotation.y + 2 * Math.PI, duration: 2, ease: 'power2.inOut' }, 0);
  }
  
  canvas.addEventListener('click', handleClick);
  
  return { destroy: () => canvas.removeEventListener('click', handleClick) };
}

function initScrollAnimations(model, camera) {
  const { group, mainMaterial, core } = model;
  
  const st1 = ScrollTrigger.create({
    trigger: '#features',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to(group.position, { z: progress * -5, duration: 0.1, overwrite: 'auto' });
      gsap.to(group.rotation, { x: progress * 0.3, duration: 0.1, overwrite: 'auto' });
      gsap.to(camera.position, { y: progress * 2, duration: 0.1, overwrite: 'auto' });
      if (mainMaterial.uniforms) {
        mainMaterial.uniforms.uMorphFactor.value = 1 + progress;
      }
    },
  });
  scrollTriggers.push(st1);
  
  const st2 = ScrollTrigger.create({
    trigger: '#about',
    start: 'top bottom',
    end: 'top center',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to(group.position, { z: -5 + progress * -5, duration: 0.1, overwrite: 'auto' });
      gsap.to(group.rotation, { x: 0.3 + progress * 0.2, y: progress * 0.5, duration: 0.1, overwrite: 'auto' });
      gsap.to(camera.position, { y: 2 + progress * 1, z: 8 + progress * 5, duration: 0.1, overwrite: 'auto' });
    },
  });
  scrollTriggers.push(st2);
  
  const st3 = ScrollTrigger.create({
    trigger: '#contact',
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to(group.rotation, { y: 0.5 + progress * 2, duration: 0.1, overwrite: 'auto' });
      gsap.to(group.scale, { x: 1 - progress * 0.3, y: 1 - progress * 0.3, z: 1 - progress * 0.3, duration: 0.1, overwrite: 'auto' });
      gsap.to(core.material, { emissiveIntensity: 0.5 * (1 - progress), duration: 0.1, overwrite: 'auto' });
    },
  });
  scrollTriggers.push(st3);
}

function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-value[data-target]');
  
  statElements.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el, 
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].textContent) + suffix;
            }
          }
        );
      }
    });
  });
}

export function cleanupAnimations() {
  scrollTriggers.forEach(st => st.kill());
  scrollTriggers = [];
  
  if (mouseTracker) {
    mouseTracker.destroy();
    mouseTracker = null;
  }
  
  if (clickHandler) {
    clickHandler.destroy();
    clickHandler = null;
  }
  
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(t => t.kill());
}
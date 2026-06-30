import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function createEntranceAnimation(modelGroup) {
  return gsap.timeline()
    .to(modelGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'elastic.out(1, 0.5)',
    })
    .to(modelGroup.rotation, {
      y: Math.PI * 2,
      duration: 1.5,
      ease: 'power2.out',
    }, 0);
}

export function createScrollAnimation(modelGroup, heroSection) {
  return ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to(modelGroup.rotation, {
        x: progress * Math.PI * 0.5,
        z: progress * Math.PI * 0.3,
        duration: 0.3,
        overwrite: 'auto',
      });
      gsap.to(modelGroup.scale, {
        x: 1 - progress * 0.4,
        y: 1 - progress * 0.4,
        z: 1 - progress * 0.4,
        duration: 0.3,
        overwrite: 'auto',
      });
      gsap.to(modelGroup.position, {
        y: -progress * 2,
        duration: 0.3,
        overwrite: 'auto',
      });
    },
  });
}

export function createMouseTracking(modelGroup, container) {
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const onDeviceOrientation = (e) => {
    mouse.x = (e.gamma || 0) / 45;
    mouse.y = (e.beta || 0) / 45;
  };

  container.addEventListener('mousemove', onMouseMove);
  window.addEventListener('deviceorientation', onDeviceOrientation);

  const rafId = { current: null };

  const update = () => {
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;

    modelGroup.rotation.x += target.y * 0.3 * 0.05;
    modelGroup.rotation.y += target.x * 0.3 * 0.05;

    rafId.current = requestAnimationFrame(update);
  };

  update();

  return {
    destroy() {
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    },
  };
}

export function killAllAnimations() {
  gsap.killTweensOf();
  ScrollTrigger.getAll().forEach((st) => st.kill());
}

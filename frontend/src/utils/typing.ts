// src/utils/sfx.ts
import clickSound from '../sounds/click.mp3';
import typeSound from '../sounds/typing.mp3'; // Make sure this file exists

const clickSfx = typeof Audio !== 'undefined' ? new Audio(clickSound) : null;
const typeSfx = typeof Audio !== 'undefined' ? new Audio(typeSound) : null;

// Normal click sound
export const playClick = () => {
  if (clickSfx) {
    clickSfx.currentTime = 0;
    clickSfx.volume = 0.4;
    clickSfx.play().catch(() => {});
  }
};

// Fast typing sound logic
export const playType = () => {
  if (typeSfx) {
    // Typing sounds needs to be very fast, so we don't pause, 
    // we just clone or reset instantly
    const soundClone = typeSfx.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.2; // Low volume for typing so it's not annoying
    soundClone.play().catch(() => {});
  }
};
// src/utils/click.ts
import clickSound from '../sounds/click.mp3'; // Vite handles the path now

const clickSfx = typeof Audio !== 'undefined' ? new Audio(clickSound) : null;

export const playClick = () => {
  if (clickSfx) {
    // Stop and reset to handle rapid clicks
    clickSfx.pause();
    clickSfx.currentTime = 0; 
    
    clickSfx.volume = 0.5; // Set volume to 50%
    
    // Play with a promise catch to avoid browser console errors
    clickSfx.play().catch((err) => {
      console.warn("Playback blocked or failed:", err);
    });
  }
};
import React, { createContext, useContext, useState, useRef } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playAlert: () => void;
  playTypeClick: () => void;
  playBootChime: () => void;
  playScannerSweep: () => void;
  startAmbient: () => void;
  playSceneAudio: (sceneId: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);
  const ambientLfoRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleMute = () => {
    initAudio();
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (nextMute) {
        // Mute - fade ambient volume to 0
        if (ambientGainRef.current && audioCtxRef.current) {
          ambientGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        }
      } else {
        // Unmute - resume ambient audio and play boot chime as feedback
        startAmbient();
        setTimeout(() => {
          playBootChime();
        }, 100);
      }
      return nextMute;
    });
  };

  const startAmbient = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    
    if (isMuted) return;
    if (ambientOsc1Ref.current) return; // Already running

    try {
      // 1. Create detuned synthesizers for rich chorus rumble
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Low saw pad + triangle pad
      osc1.type = 'sawtooth';
      osc1.frequency.value = 55.0; // A1
      
      osc2.type = 'triangle';
      osc2.frequency.value = 55.3; // detune chorus

      filter.type = 'lowpass';
      filter.frequency.value = 110;
      filter.Q.value = 4.0; // resonant peaks

      // 2. Create LFO to modulate filter cutoff (evolving space pad)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.value = 0.15; // slow sweep (0.15Hz)
      lfoGain.gain.value = 35; // sweep filter between 75Hz and 145Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      gainNode.gain.setValueAtTime(0.045, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      lfo.start();
      osc1.start();
      osc2.start();

      ambientOsc1Ref.current = osc1;
      ambientOsc2Ref.current = osc2;
      ambientLfoRef.current = lfo;
      ambientGainRef.current = gainNode;
    } catch (e) {
      console.warn('Failed to initialize ambient space pad', e);
    }
  };

  const playBootChime = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      // High rising chime representing login/uplink loading
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(150, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.8);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(150, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1105, ctx.currentTime + 0.8);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.0);
      osc2.stop(ctx.currentTime + 1.0);
    } catch (e) {}
  };

  const playScannerSweep = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      // Deep sweeping laser frequency simulating fingerprint scanner
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.4);

      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch (e) {}
  };

  const playHover = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1300, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.025, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  };

  const playTypeClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.004, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch (e) {}
  };

  const playAlert = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(480, ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const playSceneAudio = (sceneId: string) => {
    if (isMuted || !audioCtxRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;

    try {
      switch (sceneId) {
        case "01": { // Singularity Awakening (Sine drop to square rumble)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, ctx.currentTime);
          osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.3);
          osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.9);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
          setTimeout(() => { if (osc) osc.type = 'square'; }, 300);
          break;
        }
        case "02": { // Black Sunday (Noise blast explosion with quick decay)
          const bufferSize = ctx.sampleRate * 1.5;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1000, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start();
          break;
        }
        case "03": { // Automated Forge (Metallic FM synthesis strike)
          const carrier = ctx.createOscillator();
          const modulator = ctx.createOscillator();
          const modGain = ctx.createGain();
          const gain = ctx.createGain();
          carrier.type = 'sine';
          modulator.type = 'sine';
          carrier.frequency.value = 440;
          modulator.frequency.value = 733;
          modGain.gain.value = 500;
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          modulator.connect(modGain);
          modGain.connect(carrier.frequency);
          carrier.connect(gain);
          gain.connect(ctx.destination);
          carrier.start();
          modulator.start();
          carrier.stop(ctx.currentTime + 0.5);
          modulator.stop(ctx.currentTime + 0.5);
          break;
        }
        case "04": { // Geneva Breach (Siren Alarm sweep)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.2);
          osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
          osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.6);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.9);
          break;
        }
        case "05": { // Founding of SDC (Warm triangle triad chord)
          const frequencies = [130.81, 164.81, 196.00];
          frequencies.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.6);
          });
          break;
        }
        case "06": { // Glacial Mainframe (Sub-bass drone with ice sweep)
          const frequencies = [150, 225, 300];
          frequencies.forEach(f => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.2);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.6);
          });
          break;
        }
        case "07": { // The First Uplink (Saw sweep signal scan)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(3000, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.0);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.15);
          break;
        }
        case "08": { // Subterranean Fiber Tap (Evolving low bass clicks)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(75, ctx.currentTime);
          osc.frequency.setValueAtTime(90, ctx.currentTime + 0.25);
          osc.frequency.setValueAtTime(110, ctx.currentTime + 0.5);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.9);
          break;
        }
        case "09": { // Ghost Decryption (Bandpass filter sweeps on noise)
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = 100;
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(200, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.6);
          filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.2);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.4);
          break;
        }
        case "10": { // EMP Blast (Deep low sub drop + noise explosion)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(80, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1.5);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.7);

          const bufferSize = ctx.sampleRate * 0.4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          noise.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start();
          break;
        }
        case "11": { // Biometric Scanner Gate (Low laser sweep)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.0);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
          break;
        }
        case "12": { // DDoS Attack Grid (Chaotic sweep clicks)
          const playBeep = (freq: number, start: number, duration: number) => {
            const oscNode = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscNode.type = 'sine';
            oscNode.frequency.setValueAtTime(freq, ctx.currentTime + start);
            gainNode.gain.setValueAtTime(0.03, ctx.currentTime + start);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
            oscNode.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscNode.start(ctx.currentTime + start);
            oscNode.stop(ctx.currentTime + start + duration + 0.05);
          };
          playBeep(880, 0, 0.1);
          playBeep(980, 0.1, 0.1);
          playBeep(660, 0.2, 0.1);
          playBeep(1200, 0.3, 0.1);
          playBeep(440, 0.4, 0.2);
          break;
        }
        case "13": { // Aegis Shield Launch (Triad synth release chords)
          const frequencies = [220, 277.18, 329.63, 440];
          frequencies.forEach(f => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.9);
          });
          break;
        }
        case "14": { // Charlie Node Off (Tense declining alarm signals)
          const notes = [440, 392, 349];
          notes.forEach((f, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.001, ctx.currentTime + index * 0.2);
            gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + index * 0.2 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.2 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + index * 0.2);
            osc.stop(ctx.currentTime + index * 0.2 + 0.5);
          });
          break;
        }
        case "15": { // Reprogrammed Eyes (Optic lens servo sweep)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2000, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15);
          osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
          break;
        }
        case "16": { // Database purge (Bubble synthetics sweep)
          for (let i = 0; i < 6; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400 + i * 200, ctx.currentTime + i * 0.08);
            osc.frequency.exponentialRampToValueAtTime(1200 + i * 100, ctx.currentTime + i * 0.08 + 0.1);
            gain.gain.setValueAtTime(0.02, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.15);
          }
          break;
        }
        case "17": { // Node C10 Hack (Rising sweep with a resolution tone)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.8);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.3);
          
          const lock = ctx.createOscillator();
          const lockGain = ctx.createGain();
          lock.type = 'sine';
          lock.frequency.setValueAtTime(880, ctx.currentTime + 0.8);
          lockGain.gain.setValueAtTime(0, ctx.currentTime);
          lockGain.gain.setValueAtTime(0.05, ctx.currentTime + 0.8);
          lockGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
          lock.connect(lockGain);
          lockGain.connect(ctx.destination);
          lock.start();
          lock.stop(ctx.currentTime + 1.4);
          break;
        }
        case "18": { // Frostbite virus injection (Wind chill sweep + snap)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.0);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.15);
          break;
        }
        case "19": { // Mainframe core blitz (Hard rhythm saw sweep)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, ctx.currentTime);
          osc.frequency.setValueAtTime(300, ctx.currentTime + 0.15);
          osc.frequency.setValueAtTime(100, ctx.currentTime + 0.3);
          osc.frequency.setValueAtTime(400, ctx.currentTime + 0.45);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.85);
          break;
        }
        case "20": { // Sector Alpha Liberated (Hopeful major chord sequence)
          const notes = [261.63, 329.63, 392.00, 523.25];
          notes.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
            gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + idx * 0.05 + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.7);
          });
          break;
        }
        default:
          playClick();
      }
    } catch (e) {
      console.warn('Failed to play scene synth audio', e);
    }
  };

  return (
    <SoundContext.Provider value={{
      isMuted,
      toggleMute,
      playHover,
      playClick,
      playAlert,
      playTypeClick,
      playBootChime,
      playScannerSweep,
      startAmbient,
      playSceneAudio
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

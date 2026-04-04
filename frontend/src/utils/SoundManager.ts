/* cspell:disable */
class SoundManager {
  private static instance: SoundManager;
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('SDC_SOUND_ENABLED');
      this.enabled = stored !== 'false';
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public init() {
    if (!this.audioCtx) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setEnabled(value: boolean) {
    this.enabled = value;
    localStorage.setItem('SDC_SOUND_ENABLED', String(value));
  }

  public isEnabled() {
    return this.enabled;
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) {
    if (!this.enabled || !this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // --- NEW KPR-STYLE TRIGGER SOUNDS ---

  public playChirp() {
    if (!this.enabled || !this.audioCtx) return;
    this.createOscillator(2500, 'square', 0.03, 0.015);
  }

  public playSlide() {
    if (!this.enabled || !this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  public playHover() {
    this.playChirp();
  }

  public playClick() {
      // Mechanical tap
      this.createOscillator(600, 'triangle', 0.08, 0.04);
      setTimeout(() => this.createOscillator(1200, 'square', 0.02, 0.02), 10);
  }

  public playConfirm() {
      this.playSlide();
      setTimeout(() => this.playChirp(), 300);
  }

  public playTransition() {
      this.playSlide();
  }
}

export const soundManager = SoundManager.getInstance();

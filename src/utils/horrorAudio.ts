/**
 * Procedural Horror Audio Engine (Web Audio API)
 * ---------------------------------------------------------------------------
 * Generates atmospheric subterranean drones, faint whispers, and crisp ink/paper
 * clicks without external audio files. Strictly muted by default until user opt-in.
 */

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private enabled = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    if (next) {
      this.startDrone();
    } else {
      this.stopDrone();
    }
  }

  public startDrone(): void {
    const ctx = this.ensureContext();
    if (!ctx || this.osc1) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 2.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(46, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(47.4, ctx.currentTime); // Slow eerie 1.4Hz beating

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    this.droneGain = gain;
    this.osc1 = osc1;
    this.osc2 = osc2;
  }

  public stopDrone(): void {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    try {
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value || 0.01, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      const o1 = this.osc1;
      const o2 = this.osc2;
      setTimeout(() => {
        try {
          o1?.stop();
          o2?.stop();
        } catch {
          // Ignore already stopped oscillators
        }
      }, 550);
    } catch {
      // Ignore cleanup errors
    }
    this.osc1 = null;
    this.osc2 = null;
    this.droneGain = null;
  }

  /** Subtle distant breath/whisper noise burst on card hover or modal focus */
  public playWhisper(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const duration = 0.55;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(950, ctx.currentTime);
    bandpass.Q.setValueAtTime(3.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.14);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  /** Adjust ambient drone volume dynamically (e.g. swelling in Phase 3, fading to silence in Phase 5) */
  public setDroneIntensity(level: number): void {
    if (!this.enabled || !this.ctx || !this.droneGain) return;
    const clamped = Math.max(0.0001, Math.min(0.075, level));
    try {
      this.droneGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.25);
    } catch {
      // Ignore audio timing edge cases
    }
  }

  /** Single distant, haunting temple bell tone as Junji Ito's name completes */
  public playDistantBell(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const partials = [
      { freq: 220, amp: 0.055, decay: 4.5 },
      { freq: 442.5, amp: 0.025, decay: 3.4 },
      { freq: 659, amp: 0.012, decay: 2.6 },
    ];

    for (const p of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(p.amp, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    }
  }

  /** Crisp ink-drop transient click */
  public playInkTick(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }
}

export const horrorAudio = new HorrorAudioEngine();

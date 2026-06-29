class GameAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicIntervalId: any = null;
  private activeMusicOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentChordIndex: number = 0;
  private lastBeatTime: number = 0;

  // Modern ambient pentatonic progressions: C Maj7 -> A min7 -> F Maj7 -> G6
  private chords = [
    [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
    [110.00, 130.81, 164.81, 196.00], // A2, C3, E3, G3
    [87.31, 110.00, 130.81, 164.81],  // F2, A2, C3, E3
    [98.00, 146.83, 196.00, 246.94]   // G2, D3, G3, B3
  ];

  private melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, // C4, D4, E4, G4, A4
    523.25, 587.33, 659.25, 783.99, 880.00  // C5, D5, E5, G5, A5
  ];

  constructor() {
    // Initialized on first interaction to comply with browser autoplay policies
    try {
      const savedMusicMuted = localStorage.getItem('game2048_music_muted');
      if (savedMusicMuted) {
        this.isMusicMuted = JSON.parse(savedMusicMuted);
      }
    } catch (_) {}
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('game2048_muted', JSON.stringify(this.isMuted));
    } catch (_) {}
    
    // If master mute is enabled, stop music sounds.
    if (this.isMuted) {
      this.stopMusicLoop();
    } else if (!this.isMusicMuted) {
      this.startMusicLoop();
    }
    
    return this.isMuted;
  }

  toggleMusicMute() {
    this.isMusicMuted = !this.isMusicMuted;
    try {
      localStorage.setItem('game2048_music_muted', JSON.stringify(this.isMusicMuted));
    } catch (_) {}

    if (this.isMusicMuted || this.isMuted) {
      this.stopMusicLoop();
    } else {
      this.startMusicLoop();
    }
    return this.isMusicMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusicLoop();
    } else if (!this.isMusicMuted) {
      this.startMusicLoop();
    }
  }

  getMuteStatus() {
    return this.isMuted;
  }

  getMusicMuteStatus() {
    return this.isMusicMuted;
  }

  startMusicLoop() {
    if (this.isMuted || this.isMusicMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.musicIntervalId) return; // Already running

    // Play initial immediately
    this.playAmbientTick();

    // Schedule ambient notes every 4 seconds
    this.musicIntervalId = setInterval(() => {
      this.playAmbientTick();
    }, 4000);
  }

  stopMusicLoop() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    // Fade out active oscillators gently to avoid pops
    this.activeMusicOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            try {
              osc.stop();
            } catch (_) {}
          }, 600);
        }
      } catch (_) {}
    });
    this.activeMusicOscillators = [];
  }

  private playAmbientTick() {
    if (this.isMuted || this.isMusicMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Play sparse lush pad chord
    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    chord.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Extremely soft ambient pad (envelope: 1s attack, 2.5s release)
      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.012, now + 1.2);
      gain.gain.setValueAtTime(0.012, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);
      
      osc.start(now);
      osc.stop(now + 4.0);
      
      this.activeMusicOscillators.push({ osc, gain });
    });

    // Gently cleanup finished oscillators from storage array
    setTimeout(() => {
      this.activeMusicOscillators = this.activeMusicOscillators.slice(chord.length);
    }, 4100);

    // Schedule 1 or 2 sparse sparkling melody bells on top of the chord
    const playMelody = (delay: number) => {
      if (this.isMuted || this.isMusicMuted || !this.ctx) return;
      const t = this.ctx.currentTime + delay;
      const freq = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.008, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      
      osc.start(t);
      osc.stop(t + 1.6);
    };

    // Play melody notes at delay intervals
    playMelody(0.5);
    if (Math.random() > 0.4) {
      playMelody(2.0);
    }
  }

  playMove() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio playMove failed:", e);
    }
  }

  playMerge() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      
      // Warm chords (C5 and G5 or E5)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      
      osc2.frequency.setValueAtTime(783.99, now); // G5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
      
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc1.start();
      osc2.start();
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    } catch (e) {
      console.warn("Audio playMerge failed:", e);
    }
  }

  playWin() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      // Elegant arpeggio C4 -> E4 -> G4 -> C5 -> E5 -> G5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);
        
        gain.gain.setValueAtTime(0.04, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
        
        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn("Audio playWin failed:", e);
    }
  }

  playGameOver() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const notes = [220.00, 196.00, 164.81, 146.83]; // A3 -> G3 -> E3 -> D3
      
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.15);
        
        gain.gain.setValueAtTime(0.05, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.4);
        
        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.4);
      });
    } catch (e) {
      console.warn("Audio playGameOver failed:", e);
    }
  }
}

export const gameAudio = new GameAudio();

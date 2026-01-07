import { useCallback, useRef } from "react";

// Using Web Audio API for sound generation
export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) => {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [getAudioContext]
  );

  const playBoundarySound = useCallback(() => {
    // Exciting ascending notes for boundary
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, "triangle", 0.4), i * 80);
    });
    // Add crowd roar
    setTimeout(() => {
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.3));
      }
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }, 200);
  }, [getAudioContext, playTone]);

  const playSixSound = useCallback(() => {
    // Even more exciting for six!
    const ctx = getAudioContext();
    const notes = [392, 523, 659, 784, 988, 1319]; // G4, C5, E5, G5, B5, E6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, "triangle", 0.5), i * 60);
    });
    // Bigger crowd roar
    setTimeout(() => {
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.5));
      }
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }, 300);
  }, [getAudioContext, playTone]);

  const playWicketSound = useCallback(() => {
    // Dramatic descending sound for wicket
    const notes = [880, 698, 523, 349, 262]; // A5, F5, C5, F4, C4
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, "sawtooth", 0.3), i * 100);
    });
    // Wood hitting sound
    setTimeout(() => playTone(200, 0.15, "square", 0.4), 50);
  }, [playTone]);

  const playCrowdCheer = useCallback(() => {
    const ctx = getAudioContext();
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      const envelope = Math.sin((i / buffer.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.5;
    }
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }, [getAudioContext]);

  const playBowlSound = useCallback(() => {
    // Whoosh sound for bowling
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  }, [getAudioContext]);

  const playBatHitSound = useCallback(() => {
    // Satisfying bat hitting ball sound
    playTone(800, 0.08, "square", 0.3);
    setTimeout(() => playTone(400, 0.1, "triangle", 0.2), 30);
  }, [playTone]);

  const playDotBallSound = useCallback(() => {
    // Soft thud for dot ball
    playTone(150, 0.1, "sine", 0.15);
  }, [playTone]);

  return {
    playBoundarySound,
    playSixSound,
    playWicketSound,
    playCrowdCheer,
    playBowlSound,
    playBatHitSound,
    playDotBallSound,
  };
};

// Web Audio API Acoustic Soundscape Synthesizer (100% Client-Side, Zero External Assets)

let audioCtx = null;
let currentSource = null;
let currentGain = null;
let heartbeatInterval = null;
let currentMode = null;
let isRunning = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 1. Brownian Noise Synthesizer (Masks harsh room noises & cafeteria spikes)
 */
function createBrownNoiseNode(ctx) {
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; // Gain compensation
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Gentle low-pass filter to make it warm and soothing like gentle rainfall
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, ctx.currentTime);

  whiteNoise.connect(filter);
  return { source: whiteNoise, outNode: filter };
}

/**
 * 2. 432 Hz Binaural Tone with 4Hz Theta Pulsation
 */
function createBinaural432Node(ctx) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz restorative frequency

  // LFO for 4Hz Theta rhythm calming pulse
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(4, ctx.currentTime); // 4 Hz Theta

  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0.2, ctx.currentTime);

  lfo.connect(mainGain.gain);
  osc.connect(mainGain);

  lfo.start();
  osc.start();

  return { source: osc, lfo, outNode: mainGain };
}

/**
 * 3. 60 BPM Rhythmic Maternal Heartbeat Pulse (Low-frequency somatic anchor)
 */
function playHeartbeatThump(ctx, gainNode, volume) {
  const now = ctx.currentTime;

  // Lub (Primary ventricle contraction)
  const osc1 = ctx.createOscillator();
  const thumpGain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(65, now);
  osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

  thumpGain1.gain.setValueAtTime(0.001, now);
  thumpGain1.gain.linearRampToValueAtTime(volume * 0.45, now + 0.03);
  thumpGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc1.connect(thumpGain1);
  thumpGain1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + 0.16);

  // Dub (Secondary valve closure ~0.18s later)
  const osc2 = ctx.createOscillator();
  const thumpGain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(55, now + 0.18);
  osc2.frequency.exponentialRampToValueAtTime(30, now + 0.28);

  thumpGain2.gain.setValueAtTime(0.001, now + 0.18);
  thumpGain2.gain.linearRampToValueAtTime(volume * 0.32, now + 0.21);
  thumpGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

  osc2.connect(thumpGain2);
  thumpGain2.connect(gainNode);
  osc2.start(now + 0.18);
  osc2.stop(now + 0.34);
}

export const soundscapeEngine = {
  start(mode = 'brown_noise', volume = 0.5) {
    this.stop();
    const ctx = getAudioContext();
    if (!ctx) return;

    currentGain = ctx.createGain();
    currentGain.gain.setValueAtTime(Math.max(0.01, Math.min(1.0, volume)), ctx.currentTime);
    currentGain.connect(ctx.destination);

    currentMode = mode;
    isRunning = true;

    if (mode === 'brown_noise') {
      const { source, outNode } = createBrownNoiseNode(ctx);
      outNode.connect(currentGain);
      source.start();
      currentSource = source;
    } else if (mode === 'binaural_432hz') {
      const { source, lfo, outNode } = createBinaural432Node(ctx);
      outNode.connect(currentGain);
      currentSource = source;
      currentSource._lfo = lfo;
    } else if (mode === 'heartbeat') {
      playHeartbeatThump(ctx, currentGain, volume);
      heartbeatInterval = setInterval(() => {
        if (isRunning && currentGain) {
          playHeartbeatThump(ctx, currentGain, volume);
        }
      }, 1000); // 60 BPM
    }
  },

  stop() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    if (currentSource) {
      try {
        if (currentSource._lfo) currentSource._lfo.stop();
        currentSource.stop();
        currentSource.disconnect();
      } catch (e) {
        // Source might already be stopped
      }
      currentSource = null;
    }

    if (currentGain) {
      try {
        currentGain.disconnect();
      } catch (e) {
        // Gain already disconnected
      }
      currentGain = null;
    }

    isRunning = false;
    currentMode = null;
  },

  setVolume(vol) {
    const ctx = getAudioContext();
    if (currentGain && ctx) {
      const safeVol = Math.max(0.001, Math.min(1.0, vol));
      currentGain.gain.setValueAtTime(safeVol, ctx.currentTime);
    }
  },

  isPlaying() {
    return isRunning;
  },

  getActiveMode() {
    return currentMode;
  }
};

// Real-time Web Audio API Ambient Decibel (SPL) Sound Pressure Meter
// Non-blocking microphone amplitude listener with automatic fallback

class AmbientDecibelMeter {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.javascriptNode = null;
    this.isListening = false;
    this.currentDecibel = 45; // Default ambient room baseline
    this.listeners = new Set();
    this.animationFrameId = null;
  }

  async start() {
    if (this.isListening) return;
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      console.warn('Web Audio API getUserMedia not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;

      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.isListening = true;
      this._monitorLoop();
    } catch (err) {
      console.warn('Microphone access for decibel meter declined or unavailable:', err);
      this.isListening = false;
    }
  }

  _monitorLoop() {
    if (!this.isListening || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);

    // Compute Root Mean Square (RMS) volume
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // Realistic Sound Pressure Level (SPL) Decibel calibration
    // Quiet bedroom ~38-45dB, normal speech ~60-70dB, loud shouting/clapping ~80-100dB
    let calculatedDb = Math.round(20 * Math.log10(rms + 0.0001) + 98);
    calculatedDb = Math.max(32, Math.min(105, calculatedDb));

    // Smooth exponential decay
    this.currentDecibel = Math.round(this.currentDecibel * 0.7 + calculatedDb * 0.3);

    this._notifyListeners(this.currentDecibel);

    this.animationFrameId = requestAnimationFrame(() => this._monitorLoop());
  }

  stop() {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.microphone) {
      try {
        this.microphone.mediaStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      this.microphone = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.currentDecibel, this.getSeverity(this.currentDecibel));
    return () => this.listeners.delete(callback);
  }

  _notifyListeners(db) {
    const severity = this.getSeverity(db);
    this.listeners.forEach(cb => {
      try {
        cb(db, severity);
      } catch (e) {
        console.warn('Decibel listener error', e);
      }
    });
  }

  getSeverity(db) {
    if (db < 62) return { level: 'QUIET', label: 'Comfortable', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' };
    if (db < 76) return { level: 'MODERATE', label: 'Moderate Noise', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60', border: 'border-amber-200 dark:border-amber-800' };
    return { level: 'HAZARD', label: 'Sensory Hazard (Too Loud!)', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60', border: 'border-rose-300 dark:border-rose-800' };
  }
}

export const ambientDecibelMeter = new AmbientDecibelMeter();

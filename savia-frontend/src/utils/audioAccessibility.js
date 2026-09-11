// Web Audio API & Speech Synthesis & Haptic Engine for Blind Accessibility

let audioCtx = null;

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

// 1. Play Synthesized Musical Earcons (Auditory Landmarks)
export function playEarcon(type = 'chime') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      // 3 ascending happy notes
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.08); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.16); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'tap') {
      // Short tactile click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'calm') {
      // Gentle ocean breeze tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.6);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'alert') {
      // Warning chime
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(250, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.warn('Audio earcon error:', err);
  }
}

// 2. Natural Pediatric Speech Synthesizer (Gender-Aware, Natural/Neural Voice Matching)

let cachedVoices = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Finds the most natural, human-sounding voice matching target language and gender persona
 */
export function findBestNaturalVoice(lang = 'en-US', gender = 'auto') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const prefix = lang.split('-')[0].toLowerCase();
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
  const pool = langVoices.length > 0 ? langVoices : voices;

  const femaleKeywords = ['female', 'woman', 'girl', 'zira', 'samantha', 'victoria', 'karen', 'swara', 'veena', 'kavya', 'siri'];
  const maleKeywords = ['male', 'man', 'boy', 'david', 'george', 'alex', 'daniel', 'rishi', 'neel', 'ravi', 'guy'];
  const naturalKeywords = ['natural', 'neural', 'google', 'online', 'premium', 'enhanced'];

  const isFemaleTarget = gender === 'girl' || gender === 'female' || gender === 'therapist_female';
  const isMaleTarget = gender === 'boy' || gender === 'male' || gender === 'therapist_male';

  // 1. First priority: High-quality natural voice matching target gender
  if (isFemaleTarget) {
    const match = pool.find(v => {
      const name = v.name.toLowerCase();
      const isFemale = femaleKeywords.some(k => name.includes(k));
      const isNatural = naturalKeywords.some(k => name.includes(k));
      return isFemale && isNatural;
    }) || pool.find(v => {
      const name = v.name.toLowerCase();
      return femaleKeywords.some(k => name.includes(k));
    });
    if (match) return match;
  } else if (isMaleTarget) {
    const match = pool.find(v => {
      const name = v.name.toLowerCase();
      const isMale = maleKeywords.some(k => name.includes(k));
      const isNatural = naturalKeywords.some(k => name.includes(k));
      return isMale && isNatural;
    }) || pool.find(v => {
      const name = v.name.toLowerCase();
      return maleKeywords.some(k => name.includes(k));
    });
    if (match) return match;
  }

  // 2. Second priority: Any natural/neural voice in target language
  const naturalVoice = pool.find(v => naturalKeywords.some(k => v.name.toLowerCase().includes(k)));
  if (naturalVoice) return naturalVoice;

  // 3. Fallback: First voice in language pool or default system voice
  return pool[0] || voices[0] || null;
}

export function speakText(text, options = {}) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const gender = options.gender || options.persona || 'auto';
      const lang = options.lang || 'en-US';
      utterance.lang = lang;

      // Child-Adaptive Pitch & Pace Presets
      let defaultPitch = 1.10;
      let defaultRate = 0.88;

      if (gender === 'boy' || gender === 'male') {
        defaultPitch = 1.14; // Friendly young boy cadence
        defaultRate = 0.89;
      } else if (gender === 'girl' || gender === 'female') {
        defaultPitch = 1.25; // Warm, melodic young girl cadence
        defaultRate = 0.89;
      } else if (gender === 'therapist_female') {
        defaultPitch = 1.02; // Calm, patient female SLP clinician
        defaultRate = 0.86;
      } else if (gender === 'therapist_male') {
        defaultPitch = 0.96; // Reassuring male pediatric doctor
        defaultRate = 0.86;
      }

      utterance.rate = options.rate !== undefined ? options.rate : defaultRate;
      utterance.pitch = options.pitch !== undefined ? options.pitch : defaultPitch;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      // Select human natural voice
      const bestVoice = findBestNaturalVoice(lang, gender);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }
}

// 3. Tactile Vibration Haptic Feedback (Physical Touch for Blind Children)
export function triggerHaptic(type = 'tap') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'tap') {
        navigator.vibrate(25); // Light single click
      } else if (type === 'success') {
        navigator.vibrate([40, 40, 80]); // 3 rhythmic pulses
      } else if (type === 'inhale') {
        navigator.vibrate([60, 30, 60, 30, 80]); // Breathing pulse
      } else if (type === 'alert') {
        navigator.vibrate([100, 50, 100]); // Dual warning pulse
      }
    } catch (e) {
      // Haptics not supported or ignored
    }
  }
}

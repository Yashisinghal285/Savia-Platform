import React, { createContext, useContext, useState, useEffect } from 'react';
import { speakText, playEarcon, triggerHaptic } from '../utils/audioAccessibility';
import { AVAILABLE_LANGUAGES, getTranslation, getSpeechCode } from '../utils/translations';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // 🌙 Theme State: 'light' vs 'dark'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('savia_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
    }
    localStorage.setItem('savia_theme', theme);
  }, [theme]);

  const toggleTheme = (val) => {
    const nextTheme = typeof val === 'string' ? val : (theme === 'light' ? 'dark' : 'light');
    const root = document.documentElement;
    const body = document.body;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
    }
    localStorage.setItem('savia_theme', nextTheme);
    setThemeState(nextTheme);
    playEarcon('tap');
    triggerHaptic('tap');
    if (audioFirstMode) {
      speakText(nextTheme === 'dark' ? t('darkMode') : t('lightMode'), {
        lang: getSpeechCode(language)
      });
    }
  };

  const [audioFirstMode, setAudioFirstMode] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [voiceLog, setVoiceLog] = useState([]);

  // Child-Lock (Guided Access Mode)
  const [childLockActive, setChildLockActive] = useState(() => {
    return localStorage.getItem('savia_child_lock') === 'true';
  });

  const toggleChildLock = (val) => {
    const nextVal = typeof val === 'boolean' ? val : !childLockActive;
    setChildLockActive(nextVal);
    localStorage.setItem('savia_child_lock', nextVal.toString());
    if (nextVal) {
      playEarcon('success');
      triggerHaptic('success');
    }
  };

  // Inactivity Privacy Lock Shield
  const [privacyLockActive, setPrivacyLockActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Auto lock after 10 minutes of inactivity
      timeoutId = setTimeout(() => {
        setPrivacyLockActive(true);
      }, 10 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  // 1. Language State (Supports 8 Languages)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('savia_lang') || 'en';
  });

  const t = (key, fallback) => {
    return getTranslation(language, key, fallback);
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('savia_lang', newLang);
    playEarcon('tap');
    triggerHaptic('tap');
    const selectedLangObj = AVAILABLE_LANGUAGES.find(l => l.code === newLang);
    const nativeName = selectedLangObj ? selectedLangObj.nativeName : newLang;
    const speechCode = getSpeechCode(newLang);
    
    let announcement = `Language set to ${nativeName}`;
    if (newLang === 'hi') announcement = 'भाषा बदलकर हिन्दी कर दी गई है।';
    else if (newLang === 'es') announcement = 'Idioma cambiado a español.';
    else if (newLang === 'mr') announcement = 'भाषा मराठी निवडली आहे.';
    else if (newLang === 'ta') announcement = 'மொழி தமிழாக மாற்றப்பட்டது.';
    else if (newLang === 'bn') announcement = 'ভাষা বাংলায় পরিবর্তন করা হয়েছে।';
    else if (newLang === 'fr') announcement = 'Langue changée en français.';
    else if (newLang === 'de') announcement = 'Sprache auf Deutsch geändert.';

    speakText(announcement, { lang: speechCode });
  };

  // 2. Single-Switch Scanning Mode (For Cerebral Palsy / Motor Disabilities)
  const [switchScanActive, setSwitchScanActive] = useState(false);
  const [switchScanIndex, setSwitchScanIndex] = useState(0);

  const toggleSwitchScan = () => {
    setSwitchScanActive(prev => {
      const next = !prev;
      if (next) {
        playEarcon('success');
        triggerHaptic('success');
        const announcement = language === 'hi' 
          ? 'सिंगल स्विच स्कैनिंग मोड शुरू हो गया है। स्पेसबार या बटन दबाएं।'
          : 'Single-switch scanning mode enabled. Press spacebar or enter to select.';
        speakText(announcement, { lang: language === 'hi' ? 'hi-IN' : 'en-US' });
      } else {
        playEarcon('tap');
        speakText(language === 'hi' ? 'स्विच मोड बंद।' : 'Switch mode disabled.');
      }
      return next;
    });
  };

  // 3. Persistent Pain Incidents History (Namespace-Isolated per active student)
  const [activeChildId, setActiveChildId] = useState('reyansh');

  const getPainHistoryForChild = (childId = activeChildId) => {
    try {
      const key = `savia_pain_history_${childId}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      // Fallback check for legacy non-namespaced key
      if (childId === 'reyansh') {
        const legacy = localStorage.getItem('savia_pain_history');
        if (legacy) return JSON.parse(legacy);
      }
    } catch (e) {
      console.warn('Failed to load pain history', e);
    }
    return childId === 'ananya' ? [
      { id: 101, part: 'Legs / Feet', emoji: '🦵', level: 2, comfort: 'Cold / Warm Pack', time: '9:00 AM (Today)', resolved: false }
    ] : childId === 'kabir' ? [
      { id: 201, part: 'Head', emoji: '🧠', level: 1, comfort: 'Quiet Dark Room', time: '11:20 AM (Today)', resolved: true }
    ] : [
      { id: 1, part: 'Tummy', emoji: '🥣', level: 2, comfort: 'Deep Pressure Hug', time: '10:15 AM (Today)', resolved: false },
      { id: 2, part: 'Ears / Noise', emoji: '👂', level: 3, comfort: 'Noise Headphones', time: 'Yesterday 3:30 PM', resolved: true }
    ];
  };

  const [painHistory, setPainHistory] = useState(() => getPainHistoryForChild('reyansh'));

  const switchPainHistoryChild = (childId) => {
    setActiveChildId(childId);
    setPainHistory(getPainHistoryForChild(childId));
  };

  const recordPainIncident = (partObj, level, comfortObj, specificChildId = activeChildId) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Today)';
    const newIncident = {
      id: Date.now(),
      childId: specificChildId,
      part: partObj.label,
      emoji: partObj.emoji,
      level: level,
      comfort: comfortObj.label,
      time: timeStr,
      resolved: false
    };

    const currentList = getPainHistoryForChild(specificChildId);
    const updated = [newIncident, ...currentList];
    setPainHistory(updated);
    try {
      localStorage.setItem(`savia_pain_history_${specificChildId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save pain history', e);
    }

    // Auto-log into Session Ledger
    logSession({
      category: 'PAIN_MANAGEMENT',
      title: `Pain Logged: ${partObj.label} (Level ${level})`,
      durationMinutes: 15,
      moodRating: level >= 2 ? 'OVERWHELMED' : 'TIRED',
      provider: 'Guardian / Self-Report',
      milestones: `Comfort Aid applied: ${comfortObj.label}`,
      notes: `Reported discomfort in ${partObj.label} with pain level ${level}/3. Soothing protocol initiated.`
    }, false);

    return newIncident;
  };

  // 4. Comprehensive Universal Session Logging Engine
  const [sessionLogs, setSessionLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('savia_session_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load session logs', e);
    }
    return [
      {
        id: 101,
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        category: 'SPEECH_THERAPY',
        title: 'Articulation & Vocalization Drill',
        durationMinutes: 30,
        moodRating: 'HAPPY',
        provider: 'Dr. Neha Verma, SLP',
        milestones: 'Spoke 6 AAC words + sound /s/ repetition',
        notes: 'High responsiveness using the 48-card AAC grid.'
      },
      {
        id: 102,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        time: '04:15 PM',
        category: 'SENSORY',
        title: 'Sensory De-escalation & Calming',
        durationMinutes: 20,
        moodRating: 'CALM',
        provider: 'Ananya (Mother)',
        milestones: '4-4-4 Calm breathing & weighted blanket',
        notes: 'De-escalated sensory overload within 6 minutes without meltdown.'
      },
      {
        id: 103,
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        time: '11:00 AM',
        category: 'OCCUPATIONAL_THERAPY',
        title: 'Fine Motor Grip & Dexterity',
        durationMinutes: 45,
        moodRating: 'FOCUSED',
        provider: 'David Lee, OTR/L',
        milestones: 'Pencil tripod grip & block stacking',
        notes: 'Maintained fine motor focus for 15 unbroken minutes.'
      },
      {
        id: 104,
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        time: '09:00 AM',
        category: 'ROUTINE',
        title: 'Morning Independence Visual Schedule',
        durationMinutes: 25,
        moodRating: 'HAPPY',
        provider: 'Reyansh (Self)',
        milestones: 'Toothbrush, Breakfast, Shoes checklist',
        notes: 'Completed 100% of morning routine autonomously.'
      }
    ];
  });

  const logSession = (sessionData, playFeedback = true) => {
    const newLog = {
      id: Date.now(),
      date: sessionData.date || new Date().toISOString().split('T')[0],
      time: sessionData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: sessionData.category || 'GENERAL_THERAPY',
      title: sessionData.title || 'Therapy Practice Session',
      durationMinutes: Number(sessionData.durationMinutes) || 20,
      moodRating: sessionData.moodRating || 'HAPPY',
      provider: sessionData.provider || 'Guardian / Clinician',
      milestones: sessionData.milestones || '',
      notes: sessionData.notes || ''
    };

    const updated = [newLog, ...sessionLogs];
    setSessionLogs(updated);
    try {
      localStorage.setItem('savia_session_logs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save session logs', e);
    }

    if (playFeedback) {
      playEarcon('success');
      triggerHaptic('success');
    }
    return newLog;
  };

  const deleteSessionLog = (id) => {
    const updated = sessionLogs.filter(l => l.id !== id);
    setSessionLogs(updated);
    try {
      localStorage.setItem('savia_session_logs', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update session logs', e);
    }
    playEarcon('tap');
  };

  const clearSessionLogs = () => {
    setSessionLogs([]);
    try {
      localStorage.removeItem('savia_session_logs');
    } catch (e) {
      console.warn('Failed to clear session logs', e);
    }
  };

  const exportSessionLogs = (format = 'json') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `savia_session_history_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv') {
      const headers = ['Date', 'Time', 'Category', 'Title', 'Duration (Mins)', 'Mood', 'Provider', 'Milestones', 'Notes'];
      const rows = sessionLogs.map(l => [
        `"${l.date}"`,
        `"${l.time}"`,
        `"${l.category}"`,
        `"${(l.title || '').replace(/"/g, '""')}"`,
        l.durationMinutes,
        `"${l.moodRating}"`,
        `"${(l.provider || '').replace(/"/g, '""')}"`,
        `"${(l.milestones || '').replace(/"/g, '""')}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute("download", `savia_session_history_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  const toggleAudioFirstMode = () => {
    setAudioFirstMode(prev => {
      const next = !prev;
      if (next) {
        playEarcon('success');
        triggerHaptic('success');
        speakText(
          language === 'hi' 
            ? 'ऑडियो-फर्स्ट और दृष्टिहीन मोड सक्रिय है।' 
            : 'Audio-First Mode is now Active. All actions and items will speak aloud.',
          { lang: language === 'hi' ? 'hi-IN' : 'en-US' }
        );
      } else {
        playEarcon('tap');
        speakText(language === 'hi' ? 'ऑडियो मोड बंद।' : 'Audio-First Mode off.');
      }
      return next;
    });
  };

  // 5. Natural Voice Persona Customizer ('auto' | 'boy' | 'girl' | 'therapist_female' | 'therapist_male')
  const [voicePersona, setVoicePersonaState] = useState(() => {
    return localStorage.getItem('savia_voice_persona') || 'auto';
  });

  const getEffectiveVoicePersona = (childId = activeChildId) => {
    if (voicePersona !== 'auto') return voicePersona;
    if (childId === 'ananya') return 'girl';
    return 'boy'; // 'reyansh', 'kabir'
  };

  const setVoicePersona = (persona) => {
    setVoicePersonaState(persona);
    localStorage.setItem('savia_voice_persona', persona);
    playEarcon('tap');
    triggerHaptic('tap');
    const effective = persona === 'auto' ? (activeChildId === 'ananya' ? 'girl' : 'boy') : persona;
    const testPhrase = language === 'hi' 
      ? 'नमस्ते! मेरी प्राकृतिक आवाज़ अब सक्रिय है।' 
      : 'Hello! My natural voice is now active and ready.';
    speakText(testPhrase, { lang: language === 'hi' ? 'hi-IN' : 'en-US', gender: effective });
  };

  // Announce anything with optional earcon and haptic feedback
  const announce = (text, type = 'tap') => {
    if (audioFirstMode) {
      playEarcon(type);
      triggerHaptic(type);
      speakText(text, { 
        lang: language === 'hi' ? 'hi-IN' : 'en-US',
        gender: getEffectiveVoicePersona()
      });
    }
  };

  // Helper to get active child localized name
  const getChildDisplayName = () => {
    if (activeChildId === 'ananya') return { en: 'Ananya', hi: 'अनन्या' };
    if (activeChildId === 'kabir') return { en: 'Kabir', hi: 'कबीर' };
    return { en: 'Reyansh', hi: 'रेयांश' };
  };

  // Voice Assistant Execution (Voice Queries for Blind Children)
  const processVoiceCommand = (commandText) => {
    const clean = commandText.toLowerCase();
    const childName = getChildDisplayName();
    triggerHaptic('tap');

    let response = '';
    if (clean.includes('schedule') || clean.includes('routine') || clean.includes('next')) {
      response = language === 'hi'
        ? `अगला रूटीन: सुबह 11:30 बजे, ${childName.hi} का खेल और भाषा अभ्यास है।`
        : `Next routine: At 11:30 AM, ${childName.en} has Playtime and AAC practice.`;
      playEarcon('chime');
    } else if (clean.includes('hurt') || clean.includes('pain') || clean.includes('tummy') || clean.includes('head') || clean.includes('दर्द')) {
      response = language === 'hi'
        ? 'दर्द का नक्शा खुला है। आप बता सकते हैं कि कहां दर्द हो रहा है।'
        : 'Pain map opened. You can say where it hurts or tap your screen.';
      playEarcon('alert');
    } else if (clean.includes('breathe') || clean.includes('calm') || clean.includes('relax') || clean.includes('शांत')) {
      response = language === 'hi'
        ? '4-4-4 शांत श्वास शुरू हो रहा है। फोन को हाथ में पकड़ें और धड़कन महसूस करें।'
        : 'Starting 4-4-4 Calm Breathing. Hold the phone in your hand to feel the gentle breathing pulse.';
      playEarcon('calm');
    } else if (clean.includes('cheer') || clean.includes('lion') || clean.includes('leo')) {
      response = language === 'hi'
        ? `शेर लियो कहता है: नमस्ते ${childName.hi}! आप बहुत बहादुर और समझदार हैं!`
        : `Leo the Lion says: Hello ${childName.en}! You are brave, smart, and doing fantastic today!`;
      playEarcon('success');
    } else if (clean.includes('doctor') || clean.includes('therapist') || clean.includes('neha')) {
      response = language === 'hi'
        ? `डॉ. नेहा वर्मा का संदेश: ${childName.hi} ने आज अभ्यास में बहुत अच्छा सुधार दिखाया।`
        : `Dr. Neha Verma left a message: ${childName.en} showed wonderful progress in therapy today.`;
      playEarcon('chime');
    } else {
      response = language === 'hi'
        ? `समझा: ${commandText}। साविया ${childName.hi} की मदद के लिए तैयार है।`
        : `Understood: ${commandText}. Savia is listening and ready to help ${childName.en}.`;
      playEarcon('tap');
    }

    speakText(response, { 
      lang: language === 'hi' ? 'hi-IN' : 'en-US',
      gender: getEffectiveVoicePersona()
    });
    setVoiceLog(prev => [{ query: commandText, answer: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev]);
    return response;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        setTheme: setThemeState,
        toggleTheme,
        audioFirstMode,
        setAudioFirstMode,
        toggleAudioFirstMode,
        announce,
        language,
        setLanguage: changeLanguage,
        t,
        AVAILABLE_LANGUAGES,
        speechCode: getSpeechCode(language),
        voicePersona,
        setVoicePersona,
        getEffectiveVoicePersona,
        switchScanActive,
        setSwitchScanActive,
        toggleSwitchScan,
        switchScanIndex,
        setSwitchScanIndex,
        childLockActive,
        toggleChildLock,
        privacyLockActive,
        setPrivacyLockActive,
        painHistory,
        recordPainIncident,
        switchPainHistoryChild,
        activeChildId,
        sessionLogs,
        logSession,
        deleteSessionLog,
        clearSessionLogs,
        exportSessionLogs,
        voiceAssistantOpen,
        setVoiceAssistantOpen,
        processVoiceCommand,
        voiceLog
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

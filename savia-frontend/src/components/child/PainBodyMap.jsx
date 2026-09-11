import React, { useState, useEffect } from 'react';
import { Heart, Volume2, AlertCircle, Sparkles, Check, Smile, Frown, Bot, ShieldAlert, Headphones, Play, Square, Sliders } from 'lucide-react';
import { triggerHaptic, playEarcon, speakText } from '../../utils/audioAccessibility';
import { useAccessibility } from '../../context/AccessibilityContext';
import { checkSensoryWatchdog } from '../../api/agents';
import { ambientDecibelMeter } from '../../utils/decibelMeter';
import { soundscapeEngine } from '../../utils/soundscapeEngine';

export default function PainBodyMap({ onClose, onSelectBreathe }) {
  const { language, recordPainIncident, activeChildId } = useAccessibility();
  const [selectedPart, setSelectedPart] = useState('tummy');
  const [painLevel, setPainLevel] = useState(2); // 1 = mild, 2 = medium, 3 = severe
  const [selectedComfort, setSelectedComfort] = useState('hug');
  const [logged, setLogged] = useState(false);
  const [sensoryPrescription, setSensoryPrescription] = useState(null);
  const [liveDb, setLiveDb] = useState(48);
  const [dbSeverity, setDbSeverity] = useState({ level: 'QUIET', label: 'Comfortable', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' });
  const [rapidTapAgitation, setRapidTapAgitation] = useState(false);
  const [showCircadianDetails, setShowCircadianDetails] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState(null); // null | 'brown_noise' | 'binaural_432hz' | 'heartbeat'
  const [soundscapeVolume, setSoundscapeVolume] = useState(0.4);
  const tapHistoryRef = React.useRef([]);

  // Cleanup soundscape on unmount
  useEffect(() => {
    return () => {
      soundscapeEngine.stop();
    };
  }, []);

  const handleToggleSoundscape = (mode) => {
    if (activeSoundscape === mode) {
      soundscapeEngine.stop();
      setActiveSoundscape(null);
      playEarcon('tap');
    } else {
      soundscapeEngine.start(mode, soundscapeVolume);
      setActiveSoundscape(mode);
      playEarcon('calm');
      triggerHaptic('tap');
    }
  };

  const handleVolumeChange = (newVol) => {
    setSoundscapeVolume(newVol);
    soundscapeEngine.setVolume(newVol);
  };

  // Predictive Circadian Sensory Fatigue Forecaster
  const getCircadianFatigueStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const timeVal = currentHour + currentMin / 60;

    if (timeVal >= 7 && timeVal < 9.5) {
      return {
        phase: 'Morning School Transition Window',
        phaseHi: 'सुबह का स्कूल संक्रमण विंडो',
        riskPct: 52,
        riskLevel: 'Moderate Load',
        riskColor: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        barColor: 'bg-amber-500',
        vulnerability: 'Cortisol awakening peak & morning tactile dressing sensitivity.',
        prescription: 'Provide 3-minute proprioceptive joint compression & visual schedule reassurance.',
        icon: '🌅'
      };
    } else if (timeVal >= 11.5 && timeVal < 13.5) {
      return {
        phase: 'Pre-Lunch Sensory Surge & Cafeteria Echo Window',
        phaseHi: 'दोपहर का संवेदी लोड व कैंटीन शोर विंडो',
        riskPct: 78,
        riskLevel: 'High Risk Surge',
        riskColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        barColor: 'bg-rose-500',
        vulnerability: 'Acoustic reverberation, low blood sugar dip, cognitive processing fatigue.',
        prescription: 'Deploy noise-canceling headphones & offer a low-stimulus eating environment.',
        icon: '🍽️'
      };
    } else if (timeVal >= 13.5 && timeVal < 15.5) {
      return {
        phase: 'Post-Lunch Circadian Dip & Meltdown Vulnerability Window',
        phaseHi: 'दोपहर का थकान व संवेदी संवेदनशीलता विंडो',
        riskPct: 86,
        riskLevel: 'Critical Meltdown Risk',
        riskColor: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        barColor: 'bg-rose-600',
        vulnerability: 'Post-prandial drop, sensory accumulator saturation, low verbal tolerance.',
        prescription: 'Initiate proactive 2-minute box breathing calming break immediately.',
        icon: '⚠️'
      };
    } else if (timeVal >= 16.5 && timeVal < 19) {
      return {
        phase: 'After-School Decompression & Homework Load Window',
        phaseHi: 'शाम का स्कूल के बाद आराम व गृहकार्य विंडो',
        riskPct: 64,
        riskLevel: 'Elevated Sensory Load',
        riskColor: 'text-orange-600 dark:text-orange-400',
        badgeBg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        barColor: 'bg-orange-500',
        vulnerability: 'After-school restraint collapse from masking in class; physical irritability.',
        prescription: 'Provide 15 minutes of unstructured gross-motor swing / tactile clay play.',
        icon: '🌆'
      };
    } else if (timeVal >= 19 && timeVal < 22) {
      return {
        phase: 'Pre-Bedtime Sensory Down-Regulation Phase',
        phaseHi: 'सोने से पहले शांतिकरण चरण',
        riskPct: 38,
        riskLevel: 'Moderate Regulation',
        riskColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        barColor: 'bg-blue-500',
        vulnerability: 'Blue light sensitivity & evening executive fatigue.',
        prescription: 'Dim lights < 30 lux, soft weighted lap pad, white noise audio hum.',
        icon: '🌙'
      };
    } else {
      return {
        phase: 'Rest & Neuro-Regenerative Sleep Window',
        phaseHi: 'रात्रि विश्राम व पुनर्जनन चरण',
        riskPct: 15,
        riskLevel: 'Low Baseline',
        riskColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-emerald-500',
        vulnerability: 'Optimal rest window. Low environmental disturbance needed.',
        prescription: 'Maintain 20-22°C ambient room temperature & quiet acoustics.',
        icon: '✨'
      };
    }
  };

  const circadian = getCircadianFatigueStatus();

  // Rapid-Tap Agitation Detector (Detects physical frustration / erratic screen tapping)
  const handleAnyTap = () => {
    const now = Date.now();
    tapHistoryRef.current = [...tapHistoryRef.current.filter(t => now - t < 1500), now];
    if (tapHistoryRef.current.length >= 4 && !rapidTapAgitation) {
      setRapidTapAgitation(true);
      playEarcon('tap');
      triggerHaptic('warning');
      toast?.warning?.('High screen tapping agitation detected. Initiating sensory de-escalation protocol.');
    }
  };

  const interoceptionNeeds = [
    {
      id: 'bathroom_need',
      label: 'Need Restroom',
      labelHi: 'शौचालय जाना है',
      emoji: '🚻',
      phraseEn: 'I need to use the restroom right now please.',
      phraseHi: 'मुझे तुरंत शौचालय जाना है।',
      comfortId: 'bathroom'
    },
    {
      id: 'clothes_itchy',
      label: 'Clothes Scratchy / Itchy',
      labelHi: 'कपड़े चुभ रहे हैं',
      emoji: '👕',
      phraseEn: 'My clothes are scratchy and hurting my skin.',
      phraseHi: 'मेरे कपड़े मुझे चुभ रहे हैं और त्वचा में खुजली हो रही है।',
      comfortId: 'dark'
    },
    {
      id: 'temp_distress',
      label: 'Too Cold / Hot',
      labelHi: 'बहुत ठंडी / गर्मी',
      emoji: '🧊',
      phraseEn: 'I am uncomfortable, my body is shivering or sweating.',
      phraseHi: 'मुझे बहुत ठंडी या बहुत गर्मी लग रही है।',
      comfortId: 'ice'
    },
    {
      id: 'hunger_thirst',
      label: 'Thirsty / Low Energy',
      labelHi: 'प्यास / भूख',
      emoji: '🥪',
      phraseEn: 'I need fresh water or a snack to get energy.',
      phraseHi: 'मुझे भूख या बहुत प्यास लगी है।',
      comfortId: 'water'
    }
  ];

  const handleInteroceptionSelect = (item) => {
    handleAnyTap();
    setSelectedPart(item.id);
    setSelectedComfort(item.comfortId);
    const phrase = language === 'hi' ? item.phraseHi : item.phraseEn;
    speakText(phrase);
    triggerHaptic('tap');
    playEarcon('tap');
    toast?.clinical?.(phrase, { title: 'Interoception Need' });
  };

  const bodyParts = [
    { 
      id: 'head', 
      label: 'Head', 
      labelHi: 'सिर',
      emoji: '🧠', 
      phraseEn: 'My head hurts or is dizzy.',
      phraseHi: 'मेरे सिर में दर्द या चक्कर आ रहा है।'
    },
    { 
      id: 'tummy', 
      label: 'Tummy', 
      labelHi: 'पेट',
      emoji: '🥣', 
      phraseEn: 'My tummy hurts.',
      phraseHi: 'मेरे पेट में दर्द हो रहा है।'
    },
    { 
      id: 'ears', 
      label: 'Ears / Noise', 
      labelHi: 'कान / शोर',
      emoji: '👂', 
      phraseEn: 'The sounds are too loud and hurt my ears.',
      phraseHi: 'आवाजें बहुत तेज हैं और मेरे कानों में चुभ रही हैं।'
    },
    { 
      id: 'eyes', 
      label: 'Eyes / Light', 
      labelHi: 'आँखें / रोशनी',
      emoji: '👀', 
      phraseEn: 'The lights are too bright and hurt my eyes.',
      phraseHi: 'रोशनी बहुत तेज है और मेरी आँखों को दर्द दे रही है।'
    },
    { 
      id: 'teeth', 
      label: 'Teeth / Mouth', 
      labelHi: 'दाँत / मुँह',
      emoji: '🦷', 
      phraseEn: 'My mouth or tooth hurts.',
      phraseHi: 'मेरे दाँत या मुँह में दर्द है।'
    },
    { 
      id: 'throat', 
      label: 'Throat / Chest', 
      labelHi: 'गला / छाती',
      emoji: '🧣', 
      phraseEn: 'My throat feels sore.',
      phraseHi: 'मेरे गले में खराश या दर्द है।'
    },
    { 
      id: 'hands', 
      label: 'Arms / Hands', 
      labelHi: 'हाथ / बाँह',
      emoji: '✋', 
      phraseEn: 'My arm or hand hurts.',
      phraseHi: 'मेरे हाथ में दर्द हो रहा है।'
    },
    { 
      id: 'legs', 
      label: 'Legs / Feet', 
      labelHi: 'पैर',
      emoji: '🦵', 
      phraseEn: 'My leg or foot hurts.',
      phraseHi: 'मेरे पैर में दर्द है।'
    },
  ];

  const comfortOptions = [
    { 
      id: 'hug', 
      label: 'Deep Pressure Hug', 
      labelHi: 'गले लगाना',
      emoji: '🫂', 
      cueEn: 'I need a gentle deep pressure hug.',
      cueHi: 'मुझे प्यार से गले लगाना चाहिए।'
    },
    { 
      id: 'dark', 
      label: 'Quiet Dark Room', 
      labelHi: 'शांत अँधेरा कमरा',
      emoji: '🌙', 
      cueEn: 'I need to rest in a quiet dark room.',
      cueHi: 'मुझे शांत और अंधेरे कमरे में आराम चाहिए।'
    },
    { 
      id: 'headphones', 
      label: 'Noise Headphones', 
      labelHi: 'हेडफोन',
      emoji: '🎧', 
      cueEn: 'Please hand me my noise canceling headphones.',
      cueHi: 'कृपया मुझे शोर कम करने वाले हेडफोन दें।'
    },
    { 
      id: 'water', 
      label: 'Sip of Water', 
      labelHi: 'घूंट पानी',
      emoji: '🥤', 
      cueEn: 'I need a cool sip of water.',
      cueHi: 'मुझे थोड़ा ठंडा पानी पीना है।'
    },
    { 
      id: 'ice', 
      label: 'Cold / Warm Pack', 
      labelHi: 'बर्फ / सिकाई',
      emoji: '🧊', 
      cueEn: 'I need a soothing ice pack.',
      cueHi: 'मुझे सिकाई या आइस पैक की जरूरत है।'
    },
    { 
      id: 'bathroom', 
      label: 'Bathroom Break', 
      labelHi: 'शौचालय',
      emoji: '🚻', 
      cueEn: 'I need to go to the bathroom.',
      cueHi: 'मुझे शौचालय जाना है।'
    },
  ];

  const activePartObj = bodyParts.find(b => b.id === selectedPart) || bodyParts[1];
  const activeComfortObj = comfortOptions.find(c => c.id === selectedComfort) || comfortOptions[0];

  useEffect(() => {
    ambientDecibelMeter.start();
    const unsubscribe = ambientDecibelMeter.subscribe((db, severity) => {
      setLiveDb(db);
      setDbSeverity(severity);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const speakPain = () => {
    triggerHaptic('tap');
    playEarcon('alert');

    if (language === 'hi') {
      const severityHi = painLevel === 1 ? 'थोड़ा सा' : painLevel === 2 ? 'मध्यम' : 'बहुत तेज';
      const fullText = `${activePartObj.phraseHi} यह ${severityHi} दर्द है। ${activeComfortObj.cueHi}`;
      speakText(fullText, { lang: 'hi-IN' });
    } else {
      const severityText = painLevel === 1 ? 'a little bit' : painLevel === 2 ? 'medium' : 'very badly';
      const fullText = `${activePartObj.phraseEn} It hurts ${severityText}. ${activeComfortObj.cueEn}`;
      speakText(fullText, { lang: 'en-US' });
    }
  };

  const handleAlertCircle = async () => {
    speakPain();
    triggerHaptic('alert');
    playEarcon('success');

    // Persist incident for doctor & parent history
    recordPainIncident(activePartObj, painLevel, activeComfortObj);

    setLogged(true);

    try {
      const res = await checkSensoryWatchdog(
        activePartObj.id,
        painLevel,
        activeComfortObj.id,
        liveDb
      );
      if (res && res.prescription) {
        setSensoryPrescription(res);
      }
    } catch (e) {
      console.warn('Sensory watchdog error', e);
    }

    setTimeout(() => setLogged(false), 5000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl font-bold border border-rose-100 dark:border-rose-800">
            🫀
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {language === 'hi' ? 'कहाँ दर्द हो रहा है?' : 'Where Does It Hurt?'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {language === 'hi' ? '1-टैप दर्द और राहत संचार' : '1-Tap pain & sensory communication'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Live Ambient Decibel Watchdog Monitor (Web Audio API) */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between ${dbSeverity.bg} ${dbSeverity.border} transition-colors duration-200`}>
        <div className="flex items-center space-x-2.5">
          <Volume2 className={`w-4 h-4 ${dbSeverity.color} ${liveDb > 75 ? 'animate-pulse' : ''}`} />
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-black ${dbSeverity.color}`}>
                Live Room Noise: {liveDb} dB SPL
              </span>
              <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${dbSeverity.border} bg-white dark:bg-slate-900 ${dbSeverity.color}`}>
                {dbSeverity.label}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Continuous Web Audio sensor streamed into Sensory AI Agent Watchdog
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${dbSeverity.color} ${dbSeverity.border} bg-white dark:bg-slate-900 hidden sm:inline`}>
          {liveDb > 75 ? '⚠️ SENSORY HAZARD' : '🟢 SENSORY SAFE'}
        </span>
      </div>

      {/* Circadian Transition Sensory Fatigue Forecaster */}
      <div className={`p-3.5 rounded-2xl border ${circadian.badgeBg} transition-all space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">{circadian.icon}</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {language === 'hi' ? circadian.phaseHi : circadian.phase}
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${circadian.badgeBg}`}>
                  {circadian.riskLevel}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                {language === 'hi' ? 'दैनिक संवेदी थकान पूर्वानुमान (Circadian Rhythm)' : 'Circadian Neuro-Sensory Fatigue Forecaster'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-xs font-black ${circadian.riskColor}`}>
              {circadian.riskPct}% Vulnerability
            </div>
            <button
              type="button"
              onClick={() => setShowCircadianDetails(!showCircadianDetails)}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showCircadianDetails ? 'Hide Strategy ▴' : 'View Strategy ▾'}
            </button>
          </div>
        </div>

        {/* Vulnerability Gauge */}
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className={`h-full ${circadian.barColor} rounded-full transition-all duration-500`}
            style={{ width: `${circadian.riskPct}%` }}
          />
        </div>

        {showCircadianDetails && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] text-slate-700 dark:text-slate-300">
              <strong>Sensory Factor:</strong> {circadian.vulnerability}
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>💡 <strong>Proactive Aid:</strong> {circadian.prescription}</span>
              {onSelectBreathe && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    onSelectBreathe();
                  }}
                  className="ml-2 px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black shrink-0 transition-all"
                >
                  🫁 Calm Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acoustic Sensory De-Escalation Soundscape Engine (Web Audio API) */}
      <div className="p-3.5 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/40 dark:via-cyan-950/40 dark:to-blue-950/40 border border-teal-200/80 dark:border-teal-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
              🎧
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-teal-950 dark:text-teal-200">
                  {language === 'hi' ? 'ध्वनिक संवेदी शांतिकरण (Acoustic De-Escalation)' : 'Acoustic Sensory Soundscape Synthesizer'}
                </span>
                {activeSoundscape && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-teal-600 text-white rounded-full animate-pulse">
                    PLAYING
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                {language === 'hi' ? 'नेत्र-बंद और अति-उत्तेजना में सहायक शून्य-विलंब ऑडियो' : 'Eyes-closed neuro-regulation & noise spike masking'}
              </span>
            </div>
          </div>

          {activeSoundscape && (
            <button
              onClick={() => handleToggleSoundscape(activeSoundscape)}
              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black flex items-center space-x-1 shadow-xs transition-all"
            >
              <Square className="w-2.5 h-2.5 fill-white" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* 3 Soundscape Mode Chips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'brown_noise', label: 'Brown Noise', labelHi: 'ब्राउन नॉइज़', emoji: '🌧️', desc: 'Masks Room Noise' },
            { id: 'binaural_432hz', label: '432Hz Binaural', labelHi: '432Hz बाइनॉरल', emoji: '🧘', desc: 'Theta Relaxation' },
            { id: 'heartbeat', label: '60 BPM Heart', labelHi: '60 BPM धड़कन', emoji: '🫀', desc: 'Somatic Anchor' }
          ].map(snd => {
            const isSelected = activeSoundscape === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => handleToggleSoundscape(snd.id)}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-0.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-102 font-black'
                    : 'bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 font-bold'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{snd.emoji}</span>
                  <span className="text-[11px] truncate">
                    {language === 'hi' ? snd.labelHi : snd.label}
                  </span>
                </div>
                <span className={`text-[9px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                  {snd.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider if active */}
        {activeSoundscape && (
          <div className="flex items-center space-x-2 pt-1 border-t border-teal-200/60 dark:border-teal-900/60 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300 shrink-0" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Volume:</span>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={soundscapeVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 w-8 text-right">
              {Math.round(soundscapeVolume * 100)}%
            </span>
          </div>
        )}
      </div>

      {logged && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
          <span>
            {language === 'hi'
              ? 'चेतावनी दर्ज कर ली गई है और देखभाल टीम को भेज दी गई है!'
              : 'Alert vocalized & recorded to clinical incident log!'}
          </span>
        </div>
      )}

      {/* AI Sensory Agent Live Coping Prescription */}
      {sensoryPrescription && (
        <div className="p-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/50 dark:via-indigo-950/50 dark:to-blue-950/50 border border-purple-200/80 dark:border-purple-800 rounded-2xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black text-purple-900 dark:text-purple-200">
                Sensory AI Agent Live Protocol
              </span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">
              Load: {sensoryPrescription.sensory_load || 'MODERATE'}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {sensoryPrescription.prescription}
          </p>
          {sensoryPrescription.recommended_action === 'INITIATE_BOX_BREATHING' && onSelectBreathe && (
            <button
              onClick={() => {
                if (onClose) onClose();
                onSelectBreathe();
              }}
              className="mt-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
            >
              <span>🫁</span>
              <span>Launch Calm Corner (Box Breathing)</span>
            </button>
          )}
        </div>
      )}

      {/* Rapid-Tap Agitation Alert Banner */}
      {rapidTapAgitation && (
        <div className="p-4 bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 dark:from-amber-950/60 dark:via-rose-950/60 dark:to-purple-950/60 border-2 border-amber-300 dark:border-amber-700 rounded-3xl space-y-2 animate-pulse shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌊</span>
              <span className="text-xs font-black text-amber-950 dark:text-amber-200">
                Agitation Spike Detected (Rapid Tapping)
              </span>
            </div>
            <button
              onClick={() => setRapidTapAgitation(false)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Dismiss ✕
            </button>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Multiple quick screen taps detected. Let's take a calm pause together to regulate your nervous system.
          </p>
          {onSelectBreathe && (
            <button
              onClick={() => {
                if (onClose) onClose();
                onSelectBreathe();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>🫁</span>
              <span>Start 4-4-4 Box Breathing Now</span>
            </button>
          )}
        </div>
      )}

      {/* 0. Interoception & Internal Bodily Needs (Autism Clinical Standard) */}
      <div className="space-y-2 bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-blue-950 dark:text-blue-200 uppercase tracking-wider flex items-center space-x-1.5">
            <span>🫀</span>
            <span>{language === 'hi' ? 'आंतरिक शारीरिक जरूरतें (Interoception)' : 'Internal Body Needs (Interoception)'}</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Non-Acoustic Signals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {interoceptionNeeds.map(item => {
            const isSelected = selectedPart === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleInteroceptionSelect(item)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 font-black'
                    : 'bg-white dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 font-bold'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[11px] truncate w-full">
                  {language === 'hi' ? item.labelHi : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Body Part Selector (8 Tactile Quadrants) */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          {language === 'hi' ? '1. दर्द की जगह चुनें' : '1. Tap Where It Hurts'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {bodyParts.map(part => {
            const isSelected = selectedPart === part.id;
            return (
              <button
                key={part.id}
                onClick={() => { handleAnyTap(); setSelectedPart(part.id); triggerHaptic('tap'); }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200 dark:shadow-none scale-102'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-700'
                }`}
              >
                <span className="text-2xl">{part.emoji}</span>
                <span className="font-bold text-xs">
                  {language === 'hi' ? part.labelHi : part.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pain Level Thermometer */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          {language === 'hi' ? '2. दर्द कितना तेज है?' : '2. How Much Does It Hurt?'}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { level: 1, label: language === 'hi' ? 'थोड़ा' : 'A Little', emoji: '😐', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200', activeBg: 'bg-amber-500 text-white' },
            { level: 2, label: language === 'hi' ? 'दर्द है' : 'Hurts', emoji: '😣', bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200', activeBg: 'bg-orange-500 text-white' },
            { level: 3, label: language === 'hi' ? 'बहुत तेज' : 'Hurts Badly', emoji: '😭', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200', activeBg: 'bg-rose-600 text-white' },
          ].map(p => (
            <button
              key={p.level}
              onClick={() => { setPainLevel(p.level); triggerHaptic('tap'); }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 font-bold text-xs ${
                painLevel === p.level
                  ? `${p.activeBg} shadow-md scale-102`
                  : `${p.bg}`
              }`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Instant Comfort Need */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          {language === 'hi' ? '3. आपको क्या आराम देगा?' : '3. What Will Help Me Feel Better?'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {comfortOptions.map(c => {
            const isSelected = selectedComfort === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { setSelectedComfort(c.id); triggerHaptic('tap'); }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] text-[#2563EB] dark:text-blue-300 font-black ring-2 ring-blue-100 dark:ring-blue-900'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700 font-semibold'
                }`}
              >
                <span className="text-lg">{c.emoji}</span>
                <span className="text-xs truncate">
                  {language === 'hi' ? c.labelHi : c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Action Speak & Alert Bar */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={speakPain}
          className="w-full sm:flex-1 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-xs font-black shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <Volume2 className="w-4 h-4 text-blue-300" />
          <span>{language === 'hi' ? 'आवाज में बोलें' : 'Speak Out Loud (Voice)'}</span>
        </button>

        <button
          onClick={handleAlertCircle}
          className="w-full sm:flex-1 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center space-x-2"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>{language === 'hi' ? 'रिकॉर्ड करें व सूचित करें' : 'Record & Alert Care Circle'}</span>
        </button>
      </div>

    </div>
  );
}

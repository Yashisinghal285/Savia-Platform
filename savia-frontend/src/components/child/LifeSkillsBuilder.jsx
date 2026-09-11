import React, { useState, useEffect } from 'react';
import { Award, Star, Volume2, CheckCircle2, Sparkles, ChevronRight, Trophy, Play, Pause, RotateCcw, Timer, ShieldCheck } from 'lucide-react';
import { triggerHaptic, playEarcon, speakText } from '../../utils/audioAccessibility';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function LifeSkillsBuilder({ onClose }) {
  const { language, logSession } = useAccessibility();
  const [activeSkillId, setActiveSkillId] = useState(1);

  // Persistent Completed Steps
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('savia_life_skills_steps');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load steps', e);
    }
    return {
      1: [true, false, false],
      2: [true, true, false],
      3: [false, false, false]
    };
  });

  // ABA Prompt Hierarchy Levels: 'I' (Independent), 'GP' (Gestural Prompt), 'PA' (Physical Assistance)
  const [stepPrompts, setStepPrompts] = useState(() => {
    try {
      const saved = localStorage.getItem('savia_life_skills_prompts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load prompts', e);
    }
    return {
      1: ['I', 'I', 'GP'],
      2: ['I', 'GP', 'PA'],
      3: ['GP', 'PA', 'PA']
    };
  });

  // Step Pacing Timer State
  const [timerSeconds, setTimerSeconds] = useState(20);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTimerStep, setActiveTimerStep] = useState(0);

  // Persistent Stars
  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('savia_life_skills_stars');
      if (saved) return parseInt(saved, 10);
    } catch (e) {
      console.warn('Failed to load stars', e);
    }
    return 6;
  });

  const skills = [
    {
      id: 1,
      title: 'Dress Up',
      titleHi: 'कपड़े पहनना',
      emoji: '👕',
      category: 'Morning Autonomy',
      categoryHi: 'सुबह की स्वतंत्रता',
      durationSeconds: 15,
      steps: [
        { 
          id: 0, 
          text: 'Put head through shirt collar', 
          textHi: 'कमीज के गले से सिर बाहर निकालें',
          audioEn: 'Great start! Push your head through the shirt opening.',
          audioHi: 'बहुत बढ़िया शुरुआत! कमीज के गले से सिर निकालें।'
        },
        { 
          id: 1, 
          text: 'Push right & left arms into sleeves', 
          textHi: 'दोनों हाथों को आस्तीन में डालें',
          audioEn: 'Awesome! Slide your arms through the sleeves.',
          audioHi: 'शाबाश! दोनों बाहों को आस्तीन में डालें।'
        },
        { 
          id: 2, 
          text: 'Pull shirt down to your waist', 
          textHi: 'कमीज को नीचे कमर तक खींचें',
          audioEn: 'Hooray! Pull your shirt down. You dressed yourself!',
          audioHi: 'अद्भुत! आपने खुद अपने कपड़े पहन लिए!'
        }
      ]
    },
    {
      id: 2,
      title: 'Hand Wash',
      titleHi: 'हाथ धोना',
      emoji: '🧼',
      category: 'Hygiene & Sensory',
      categoryHi: 'स्वच्छता',
      durationSeconds: 20,
      steps: [
        { 
          id: 0, 
          text: 'Turn on tap & wet hands with warm water', 
          textHi: 'नल खोलें और गुनगुने पानी से हाथ गीले करें',
          audioEn: 'Turn on the tap and feel the soothing warm water.',
          audioHi: 'नल खोलें और पानी से हाथ गीले करें।'
        },
        { 
          id: 1, 
          text: 'Rub bubbly soap on palms and fingers', 
          textHi: 'हथेलियों और उंगलियों पर साबुन मलें',
          audioEn: 'Rub the soft bubbly soap for 20 seconds!',
          audioHi: 'साबुन को हथेलियों पर अच्छे से 20 सेकंड तक झाग बनने तक मलें।'
        },
        { 
          id: 2, 
          text: 'Rinse bubbles and dry with towel', 
          textHi: 'पानी से धोएं और तौलिये से सुखाएं',
          audioEn: 'Rinse clean and dry with your soft towel. Super job!',
          audioHi: 'हाथ धोकर तौलिये से सुखाएं। बहुत अच्छा!'
        }
      ]
    },
    {
      id: 3,
      title: 'Pour Water',
      titleHi: 'पानी पीना',
      emoji: '🥛',
      category: 'Mealtime Autonomy',
      categoryHi: 'भोजन समय',
      durationSeconds: 10,
      steps: [
        { 
          id: 0, 
          text: 'Hold small pitcher with two hands', 
          textHi: 'दोनों हाथों से जग या बोतल पकड़ें',
          audioEn: 'Grip the pitcher with two hands for steady control.',
          audioHi: 'दोनों हाथों से मजबूती से जग पकड़ें।'
        },
        { 
          id: 1, 
          text: 'Slowly pour water into your cup', 
          textHi: 'धीरे-धीरे गिलास में पानी डालें',
          audioEn: 'Pour slowly until the cup is half full.',
          audioHi: 'धीरे-धीरे गिलास आधा भरने तक पानी डालें।'
        },
        { 
          id: 2, 
          text: 'Take gentle sips and set cup down', 
          textHi: 'आराम से घूंट लें और गिलास रखें',
          audioEn: 'Take gentle sips. You poured water all on your own!',
          audioHi: 'आराम से पानी पिएं। बहुत शानदार काम!'
        }
      ]
    }
  ];

  const activeSkill = skills.find(s => s.id === activeSkillId) || skills[0];
  const currentSkillSteps = completedSteps[activeSkillId] || [false, false, false];
  const currentPrompts = stepPrompts[activeSkillId] || ['I', 'I', 'I'];

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerRunning && timerSeconds === 0) {
      setTimerRunning(false);
      playEarcon('chime');
      triggerHaptic('success');
      const timeUpText = language === 'hi' ? 'समय पूरा हुआ! बहुत बढ़िया काम!' : 'Time completed! Fantastic pacing!';
      speakText(timeUpText, { lang: language === 'hi' ? 'hi-IN' : 'en-US' });
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, language]);

  const startStepTimer = (stepIdx, seconds = activeSkill.durationSeconds || 20) => {
    setActiveTimerStep(stepIdx);
    setTimerSeconds(seconds);
    setTimerRunning(true);
    triggerHaptic('tap');
    playEarcon('tap');
  };

  const speakStep = (step) => {
    const text = language === 'hi' ? step.audioHi : step.audioEn;
    speakText(text, { lang: language === 'hi' ? 'hi-IN' : 'en-US' });
    triggerHaptic('tap');
  };

  const handleSetPrompt = (stepIdx, promptLevel, e) => {
    e.stopPropagation();
    const updated = [...currentPrompts];
    updated[stepIdx] = promptLevel;
    const allPrompts = {
      ...stepPrompts,
      [activeSkillId]: updated
    };
    setStepPrompts(allPrompts);
    localStorage.setItem('savia_life_skills_prompts', JSON.stringify(allPrompts));
    triggerHaptic('tap');
  };

  const toggleStep = (stepIdx) => {
    const nextState = !currentSkillSteps[stepIdx];
    const updated = [...currentSkillSteps];
    updated[stepIdx] = nextState;

    const updatedSteps = {
      ...completedSteps,
      [activeSkillId]: updated
    };

    setCompletedSteps(updatedSteps);
    localStorage.setItem('savia_life_skills_steps', JSON.stringify(updatedSteps));

    if (nextState) {
      const nextStars = stars + 1;
      setStars(nextStars);
      localStorage.setItem('savia_life_skills_stars', nextStars.toString());
      
      triggerHaptic('success');
      playEarcon('success');

      const cheer = language === 'hi'
        ? `शानदार जीत! आपने पूरा किया: ${activeSkill.steps[stepIdx].textHi}`
        : `Awesome win! You completed: ${activeSkill.steps[stepIdx].text}`;
      speakText(cheer, { lang: language === 'hi' ? 'hi-IN' : 'en-US' });

      // Auto-log into Session Ledger if all steps completed
      if (updated.every(Boolean)) {
        const independentCount = currentPrompts.filter(p => p === 'I').length;
        const gesturalCount = currentPrompts.filter(p => p === 'GP').length;
        const physicalCount = currentPrompts.filter(p => p === 'PA').length;

        logSession({
          category: 'LIFE_SKILLS',
          title: `Life Skill Mastered: ${activeSkill.title}`,
          durationMinutes: 15,
          moodRating: 'HAPPY',
          provider: 'Self-Autonomy / ABA Framework',
          milestones: `Completed all ${activeSkill.steps.length} steps of ${activeSkill.title} (ABA: ${independentCount} [I], ${gesturalCount} [GP], ${physicalCount} [PA])`,
          notes: `Mastered task analysis sequence with star #${nextStars}. ABA Prompt Hierarchy documented.`
        }, false);
      }
    }
  };

  const isAllDone = currentSkillSteps.every(Boolean);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
      
      {/* Header with Star Rewards */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl font-bold border border-amber-100 dark:border-amber-800">
            🏅
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>{language === 'hi' ? 'मैं कर सकता हूँ! (माइक्रो-स्किल)' : 'I Can Do It! (Life Skills)'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded-full">
                ABA Task Chaining
              </span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {language === 'hi' ? 'दैनिक आत्मनिर्भरता के चरण' : 'Bite-sized independence journeys & prompt tracking'}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-3.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center space-x-1.5 text-xs font-black">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500 animate-spin" />
          <span>{stars} {language === 'hi' ? 'तारे' : 'Stars'}</span>
        </div>
      </div>

      {/* 3 Interactive Skill Cards Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {skills.map(s => {
          const isSelected = activeSkillId === s.id;
          const isFinished = (completedSteps[s.id] || []).every(Boolean);
          const displayTitle = language === 'hi' ? s.titleHi : s.title;

          return (
            <button
              key={s.id}
              onClick={() => { 
                setActiveSkillId(s.id); 
                setTimerSeconds(s.durationSeconds || 20);
                setTimerRunning(false);
                triggerHaptic('tap'); 
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1 ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200 dark:shadow-none'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-700'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="font-black text-xs truncate w-full">{displayTitle}</span>
              {isFinished && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                  ✓ {language === 'hi' ? 'सफलता' : 'Mastered'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Skill Micro-Steps */}
      <div className="bg-blue-50/40 dark:bg-slate-800/60 rounded-2xl p-4.5 border border-blue-100/80 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{activeSkill.emoji}</span>
            <h4 className="font-black text-sm text-slate-900 dark:text-white">
              {language === 'hi' ? activeSkill.titleHi : activeSkill.title}
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            {/* Step Pacing Countdown Timer Widget */}
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-blue-200 dark:border-slate-700 text-xs shadow-2xs">
              <Timer className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
              <span className="font-black font-mono text-slate-900 dark:text-white">{timerSeconds}s</span>
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="w-5 h-5 rounded-md bg-[#2563EB] text-white flex items-center justify-center text-[10px]"
              >
                {timerRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 ml-0.2" />}
              </button>
              <button
                type="button"
                onClick={() => { setTimerSeconds(activeSkill.durationSeconds || 20); setTimerRunning(false); }}
                className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px]"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded-md hidden sm:inline">
              {language === 'hi' ? activeSkill.categoryHi : activeSkill.category}
            </span>
          </div>
        </div>

        {/* Steps List with ABA Prompt Hierarchy Selectors */}
        <div className="space-y-2">
          {activeSkill.steps.map((step, idx) => {
            const isDone = currentSkillSteps[idx];
            const stepText = language === 'hi' ? step.textHi : step.text;
            const currentPrompt = currentPrompts[idx] || 'I';

            return (
              <div
                key={step.id}
                onClick={() => toggleStep(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isDone
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400 dark:text-slate-500 font-medium' : 'text-slate-800 dark:text-slate-200'}`}>
                    {stepText}
                  </span>
                </div>

                {/* ABA Prompt Level Selectors & Audio Help */}
                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                  {/* ABA Prompt Badges */}
                  <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700/80 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      title="Independent (No Prompt)"
                      onClick={(e) => handleSetPrompt(idx, 'I', e)}
                      className={`px-1.5 py-0.5 rounded-md transition-all ${
                        currentPrompt === 'I'
                          ? 'bg-emerald-600 text-white shadow-2xs font-black'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      [I]
                    </button>
                    <button
                      type="button"
                      title="Gestural Prompt (Pointing/Cue)"
                      onClick={(e) => handleSetPrompt(idx, 'GP', e)}
                      className={`px-1.5 py-0.5 rounded-md transition-all ${
                        currentPrompt === 'GP'
                          ? 'bg-amber-600 text-white shadow-2xs font-black'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      [GP]
                    </button>
                    <button
                      type="button"
                      title="Physical Assistance (Hand-over-hand)"
                      onClick={(e) => handleSetPrompt(idx, 'PA', e)}
                      className={`px-1.5 py-0.5 rounded-md transition-all ${
                        currentPrompt === 'PA'
                          ? 'bg-rose-600 text-white shadow-2xs font-black'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                      }`}
                    >
                      [PA]
                    </button>
                  </div>

                  <button
                    type="button"
                    title="Start step timer"
                    onClick={(e) => { e.stopPropagation(); startStepTimer(idx, activeSkill.durationSeconds); }}
                    className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-[#2563EB] dark:text-blue-300 flex items-center justify-center text-xs shrink-0 shadow-xs border border-blue-200 dark:border-blue-800"
                  >
                    <Timer className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Hear step spoken"
                    onClick={(e) => { e.stopPropagation(); speakStep(step); }}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-300 flex items-center justify-center text-xs shrink-0 shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {isAllDone && (
          <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 rounded-xl font-black text-xs flex items-center justify-center space-x-2 shadow-sm animate-bounce">
            <Trophy className="w-4 h-4 text-white" />
            <span>
              {language === 'hi'
                ? 'बहुत खूब! आपने यह पूरा काम खुद से पूरा कर दिखाया! 🌟'
                : 'Fantastic! You did this entire routine all by yourself! 🌟'}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}


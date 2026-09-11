import React, { useState } from 'react';
import { Volume2, CheckCircle2, Circle, Star, Sparkles, Award } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { triggerHaptic, playEarcon, speakText } from '../../utils/audioAccessibility';

export default function VisualSchedule() {
  const { logSession, language, speechCode } = useAccessibility();
  const [schedule, setSchedule] = useState([
    { id: 1, time: '8:30 AM', title: 'Breakfast', emoji: '🥞', done: true, now: false },
    { id: 2, time: '10:00 AM', title: 'OT Therapy', emoji: '🧩', done: true, now: false },
    { id: 3, time: '11:30 AM', title: 'Playtime', emoji: '⚽', done: false, now: true },
    { id: 4, time: '8:00 PM', title: 'Storytime', emoji: '📖', done: false, now: false },
  ]);

  const completedCount = schedule.filter(s => s.done).length;

  const toggleItem = (id) => {
    setSchedule(schedule.map(item => {
      if (item.id === id) {
        const nextDone = !item.done;
        if (nextDone) {
          triggerHaptic('success');
          playEarcon('success');
          speakText(`Awesome job! Completed ${item.title}!`, { lang: speechCode || 'en-US' });
          
          // Auto log into Session Ledger
          logSession({
            category: 'ROUTINE',
            title: `Visual Task Completed: ${item.title}`,
            durationMinutes: 15,
            moodRating: 'HAPPY',
            provider: 'Visual Schedule / Self',
            milestones: `Completed "${item.title}" at ${item.time}`,
            notes: 'Followed daily visual schedule autonomously with sensory positive reinforcement.'
          }, false);
        } else {
          triggerHaptic('tap');
          playEarcon('tap');
        }
        return { ...item, done: nextDone };
      }
      return item;
    }));
  };

  const speak = (text) => {
    triggerHaptic('tap');
    playEarcon('tap');
    speakText(text, { lang: speechCode || 'en-US' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📅</span>
            <span>{language === 'hi' ? 'दैनिक समय सारिणी' : 'Daily Visual Schedule'}</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {language === 'hi' ? 'दृश्य दिनचर्या और टोकन पुरस्कार' : 'Interactive routine with sensory token rewards'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-300 dark:border-amber-800 flex items-center space-x-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{completedCount} / {schedule.length} Tokens</span>
          </span>
        </div>
      </div>

      {/* Schedule Steps Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {schedule.map((step) => {
          return (
            <div
              key={step.id}
              onClick={() => toggleItem(step.id)}
              className={`rounded-2xl p-4 text-center cursor-pointer transition-all space-y-2.5 flex flex-col justify-between ${
                step.done
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-300/80 dark:border-emerald-800 shadow-xs'
                  : step.now
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-[#2563EB] dark:border-blue-500 shadow-md shadow-blue-100 dark:shadow-none ring-2 ring-blue-200 dark:ring-blue-900'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-750 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-3xl ${step.now ? 'animate-bounce' : ''}`}>{step.emoji}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(`Time for ${step.title}`); }}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center shadow-xs text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className={`font-black text-xs ${step.now ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {step.title}
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  {step.time}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
                {step.done ? (
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                    <Circle className="w-4 h-4" />
                    <span>Tap to Finish</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ABA Clinical "First - Then" Transition Board */}
      <FirstThenBoard speechCode={speechCode} language={language} logSession={logSession} />

    </div>
  );
}

function FirstThenBoard({ speechCode, language, logSession }) {
  const FIRST_THEN_PRESETS = [
    {
      title: 'Homework → iPad',
      first: { emoji: '📚', title: language === 'hi' ? 'पहले: होमवर्क' : 'FIRST: Finish Homework', phrase: 'First finish your homework.' },
      then: { emoji: '📱', title: language === 'hi' ? 'फिर: टैबलेट गेम' : 'THEN: Tablet Fun', phrase: 'Then you can play tablet games!' }
    },
    {
      title: 'Shoes → Playground',
      first: { emoji: '👟', title: language === 'hi' ? 'पहले: जूते पहनें' : 'FIRST: Put On Shoes', phrase: 'First put on your shoes.' },
      then: { emoji: '🛝', title: language === 'hi' ? 'फिर: पार्क में खेलना' : 'THEN: Playground Fun', phrase: 'Then we can go to the playground!' }
    },
    {
      title: 'Wash Hands → Snack',
      first: { emoji: '🧼', title: language === 'hi' ? 'पहले: हाथ धोएं' : 'FIRST: Wash Hands', phrase: 'First wash your hands with soap.' },
      then: { emoji: '🥪', title: language === 'hi' ? 'फिर: स्वादिष्ट नाश्ता' : 'THEN: Yummy Snack', phrase: 'Then eat your yummy snack!' }
    },
    {
      title: 'Clean Up → Cartoon',
      first: { emoji: '🧸', title: language === 'hi' ? 'पहले: खिलौने समेटें' : 'FIRST: Clean Up Toys', phrase: 'First put your toys in the bin.' },
      then: { emoji: '📺', title: language === 'hi' ? 'फिर: कार्टून देखना' : 'THEN: Watch Cartoon', phrase: 'Then watch your favorite cartoon!' }
    }
  ];

  const [presetIndex, setPresetIndex] = useState(0);
  const [firstDone, setFirstDone] = useState(false);
  const activePair = FIRST_THEN_PRESETS[presetIndex];

  const handleFirstCheck = () => {
    const nextState = !firstDone;
    setFirstDone(nextState);
    if (nextState) {
      playEarcon('success');
      triggerHaptic('success');
      speakText(`Great job! You finished ${activePair.first.title}! Now you get ${activePair.then.title}!`, { lang: speechCode || 'en-US' });
      logSession?.({
        category: 'ROUTINE',
        title: `ABA First-Then Success: ${activePair.title}`,
        durationMinutes: 10,
        moodRating: 'HAPPY',
        provider: 'First-Then Transition Engine',
        milestones: `Completed "${activePair.first.title}" to transition to "${activePair.then.title}".`,
        notes: 'Clinical Premack Principle successful visual reinforcement.'
      }, false);
    } else {
      playEarcon('tap');
      triggerHaptic('tap');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-purple-950/40 p-4 rounded-3xl border border-blue-200/80 dark:border-indigo-900/80 space-y-3 mt-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⏳</span>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? 'पहले - फिर बोर्ड (First-Then Transition)' : 'ABA "First - Then" Visual Transition Board'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Premack Principle Gold-Standard for zero-meltdown task transitions
            </p>
          </div>
        </div>

        {/* Preset Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {FIRST_THEN_PRESETS.map((p, idx) => (
            <button
              key={p.title}
              onClick={() => {
                setPresetIndex(idx);
                setFirstDone(false);
                playEarcon('tap');
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all shrink-0 ${
                presetIndex === idx
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Card Tactile First-Then Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* FIRST CARD */}
        <div
          onClick={handleFirstCheck}
          className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex items-center space-x-3.5 ${
            firstDone
              ? 'bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-500 scale-[1.02] shadow-sm'
              : 'bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-700 shadow-sm hover:border-blue-600'
          }`}
        >
          <span className="text-4xl">{activePair.first.emoji}</span>
          <div className="text-left flex-1">
            <span className="text-[10px] font-black text-[#2563EB] dark:text-blue-400 uppercase tracking-wider block">
              1. FIRST / पहले
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white block">
              {activePair.first.title}
            </span>
            <span className={`text-[10px] font-bold mt-1 inline-flex items-center space-x-1 ${firstDone ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{firstDone ? 'Completed! 🌟' : 'Tap when finished'}</span>
            </span>
          </div>
        </div>

        {/* THEN CARD */}
        <div
          onClick={() => {
            speakText(activePair.then.phrase);
            playEarcon('success');
          }}
          className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all flex items-center space-x-3.5 ${
            firstDone
              ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/60 dark:to-yellow-950/60 border-amber-400 ring-2 ring-amber-300 animate-bounce'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
          }`}
        >
          <span className="text-4xl">{activePair.then.emoji}</span>
          <div className="text-left flex-1">
            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              2. THEN / फिर (Reward 🎉)
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white block">
              {activePair.then.title}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 block">
              {firstDone ? '🎉 Reward Unlocked! Tap to celebrate!' : '🔒 Locked until Step 1 is done'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

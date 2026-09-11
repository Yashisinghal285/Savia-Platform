import React, { useState } from 'react';
import { Volume2, Check, Star, Sun, Sunrise, Sunset } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function DailyRoutinePage() {
  const { logSession, language } = useAccessibility();
  const [stars, setStars] = useState(8);

  const [morningTasks, setMorningTasks] = useState([
    { id: 1, title: 'Toothbrush', emoji: '🪥', done: true, sound: 'Time to brush teeth and wash face!' },
    { id: 2, title: 'Breakfast', emoji: '🥞', done: true, sound: 'Breakfast time! Yummy food for energy!' },
  ]);

  const [afternoonTasks, setAfternoonTasks] = useState([
    { id: 3, title: 'Speech Practice', emoji: '🗣️', done: false, now: true, sound: 'Speech practice and AAC soundboard playtime!' },
    { id: 4, title: 'Sensory Break', emoji: '🌿', done: true, now: false, sound: 'Time for a calm breathing break!' },
  ]);

  const [eveningTasks, setEveningTasks] = useState([
    { id: 5, title: 'Warm Bath', emoji: '🛁', done: false, now: false, sound: 'Warm bath time to relax your muscles!' },
    { id: 6, title: 'Bedtime Story', emoji: '📖', done: false, now: false, sound: 'Bedtime story time! Sweet dreams Reyansh!' },
  ]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.15;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleTask = (tasks, setTasks, id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        if (nextDone) {
          setStars(s => s + 1);
          speak(`Great job Reyansh! You completed ${t.title}!`);
          logSession({
            category: 'ROUTINE',
            title: `Routine Completed: ${t.title}`,
            durationMinutes: 15,
            moodRating: 'HAPPY',
            provider: 'Self / Daily Visual Routine',
            milestones: `Completed "${t.title}" task`,
            notes: 'Followed routine checklist autonomously with audio affirmation.'
          }, false);
        }
        return { ...t, done: nextDone };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Star Counter */}
      <div className="bg-[#2563EB] text-white rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {language === 'hi' ? 'दैनिक दिनचर्या' : 'Daily Routine'}
          </h2>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            {language === 'hi' ? 'ऑडियो संकेतों के साथ दृश्य समय सारिणी' : 'Visual schedule with audio cues'}
          </p>
        </div>

        {/* Star Counter Pill */}
        <div className="bg-white/95 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl shadow-xs flex items-center space-x-3 self-start md:self-auto border border-white/20 dark:border-slate-700">
          <span className="text-2xl">⭐</span>
          <div>
            <div className="text-base font-black text-amber-600 dark:text-amber-400 leading-tight">{stars} Stars Earned</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Today's Progress</div>
          </div>
        </div>
      </div>

      {/* 3 Daylight Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* 🌅 1. MORNING ROUTINE */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌅</span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Morning Routine</h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-full">
              7:00 - 11:00 AM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {morningTasks.map((t) => (
              <div
                key={t.id}
                className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5 text-center space-y-2 flex flex-col justify-between"
              >
                <div className="text-3xl">{t.emoji}</div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="flex space-x-1 pt-1">
                  <button
                    onClick={() => speak(t.sound)}
                    className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    🔊 Audio
                  </button>
                  <button
                    onClick={() => toggleTask(morningTasks, setMorningTasks, t.id)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg shadow-xs ${
                      t.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t.done ? '✓ Done' : 'Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ☀️ 2. AFTERNOON ROUTINE */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">☀️</span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Afternoon Routine</h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-full">
              11:00 AM - 5:00 PM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {afternoonTasks.map((t) => (
              <div
                key={t.id}
                className={`rounded-2xl p-3.5 text-center space-y-2 flex flex-col justify-between ${
                  t.now
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-2 border-[#2563EB] dark:border-blue-500 shadow-xs ring-2 ring-blue-100 dark:ring-blue-900'
                    : 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <div className={`text-3xl ${t.now ? 'animate-bounce' : ''}`}>{t.emoji}</div>
                <div className={`font-bold text-xs ${t.now ? 'text-[#2563EB] dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'}`}>{t.title}</div>
                <div className="flex space-x-1 pt-1">
                  <button
                    onClick={() => speak(t.sound)}
                    className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    🔊 Audio
                  </button>
                  <button
                    onClick={() => toggleTask(afternoonTasks, setAfternoonTasks, t.id)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg shadow-xs ${
                      t.done ? 'bg-emerald-500 text-white' : 'bg-[#2563EB] text-white'
                    }`}
                  >
                    {t.done ? '✓ Done' : 'Tap Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🌙 3. EVENING ROUTINE */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌙</span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Evening & Bedtime</h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 rounded-full">
              5:00 - 9:00 PM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {eveningTasks.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center space-y-2 flex flex-col justify-between"
              >
                <div className="text-3xl">{t.emoji}</div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="flex space-x-1 pt-1">
                  <button
                    onClick={() => speak(t.sound)}
                    className="flex-1 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    🔊 Audio
                  </button>
                  <button
                    onClick={() => toggleTask(eveningTasks, setEveningTasks, t.id)}
                    className={`flex-1 py-1.5 font-bold text-[10px] rounded-lg ${
                      t.done ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {t.done ? '✓ Done' : 'Tap Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

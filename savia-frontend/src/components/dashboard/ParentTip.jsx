import React, { useState } from 'react';
import { Heart, Sparkles, Smile, Coffee, Check, Sun } from 'lucide-react';
import { playEarcon, triggerHaptic } from '../../utils/audioAccessibility';

export default function ParentTip() {
  const [parentMood, setParentMood] = useState('good');
  const [showRespiteModal, setShowRespiteModal] = useState(false);
  const [respiteSecs, setRespiteSecs] = useState(60);
  const [isRespiteRunning, setIsRespiteRunning] = useState(false);

  const start60sRespite = () => {
    setIsRespiteRunning(true);
    setRespiteSecs(60);
    playEarcon('tap');
    triggerHaptic('tap');

    const timer = setInterval(() => {
      setRespiteSecs(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRespiteRunning(false);
          playEarcon('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 rounded-3xl p-4.5 border border-amber-200/90 dark:border-amber-800/80 shadow-xs space-y-3 transition-colors">
      
      {/* Top Header & Caregiver Wellness */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
            ☕
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center space-x-1.5">
              <span>Caregiver Micro-Respite & Mindful Routine</span>
              <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full">
                Zero Guilt
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Today's Micro-Goal: <em>"1 gentle moment of shared laughter during snack time — no drills required."</em>
            </div>
          </div>
        </div>

        {/* 60s Respite Pause Trigger */}
        <button
          onClick={start60sRespite}
          disabled={isRespiteRunning}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 self-start sm:self-auto shadow-xs active:scale-95 ${
            isRespiteRunning
              ? 'bg-purple-600 text-white animate-pulse'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isRespiteRunning ? `Breathing... (${respiteSecs}s)` : 'Take 60s Respite'}</span>
        </button>
      </div>

      {/* Quick Parent Energy Check-in */}
      <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
          How is your energy right now, mama/papa?
        </span>
        <div className="flex items-center space-x-1.5">
          {[
            { id: 'good', label: 'Doing OK 😊', bg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300' },
            { id: 'tired', label: 'Tired 😴', bg: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300' },
            { id: 'overwhelmed', label: 'Overwhelmed 🫂', bg: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setParentMood(m.id);
                triggerHaptic('tap');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                parentMood === m.id
                  ? `${m.bg} font-black shadow-xs scale-102`
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

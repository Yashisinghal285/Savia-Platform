import React from 'react';
import { MessageSquare, PlusCircle, CloudRain, UserCheck } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function QuickActions({ onOpenAAC, onOpenPainMap, onOpenLifeSkills, onOpenCalm }) {
  const { language } = useAccessibility();
  const actions = [
    {
      id: 'aac',
      label: language === 'hi' ? 'एएसी बोर्ड' : 'AAC Board',
      sub: language === 'hi' ? 'वॉयस स्पीच' : 'Voice speech',
      emoji: '🔊',
      bg: 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200',
      action: onOpenAAC
    },
    {
      id: 'pain',
      label: language === 'hi' ? 'दर्द का नक्शा' : 'Where It Hurts?',
      sub: language === 'hi' ? 'दर्द और सेंसरी' : 'Pain & sensory map',
      emoji: '🫀',
      bg: 'bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200',
      action: onOpenPainMap
    },
    {
      id: 'skills',
      label: language === 'hi' ? 'मैं कर सकता हूँ!' : 'I Can Do It!',
      sub: language === 'hi' ? 'लाइफ स्किल्स' : 'Life skill steps',
      emoji: '🏅',
      bg: 'bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/80 dark:hover:bg-amber-900/60 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200',
      action: onOpenLifeSkills
    },
    {
      id: 'calm',
      label: language === 'hi' ? 'शांत कोना' : 'Calm Corner',
      sub: language === 'hi' ? 'श्वास क्लाउड' : 'Breathing cloud',
      emoji: '☁️',
      bg: 'bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200',
      action: onOpenCalm
    }
  ];

  return (
    <div className="space-y-2.5">
      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
        {language === 'hi' ? 'त्वरित क्रियाएं' : 'Quick Actions'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={act.action}
            className={`p-4 rounded-3xl border text-left cursor-pointer transition-all duration-150 hover:shadow-sm space-y-2 ${act.bg}`}
          >
            <div className="text-2xl">{act.emoji}</div>
            <div>
              <div className="font-black text-xs leading-tight">{act.label}</div>
              <div className="text-[10px] font-semibold opacity-75 mt-0.5">{act.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

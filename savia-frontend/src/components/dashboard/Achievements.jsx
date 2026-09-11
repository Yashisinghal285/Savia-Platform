import React from 'react';
import { Award, Star, Crown } from 'lucide-react';

export default function Achievements() {
  const badges = [
    { id: 1, title: 'AAC Master', sub: '10 phrases', icon: '🎖️', bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200' },
    { id: 2, title: '5-Day Streak', sub: 'On routine', icon: '⭐', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200' },
    { id: 3, title: 'Weekly Star', sub: 'High focus', icon: '👑', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
          <span>🏆</span>
          <span>Achievements</span>
        </h3>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Badges</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {badges.map(b => (
          <div key={b.id} className={`p-3 rounded-2xl border ${b.bg} text-center flex flex-col items-center justify-center`}>
            <span className="text-2xl mb-1">{b.icon}</span>
            <div className="font-black text-[11px] leading-tight">{b.title}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{b.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

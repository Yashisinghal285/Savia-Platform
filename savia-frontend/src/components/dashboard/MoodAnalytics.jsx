import React from 'react';

export default function MoodAnalytics() {
  const moods = [
    { label: 'Happy', pct: '65%', count: '13', emoji: '😄', color: 'bg-emerald-500' },
    { label: 'Calm', pct: '20%', count: '4', emoji: '😌', color: 'bg-teal-500' },
    { label: 'Overloaded', pct: '10%', count: '2', emoji: '😟', color: 'bg-amber-500' },
    { label: 'Tired', pct: '5%', count: '1', emoji: '😴', color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Mood Overview</h3>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">20 Logs</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {moods.map(m => (
          <div key={m.label} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center space-y-1">
            <span className="text-xl">{m.emoji}</span>
            <div className="text-xs font-black text-slate-900 dark:text-white">{m.pct}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

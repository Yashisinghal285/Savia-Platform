import React from 'react';
import { Users, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function CareTeamSection() {
  const toast = useToast();
  const members = [
    { id: 1, name: 'Ananya Sharma', role: 'Guardian (Mother)', emoji: '👩', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' },
    { id: 2, name: 'Sarah Jenkins', role: 'Caregiver', emoji: '🧑', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' },
    { id: 3, name: 'Dr. Neha Verma', role: 'Speech Therapist', emoji: '🩺', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200' },
    { id: 4, name: 'David Lee', role: 'OT Specialist', emoji: '👨‍⚕️', bg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
          <span>👥</span>
          <span>Care Circle</span>
        </h3>
        <button
          onClick={() => toast.info("Opening encrypted Care Circle team messaging...")}
          className="px-3 py-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border border-blue-200 dark:border-blue-800"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {members.map(m => (
          <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-center flex flex-col items-center">
            <div className={`w-11 h-11 rounded-full ${m.bg} flex items-center justify-center text-xl mb-1.5 shadow-xs border border-white dark:border-slate-700`}>
              {m.emoji}
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate w-full">{m.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{m.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function HeroBanner({ childStats }) {
  const { user, activeChild } = useAuth();

  const childName = activeChild ? activeChild.firstName : 'Reyansh';
  const childAge = activeChild?.dateOfBirth ? (new Date().getFullYear() - new Date(activeChild.dateOfBirth).getFullYear()) : 7;
  const disability = activeChild?.disabilityType || 'Autism Spectrum';
  const completedTherapies = childStats?.completedProgramsCount || 3;
  const totalTherapies = childStats?.totalProgramsCount || 5;
  const progressPercent = totalTherapies > 0 ? Math.round((completedTherapies / totalTherapies) * 100) : 60;

  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-amber-50/60 dark:from-[#0F172A] dark:via-[#131C31] dark:to-[#0F172A] rounded-[28px] p-6 border border-blue-100/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
      
      {/* Left: Clean Greeting */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 bg-blue-100/80 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 rounded-full text-[11px] font-bold border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3 h-3 text-[#2563EB] dark:text-blue-400" />
          <span>Speech & Sensory Focus</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Good morning, <span className="text-[#2563EB] dark:text-blue-400">{user?.firstName || 'Ananya'}</span>
        </h2>
      </div>

      {/* Right: Child Quick Status Pill Card */}
      <div className="bg-white/95 dark:bg-[#1E293B] backdrop-blur-sm p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex items-center space-x-5 min-w-[260px]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-xl shadow-xs">
            👦
          </div>
          <div>
            <div className="font-black text-sm text-slate-900 dark:text-white">{childName}</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400">{childAge} yrs • {disability}</div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-xs font-black text-[#2563EB] dark:text-blue-400">{completedTherapies}/{totalTherapies}</div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">Therapies</div>
          </div>

          <div className="w-8 h-8 rounded-full border-3 border-[#2563EB] dark:border-blue-400 border-t-blue-100 dark:border-t-slate-700 flex items-center justify-center text-[9px] font-black text-[#2563EB] dark:text-blue-400">
            {progressPercent}%
          </div>
        </div>
      </div>

    </div>
  );
}

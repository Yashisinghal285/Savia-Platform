import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { FileText, Printer, TrendingUp, Calendar, Download, Sparkles } from 'lucide-react';
import SessionLedgerFeed from '../components/common/SessionLedgerFeed';

export default function ProgressAnalyticsPage() {
  const { activeChild } = useAuth();
  const { sessionLogs, exportSessionLogs, language } = useAccessibility();

  const totalMinutes = sessionLogs.reduce((acc, l) => acc + (Number(l.durationMinutes) || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalSessions = sessionLogs.length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'प्रगति और विश्लेषिकी' : 'Progress & Analytics'}
          </h2>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            {language === 'hi' ? 'मील के पत्थर, मेट्रिक्स और सत्र इतिहास' : 'Milestones, developmental metrics & session history'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => exportSessionLogs('csv')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sessions</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalSessions}</div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+18% this month</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical Hours</div>
          <div className="text-2xl font-black text-[#2563EB] dark:text-blue-400">{totalHours}h</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Across 6 domains</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Primary Mood</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">74% Happy</div>
          <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400">21% Calm</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Milestones Met</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">12 Goals</div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">On-track</div>
        </div>

      </div>

      {/* Growth Curve */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📈</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Developmental Growth Trajectory (30-Day Curve)</h3>
          </div>
          <span className="text-xs font-bold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
            +24% Overall Autonomy
          </span>
        </div>

        <div className="h-44 w-full bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-800/40 dark:to-transparent rounded-2xl p-3 flex flex-col justify-end relative overflow-hidden border border-slate-100 dark:border-slate-800">
          <svg className="w-full h-32" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path d="M0,120 Q80,90 150,50 T300,10 L300,120 Z" fill="rgba(37, 99, 235, 0.12)" />
            <path d="M0,120 Q80,90 150,50 T300,10" fill="none" stroke="#2563EB" strokeWidth="3.5" />
            <path d="M0,120 Q90,100 180,65 T300,30" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="4,4" />
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
            <span className="text-slate-700 dark:text-slate-300">Speech & AAC (+28%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span className="text-slate-700 dark:text-slate-300">Fine Motor Dexterity (+18%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 dark:text-slate-300">Sensory Regulation (+22%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-slate-700 dark:text-slate-300">Visual Routine Autonomy (+30%)</span>
          </div>
        </div>
      </div>

      {/* SLP Quantitative Syntax Engine & IEP Metrics Card */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-[28px] p-6 border border-blue-200/80 dark:border-indigo-900/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🗣️</span>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                SLP Quantitative Syntax & IEP Language Development
              </h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Brown's Stages of Morphosyntactic Development & Lexical Diversity Index
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/80 text-[#2563EB] dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
            Brown's Stage III • IEP Target: Stage IV
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Length of Utterance (MLU)</span>
            <div className="text-xl font-black text-[#2563EB] dark:text-blue-400">2.65 <span className="text-xs font-bold text-emerald-600">(+0.85)</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Avg words/morphemes per communication</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vocabulary Diversity (TTR)</span>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400">0.74 <span className="text-xs font-bold text-emerald-600">(High)</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Type-Token Ratio across 48 unique tiles</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Spontaneous Initiations</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">68% <span className="text-xs font-bold text-emerald-600">(+15%)</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Independent communication without verbal prompt</p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IEP Goal SLP-3 Mastery</span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">85% <span className="text-xs font-bold text-emerald-600">(On-Track)</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Constructs 3+ word requests in 4/5 trials</p>
          </div>
        </div>
      </div>

      {/* Dynamic Session History Ledger */}
      <SessionLedgerFeed showHeader={true} />

    </div>
  );
}

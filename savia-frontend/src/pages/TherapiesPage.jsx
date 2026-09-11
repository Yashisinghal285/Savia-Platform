import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import SessionLedgerFeed from '../components/common/SessionLedgerFeed';
import QuickLogModal from '../components/common/QuickLogModal';

export default function TherapiesPage() {
  const { language } = useAccessibility();
  const toast = useToast();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [showLogModal, setShowLogModal] = useState(false);
  const [activeLogPreset, setActiveLogPreset] = useState({});

  const programs = [
    {
      id: 1,
      title: 'Articulation & Vocalization',
      category: 'SPEECH_THERAPY',
      frequency: 'Daily • 20m',
      targetGoals: ['/r/ & /s/ Sound Production', 'Spontaneity'],
      therapist: 'Dr. Neha Sharma, SLP'
    },
    {
      id: 2,
      title: 'Tripod Grip & Fine Motor Play',
      category: 'OCCUPATIONAL_THERAPY',
      frequency: 'Daily • 15m',
      targetGoals: ['Tripod Grip 10 mins', 'Hand Dexterity'],
      therapist: 'David Lee, OTR/L'
    },
    {
      id: 3,
      title: 'Sensory Deep Pressure Calming',
      category: 'SENSORY',
      frequency: 'As Needed • 15m',
      targetGoals: ['Self-Regulation', 'Calm in 5 Mins'],
      therapist: 'Ananya (Guardian)'
    },
    {
      id: 4,
      title: 'Visual Routine Reinforcement',
      category: 'BEHAVIORAL',
      frequency: 'Daily • 10m',
      targetGoals: ['Smooth Transitions', 'Star Celebrations'],
      therapist: 'Dr. Neha Sharma, SLP'
    }
  ];

  const filters = [
    { id: 'ALL', label: language === 'hi' ? 'सभी थेरेपी (4)' : 'All Therapies (4)' },
    { id: 'SPEECH_THERAPY', label: language === 'hi' ? 'स्पीच' : 'Speech' },
    { id: 'OCCUPATIONAL_THERAPY', label: language === 'hi' ? 'ऑक्यूपेशनल' : 'Occupational' },
    { id: 'SENSORY', label: language === 'hi' ? 'सेंसरी' : 'Sensory' },
    { id: 'BEHAVIORAL', label: language === 'hi' ? 'बिहेवियरल' : 'Behavioral' },
  ];

  const filteredPrograms = selectedFilter === 'ALL'
    ? programs
    : programs.filter(p => p.category === selectedFilter);

  const handleOpenLogger = (p) => {
    setActiveLogPreset({
      category: p.category,
      title: p.title,
      provider: p.therapist,
      durationMinutes: 30,
      milestones: p.targetGoals.join(', ')
    });
    setShowLogModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'थेरेपी और प्रिस्क्रिप्शन' : 'Therapies & Prescriptions'}
          </h2>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            {language === 'hi' ? 'क्लिनिकल अभ्यास योजना और दैनिक सत्र लॉग' : 'Clinical prescription plans & daily session tracking'}
          </p>
        </div>

        <button
          onClick={() => { setActiveLogPreset({}); setShowLogModal(true); }}
          className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-200 dark:shadow-none flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'hi' ? 'सत्र कार्य रिकॉर्ड करें' : 'Log Therapy Session'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === f.id
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Weekly Progress Hero Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold text-slate-900 dark:text-white">Weekly Progress: 14 of 20 Sessions</div>
          <div className="text-sm font-black text-[#2563EB] dark:text-blue-400">70%</div>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#2563EB] rounded-full w-[70%]"></div>
        </div>
      </div>

      {/* 4 Clean Therapy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 text-[10px] font-black rounded-lg border border-blue-100 dark:border-blue-900 uppercase">
                  {p.category.replace('_', ' ')}
                </span>
                <span className="text-xl">
                  {p.category.includes('SPEECH') ? '💬' : p.category.includes('OCCUPATIONAL') ? '🧩' : p.category.includes('SENSORY') ? '☁️' : '⭐'}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">{p.title}</h3>
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{p.frequency}</div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.targetGoals.map(g => (
                  <span key={g} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{p.therapist}</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenLogger(p)}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all"
                >
                  + Log Session
                </button>
                <button
                  onClick={() => {
                    handleOpenLogger(p);
                    toast.clinical(`Clinical routine "${p.title}" opened for tracking. Timer active.`, { title: 'Routine In Progress' });
                  }}
                  className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Start Routine
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Live Session Ledger Feed */}
      <SessionLedgerFeed showHeader={true} />

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        initialData={activeLogPreset}
      />

    </div>
  );
}

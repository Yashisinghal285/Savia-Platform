import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { FileText, Download, Printer, Trash2, Clock, Plus, Activity, Filter, CheckCircle2 } from 'lucide-react';
import QuickLogModal from './QuickLogModal';

export default function SessionLedgerFeed({ showHeader = true, maxItems = null, defaultCategory = 'ALL' }) {
  const { sessionLogs, deleteSessionLog, exportSessionLogs, language } = useAccessibility();
  const [selectedFilter, setSelectedFilter] = useState(defaultCategory);
  const [showLogModal, setShowLogModal] = useState(false);
  const [activePreset, setActivePreset] = useState({});

  const filterCategories = [
    { id: 'ALL', label: language === 'hi' ? 'सभी सत्र' : 'All Sessions' },
    { id: 'SPEECH_THERAPY', label: language === 'hi' ? 'स्पीच' : 'Speech' },
    { id: 'OCCUPATIONAL_THERAPY', label: language === 'hi' ? 'ऑक्यूपेशनल' : 'Occupational' },
    { id: 'SENSORY', label: language === 'hi' ? 'सेंसरी' : 'Sensory' },
    { id: 'AAC', label: 'AAC Grid' },
    { id: 'ROUTINE', label: language === 'hi' ? 'रूटीन' : 'Routine' },
    { id: 'LIFE_SKILLS', label: language === 'hi' ? 'लाइफ स्किल्स' : 'Life Skills' },
    { id: 'PAIN_MANAGEMENT', label: language === 'hi' ? 'दर्द / आराम' : 'Pain Relief' },
  ];

  const filteredLogs = sessionLogs.filter(log => {
    if (selectedFilter === 'ALL') return true;
    return log.category === selectedFilter;
  });

  const displayLogs = maxItems ? filteredLogs.slice(0, maxItems) : filteredLogs;

  const totalMinutes = sessionLogs.reduce((sum, l) => sum + (Number(l.durationMinutes) || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'SPEECH_THERAPY':
        return { bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 border-blue-200 dark:border-blue-800', emoji: '🗣️', label: 'Speech' };
      case 'OCCUPATIONAL_THERAPY':
        return { bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', emoji: '🧩', label: 'OT' };
      case 'SENSORY':
        return { bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800', emoji: '☁️', label: 'Sensory' };
      case 'AAC':
        return { bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', emoji: '🎈', label: 'AAC' };
      case 'ROUTINE':
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', emoji: '📅', label: 'Routine' };
      case 'LIFE_SKILLS':
        return { bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', emoji: '🏅', label: 'Skills' };
      case 'PAIN_MANAGEMENT':
        return { bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800', emoji: '🫀', label: 'Pain' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', emoji: '🩺', label: 'General' };
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'HAPPY': return '😄 Happy';
      case 'CALM': return '😌 Calm';
      case 'FOCUSED': return '🎯 Focused';
      case 'TIRED': return '😴 Tired';
      case 'OVERWHELMED': return '😫 Meltdown / Overload';
      default: return '🙂 ' + mood;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
      
      {/* Header with Metrics & Actions */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📊</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'hi' ? 'सत्र इतिहास और लॉग लेज़र' : 'Therapy & Session Work Ledger'}
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                <span>🔒</span>
                <span className="hidden sm:inline">AES-256 Encrypted (HIPAA)</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              {sessionLogs.length} {language === 'hi' ? 'रिकॉर्डेड सत्र' : 'recorded sessions'} • {totalHours}h {language === 'hi' ? 'कुल क्लिनिकल अभ्यास' : 'total clinical practice'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportSessionLogs('csv')}
              title="Download CSV"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => exportSessionLogs('json')}
              title="Download JSON"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => window.print()}
              title="Print Session Sheet"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5 text-purple-600" />
              <span>Print</span>
            </button>

            <button
              onClick={() => { setActivePreset({}); setShowLogModal(true); }}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Log Work</span>
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {filterCategories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedFilter === c.id
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Session Logs List */}
      {displayLogs.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {language === 'hi' ? 'इस श्रेणी में कोई सत्र नहीं मिला।' : 'No session logs recorded in this category.'}
          </p>
          <button
            onClick={() => { setActivePreset({ category: selectedFilter !== 'ALL' ? selectedFilter : 'SPEECH_THERAPY' }); setShowLogModal(true); }}
            className="mt-2 text-xs font-black text-[#2563EB] hover:underline"
          >
            + {language === 'hi' ? 'नया सत्र जोड़ें' : 'Log a new session now'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayLogs.map(log => {
            const badge = getCategoryBadge(log.category);
            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border flex items-center space-x-1 ${badge.bg}`}>
                      <span>{badge.emoji}</span>
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.date} • {log.time}</span>
                    </span>
                    <span className="text-[11px] font-black text-[#2563EB] dark:text-blue-400">
                      {log.durationMinutes} mins
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {log.title}
                  </h4>

                  {log.milestones && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{log.milestones}</span>
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                {/* Right badges & delete action */}
                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                  <div className="text-right">
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {getMoodEmoji(log.moodRating)}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[120px]">
                      {log.provider}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSessionLog(log.id)}
                    title="Delete log"
                    className="w-7 h-7 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/80 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Universal Quick Log Modal */}
      <QuickLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        initialData={activePreset}
      />

    </div>
  );
}

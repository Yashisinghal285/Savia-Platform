import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { X, Check, ArrowLeft, Clock, Sparkles, User, Calendar, Activity } from 'lucide-react';

export default function QuickLogModal({ isOpen, onClose, initialData = {} }) {
  const { logSession, language, t } = useAccessibility();
  const { activeChild } = useAuth();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const presets = [
    { id: 'SPEECH_THERAPY', label: 'Speech Therapy', emoji: '🗣️', provider: 'Dr. Neha Verma, SLP', duration: 30 },
    { id: 'OCCUPATIONAL_THERAPY', label: 'Occupational Therapy', emoji: '🧩', provider: 'David Lee, OTR/L', duration: 45 },
    { id: 'SENSORY', label: 'Sensory De-escalation', emoji: '☁️', provider: 'Guardian / Parent', duration: 15 },
    { id: 'AAC', label: 'AAC Grid Practice', emoji: '🎈', provider: 'Speech Therapist', duration: 20 },
    { id: 'ROUTINE', label: 'Daily Routine Task', emoji: '📅', provider: 'Guardian / Self', duration: 15 },
    { id: 'LIFE_SKILLS', label: 'Life Skills Builder', emoji: '🏅', provider: 'Guardian', duration: 20 },
    { id: 'BEHAVIORAL', label: 'Behavioral & Focus Drill', emoji: '🎯', provider: 'Behavioral Therapist', duration: 30 },
  ];

  const [formData, setFormData] = useState({
    category: initialData.category || 'SPEECH_THERAPY',
    title: initialData.title || 'Speech Practice Session',
    durationMinutes: initialData.durationMinutes || 30,
    moodRating: initialData.moodRating || 'HAPPY',
    provider: initialData.provider || 'Dr. Neha Verma, SLP',
    milestones: initialData.milestones || '',
    notes: initialData.notes || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      category: preset.id,
      title: `${preset.label} Practice`,
      durationMinutes: preset.duration,
      provider: preset.provider
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      logSession(formData);
      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 300);
    } catch (err) {
      console.error('Failed to log session:', err);
      setSaving(false);
    }
  };

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-blue-700 dark:from-blue-700 dark:to-indigo-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
              📝
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-none">
                {language === 'hi' ? 'सत्र कार्य रिकॉर्ड करें' : 'Log Clinical / Practice Session'}
              </h3>
              <p className="text-[11px] text-blue-100 font-medium mt-1">
                {activeChild?.firstName || 'Reyansh'} • {language === 'hi' ? 'दैनिक प्रगति' : 'Daily Progress Ledger'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Return Back (Esc)"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Quick Category Presets */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {language === 'hi' ? 'क्विक प्रीसेट' : 'Quick Category Preset'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {presets.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2 rounded-xl border text-left transition-all flex items-center space-x-1.5 ${
                    formData.category === p.id
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-[#2563EB] text-[#2563EB] dark:text-blue-300 font-bold shadow-2xs'
                      : 'bg-[#F8FAFC] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[11px] font-bold truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Session Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'hi' ? 'सत्र शीर्षक' : 'Session Title'}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Category & Provider */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="SPEECH_THERAPY">Speech Therapy</option>
                <option value="OCCUPATIONAL_THERAPY">Occupational</option>
                <option value="SENSORY">Sensory Care</option>
                <option value="AAC">AAC Communicator</option>
                <option value="ROUTINE">Daily Routine</option>
                <option value="LIFE_SKILLS">Life Skills</option>
                <option value="BEHAVIORAL">Behavioral</option>
                <option value="GENERAL_THERAPY">General Care</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Provider / Lead</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="Provider name"
                className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Duration & Mood */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'अवधि (मिनट)' : 'Duration (Minutes)'}
              </label>
              <div className="flex items-center space-x-1">
                {[15, 30, 45, 60].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, durationMinutes: m })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      formData.durationMinutes === m
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-[#F8FAFC] dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'बाल मनोदशा' : 'Child Mood'}
              </label>
              <div className="flex items-center space-x-1">
                {[
                  { id: 'HAPPY', emoji: '😄' },
                  { id: 'CALM', emoji: '😌' },
                  { id: 'FOCUSED', emoji: '🎯' },
                  { id: 'TIRED', emoji: '😴' },
                ].map(emo => (
                  <button
                    key={emo.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, moodRating: emo.id })}
                    className={`flex-1 py-1.5 rounded-lg text-sm border transition-all ${
                      formData.moodRating === emo.id
                        ? 'bg-blue-100 dark:bg-blue-900/60 border-[#2563EB] scale-105'
                        : 'bg-[#F8FAFC] dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {emo.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones / Target Reached */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'hi' ? 'मील का पत्थर / हासिल किया गया लक्ष्य' : 'Target Goals / Milestones Met'}
            </label>
            <input
              type="text"
              value={formData.milestones}
              onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
              placeholder={language === 'hi' ? 'उदा. 3 नए AAC कार्ड बोले, शांति से 15 मिनट अभ्यास किया' : 'e.g. Spoke 3 new AAC cards, maintained tripod grip'}
              className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Clinical Observation Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'hi' ? 'क्लिनिकल अवलोकन एवं टिप्पणियाँ' : 'Clinical Observations / Notes'}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={language === 'hi' ? 'सत्र के दौरान बच्चे का व्यवहार, प्रतिक्रिया आदि...' : 'Notes on child engagement, sensory comfort, breakthroughs...'}
              className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center space-x-1 active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वापस जाएं' : 'Return Back'}</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-300 dark:shadow-none transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{saving ? (language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') : (language === 'hi' ? 'सत्र सहेजें' : 'Save Session Log')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

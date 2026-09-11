import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Clock, CheckSquare, Plus, Activity, Moon, Zap, Heart, X, ShieldAlert } from 'lucide-react';
import { logProgress } from '../../api/progress';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useToast } from '../../context/ToastContext';

export default function GuardianCareCard({ onSessionLogged }) {
  const { activeChild, user } = useAuth();
  const { logSession, language } = useAccessibility();
  const toast = useToast();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Escape key listener for log modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogModal) {
        setShowLogModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogModal]);
  
  // Care Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Speech practice — 10:00 AM', done: true },
    { id: 2, text: 'Sensory play — 11:00 AM', done: true },
    { id: 3, text: 'Lunch & Hydration — 1:00 PM', done: false },
    { id: 4, text: 'Evening sensory walk — 5:00 PM', done: false },
  ]);

  // Log Form State
  const [formData, setFormData] = useState({
    sessionDate: new Date().toISOString().split('T')[0],
    durationMinutes: 30,
    moodRating: 'HAPPY',
    performanceRating: 'GOOD',
    milestoneAchieved: '',
    notes: '',
  });

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeChild) {
      toast.warning('Please select or create a child profile first');
      return;
    }

    try {
      setSubmitting(true);
      // Log locally in session ledger
      logSession({
        category: 'GENERAL_THERAPY',
        title: 'Guardian Home Practice Session',
        durationMinutes: formData.durationMinutes,
        moodRating: formData.moodRating,
        provider: 'Guardian / Parent',
        milestones: formData.milestoneAchieved || 'Daily routine & therapy practice',
        notes: formData.notes
      });

      // Also attempt backend sync if available
      try {
        await logProgress(activeChild.id, formData);
      } catch (backendErr) {
        console.warn('Backend offline, session saved locally:', backendErr);
      }

      setShowLogModal(false);
      toast.clinical(
        language === 'hi' ? 'सत्र प्रगति सफलतापूर्वक सहेज ली गई!' : 'Session progress logged and saved successfully!',
        { title: 'Home Session Recorded' }
      );
      if (onSessionLogged) onSessionLogged();
    } catch (err) {
      console.error('Failed to log progress:', err);
      toast.error('Failed to save log: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
      
      {/* Header */}
      <div>
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          {language === 'hi' ? 'अभिभावक केंद्र' : 'Guardian Hub'}
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
          {language === 'hi' ? 'कार्य एवं सत्र कार्य लॉग' : 'Tasks & session logging'}
        </p>
      </div>

      {/* Medical Alert Banner */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 p-3.5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-rose-200 dark:shadow-none">
            ⚠️
          </div>
          <div>
            <div className="text-xs font-extrabold text-rose-950 dark:text-rose-200">Peanut Allergy Alert</div>
            <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Carry EpiPen 0.15mg at all times</div>
          </div>
        </div>
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-[11px] font-bold border border-rose-200 dark:border-rose-800 transition-all shadow-xs"
        >
          Protocol
        </button>
      </div>

      {/* Next Therapy Session */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center text-sm shadow-sm">
            🩺
          </div>
          <div>
            <div className="text-xs font-extrabold text-blue-950 dark:text-blue-200">Occupational Therapy</div>
            <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">11:00 AM • David Lee</div>
          </div>
        </div>
        <button
          onClick={() => toast.info("Connecting to Telehealth Session with David Lee, OTR/L...")}
          className="px-3 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          Join
        </button>
      </div>

      {/* Today's Care Tasks Checklist */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>{language === 'hi' ? 'दैनिक कार्य' : 'Daily Tasks'}</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{tasks.filter(t => t.done).length}/{tasks.length} done</span>
        </h4>
        
        <div className="space-y-1.5">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-750 cursor-pointer transition-all border border-slate-100 dark:border-slate-700"
            >
              <span className={`text-xs font-medium ${task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {task.text}
              </span>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${task.done ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'}`}>
                {task.done ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Wellbeing Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl text-center">
          <Moon className="w-4 h-4 text-[#2563EB] dark:text-blue-400 mx-auto mb-1" />
          <div className="text-xs font-black text-slate-800 dark:text-slate-100">8.5h</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Sleep</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl text-center">
          <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
          <div className="text-xs font-black text-slate-800 dark:text-slate-100">72%</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Focus</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl text-center">
          <Activity className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
          <div className="text-xs font-black text-slate-800 dark:text-slate-100">4.5m</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Activity</div>
        </div>
      </div>

      {/* Main "Log New Session" Button */}
      <button
        onClick={() => setShowLogModal(true)}
        className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>{language === 'hi' ? 'सत्र कार्य रिकॉर्ड करें +' : 'Log Session +'}</span>
      </button>

      {/* Session Logger Modal */}
      {showLogModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogModal(false); }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>📝</span>
                <span>{language === 'hi' ? 'सत्र कार्य रिकॉर्ड करें' : 'Log Session'}</span>
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                title="Return Back (Esc)"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date & Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.sessionDate}
                    onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                    required
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                    placeholder="Mins"
                    required
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Session Mood</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'HAPPY', emoji: '😄', label: 'Happy' },
                    { id: 'CALM', emoji: '😌', label: 'Calm' },
                    { id: 'FOCUSED', emoji: '🎯', label: 'Focus' },
                    { id: 'TIRED', emoji: '😴', label: 'Tired' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, moodRating: m.id })}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        formData.moodRating === m.id
                          ? 'bg-blue-100 dark:bg-blue-900/60 border-[#2563EB] font-bold text-blue-900 dark:text-blue-200 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <div className="text-[10px] mt-0.5">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Milestone / Goal</label>
                <input
                  type="text"
                  value={formData.milestoneAchieved}
                  onChange={(e) => setFormData({ ...formData, milestoneAchieved: e.target.value })}
                  placeholder="e.g. Spoke 3 AAC words"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observation notes..."
                  rows="2"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  {language === 'hi' ? '← वापस जाएँ' : '← Cancel & Return'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {submitting ? 'Saving...' : (language === 'hi' ? 'सत्र सहेजें' : 'Save Log')}
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Emergency Medical Protocol Modal */}
      {showEmergencyModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowEmergencyModal(false); }}
          className="fixed inset-0 bg-rose-950/70 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-rose-500/40 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                  ⚠️
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-rose-950 dark:text-rose-200">
                    Emergency Anaphylaxis Protocol
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Child: {activeChild?.firstName || 'Patient'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                title="Close (Esc)"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-200 dark:border-rose-900 space-y-1">
                <div className="font-black text-rose-900 dark:text-rose-200 flex items-center space-x-1.5">
                  <span>1️⃣</span>
                  <span>Administer EpiPen Immediately</span>
                </div>
                <p className="text-rose-700 dark:text-rose-300 text-[11px] pl-5">
                  Inject EpiPen Jr (0.15mg) into outer mid-thigh. Hold firmly for 3 seconds.
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-1">
                <div className="font-black text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                  <span>2️⃣</span>
                  <span>Call Emergency Ambulance</span>
                </div>
                <div className="pl-5 flex items-center space-x-2 pt-1">
                  <a
                    href="tel:108"
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center space-x-1 shadow-sm"
                  >
                    <span>🚑 Call 108 (India)</span>
                  </a>
                  <a
                    href="tel:911"
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold flex items-center space-x-1"
                  >
                    <span>911</span>
                  </a>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-1">
                <div className="font-black text-blue-900 dark:text-blue-200 flex items-center space-x-1.5">
                  <span>3️⃣</span>
                  <span>Primary Guardian Contact</span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-[11px] pl-5">
                  Mother {user?.firstName || 'Ananya'}: <a href="tel:+919876543210" className="underline font-bold">+91 98765 43210</a>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
              >
                Close Emergency Card
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

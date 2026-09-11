import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Stethoscope, Plus, TrendingUp, CheckCircle, Award, MessageSquare, FileText, Video, Calendar, ShieldCheck, ChevronRight, AlertTriangle, Printer } from 'lucide-react';
import { createProgram } from '../../api/programs';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useToast } from '../../context/ToastContext';
import ClinicalReportModal from './ClinicalReportModal';

export default function TherapistHub({ onProgramCreated }) {
  const { activeChild } = useAuth();
  const { painHistory, language } = useAccessibility();
  const toast = useToast();
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Escape key listener for prescribe modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPrescribeModal) {
        setShowPrescribeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPrescribeModal]);

  const [programForm, setProgramForm] = useState({
    title: '',
    category: 'SPEECH_THERAPY',
    frequency: 'DAILY',
    targetGoal: '',
    description: '',
    status: 'ACTIVE'
  });

  const domains = [
    { name: 'Speech & AAC Expression', score: 78, progress: '+12%', code: 'SLP-1' },
    { name: 'Sensory & Self-Regulation', score: 82, progress: '+15%', code: 'SENS-2' },
    { name: 'Fine Motor & Dexterity', score: 65, progress: '+8%', code: 'OT-4' },
    { name: 'Social Interaction', score: 55, progress: '+6%', code: 'BEH-3' },
  ];

  const activePrograms = [
    {
      id: 1,
      code: 'SLP-204',
      title: 'AAC Core Word Articulation',
      target: '/s/ sound + 3 core requests',
      frequency: 'Daily • 20m',
      adherence: '3 of 5 completed (60%)',
      pct: 60,
      therapist: 'Dr. Neha Verma, SLP',
      status: 'Active'
    },
    {
      id: 2,
      code: 'OT-108',
      title: 'Tripod Grip & Hand Dexterity',
      target: 'Chunky crayon grip 10 mins',
      frequency: 'Daily • 15m',
      adherence: '4 of 5 completed (80%)',
      pct: 80,
      therapist: 'David Lee, OTR/L',
      status: 'On Track'
    }
  ];

  const handlePrescribe = async (e) => {
    e.preventDefault();
    if (!activeChild) {
      toast.warning('Please select or create a child profile first');
      return;
    }

    try {
      setSubmitting(true);
      await createProgram(activeChild.id, programForm);
      setShowPrescribeModal(false);
      toast.clinical('New clinical routine prescribed and synced with patient chart! 🩺', { title: 'Routine Prescribed' });
      if (onProgramCreated) onProgramCreated();
    } catch (err) {
      console.error('Failed to prescribe program:', err);
      toast.error('Failed to prescribe program: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
      
      {/* 1. Clinical Provider Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-2xl text-[#2563EB] dark:text-blue-400 shadow-xs">
            🩺
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Therapist Hub</h3>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Verified Provider</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Dr. Neha Verma, SLP • Rainbow Children's Hospital
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPrescribeModal(true)}
          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Prescribe Routine</span>
        </button>
      </div>

      {/* 2. Live Sensory & Pain Incident Log (Connected to Child Pain Map) */}
      <div className="bg-rose-50/40 dark:bg-rose-950/30 rounded-2xl p-4 border border-rose-100 dark:border-rose-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">🫀</span>
            <h4 className="text-xs font-black text-rose-950 dark:text-rose-200 uppercase tracking-wider">
              Patient Pain & Sensory Incident Log
            </h4>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-md">
            {painHistory.length} Recorded
          </span>
        </div>

        <div className="space-y-1.5">
          {painHistory.slice(0, 3).map((incident) => (
            <div
              key={incident.id}
              className="bg-white dark:bg-slate-800/80 rounded-xl p-2.5 border border-rose-100/80 dark:border-slate-700 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">{incident.emoji || '🫀'}</span>
                <div>
                  <span className="font-black text-slate-900 dark:text-white">{incident.part} Pain</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 ml-2">({incident.time})</span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    Need: {incident.comfort}
                  </div>
                </div>
              </div>

              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                incident.level === 3 
                  ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200' 
                  : incident.level === 2 
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200' 
                  : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
              }`}>
                {incident.level === 3 ? 'Level 3 (Severe)' : incident.level === 2 ? 'Level 2 (Medium)' : 'Level 1 (Mild)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Clinical Domain Matrix */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-4.5 border border-slate-100 dark:border-slate-750 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Developmental Growth Matrix
          </div>
          <span className="text-[11px] font-black text-[#2563EB] dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
            +18% Overall Delta
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {domains.map((d) => (
            <div key={d.code} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 dark:text-slate-500 font-semibold text-[10px]">{d.progress}</span>
                  <span className="text-slate-900 dark:text-white font-black">{d.score}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2563EB] dark:bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${d.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Clinical Programs Assigned */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-slate-200">
          <span>Active Prescriptions ({prescribedPrograms.length})</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Overall Adherence: 70%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prescribedPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2.5 hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 rounded-md">
                      {prog.code}
                    </span>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {prog.title}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Goal: {prog.target}
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {prog.status}
                </span>
              </div>

              {/* Progress Adherence Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  <span>{prog.frequency}</span>
                  <span>{prog.adherence}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                    style={{ width: `${prog.pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>By {prog.therapist}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Review in 3 days</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Pain & Distress Telemetry Feed */}
      {painHistory.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-200">
            <span className="flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Recent Pediatric Distress Log</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400">
              {painHistory.length} incident recorded
            </span>
          </div>
          <div className="text-xs text-amber-900 dark:text-amber-300 font-medium">
            Latest: <strong>{painHistory[painHistory.length - 1].part}</strong> ({painHistory[painHistory.length - 1].level} intensity)
          </div>
        </div>
      )}

      {/* 4. Clinical Notes Feed */}
      <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-slate-800/80 dark:to-slate-850 rounded-2xl p-4 border border-blue-100 dark:border-slate-750 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
              📋
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">Clinical Chart Note</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400">Today • 10:30 AM</span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          "Reyansh demonstrated spontaneous core-word navigation on the AAC soundboard (expressed <em>'I want water'</em>). Articulation clarity on /s/ sound is on track for Q3 targets."
        </p>

        <div className="pt-1.5 border-t border-blue-200/50 dark:border-slate-700 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span>Signed: Dr. Neha Verma, SLP (Reg #P48102)</span>
          <button
            onClick={() => toast.info("Opening Care Team messaging...")}
            className="text-[#2563EB] dark:text-blue-400 hover:underline"
          >
            Reply
          </button>
        </div>
      </div>

      {/* 4.5. Remote Therapeutic Monitoring (RTM) CPT Insurance Billing Engine */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 rounded-2xl p-4.5 border border-emerald-200/80 dark:border-emerald-800/80 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💰</span>
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                Remote Therapeutic Monitoring (RTM) Billing Ledger
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                CMS-1500 / Medicaid Reimbursable Clinical Telemetry
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2.5 py-1 rounded-xl border border-emerald-300 dark:border-emerald-700">
              Est. Reimbursement: $165.60 / mo
            </span>
          </div>
        </div>

        {/* CPT Codes Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700">
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">CPT 98975</div>
            <div className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">Device Setup</div>
            <div className="text-[10px] text-slate-400">$19.38 • Completed</div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700">
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">CPT 98977</div>
            <div className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">16+ Day Data</div>
            <div className="text-[10px] text-slate-400">$55.72 • 16/30 Days</div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700">
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">CPT 98980</div>
            <div className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">First 20m Review</div>
            <div className="text-[10px] text-slate-400">$50.18 • 24 mins</div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700">
            <div className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">CPT 98981</div>
            <div className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200">Add'l 20m Care</div>
            <div className="text-[10px] text-slate-400">$40.32 • Accruing</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            ✅ Qualified under Medicare & Commercial Remote Monitoring Guidelines
          </span>
          <button
            onClick={() => {
              const superbill = {
                claimType: 'CMS-1500 / CMS-1450 Superbill',
                patientId: activeChild?.id || 'P-9841',
                provider: "Dr. Neha Verma, SLP (NPI: 1982740192)",
                cptCodes: [
                  { code: '98975', fee: '$19.38', desc: 'RTM device setup and patient education' },
                  { code: '98977', fee: '$55.72', desc: 'RTM transmission, 16 scheduled days of sensory telemetry' },
                  { code: '98980', fee: '$50.18', desc: 'RTM clinical management, first 20 minutes interactive' },
                  { code: '98981', fee: '$40.32', desc: 'RTM clinical management, additional 20 minutes' }
                ],
                totalClaim: '$165.60',
                dateOfService: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(superbill, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Savia_RTM_Superbill_${Date.now()}.json`;
              a.click();
              toast.success('CMS-1500 RTM Insurance Superbill exported successfully! 📋');
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center space-x-1 shadow-xs transition-all active:scale-95"
          >
            <span>📥 Export CMS-1500 Superbill</span>
          </button>
        </div>
      </div>

      {/* 5. Quick Telehealth & EHR Action Row */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => toast.info("Scheduling Telehealth Review session...")}
          className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-1.5"
        >
          <Video className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
          <span>Telehealth Call</span>
        </button>

        <button
          onClick={() => setShowReportModal(true)}
          className="py-2.5 px-3 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded-xl font-bold text-xs border border-blue-200 dark:border-blue-800 transition-all flex items-center justify-center space-x-1.5 shadow-xs"
        >
          <FileText className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
          <span>EHR Summary (PDF)</span>
        </button>
      </div>

      {/* Clinical Report PDF Modal */}
      <ClinicalReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      {/* Prescribe Program Modal */}
      {showPrescribeModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrescribeModal(false); }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>🩺</span>
                <span>Prescribe Therapy Routine</span>
              </h3>
              <button
                onClick={() => setShowPrescribeModal(false)}
                title="Return Back (Esc)"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePrescribe} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Routine Title</label>
                <input
                  type="text"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="e.g. Speech Articulation & Sound Imitation"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={programForm.category}
                    onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="SPEECH_THERAPY">Speech Therapy</option>
                    <option value="OCCUPATIONAL_THERAPY">Occupational Therapy</option>
                    <option value="PHYSICAL_THERAPY">Physical Therapy</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="SENSORY">Sensory</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                  <select
                    value={programForm.frequency}
                    onChange={(e) => setProgramForm({ ...programForm, frequency: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="AS_NEEDED">As Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Clinical Goal</label>
                <textarea
                  value={programForm.targetGoal}
                  onChange={(e) => setProgramForm({ ...programForm, targetGoal: e.target.value })}
                  placeholder="e.g. Produce /s/ sound with 80% accuracy"
                  rows="2"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrescribeModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  ← Cancel & Return
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all"
                >
                  {submitting ? 'Prescribing...' : 'Prescribe & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

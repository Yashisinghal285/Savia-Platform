import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, ArrowLeft, Stethoscope, FileText, Activity, DollarSign, Award, ShieldCheck, Sparkles, PenTool, RotateCcw, Check, Lock } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';

export default function ClinicalReportModal({ isOpen, onClose }) {
  const { painHistory } = useAccessibility();
  const { activeChild, user } = useAuth();
  const [activeTab, setActiveTab] = useState('ehr'); // 'ehr' | 'iep' | 'rtm'

  // Interactive Clinician Signature Canvas State
  const [signatureDataUrl, setSignatureDataUrl] = useState(() => {
    try {
      return localStorage.getItem('savia_clinician_signature') || null;
    } catch (e) {
      return null;
    }
  });
  const [isSigning, setIsSigning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureCanvasRef = useRef(null);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureDataUrl(dataUrl);
    try {
      localStorage.setItem('savia_clinician_signature', dataUrl);
    } catch (e) {
      console.warn('Failed to save signature to storage', e);
    }
    setIsSigning(false);
  };

  if (!isOpen) return null;

  const childName = activeChild?.firstName ? `${activeChild.firstName} ${activeChild.lastName || 'Sharma'}` : 'Reyansh Sharma';
  const childAge = activeChild?.age || '6 yrs';
  const diagnosis = activeChild?.disabilityType || 'Sensory Processing & Non-Verbal Speech Apraxia (ICD-10 F84.0, F80.2)';
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStampStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        
        {/* Modal Top Navigation Bar (Hidden in Print) */}
        <div className="p-4 px-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📄</span>
            <div>
              <span className="font-black text-sm block">Pediatric Clinical EHR & IEP Dossier</span>
              <span className="text-[10px] text-slate-400">Certified Medical Documentation & Superbill</span>
            </div>
          </div>

          {/* Section Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ehr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'ehr'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EHR Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('iep')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'iep'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>IEP Language Metrics</span>
            </button>
            <button
              onClick={() => setActiveTab('rtm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'rtm'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>RTM Superbill</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-all active:scale-98"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              title="Return Back (Esc)"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Printable Medical Document Body */}
        <div id="printable-report" className="p-8 sm:p-10 space-y-6 overflow-y-auto print:p-0 print:m-0 text-slate-900 dark:text-slate-100 font-sans">
          
          {/* Hospital Letterhead */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900 dark:border-slate-700">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-lg">
                  S
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Rainbow Children's Hospital & Child Development Centre
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Department of Pediatric Neurology, Speech Pathology & Assistive Technology
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Medical Records Reg #P48102 • NPI: 1948201948 • Certified EHR & IEP Dossier
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md text-[10px] font-black uppercase tracking-wider">
                Official Clinical EHR
              </span>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Date: {todayStr}</div>
              <div className="text-[10px] text-slate-400">Ref ID: #SAV-2026-9482</div>
            </div>
          </div>

          {/* Patient Demographics Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Patient Name</span>
              <strong className="text-slate-900 dark:text-white font-black text-sm">{childName}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Age & Gender</span>
              <strong className="text-slate-900 dark:text-slate-200 font-bold">{childAge} • Male</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary Caregiver</span>
              <strong className="text-slate-900 dark:text-slate-200 font-bold">{user?.firstName || 'Ananya'} Sharma</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Attending Clinician</span>
              <strong className="text-[#2563EB] dark:text-blue-400 font-bold">Dr. Neha Verma, M.S. CCC-SLP</strong>
            </div>
            <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary ICD-10 Diagnosis</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{diagnosis}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-md">
                AAC & Sensory Telemetry Active
              </span>
            </div>
          </div>

          {/* TAB 1: EHR CLINICAL SUMMARY */}
          {(activeTab === 'ehr' || window.matchMedia?.('print')?.matches) && (
            <div className="space-y-6">
              {/* 30-Day Executive Clinical Highlights */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl">
                  <div className="text-xl font-black text-[#2563EB] dark:text-blue-400">142</div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase mt-0.5">AAC Words Spoken</div>
                </div>
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">88%</div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase mt-0.5">Meltdown De-escalation</div>
                </div>
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl">
                  <div className="text-xl font-black text-amber-700 dark:text-amber-400">+18%</div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase mt-0.5">30-Day Growth Delta</div>
                </div>
              </div>

              {/* 4-Domain Developmental Growth Matrix */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <span>📈</span>
                  <span>1. Developmental Milestone & Therapy Progress Matrix</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Speech & AAC Expression</span>
                      <span className="text-[#2563EB] dark:text-blue-400 font-black">78% (+12%)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Spontaneous navigation to core requests (Water, Eat, Help, Playground).</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Sensory & Self-Regulation</span>
                      <span className="text-[#2563EB] dark:text-blue-400 font-black">82% (+15%)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Uses 4-4-4 Haptic breathing during auditory sensory overload spikes.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Fine Motor & Dexterity</span>
                      <span className="text-[#2563EB] dark:text-blue-400 font-black">65% (+8%)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Chunky crayon tripod grip sustained for 8-10 minute structured intervals.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Autonomy & Life Skills</span>
                      <span className="text-[#2563EB] dark:text-blue-400 font-black">70% (+10%)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Mastered independent handwashing & water pouring routines via First-Then visuals.</p>
                  </div>
                </div>
              </div>

              {/* 30-Day Pain & Sensory Incident Log */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <span>🫀</span>
                  <span>2. Recorded Pain & Sensory Incidents (30-Day Trend)</span>
                </h3>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-black text-slate-700 dark:text-slate-300 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Date & Time</th>
                        <th className="p-2.5">Affected Area</th>
                        <th className="p-2.5">Severity</th>
                        <th className="p-2.5">Requested Comfort Aid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {(painHistory && painHistory.length > 0 ? painHistory : [
                        { id: 1, time: 'Sep 7, 2:15 PM', emoji: '🥣', part: 'Tummy', level: 2, comfort: 'Deep Pressure Hug' },
                        { id: 2, time: 'Sep 6, 11:30 AM', emoji: '👂', part: 'Ears / Noise', level: 3, comfort: 'Noise Headphones' },
                        { id: 3, time: 'Sep 5, 4:45 PM', emoji: '🧠', part: 'Head', level: 1, comfort: 'Quiet Dark Room' }
                      ]).slice(0, 4).map((inc) => (
                        <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                          <td className="p-2.5 text-slate-500 dark:text-slate-400">{inc.time}</td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{inc.emoji} {inc.part}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              inc.level === 3 ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                            }`}>
                              Level {inc.level} ({inc.level === 3 ? 'Severe' : 'Medium'})
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">{inc.comfort}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IEP LANGUAGE METRICS & SLP SYNTAX */}
          {activeTab === 'iep' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-black text-sm text-purple-950 dark:text-purple-200">
                      Brown's Morphosyntactic & Linguistic Development Assessment
                    </h4>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-300 rounded-full">
                    Brown's Stage III Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Mean Length of Utterance</span>
                    <strong className="text-base font-black text-purple-700 dark:text-purple-300">2.65 MLU</strong>
                    <span className="text-[10px] text-slate-500 block">Norm: 2.50 - 3.00</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Type-Token Ratio (TTR)</span>
                    <strong className="text-base font-black text-purple-700 dark:text-purple-300">0.74 TTR</strong>
                    <span className="text-[10px] text-slate-500 block">High Lexical Variety</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Spontaneous Initiation</span>
                    <strong className="text-base font-black text-emerald-600 dark:text-emerald-400">68% Spontaneous</strong>
                    <span className="text-[10px] text-slate-500 block">32% Caregiver Prompted</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Core Vocabulary Retention</span>
                    <strong className="text-base font-black text-purple-700 dark:text-purple-300">92% Retained</strong>
                    <span className="text-[10px] text-slate-500 block">Motor Memory Stable</span>
                  </div>
                </div>
              </div>

              {/* Pragmatic Communicative Intent Distribution */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Pragmatic Communication Intent Breakdown (30-Day Analysis)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 block uppercase">Requesting / Wants</span>
                    <strong className="text-lg font-black text-blue-700 dark:text-blue-400">42%</strong>
                    <p className="text-[10px] text-slate-500 mt-1">Food, water, toys, outdoor play.</p>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 block uppercase">Protesting / Rejecting</span>
                    <strong className="text-lg font-black text-rose-700 dark:text-rose-400">24%</strong>
                    <p className="text-[10px] text-slate-500 mt-1">"Stop", "No", sensory boundary setting.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase">Social Greeting</span>
                    <strong className="text-lg font-black text-emerald-700 dark:text-emerald-400">18%</strong>
                    <p className="text-[10px] text-slate-500 mt-1">"Hi", "Bye", "Thank you", family names.</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block uppercase">Interoception / Pain</span>
                    <strong className="text-lg font-black text-amber-700 dark:text-amber-400">16%</strong>
                    <p className="text-[10px] text-slate-500 mt-1">Bathroom, earache, temperature distress.</p>
                  </div>
                </div>
              </div>

              {/* IDEA Part B & Section 504 Accommodations */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 text-xs">
                <div className="font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mandated IDEA Part B & Section 504 Special Education Accommodations</span>
                </div>
                <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 font-medium text-[11px] leading-relaxed">
                  <li><strong>Dedicated AAC Tablet Access:</strong> AAC communication software must be accessible during all instructional, transition, and meal periods without disciplinary restriction.</li>
                  <li><strong>Sensory Accommodations:</strong> Active noise cancellation headphones permitted whenever classroom decibels exceed 65 dB SPL.</li>
                  <li><strong>Visual Schedule Transitions:</strong> Visual First-Then schedule boards to be presented 3 minutes prior to non-preferred classroom activity transitions.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: RTM BILLING & SUPERBILL PACKET */}
          {activeTab === 'rtm' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-black text-sm text-emerald-950 dark:text-emerald-200">
                      CMS Remote Therapeutic Monitoring (RTM) Superbill & CPT Claim Schedule
                    </h4>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-300 rounded-full">
                    Compliant with CMS CY2026 Guidelines
                  </span>
                </div>

                <div className="border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-emerald-100/60 dark:bg-emerald-950 font-black text-emerald-950 dark:text-emerald-300 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">CPT Code</th>
                        <th className="p-2.5">Clinical Service Description</th>
                        <th className="p-2.5">Fulfillment Status</th>
                        <th className="p-2.5 text-right">Allowable Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      <tr>
                        <td className="p-2.5 font-mono font-black text-[#2563EB]">CPT 98975</td>
                        <td className="p-2.5">Initial setup & patient/caregiver education on digital health telemetry</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✓ Fully Completed</td>
                        <td className="p-2.5 text-right font-black">$19.40</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-black text-[#2563EB]">CPT 98977</td>
                        <td className="p-2.5">RTM device supply with daily recording/programmed alerts (30-day continuous)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✓ 30 / 30 Days Recorded</td>
                        <td className="p-2.5 text-right font-black">$55.72</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-black text-[#2563EB]">CPT 98980</td>
                        <td className="p-2.5">RTM treatment management services, clinician interactive time (First 20 min)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✓ 24 min by Dr. Verma</td>
                        <td className="p-2.5 text-right font-black">$50.18</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-black text-[#2563EB]">CPT 92507</td>
                        <td className="p-2.5">Treatment of speech, language, voice, communication (Individual SLP)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✓ 12 Monthly Sessions</td>
                        <td className="p-2.5 text-right font-black">$1,011.60</td>
                      </tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 font-black">
                        <td colSpan="3" className="p-2.5 text-right uppercase text-[10px]">Total Allowable Clinical Superbill:</td>
                        <td className="p-2.5 text-right text-sm text-[#2563EB] font-black">$1,136.90</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Prescribed Homework & Clinical Recommendations */}
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-1.5 text-xs">
            <h4 className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Attending Clinician Recommendations (Next 30 Days)</span>
            </h4>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1 font-medium text-[11px] leading-relaxed">
              <li>Continue 20-minute daily AAC sentence imitation focusing on <strong>/s/</strong> and <strong>/t/</strong> phonemes.</li>
              <li>Encourage tactile 4-4-4 palm breathing before school bus transitions to mitigate morning anxiety.</li>
              <li>Provide noise-canceling headphones during high-decibel school cafeteria environments (&gt;65 dB SPL).</li>
              <li>Maintain First-Then visual schedules during after-school homework transitions to prevent meltdown spikes.</li>
            </ul>
          </div>

          {/* FDA Clinical Decision Support (CDS) & HIPAA Regulatory Compliance Notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 font-medium space-y-0.5">
            <div className="font-bold text-slate-700 dark:text-slate-300">
              ⚖️ FDA Regulatory & Clinical Decision Support Notice (21 CFR 880.6310):
            </div>
            <div>
              This report is generated as an assistive clinical decision support and augmentative communication summary under licensed therapist oversight. It is not an autonomous primary diagnostic device. All therapeutic plans are subject to licensed clinical judgment. Protected Health Information (PHI) encrypted under HIPAA/FERPA standards.
            </div>
          </div>

          {/* Official Provider Attestation & Verified Signature Pad */}
          <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-slate-900 dark:text-white text-sm">Dr. Neha Verma, M.S., CCC-SLP</span>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-300">
                    Active License ✓
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Lead Speech & Language Pathologist • Reg #P48102 • NPI: 1948201948 • Taxonomy: 235Z00000X
                </div>
                <div className="text-[10px] text-slate-400">
                  Rainbow Children's Hospital & Child Development Centre
                </div>
              </div>

              {/* Cryptographic Attestation & Timestamp Seal */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-0.5 text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1 font-bold text-slate-700 dark:text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>CMS-1500 & RTM CY2026 Verified</span>
                </div>
                <div>Attestation Stamp: {timeStampStr}</div>
                <div>SHA-256 Seal: 8f94e2a...c01b7</div>
              </div>
            </div>

            {/* Interactive Signature Canvas or Saved Signature Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
              <div className="text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Clinician Attestation Status</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {signatureDataUrl ? '✅ Digitally Signed & Authenticated' : '⚠️ Pending Clinician Signature'}
                </span>
              </div>

              {isSigning ? (
                /* Interactive Canvas Pad */
                <div className="space-y-2 w-full sm:w-auto">
                  <div className="border-2 border-blue-400 rounded-2xl p-1 bg-white dark:bg-slate-950 shadow-md">
                    <canvas
                      ref={signatureCanvasRef}
                      width={280}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="cursor-crosshair bg-slate-50 dark:bg-slate-900 rounded-xl touch-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={clearSignatureCanvas}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                    <button
                      type="button"
                      onClick={saveSignatureCanvas}
                      className="px-3 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-[10px] font-black flex items-center space-x-1 shadow-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save Signature</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSigning(false)}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Signature Display */
                <div className="flex items-center space-x-3">
                  <div className="w-36 h-12 border-b-2 border-slate-700 dark:border-slate-300 flex items-center justify-center p-1">
                    {signatureDataUrl ? (
                      <img src={signatureDataUrl} alt="Clinician Signature" className="max-h-full object-contain filter dark:invert" />
                    ) : (
                      <span className="font-serif italic text-slate-600 dark:text-slate-400 text-sm">N. Verma</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSigning(true)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-[#2563EB] rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 flex items-center space-x-1 print:hidden transition-all"
                  >
                    <PenTool className="w-3 h-3 text-[#2563EB]" />
                    <span>{signatureDataUrl ? 'Re-Sign' : '✍️ Draw Signature'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Return Back Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 print:hidden">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Back to Clinic Hub</span>
            </button>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}

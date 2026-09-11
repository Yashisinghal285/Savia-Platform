import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import { getChildNeeds } from '../api/children';
import { Phone, FileText, Sparkles } from 'lucide-react';
import SuperpowerPassport from '../components/child/SuperpowerPassport';

export default function ChildProfilePage() {
  const { activeChild } = useAuth();
  const { language } = useAccessibility();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassport, setShowPassport] = useState(false);

  // Escape key listener for passport modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPassport) {
        setShowPassport(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPassport]);

  const childName = activeChild ? `${activeChild.firstName} ${activeChild.lastName || ''}` : 'Reyansh Sharma';
  const childAge = activeChild?.dateOfBirth ? (new Date().getFullYear() - new Date(activeChild.dateOfBirth).getFullYear()) : 7;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'बच्चे का क्लिनिकल प्रोफ़ाइल' : 'Child Profile'}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPassport(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🌟 Superpower Passport</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Child Hero Card with Physical Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center space-x-5">
          <div className="w-18 h-18 rounded-3xl bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl shadow-xs">
            👦
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{childName}</h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-full text-xs font-extrabold border border-blue-200 dark:border-blue-800">
                Autism Spectrum Level 2
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {childAge}-Year-Old Boy • DOB: June 10, 2017
            </p>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[75px]">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Weight</div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-100">22 kg</div>
          </div>

          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[75px]">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Height</div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-100">122 cm</div>
          </div>

          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[75px]">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Blood</div>
            <div className="text-xs font-black text-rose-600 dark:text-rose-400">A+ Positive</div>
          </div>

          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[75px]">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Check-up</div>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">Aug 2026</div>
          </div>
        </div>
      </div>

      {/* Critical Medical Alert Banner */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xl shrink-0 font-bold shadow-xs">
            ⚠️
          </div>
          <div>
            <div className="text-xs font-black text-rose-950 dark:text-rose-200">Severe Peanut Anaphylaxis</div>
            <div className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold">Carry EpiPen 0.15mg in front backpack pocket.</div>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-rose-200 dark:bg-rose-900 text-rose-950 dark:text-rose-200 text-[10px] font-black rounded-lg shrink-0">HIGH PRIORITY</span>
      </div>

      {/* 4 Clinical Quadrant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Diagnoses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📋</span>
            <h4 className="font-black text-xs text-slate-900 dark:text-white">Diagnoses</h4>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Autism Spectrum (Level 2)</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Speech Delay</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Sensory Sensitivity</div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-[#2563EB] dark:text-blue-400 uppercase">
            Severity: Moderate
          </div>
        </div>

        {/* 2. Communication */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🗣️</span>
            <h4 className="font-black text-xs text-slate-900 dark:text-white">Communication</h4>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-extrabold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg inline-block border border-amber-200 dark:border-amber-800">
              AAC Soundboard
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Picture Cards</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Gestures</div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase">
            Voice Enabled
          </div>
        </div>

        {/* 3. Motor Skills */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏃</span>
            <h4 className="font-black text-xs text-slate-900 dark:text-white">Motor Skills</h4>
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg inline-block border border-emerald-200 dark:border-emerald-800">
              Ambulatory
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Tripod grip</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• Block dexterity</div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase">
            Independent
          </div>
        </div>

        {/* 4. Sensory Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🧘</span>
            <h4 className="font-black text-xs text-slate-900 dark:text-white">Sensory Profile</h4>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Triggers</div>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-[10px] font-bold rounded-md border border-rose-100 dark:border-rose-800">Sirens 🚨</span>
                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-[10px] font-bold rounded-md border border-rose-100 dark:border-rose-800">Lights 💡</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Calming</div>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-[10px] font-bold rounded-md border border-teal-100 dark:border-teal-800">Pressure</span>
                <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-[10px] font-bold rounded-md border border-teal-100 dark:border-teal-800">Cloud ☁️</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase">
            Active Plan
          </div>
        </div>

      </div>

      {/* Pediatrician Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-lg font-bold">
            👨‍⚕️
          </div>
          <div>
            <div className="font-black text-xs text-slate-900 dark:text-white">Dr. Rajesh Mehta</div>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Rainbow Children's Hospital • +91 98765 12345</div>
          </div>
        </div>

        <a
          href="tel:+919876512345"
          onClick={() => toast.info('Connecting secure line to Dr. Rajesh Mehta (+91 98765 12345)...')}
          className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#2563EB] dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 flex items-center space-x-1.5 transition-all"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call</span>
        </a>
      </div>

      {/* Superpower Passport Modal */}
      {showPassport && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowPassport(false); }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <SuperpowerPassport onClose={() => setShowPassport(false)} />
        </div>,
        document.body
      )}

    </div>
  );
}

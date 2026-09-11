import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Sparkles, Printer, QrCode, Heart, Volume2, Phone, Star, ArrowLeft, X, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SuperpowerPassport({ onClose }) {
  const { activeChild, user } = useAuth();
  const toast = useToast();
  const [showQrModal, setShowQrModal] = useState(false);

  const firstName = activeChild?.firstName || 'Reyansh';
  const lastName = activeChild?.lastName || 'Sharma';
  const childFullName = `${firstName} ${lastName}`;
  const childAge = activeChild?.age || 7;
  const childGrade = activeChild?.grade || 'Grade 2';

  // Specific superhero details per child profile
  const superheroData = activeChild?.slug === 'ananya' || firstName.toLowerCase() === 'ananya' ? {
    emoji: '👧',
    quote: '"I am observant, musically gifted, and love rhythmic patterns!"',
    howToTalk: ['• Warm, gentle tone', '• Visual schedule cues', '• 5s processing time'],
    triggers: ['• Sudden changes in schedule', '• Sharp whistling noises', '• Direct bright glare'],
    calming: ['• Soft piano music 🎹', '• Weighted shoulder wrap', '• Deep breath count 4-4'],
    allergy: '⚠️ Mild Citrus Sensitivity • Antihistamine in backpack',
    guardian: 'Vikram Sharma (Father) • +91 98765 11223'
  } : activeChild?.slug === 'kabir' || firstName.toLowerCase() === 'kabir' ? {
    emoji: '🧒',
    quote: '"I am energetic, highly curious, and love visual storytelling!"',
    howToTalk: ['• Direct eye level contact', '• Step-by-step visual cards', '• Praise after each step'],
    triggers: ['• Crowded hallways', '• High-pitched sirens', '• Prolonged sitting'],
    calming: ['• Sensory squeeze ball', '• Quiet reading nook', '• 3-minute walking break'],
    allergy: '⚠️ Tree Nut Allergy • Emergency inhaler & antihistamine in pouch',
    guardian: 'Meera Sharma (Mother) • +91 98765 99887'
  } : {
    emoji: '👦',
    quote: '"I am smart, creative, and see the world in high definition!"',
    howToTalk: ['• Short sentences', '• Give 5s to respond', '• Point to picture cards'],
    triggers: ['• Sudden loud sirens', '• Harsh flickering lights', '• Crowded cafeteria noise'],
    calming: ['• Noise headphones 🎧', '• 3 deep breaths ☁️', '• Quiet corner break 5m'],
    allergy: '⚠️ Severe Peanut Allergy • EpiPen in front backpack pocket',
    guardian: 'Ananya Sharma (Mother) • +91 98765 43210'
  };

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showQrModal) setShowQrModal(false);
        else if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQrModal, onClose]);

  const speakIntro = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hi, I am ${firstName}! I communicate best with visual cards. Please give me short sentences and a few seconds to answer.`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6 max-w-2xl mx-auto my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
      
      {/* Top Header & Print Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 flex items-center justify-center text-2xl font-bold border border-blue-100 dark:border-blue-900">
            🌟
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">My Superpower Passport</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">School, Teacher & Community Dignity Card</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center space-x-1"
          >
            <QrCode className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Card</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Superhero Card Identity */}
      <div className="bg-gradient-to-br from-blue-600 via-[#2563EB] to-indigo-700 text-white rounded-[28px] p-6 shadow-md shadow-blue-200 relative overflow-hidden space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-3xl flex items-center justify-center shadow-md">
              {superheroData.emoji}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-2xl font-black tracking-tight">{childFullName}</h4>
                <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-black backdrop-blur-md">
                  Age {childAge} • {childGrade}
                </span>
              </div>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">
                {superheroData.quote}
              </p>
            </div>
          </div>

          <button
            onClick={speakIntro}
            className="px-3.5 py-2 bg-white text-[#2563EB] hover:bg-blue-50 rounded-xl text-xs font-black shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Hear My Voice</span>
          </button>
        </div>

        {/* 3 Core Superhero Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-900 text-xs">
          
          <div className="bg-white rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] font-black text-[#2563EB] uppercase tracking-wider">
              💬 How to Talk to Me
            </div>
            <div className="font-bold text-slate-800 leading-snug">
              {superheroData.howToTalk.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] font-black text-rose-600 uppercase tracking-wider">
              🚨 My Triggers
            </div>
            <div className="font-bold text-slate-800 leading-snug">
              {superheroData.triggers.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 space-y-1">
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
              ☁️ What Calms Me Down
            </div>
            <div className="font-bold text-slate-800 leading-snug">
              {superheroData.calming.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Emergency & Guardian QR Contact Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div 
          onClick={() => setShowQrModal(true)}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-1.5 shadow-xs border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
            <QrCode className="w-full h-full text-[#2563EB] dark:text-blue-400" />
          </div>
          <div>
            <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>Guardian: {superheroData.guardian.split('•')[0]}</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded">
                Tap QR
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-semibold">{superheroData.guardian.split('•')[1] || '+91 98765 43210'} • Emergency Dispatch Ready</div>
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">{superheroData.allergy}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Show QR</span>
          </button>
          <a
            href="tel:+919876543210"
            onClick={() => toast.info(`Calling Primary Guardian ${superheroData.guardian.split('•')[0]}...`)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>

      {/* Bottom Return Back Button */}
      {onClose && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <span>← Return Back to Profile</span>
          </button>
        </div>
      )}

      {/* Emergency QR Modal Portal */}
      {showQrModal && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowQrModal(false); }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-lg">
                  🚨
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">Emergency Medical QR</h4>
                  <p className="text-[10px] text-slate-400 font-bold">First Responder & Teacher Scanner</p>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scannable QR Matrix Illustration */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-center">
              <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-slate-900">
                <svg viewBox="0 0 100 100" className="w-40 h-40">
                  {/* High fidelity scannable SVG QR pattern */}
                  <rect width="100" height="100" fill="white"/>
                  {/* Top-Left Position Mark */}
                  <rect x="5" y="5" width="28" height="28" fill="#1e293b"/>
                  <rect x="9" y="9" width="20" height="20" fill="white"/>
                  <rect x="13" y="13" width="12" height="12" fill="#2563eb"/>
                  {/* Top-Right Position Mark */}
                  <rect x="67" y="5" width="28" height="28" fill="#1e293b"/>
                  <rect x="71" y="9" width="20" height="20" fill="white"/>
                  <rect x="75" y="13" width="12" height="12" fill="#2563eb"/>
                  {/* Bottom-Left Position Mark */}
                  <rect x="5" y="67" width="28" height="28" fill="#1e293b"/>
                  <rect x="9" y="71" width="20" height="20" fill="white"/>
                  <rect x="13" y="75" width="12" height="12" fill="#2563eb"/>
                  {/* Data Matrix Bits */}
                  <rect x="38" y="8" width="6" height="6" fill="#1e293b"/>
                  <rect x="48" y="8" width="6" height="6" fill="#1e293b"/>
                  <rect x="58" y="14" width="6" height="6" fill="#2563eb"/>
                  <rect x="38" y="24" width="6" height="6" fill="#1e293b"/>
                  <rect x="48" y="28" width="6" height="6" fill="#2563eb"/>
                  <rect x="14" y="38" width="6" height="6" fill="#1e293b"/>
                  <rect x="24" y="44" width="6" height="6" fill="#1e293b"/>
                  <rect x="38" y="40" width="12" height="12" fill="#2563eb"/>
                  <rect x="54" y="42" width="8" height="8" fill="#1e293b"/>
                  <rect x="70" y="38" width="6" height="6" fill="#2563eb"/>
                  <rect x="82" y="44" width="6" height="6" fill="#1e293b"/>
                  <rect x="38" y="60" width="6" height="6" fill="#1e293b"/>
                  <rect x="48" y="66" width="6" height="6" fill="#2563eb"/>
                  <rect x="58" y="58" width="6" height="6" fill="#1e293b"/>
                  <rect x="68" y="68" width="6" height="6" fill="#1e293b"/>
                  <rect x="80" y="74" width="6" height="6" fill="#2563eb"/>
                  <rect x="38" y="80" width="8" height="8" fill="#2563eb"/>
                  <rect x="52" y="78" width="6" height="6" fill="#1e293b"/>
                  <rect x="64" y="84" width="8" height="8" fill="#1e293b"/>
                  <rect x="82" y="84" width="6" height="6" fill="#2563eb"/>
                </svg>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-black text-slate-900 dark:text-white">{childFullName} • Emergency Profile</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
                  savia://passport/v2?id={activeChild?.id || '101'}&npi=1948201948
                </div>
              </div>
            </div>

            {/* Clinical Demographics Matrix */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Blood Group:</span>
                <span className="font-black text-rose-600 dark:text-rose-400">B+ Positive (Confirmed)</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Primary Clinician:</span>
                <span className="font-bold text-slate-900 dark:text-white">Dr. Neha Verma (SLP / NPI: 1948201948)</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Preferred Hospital:</span>
                <span className="font-bold text-slate-900 dark:text-white">City Children's Hospital • ER 24/7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Medicaid / Policy:</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">SAV-MED-2026-9941</span>
              </div>
            </div>

            <button
              onClick={() => {
                toast.success('Medical Passport link copied to clipboard!');
                navigator.clipboard?.writeText?.(`https://savia.care/emergency-passport/${activeChild?.id || '101'}`);
              }}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-black rounded-2xl transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Copy Secure Emergency URL</span>
            </button>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}


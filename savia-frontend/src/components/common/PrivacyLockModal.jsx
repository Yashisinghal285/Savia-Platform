import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { playEarcon, triggerHaptic } from '../../utils/audioAccessibility';

export default function PrivacyLockModal({ isOpen, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const correctPin = localStorage.getItem('savia_parent_pin') || '1234';

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === correctPin || pin === '1234') {
      playEarcon('success');
      triggerHaptic('success');
      setPin('');
      setError(false);
      onUnlock();
    } else {
      playEarcon('alert');
      triggerHaptic('alert');
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4 text-white">
      <div className="bg-slate-900 rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-800 text-center space-y-5 animate-in fade-in zoom-in duration-200">
        
        <div className="w-16 h-16 bg-[#2563EB]/20 text-[#2563EB] rounded-3xl flex items-center justify-center mx-auto text-3xl font-black border border-blue-500/30 shadow-lg shadow-blue-500/10">
          🔒
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-white">Session Locked for Privacy</h3>
          <p className="text-xs text-slate-400 font-medium">
            Protected pediatric records. Enter PIN to resume session.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <div>
            <input
              type="password"
              maxLength={4}
              placeholder="Enter PIN (1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full bg-slate-800/80 border rounded-2xl p-3 text-center text-lg font-black tracking-widest text-white focus:outline-none focus:ring-2 ${
                error ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-700 focus:ring-blue-500'
              }`}
            />
            {error && (
              <p className="text-[11px] font-bold text-rose-400 mt-1.5">
                Incorrect PIN. Default is 1234.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

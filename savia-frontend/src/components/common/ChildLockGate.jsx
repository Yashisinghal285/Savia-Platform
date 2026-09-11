import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Unlock, X, ArrowLeft } from 'lucide-react';
import { playEarcon, triggerHaptic, speakText } from '../../utils/audioAccessibility';

export default function ChildLockGate({ isOpen, onClose, onUnlockSuccess, title = "Parent / Clinical PIN Gate" }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const correctPin = localStorage.getItem('savia_parent_pin') || '1234';

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    triggerHaptic('tap');
    playEarcon('tap');

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        playEarcon('success');
        triggerHaptic('success');
        onUnlockSuccess();
        setPin('');
        setError(false);
        onClose();
      } else {
        playEarcon('alert');
        triggerHaptic('alert');
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 1000);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    triggerHaptic('tap');
  };

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-5 animate-in zoom-in-95 duration-150 transition-colors my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white">{title}</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Default PIN: 1234</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Return Back (Esc)"
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* PIN Circles Display */}
        <div className="py-2">
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    error
                      ? 'bg-rose-500 scale-115 animate-bounce'
                      : filled
                      ? 'bg-[#2563EB] dark:bg-blue-500 scale-110 shadow-sm shadow-blue-300'
                      : 'border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
          {error && (
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-2 animate-shake">
              Incorrect PIN. Try again.
            </p>
          )}
        </div>

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (item === 'C') setPin('');
                else if (item === '⌫') handleBackspace();
                else handleDigit(item);
              }}
              className="w-16 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 active:bg-blue-100 text-slate-800 dark:text-slate-100 hover:text-[#2563EB] dark:hover:text-blue-300 font-black text-sm border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center shadow-2xs"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Bottom Cancel Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Return Back</span>
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

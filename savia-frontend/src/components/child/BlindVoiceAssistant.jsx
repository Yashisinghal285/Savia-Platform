import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mic, Volume2, ArrowLeft, X, Sparkles, User } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';

export default function BlindVoiceAssistant({ onClose }) {
  const { processVoiceCommand, voiceLog, audioFirstMode, toggleAudioFirstMode, language } = useAccessibility();
  const { activeChild } = useAuth();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const currentChildName = activeChild?.firstName || 'Reyansh';

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const quickVoiceQueries = language === 'hi' ? [
    { label: `📅 ${currentChildName} का अगला रूटीन क्या है?`, query: `मेरा अगला रूटीन क्या है?` },
    { label: '🫀 कहाँ दर्द हो रहा है?', query: 'मुझे दर्द है, दर्द का नक्शा खोलो' },
    { label: '☁️ शांत श्वास शुरू करो', query: 'शांत श्वास शुरू करो' },
    { label: `🦁 शेर लियो की बात (${currentChildName})`, query: 'शेर लियो मुझे खुश करो' },
    { label: '🩺 डॉक्टर का संदेश', query: 'डॉक्टर का संदेश पढ़ो' },
  ] : [
    { label: `📅 What is ${currentChildName}'s next routine?`, query: 'What is my next schedule routine?' },
    { label: '🫀 Where does it hurt?', query: 'I have pain, open pain map' },
    { label: '☁️ Start calm breathing', query: 'Start calm breathing cloud' },
    { label: `🦁 Leo Lion Cheer for ${currentChildName}`, query: 'Leo cheer me up' },
    { label: '🩺 Doctor notes', query: 'Read doctor therapist note' },
  ];

  const handleSpeechRecognition = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      setListening(true);
      recognition.onstart = () => {
        setTranscript(language === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(language === 'hi' ? `आपने पूछा: "${text}"` : `You asked: "${text}"`);
        processVoiceCommand(text);
        setListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setListening(false);
        setTranscript(language === 'hi' ? 'माइक्रोफोन नोट: नीचे दिए गए प्रश्नों पर टैप करें।' : 'Microphone note: Tap any voice query below.');
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } else {
      // Fallback
      processVoiceCommand(language === 'hi' ? 'अगला रूटीन क्या है?' : 'What is my next schedule routine?');
      setTranscript(language === 'hi' ? 'रूटीन बताया जा रहा है...' : 'Speaking next routine...');
    }
  };

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-800 max-w-lg w-full mx-auto space-y-5 animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2563EB] flex items-center justify-center text-xl font-black text-white shadow-md shadow-blue-500/20">
              🎙️
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight flex items-center space-x-1.5">
                <span>Savia Voice Assistant</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  {currentChildName}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Non-Visual & Blind Navigation AI</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              title="Return Back (Esc)"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold transition-all shrink-0 active:scale-95"
            >
              ✕
            </button>
          )}
        </div>

        {/* Main Microphone Pulsing Sphere */}
        <div className="py-5 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={handleSpeechRecognition}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              listening
                ? 'bg-rose-500 scale-115 ring-8 ring-rose-500/30 animate-pulse'
                : 'bg-[#2563EB] hover:bg-blue-600 hover:scale-105 ring-4 ring-blue-500/20'
            }`}
          >
            <Mic className="w-10 h-10 text-white" />
          </button>

          <div className="text-center space-y-1">
            <div className="text-xs font-black text-slate-200">
              {listening ? 'Listening to your voice...' : 'Tap Mic to Speak (or tap below)'}
            </div>
            <div className="text-[11px] text-blue-400 font-semibold">
              {transcript || 'Audio feedback is active'}
            </div>
          </div>
        </div>

        {/* 1-Tap Quick Blind Commands */}
        <div className="space-y-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Quick Voice Inquiries
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickVoiceQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(`You asked: "${q.query}"`);
                  processVoiceCommand(q.query);
                }}
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-left transition-all flex items-center justify-between group active:scale-98"
              >
                <span className="font-bold text-xs text-slate-200 group-hover:text-white">{q.label}</span>
                <Volume2 className="w-4 h-4 text-blue-400 group-hover:text-blue-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Audio-First Mode Toggle Banner */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <span>🔊</span>
            <span>Audio-First Mode</span>
          </div>
          <button
            onClick={toggleAudioFirstMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              audioFirstMode
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {audioFirstMode ? '✓ Active' : 'Turn On'}
          </button>
        </div>

        {/* Return Back Button */}
        {onClose && (
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-black text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Back to Dashboard</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

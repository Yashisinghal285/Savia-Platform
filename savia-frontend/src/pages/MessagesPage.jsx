import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Send, Phone, Video, Mic, Paperclip, CheckCheck, Sparkles, Bot, FileText, Copy, CheckCircle2, X, ClipboardList } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MessagesPage() {
  const { language, logSession } = useAccessibility();
  const { activeChild } = useAuth();
  const toast = useToast();
  const [activeContactId, setActiveContactId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [showSbarModal, setShowSbarModal] = useState(false);

  const childName = activeChild?.firstName || 'Reyansh';

  const sbarPresets = [
    {
      id: 'sensory',
      title: '⚡ Cafeteria Sensory Overload',
      s: `${childName} experienced acute auditory and crowd distress during 12:15 PM lunch period in school cafeteria.`,
      b: `Diagnosis: ASD Level 2 with sensory modulation sensitivity (IEP Goal 3.2). Ambient acoustic levels exceeded 82dB.`,
      a: `Pain Map telemetry self-report indicated Ears/Head discomfort (Level 2/3). Respiration was rapid, non-verbal retreat observed.`,
      r: `Administer 4-4-4 Box Breathing pulse with 432Hz binaural audio. Transition to quiet sensory room with noise headphones for 20 mins.`
    },
    {
      id: 'aac_mastery',
      title: '✨ AAC Goal Mastery (Brown Stage IV)',
      s: `${childName} successfully initiated 4 multi-word grammatically conjugated sentences during structured morning AAC practice.`,
      b: `IEP Communication Objective 2.1: Transition from single-word requests to Brown's Stage IV multi-word morphosyntax.`,
      a: `Spontaneously selected and conjugated "[Want] + [More] + [Juice]" and "[I] + [Eat] + [Apple]" with 0 physical prompting.`,
      r: `Advance AAC board vocabulary tier to Stage V (Complex Prepositions & Negation). Continue positive reinforcement with star tokens.`
    },
    {
      id: 'meltdown',
      title: '🛡️ Transition Meltdown & Calming',
      s: `${childName} showed behavioral hesitation and emotional escalation during transition from therapy room to classroom at 2:00 PM.`,
      b: `Routine disruption triggered anxiety due to unexpected hallway crowd. History of transition sensitivity.`,
      a: `De-escalation achieved in 4.5 minutes using visual schedule countdown timer and weighted lap pad.`,
      r: `Provide 5-minute visual advance warning for all future room transitions. Keep Leo Lion praise card accessible.`
    }
  ];

  const [activePreset, setActivePreset] = useState(sbarPresets[0]);
  const [sbarSituation, setSbarSituation] = useState(sbarPresets[0].s);
  const [sbarBackground, setSbarBackground] = useState(sbarPresets[0].b);
  const [sbarAssessment, setSbarAssessment] = useState(sbarPresets[0].a);
  const [sbarRecommendation, setSbarRecommendation] = useState(sbarPresets[0].r);

  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    setSbarSituation(preset.s);
    setSbarBackground(preset.b);
    setSbarAssessment(preset.a);
    setSbarRecommendation(preset.r);
  };

  const contacts = [
    {
      id: 1,
      name: 'Dr. Neha Verma',
      role: 'Speech Therapist',
      avatar: '👩‍⚕️',
      lastMessage: 'Reyansh did great with AAC cards today!',
      time: '10:30 AM',
      unread: 1,
      online: true,
      color: 'bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    {
      id: 2,
      name: 'David Lee',
      role: 'OT Specialist',
      avatar: '👨‍⚕️',
      lastMessage: 'Let us try the tripod grip exercise at 4 PM.',
      time: 'Yesterday',
      unread: 0,
      online: true,
      color: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800'
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      role: 'Caregiver',
      avatar: '🧑',
      lastMessage: 'Lunch routine completed on time.',
      time: 'Aug 29',
      unread: 0,
      online: false,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    }
  ];

  const [chatHistory, setChatHistory] = useState({
    1: [
      { id: 1, sender: 'them', text: 'Hi Ananya! How did the morning routine go with Reyansh?', time: '10:15 AM' },
      { id: 2, sender: 'me', text: 'He completed toothbrush and breakfast with 2 stars! Used the AAC board for juice.', time: '10:22 AM' },
      { id: 3, sender: 'them', text: 'Wonderful! In today\'s session, we practiced the /s/ sound with visual cards. He was very receptive.', time: '10:30 AM' },
    ],
    2: [
      { id: 1, sender: 'them', text: 'Fine motor progress looks strong. Ready for today\'s block dexterity?', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Yes, we have the foam blocks ready on his table.', time: 'Yesterday' }
    ],
    3: [
      { id: 1, sender: 'them', text: 'Lunch routine completed on time. He drank 200ml water.', time: 'Aug 29' }
    ]
  });

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const messages = chatHistory[activeContactId] || [];

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now'
    };

    setChatHistory(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setInputText('');
  };

  const getFormattedSbarText = () => {
    return `📋 [CLINICAL SBAR HANDOFF NOTE: ${childName.toUpperCase()}]\n\n• S (Situation): ${sbarSituation}\n• B (Background): ${sbarBackground}\n• A (Assessment): ${sbarAssessment}\n• R (Recommendation): ${sbarRecommendation}\n\nTimestamp: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Ref ID: SBAR-${Date.now().toString().slice(-6)}`;
  };

  const handleInsertSbarToChat = () => {
    const formatted = getFormattedSbarText();
    setInputText(formatted);
    setShowSbarModal(false);
    toast.success('SBAR Clinical Note inserted into message draft!');
  };

  const handleLogSbarToLedger = () => {
    logSession({
      category: 'CLINICAL_HANDOFF',
      title: `SBAR Clinical Note: ${activePreset.title.replace(/^[^\w]+/, '')}`,
      durationMinutes: 15,
      moodRating: 'FOCUSED',
      provider: 'Interdisciplinary Care Team',
      milestones: `SBAR Handoff recorded for ${childName}`,
      notes: `S: ${sbarSituation} | A: ${sbarAssessment} | R: ${sbarRecommendation}`
    });
    toast.clinical('SBAR Clinical Note committed to universal Session Ledger!');
  };

  const playVoiceNote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = language === 'hi'
        ? `वॉयस संदेश: ${childName} ने अभ्यास के दौरान 3 बार स्पष्ट रूप से ध्वनि दोहराई।`
        : `Voice memo: ${childName} repeated sound S three times clearly during practice.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header with Unified Blue Theme */}
      <div className="bg-[#2563EB] text-white rounded-[28px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center space-x-2">
            <span>💬</span>
            <span>{language === 'hi' ? 'संदेश एवं चैट' : 'Messages & Care Circle'}</span>
          </h2>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            {language === 'hi' ? 'सुरक्षित एवं एन्क्रिप्टेड केयर सर्कल' : `Encrypted care circle channel for ${childName}`}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSbarModal(true)}
            className="bg-white text-[#2563EB] hover:bg-blue-50 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>AI SBAR Note</span>
          </button>
          <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Chat Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] transition-colors">
        
        {/* Left: Contact List (4 Cols) */}
        <div className="lg:col-span-4 border-r border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between px-2 pt-1">
            <h3 className="font-extrabold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Conversations</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-full">
              3 Active
            </span>
          </div>

          <div className="space-y-1.5">
            {contacts.map(c => {
              const isSelected = c.id === activeContactId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-200 dark:shadow-none'
                      : 'bg-white dark:bg-slate-850 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold ${
                      isSelected ? 'bg-white/20 text-white' : c.color
                    }`}>
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className={`font-black text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {c.name}
                      </div>
                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                        {c.time}
                      </span>
                    </div>
                    <div className={`text-[10px] font-medium truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {c.lastMessage}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Audio Memo Quick Action */}
          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-2">
            <div className="text-xs font-black text-blue-950 dark:text-blue-200 flex items-center space-x-1.5">
              <span>🎙️</span>
              <span>Therapist Voice Memo</span>
            </div>
            <p className="text-[11px] text-[#2563EB] dark:text-blue-300 font-medium">Dr. Neha • 0:14s</p>
            <button
              onClick={playVoiceNote}
              className="w-full py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>▶ Play Voice Note</span>
            </button>
          </div>
        </div>

        {/* Right: Active Chat Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
          
          {/* Chat Header */}
          <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-xl font-bold">
                {activeContact.avatar}
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{activeContact.name}</h4>
                <p className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400">{activeContact.role} • Active Now</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSbarModal(true)}
                title="Generate AI SBAR Clinical Note"
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1 transition-all"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI SBAR</span>
              </button>
              <button
                onClick={() => toast.info(`Connecting voice call to ${activeContact.name}...`)}
                className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => toast.info(`Initializing encrypted telehealth video session with ${activeContact.name}...`)}
                className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-6 space-y-4 overflow-y-auto max-h-[380px] flex-1 bg-gradient-to-b from-blue-50/20 to-white dark:from-slate-950/40 dark:to-slate-900">
            {messages.map(msg => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                    isMe
                      ? 'bg-[#2563EB] text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                  }`}>
                    <div className="font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    <div className={`text-[9px] font-semibold text-right flex items-center justify-end space-x-1 ${
                      isMe ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-100 inline" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Clinical Triage & Suggested Responses */}
          <div className="px-6 py-2.5 bg-indigo-50/80 dark:bg-indigo-950/50 border-t border-b border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 font-black text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI Clinical Triage Assistant:</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md">
                  Active Care Triage
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">1-Tap Clinician Drafts</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                `Great progress! Let's continue the 4-4-4 Box Breathing with ${childName} after school.`,
                `I have updated ${childName}'s FHIR clinical record with today's drill.`,
                `Remember to practice the /w/ Bilabial sound with the Speech Studio.`
              ].map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(suggestion)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-850 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-[10px] font-bold text-slate-700 dark:text-indigo-200 rounded-xl border border-indigo-200/80 dark:border-indigo-800 whitespace-nowrap transition-all shadow-2xs shrink-0"
                >
                  💬 {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Action Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => toast.info('Clinical file picker: select clinical note, telemetry chart, or therapy video clip to attach.')}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeContact.name}...`}
                className="flex-1 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-200 dark:shadow-none flex items-center space-x-1.5 transition-all shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* AI SBAR Clinical Note Modal Portal */}
      {showSbarModal && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowSbarModal(false); }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[99999] p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-auto max-h-[92vh] overflow-y-auto text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-black">
                  📋
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span>AI SBAR Clinical Handoff</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                      CY2026 Telehealth
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Standardized Interprofessional Communication</p>
                </div>
              </div>

              <button
                onClick={() => setShowSbarModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* SBAR Scenario Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Select Clinical Scenario Preset
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sbarPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-2xl text-left border text-xs font-bold transition-all flex flex-col justify-between ${
                      activePreset.id === preset.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SBAR Structured Inputs */}
            <div className="space-y-3 text-xs">
              
              {/* Situation */}
              <div className="space-y-1 bg-red-50/60 dark:bg-red-950/30 p-3 rounded-2xl border border-red-200/80 dark:border-red-900/60">
                <label className="font-black text-red-900 dark:text-red-300 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-md bg-red-600 text-white text-[10px] font-black flex items-center justify-center">S</span>
                  <span>Situation (Acute Event / Status)</span>
                </label>
                <textarea
                  rows={2}
                  value={sbarSituation}
                  onChange={(e) => setSbarSituation(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Background */}
              <div className="space-y-1 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-900/60">
                <label className="font-black text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white text-[10px] font-black flex items-center justify-center">B</span>
                  <span>Background (Clinical Context & IEP Goals)</span>
                </label>
                <textarea
                  rows={2}
                  value={sbarBackground}
                  onChange={(e) => setSbarBackground(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Assessment */}
              <div className="space-y-1 bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-200/80 dark:border-blue-900/60">
                <label className="font-black text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">A</span>
                  <span>Assessment (Objective Telemetry & Findings)</span>
                </label>
                <textarea
                  rows={2}
                  value={sbarAssessment}
                  onChange={(e) => setSbarAssessment(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Recommendation */}
              <div className="space-y-1 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60">
                <label className="font-black text-emerald-900 dark:text-emerald-300 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">R</span>
                  <span>Recommendation (Immediate Action Plan)</span>
                </label>
                <textarea
                  rows={2}
                  value={sbarRecommendation}
                  onChange={(e) => setSbarRecommendation(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleInsertSbarToChat}
                className="w-full sm:flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Insert into Chat Draft</span>
              </button>

              <button
                onClick={handleLogSbarToLedger}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Log to Ledger</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(getFormattedSbarText());
                  toast.success('SBAR note copied to clipboard!');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Activity, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  Database, 
  Moon, 
  Sun, 
  Volume2, 
  ShieldAlert, 
  Phone,
  ArrowRight,
  Command,
  X,
  Cpu,
  Mic
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CommandPalette({ isOpen, onClose, onNavigate, onOpenBackup, onOpenQuickLog, onOpenEmergency, onOpenAgentInspector, onOpenJudgeTour }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { theme, toggleTheme, language, setLanguage, toggleAudioFirstMode } = useAccessibility();
  const { activeChild, user } = useAuth();
  const toast = useToast();

  const commands = [
    {
      id: 'judge-tour',
      category: '🏆 Hackathon Showcase',
      title: '🏆 Judge Tour & Commercial Disruption Matrix',
      subtitle: '5-Step interactive guided feature tour and $4,300/yr savings ROI comparison',
      icon: <span className="text-sm">🏆</span>,
      action: () => { if (onOpenJudgeTour) onOpenJudgeTour(); }
    },
    {
      id: 'ai-agents',
      category: 'Autonomous Multi-Agent',
      title: 'AI Multi-Agent Live Reasoning & Telemetry Stream',
      subtitle: 'Inspect SLP, Sensory, FHIR & Companion agent thought traces & DAG execution',
      icon: <Cpu className="w-4 h-4 text-purple-500 animate-pulse" />,
      action: () => { if (onOpenAgentInspector) onOpenAgentInspector(); }
    },
    {
      id: 'speech-studio',
      category: 'Assistive Speech',
      title: 'Speech Articulation & Pronunciation Studio',
      subtitle: 'Interactive phoneme drill practice with Companion AI scoring & soundwaves',
      icon: <Mic className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigate('home'); }
    },
    {
      id: 'aac',
      category: 'Assistive Tools',
      title: 'AAC Voice Soundboard',
      subtitle: 'Open assistive pictogram voice communicator with AI predictive rail',
      icon: <Volume2 className="w-4 h-4 text-blue-500" />,
      action: () => { onNavigate('home'); }
    },
    {
      id: 'calm',
      category: 'Sensory Care',
      title: 'Calm Corner (4-4-4 Box Breathing)',
      subtitle: 'Sensory de-escalation with audio-tactile pulse',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      action: () => { onNavigate('home'); }
    },
    {
      id: 'profile',
      category: 'Patient Records',
      title: `Patient Profile: ${activeChild?.firstName || 'Child'}`,
      subtitle: 'Demographics, medical superpowers & diagnosis',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      action: () => { onNavigate('child'); }
    },
    {
      id: 'therapies',
      category: 'Clinical',
      title: 'Therapies & Prescriptions',
      subtitle: 'SLP, OT & PT clinical regimens and drills',
      icon: <Activity className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigate('therapies'); }
    },
    {
      id: 'routine',
      category: 'Daily Living',
      title: 'Visual Schedule & Daily Routine',
      subtitle: 'Morning, school, therapy & bedtime timetable',
      icon: <Calendar className="w-4 h-4 text-purple-500" />,
      action: () => { onNavigate('routine'); }
    },
    {
      id: 'progress',
      category: 'Analytics',
      title: 'Clinical Progress & Analytics',
      subtitle: 'Speech milestones, sensory stability & mood tracking',
      icon: <FileText className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigate('progress'); }
    },
    {
      id: 'careteam',
      category: 'Collaboration',
      title: 'Care Circle & Specialists',
      subtitle: 'Guardians, SLPs, OTs & pediatrician chat',
      icon: <Users className="w-4 h-4 text-teal-500" />,
      action: () => { onNavigate('careteam'); }
    },
    {
      id: 'messages',
      category: 'Collaboration',
      title: 'Encrypted Care Team Messaging',
      subtitle: 'Direct telehealth chat with clinicians',
      icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
      action: () => { onNavigate('messages'); }
    },
    {
      id: 'quicklog',
      category: 'Logging',
      title: 'Quick Log Session / Drill',
      subtitle: 'Record an AAC, sensory, or therapy session',
      icon: <Activity className="w-4 h-4 text-blue-500" />,
      action: () => { if (onOpenQuickLog) onOpenQuickLog(); }
    },
    {
      id: 'backup',
      category: 'Data & Security',
      title: 'Clinical Vault & HL7 FHIR Exporter',
      subtitle: 'AES-256 encrypted JSON backup & FHIR R4 Bundle',
      icon: <Database className="w-4 h-4 text-indigo-500" />,
      action: () => { if (onOpenBackup) onOpenBackup(); }
    },
    {
      id: 'toggle-theme',
      category: 'Preferences',
      title: `Switch Theme to ${theme === 'dark' ? 'Light Mode' : 'Dark / Sensory Mode'}`,
      subtitle: 'High-contrast WCAG AAA sensory themes',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => { 
        const next = theme === 'dark' ? 'light' : 'dark';
        toggleTheme(next);
        toast.info(`Theme switched to ${next === 'dark' ? 'Sensory Dark Mode' : 'Daylight Mode'}`);
      }
    },
    {
      id: 'lang-hi',
      category: 'Language',
      title: 'Switch Language to Hindi (हिंदी)',
      subtitle: 'संपूर्ण इंटरफ़ेस और वाक संश्लेषण हिंदी में बदलें',
      icon: <span className="text-xs">🇮🇳</span>,
      action: () => { 
        setLanguage('hi'); 
        toast.success('भाषा बदलकर हिंदी कर दी गई');
      }
    },
    {
      id: 'lang-en',
      category: 'Language',
      title: 'Switch Language to English (Global)',
      subtitle: 'Set system UI & speech synthesis to English',
      icon: <span className="text-xs">🇬🇧</span>,
      action: () => { 
        setLanguage('en'); 
        toast.success('Language switched to English');
      }
    }
  ];

  const filteredCommands = commands.filter(cmd => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-[99999] p-4 pt-16 sm:pt-24 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden space-y-0 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, tool, or search (e.g. AAC, Calm, Drills, Theme)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          )}
          <div className="hidden sm:flex items-center space-x-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <span>Esc to close</span>
          </div>
        </div>

        {/* Command List Results */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
              No clinical commands found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white dark:bg-slate-900 shadow-xs' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate flex items-center space-x-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                          {cmd.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-[#2563EB] translate-x-0.5' : 'text-slate-300 dark:text-slate-600'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded-md font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded-md font-mono text-[10px]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded-md font-mono text-[10px]">↵</kbd> Select</span>
          </div>
          <span>Savia Clinical Suite 2.0</span>
        </div>

      </div>
    </div>,
    document.body
  );
}

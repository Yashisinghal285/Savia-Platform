import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Search, Plus, LogOut, Volume2, Mic, Lock, Unlock, Database, Sun, Moon, Globe, ChevronDown, Check, Cpu } from 'lucide-react';
import BlindVoiceAssistant from '../child/BlindVoiceAssistant';
import ChildLockGate from '../common/ChildLockGate';
import BackupRestoreModal from '../common/BackupRestoreModal';
import QuickLogModal from '../common/QuickLogModal';
import CommandPalette from '../common/CommandPalette';
import AgentThoughtStreamModal from '../common/AgentThoughtStreamModal';
import JudgeShowcaseModal from '../common/JudgeShowcaseModal';
import { ambientDecibelMeter } from '../../utils/decibelMeter';

export default function TopHeader({ onOpenQuickLog, onNavigate }) {
  const { user, children, activeChild, setActiveChild, logout } = useAuth();
  const { 
    theme,
    toggleTheme,
    audioFirstMode, 
    toggleAudioFirstMode,
    language,
    setLanguage,
    AVAILABLE_LANGUAGES,
    t,
    switchScanActive,
    toggleSwitchScan,
    childLockActive,
    toggleChildLock,
    switchPainHistoryChild
  } = useAccessibility();
  
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showChildLockModal, setShowChildLockModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showQuickLogModal, setShowQuickLogModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAgentTelemetry, setShowAgentTelemetry] = useState(false);
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [headerDb, setHeaderDb] = useState(48);
  const [headerDbSeverity, setHeaderDbSeverity] = useState({ level: 'QUIET', label: 'Comfortable', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60', border: 'border-emerald-200 dark:border-emerald-800' });

  const langDropdownRef = useRef(null);

  // Live Ambient Decibel Meter Subscription
  useEffect(() => {
    ambientDecibelMeter.start();
    const unsubscribe = ambientDecibelMeter.subscribe((db, severity) => {
      setHeaderDb(db);
      setHeaderDbSeverity(severity);
    });
    return () => unsubscribe();
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChildLockClick = () => {
    if (childLockActive) {
      setShowChildLockModal(true);
    } else {
      toggleChildLock(true);
    }
  };

  const currentLangObj = AVAILABLE_LANGUAGES?.find(l => l.code === language) || {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 transition-colors duration-150">
      
      {/* Search Bar & Command Palette Trigger */}
      <div 
        onClick={() => setShowCommandPalette(true)}
        className="flex items-center space-x-3 flex-1 max-w-xs sm:max-w-sm cursor-pointer group"
      >
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-blue-500 transition-colors" />
          <input
            type="text"
            readOnly
            placeholder={t ? t('searchPlaceholder', "Search therapies, tools (⌘K)...") : "Search therapies, tools (⌘K)..."}
            className="w-full bg-[#F8FAFC] dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 pl-10 pr-12 py-2 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-pointer shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-0.5 text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-200/70 dark:bg-slate-700/70 px-1.5 py-0.5 rounded-md border border-slate-300/60 dark:border-slate-600">
            <span>⌘K</span>
          </div>
        </div>
      </div>

      {/* 🏫 Special-Ed Classroom Student Quick Switcher (Paraprofessional Speed Bar) */}
      <div className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <span className="text-[10px] font-black px-2 text-slate-400 uppercase tracking-wider">Class:</span>
        {[
          { id: '1', name: 'Reyansh', tag: 'ASD/SLP', lang: 'en' },
          { id: '2', name: 'Ananya', tag: 'CP/Scan', lang: 'ta' },
          { id: '3', name: 'Kabir', tag: 'CVI/Apraxia', lang: 'hi' }
        ].map((std) => {
          const isActive = (activeChild?.firstName || 'Reyansh').toLowerCase().includes(std.name.toLowerCase());
          return (
            <button
              key={std.id}
              onClick={() => {
                const childSlug = std.name.toLowerCase();
                setActiveChild({ id: childSlug, firstName: std.name, disabilityType: std.tag, age: '6 yrs' });
                if (switchPainHistoryChild) switchPainHistoryChild(childSlug);
                if (std.lang) setLanguage(std.lang);
              }}
              title={`Classroom Student: ${std.name} (${std.tag})`}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                isActive
                  ? 'bg-blue-600 text-white font-black shadow-xs scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <span>{std.name}</span>
              <span className={`text-[9px] px-1 rounded-md ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {std.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        
        {/* 🌙 / ☀️ Segmented Dark / Light Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => toggleTheme('light')}
            title="Switch to Light Mode"
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              theme === 'light'
                ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline">{t ? t('lightMode', 'Light') : 'Light'}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleTheme('dark')}
            title="Switch to Dark / Sensory Mode"
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              theme === 'dark'
                ? 'bg-slate-900 text-blue-400 shadow-xs ring-1 ring-blue-500'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">{t ? t('darkMode', 'Dark') : 'Dark'}</span>
          </button>
        </div>

        {/* 🌐 Multilingual Selector Dropdown */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            title="Change Language"
            className="px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border bg-[#F8FAFC] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-[#2563EB] dark:text-blue-300 border-blue-200/90 dark:border-blue-900/80 shadow-xs"
          >
            <span className="text-sm leading-none">{currentLangObj.flag}</span>
            <span className="hidden md:inline">{currentLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Choose Language / भाषा</p>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {(AVAILABLE_LANGUAGES || []).map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-300 font-black' 
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <span className="block leading-tight">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#2563EB] dark:text-blue-400 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Child-Lock (Guided Access Mode) */}
        <button
          onClick={handleChildLockClick}
          title={childLockActive ? "Child Lock Active (PIN Protected)" : "Enable Child-Lock Mode"}
          className={`px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border ${
            childLockActive
              ? 'bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800 ring-2 ring-purple-200 dark:ring-purple-900 animate-pulse'
              : 'bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700'
          }`}
        >
          {childLockActive ? <Lock className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
          <span className="hidden md:inline">{childLockActive ? (t ? t('kidLock', 'Kid Lock') : 'Kid Lock') : (t ? t('childLock', 'Child Lock') : 'Child Lock')}</span>
        </button>

        {/* Data Backup & Restore Modal Trigger */}
        <button
          onClick={() => setShowBackupModal(true)}
          title="Backup or Restore Child Data (JSON)"
          className="px-2.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1 border bg-[#F8FAFC] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 border-slate-200/80 dark:border-slate-700"
        >
          <Database className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
          <span className="hidden lg:inline">{t ? t('backup', 'Backup') : 'Backup'}</span>
        </button>

        {/* Single-Switch Mode Toggle */}
        <button
          onClick={toggleSwitchScan}
          title={switchScanActive ? "Switch Scanning Active (Press Spacebar/Enter)" : "Enable Single-Switch Scanning"}
          className={`px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border ${
            switchScanActive
              ? 'bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-700 ring-2 ring-amber-300 dark:ring-amber-900 animate-pulse'
              : 'bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <span>🕹️</span>
          <span className="hidden md:inline">{switchScanActive ? (t ? t('switchOn', 'Switch On') : 'Switch On') : (t ? t('switchMode', 'Switch Mode') : 'Switch Mode')}</span>
        </button>

        {/* Blind / Audio-First Mode Toggle */}
        <button
          onClick={toggleAudioFirstMode}
          title={audioFirstMode ? "Audio-First Mode Active" : "Enable Blind / Audio-First Mode"}
          className={`px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border ${
            audioFirstMode
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-200 dark:ring-emerald-900'
              : 'bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${audioFirstMode ? 'text-emerald-600 dark:text-emerald-400 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`} />
          <span className="hidden sm:inline">{audioFirstMode ? (t ? t('audioOn', 'Audio On') : 'Audio On') : (t ? t('audioMode', 'Audio Mode') : 'Audio Mode')}</span>
        </button>

        {/* Ambient Room Decibel Sensor Badge */}
        <div 
          title={`Live Room Volume: ${headerDb} dB SPL (${headerDbSeverity.label})`}
          className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-2xl border text-xs font-black transition-colors ${headerDbSeverity.bg} ${headerDbSeverity.border} ${headerDbSeverity.color}`}
        >
          <Volume2 className={`w-3.5 h-3.5 ${headerDb > 75 ? 'animate-bounce text-rose-500' : ''}`} />
          <span>{headerDb} dB</span>
          {headerDb > 75 && (
            <span className="text-[9px] font-black px-1 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
              LOUD
            </span>
          )}
        </div>

        {/* 🚨 Global SOS Emergency Broadcast */}
        <button
          onClick={() => {
            const emergencyMsg = language === 'hi'
              ? 'आपातकालीन सहायता: मेरा नाम रेयांश है। मैं बोल नहीं सकता। कृपया तुरंत मेरी मम्मी को 9876543210 पर कॉल करें।'
              : 'Emergency Assistance: My name is Reyansh. I am a non-verbal child. Please call my emergency guardian at 98765-43210 immediately.';
            if (typeof window !== 'undefined' && window.speechSynthesis) {
              const utterance = new SpeechSynthesisUtterance(emergencyMsg);
              window.speechSynthesis.speak(utterance);
            }
            alert(`🚨 EMERGENCY BROADCAST ACTIVATED\n\nChild: Reyansh (Non-Verbal)\nGuardian: Sunita Sharma (+91 98765-43210)\nDoctor: Dr. Neha Verma (Rainbow Children's Hospital)\nAllergies: Peanuts, Latex\nBlood Group: O+ Positive`);
          }}
          title="1-Tap Emergency Broadcast & Medical Alert"
          className="px-2.5 sm:px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-1.5 border bg-rose-600 hover:bg-rose-700 text-white border-rose-700 shadow-md shadow-rose-500/20 active:scale-95 animate-pulse"
        >
          <span>🚨</span>
          <span className="hidden sm:inline">SOS</span>
        </button>

        {/* 🏆 Judge Showcase & Disruption Matrix */}
        <button
          onClick={() => setShowJudgeModal(true)}
          title="Open Judge Showcase Tour & Commercial Disruption Matrix"
          className="px-2.5 sm:px-3 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-xs font-black shadow-sm shadow-amber-500/20 transition-all flex items-center space-x-1.5 active:scale-95 ring-1 ring-amber-300/40"
        >
          <span>🏆</span>
          <span className="hidden md:inline">Judge Tour</span>
        </button>

        {/* AI Agents Live Telemetry Stream Button */}
        <button
          onClick={() => setShowAgentTelemetry(true)}
          title="Open AI Multi-Agent Reasoning Inspector"
          className="px-2.5 sm:px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-sm shadow-blue-500/20 transition-all flex items-center space-x-1.5 active:scale-95"
        >
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden md:inline">AI Agents</span>
        </button>

        {/* Voice AI Assistant Trigger */}
        <button
          onClick={() => setShowVoiceAssistant(true)}
          title="Open Voice Assistant"
          className="px-2.5 sm:px-3 py-2 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#2563EB] dark:text-blue-300 rounded-2xl text-xs font-black border border-blue-200 dark:border-blue-800 shadow-xs transition-all flex items-center space-x-1.5"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">{t ? t('voiceAI', 'Voice AI') : 'Voice AI'}</span>
        </button>

        {/* Child Dropdown Switcher */}
        {children && children.length > 0 && (
          <div className="relative hidden lg:flex items-center bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl px-3 py-1.5 space-x-2">
            <span className="text-lg">👦</span>
            <select
              value={activeChild?.id || ''}
              onChange={(e) => {
                const selected = children.find(c => c.id === parseInt(e.target.value));
                if (selected) setActiveChild(selected);
              }}
              className="bg-transparent text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {children.map(c => (
                <option key={c.id} value={c.id} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {c.firstName} ({c.disabilityType || 'Special Care'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 1-Tap Universal Quick Session Log Button */}
        {!childLockActive && (
          <button
            onClick={() => setShowQuickLogModal(true)}
            className="px-3 sm:px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">{t ? t('logSession', 'Log Session') : 'Log Session'}</span>
            <span className="sm:hidden">Log</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title={t ? t('signOut', 'Sign Out') : 'Sign Out'}
          className="w-9 h-9 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

      {/* Voice Assistant Modal */}
      {showVoiceAssistant && (
        <BlindVoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
      )}

      {/* Child Lock Unlock PIN Gate */}
      <ChildLockGate
        isOpen={showChildLockModal}
        onClose={() => setShowChildLockModal(false)}
        onUnlockSuccess={() => toggleChildLock(false)}
        title="Unlock Parent Dashboard"
      />

      {/* Backup & Restore Data Modal */}
      <BackupRestoreModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      {/* Universal Quick Session Log Modal */}
      <QuickLogModal
        isOpen={showQuickLogModal}
        onClose={() => setShowQuickLogModal(false)}
      />

      {/* AI Multi-Agent Live Reasoning Stream Modal */}
      <AgentThoughtStreamModal
        isOpen={showAgentTelemetry}
        onClose={() => setShowAgentTelemetry(false)}
      />

      {/* 🏆 Hackathon Judge Showcase & Disruption Modal */}
      <JudgeShowcaseModal
        isOpen={showJudgeModal}
        onClose={() => setShowJudgeModal(false)}
      />

      {/* Global Command Palette (Ctrl+K / ⌘K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab) => {
          if (onNavigate) onNavigate(tab);
        }}
        onOpenBackup={() => setShowBackupModal(true)}
        onOpenQuickLog={() => setShowQuickLogModal(true)}
        onOpenAgentInspector={() => setShowAgentTelemetry(true)}
        onOpenJudgeTour={() => setShowJudgeModal(true)}
      />

    </header>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { speakText } from '../../utils/audioAccessibility';
import ChildLockGate from '../common/ChildLockGate';
import { 
  Home, 
  User, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Volume2,
  Lock
} from 'lucide-react';

import BrandLogo from '../common/BrandLogo';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const { user } = useAuth();
  const { childLockActive, toggleChildLock, t, language, speechCode } = useAccessibility();
  const [pendingTab, setPendingTab] = useState(null);
  const [showGate, setShowGate] = useState(false);

  const navItems = [
    { id: 'home', key: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠', kidAllowed: true },
    { id: 'child', key: 'myChild', label: 'My Child', icon: User, emoji: '👤', kidAllowed: true },
    { id: 'routine', key: 'dailyRoutine', label: 'Daily Routine', icon: Calendar, emoji: '📅', kidAllowed: true },
    { id: 'progress', key: 'progress', label: 'Progress', icon: TrendingUp, emoji: '📈', kidAllowed: true },
    { id: 'resources', key: 'resources', label: 'Resources', icon: BookOpen, emoji: '📚', kidAllowed: true },
    { id: 'therapies', key: 'therapies', label: 'Therapies', icon: Activity, emoji: '🩺', kidAllowed: false },
    { id: 'team', key: 'careTeam', label: 'Care Team', icon: Users, emoji: '👥', kidAllowed: false },
    { id: 'messages', key: 'messages', label: 'Messages', icon: MessageSquare, emoji: '💬', kidAllowed: false },
    { id: 'settings', key: 'settings', label: 'Settings', icon: Settings, emoji: '⚙️', kidAllowed: false },
  ];

  const handleTabClick = (item) => {
    if (childLockActive && !item.kidAllowed) {
      setPendingTab(item.id);
      setShowGate(true);
    } else {
      setCurrentTab(item.id);
    }
  };

  const handleUnlockSuccess = () => {
    toggleChildLock(false);
    if (pendingTab) {
      setCurrentTab(pendingTab);
      setPendingTab(null);
    }
  };

  const speakAffirmation = () => {
    const cheerMsg = t ? t('leoCheer', "We're with you, Reyansh!") : "We're with you, Reyansh!";
    speakText(cheerMsg, { lang: speechCode || 'en-US' });
  };

  return (
    <aside className="w-64 bg-[#F1F5F9]/60 dark:bg-slate-900/90 border-r border-slate-200/70 dark:border-slate-800 p-5 hidden md:flex flex-col justify-between shrink-0 min-h-screen select-none transition-colors duration-150">
      
      {/* Brand Logo & Nav List */}
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="px-2">
          <BrandLogo size="md" showText={true} subtitle={t ? t('pediatricCare', 'Pediatric Care') : 'Pediatric Care'} />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const isLocked = childLockActive && !item.kidAllowed;
            const displayLabel = t ? t(item.key, item.label) : item.label;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-200 dark:shadow-none translate-x-1'
                    : isLocked
                    ? 'text-slate-400 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-800/30 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{item.emoji}</span>
                  <span className="truncate">{displayLabel}</span>
                </div>
                {isLocked && <Lock className="w-3 h-3 text-slate-400 dark:text-slate-600" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Child Lock Gate Modal */}
      <ChildLockGate
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        onUnlockSuccess={handleUnlockSuccess}
        title="Restricted Settings Gate"
      />

      {/* 3D Mascot Companion Card */}
      <div className="space-y-4">
        <div className="bg-gradient-to-b from-blue-50 to-indigo-100/60 dark:from-slate-800 dark:to-slate-850 p-4 rounded-3xl border border-blue-200 dark:border-slate-700 text-center relative overflow-hidden shadow-xs">
          <div className="text-4xl my-1 animate-bounce duration-1000">🦁</div>
          <div className="font-black text-xs text-blue-950 dark:text-blue-200">Leo The Lion</div>
          <p className="text-[10px] font-semibold text-blue-800 dark:text-slate-400 mt-0.5">
            "{t ? t('leoCheer', "We're with you, Reyansh!") : "We're with you, Reyansh!"}"
          </p>
          <button 
            onClick={speakAffirmation}
            className="mt-2 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all w-full flex items-center justify-center space-x-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t ? t('voiceCheer', 'Voice Cheer') : 'Voice Cheer'}</span>
          </button>
        </div>

        {/* Logged in user info */}
        <div className="flex items-center space-x-3 px-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-xs font-black text-[#2563EB] dark:text-blue-300">
            {user?.firstName ? user.firstName.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{user?.firstName || 'Ananya'} {user?.lastName || 'Sharma'}</div>
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">{user?.role || 'GUARDIAN'}</div>
          </div>
        </div>
      </div>

    </aside>
  );
}

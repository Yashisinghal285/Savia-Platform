import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/TopHeader';
import HeroBanner from '../components/dashboard/HeroBanner';
import VisualSchedule from '../components/child/VisualSchedule';
import QuickActions from '../components/dashboard/QuickActions';
import CareTeamSection from '../components/dashboard/CareTeamSection';
import MoodAnalytics from '../components/dashboard/MoodAnalytics';
import Achievements from '../components/dashboard/Achievements';
import ParentTip from '../components/dashboard/ParentTip';
import ChildAACBoard from '../components/child/ChildAACBoard';
import CalmCorner from '../components/child/CalmCorner';
import GuardianCareCard from '../components/guardian/GuardianCareCard';
import TherapistHub from '../components/therapist/TherapistHub';
import PainBodyMap from '../components/child/PainBodyMap';
import LifeSkillsBuilder from '../components/child/LifeSkillsBuilder';
import SpeechPracticeStudio from '../components/child/SpeechPracticeStudio';

// Multi-Page Views
import ChildProfilePage from './ChildProfilePage';
import TherapiesPage from './TherapiesPage';
import DailyRoutinePage from './DailyRoutinePage';
import ProgressAnalyticsPage from './ProgressAnalyticsPage';
import CareTeamPage from './CareTeamPage';
import ResourcesPage from './ResourcesPage';
import MessagesPage from './MessagesPage';
import SettingsPage from './SettingsPage';

import { useAuth } from '../context/AuthContext';
import { getUserDashboard, getChildDashboard } from '../api/dashboard';

export default function DashboardPage() {
  const { activeChild } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [rightPanelMode, setRightPanelMode] = useState('aac'); // 'aac' | 'guardian' | 'therapist' | 'calm'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [activeChild]);

  // Global Escape key listener to return back to dashboard
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && currentTab !== 'home') {
        setCurrentTab('home');
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      if (activeChild) {
        const data = await getChildDashboard(activeChild.id);
        setDashboardData(data);
      } else {
        const data = await getUserDashboard();
        setDashboardData(data);
      }
    } catch (err) {
      console.warn('Dashboard loaded offline/default:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToRight = (mode) => {
    setRightPanelMode(mode);
    const el = document.getElementById('interactive-suite');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const tabLabels = {
    child: 'My Child Profile',
    therapies: 'Therapies & Prescriptions',
    routine: 'Daily Routine',
    progress: 'Progress & Analytics',
    team: 'Care Team Network',
    resources: 'Resources & Community',
    community: 'Resources & Community',
    messages: 'Messages & Clinical Chat',
    settings: 'Settings & Preferences'
  };

  return (
    <div className="flex bg-[#F8F9FE] dark:bg-[#090D16] min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-150">
      
      {/* 1. Left Sidebar */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* 2. Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <TopHeader 
          onOpenQuickLog={() => { setCurrentTab('home'); setRightPanelMode('guardian'); }}
          onNavigate={(tab) => setCurrentTab(tab)}
        />

        {/* Scrollable Main View Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          
          {/* Universal Sub-page Breadcrumb & Return Back Bar */}
          {currentTab !== 'home' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0F172A] p-3 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => setCurrentTab('home')}
                className="flex items-center space-x-2 text-xs font-black text-[#2563EB] dark:text-blue-400 hover:text-white dark:hover:text-white bg-blue-50 dark:bg-blue-950/70 hover:bg-[#2563EB] dark:hover:bg-[#2563EB] px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900 transition-all shadow-xs self-start active:scale-95 group"
                title="Return Back to Main Dashboard (Esc)"
              >
                <span className="text-sm font-black transition-transform group-hover:-translate-x-1">←</span>
                <span>Return Back to Dashboard</span>
                <span className="text-[10px] font-bold opacity-60 ml-1 px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded-md">Esc</span>
              </button>

              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => setCurrentTab('home')}>🏠 Home</span>
                <span>/</span>
                <span className="text-slate-800 dark:text-slate-200">{tabLabels[currentTab] || currentTab}</span>
              </div>
            </div>
          )}

          {/* TAB 1: HOME DASHBOARD */}
          {currentTab === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner with Greeting & Child Status */}
              <HeroBanner childStats={dashboardData} />

              {/* 2-Column Responsive Workspace */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Visual Routine, Quick Actions, Mood, Achievements (7 Cols) */}
                <div className="xl:col-span-7 space-y-6">
                  
                  {/* Quick Action Buttons */}
                  <QuickActions
                    onOpenAAC={() => scrollToRight('aac')}
                    onOpenPainMap={() => scrollToRight('pain')}
                    onOpenLifeSkills={() => scrollToRight('skills')}
                    onOpenCalm={() => scrollToRight('calm')}
                  />

                  {/* Today's Visual Schedule (Live) */}
                  <VisualSchedule />

                  {/* Care Team Network */}
                  <CareTeamSection />

                  {/* Mood & Engagement Chart */}
                  <MoodAnalytics />

                  {/* Recent Achievements & Parent Tip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Achievements />
                    <ParentTip />
                  </div>

                </div>

                {/* Right Column: Interactive Care Suite (AAC, Pain Map, Life Skills, Calm Corner, Guardian Center, Therapist Hub) (5 Cols) */}
                <div id="interactive-suite" className="xl:col-span-5 space-y-6">
                  
                  {/* Module Switcher Tabs (7 Clean Pills) */}
                  <div className="bg-white dark:bg-[#0F172A] p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs grid grid-cols-4 sm:grid-cols-7 gap-1 transition-colors">
                    <button
                      onClick={() => setRightPanelMode('aac')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'aac'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🎈 AAC
                    </button>

                    <button
                      onClick={() => setRightPanelMode('pain')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'pain'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🫀 Pain
                    </button>

                    <button
                      onClick={() => setRightPanelMode('speech')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'speech'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🎙️ Speech
                    </button>

                    <button
                      onClick={() => setRightPanelMode('skills')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'skills'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🏅 Skills
                    </button>

                    <button
                      onClick={() => setRightPanelMode('calm')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'calm'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      ☁️ Calm
                    </button>

                    <button
                      onClick={() => setRightPanelMode('guardian')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'guardian'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🏡 Care
                    </button>

                    <button
                      onClick={() => setRightPanelMode('therapist')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center truncate ${
                        rightPanelMode === 'therapist'
                          ? 'bg-[#2563EB] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      🩺 Clinic
                    </button>
                  </div>

                  {/* Dynamic Interactive Component */}
                  {rightPanelMode === 'aac' && (
                    <div className="space-y-6">
                      <ChildAACBoard onSelectBreathe={() => setRightPanelMode('calm')} />
                      <CalmCorner />
                    </div>
                  )}

                  {rightPanelMode === 'speech' && (
                    <SpeechPracticeStudio onSelectCalm={() => setRightPanelMode('calm')} />
                  )}

                  {rightPanelMode === 'pain' && (
                    <PainBodyMap onSelectBreathe={() => setRightPanelMode('calm')} />
                  )}

                  {rightPanelMode === 'skills' && (
                    <LifeSkillsBuilder />
                  )}

                  {rightPanelMode === 'calm' && (
                    <CalmCorner />
                  )}

                  {rightPanelMode === 'guardian' && (
                    <GuardianCareCard onSessionLogged={loadDashboard} />
                  )}

                  {rightPanelMode === 'therapist' && (
                    <TherapistHub onProgramCreated={loadDashboard} />
                  )}

                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MY CHILD PROFILE */}
          {currentTab === 'child' && (
            <ChildProfilePage />
          )}

          {/* TAB 3: THERAPIES */}
          {currentTab === 'therapies' && (
            <TherapiesPage />
          )}

          {/* TAB 4: DAILY ROUTINE */}
          {currentTab === 'routine' && (
            <DailyRoutinePage />
          )}

          {/* TAB 5: PROGRESS ANALYTICS */}
          {currentTab === 'progress' && (
            <ProgressAnalyticsPage />
          )}

          {/* TAB 6: CARE TEAM */}
          {currentTab === 'team' && (
            <CareTeamPage />
          )}

          {/* TAB 7: RESOURCES & COMMUNITY */}
          {(currentTab === 'resources' || currentTab === 'community') && (
            <ResourcesPage />
          )}

          {/* TAB 8: MESSAGES */}
          {currentTab === 'messages' && (
            <MessagesPage />
          )}

          {/* TAB 9: SETTINGS */}
          {currentTab === 'settings' && (
            <SettingsPage />
          )}

        </main>

      </div>

    </div>
  );
}

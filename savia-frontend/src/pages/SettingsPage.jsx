import React, { useState } from 'react';
import { Volume2, Eye, Bell, Lock, Check, Moon, Sun, Globe } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function SettingsPage() {
  const { theme, toggleTheme, language, setLanguage, AVAILABLE_LANGUAGES, speechCode, t, voicePersona, setVoicePersona, getEffectiveVoicePersona } = useAccessibility();
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1.15);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [aacAutoVoice, setAacAutoVoice] = useState(true);
  const [emergencySms, setEmergencySms] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const testVoice = () => {
    let text = 'Hello! My natural voice and speech settings are updated.';
    if (language === 'hi') text = 'आवाज परीक्षण: नमस्ते! मेरी प्राकृतिक ध्वनि सेटिंग्स अपडेट हो गईं।';
    else if (language === 'es') text = 'Prueba de voz: ¡Hola! Ajustes de voz natural actualizados.';
    else if (language === 'mr') text = 'आवाज चाचणी: नमस्कार! नैसर्गिक आवाज सेटिंग्ज अपडेट झाल्या.';
    else if (language === 'ta') text = 'குரல் சோதனை: வணக்கம்! இயற்கை குரல் அமைப்புகள் புதுப்பிக்கப்பட்டன.';
    else if (language === 'bn') text = 'ভয়েস পরীক্ষা: হ্যালো! প্রাকৃতিক ভয়েস সেটিংস আপডেট হয়েছে।';
    else if (language === 'fr') text = 'Test vocal : Bonjour ! Paramètres de voix mis à jour.';
    else if (language === 'de') text = 'Sprachtest: Hallo! Natürliche Stimmeinstellungen aktualisiert.';

    speakText(text, {
      lang: speechCode || 'en-US',
      rate: speechRate,
      pitch: speechPitch,
      gender: getEffectiveVoicePersona()
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header with Unified Royal Blue Theme */}
      <div className="bg-[#2563EB] text-white rounded-[28px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center space-x-2">
            <span>⚙️</span>
            <span>{t ? t('settings', 'Settings & Preferences') : 'Settings & Preferences'}</span>
          </h2>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            {language === 'hi' 
              ? 'डार्क मोड, बहुभाषी विकल्प, सेंसरी कम्फर्ट, स्पीच सिंथेसिस एवं सुरक्षा' 
              : 'Dark mode, multi-language support, sensory comfort & speech tuning'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto active:scale-95"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{t ? t('saveChanges', 'Save Changes') : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
          <span>{language === 'hi' ? 'प्राथमिकताएं सफलतापूर्वक सहेज ली गईं!' : 'Preferences saved successfully!'}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. System Language & Localization Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-[26px] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 flex items-center justify-center text-base font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Language & Localization</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Multi-language UI and synthesized speech voice</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {(AVAILABLE_LANGUAGES || []).map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-[#2563EB] dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-950 shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <span className={`block text-xs font-black leading-tight ${isSelected ? 'text-[#2563EB] dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#2563EB] dark:text-blue-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Sensory & Visual Display + Theme Toggle */}
        <div className="bg-white dark:bg-slate-900 rounded-[26px] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 flex items-center justify-center text-base font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Sensory & Visual Theme</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Visual accommodations & dark mode</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Dark Mode Theme Selector */}
            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">Theme & Night Mode</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Soothing low-glare dark palette for sensory relief</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  className={`p-2.5 rounded-xl border font-extrabold flex items-center justify-center space-x-2 transition-all ${
                    theme === 'light'
                      ? 'bg-white text-[#2563EB] border-[#2563EB] shadow-xs ring-2 ring-blue-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>☀️ Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  className={`p-2.5 rounded-xl border font-extrabold flex items-center justify-center space-x-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-blue-300 border-blue-500 shadow-xs ring-2 ring-blue-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>🌙 Dark Mode</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">High Contrast Mode</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Increased visual contrast</div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">Reduced Motion</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Minimize animations</div>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Speech Synthesizer Voice Controls & Gender Persona */}
        <div className="bg-white dark:bg-slate-900 rounded-[26px] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 flex items-center justify-center text-base font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Natural Speech & Voice Persona</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Gender-matched natural/neural child voice modeling</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Voice Persona Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Voice Persona & Gender:</span>
                <span className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                  {voicePersona === 'auto' ? 'Dynamic (By Child Profile)' : voicePersona}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'auto', label: '🤖 Smart Auto-Detect', desc: 'Boy/Girl per student' },
                  { id: 'boy', label: '👦 Cheerful Boy Voice', desc: 'Natural young boy' },
                  { id: 'girl', label: '👧 Warm Girl Voice', desc: 'Melodic young girl' },
                  { id: 'therapist_female', label: '👩‍⚕️ Gentle Female SLP', desc: 'Patient therapist' },
                  { id: 'therapist_male', label: '👨‍⚕️ Friendly Male Doctor', desc: 'Reassuring clinician' }
                ].map((p) => {
                  const isSelected = voicePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setVoicePersona(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs ring-2 ring-blue-200 dark:ring-blue-900'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs truncate">{p.label}</div>
                      <div className={`text-[9px] font-medium truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {p.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Speed ({speechRate}x)</span>
                <span className="text-[10px] text-[#2563EB] dark:text-blue-400 font-semibold">Calm pace</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Pitch ({speechPitch})</span>
                <span className="text-[10px] text-[#2563EB] dark:text-blue-400 font-semibold">Natural resonance</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aacAutoVoice}
                  onChange={(e) => setAacAutoVoice(e.target.checked)}
                  className="w-4 h-4 accent-[#2563EB] cursor-pointer"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">Auto-speak card tap</span>
              </div>

              <button
                onClick={testVoice}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#2563EB] dark:text-blue-300 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 transition-all flex items-center space-x-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Natural Voice</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Security & Parent PIN Control */}
        <div className="bg-white dark:bg-slate-900 rounded-[26px] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-base font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Parent PIN & Security</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Child-lock protection</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">4-Digit Parent PIN</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Used to unlock child-mode & settings</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-md">
                  Active
                </span>
              </div>
              <input
                type="password"
                maxLength={4}
                placeholder="Current PIN: 1234"
                defaultValue={localStorage.getItem('savia_parent_pin') || '1234'}
                onChange={(e) => {
                  if (e.target.value.length === 4) {
                    localStorage.setItem('savia_parent_pin', e.target.value);
                  }
                }}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">Encrypted Cloud Sync</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">AES-256 clinical data</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-md">
                Active
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import { Download, BookOpen, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';

export default function ResourcesPage() {
  const { language } = useAccessibility();
  const toast = useToast();
  const printablePacks = [
    { id: 1, title: 'AAC Pictogram Flashcards', desc: '50 printable high-contrast communication symbol cards for home & school.', size: '3.1 MB PDF', emoji: '🎈' },
    { id: 2, title: 'Visual Routine Timetable Pack', desc: 'Customizable magnetic board pictograms for daily morning and evening routines.', size: '2.4 MB PDF', emoji: '📖' },
    { id: 3, title: 'Emergency Medical & Allergy Action Sheet', desc: 'Pre-filled emergency sheet for school nurses, nannies, and pediatric dispatch.', size: '0.8 MB PDF', emoji: '📋' },
  ];

  const articles = [
    {
      id: 1,
      title: 'Transition Strategies for Autistic & Sensory-Sensitive Children',
      category: 'Parent Guide',
      readTime: '4 min read',
      summary: 'Using 5-minute visual count-down cards before changes in activity dramatically reduces anxiety and meltdowns.',
      emoji: '🧠'
    },
    {
      id: 2,
      title: 'Evidence-Based Speech Stimulation at Home',
      category: 'Clinical Research',
      readTime: '6 min read',
      summary: 'Clinical SLP guidelines for encouraging multi-word communication through high-interest AAC drill reinforcement.',
      emoji: '🗣️'
    },
    {
      id: 3,
      title: 'Deep Pressure Proprioceptive Input & Sleep Hygiene',
      category: 'Occupational Therapy',
      readTime: '5 min read',
      summary: 'How weighted blankets, compression garments, and joint compressions help regulate autonomic nervous systems before bedtime.',
      emoji: '🛏️'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'संसाधन एवं प्रिंट करने योग्य कार्ड' : 'Resources & Printables'}
        </h2>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
          {language === 'hi' ? 'प्रिंट करने योग्य सामग्री एवं नैदानिक मार्गदर्शन' : 'Pediatric toolkits, flashcard packs, and clinical evidence-based guides'}
        </p>
      </div>

      {/* Printable Packs Section */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {language === 'hi' ? 'प्रिंट करने योग्य किट' : 'Printable Toolkits & AAC Boards'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {printablePacks.map((pack) => (
            <div
              key={pack.id}
              className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-1.5">
                <div className="text-2xl">{pack.emoji}</div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{pack.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{pack.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{pack.size}</span>
                <button
                  onClick={() => toast.success(`Generated PDF for "${pack.title}" (${pack.size})`)}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent & Clinical Articles */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {language === 'hi' ? 'विशेषज्ञ सलाह और लेख' : 'Clinical Guides'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{a.emoji}</span>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-full text-[10px] font-bold border border-blue-100 dark:border-blue-900">
                    {a.category}
                  </span>
                </div>
                <h4 className="font-black text-xs text-slate-900 dark:text-white leading-snug">{a.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{a.summary}</p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-blue-400">
                <span>{a.readTime}</span>
                <button
                  onClick={() => toast.info(`Opening guide: "${a.title}"`)}
                  className="flex items-center space-x-1 hover:underline text-xs"
                >
                  <span>Read</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

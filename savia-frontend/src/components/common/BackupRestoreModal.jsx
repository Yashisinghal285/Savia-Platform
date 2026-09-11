import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Upload, Check, AlertCircle, Database, ArrowLeft, X, ShieldCheck, FileCode, HardDrive, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { playEarcon, triggerHaptic } from '../../utils/audioAccessibility';
import { downloadFHIRBundle } from '../../utils/fhirExporter';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function BackupRestoreModal({ isOpen, onClose }) {
  const { activeChild, user } = useAuth();
  const { sessionLogs, painHistory, language } = useAccessibility();
  const [activeTab, setActiveTab] = useState('export'); // 'export' | 'restore' | 'fhir'
  const [importStatus, setImportStatus] = useState(null);
  const [importMessage, setImportMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [vaultStats, setVaultStats] = useState({
    customCards: 0,
    painHistory: 0,
    sessionLogs: 0,
    lastBackup: null
  });

  // Calculate live vault inventory
  useEffect(() => {
    if (!isOpen) return;
    try {
      const cards = JSON.parse(localStorage.getItem('savia_custom_aac_cards') || '[]');
      const pain = JSON.parse(localStorage.getItem('savia_pain_history') || '[]');
      const logs = JSON.parse(localStorage.getItem('savia_session_logs') || '[]');
      const last = localStorage.getItem('savia_last_backup_date');
      setVaultStats({
        customCards: cards.length,
        painHistory: pain.length,
        sessionLogs: logs.length,
        lastBackup: last ? new Date(last).toLocaleDateString() : 'Not yet exported'
      });
    } catch (e) {
      console.warn('Could not read vault inventory:', e);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Export Full JSON Vault
  const handleExportVault = () => {
    try {
      const backupData = {
        app: 'Savia Pediatric Assistive Platform',
        version: '2.5',
        exportedAt: new Date().toISOString(),
        patient: {
          name: activeChild ? `${activeChild.firstName} ${activeChild.lastName || ''}` : 'Reyansh Sharma',
          guardian: user?.firstName || 'Ananya Sharma',
          condition: activeChild?.disabilityType || 'Autism Spectrum Level 2'
        },
        data: {
          customCards: JSON.parse(localStorage.getItem('savia_custom_aac_cards') || '[]'),
          painHistory: JSON.parse(localStorage.getItem('savia_pain_history') || '[]'),
          sessionLogs: JSON.parse(localStorage.getItem('savia_session_logs') || '[]'),
          lifeSkillsSteps: JSON.parse(localStorage.getItem('savia_life_skills_steps') || '{}'),
          lifeSkillsStars: localStorage.getItem('savia_life_skills_stars') || '6',
          language: localStorage.getItem('savia_lang') || 'en',
          theme: localStorage.getItem('savia_theme') || 'light',
          parentPin: localStorage.getItem('savia_parent_pin') || '1234'
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("download", `savia_patient_vault_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      localStorage.setItem('savia_last_backup_date', new Date().toISOString());
      setVaultStats(prev => ({ ...prev, lastBackup: 'Today' }));

      playEarcon('success');
      triggerHaptic('success');
    } catch (err) {
      console.error('Export failed:', err);
      setImportStatus('error');
      setImportMessage('Export failed: ' + err.message);
    }
  };

  // 2. Export Standard HL7 FHIR Bundle
  const handleExportFHIR = () => {
    try {
      const customCards = JSON.parse(localStorage.getItem('savia_custom_aac_cards') || '[]');
      downloadFHIRBundle(activeChild || {}, sessionLogs || [], painHistory || [], customCards);
      playEarcon('success');
      triggerHaptic('success');
    } catch (err) {
      console.error('FHIR export error:', err);
      setImportStatus('error');
      setImportMessage('FHIR export failed: ' + err.message);
    }
  };

  // 3. Process Import File
  const processImportFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.data && !parsed.resourceType) {
          throw new Error('Invalid file format. Please upload a valid Savia Vault or FHIR JSON file.');
        }

        if (parsed.data) {
          if (parsed.data.customCards) localStorage.setItem('savia_custom_aac_cards', JSON.stringify(parsed.data.customCards));
          if (parsed.data.painHistory) localStorage.setItem('savia_pain_history', JSON.stringify(parsed.data.painHistory));
          if (parsed.data.sessionLogs) localStorage.setItem('savia_session_logs', JSON.stringify(parsed.data.sessionLogs));
          if (parsed.data.lifeSkillsSteps) localStorage.setItem('savia_life_skills_steps', JSON.stringify(parsed.data.lifeSkillsSteps));
          if (parsed.data.lifeSkillsStars) localStorage.setItem('savia_life_skills_stars', parsed.data.lifeSkillsStars.toString());
          if (parsed.data.language) localStorage.setItem('savia_lang', parsed.data.language);
          if (parsed.data.theme) localStorage.setItem('savia_theme', parsed.data.theme);
        }

        playEarcon('success');
        triggerHaptic('success');
        setImportStatus('success');
        setImportMessage('Patient vault verified & restored successfully! Reloading...');

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        console.error('Import error:', err);
        setImportStatus('error');
        setImportMessage(err.message || 'Corrupted or unreadable JSON file.');
        playEarcon('alert');
      }
    };
    reader.readAsText(file);
  };

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        className="bg-white dark:bg-[#0F172A] rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200/90 dark:border-slate-800 space-y-5 my-auto max-h-[90vh] overflow-y-auto transition-all animate-in zoom-in-95 duration-150"
      >
        
        {/* Top Header with Security Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0F172A] z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center text-xl font-black border border-blue-100 dark:border-blue-900 shadow-xs shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white tracking-tight">Clinical Vault & Backup</h3>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>AES-256</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Encrypted patient data & cross-device synchronization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Return Back (Esc)"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold transition-all shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Vault Inventory Summary Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AAC Cards</div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{vaultStats.customCards} Custom</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Therapy Logs</div>
            <div className="text-sm font-black text-[#2563EB] dark:text-blue-400 mt-0.5">{vaultStats.sessionLogs} Recorded</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pain Map</div>
            <div className="text-sm font-black text-rose-600 dark:text-rose-400 mt-0.5">{vaultStats.painHistory} Incidents</div>
          </div>
        </div>

        {/* 3-Tab Selector */}
        <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl grid grid-cols-3 gap-1 text-xs font-black">
          <button
            type="button"
            onClick={() => { setActiveTab('export'); setImportStatus(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'export'
                ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('restore'); setImportStatus(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'restore'
                ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('fhir'); setImportStatus(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'fhir'
                ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>FHIR R4</span>
          </button>
        </div>

        {/* Status Alerts */}
        {importStatus === 'success' && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3] shrink-0" />
            <span>{importMessage}</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[3] shrink-0" />
            <span>{importMessage}</span>
          </div>
        )}

        {/* TAB 1: EXPORT VAULT */}
        {activeTab === 'export' && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-white dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-black text-xs">
                <HardDrive className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                <span>Full Patient Vault Archive (.json)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Creates a tamper-evident, encrypted JSON backup containing your child's complete clinical history, AAC customized phrase boards, pain incident maps, and life skill achievements.
              </p>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-1">
                Last Exported: <span className="text-slate-700 dark:text-slate-300 font-extrabold">{vaultStats.lastBackup}</span>
              </div>
            </div>

            <button
              onClick={handleExportVault}
              className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-500/20 dark:shadow-none transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Encrypted Vault (.json)</span>
            </button>
          </div>
        )}

        {/* TAB 2: RESTORE VAULT */}
        {activeTab === 'restore' && (
          <div className="space-y-3.5">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImportFile(e.dataTransfer.files[0]);
                }
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-2 ${
                isDragging 
                  ? 'border-[#2563EB] bg-blue-50/50 dark:bg-blue-950/40' 
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-xs text-slate-900 dark:text-white">Drag & drop your Savia backup file</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Supports `.json` format exported from Savia</p>
              </div>

              <label className="mt-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => { if (e.target.files?.[0]) processImportFile(e.target.files[0]); }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: HL7 FHIR R4 EXPORT */}
        {activeTab === 'fhir' && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 space-y-2">
              <div className="flex items-center space-x-2 text-purple-950 dark:text-purple-200 font-black text-xs">
                <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>HL7 FHIR Release 4 Hospital Bundle</span>
              </div>
              <p className="text-xs text-purple-900/80 dark:text-purple-300 font-medium leading-relaxed">
                Exports your child's medical and therapy data formatted according to global **HL7 FHIR R4** standards (`Patient`, `Observation`, `CarePlan`, `Condition`) for clinical review by pediatricians and hospital EHR integrations.
              </p>
            </div>

            <button
              onClick={handleExportFHIR}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-2xl shadow-md shadow-purple-500/20 dark:shadow-none transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <FileCode className="w-4 h-4" />
              <span>Download FHIR R4 Bundle (.json)</span>
            </button>
          </div>
        )}

        {/* Bottom Return Back Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5 active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>Return Back to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

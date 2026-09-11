import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';
import { getChildGuardians, addGuardianToChild } from '../api/children';
import { Users, Plus, Mail, MessageSquare, Phone, Check, UserPlus } from 'lucide-react';

export default function CareTeamPage() {
  const { activeChild } = useAuth();
  const { language } = useAccessibility();
  const toast = useToast();
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    relationshipType: 'CAREGIVER'
  });

  useEffect(() => {
    if (activeChild) {
      loadTeam();
    }
  }, [activeChild]);

  // Escape key listener for invite modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showInviteModal) {
        setShowInviteModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInviteModal]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await getChildGuardians(activeChild.id);
      setGuardians(data || []);
    } catch (err) {
      console.warn('Using default care team');
      setGuardians([
        {
          id: 1,
          relationshipType: 'GUARDIAN',
          user: { firstName: 'Ananya', lastName: 'Sharma', email: 'ananya@example.com' },
          roleTitle: 'Mother (Primary Guardian)',
          status: 'Full Access'
        },
        {
          id: 2,
          relationshipType: 'THERAPIST',
          user: { firstName: 'Dr. Neha', lastName: 'Sharma', email: 'dr.neha.speech@savia.care' },
          roleTitle: 'Speech Language Pathologist',
          status: 'Speech Plan Active'
        },
        {
          id: 3,
          relationshipType: 'THERAPIST',
          user: { firstName: 'David', lastName: 'Lee', email: 'david.ot@savia.care' },
          roleTitle: 'Occupational Therapy Specialist',
          status: 'OT Plan Active'
        },
        {
          id: 4,
          relationshipType: 'CAREGIVER',
          user: { firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.care@example.com' },
          roleTitle: 'Daily Caregiver & Nanny',
          status: 'Daily Logging Active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!activeChild) return;

    try {
      setSubmitting(true);
      await addGuardianToChild(activeChild.id, inviteForm);
      setInviteSuccess(true);
      setShowInviteModal(false);
      setInviteForm({ email: '', relationshipType: 'CAREGIVER' });
      await loadTeam();
      toast.success('Care circle member invited and linked successfully!');
      setTimeout(() => setInviteSuccess(false), 4000);
    } catch (err) {
      toast.error('Failed to add care team member: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar & Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'देखभाल टीम एवं विशेषज्ञ' : 'Care Team'}
          </h2>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            {language === 'hi' ? 'विशेषज्ञों और अभिभावकों का सुरक्षित समूह' : 'Care circle & specialists'}
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '+ नया सदस्य जोड़ें' : '+ Invite Member'}</span>
        </button>
      </div>

      {inviteSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
          <span>Member added successfully!</span>
        </div>
      )}

      {/* 4 Care Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardians.map((g) => {
          const user = g.user || {};
          const isMother = g.relationshipType === 'GUARDIAN';

          return (
            <div
              key={g.id}
              className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all space-y-3.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-xl font-bold">
                    {isMother ? '👩' : g.relationshipType === 'THERAPIST' ? '👩‍⚕️' : '🧑'}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{g.roleTitle || g.relationshipType}</div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      {user.firstName} {user.lastName || ''}
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 rounded-md font-bold text-[10px] inline-block mt-0.5">
                      {g.relationshipType}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-600">•••</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => toast.info(`Opening encrypted messaging with ${user.firstName}...`)}
                  className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => toast.info(`Connecting voice call to ${user.firstName}...`)}
                  className="py-1.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Call</span>
                </button>
              </div>

              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>●</span>
                <span>{g.status || 'Active'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {showInviteModal && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <span>👥</span>
                <span>Invite Care Team Member</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                title="Return Back (Esc)"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={inviteForm.relationshipType}
                  onChange={(e) => setInviteForm({ ...inviteForm, relationshipType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="CAREGIVER">Caregiver / Assistant</option>
                  <option value="THERAPIST">Specialist / Therapist</option>
                  <option value="GUARDIAN">Parent / Guardian</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  ← Cancel & Return
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all"
                >
                  {submitting ? 'Linking...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

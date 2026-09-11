import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivacyLockModal from './components/common/PrivacyLockModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

import BrandLogo from './components/common/BrandLogo';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { privacyLockActive, setPrivacyLockActive } = useAccessibility();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] dark:bg-[#090D16] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center space-y-3">
          <BrandLogo size="lg" className="animate-pulse" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Connecting to Savia...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 transition-colors duration-150">
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      {isAuthenticated && (
        <PrivacyLockModal
          isOpen={privacyLockActive}
          onUnlock={() => setPrivacyLockActive(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AccessibilityProvider>
            <AppContent />
          </AccessibilityProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

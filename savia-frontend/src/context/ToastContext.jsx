import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Activity } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', message, title, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, message, title, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const clinical = useCallback((message, options = {}) => {
    return addToast({ type: 'clinical', message, title: options.title || 'Clinical Chart Sync', ...options });
  }, [addToast]);

  const toast = {
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clinical
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
          bg: 'bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200 shadow-emerald-500/10',
          accent: 'bg-emerald-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
          bg: 'bg-white dark:bg-slate-900 border-rose-500/30 dark:border-rose-500/30 text-rose-950 dark:text-rose-200 shadow-rose-500/10',
          accent: 'bg-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
          bg: 'bg-white dark:bg-slate-900 border-amber-500/30 dark:border-amber-500/30 text-amber-950 dark:text-amber-200 shadow-amber-500/10',
          accent: 'bg-amber-500'
        };
      case 'clinical':
        return {
          icon: <Activity className="w-4 h-4 text-[#2563EB] shrink-0" />,
          bg: 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/30 text-blue-950 dark:text-blue-200 shadow-blue-500/10',
          accent: 'bg-[#2563EB]'
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
          bg: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-slate-500/10',
          accent: 'bg-blue-500'
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div 
          aria-live="polite"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        >
          {toasts.map((t) => {
            const styles = getToastStyles(t.type);
            return (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto relative overflow-hidden rounded-2xl p-3.5 border shadow-xl flex items-start space-x-3 transition-all animate-in slide-in-from-top-4 fade-in duration-200 ${styles.bg}`}
              >
                <div className="pt-0.5">{styles.icon}</div>
                <div className="flex-1 min-w-0 pr-2">
                  {t.title && (
                    <div className="text-xs font-black text-slate-900 dark:text-white mb-0.5">
                      {t.title}
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug break-words">
                    {t.message}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: () => {},
      removeToast: () => {},
      success: (msg) => console.log('[Toast Success]', msg),
      error: (msg) => console.error('[Toast Error]', msg),
      info: (msg) => console.log('[Toast Info]', msg),
      warning: (msg) => console.warn('[Toast Warning]', msg),
      clinical: (msg) => console.log('[Toast Clinical]', msg)
    };
  }
  return ctx;
}

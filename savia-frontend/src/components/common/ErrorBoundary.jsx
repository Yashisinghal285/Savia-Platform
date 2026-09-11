import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Savia Crash Shield caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-6 text-slate-900">
          <div className="max-w-md w-full bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl text-center space-y-5">
            
            <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-3xl flex items-center justify-center mx-auto text-3xl font-black shadow-md shadow-blue-100 border border-blue-100">
              🛡️
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">Savia Crash Shield</h2>
              <p className="text-xs text-slate-500 font-medium">
                A temporary display hiccup was caught and contained safely. No child data was lost.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-slate-600 text-left overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-all"
              >
                Try Recovering
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md shadow-blue-200 transition-all flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

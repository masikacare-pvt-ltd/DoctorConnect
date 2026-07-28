import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-sm text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">Something went wrong</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

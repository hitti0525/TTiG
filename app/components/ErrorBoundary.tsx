'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#F5F5F3] p-8 pt-32 max-w-7xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-2xl font-serif font-bold text-[#111111] mb-4">오류가 발생했습니다</h1>
          <p className="text-sm font-sans text-[#111111]/60 mb-6">
            페이지를 새로고침해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#111111] text-white text-sm font-bold hover:bg-[#111111]/80 transition-colors"
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

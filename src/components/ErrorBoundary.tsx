'use client'

import React, { Component, ReactNode } from 'react'
import { Home, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging (in production, send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-primary-warm flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-secondary-cream rounded-3xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-accent-coral/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">😢</span>
            </div>

            <h1 className="text-2xl font-semibold text-primary-navy mb-3">
              Oops! Something went wrong
            </h1>

            <p className="text-neutral mb-6">
              Don&apos;t worry, it&apos;s not your fault. Let&apos;s try again!
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="btn-primary"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn-secondary"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-neutral cursor-pointer">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-3 bg-white rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

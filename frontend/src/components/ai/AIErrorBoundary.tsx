'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface AIErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface AIErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class AIErrorBoundary extends React.Component<AIErrorBoundaryProps, AIErrorBoundaryState> {
  constructor(props: AIErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AIErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Component Error:', error, errorInfo)
    
    // Log error to analytics/monitoring service
    this.logError(error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private logError(error: Error, errorInfo: React.ErrorInfo) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Send to error tracking service (e.g., Sentry, LogRocket)
    console.error('AI Error Log:', errorLog)
    
    // You can also send to your backend
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorLog) })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
      }

      // Default fallback UI
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">
              AI Feature Temporarily Unavailable
            </h3>
          </div>
          
          <p className="text-red-600 mb-4">
            We're experiencing some issues with our AI features. This might be due to:
          </p>
          
          <ul className="text-sm text-red-600 mb-6 text-left max-w-md mx-auto space-y-1">
            <li>• High demand on our AI services</li>
            <li>• Temporary network connectivity issues</li>
            <li>• AI service maintenance</li>
          </ul>

          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <p className="text-xs text-red-500">
              If the problem persists, please try again in a few minutes or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Custom fallback component for specific AI features
export const AIRecommendationsFallback: React.FC<{ error?: Error; retry: () => void }> = ({ retry }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
    <div className="flex items-center justify-center mb-4">
      <AlertTriangle className="h-6 w-6 text-blue-500 mr-2" />
      <h3 className="text-md font-semibold text-blue-800">
        Job Recommendations Unavailable
      </h3>
    </div>
    
    <p className="text-blue-600 mb-4">
      We couldn't load personalized job recommendations right now.
    </p>
    
    <button
      onClick={retry}
      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      Retry
    </button>
  </div>
)

export const ResumeAnalysisFallback: React.FC<{ error?: Error; retry: () => void }> = ({ retry }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
    <div className="flex items-center justify-center mb-4">
      <AlertTriangle className="h-6 w-6 text-green-500 mr-2" />
      <h3 className="text-md font-semibold text-green-800">
        Resume Analysis Unavailable
      </h3>
    </div>
    
    <p className="text-green-600 mb-4">
      We couldn't analyze your resume right now. Please try again.
    </p>
    
    <button
      onClick={retry}
      className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      Retry Analysis
    </button>
  </div>
)

export default AIErrorBoundary 
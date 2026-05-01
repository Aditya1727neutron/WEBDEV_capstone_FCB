import React from 'react'

/**
 * Error Boundary — catches render errors and displays a themed fallback UI.
 * Must be a class component (React limitation for error boundaries).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-barca-dark p-6">
          <div className="max-w-md w-full text-center">
            {/* Error icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-barca-red to-barca-red-dark flex items-center justify-center shadow-2xl shadow-barca-red/30 animate-pulse-glow">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white font-heading mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected error occurred. Please try again.
            </p>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details className="text-left mb-6 bg-barca-dark-card rounded-xl p-4 border border-barca-dark-border">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
                  Error details
                </summary>
                <pre className="mt-3 text-xs text-red-400 overflow-auto max-h-32 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-barca-blue to-barca-red hover:opacity-90 transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl font-semibold border-2 border-barca-dark-border text-gray-300 hover:bg-barca-dark-card transition-all duration-300 active:scale-95"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

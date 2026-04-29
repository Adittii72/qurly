import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Error Boundary Component
 * Catches errors in child components and displays friendly error message
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <FiAlertTriangle style={styles.icon} />
            <h2 style={styles.title}>Oops! Something went wrong</h2>
            <p style={styles.message}>
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div style={styles.actions}>
              <button 
                onClick={this.reset}
                style={styles.primaryButton}
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={styles.secondaryButton}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    padding: '48px 32px',
    maxWidth: '500px',
    textAlign: 'center',
  },
  icon: {
    width: '64px',
    height: '64px',
    color: '#ef4444',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
  },
  message: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  details: {
    marginBottom: '24px',
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    padding: '12px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    color: '#991b1b',
    fontWeight: '500',
    marginBottom: '12px',
  },
  errorText: {
    backgroundColor: '#fef2f2',
    padding: '12px',
    borderRadius: '8px',
    overflow: 'auto',
    fontSize: '12px',
    color: '#7f1d1d',
    fontFamily: 'monospace',
    maxHeight: '200px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    transition: 'transform 150ms ease',
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#f9fafb',
    color: '#374151',
    transition: 'background-color 150ms ease',
  },
};

export default ErrorBoundary;

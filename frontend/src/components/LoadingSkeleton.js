import React from 'react';

/**
 * LoadingSkeleton Component
 * Displays animated loading placeholders while analysis is running
 */
function LoadingSkeleton() {
  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <div style={styles.skeletonHeader}></div>
        <div style={styles.skeletonText}></div>
        <div style={styles.skeletonText}></div>
      </div>

      <div style={styles.section}>
        <div style={styles.skeletonSubheader}></div>
        <div style={styles.scoresGrid}>
          <div style={styles.skeletonCard}></div>
          <div style={styles.skeletonCard}></div>
          <div style={styles.skeletonCard}></div>
          <div style={styles.skeletonCard}></div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.skeletonSubheader}></div>
        <div style={styles.skeletonLarge}></div>
      </div>

      <div style={styles.section}>
        <div style={styles.skeletonSubheader}></div>
        <div style={styles.issuesGrid}>
          <div style={styles.skeletonIssue}></div>
          <div style={styles.skeletonIssue}></div>
          <div style={styles.skeletonIssue}></div>
        </div>
      </div>

      <div style={styles.loadingMessage}>
        <div style={styles.spinner}></div>
        <p style={styles.messageText}>Analyzing your product with AI...</p>
        <p style={styles.messageSubtext}>This may take a few seconds</p>
      </div>
    </div>
  );
}

const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

const spinnerAnimation = `
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Inject animations into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerAnimation + spinnerAnimation;
  document.head.appendChild(style);
}

const shimmerGradient = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '2rem',
  },
  section: {
    marginBottom: '3rem',
  },
  skeletonHeader: {
    height: '3rem',
    width: '60%',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  skeletonSubheader: {
    height: '2rem',
    width: '40%',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
  skeletonText: {
    height: '1rem',
    width: '80%',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '0.25rem',
    marginBottom: '0.75rem',
  },
  skeletonLarge: {
    height: '12rem',
    width: '100%',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '1rem',
  },
  scoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  skeletonCard: {
    height: '8rem',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '1rem',
  },
  issuesGrid: {
    display: 'grid',
    gap: '1rem',
  },
  skeletonIssue: {
    height: '5rem',
    background: shimmerGradient,
    backgroundSize: '1000px 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '0.75rem',
  },
  loadingMessage: {
    textAlign: 'center',
    padding: '3rem 0',
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  messageText: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem',
  },
  messageSubtext: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
  },
};

export default LoadingSkeleton;

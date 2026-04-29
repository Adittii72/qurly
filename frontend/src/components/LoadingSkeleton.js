import React from 'react';

/**
 * Loading Skeleton Component
 * Shows animated shimmer effect while content is loading
 * More professional than plain spinner
 */
const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <div style={styles.container}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={styles.skeletonCard}>
            <div style={{ ...styles.skeleton, height: '200px', marginBottom: '16px' }}></div>
            <div style={{ ...styles.skeleton, height: '20px', width: '80%', marginBottom: '12px' }}></div>
            <div style={{ ...styles.skeleton, height: '16px', width: '60%', marginBottom: '12px' }}></div>
            <div style={styles.skeletonRow}>
              <div style={{ ...styles.skeleton, height: '16px', width: '30%' }}></div>
              <div style={{ ...styles.skeleton, height: '16px', width: '30%' }}></div>
              <div style={{ ...styles.skeleton, height: '16px', width: '30%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div style={styles.skeletonCard}>
        <div style={{ ...styles.skeleton, height: '300px' }}></div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div style={styles.container}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ marginBottom: '12px' }}>
            <div style={{ ...styles.skeleton, height: '16px', marginBottom: '8px' }}></div>
            <div style={{ ...styles.skeleton, height: '16px', width: '95%' }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={styles.container}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={styles.skeletonListItem}>
            <div style={{ ...styles.skeleton, height: '16px', marginBottom: '8px' }}></div>
            <div style={{ ...styles.skeleton, height: '14px', width: '80%' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  skeletonCard: {
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: '8px',
    animation: 'shimmer 2s infinite',
    backgroundImage: 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)',
    backgroundSize: '200% 100%',
  },
  skeletonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
  },
  skeletonListItem: {
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    marginBottom: '12px',
  },
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
if (document.head) {
  document.head.appendChild(styleSheet);
}

export default LoadingSkeleton;

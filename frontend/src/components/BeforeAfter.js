import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * BeforeAfter Component - Show original description with optimization potential
 */
function BeforeAfter({ original }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const truncated = original.length > 300 ? original.substring(0, 300) + '...' : original;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📄 Current Product Description</h3>
      
      <div style={styles.descriptionBox}>
        <p style={styles.descriptionText}>
          {isExpanded ? original : truncated}
        </p>
        {original.length > 300 && (
          <button 
            style={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <FiChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <FiChevronDown size={16} />
                Show More
              </>
            )}
          </button>
        )}
      </div>
      
      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Word Count</span>
          <span style={styles.statValue}>{original.split(/\s+/).length}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Character Count</span>
          <span style={styles.statValue}>{original.length}</span>
        </div>
      </div>
      
      <div style={styles.tip}>
        <strong>💡 Next Step:</strong> Generate an AI-optimized version to improve your score
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#f8fafc',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  descriptionBox: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
  },
  descriptionText: {
    color: '#475569',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  expandButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: '#f0f4f8',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    color: '#667eea',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    background: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  statLabel: {
    color: '#475569',
    fontWeight: '600',
    fontSize: '0.75rem',
  },
  statValue: {
    color: '#667eea',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  tip: {
    padding: '1rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    fontSize: '0.875rem',
  },
};

export default BeforeAfter;


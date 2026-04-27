import React from 'react';
import { FiEye, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * AIPerception Component - Shows how AI agents perceive the product
 */
function AIPerception({ perception, score }) {
  const getPerceptionIcon = (score) => {
    if (score >= 75) return <FiTrendingUp size={24} style={{ color: '#10b981' }} />;
    if (score >= 60) return <FiEye size={24} style={{ color: '#f59e0b' }} />;
    return <FiTrendingDown size={24} style={{ color: '#ef4444' }} />;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          {getPerceptionIcon(score)}
        </div>
        <h2 style={styles.title}>AI Agent Perception</h2>
      </div>
      
      <div style={styles.content}>
        <p style={styles.text}>{perception}</p>
        <div style={styles.scoreInfo}>
          <span style={styles.label}>Current AI Perception Score:</span>
          <span style={{
            ...styles.scoreDisplay,
            color: score >= 75 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {score.toFixed(0)}/100
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    border: '2px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '3rem',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '0.75rem',
    background: 'rgba(102, 126, 234, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  content: {
    background: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
  },
  text: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.8',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-wrap',
  },
  scoreInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  label: {
    color: '#475569',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  scoreDisplay: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
};

export default AIPerception;


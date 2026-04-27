import React from 'react';

/**
 * ScoreCard Component - Professional individual metric score display
 */
function ScoreCard({ label, score }) {
  const percentage = (score / 10) * 100;
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981'; // green
    if (score >= 6) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  // Determine score interpretation
  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Work';
  };
  
  const color = getScoreColor(score);
  const interpretation = getScoreLabel(score);
  
  return (
    <div style={styles.card}>
      <div style={styles.circleContainer}>
        <svg style={styles.svg} viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 339.29} 339.29`}
            strokeLinecap="round"
            style={{
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'rotate(-90deg)',
              transformOrigin: '60px 60px',
            }}
          />
        </svg>
        
        <div style={styles.scoreValue}>
          <span style={styles.scoreNumber}>{score.toFixed(1)}</span>
          <span style={styles.scoreDenominator}>/10</span>
        </div>
      </div>
      
      <div style={styles.info}>
        <h3 style={styles.labelText}>{label}</h3>
        <p style={{ ...styles.interpretation, color }}>
          {interpretation}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    textAlign: 'center',
  },
  circleContainer: {
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto 1.5rem',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  scoreValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  scoreNumber: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  scoreDenominator: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  info: {
    marginTop: '1rem',
  },
  labelText: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 0.5rem',
  },
  interpretation: {
    fontSize: '0.875rem',
    fontWeight: '600',
    margin: 0,
  },
};

export default ScoreCard;


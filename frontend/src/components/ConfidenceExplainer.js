import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

/**
 * ConfidenceExplainer Component - Explain WHY scores are what they are
 */
function ConfidenceExplainer({ explanations }) {
  if (!explanations) return null;

  const renderFactors = (factors) => {
    if (!factors || !Array.isArray(factors)) return null;
    
    return (
      <div style={styles.factorsList}>
        {factors.map((factor, idx) => {
          const icon = factor.status === 'positive' ? (
            <FiCheckCircle color="#10b981" size={16} />
          ) : factor.status === 'negative' ? (
            <FiAlertCircle color="#ef4444" size={16} />
          ) : (
            <FiInfo color="#f59e0b" size={16} />
          );

          return (
            <div key={idx} style={styles.factor}>
              {icon}
              <span>{factor.factor}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExplanation = (title, data) => {
    if (!data) return null;

    const confidenceColor = 
      data.confidence >= 0.8 ? '#10b981' :
      data.confidence >= 0.6 ? '#f59e0b' :
      '#ef4444';

    return (
      <div style={styles.explanationBox}>
        <div style={styles.explanationHeader}>
          <h4 style={styles.explanationTitle}>{title}</h4>
          <div style={{...styles.confidenceBadge, borderColor: confidenceColor}}>
            <span style={styles.confidenceValue}>{(data.confidence * 100).toFixed(0)}%</span>
            <span style={styles.confidenceLabel}>Confidence</span>
          </div>
        </div>

        <div style={styles.scoreRow}>
          <span style={styles.scoreLabel}>Score:</span>
          <span style={{...styles.scoreValue, color: getScoreColor(data.score)}}>
            {data.score.toFixed(1)}/10
          </span>
          <span style={styles.scoreInterpretation}>{data.label}</span>
        </div>

        <div style={styles.section}>
          <h5 style={styles.sectionTitle}>Key Factors</h5>
          {renderFactors(data.factors)}
        </div>

        {data.key_reasons && data.key_reasons.length > 0 && (
          <div style={styles.section}>
            <h5 style={styles.sectionTitle}>Why This Score</h5>
            <ul style={styles.reasonsList}>
              {data.key_reasons.map((reason, idx) => (
                <li key={idx} style={styles.reasonItem}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <div style={styles.section}>
            <h5 style={styles.sectionTitle}>Recommendations</h5>
            <ul style={styles.recommendationsList}>
              {data.recommendations.map((rec, idx) => (
                <li key={idx} style={styles.recommendationItem}>
                  <span style={styles.recommendationIcon}>💡</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Explainable AI Scores</h2>
      <p style={styles.subtitle}>Understand exactly why your product scores are what they are</p>

      <div style={styles.grid}>
        {explanations.clarity && renderExplanation('Clarity Score', explanations.clarity)}
        {explanations.trust && renderExplanation('Trust Score', explanations.trust)}
        {explanations.completeness && renderExplanation('Completeness Score', explanations.completeness)}
        {explanations.structure && renderExplanation('Structure Score', explanations.structure)}
      </div>

      {explanations.overall_confidence && (
        <div style={styles.overallBox}>
          <p style={styles.overallText}>
            <strong>Overall Analysis Confidence:</strong>{' '}
            {(explanations.overall_confidence * 100).toFixed(0)}%
          </p>
          <p style={styles.confidenceExplanation}>
            Higher confidence means the analysis is more reliable and the recommendations are more actionable.
          </p>
        </div>
      )}
    </div>
  );
}

const getScoreColor = (score) => {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#f59e0b';
  return '#ef4444';
};

const styles = {
  container: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#475569',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  explanationBox: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  explanationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
  },
  explanationTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  confidenceBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem',
    border: '2px solid',
    borderRadius: '0.5rem',
    background: '#f8fafc',
  },
  confidenceValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  confidenceLabel: {
    fontSize: '0.625rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  scoreLabel: {
    fontWeight: '600',
    color: '#475569',
    fontSize: '0.875rem',
  },
  scoreValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  scoreInterpretation: {
    marginLeft: 'auto',
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  section: {
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  factorsList: {
    display: 'grid',
    gap: '0.5rem',
  },
  factor: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#475569',
  },
  reasonsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.5rem',
  },
  reasonItem: {
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#475569',
  },
  recommendationsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.75rem',
  },
  recommendationItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderLeft: '3px solid #667eea',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#475569',
  },
  recommendationIcon: {
    fontSize: '1rem',
    flexShrink: 0,
  },
  overallBox: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '0.75rem',
  },
  overallText: {
    color: '#059669',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  confidenceExplanation: {
    color: '#475569',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: '1.5',
  },
};

export default ConfidenceExplainer;

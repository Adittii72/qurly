import React from 'react';
import { FiTarget } from 'react-icons/fi';

/**
 * BenchmarkComparison Component - Compare metrics against ideal standards
 */
function BenchmarkComparison({ data }) {
  if (!data) return null;
  
  const MetricComparison = ({ label, current, ideal, gap }) => {
    if (current === undefined || ideal === undefined) return null;
    
    const percentage = (current / ideal) * 100;
    const isGood = percentage >= 80;
    
    return (
      <div style={styles.metricItem}>
        <div style={styles.metricHeader}>
          <span style={styles.metricLabel}>{label}</span>
          <span style={{
            ...styles.metricScore,
            color: isGood ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {current.toFixed(1)} / {ideal}
          </span>
        </div>
        
        <div style={styles.barContainer}>
          <div style={styles.barBackground}>
            <div 
              style={{
                ...styles.barFill,
                width: `${Math.min(percentage, 100)}%`,
                background: isGood ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
          <span style={styles.gapLabel}>
            {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FiTarget size={24} color="#667eea" />
        <div>
          <h2 style={styles.title}>Performance vs Ideal</h2>
          <p style={styles.subtitle}>How you compare to the AI-optimal standard</p>
        </div>
      </div>
      
      <div style={styles.metricsGrid}>
        {data.clarity && (
          <MetricComparison
            label="Clarity"
            current={data.clarity.current}
            ideal={data.clarity.ideal}
            gap={data.clarity.gap}
          />
        )}
        {data.trust && (
          <MetricComparison
            label="Trust"
            current={data.trust.current}
            ideal={data.trust.ideal}
            gap={data.trust.gap}
          />
        )}
        {data.completeness && (
          <MetricComparison
            label="Completeness"
            current={data.completeness.current}
            ideal={data.completeness.ideal}
            gap={data.completeness.gap}
          />
        )}
        {data.structure && (
          <MetricComparison
            label="Structure"
            current={data.structure.current}
            ideal={data.structure.ideal}
            gap={data.structure.gap}
          />
        )}
        
        {data.overall && (
          <div style={styles.overallMetric}>
            <MetricComparison
              label="Overall Score"
              current={data.overall.current}
              ideal={data.overall.ideal}
              gap={data.overall.gap}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'var(--bg-primary)',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    color: '#475569',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  metricsGrid: {
    display: 'grid',
    gap: '1.5rem',
  },
  metricItem: {
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  metricLabel: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: '0.9rem',
  },
  metricScore: {
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  barContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  barBackground: {
    flex: 1,
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gapLabel: {
    fontSize: '0.75rem',
    color: '#475569',
    fontWeight: '600',
    minWidth: '40px',
    textAlign: 'right',
  },
  overallMetric: {
    borderTop: '2px solid #e2e8f0',
    paddingTop: '1.5rem',
    marginTop: '1rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    padding: '1.5rem 1rem 1rem',
    borderRadius: '0.75rem',
  },
};

export default BenchmarkComparison;


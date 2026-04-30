import React from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * IssuesList Component - Display ranked issues with recommendations
 */
function IssuesList({ issues }) {
  const getPriorityStyles = (priority) => {
    switch(priority) {
      case 'HIGH':
        return {
          bg: 'rgba(239, 68, 68, 0.05)',
          border: '#ef4444',
          icon: <FiAlertCircle color="#ef4444" size={20} />,
          label: 'Critical',
        };
      case 'MEDIUM':
        return {
          bg: 'rgba(245, 158, 11, 0.05)',
          border: '#f59e0b',
          icon: <FiAlertCircle color="#f59e0b" size={20} />,
          label: 'Important',
        };
      case 'LOW':
        return {
          bg: 'rgba(16, 185, 129, 0.05)',
          border: '#10b981',
          icon: <FiCheckCircle color="#10b981" size={20} />,
          label: 'Minor',
        };
      default:
        return {
          bg: '#f8fafc',
          border: '#e2e8f0',
          icon: <FiAlertCircle size={20} />,
          label: 'Info',
        };
    }
  };

  if (!issues || issues.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>✅ No Issues Found</h2>
        <p style={styles.emptyMessage}>Your product is well-optimized for AI agents!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 Optimization Opportunities</h2>
      <p style={styles.subtitle}>Ranked by impact on AI agent perception</p>
      
      <div style={styles.issuesList}>
        {issues.map((issue, idx) => {
          const priorityStyles = getPriorityStyles(issue.priority);
          return (
            <div 
              key={idx} 
              style={{
                ...styles.issueItem,
                background: priorityStyles.bg,
                borderLeft: `4px solid ${priorityStyles.border}`,
              }}
            >
              <div style={styles.issueHeader}>
                <div style={styles.priorityBadge}>
                  {priorityStyles.icon}
                  <span style={styles.priorityLabel}>{priorityStyles.label}</span>
                </div>
                <h3 style={styles.issueTitle}>{issue.title}</h3>
              </div>
              
              <p style={styles.issueDescription}>{issue.description}</p>
              
              <div style={styles.issueDetails}>
                <div style={styles.detailItem}>
                  <strong style={styles.detailLabel}>💡 Solution:</strong>
                  <p style={styles.detailText}>{issue.suggestion}</p>
                </div>
                <div style={styles.detailItem}>
                  <strong style={styles.detailLabel}>📊 Expected Impact:</strong>
                  <p style={styles.detailText}>{issue.impact}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  },
  issuesList: {
    display: 'grid',
    gap: '1rem',
  },
  issueItem: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  issueHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem',
  },
  priorityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'white',
    borderRadius: '0.5rem',
    whiteSpace: 'nowrap',
  },
  priorityLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  issueTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    flex: 1,
  },
  issueDescription: {
    color: '#475569',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  issueDetails: {
    display: 'grid',
    gap: '1rem',
  },
  detailItem: {
    background: 'rgba(255, 255, 255, 0.6)',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
  detailLabel: {
    color: '#0f172a',
    fontSize: '0.875rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  detailText: {
    color: '#475569',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: '1.5',
  },
  emptyMessage: {
    color: '#475569',
    fontSize: '1rem',
    textAlign: 'center',
    padding: '2rem',
  },
};

export default IssuesList;


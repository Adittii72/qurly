import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * AIReadinessChecklist Component
 * Displays a structured checklist of AI readiness criteria
 */
function AIReadinessChecklist({ productData, description }) {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChecklist();
  }, [productData, description]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/analyze/checklist`, {
        description: description || productData?.description || '',
        product_data: productData || {}
      });
      setChecklist(response.data);
    } catch (err) {
      setError('Failed to generate checklist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSkeleton}>
          <div style={styles.skeletonHeader}></div>
          <div style={styles.skeletonItem}></div>
          <div style={styles.skeletonItem}></div>
          <div style={styles.skeletonItem}></div>
        </div>
      </div>
    );
  }

  if (error || !checklist) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <FiAlertCircle size={20} />
          <span>{error || 'Unable to load checklist'}</span>
        </div>
      </div>
    );
  }

  const { checklist: items, passed_count, total, readiness_percentage } = checklist;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 AI Readiness Checklist</h2>
        <p style={styles.subtitle}>
          Your product meets {passed_count} out of {total} AI optimization criteria
        </p>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${readiness_percentage}%`,
              background: getProgressColor(readiness_percentage)
            }}
          >
            <span style={styles.progressText}>{readiness_percentage}%</span>
          </div>
        </div>
        <p style={styles.progressLabel}>
          {getReadinessLabel(readiness_percentage)}
        </p>
      </div>

      {/* Checklist Items */}
      <div style={styles.checklistGrid}>
        {items.map((item, index) => (
          <div 
            key={index} 
            style={{
              ...styles.checklistItem,
              borderLeft: `4px solid ${item.passed ? '#10b981' : '#ef4444'}`
            }}
          >
            <div style={styles.itemHeader}>
              <div style={styles.itemIcon}>
                {item.passed ? (
                  <FiCheckCircle size={24} color="#10b981" />
                ) : (
                  <FiXCircle size={24} color="#ef4444" />
                )}
              </div>
              <div style={styles.itemContent}>
                <div style={styles.itemCategory}>{item.category}</div>
                <div style={styles.itemCheck}>{item.check}</div>
              </div>
            </div>
            <div style={styles.itemTip}>
              <strong>💡 Tip:</strong> {item.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>✅</div>
          <div>
            <div style={styles.summaryNumber}>{passed_count}</div>
            <div style={styles.summaryLabel}>Passed</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>❌</div>
          <div>
            <div style={styles.summaryNumber}>{total - passed_count}</div>
            <div style={styles.summaryLabel}>Needs Work</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🎯</div>
          <div>
            <div style={styles.summaryNumber}>{readiness_percentage}%</div>
            <div style={styles.summaryLabel}>Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
  if (percentage >= 60) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
  return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
};

const getReadinessLabel = (percentage) => {
  if (percentage >= 80) return '🎉 Excellent! Your product is highly optimized for AI agents';
  if (percentage >= 60) return '⚠️ Good progress, but there\'s room for improvement';
  return '❌ Needs significant optimization to be AI-ready';
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
  },
  progressContainer: {
    marginBottom: '2rem',
  },
  progressBar: {
    width: '100%',
    height: '2rem',
    background: '#f3f4f6',
    borderRadius: '1rem',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.5s ease',
    borderRadius: '1rem',
  },
  progressText: {
    color: 'white',
    fontWeight: '700',
    fontSize: '0.875rem',
  },
  progressLabel: {
    marginTop: '0.75rem',
    fontSize: '0.875rem',
    color: '#4b5563',
    textAlign: 'center',
  },
  checklistGrid: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '2rem',
  },
  checklistItem: {
    background: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    transition: 'all 0.25s ease',
  },
  itemHeader: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  itemIcon: {
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
  },
  itemCategory: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  itemCheck: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  itemTip: {
    fontSize: '0.875rem',
    color: '#4b5563',
    paddingLeft: '2.5rem',
    lineHeight: '1.5',
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    paddingTop: '2rem',
    borderTop: '2px solid #e5e7eb',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '0.75rem',
  },
  summaryIcon: {
    fontSize: '2rem',
  },
  summaryNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  loadingSkeleton: {
    padding: '1rem',
  },
  skeletonHeader: {
    height: '2rem',
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  skeletonItem: {
    height: '4rem',
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '0.5rem',
    marginBottom: '0.75rem',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.75rem',
    color: '#dc2626',
  },
};

export default AIReadinessChecklist;

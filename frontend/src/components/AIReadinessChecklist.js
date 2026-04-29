import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * AIReadinessChecklist Component
 * Displays structured checklist of AI readiness criteria
 * Shows green checkmarks for passing checks, red X for failing
 */
const AIReadinessChecklist = ({ productData, onClose }) => {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchChecklist();
  }, [productData]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await axios.post(`${API_URL}/api/analyze/checklist`, {
        description: productData.description || '',
        product_data: {
          title: productData.title || '',
          price: productData.price,
          image_count: productData.image_count || 0,
          review_count: productData.review_count || 0,
          has_faq: productData.has_faq || false,
          has_return_policy: productData.has_return_policy || false,
          has_shipping_policy: productData.has_shipping_policy || false,
          has_warranty: productData.has_warranty || false,
        }
      });

      setChecklist(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching checklist:', err);
      setError(err.response?.data?.detail || 'Failed to generate checklist');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (loading) {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.spinner}></div>
          <p>Generating checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.errorBox}>
            <p style={{ color: '#ef4444', fontWeight: '600' }}>Error</p>
            <p>{error}</p>
            <button 
              onClick={onClose}
              style={styles.button}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return null;
  }

  // Group checklist items by category
  const groupedChecklist = checklist.checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedChecklist);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2>🎯 AI Readiness Checklist</h2>
          <button 
            onClick={onClose}
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>

        {/* Readiness Score */}
        <div style={styles.scoreSection}>
          <div style={styles.scoreCard}>
            <div style={styles.scoreValue}>
              {checklist.readiness_percentage}%
            </div>
            <div style={styles.scoreLabel}>AI Ready</div>
          </div>
          <div style={styles.scoreDetails}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Checks Passed:</span>
              <span style={styles.detailValue}>
                {checklist.passed_count}/{checklist.total}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span>Progress</span>
            <span style={styles.progressPercent}>{checklist.readiness_percentage}%</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${checklist.readiness_percentage}%`,
                backgroundColor: getProgressColor(checklist.readiness_percentage)
              }}
            ></div>
          </div>
        </div>

        {/* Checklist Items by Category */}
        <div style={styles.checklistContainer}>
          {categories.map((category) => (
            <div key={category} style={styles.categorySection}>
              <div 
                style={styles.categoryHeader}
                onClick={() => toggleCategory(category)}
              >
                <span style={styles.categoryTitle}>
                  {category}
                  <span style={styles.categoryCount}>
                    {' '}({groupedChecklist[category].filter(c => c.passed).length}/{groupedChecklist[category].length})
                  </span>
                </span>
                <span style={styles.toggleIcon}>
                  {expandedCategory === category ? '▼' : '▶'}
                </span>
              </div>

              {expandedCategory === category && (
                <div style={styles.categoryContent}>
                  {groupedChecklist[category].map((item, idx) => (
                    <div key={idx} style={styles.checkItem}>
                      <div style={styles.checkHeader}>
                        <div style={styles.checkStatus}>
                          {item.passed ? (
                            <span style={styles.checkMark}>✓</span>
                          ) : (
                            <span style={styles.checkX}>✕</span>
                          )}
                        </div>
                        <div style={styles.checkText}>
                          <div style={styles.checkTitle}>{item.check}</div>
                        </div>
                      </div>
                      <div style={styles.checkTip}>
                        <span style={styles.tipIcon}>💡</span>
                        {item.tip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button 
            onClick={() => {
              fetchChecklist();
            }}
            style={{ ...styles.button, ...styles.secondaryButton }}
          >
            Refresh
          </button>
          <button 
            onClick={onClose}
            style={styles.button}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on readiness percentage
function getProgressColor(percentage) {
  if (percentage >= 80) return '#10b981';  // Green
  if (percentage >= 60) return '#f59e0b';  // Amber
  return '#ef4444';  // Red
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 150ms ease-out',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '85vh',
    overflow: 'auto',
    animation: 'slideUp 300ms ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#fff',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    display: 'flex',
    gap: '20px',
    padding: '24px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
  },
  scoreCard: {
    flex: '0 0 120px',
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '2px solid #667eea',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#667eea',
    lineHeight: '1',
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  scoreDetails: {
    flex: '1',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
  },
  detailValue: {
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '700',
  },
  progressSection: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  progressPercent: {
    color: '#667eea',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 300ms ease-out',
  },
  checklistContainer: {
    padding: '24px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  categorySection: {
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background-color 150ms ease',
    ':hover': {
      backgroundColor: '#e5e7eb',
    },
  },
  categoryTitle: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },
  categoryCount: {
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '500',
  },
  toggleIcon: {
    color: '#6b7280',
    fontSize: '12px',
  },
  categoryContent: {
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e7eb',
  },
  checkItem: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  checkHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  checkStatus: {
    flex: '0 0 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#10b981',
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.2',
  },
  checkX: {
    color: '#ef4444',
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: '1.2',
  },
  checkText: {
    flex: '1',
  },
  checkTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    lineHeight: '1.4',
  },
  checkTip: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#6b7280',
    marginLeft: '36px',
    lineHeight: '1.4',
  },
  tipIcon: {
    flex: '0 0 16px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    padding: '24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  button: {
    flex: '1',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
    },
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    ':hover': {
      backgroundColor: '#d1d5db',
    },
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  errorBox: {
    padding: '24px',
    textAlign: 'center',
  },
};

export default AIReadinessChecklist;

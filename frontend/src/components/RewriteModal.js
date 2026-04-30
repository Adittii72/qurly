import React, { useState } from 'react';
import { FiX, FiCopy, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

/**
 * RewriteModal Component - Generate AI-optimized descriptions
 */
function RewriteModal({ productData, onClose }) {
  const [loading, setLoading] = useState(false);
  const [rewritten, setRewritten] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.post(
        `${API_URL}/api/rewrite`,
        {
          description: productData.description,
          product_title: productData.title,
          key_features: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRewritten(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate optimized description');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>✨ AI Description Optimizer</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>

        <div style={styles.body}>
          {!rewritten ? (
            <>
              <p style={styles.description}>
                Generate an AI-optimized version of your product description that's designed to perform better with shopping agents.
              </p>
              
              {error && (
                <div style={styles.errorBox}>
                  <FiAlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                style={{
                  ...styles.generateButton,
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onClick={handleRewrite}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Generating...
                  </>
                ) : (
                  '⚡ Generate Optimized Description'
                )}
              </button>
            </>
          ) : (
            <>
              <div style={styles.comparisonContainer}>
                <div style={styles.descriptionPanel}>
                  <h3 style={styles.panelTitle}>Original Description</h3>
                  <div style={styles.descriptionContent}>
                    <p style={styles.descriptionText}>{rewritten.original}</p>
                  </div>
                </div>

                <div style={styles.divider}>→</div>

                <div style={{...styles.descriptionPanel, ...styles.optimizedPanel}}>
                  <h3 style={styles.panelTitle}>✨ Optimized Version</h3>
                  <div style={styles.descriptionContent}>
                    <p style={styles.descriptionText}>{rewritten.rewritten}</p>
                  </div>
                  <button
                    style={{
                      ...styles.copyButton,
                      background: copied ? '#10b981' : '#667eea',
                    }}
                    onClick={() => handleCopy(rewritten.rewritten)}
                  >
                    {copied ? (
                      <>
                        <FiCheckCircle size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy size={18} />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div style={styles.improvementsBox}>
                <h4 style={styles.improvementsTitle}>🎯 Optimizations Made</h4>
                <ul style={styles.improvementsList}>
                  {rewritten.improvements && rewritten.improvements.map((imp, idx) => (
                    <li key={idx} style={styles.improvementItem}>
                      <FiCheckCircle size={16} color="#10b981" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
                
                {rewritten.estimated_score_boost && (
                  <div style={styles.scoreBoost}>
                    <span>📈 Estimated Score Improvement:</span>
                    <strong style={styles.boostValue}>+{rewritten.estimated_score_boost} points</strong>
                  </div>
                )}
              </div>

              <button 
                style={styles.doneButton}
                onClick={onClose}
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'color 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: '2rem',
  },
  description: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    color: '#dc2626',
    marginBottom: '1.5rem',
  },
  generateButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    width: '100%',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  comparisonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 40px 1fr',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'stretch',
  },
  descriptionPanel: {
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    background: '#f8fafc',
  },
  optimizedPanel: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  panelTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  descriptionContent: {
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '1rem',
  },
  descriptionText: {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  improvementsBox: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  improvementsTitle: {
    color: '#166534',
    fontWeight: '700',
    margin: '0 0 1rem',
  },
  improvementsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  improvementItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    color: '#166534',
    fontSize: '0.875rem',
  },
  scoreBoost: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #86efac',
  },
  boostValue: {
    color: '#10b981',
    fontSize: '1.25rem',
  },
  doneButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
};

export default RewriteModal;


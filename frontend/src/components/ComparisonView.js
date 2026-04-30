import React, { useState } from 'react';
import { FiArrowRight, FiX } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

/**
 * ComparisonView Component - Compare two products side-by-side
 */
function ComparisonView({ onClose }) {
  const [product1Url, setProduct1Url] = useState('');
  const [product2Url, setProduct2Url] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState(null);

  const handleCompare = async () => {
    if (!product1Url || !product2Url) {
      setError('Please enter both product URLs');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.post(
        `${API_URL}/api/compare`,
        {
          product_url_1: product1Url,
          product_url_2: product2Url
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComparison(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  if (comparison) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>

          <h2 style={styles.title}>Product Comparison</h2>

          <div style={styles.comparisonContainer}>
            <div style={styles.productPanel}>
              <h3 style={styles.productTitle}>{comparison.product_1_title}</h3>
              <div style={styles.scoreCircle}>
                <span style={{...styles.scoreValue, color: getScoreColor(comparison.product_1_score)}}>
                  {comparison.product_1_score.toFixed(1)}
                </span>
              </div>
              <div style={styles.metricsGrid}>
                {Object.entries(comparison.metrics_product_1 || {}).map(([key, value]) => (
                  <div key={key} style={styles.metricRow}>
                    <span style={styles.metricLabel}>{key}</span>
                    <span style={styles.metricValue}>{value?.toFixed(1) || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.divider}>
              <FiArrowRight size={32} color="#667eea" />
            </div>

            <div style={styles.productPanel}>
              <h3 style={styles.productTitle}>{comparison.product_2_title}</h3>
              <div style={styles.scoreCircle}>
                <span style={{...styles.scoreValue, color: getScoreColor(comparison.product_2_score)}}>
                  {comparison.product_2_score.toFixed(1)}
                </span>
              </div>
              <div style={styles.metricsGrid}>
                {Object.entries(comparison.metrics_product_2 || {}).map(([key, value]) => (
                  <div key={key} style={styles.metricRow}>
                    <span style={styles.metricLabel}>{key}</span>
                    <span style={styles.metricValue}>{value?.toFixed(1) || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {comparison.insights && (
            <div style={styles.insightsBox}>
              <h4 style={styles.insightsTitle}>Key Differences</h4>
              <ul style={styles.insightsList}>
                {Object.values(comparison.insights).map((insight, idx) => (
                  <li key={idx} style={styles.insightItem}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          <button style={styles.newComparisonBtn} onClick={() => setComparison(null)}>
            Compare Different Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>
          <FiX size={24} />
        </button>

        <h2 style={styles.title}>Compare Products</h2>
        <p style={styles.subtitle}>Analyze and compare two products side-by-side</p>

        <form onSubmit={(e) => { e.preventDefault(); handleCompare(); }} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Product 1 URL</label>
            <input
              type="url"
              value={product1Url}
              onChange={(e) => setProduct1Url(e.target.value)}
              placeholder="https://example.myshopify.com/products/..."
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Product 2 URL</label>
            <input
              type="url"
              value={product2Url}
              onChange={(e) => setProduct2Url(e.target.value)}
              placeholder="https://example.myshopify.com/products/..."
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : 'Compare Products'}
          </button>
        </form>

        <div style={styles.tips}>
          <h4 style={styles.tipsTitle}>Tips for Better Comparison</h4>
          <ul style={styles.tipsList}>
            <li>Compare products in the same category for more relevant insights</li>
            <li>See how your competitors score against your products</li>
            <li>Identify best practices from higher-scoring products</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const getScoreColor = (score) => {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#f59e0b';
  return '#ef4444';
};

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
  },
  modal: {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '2rem',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#475569',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  form: {
    marginBottom: '2rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    color: '#0f172a',
    boxSizing: 'border-box',
  },
  error: {
    padding: '1rem',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    color: '#dc2626',
    marginBottom: '1rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.25s ease',
  },
  comparisonContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'start',
  },
  productPanel: {
    padding: '1.5rem',
    background: '#f8fafc',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
  },
  productTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'white',
    border: '3px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  scoreValue: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  metricsGrid: {
    display: 'grid',
    gap: '0.5rem',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '0.5rem',
  },
  metricLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
  },
  metricValue: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsBox: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
  },
  insightsTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.75rem',
  },
  insightsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.5rem',
  },
  insightItem: {
    fontSize: '0.875rem',
    color: '#475569',
    paddingLeft: '1rem',
  },
  newComparisonBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
  },
  tips: {
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    marginTop: '1.5rem',
  },
  tipsTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.75rem',
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.5rem',
  },
};

export default ComparisonView;

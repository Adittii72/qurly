import React, { useState, useEffect } from 'react';
import { FiLogOut, FiTrash2, FiDownload, FiShare2, FiStar } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

/**
 * Dashboard Component - User's saved reports and history
 */
function Dashboard({ user, onLogout }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.get(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Delete this report?')) return;
    
    try {
      const token = localStorage.getItem('qurly_token');
      await axios.delete(`${API_URL}/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const toggleFavorite = async (reportId) => {
    try {
      const token = localStorage.getItem('qurly_token');
      await axios.post(`${API_URL}/api/reports/${reportId}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (err) {
      setError('Failed to update favorite');
    }
  };

  const exportReport = async (reportId, format) => {
    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.get(`${API_URL}/api/reports/${reportId}/export/${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create download
      const element = document.createElement('a');
      element.href = URL.createObjectURL(new Blob([JSON.stringify(response.data)]));
      element.download = `report-${reportId}.${format === 'json' ? 'json' : 'txt'}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      setError('Failed to export report');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Your Analysis Reports</h1>
        <button style={styles.logoutBtn} onClick={onLogout}>
          <FiLogOut size={18} /> Logout
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>📊</div>
          <h2 style={styles.emptyStateTitle}>No analyses yet</h2>
          <p style={styles.emptyStateMessage}>Start by analyzing your first Shopify product to get AI-powered insights and optimization recommendations.</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={styles.emptyStateButton}
          >
            Analyze Your First Product →
          </button>
        </div>
      ) : (
        <div style={styles.reportsList}>
          {reports.map(report => (
            <div key={report.id} style={styles.reportCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.reportTitle}>{report.product_title}</h3>
                  <p style={styles.reportUrl}>{report.product_url}</p>
                </div>
                <div style={styles.scoreDisplay}>
                  <div style={{...styles.score, color: getScoreColor(report.overall_score)}}>
                    {report.overall_score.toFixed(1)}
                  </div>
                </div>
              </div>

              <div style={styles.scoreGrid}>
                <div style={styles.miniScore}>
                  <span>Clarity</span>
                  <strong>{report.clarity_score.toFixed(1)}</strong>
                </div>
                <div style={styles.miniScore}>
                  <span>Trust</span>
                  <strong>{report.trust_score.toFixed(1)}</strong>
                </div>
                <div style={styles.miniScore}>
                  <span>Completeness</span>
                  <strong>{report.completeness_score.toFixed(1)}</strong>
                </div>
                <div style={styles.miniScore}>
                  <span>Structure</span>
                  <strong>{report.structure_score.toFixed(1)}</strong>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <p style={styles.date}>
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
                <div style={styles.actions}>
                  <button 
                    style={styles.iconBtn}
                    onClick={() => {
                      // Copy shareable link to clipboard
                      const shareLink = `${window.location.origin}?report_id=${report.id}`;
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied to clipboard! 📋');
                    }}
                    title="Copy shareable link"
                  >
                    <FiShare2 size={18} />
                  </button>
                  <button 
                    style={styles.iconBtn}
                    onClick={() => toggleFavorite(report.id)}
                    title="Toggle favorite"
                  >
                    <FiStar size={18} />
                  </button>
                  <button
                    style={styles.iconBtn}
                    onClick={() => exportReport(report.id, 'json')}
                    title="Export as JSON"
                  >
                    <FiDownload size={18} />
                  </button>
                  <button
                    style={{...styles.iconBtn, color: '#ef4444'}}
                    onClick={() => deleteReport(report.id)}
                    title="Delete report"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const getScoreColor = (score) => {
  if (score >= 8) return '#8B6F47';
  if (score >= 6) return '#C89A3E';
  return '#C85141';
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2C2C2C',
    margin: 0,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: '#9A7D5D',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: {
    padding: '1rem',
    background: '#FADDD1',
    border: '1px solid #F5A594',
    borderRadius: '0.5rem',
    color: '#C85141',
    marginBottom: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#8B7D6B',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: 'linear-gradient(135deg, #F5E6D3 0%, #FAF5ED 100%)',
    borderRadius: '1rem',
    border: '2px dashed #E8D4B0',
  },
  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyStateTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: '0.75rem',
  },
  emptyStateMessage: {
    fontSize: '0.95rem',
    color: '#8B7D6B',
    marginBottom: '1.5rem',
    maxWidth: '400px',
    margin: '0 auto 1.5rem',
  },
  emptyStateButton: {
    padding: '0.75rem 1.5rem',
    background: '#9A7D5D',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.25s ease',
  },
  reportsList: {
    display: 'grid',
    gap: '1.5rem',
  },
  reportCard: {
    background: 'white',
    border: '1px solid #E8D4B0',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  reportTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#2C2C2C',
    margin: '0 0 0.5rem',
  },
  reportUrl: {
    fontSize: '0.875rem',
    color: '#8B7D6B',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'center',
  },
  score: {
    fontSize: '2rem',
    fontWeight: '700',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  miniScore: {
    padding: '0.75rem',
    background: '#F9F7F4',
    borderRadius: '0.5rem',
    textAlign: 'center',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #E8D4B0',
  },
  date: {
    fontSize: '0.875rem',
    color: '#8B7D6B',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
  },
  iconBtn: {
    background: '#F5E6D3',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#667eea',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
  },
};

export default Dashboard;

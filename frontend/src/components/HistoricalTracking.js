import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

/**
 * HistoricalTracking Component - Track product score over time
 */
function HistoricalTracking({ reportId }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.get(
        `${API_URL}/api/reports/${reportId}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!history || history.history.length <= 1) {
    return (
      <div style={styles.noData}>
        <p>Analyze this product multiple times to see the trend</p>
      </div>
    );
  }

  const firstScore = history.history[0].overall_score;
  const lastScore = history.history[history.history.length - 1].overall_score;
  const improvement = lastScore - firstScore;

  const minScore = Math.min(...history.history.map(h => h.overall_score));
  const maxScore = Math.max(...history.history.map(h => h.overall_score));
  const range = maxScore - minScore || 1;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📈 Improvement Track Record</h2>
      <p style={styles.subtitle}>
        {history.product_title} - {history.analysis_count} analyses
      </p>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Initial Score</span>
          <span style={styles.summaryValue}>{firstScore.toFixed(1)}</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Current Score</span>
          <span style={styles.summaryValue}>{lastScore.toFixed(1)}</span>
        </div>
        <div style={{...styles.summaryCard, background: improvement > 0 ? '#f0fdf4' : '#fef2f2'}}>
          <span style={styles.summaryLabel}>Improvement</span>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            {improvement > 0 ? <FiTrendingUp color="#10b981" size={20} /> : <FiTrendingDown color="#ef4444" size={20} />}
            <span style={{...styles.summaryValue, color: improvement > 0 ? '#10b981' : '#ef4444'}}>
              {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <div style={styles.chart}>
          <svg width="100%" height="200" style={{overflow: 'visible'}}>
            {/* Background grid */}
            {[0, 2, 4, 6, 8, 10].map(line => (
              <line
                key={`grid-${line}`}
                x1="0"
                y1={200 - (line / 10) * 200}
                x2="100%"
                y2={200 - (line / 10) * 200}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}

            {/* Line chart */}
            {history.history.map((entry, idx, arr) => {
              const x = (idx / (arr.length - 1)) * 100;
              const y = 200 - ((entry.overall_score - minScore) / range) * 200;
              
              return (
                <g key={idx}>
                  {idx < arr.length - 1 && (
                    <line
                      x1={x}
                      y1={y}
                      x2={(idx + 1) / (arr.length - 1) * 100}
                      y2={200 - ((arr[idx + 1].overall_score - minScore) / range) * 200}
                      stroke="#667eea"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#667eea"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}

            {/* Y-axis labels */}
            {[0, 2.5, 5, 7.5, 10].map(label => (
              <text
                key={`label-${label}`}
                x="-5"
                y={200 - (label / 10) * 200}
                fontSize="12"
                fill="#94a3b8"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {label.toFixed(1)}
              </text>
            ))}
          </svg>
        </div>

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, background: '#667eea'}}></div>
            <span>Overall Score Progression</span>
          </div>
        </div>
      </div>

      <div style={styles.timeline}>
        <h4 style={styles.timelineTitle}>Analysis Timeline</h4>
        <div style={styles.timelineList}>
          {history.history.map((entry, idx) => {
            const date = new Date(entry.created_at);
            const isLatest = idx === history.history.length - 1;
            
            return (
              <div key={idx} style={styles.timelineItem}>
                <div style={{...styles.timelineMarker, ...(isLatest ? styles.timelineMarkerLatest : {})}}>
                  {idx + 1}
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </div>
                  <div style={styles.timelineScores}>
                    <div style={styles.scoreChip}>
                      <span>Clarity</span>
                      <strong>{entry.clarity_score.toFixed(1)}</strong>
                    </div>
                    <div style={styles.scoreChip}>
                      <span>Trust</span>
                      <strong>{entry.trust_score.toFixed(1)}</strong>
                    </div>
                    <div style={styles.scoreChip}>
                      <span>Completeness</span>
                      <strong>{entry.completeness_score.toFixed(1)}</strong>
                    </div>
                    <div style={styles.scoreChip}>
                      <span>Structure</span>
                      <strong>{entry.structure_score.toFixed(1)}</strong>
                    </div>
                  </div>
                </div>
                <div style={{...styles.overallScore, color: getScoreColor(entry.overall_score)}}>
                  {entry.overall_score.toFixed(1)}
                </div>
              </div>
            );
          })}
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
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#94a3b8',
  },
  error: {
    padding: '1rem',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    color: '#dc2626',
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
    color: '#94a3b8',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  summaryCard: {
    padding: '1rem',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  summaryValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  chartContainer: {
    marginBottom: '2rem',
  },
  chart: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '2rem 1rem 1rem',
    marginBottom: '1rem',
  },
  legend: {
    display: 'flex',
    gap: '1rem',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#475569',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  timeline: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1.5rem',
  },
  timelineTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '1rem',
  },
  timelineList: {
    display: 'grid',
    gap: '1rem',
  },
  timelineItem: {
    display: 'grid',
    gridTemplateColumns: '30px 1fr auto',
    gap: '1rem',
    alignItems: 'start',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.75rem',
  },
  timelineMarker: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#667eea',
  },
  timelineMarkerLatest: {
    background: '#667eea',
    color: 'white',
  },
  timelineContent: {
    minWidth: 0,
  },
  timelineDate: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  timelineScores: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '0.5rem',
  },
  scoreChip: {
    padding: '0.5rem',
    background: 'white',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  overallScore: {
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'right',
  },
};

export default HistoricalTracking;

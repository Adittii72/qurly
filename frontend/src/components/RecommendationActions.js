import React, { useState } from 'react';
import { FiEdit3, FiCheck, FiX, FiCopy } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * RecommendationActions Component - Optimization suite with AI-powered suggestions
 */
function RecommendationActions({ reportId, originalDescription, originalTitle, onActionApplied }) {
  const [activeTab, setActiveTab] = useState('rewrite'); // 'rewrite', 'bullets', 'title'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (actionType) => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('qurly_token');
      const response = await axios.post(
        `${API_URL}/api/recommendations/generate`,
        {
          report_id: reportId,
          action_type: actionType,
          original_content: actionType === 'rewrite' ? originalDescription : originalTitle,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestion(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate suggestion');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('qurly_token');
      await axios.post(
        `${API_URL}/api/recommendations/apply`,
        {
          recommendation_id: suggestion.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestion(null);
      onActionApplied?.();
    } catch (err) {
      setError('Failed to apply suggestion');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.suggested_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>✨ AI Optimization Suite</h3>
      <p style={styles.subtitle}>Generate AI-powered improvements for your product</p>

      <div style={styles.tabsContainer}>
        {[
          { id: 'rewrite', label: '📝 Rewrite Description', icon: '✍️' },
          { id: 'bullets', label: '📋 Generate Bullets', icon: '•' },
          { id: 'title', label: '🎯 Improve Title', icon: '⭐' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSuggestion(null); }}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {}),
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {!suggestion ? (
        <div style={styles.generateBox}>
          <p style={styles.generateText}>
            {activeTab === 'rewrite' && 'Rewrite your product description for maximum clarity and impact'}
            {activeTab === 'bullets' && 'Generate compelling bullet points highlighting key features'}
            {activeTab === 'title' && 'Optimize your product title for better SEO and conversion'}
          </p>
          <button
            onClick={() => handleGenerate(activeTab)}
            disabled={loading}
            style={{
              ...styles.generateBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate Suggestion'}
          </button>
        </div>
      ) : (
        <div style={styles.suggestionBox}>
          <div style={styles.suggestionHeader}>
            <h4 style={styles.suggestionTitle}>
              {activeTab === 'rewrite' && 'Optimized Description'}
              {activeTab === 'bullets' && 'Generated Bullet Points'}
              {activeTab === 'title' && 'Optimized Title'}
            </h4>
            <div style={styles.scoreImprovement}>
              <span style={styles.scoreLabel}>Est. Score Improvement:</span>
              <span style={{...styles.scoreValue, color: '#10b981'}}>
                +{suggestion.estimated_score_improvement?.toFixed(1) || '2.5'}
              </span>
            </div>
          </div>

          <div style={styles.suggestionContent}>
            {activeTab === 'bullets' ? (
              <ul style={styles.bulletList}>
                {suggestion.suggested_content.split('\n').map((bullet, idx) => (
                  bullet.trim() && (
                    <li key={idx} style={styles.bulletItem}>
                      {bullet.replace(/^[•\-\*]\s*/, '')}
                    </li>
                  )
                ))}
              </ul>
            ) : (
              <p style={styles.suggestionText}>{suggestion.suggested_content}</p>
            )}
          </div>

          <div style={styles.actionButtons}>
            <button
              onClick={handleCopy}
              style={{...styles.actionBtn, ...styles.copyBtn}}
            >
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleApply}
              style={{...styles.actionBtn, ...styles.applyBtn}}
            >
              <FiCheck size={18} /> Apply Suggestion
            </button>
            <button
              onClick={() => setSuggestion(null)}
              style={{...styles.actionBtn, ...styles.rejectBtn}}
            >
              <FiX size={18} /> Reject
            </button>
          </div>

          <div style={styles.confidenceBox}>
            <span style={styles.confidenceLabel}>AI Confidence: </span>
            <div style={styles.confidenceBar}>
              <div
                style={{
                  ...styles.confidenceFill,
                  width: `${(suggestion.confidence || 75) * 100 / 100}%`,
                  background: getConfidenceColor(suggestion.confidence || 75),
                }}
              />
            </div>
            <span style={styles.confidenceValue}>{(suggestion.confidence || 75).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <div style={styles.tipBox}>
        <p style={styles.tipText}>
          💡 <strong>Tip:</strong> Review all suggestions carefully before applying them to maintain brand voice.
        </p>
      </div>
    </div>
  );
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return '#10b981';
  if (confidence >= 60) return '#f59e0b';
  return '#ef4444';
};

const styles = {
  container: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '1rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#475569',
    marginBottom: '1.5rem',
  },
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  tab: {
    padding: '0.75rem 1rem',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
  },
  error: {
    padding: '1rem',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '0.75rem',
    color: '#dc2626',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  generateBox: {
    padding: '1.5rem',
    background: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  generateText: {
    fontSize: '0.875rem',
    color: '#475569',
    marginBottom: '1rem',
  },
  generateBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.25s ease',
  },
  suggestionBox: {
    padding: '1.5rem',
    background: 'white',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    marginBottom: '1rem',
  },
  suggestionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
  },
  suggestionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  scoreImprovement: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  scoreLabel: {
    color: '#475569',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  suggestionContent: {
    marginBottom: '1rem',
  },
  bulletList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.5rem',
  },
  bulletItem: {
    padding: '0.75rem 1rem',
    background: '#f8fafc',
    borderLeft: '3px solid #667eea',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    color: '#0f172a',
  },
  suggestionText: {
    fontSize: '0.875rem',
    color: '#0f172a',
    lineHeight: '1.6',
    margin: 0,
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  actionBtn: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.25s ease',
  },
  copyBtn: {
    background: 'white',
    color: '#667eea',
    border: '1px solid #667eea',
  },
  applyBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
  },
  rejectBtn: {
    background: 'white',
    color: '#ef4444',
    border: '1px solid #ef4444',
  },
  confidenceBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  },
  confidenceLabel: {
    color: '#475569',
    fontWeight: '600',
    minWidth: '120px',
  },
  confidenceBar: {
    flex: 1,
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
  confidenceValue: {
    fontWeight: '700',
    color: '#0f172a',
    minWidth: '45px',
    textAlign: 'right',
  },
  tipBox: {
    padding: '0.75rem 1rem',
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '0.5rem',
  },
  tipText: {
    fontSize: '0.75rem',
    color: '#475569',
    margin: 0,
  },
};

export default RecommendationActions;

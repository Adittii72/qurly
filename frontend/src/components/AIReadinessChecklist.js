import React, { useState, useEffect } from 'react';
import './AIReadinessChecklist.css';

const AIReadinessChecklist = ({ productData, description }) => {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productData && description) {
      fetchChecklist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, description]);

  const fetchChecklist = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/analyze/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          description: description,
          product_data: productData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate checklist');
      }

      const data = await response.json();
      setChecklist(data);
    } catch (err) {
      console.error('Checklist error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checklist-container">
        <div className="checklist-loading">
          <div className="spinner"></div>
          <p>Generating AI Readiness Checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checklist-container">
        <div className="checklist-error">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return null;
  }

  const { checklist: items, passed_count, total, readiness_percentage } = checklist;

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <h2>🤖 AI Readiness Checklist</h2>
        <div className="readiness-score">
          <div className="score-circle" style={{ '--percentage': readiness_percentage }}>
            <span className="score-value">{readiness_percentage}%</span>
          </div>
          <p className="score-label">{passed_count} of {total} checks passed</p>
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${readiness_percentage}%` }}
        ></div>
      </div>

      <div className="checklist-items">
        {items.map((item, index) => (
          <div key={index} className={`checklist-item ${item.passed ? 'passed' : 'failed'}`}>
            <div className="item-header">
              <span className="item-icon">
                {item.passed ? '✅' : '❌'}
              </span>
              <div className="item-content">
                <span className="item-category">{item.category}</span>
                <span className="item-check">{item.check}</span>
              </div>
            </div>
            {!item.passed && (
              <div className="item-tip">
                <span className="tip-icon">💡</span>
                <span className="tip-text">{item.tip}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="checklist-footer">
        <p className="footer-text">
          {readiness_percentage >= 80 
            ? '🎉 Excellent! Your product is highly optimized for AI agents.' 
            : readiness_percentage >= 60 
            ? '⚠️ Good progress! Address the failed checks to improve AI visibility.' 
            : '❌ Needs improvement. Focus on the failed checks to boost AI recommendations.'}
        </p>
      </div>
    </div>
  );
};

export default AIReadinessChecklist;

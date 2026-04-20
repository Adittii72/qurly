import React, { useState } from 'react';
import axios from 'axios';
import ScoreCard from './components/ScoreCard';
import IssuesList from './components/IssuesList';
import AIPerception from './components/AIPerception';
import BenchmarkComparison from './components/BenchmarkComparison';
import BeforeAfter from './components/BeforeAfter';
import RewriteModal from './components/RewriteModal';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showRewriteModal, setShowRewriteModal] = useState(false);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      if (!url.trim()) {
        setError('Please enter a Shopify product URL');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/analyze`, null, {
        params: { url: url.trim() }
      });

      setResult(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Error analyzing product';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>🛍️ Qurly</h1>
          <p>AI Representation Optimizer for Shopify Products</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Input Section */}
          <section className="input-section">
            <div className="input-group">
              <input
                type="text"
                placeholder="Paste your Shopify product URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="analyze-button"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </section>

          {/* Results Section */}
          {result && (
            <div className="results-section">
              {/* Score Card */}
              <ScoreCard scores={result.scores} />

              {/* AI Perception */}
              <AIPerception perception={result.ai_perception} />

              {/* Key Issues */}
              <IssuesList issues={result.issues} />

              {/* Benchmark Comparison */}
              <BenchmarkComparison comparison={result.benchmark_comparison} />

              {/* Before/After */}
              <BeforeAfter
                currentScore={result.scores.overall}
                potentialImprovement={result.potential_improvement}
              />

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={() => setShowRewriteModal(true)}
                  className="rewrite-button"
                >
                  ✏️ Optimize Description
                </button>
              </div>

              {/* Rewrite Modal */}
              {showRewriteModal && (
                <RewriteModal
                  description={result.product_data.description}
                  title={result.product_data.title}
                  onClose={() => setShowRewriteModal(false)}
                />
              )}
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && (
            <div className="empty-state">
              <h2>Welcome to Qurly</h2>
              <p>Paste a Shopify product URL to get started</p>
              <ul>
                <li>✅ AI Scoring (0-100)</li>
                <li>✅ Issue Detection</li>
                <li>✅ Actionable Recommendations</li>
                <li>✅ Description Optimization</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

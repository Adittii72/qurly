import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiZap, FiTarget, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import ScoreCard from './components/ScoreCard';
import IssuesList from './components/IssuesList';
import AIPerception from './components/AIPerception';
import RewriteModal from './components/RewriteModal';
import Dashboard from './components/Dashboard';
import ConfidenceExplainer from './components/ConfidenceExplainer';
import HistoricalTracking from './components/HistoricalTracking';
import ComparisonView from './components/ComparisonView';
import RecommendationActions from './components/RecommendationActions';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/LoadingSkeleton';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // UI view state
  const [currentView, setCurrentView] = useState('analyze'); // 'analyze', 'dashboard', 'comparison', 'login'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' or 'app' - START WITH LANDING

  // Analysis state
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('qurly_token');
    const storedUser = localStorage.getItem('qurly_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      if (!url.trim()) {
        setError('Please enter a valid Shopify product URL');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/api/analyze`, null, {
        params: { url: url.trim() }
      });

      setResult(response.data);
      setShowSavePrompt(isAuthenticated); // Show save prompt if authenticated
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to analyze product';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/reports`,
        {
          product_url: url,
          product_title: result.product_data.title,
          description: result.product_data.description,
          price: result.product_data.price,
          scores: result.scores,
          issues: result.issues,
          confidence_scores: result.confidence_scores,
          advanced_nlp: result.advanced_nlp,
          benchmark_comparison: result.benchmark_comparison,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedReportId(response.data.id);
      setShowSavePrompt(false);
    } catch (err) {
      alert('Failed to save report');
    }
  };

  const handleLogin = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('qurly_token', authToken);
    localStorage.setItem('qurly_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('analyze');
    setCurrentPage('landing');
    localStorage.removeItem('qurly_token');
    localStorage.removeItem('qurly_user');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze();
    }
  };

  // Always show landing page first (whether authenticated or not)
  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onLogin={handleLogin}
        onGetStarted={() => {
          setCurrentPage('app');
          if (!isAuthenticated) {
            setCurrentView('login');
          }
        }}
        onNavigate={(section) => {
          // For now, just switch to app view
          // In a full implementation, you'd scroll to sections
          setCurrentPage('app');
        }}
      />
    );
  }

  // Main app view
  return (
    <ErrorBoundary>
      <div className="app">
      {/* Navigation Header */}
      <nav className="navbar">
      <div className="nav-container">
        <button 
          onClick={() => setCurrentPage('landing')}
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem'}}
          >
            <div className="nav-brand">
              <span className="brand-icon">🛍️</span>
              <span className="brand-text">Qurly</span>
            </div>
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>
              Welcome, {user?.username || user?.email}
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{
                ...navButtonStyle,
                background: currentView === 'dashboard' ? '#667eea' : 'transparent',
                color: currentView === 'dashboard' ? 'white' : '#94a3b8',
              }}
            >
              <FiBarChart2 size={18} />
              Dashboard
            </button>
            <button 
              onClick={handleLogout}
              style={navButtonStyle}
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'dashboard' && isAuthenticated ? (
        <Dashboard onSelectReport={(reportId) => { setSelectedReportId(reportId); setCurrentView('analyze'); }} onLogout={handleLogout} />
      ) : selectedReportId ? (
        // Show detailed report view with history and recommendations
        <main className="main-content">
          <section style={{marginTop: '2rem', marginBottom: '2rem'}}>
            <button 
              onClick={() => { setSelectedReportId(null); setCurrentView('analyze'); }}
              style={{padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
            >
              ← Back to Analysis
            </button>
          </section>
          <HistoricalTracking reportId={selectedReportId} />
          <ConfidenceExplainer reportId={selectedReportId} />
          <RecommendationActions 
            reportId={selectedReportId}
            originalDescription={result?.product_data.description}
            originalTitle={result?.product_data.title}
            onActionApplied={() => handleSaveReport()}
          />
        </main>
      ) : (
        <>
          {/* Hero Section */}
          <header className="hero">
            <div className="hero-content">
              <div className="hero-badge">🚀 AI-Powered Product Intelligence</div>
              <h1 className="hero-title">Optimize Your Shopify Products for AI Agents</h1>
              <p className="hero-subtitle">Understand how AI shopping agents perceive your products and boost recommendations with data-driven insights</p>
              
              {/* Input Section */}
              <section className="input-section">
                <div className="input-wrapper">
              <div className="input-group">
                <FiSearch className="input-icon" />
                <input
                  type="text"
                  placeholder="Paste your Shopify product URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="url-input"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`analyze-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FiZap size={18} />
                    <span>Analyze Now</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="error-alert">
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </section>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-content">
        {loading ? (
          <LoadingSkeleton />
        ) : !result ? (
          <section className="features-section">
            <div className="features-container">
              <h2>How Qurly Works</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon"><FiTarget /></div>
                  <h3>Analyze</h3>
                  <p>Extract and analyze your product data using advanced NLP</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><FiTrendingUp /></div>
                  <h3>Score</h3>
                  <p>Get scores on clarity, trust, completeness, and structure</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><FiCheckCircle /></div>
                  <h3>Optimize</h3>
                  <p>Receive actionable recommendations to improve AI perception</p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {result && (
          <div className="results-container">
            {/* AI Perception Overview */}
            <section className="perception-section">
              <AIPerception perception={result.ai_perception} score={result.scores.overall} />
            </section>

            {/* Confidence Explainer */}
            {result.confidence_scores && (
              <section style={{marginBottom: '2rem'}}>
                <ConfidenceExplainer explanations={result.confidence_scores} />
              </section>
            )}

            {/* Scores Grid */}
            <section className="scores-section">
              <h2>Performance Metrics</h2>
              <div className="scores-grid">
                <ScoreCard label="Clarity" score={result.scores.clarity} />
                <ScoreCard label="Trust" score={result.scores.trust} />
                <ScoreCard label="Completeness" score={result.scores.completeness} />
                <ScoreCard label="Structure" score={result.scores.structure} />
              </div>
            </section>

            {/* Recommendation Actions (AI Optimization Suite) */}
            <section style={{marginBottom: '2rem'}}>
              <RecommendationActions 
                reportId={selectedReportId}
                originalDescription={result.product_data.description}
                originalTitle={result.product_data.title}
                onActionApplied={() => setShowSavePrompt(true)}
              />
            </section>

            {/* Issues & Recommendations */}
            {result.issues && result.issues.length > 0 && (
              <section className="issues-section">
                <IssuesList issues={result.issues} />
              </section>
            )}

            {/* Rewrite Feature */}
            <section className="rewrite-section">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <button 
                  className="rewrite-button"
                  onClick={() => setShowRewriteModal(true)}
                >
                  <FiZap size={18} />
                  Generate AI-Optimized Description
                </button>
                <button 
                  className="rewrite-button"
                  onClick={() => setShowComparisonModal(true)}
                  style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                >
                  <FiBarChart2 size={18} />
                  Compare with Another Product
                </button>
              </div>
            </section>

            {/* Save Report Prompt */}
            {showSavePrompt && (
              <div style={{
                padding: '1.5rem',
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '0.75rem',
                marginBottom: '2rem',
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: '#92400e', fontWeight: '600'}}>Save this analysis to your dashboard?</span>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button 
                      onClick={handleSaveReport}
                      style={{padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600'}}
                    >
                      Save Analysis
                    </button>
                    <button 
                      onClick={() => setShowSavePrompt(false)}
                      style={{padding: '0.5rem 1rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', cursor: 'pointer'}}
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New Analysis Button */}
            <section className="new-analysis">
              <button 
                className="new-analysis-button"
                onClick={() => {
                  setUrl('');
                  setResult(null);
                  setError('');
                  setShowSavePrompt(false);
                  setSelectedReportId(null);
                }}
              >
                Analyze Another Product
              </button>
            </section>
          </div>
        )}
      </main>
      </>
      )}

      {/* Rewrite Modal */}
      {showRewriteModal && result && (
        <RewriteModal
          productData={result.product_data}
          onClose={() => setShowRewriteModal(false)}
        />
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <ComparisonView
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Qurly. Optimizing e-commerce for AI agents.</p>
          <p className="footer-subtitle">Built with intelligence, designed for conversion.</p>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  );
}

const navButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  background: 'transparent',
  border: '1px solid #667eea',
  borderRadius: '0.5rem',
  color: '#667eea',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '600',
  transition: 'all 0.25s ease',
};

export default App;

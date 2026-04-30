import React, { useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiTrendingUp, FiTarget, FiMail, FiPhone, FiZap, FiBarChart2, FiCode, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import LoginForm from './LoginForm';
import '../styles/LandingPage.css';

function LandingPage({ onGetStarted, onLogin }) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
      await axios.post(`${API_URL}/api/contact`, contactForm);
      
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="nav-brand">
            <span className="brand-icon">🛍️</span>
            <span className="brand-text">Qurly</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button 
              className="nav-link-btn"
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
            >
              Login
            </button>
            <button 
              className="nav-cta"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
            >
              Sign Up
              <FiArrowRight size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            {/* <div className="hero-badge">🚀 AI-Powered Product Intelligence</div> */}
            <h1 className="hero-title">Optimize Your Shopify Products for AI Agents</h1>
            <p className="hero-subtitle">
              Understand how AI shopping agents perceive your products. Get data-driven insights to boost recommendations, improve conversions, and stay ahead of the AI-commerce revolution.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
              >
                Sign Up Free
                <FiZap size={18} />
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
              >
                Login
                <FiArrowRight size={18} />
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Products Analyzed</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">2x</span>
                <span className="stat-label">Avg. Score Improvement</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-graphic">
              <div className="graphic-card gradient-1">
                <FiTrendingUp size={32} />
                <p>Performance</p>
              </div>
              <div className="graphic-card gradient-2">
                <FiBarChart2 size={32} />
                <p>Analytics</p>
              </div>
              <div className="graphic-card gradient-3">
                <FiZap size={32} />
                <p>Optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features for E-commerce Success</h2>
          <p>Everything you need to optimize products for AI agents</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #9A7D5D 0%, #8B6F47 100%)'}}>  
              <FiTarget size={24} />
            </div>
            <h3>AI Perception Analysis</h3>
            <p>Understand exactly how AI shopping agents perceive and interpret your product information</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #D4AF37 0%, #C89A3E 100%)'}}>  
              <FiTrendingUp size={24} />
            </div>
            <h3>Performance Scoring</h3>
            <p>Get detailed scores on clarity, trust, completeness, and structural optimization</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #8B6F47 0%, #6F5A3D 100%)'}}>  
              <FiZap size={24} />
            </div>
            <h3>AI-Powered Recommendations</h3>
            <p>Receive actionable recommendations to boost AI agent recommendations and conversions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #A89968 0%, #9A8859 100%)'}}>  
              <FiBarChart2 size={24} />
            </div>
            <h3>Benchmark Comparison</h3>
            <p>Compare your products against industry benchmarks and competitors</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #D4AF37 0%, #B8956F 100%)'}}>  
              <FiCode size={24} />
            </div>
            <h3>Automatic Optimization</h3>
            <p>Auto-generate optimized product descriptions and metadata for AI agents</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{background: 'linear-gradient(135deg, #7A6D52 0%, #5C4D3D 100%)'}}>  
              <FiUsers size={24} />
            </div>
            <h3>Dashboard & Tracking</h3>
            <p>Track historical improvements and monitor AI perception scores over time</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How Qurly Works</h2>
          <p>Simple, powerful, AI-optimized in 3 steps</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Paste Your URL</h3>
            <p>Enter your Shopify product URL or upload product data</p>
            <div className="step-icon">🔗</div>
          </div>

          <div className="step-arrow">
            <FiArrowRight size={24} />
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our advanced NLP engine analyzes your product for AI perception</p>
            <div className="step-icon">🧠</div>
          </div>

          <div className="step-arrow">
            <FiArrowRight size={24} />
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Insights</h3>
            <p>Receive scores, recommendations, and optimized content</p>
            <div className="step-icon">📊</div>
          </div>
        </div>

        <div className="benefits-grid">
          <div className="benefit">
            <FiCheckCircle size={24} className="benefit-icon" />
            <h4>Real-time Analysis</h4>
            <p>Instant results without waiting</p>
          </div>
          <div className="benefit">
            <FiCheckCircle size={24} className="benefit-icon" />
            <h4>AI-Powered</h4>
            <p>Latest NLP technology</p>
          </div>
          <div className="benefit">
            <FiCheckCircle size={24} className="benefit-icon" />
            <h4>Actionable</h4>
            <p>Ready-to-implement suggestions</p>
          </div>
          <div className="benefit">
            <FiCheckCircle size={24} className="benefit-icon" />
            <h4>Data-Driven</h4>
            <p>Backed by industry research</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>About Qurly</h2>
            <p>
              Qurly is revolutionizing e-commerce by bridging the gap between human shopping and AI agent shopping. As AI-powered shopping agents become increasingly prevalent, your product data needs to be optimized for both humans and machines.
            </p>
            <p>
              We built Qurly because we saw that most e-commerce businesses were optimizing for search engines and human customers, but completely overlooking AI agents. This oversight was leaving significant conversion opportunities on the table.
            </p>
            
            <div className="about-points">
              <div className="about-point">
                <FiCheckCircle size={20} />
                <div>
                  <h4>Mission-Driven</h4>
                  <p>We believe the future of e-commerce is AI-first</p>
                </div>
              </div>
              <div className="about-point">
                <FiCheckCircle size={20} />
                <div>
                  <h4>Expert Team</h4>
                  <p>Built by AI researchers and e-commerce veterans</p>
                </div>
              </div>
              <div className="about-point">
                <FiCheckCircle size={20} />
                <div>
                  <h4>Customer Success</h4>
                  <p>Your growth is our success metric</p>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
            >
              Start Optimizing Now
              <FiArrowRight size={18} />
            </button>
          </div>

          <div className="about-stats">
            <div className="stat-box">
              <div className="stat-number">500+</div>
              <p>Products Analyzed</p>
            </div>
            <div className="stat-box">
              <div className="stat-number">50+</div>
              <p>Active Users</p>
            </div>
            <div className="stat-box">
              <div className="stat-number">2x</div>
              <p>Avg. Score Increase</p>
            </div>
            <div className="stat-box">
              <div className="stat-number">90%</div>
              <p>User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>Have questions? We'd love to hear from you</p>
        </div>

        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <FiMail size={24} />
              </div>
              <div>
                <h4>Email</h4>
                <p>aditi1411ss@gmail.com</p>
                <a href="mailto:aditi1411ss@gmail.com" className="contact-link">Send us an email</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiPhone size={24} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+91 8799550781</p>
                <a href="tel:+918799550781" className="contact-link">Call us</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
              className="form-input"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={contactForm.message}
              onChange={handleContactChange}
              required
              rows="5"
              className="form-input"
            ></textarea>
            <button type="submit" className="btn btn-primary">
              Send Message
              <FiArrowRight size={18} />
            </button>
            {contactSubmitted && (
              <div className="success-message">
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Optimize Your Products for AI Agents?</h2>
          <p>Join thousands of e-commerce businesses already using Qurly</p>
          <button 
            className="btn btn-light"
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
          >
            Get Started Free
            <FiArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowAuthModal(false)}
            >
              ✕
            </button>
            <div className="auth-modal-content">
              <div className="auth-modal-header">
                <h2>{authMode === 'login' ? 'Login to Qurly' : 'Create Your Account'}</h2>
                <p>{authMode === 'login' ? 'Welcome back!' : 'Start optimizing your products today'}</p>
              </div>
              <LoginForm 
                onLogin={(user, token) => {
                  // Call the parent's handleLogin to update app state
                  if (onLogin) {
                    onLogin(token, user);
                  }
                  // Close modal and navigate to app
                  setShowAuthModal(false);
                  onGetStarted();
                }}
                isSignup={authMode === 'signup'}
              />
              <div className="auth-modal-footer">
                <p>
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    className="auth-toggle-btn"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  >
                    {authMode === 'login' ? 'Sign up' : 'Login'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">🛍️</span>
            <span className="brand-text">Qurly</span>
            <p>AI-Powered Product Intelligence for E-commerce</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#contact">Contact</a>
              <a href="#docs">Documentation</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Qurly. All rights reserved. | Built with ❤️ for e-commerce</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

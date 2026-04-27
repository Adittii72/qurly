import React, { useState } from 'react';
import { FiMail, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * LoginForm Component - Authentication for Qurly
 */
function LoginForm({ onLogin, onLoginSuccess, isSignup = false }) {
  const [isLoginMode, setIsLoginMode] = useState(!isSignup);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLoginMode) {
        // Login
        response = await axios.post(`${API_URL}/api/auth/login`, {
          email
        });
      } else {
        // Signup
        response = await axios.post(`${API_URL}/api/auth/signup`, {
          email,
          username
        });
      }

      // Store token
      localStorage.setItem('qurly_token', response.data.access_token);
      localStorage.setItem('qurly_user', JSON.stringify(response.data.user));

      // Call the appropriate callback
      if (onLogin) {
        onLogin(response.data.user, response.data.access_token);
      } else if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        (isLoginMode ? 'Login failed' : 'Signup failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>✨ Qurly</h1>
          <p style={styles.subtitle}>AI Product Analysis Platform</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <FiMail size={18} color="#9A7D5D" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          {!isLoginMode && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <FiUser size={18} color="#9A7D5D" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  style={styles.input}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Sign Up'}
          </button>

          <div style={styles.toggle}>
            <p style={styles.toggleText}>
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                style={styles.toggleBtn}
              >
                {isLoginMode ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </form>

        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📊</span>
            <p style={styles.featureText}>Save Analysis Reports</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📈</span>
            <p style={styles.featureText}>Track Over Time</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🤖</span>
            <p style={styles.featureText}>AI-Powered Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #9A7D5D 0%, #8B6F47 100%)',
    padding: '1rem',
  },
  card: {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #9A7D5D 0%, #8B6F47 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  subtitle: {
    color: '#8B7D6B',
    margin: '0.5rem 0 0',
  },
  form: {
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: '1.5rem',
  },
  errorBox: {
    padding: '1rem',
    background: '#FADDD1',
    border: '1px solid #F5A594',
    borderRadius: '0.75rem',
    color: '#C85141',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    border: '1px solid #E8D4B0',
    borderRadius: '0.75rem',
    background: '#F9F7F4',
    transition: 'all 0.25s ease',
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#2C2C2C',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #9A7D5D 0%, #8B6F47 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 15px rgba(154, 125, 93, 0.4)',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E8D4B0',
  },
  toggleText: {
    color: '#5C4D3D',
    margin: 0,
    fontSize: '0.875rem',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#9A7D5D',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: '0.5rem',
  },
  features: {
    display: 'grid',
    gap: '1rem',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  featureIcon: {
    fontSize: '1.5rem',
  },
  featureText: {
    color: '#475569',
    fontSize: '0.875rem',
    margin: 0,
  },
};

export default LoginForm;

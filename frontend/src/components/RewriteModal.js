import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function RewriteModal({ description, title, onClose }) {
  const [loading, setLoading] = useState(false);
  const [rewritten, setRewritten] = useState(null);
  const [error, setError] = useState('');

  const handleRewrite = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/rewrite-description`, {
        description,
        product_title: title,
      });

      setRewritten(response.data);
    } catch (err) {
      setError('Error rewriting description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Optimize Description</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {!rewritten ? (
          <div className="modal-body">
            <p>Generate an AI-optimized version of your product description</p>
            {error && <div className="error-message">{error}</div>}
            <button
              onClick={handleRewrite}
              disabled={loading}
              className="rewrite-button-modal"
            >
              {loading ? 'Generating...' : 'Generate Optimized Description'}
            </button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="description-comparison">
              <div className="description-section">
                <h3>Original</h3>
                <p className="description-text">{rewritten.original}</p>
              </div>

              <div className="description-section">
                <h3>Optimized ✨</h3>
                <p className="description-text optimized">{rewritten.rewritten}</p>
                <button
                  onClick={() => handleCopy(rewritten.rewritten)}
                  className="copy-button"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>

            <div className="improvements">
              <h3>Improvements Made</h3>
              <ul>
                {rewritten.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
              <p className="score-boost">
                📈 Estimated Score Boost: +{rewritten.estimated_score_boost} points
              </p>
            </div>

            <button onClick={onClose} className="done-button">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RewriteModal;

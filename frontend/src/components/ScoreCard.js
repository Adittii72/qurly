import React from 'react';

function ScoreCard({ scores }) {
  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981'; // Green
    if (score >= 6) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const MetricBar = ({ label, value }) => (
    <div className="metric-bar">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value.toFixed(1)}/10</div>
      <div className="metric-bar-container">
        <div
          className="metric-bar-fill"
          style={{
            width: `${(value / 10) * 100}%`,
            backgroundColor: getScoreColor(value),
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="card score-card">
      <h2>📊 Score Breakdown</h2>
      <div className="overall-score">
        <div className="score-circle">
          <span className="score-number">{scores.overall.toFixed(1)}</span>
          <span className="score-max">/100</span>
        </div>
        <div className="score-label">Overall Score</div>
      </div>

      <div className="metrics">
        <MetricBar label="Clarity" value={scores.clarity} />
        <MetricBar label="Trust" value={scores.trust} />
        <MetricBar label="Completeness" value={scores.completeness} />
        <MetricBar label="Structure" value={scores.structure} />
      </div>

      <div className="score-info">
        <p>
          <strong>Clarity:</strong> How clear and readable is your description?
        </p>
        <p>
          <strong>Trust:</strong> How trustworthy is your product? (reviews, policies)
        </p>
        <p>
          <strong>Completeness:</strong> How complete is your data? (specs, images, FAQs)
        </p>
        <p>
          <strong>Structure:</strong> How well-structured is your information?
        </p>
      </div>
    </div>
  );
}

export default ScoreCard;

import React from 'react';

function BeforeAfter({ currentScore, potentialImprovement }) {
  const potentialScore = currentScore + potentialImprovement;
  const improvementPercent = (potentialImprovement / currentScore) * 100;

  return (
    <div className="card before-after-card">
      <h2>📈 Before vs After Simulation</h2>
      <p className="subtitle">If you implement the top suggestions:</p>

      <div className="before-after-container">
        <div className="before">
          <h3>Current Score</h3>
          <div className="score-display">{currentScore.toFixed(1)}/100</div>
        </div>

        <div className="arrow">→</div>

        <div className="after">
          <h3>Projected Score</h3>
          <div className="score-display">{potentialScore.toFixed(1)}/100</div>
        </div>
      </div>

      <div className="improvement-stats">
        <div className="stat">
          <span className="stat-label">Score Improvement</span>
          <span className="stat-value">+{potentialImprovement.toFixed(1)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Percentage Gain</span>
          <span className="stat-value">+{improvementPercent.toFixed(1)}%</span>
        </div>
      </div>

      <div className="improvement-note">
        💡 This projection assumes you fix all HIGH priority issues and most MEDIUM priority issues.
      </div>
    </div>
  );
}

export default BeforeAfter;

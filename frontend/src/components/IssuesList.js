import React from 'react';

function IssuesList({ issues }) {
  const priorityIcons = {
    HIGH: '🔴',
    MEDIUM: '🟡',
    LOW: '🟢',
  };

  return (
    <div className="card issues-card">
      <h2>⚠️ Key Issues (Ranked by Impact)</h2>
      <div className="issues-list">
        {issues.map((issue, idx) => (
          <div key={idx} className={`issue-item issue-${issue.priority.toLowerCase()}`}>
            <div className="issue-header">
              <span className="priority-icon">{priorityIcons[issue.priority]}</span>
              <h3>{issue.title}</h3>
            </div>
            <p className="issue-description">{issue.description}</p>
            <div className="issue-suggestion">
              <strong>💡 Suggestion:</strong> {issue.suggestion}
            </div>
            <div className="issue-impact">
              <strong>📈 Impact:</strong> {issue.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssuesList;

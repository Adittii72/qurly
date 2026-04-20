import React from 'react';

function AIPerception({ perception }) {
  return (
    <div className="card ai-perception">
      <h2>🔍 How AI Agents See Your Product</h2>
      <div className="perception-content">
        <p>{perception}</p>
      </div>
    </div>
  );
}

export default AIPerception;

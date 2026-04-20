import React from 'react';

function BenchmarkComparison({ comparison }) {
  const MetricComparison = ({ label, current, ideal, gap }) => (
    <div className="metric-comparison">
      <div className="metric-label">{label}</div>
      <div className="metric-bars">
        <div className="bar-current">
          <div
            className="bar-fill"
            style={{ width: `${(current / ideal) * 100}%` }}
          >
            {current.toFixed(1)}
          </div>
        </div>
        <span className="bar-label">/ {ideal}</span>
      </div>
      <div className="metric-gap">
        <strong>{gap > 0 ? '+' : ''}{gap.toFixed(1)}</strong> to ideal
      </div>
    </div>
  );

  return (
    <div className="card benchmark-card">
      <h2>📊 Benchmark Comparison</h2>
      <p className="benchmark-subtitle">Your Product vs Ideal Standard</p>

      <div className="benchmark-metrics">
        <MetricComparison
          label="Clarity"
          current={comparison.clarity.current}
          ideal={comparison.clarity.ideal}
          gap={comparison.clarity.gap}
        />
        <MetricComparison
          label="Trust"
          current={comparison.trust.current}
          ideal={comparison.trust.ideal}
          gap={comparison.trust.gap}
        />
        <MetricComparison
          label="Completeness"
          current={comparison.completeness.current}
          ideal={comparison.completeness.ideal}
          gap={comparison.completeness.gap}
        />
        <MetricComparison
          label="Structure"
          current={comparison.structure.current}
          ideal={comparison.structure.ideal}
          gap={comparison.structure.gap}
        />
        <div className="metric-comparison overall">
          <div className="metric-label">Overall</div>
          <div className="metric-bars">
            <div className="bar-current">
              <div
                className="bar-fill"
                style={{
                  width: `${(comparison.overall.current / comparison.overall.ideal) * 100}%`,
                }}
              >
                {comparison.overall.current.toFixed(1)}
              </div>
            </div>
            <span className="bar-label">/ {comparison.overall.ideal}</span>
          </div>
          <div className="metric-gap">
            <strong>{comparison.overall.gap.toFixed(1)}</strong> points to ideal
          </div>
        </div>
      </div>
    </div>
  );
}

export default BenchmarkComparison;

import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-circle"></div>
              <div className="skeleton-text skeleton-title"></div>
            </div>
            <div className="skeleton-body">
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line short"></div>
            </div>
          </div>
        );
      
      case 'score':
        return (
          <div className="skeleton-score">
            <div className="skeleton-circle large"></div>
            <div className="skeleton-text skeleton-label"></div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-icon"></div>
            <div className="skeleton-content">
              <div className="skeleton-text skeleton-line"></div>
              <div className="skeleton-text skeleton-line short"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-row">
              <div className="skeleton-text skeleton-cell"></div>
              <div className="skeleton-text skeleton-cell"></div>
              <div className="skeleton-text skeleton-cell"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="skeleton-text skeleton-line"></div>
        );
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

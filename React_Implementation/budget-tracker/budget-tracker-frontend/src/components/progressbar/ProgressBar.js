import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ percent = 0, height = 10, color = 'purple', showLabel = true, leftLabel, rightLabel }) => {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="progress-bar-wrapper">
      {showLabel && (
        <div className="progress-bar-header">
          <span>{leftLabel || `${clampedPercent}%`}</span>
          {rightLabel && <span>{rightLabel}</span>}
        </div>
      )}
      <div className="progress-bar-track" style={{ height: `${height}px` }}>
        <div
          className={`progress-bar-fill ${color}`}
          style={{ width: `${clampedPercent}%`, height: '100%' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

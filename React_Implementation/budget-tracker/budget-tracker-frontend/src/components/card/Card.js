import React from 'react';
import './Card.css';

const Card = ({ label, value, icon, color = 'purple', sub }) => {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-card-info">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  );
};

export default Card;

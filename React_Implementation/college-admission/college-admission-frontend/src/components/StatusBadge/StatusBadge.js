import React from 'react';
import './StatusBadge.css';

function StatusBadge({ status }) {
  const map = {
    'Pending': { cls: 'pending', icon: '⏳' },
    'Under Review': { cls: 'review', icon: '🔍' },
    'Approved': { cls: 'approved', icon: '✅' },
    'Rejected': { cls: 'rejected', icon: '❌' },
    'Accepted': { cls: 'approved', icon: '🎉' },
    'Completed': { cls: 'approved', icon: '✅' },
  };
  const info = map[status] || { cls: 'pending', icon: '❓' };
  return (
    <span className={`status-badge ${info.cls}`}>
      {info.icon} {status}
    </span>
  );
}

export default StatusBadge;

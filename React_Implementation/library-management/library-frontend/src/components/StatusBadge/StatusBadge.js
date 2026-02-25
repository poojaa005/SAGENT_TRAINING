import React from 'react';
import './StatusBadge.css';

const statusConfig = {
  AVAILABLE: { label: 'Available', color: 'green' },
  ISSUED: { label: 'Issued', color: 'amber' },
  DAMAGED: { label: 'Damaged', color: 'red' },
  PENDING: { label: 'Pending', color: 'amber' },
  APPROVED: { label: 'Approved', color: 'green' },
  REJECTED: { label: 'Rejected', color: 'red' },
  RETURNED: { label: 'Returned', color: 'teal' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  PAID: { label: 'Paid', color: 'green' },
  UNPAID: { label: 'Unpaid', color: 'red' },
  READ: { label: 'Read', color: 'teal' },
  UNREAD: { label: 'Unread', color: 'amber' },
};

function StatusBadge({ status }) {
  const config = statusConfig[status?.toUpperCase()] || { label: status, color: 'default' };
  return (
    <span className={`status-badge status-badge--${config.color}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;

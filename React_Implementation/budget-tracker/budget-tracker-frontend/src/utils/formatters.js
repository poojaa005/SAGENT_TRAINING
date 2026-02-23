export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getProgress = (saved, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((saved / target) * 100), 100);
};

export const getCategoryColor = (category) => {
  const colors = {
    food: '#f59e0b',
    travel: '#3b82f6',
    shopping: '#ec4899',
    entertainment: '#8b5cf6',
    health: '#22c55e',
    utilities: '#14b8a6',
    education: '#f97316',
    other: '#6b7280',
  };
  const key = category?.toLowerCase() || 'other';
  return colors[key] || colors['other'];
};

export const getCategoryIcon = (category) => {
  const icons = {
    food: 'fa-utensils',
    travel: 'fa-plane',
    shopping: 'fa-shopping-bag',
    entertainment: 'fa-film',
    health: 'fa-heartbeat',
    utilities: 'fa-bolt',
    education: 'fa-graduation-cap',
    other: 'fa-tag',
  };
  const key = category?.toLowerCase() || 'other';
  return icons[key] || icons['other'];
};

import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import './BookCard.css';

const CATEGORY_COLORS = ['#c9a84c', '#2dd4bf', '#818cf8', '#f472b6', '#34d399', '#fb923c'];

function getColor(category) {
  let hash = 0;
  for (let c of (category || '')) hash = c.charCodeAt(0) + hash * 31;
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

function getStatus(qty) {
  if (qty === 0) return 'ISSUED';
  if (qty < 0) return 'DAMAGED';
  return 'AVAILABLE';
}

function BookCard({ book, onEdit, onDelete, onBorrow }) {
  const color = getColor(book.book_category);
  const status = getStatus(book.book_quantity);

  return (
    <div className="book-card fade-in">
      <div className="book-card__spine" style={{ background: color }} />
      <div className="book-card__content">
        <div className="book-card__category" style={{ color }}>{book.book_category}</div>
        <h3 className="book-card__title">{book.book_title}</h3>
        <p className="book-card__author">by {book.book_author}</p>
        <div className="book-card__footer">
          <StatusBadge status={status} />
          <span className="book-card__qty">Qty: {book.book_quantity}</span>
        </div>
        <div className="book-card__actions">
          {onBorrow && status === 'AVAILABLE' && (
            <button className="btn btn--primary btn--sm" onClick={() => onBorrow(book)}>Borrow</button>
          )}
          {onEdit && (
            <button className="btn btn--ghost btn--sm" onClick={() => onEdit(book)}>Edit</button>
          )}
          {onDelete && (
            <button className="btn btn--danger btn--sm" onClick={() => onDelete(book.book_id)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;

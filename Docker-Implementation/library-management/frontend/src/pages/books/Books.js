import React, { useEffect, useState } from 'react';
import { bookService } from '../../services/bookService';
import { borrowService } from '../../services/borrowService';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import Modal from '../../components/Modal/Modal';
import './Books.css';

function Books() {
  const { user, isMember } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [borrowModal, setBorrowModal] = useState({ open: false, book: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    bookService.getAll()
      .then(setBooks)
      .catch((err) => {
        setBooks([]);
        const status = err?.response?.status;
        setError(status === 403 ? 'You are not allowed to view books.' : 'Failed to load books.');
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...new Set(books.map(b => b.book_category))];

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.book_title.toLowerCase().includes(q) ||
      b.book_author.toLowerCase().includes(q) ||
      b.book_category.toLowerCase().includes(q);
    const matchFilter = filter === 'ALL' || b.book_category === filter;
    return matchSearch && matchFilter;
  });

  const handleBorrow = async (book) => {
    if (!user?.memberId) return;
    setError('');
    try {
      await borrowService.createRequest(user.memberId, book.book_id);
      setMessage('Borrow request submitted successfully!');
      setBorrowModal({ open: false, book: null });
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="books-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Book Catalog</h1>
        <p className="page-subtitle">Search and browse all available books</p>
      </div>

      {message && <div className="alert alert--success">{message}</div>}
      {error && <div className="alert alert--error">{error}</div>}

      <div className="books-filters">
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            className="search-bar__input"
            placeholder="Search by title, author, or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="books-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${filter === cat ? 'category-btn--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <p className="empty-state__text">No books found</p>
        </div>
      ) : (
        <div className="books-grid">
          {filtered.map(book => (
            <BookCard
              key={book.book_id}
              book={book}
              onBorrow={isMember ? (b) => setBorrowModal({ open: true, book: b }) : undefined}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={borrowModal.open}
        onClose={() => setBorrowModal({ open: false, book: null })}
        title="Request to Borrow"
        size="sm"
      >
        <div className="borrow-confirm">
          <p className="borrow-confirm__text">
            You're requesting to borrow:
          </p>
          <div className="borrow-confirm__book">
            <strong>{borrowModal.book?.book_title}</strong>
            <span>by {borrowModal.book?.book_author}</span>
          </div>
          <p className="borrow-confirm__note">
            The librarian will review and approve your request.
          </p>
          <div className="form-actions">
            <button className="btn btn--secondary btn--md" onClick={() => setBorrowModal({ open: false, book: null })}>
              Cancel
            </button>
            <button className="btn btn--primary btn--md" onClick={() => handleBorrow(borrowModal.book)}>
              Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Books;

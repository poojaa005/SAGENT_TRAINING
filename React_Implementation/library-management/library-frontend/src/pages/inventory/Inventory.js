import React, { useEffect, useState } from 'react';
import { bookService } from '../../services/bookService';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Modal/Modal';
import './Inventory.css';

const emptyBook = { book_title: '', book_author: '', book_category: '', book_quantity: 1 };

function getStatus(qty) {
  if (qty === 0) return 'ISSUED';
  if (qty < 0) return 'DAMAGED';
  return 'AVAILABLE';
}

function Inventory() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState(emptyBook);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const data = await bookService.getAll();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    return !q ||
      b.book_title.toLowerCase().includes(q) ||
      b.book_author.toLowerCase().includes(q) ||
      b.book_category.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setForm(emptyBook);
    setError('');
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (book) => {
    setForm({
      book_title: book.book_title,
      book_author: book.book_author,
      book_category: book.book_category,
      book_quantity: book.book_quantity,
    });
    setError('');
    setModal({ open: true, mode: 'edit', data: book });
  };

  const markDamaged = async (book) => {
    await bookService.update(book.book_id, { ...book, book_quantity: -1 });
    showMsg('Book marked as damaged.');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (modal.mode === 'create') {
        await bookService.create(form);
        showMsg('Book added to catalog.');
      } else {
        await bookService.update(modal.data.book_id, form);
        showMsg('Book updated successfully.');
      }
      setModal({ open: false, mode: 'create', data: null });
      load();
    } catch {
      setError('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book from the catalog?')) return;
    await bookService.delete(id);
    showMsg('Book deleted from catalog.');
    load();
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const totalBooks = books.reduce((s, b) => s + Math.max(0, b.book_quantity), 0);
  const availableBooks = books.filter(b => b.book_quantity > 0).length;
  const damagedBooks = books.filter(b => b.book_quantity < 0).length;

  return (
    <div className="inventory-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-subtitle">Add, update, and manage the book catalog</p>
      </div>

      {message && <div className="alert alert--success">{message}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--gold">📚</div>
          <div>
            <div className="stat-card__value">{books.length}</div>
            <div className="stat-card__label">Total Titles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">✅</div>
          <div>
            <div className="stat-card__value">{availableBooks}</div>
            <div className="stat-card__label">Available</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber">📦</div>
          <div>
            <div className="stat-card__value">{totalBooks}</div>
            <div className="stat-card__label">Total Copies</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red">⚠️</div>
          <div>
            <div className="stat-card__value">{damagedBooks}</div>
            <div className="stat-card__label">Damaged / Lost</div>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            className="search-bar__input"
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn--primary btn--md" onClick={openCreate}>+ Add Book</button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-state__icon">📚</div>
                    <p className="empty-state__text">No books found</p>
                  </div>
                </td></tr>
              ) : filtered.map(book => (
                <tr key={book.book_id}>
                  <td>#{book.book_id}</td>
                  <td><strong className="inventory-title">{book.book_title}</strong></td>
                  <td>{book.book_author}</td>
                  <td><span className="inventory-category">{book.book_category}</span></td>
                  <td>{book.book_quantity}</td>
                  <td><StatusBadge status={getStatus(book.book_quantity)} /></td>
                  <td>
                    <div className="data-table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(book)}>Edit</button>
                      <button className="btn btn--teal btn--sm" onClick={() => markDamaged(book)}>Mark Damaged</button>
                      <button className="btn btn--danger btn--sm" onClick={() => handleDelete(book.book_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', data: null })}
        title={modal.mode === 'create' ? 'Add New Book' : 'Edit Book'}
      >
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input className="form-input" placeholder="e.g. The Great Gatsby" value={form.book_title}
              onChange={e => setForm({ ...form, book_title: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Author</label>
              <input className="form-input" placeholder="Author name" value={form.book_author}
                onChange={e => setForm({ ...form, book_author: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-input" placeholder="e.g. Fiction, Science" value={form.book_category}
                onChange={e => setForm({ ...form, book_category: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" min="0" value={form.book_quantity}
              onChange={e => setForm({ ...form, book_quantity: parseInt(e.target.value) })} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary btn--md"
              onClick={() => setModal({ open: false, mode: 'create', data: null })}>Cancel</button>
            <button type="submit" className="btn btn--primary btn--md">
              {modal.mode === 'create' ? 'Add Book' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;

import React, { useState, useEffect, useRef } from 'react';
import { bookService } from '../../services/bookService';
import { memberService } from '../../services/memberService';
import { fineService } from '../../services/fineService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import {
  getBookRecommendations,
  smartBookSearch,
  generateOverdueNotification,
  generateBookSummary,
} from '../../services/aiService';
import BookCard from '../../components/BookCard/BookCard';
import './AI.css';

const TABS = [
  { id: 'chatbot', icon: '🤖', label: 'Book Chatbot' },
  { id: 'search',  icon: '🔍', label: 'Smart Search' },
  { id: 'fines',   icon: '🔔', label: 'Overdue Notifier' },
  { id: 'summary', icon: '📖', label: 'Book Summary' },
];

function AiText({ text }) {
  if (!text) return null;
  return (
    <div className="ai-text">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      })}
    </div>
  );
}

// ── Feature 1: Chatbot ───────────────────────────────────────
function ChatbotTab({ books }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: "Hello! I'm your library assistant 📚 Tell me what kind of book you're looking for and I'll recommend the best matches from our catalog.",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const reply = await getBookRecommendations(userMsg, books);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot__messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
            {m.role === 'assistant' && <span className="chat-bubble__avatar">🤖</span>}
            <div className="chat-bubble__body"><AiText text={m.text} /></div>
            {m.role === 'user' && <span className="chat-bubble__avatar chat-bubble__avatar--user">👤</span>}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble--assistant">
            <span className="chat-bubble__avatar">🤖</span>
            <div className="chat-bubble__body chat-bubble__typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chatbot__input-row">
        <textarea
          className="chatbot__input"
          rows={1}
          placeholder="Ask me for a book recommendation…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
        />
        <button className="chatbot__send" onClick={send} disabled={loading || !input.trim()}>➤</button>
      </div>
    </div>
  );
}

// ── Feature 2: Smart Search ──────────────────────────────────
function SmartSearchTab({ books }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResults(null);
    try {
      const matched = await smartBookSearch(query, books);
      setResults(matched);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    'books about space exploration',
    'mystery novels for beginners',
    'self-help books for students',
    'adventure stories for kids',
  ];

  return (
    <div className="smart-search">
      <p className="ai-feature__desc">Search in plain English — describe what you want instead of typing exact titles.</p>
      <div className="smart-search__bar">
        <input
          className="smart-search__input"
          placeholder="e.g. 'books about artificial intelligence for beginners'…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button className="btn btn--primary btn--md" onClick={search} disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : '🔍 AI Search'}
        </button>
      </div>
      <div className="smart-search__examples">
        <span className="smart-search__examples-label">Try: </span>
        {examples.map(ex => (
          <button key={ex} className="example-chip" onClick={() => setQuery(ex)}>{ex}</button>
        ))}
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      {loading && <div className="loading-spinner" />}
      {results !== null && (
        <>
          <p className="smart-search__result-label">
            {results.length === 0 ? '😕 No matching books found.' : `✅ Found ${results.length} matching book(s):`}
          </p>
          <div className="books-grid">
            {results.map(book => <BookCard key={book.book_id} book={book} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ── Feature 3: Overdue Notifier ──────────────────────────────
function FinesNotifierTab({ members, fines }) {
  const [form, setForm] = useState({ memberId: '', bookTitle: '', daysOverdue: '', fineAmount: '' });
  const [generatedMsg, setGeneratedMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const selectedMember = members.find(m => String(m.memberId) === String(form.memberId));

  const autoFill = () => {
    const memberFines = fines.filter(f =>
      String(f.borrowRequest?.member?.memberId || f.member?.memberId) === String(form.memberId)
    );
    if (memberFines.length > 0) {
      const fine = memberFines[0];
      setForm(prev => ({
        ...prev,
        bookTitle: fine.borrowRequest?.book?.book_title || prev.bookTitle,
        daysOverdue: String(fine.daysOverdue || fine.days_overdue || prev.daysOverdue),
        fineAmount: String(fine.amount || prev.fineAmount),
      }));
    }
  };

  const generate = async () => {
    if (!selectedMember || !form.bookTitle || !form.daysOverdue || !form.fineAmount) {
      setError('Please fill in all fields.'); return;
    }
    setError(''); setLoading(true); setGeneratedMsg(''); setSent(false);
    try {
      const msg = await generateOverdueNotification(selectedMember.name, form.bookTitle, form.daysOverdue, form.fineAmount);
      setGeneratedMsg(msg);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    setSending(true);
    try {
      await notificationService.create(form.memberId, generatedMsg);
      setSent(true);
    } catch {
      setError('Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fines-notifier">
      <p className="ai-feature__desc">Generate a personalised overdue reminder using AI and send it directly to the member.</p>
      {error && <div className="alert alert--error">{error}</div>}
      {sent && <div className="alert alert--success">✅ Notification sent to {selectedMember?.name}!</div>}
      <div className="fines-notifier__form">
        <div className="form-group">
          <label className="form-label">Member</label>
          <select className="form-select" value={form.memberId}
            onChange={e => { setForm({ ...form, memberId: e.target.value }); setSent(false); }}>
            <option value="">Select member…</option>
            {members.map(m => <option key={m.memberId} value={m.memberId}>{m.name} (#{m.memberId})</option>)}
          </select>
          {form.memberId && (
            <button className="auto-fill-btn" onClick={autoFill}>⚡ Auto-fill from fines</button>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input className="form-input" placeholder="e.g. The Alchemist" value={form.bookTitle}
              onChange={e => setForm({ ...form, bookTitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Days Overdue</label>
            <input className="form-input" type="number" placeholder="e.g. 5" value={form.daysOverdue}
              onChange={e => setForm({ ...form, daysOverdue: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Fine Amount (Rs.)</label>
          <input className="form-input" type="number" placeholder="e.g. 50" value={form.fineAmount}
            onChange={e => setForm({ ...form, fineAmount: e.target.value })} />
        </div>
        <button className="btn btn--primary btn--md" onClick={generate} disabled={loading}>
          {loading ? '✨ Generating…' : '✨ Generate AI Message'}
        </button>
      </div>
      {generatedMsg && (
        <div className="generated-msg">
          <div className="generated-msg__header">
            <span>AI Generated Message</span>
            <button className="generated-msg__copy" onClick={() => navigator.clipboard.writeText(generatedMsg)}>📋 Copy</button>
          </div>
          <div className="generated-msg__body"><AiText text={generatedMsg} /></div>
          <div className="generated-msg__footer">
            <button className="btn btn--primary btn--md" onClick={sendNotification} disabled={sending || sent}>
              {sending ? 'Sending…' : sent ? '✅ Sent!' : '📤 Send to Member'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feature 4: Book Summary ──────────────────────────────────
function SummaryTab({ books }) {
  const [selectedId, setSelectedId] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedBook = books.find(b => String(b.book_id) === String(selectedId));

  const generate = async () => {
    setLoading(true); setError(''); setSummary('');
    try {
      const result = await generateBookSummary(selectedBook.book_title, selectedBook.book_author, selectedBook.book_category);
      setSummary(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-tab">
      <p className="ai-feature__desc">Select any book and get an AI-generated summary to help members decide whether to borrow it.</p>
      {error && <div className="alert alert--error">{error}</div>}
      <div className="summary-tab__controls">
        <select className="form-select summary-tab__select" value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setSummary(''); }}>
          <option value="">Choose a book…</option>
          {books.map(b => <option key={b.book_id} value={b.book_id}>{b.book_title} — {b.book_author}</option>)}
        </select>
        <button className="btn btn--primary btn--md" onClick={generate} disabled={!selectedId || loading}>
          {loading ? '✨ Generating…' : '✨ Generate Summary'}
        </button>
      </div>
      {selectedBook && (
        <div className="summary-book-card">
          <div className="summary-book-card__spine" />
          <div className="summary-book-card__info">
            <div className="summary-book-card__category">{selectedBook.book_category}</div>
            <div className="summary-book-card__title">{selectedBook.book_title}</div>
            <div className="summary-book-card__author">by {selectedBook.book_author}</div>
          </div>
        </div>
      )}
      {loading && <div className="loading-spinner" />}
      {summary && (
        <div className="summary-result">
          <div className="summary-result__header">✨ AI Summary</div>
          <AiText text={summary} />
        </div>
      )}
    </div>
  );
}

// ── Main AI Page ─────────────────────────────────────────────
function AI() {
  const { isLibrarian } = useAuth();
  const [activeTab, setActiveTab] = useState('chatbot');
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toArray = (result) => (
      result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []
    );

    Promise.allSettled([
      bookService.getAll(),
      isLibrarian ? memberService.getAll() : Promise.resolve([]),
      isLibrarian ? fineService.getAll() : Promise.resolve([]),
    ])
      .then(([booksResult, membersResult, finesResult]) => {
        setBooks(toArray(booksResult));
        setMembers(toArray(membersResult));
        setFines(toArray(finesResult));
      })
      .finally(() => setLoading(false));
  }, [isLibrarian]);

  return (
    <div className="ai-page fade-in">
      <div className="ai-page__header">
        <div className="ai-page__title-row">
          <div className="ai-page__gem">✦</div>
          <div>
            <h1 className="page-title">AI Assistant</h1>
            <p className="page-subtitle">Powered by Google Gemini · 4 smart features for your library</p>
          </div>
        </div>
      </div>
      <div className="ai-tabs">
        {TABS.map(tab => (
          <button key={tab.id} className={`ai-tab ${activeTab === tab.id ? 'ai-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            <span className="ai-tab__icon">{tab.icon}</span>
            <span className="ai-tab__label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="ai-panel">
        {loading ? <div className="loading-spinner" /> : (
          <>
            {activeTab === 'chatbot' && <ChatbotTab books={books} />}
            {activeTab === 'search'  && <SmartSearchTab books={books} />}
            {activeTab === 'fines'   && <FinesNotifierTab members={members} fines={fines} />}
            {activeTab === 'summary' && <SummaryTab books={books} />}
          </>
        )}
      </div>
    </div>
  );
}

export default AI;

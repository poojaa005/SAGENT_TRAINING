import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { memberService } from '../../services/memberService';
import { borrowService } from '../../services/borrowService';
import { fineService } from '../../services/fineService';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

function StatCard({ icon, iconClass, value, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${iconClass}`}>{icon}</div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}

function Home() {
  const { user, isLibrarian } = useAuth();
  const role = user?.role || 'member';
  const libraryId = role === 'librarian'
    ? (user?.librarianId || user?.id || '—')
    : (user?.memberId || user?.id || '—');
  const [stats, setStats] = useState({ books: 0, members: 0, requests: 0, fines: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toArray = (result) => (
      result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []
    );

    const fetchAll = async () => {
      try {
        const [booksResult, requestsResult, finesResult, membersResult] = await Promise.allSettled([
          bookService.getAll(),
          borrowService.getAll(),
          fineService.getAll(),
          isLibrarian ? memberService.getAll() : Promise.resolve([]),
        ]);

        const books = toArray(booksResult);
        const requests = toArray(requestsResult);
        const fines = toArray(finesResult);
        const members = toArray(membersResult);

        const memberId = user?.memberId;
        const userRequests = isLibrarian
          ? requests
          : requests.filter(r => (r.member?.memberId ?? r.memberId) === memberId);
        const userFines = isLibrarian
          ? fines
          : fines.filter(f => {
            const fineMemberId =
              f.member?.memberId ??
              f.borrowRequest?.member?.memberId ??
              f.memberId;
            return fineMemberId === memberId;
          });

        setStats({
          books: books.length,
          members: isLibrarian ? members.length : 1,
          requests: userRequests.filter(r => r.status === 'PENDING').length,
          fines: userFines.length,
        });
        setRecentRequests(userRequests.slice(-5).reverse());
      } catch {
        setStats({ books: 0, members: isLibrarian ? 0 : 1, requests: 0, fines: 0 });
        setRecentRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [isLibrarian, user?.memberId]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="home fade-in">
      <div className="home__welcome">
        <div>
          <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="page-subtitle">Here's what's happening in the library today</p>
        </div>
        <div className="home__library-id">
          <span className="home__library-id-label">{role === 'librarian' ? 'Librarian ID' : 'Member ID'}</span>
          <span className="home__library-id-value"># {libraryId}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard icon="📚" iconClass="gold" value={stats.books} label="Total Books" />
            <StatCard icon="👥" iconClass="teal" value={stats.members} label="Members" />
            <StatCard icon="📋" iconClass="amber" value={stats.requests} label="Pending Requests" />
            <StatCard icon="💰" iconClass="red" value={stats.fines} label="Active Fines" />
          </div>

          <div className="home__grid">
            <div className="home__section">
              <h2 className="home__section-title">Recent Borrow Requests</h2>
              <div className="table-wrapper">
                {recentRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <p className="empty-state__text">No recent requests</p>
                  </div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Book</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map(req => (
                        <tr key={req.request_id}>
                          <td>{req.member?.name || '—'}</td>
                          <td>{req.book?.book_title || '—'}</td>
                          <td>{req.request_date}</td>
                          <td>
                            <span className={`status-pill status-pill--${req.status?.toLowerCase()}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="home__quick-actions">
              <h2 className="home__section-title">Quick Actions</h2>
              <div className="quick-actions-grid">
                {[
                  { to: '/books', icon: '🔍', label: 'Search Books', desc: 'Browse the catalog' },
                  ...(isLibrarian
                    ? [{ to: '/borrow-requests', icon: '📖', label: 'Borrow Requests', desc: 'Review requests' }]
                    : [{ to: '/books', icon: '📖', label: 'Borrow a Book', desc: 'Request a book' }]),
                  { to: '/fines', icon: '💰', label: 'Fines', desc: isLibrarian ? 'Manage fines' : 'View and pay fines' },
                  { to: '/notifications', icon: '🔔', label: 'Notifications', desc: 'View reminders' },
                  ...(isLibrarian ? [{ to: '/inventory', icon: '🗃', label: 'Inventory', desc: 'Manage catalog' }] : []),
                ].map(item => (
                  <Link key={`${item.to}-${item.label}`} to={item.to} className="quick-action-card">
                    <span className="quick-action-card__icon">{item.icon}</span>
                    <div>
                      <div className="quick-action-card__label">{item.label}</div>
                      <div className="quick-action-card__desc">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { memberService } from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import './Notifications.css';

function Notifications() {
  const { user, isLibrarian } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ memberId: '', message: '' });
  const [error, setError] = useState('');

  const getNotificationId = (notification) =>
    notification?.id ?? notification?.notification_id ?? notification?.notificationId;

  const isReadNotification = (notification) =>
    Boolean(notification?.read ?? notification?.isRead);

  const load = async () => {
    setLoading(true);
    try {
      const mems = await memberService.getAll();
      setMembers(mems);

      const targetMemberId = isLibrarian ? selectedMemberId : user?.memberId;
      if (!targetMemberId) {
        setNotifications([]);
        return;
      }

      const notifs = await notificationService.getByMember(targetMemberId);
      setNotifications(notifs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user, selectedMemberId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await notificationService.create(form.memberId, form.message);
      setModal({ open: false });
      load();
    } catch {
      setError('Failed to send notification.');
    }
  };

  const handleMarkRead = async (id) => {
    setError('');
    if (!id) {
      setError('Unable to update notification: invalid notification ID.');
      return;
    }
    try {
      await notificationService.markAsRead(id);
      load();
    } catch {
      setError('Failed to mark notification as read.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    if (!id) {
      setError('Unable to delete notification: invalid notification ID.');
      return;
    }
    try {
      await notificationService.delete(id);
      load();
    } catch {
      setError('Failed to delete notification.');
    }
  };

  const openModal = () => {
    const defaultMemberId = isLibrarian ? selectedMemberId : user?.memberId || '';
    setForm({ memberId: defaultMemberId, message: '' });
    setModal({ open: true });
  };

  const unreadCount = notifications.filter(n => !isReadNotification(n)).length;

  return (
    <div className="notifs-page fade-in">
      <div className="page-header">
        <div className="notifs-header">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Due date reminders and library updates</p>
          </div>
          {unreadCount > 0 && (
            <div className="notifs-unread-badge">{unreadCount} unread</div>
          )}
        </div>
      </div>

      <div className="page-actions">
        {error && <div className="alert alert--error">{error}</div>}
        {isLibrarian && (
          <div className="form-group" style={{ minWidth: 240 }}>
            <select
              className="form-select"
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
            >
              <option value="">Select member to view...</option>
              {members.map(m => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name} (#{m.memberId})
                </option>
              ))}
            </select>
          </div>
        )}
        {isLibrarian && (
          <button className="btn btn--primary btn--md" onClick={openModal} disabled={!selectedMemberId}>
            + Send Notification
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">!</div>
          <p className="empty-state__text">
            {isLibrarian && !selectedMemberId ? 'Select a member to view notifications' : 'No notifications yet'}
          </p>
        </div>
      ) : (
        <div className="notifs-list">
          {notifications.map(n => {
            const id = getNotificationId(n);
            const isRead = isReadNotification(n);
            return (
            <div key={id || `${n.createdAt || n.created_at || 'notif'}-${n.message || ''}`} className={`notif-card ${!isRead ? 'notif-card--unread' : ''}`}>
              <div className="notif-card__icon">{isRead ? 'R' : 'N'}</div>
              <div className="notif-card__content">
                <p className="notif-card__message">{n.message}</p>
                <span className="notif-card__time">
                  {n.createdAt || n.created_at || '-'}
                </span>
              </div>
              <div className="notif-card__actions">
                {!isRead && (
                  <button className="btn btn--teal btn--sm" onClick={() => handleMarkRead(id)} disabled={!id}>
                    Mark Read
                  </button>
                )}
                <button className="btn btn--danger btn--sm" onClick={() => handleDelete(id)} disabled={!id}>
                  Delete
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title="Send Notification" size="sm">
        <form onSubmit={handleCreate}>
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Member</label>
            <select
              className="form-select"
              value={form.memberId}
              onChange={e => setForm({ ...form, memberId: e.target.value })}
              required
            >
              <option value="">Select member...</option>
              {members.map(m => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-input notifs-textarea"
              rows={4}
              placeholder="Reminder: Your borrowed book is due in 3 days..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary btn--md" onClick={() => setModal({ open: false })}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary btn--md">
              Send
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Notifications;

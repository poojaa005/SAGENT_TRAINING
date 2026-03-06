import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import {
  getContactNumber,
  getDeliveryAddress,
  getUserId,
  getUserName,
  normalizeUser,
  pickFirst,
} from '../../utils/entityAdapters';
import './Profile.css';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: getUserName(user),
    contactNumber: getContactNumber(user),
    deliveryAddress: getDeliveryAddress(user),
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...user,
        name: form.name,
        contactNumber: form.contactNumber,
        phoneNo: form.contactNumber,
        phone_no: form.contactNumber,
        deliveryAddress: form.deliveryAddress,
        address: form.deliveryAddress,
      };
      const updated = normalizeUser(await userService.updateUser(getUserId(user), payload));
      setUser(updated);
      localStorage.setItem('grocery_user', JSON.stringify(updated));
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar">{getUserName(user)?.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{getUserName(user)}</h2>
            <span className={`role-badge ${pickFirst(user?.role, 'USER').toLowerCase()}`}>{pickFirst(user?.role, 'USER')}</span>
          </div>
        </div>

        <div className="profile-info">
          {editing ? (
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} rows={3} />
              </div>
              <div className="profile-actions">
                <button className="btn-save" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn-cancel" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-grid">
                <div className="info-item">
                  <span>Email</span>
                  <p>{user?.email}</p>
                </div>
                <div className="info-item">
                  <span>Contact</span>
                  <p>{getContactNumber(user) || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <span>Address</span>
                  <p>{getDeliveryAddress(user) || 'Not set'}</p>
                </div>
                <div className="info-item">
                  <span>Member Since</span>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

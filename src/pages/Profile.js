import React, { useState } from 'react';
import { FaUser, FaLock, FaBell, FaHistory, FaSave, FaCamera } from 'react-icons/fa';
import Toggle from '../components/common/Toggle';
import { useToast } from '../components/common/Toast';
import './Profile.css';

const Profile = () => {
  const toast = useToast();
  const [profile, setProfile] = useState({
    name: 'Demo Admin',
    email: 'admin@storybox.com',
    phone: '+1 234 567 8900',
    bio: 'Administrator of StoryBox platform',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  });

  const [activities] = useState([
    { id: 1, action: 'Logged in', time: '2 hours ago', ip: '192.168.1.1' },
    { id: 2, action: 'Updated user profile', time: '5 hours ago', ip: '192.168.1.1' },
    { id: 3, action: 'Created new film category', time: '1 day ago', ip: '192.168.1.1' },
    { id: 4, action: 'Deleted episode', time: '2 days ago', ip: '192.168.1.2' },
    { id: 5, action: 'Password changed', time: '1 week ago', ip: '192.168.1.1' }
  ]);

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (!profile.currentPassword || !profile.newPassword || !profile.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setProfile({...profile, currentPassword: '', newPassword: '', confirmPassword: ''});
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2 className="page-title">My Profile</h2>
        <button className="btn btn-primary" onClick={handleSave}>
          <FaSave /> Save Changes
        </button>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <FaUser />
              <button className="avatar-upload-btn"><FaCamera /></button>
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <div className="completion-badge">
              <div className="completion-ring">
                <svg viewBox="0 0 36 36"><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3"/><path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray="85, 100"/><defs><linearGradient id="gradient"><stop offset="0%" stopColor="#FF0080"/><stop offset="100%" stopColor="#7C3AED"/></linearGradient></defs></svg>
                <span className="completion-percentage">85%</span>
              </div>
              <span className="completion-label">Profile Complete</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h3>Personal Information</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input className="input-field" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="input-field" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="input-field" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
              </div>
              <div className="form-group full-width">
                <label>Bio</label>
                <textarea className="input-field" rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <FaLock className="section-icon" />
              <h3>Security Settings</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Current Password</label>
                <input className="input-field" type="password" value={profile.currentPassword} onChange={e => setProfile({...profile, currentPassword: e.target.value})} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="input-field" type="password" value={profile.newPassword} onChange={e => setProfile({...profile, newPassword: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input className="input-field" type="password" value={profile.confirmPassword} onChange={e => setProfile({...profile, confirmPassword: e.target.value})} />
              </div>
            </div>
            <button className="btn btn-outline" onClick={handlePasswordChange}>Change Password</button>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <FaBell className="section-icon" />
              <h3>Notification Preferences</h3>
            </div>
            <div className="setting-row">
              <label>Email Notifications</label>
              <Toggle checked={profile.emailNotifications} onChange={v => setProfile({...profile, emailNotifications: v})} />
            </div>
            <div className="setting-row">
              <label>Push Notifications</label>
              <Toggle checked={profile.pushNotifications} onChange={v => setProfile({...profile, pushNotifications: v})} />
            </div>
            <div className="setting-row">
              <label>Marketing Emails</label>
              <Toggle checked={profile.marketingEmails} onChange={v => setProfile({...profile, marketingEmails: v})} />
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <FaHistory className="section-icon" />
              <h3>Activity Log</h3>
            </div>
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <strong>{activity.action}</strong>
                    <div className="activity-meta">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>IP: {activity.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
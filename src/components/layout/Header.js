import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FaBars />
        </button>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="user-avatar" />
          ) : (
            <FaUserCircle className="user-avatar-icon" />
          )}
          <span className="user-name">{user?.name || 'Demo Admin'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

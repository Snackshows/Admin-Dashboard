import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaUserTie, 
  FaFilm, 
  FaList, 
  FaTv, 
  FaVideo,
  FaCrown,
  FaBars,
  FaTimes,
  FaBell,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/users', icon: FaUsers, label: 'User' },
    { path: '/employee', icon: FaUserTie, label: 'Employee' },
    { path: '/film-category', icon: FaFilm, label: 'Film Category' },
    { path: '/film-list', icon: FaList, label: 'Film List' },
    { path: '/episode-list', icon: FaTv, label: 'Episode List' },
    { path: '/content', icon: FaVideo, label: 'Content' },
    { path: '/vip-plan', icon: FaCrown, label: 'VIP Plan' },
  ];

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className="mobile-logo">
          <FaVideo className="logo-icon" />
          <span className="logo-text">SnackShow</span>
        </div>

        <div className="mobile-header-actions">
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">2</span>
          </button>
          <button className="profile-btn">
            <FaUserCircle />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FaVideo className="logo-icon" />
            <span className="logo-text">SnackShow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">MENU</h3>
            {menuItems.slice(0, 2).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">FILM MANAGEMENT</h3>
            {menuItems.slice(2, 7).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">PACKAGE</h3>
            {menuItems.slice(7).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-greeting">Welcome Admin !</h1>
            <p className="page-title">Dashboard</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">2</span>
            </button>
            <div className="user-profile">
              <FaUserCircle className="user-avatar" />
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
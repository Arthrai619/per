// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  IoHomeOutline, 
  IoLibraryOutline, 
  IoHeartOutline, 
  IoLogInOutline, 
  IoLogOutOutline 
} from 'react-icons/io5';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleLinkClick(); // Close sidebar on mobile
  };

  return (
    <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.logo}>
        READLY
      </div>
      
      <div className={styles.menu}>
        <span className={styles.menuTitle}>MENU</span>
        
        <Link 
          to="/" 
          className={`${styles.menuItem} ${isActive('/') ? styles.active : ''}`}
          onClick={handleLinkClick}
        >
          <IoHomeOutline /> Discover
        </Link>
        
        <Link 
          to="/my-library" 
          className={`${styles.menuItem} ${isActive('/my-library') ? styles.active : ''}`}
          onClick={handleLinkClick}
        >
          <IoLibraryOutline /> My Library
        </Link>

        <Link 
          to="/favorites" 
          className={`${styles.menuItem} ${isActive('/favorites') ? styles.active : ''}`}
          onClick={handleLinkClick}
        >
          <IoHeartOutline /> Favorite
        </Link>
      </div>

      <div className={styles.spacer}></div>

      <div className={styles.menu}>
        <span className={styles.menuTitle}>ACCOUNT</span>
        
        {user ? (
          <a href="#" onClick={handleLogout} className={styles.menuItem}>
            <IoLogOutOutline /> Log out
          </a>
        ) : (
          <Link 
            to="/login" 
            className={`${styles.menuItem} ${isActive('/login') ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            <IoLogInOutline /> Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';

const Header = ({ title, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuClick}>
        <span>☰</span>
      </button>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.userProfile}>
        <span>{user ? user.name : 'Guest'}</span>
      </div>
    </header>
  );
};

export default Header;
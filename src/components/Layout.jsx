// src/components/Layout.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import styles from './Layout.module.css';

const getTitle = (pathname) => {
  if (pathname === '/') return 'Discover';
  if (pathname === '/my-library') return 'My Library';
  if (pathname === '/favorites') return 'Favorites';
  return 'Books';
};

const Layout = ({ children }) => {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <main className={styles.mainContent}>
        <Header 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
      
      {isSidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
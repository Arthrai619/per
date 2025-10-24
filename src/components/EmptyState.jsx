// src/components/EmptyState.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';
import { IoSearch } from 'react-icons/io5';

const EmptyState = ({ message }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>📚</div>
      <h2>Your library is empty</h2>
      <p>{message}</p>
      <Link to="/" className={styles.button}>
        <IoSearch />
        Discover Books
      </Link>
    </div>
  );
};

export default EmptyState;
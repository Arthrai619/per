// src/components/BookCardSkeleton.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './LibraryBookCard.module.css'; 

const BookCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <Skeleton 
        height="250px" 
        style={{ borderRadius: '12px', marginBottom: '1rem', aspectRatio: '2/3' }} 
      />
      <Skeleton width="80%" />
      <Skeleton width="60%" style={{ marginTop: '0.25rem' }} />

      <div className={styles.details}>
        <Skeleton width="100px" style={{ marginTop: '0.5rem' }} />
        <Skeleton width="70px" style={{ marginTop: '0.25rem' }} />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
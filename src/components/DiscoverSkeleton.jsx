// src/components/DiscoverSkeleton.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './BookCard.module.css'; 

const DiscoverSkeleton = () => {
  return (
    <div className={styles.card}>
      <Skeleton height="250px" style={{ borderRadius: '12px', marginBottom: '1rem' }} />
      <Skeleton width="80%" />
      <Skeleton width="60%" style={{ marginTop: '0.25rem' }} />
      <Skeleton width="100%" height="40px" style={{ marginTop: '1rem', borderRadius: '8px' }} />
    </div>
  );
};

export default DiscoverSkeleton;
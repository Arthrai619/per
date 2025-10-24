// src/components/BookCard.jsx
import React from 'react';
import styles from './BookCard.module.css';
import { motion } from 'framer-motion';

const BookCard = ({ book, onAddBook }) => {
  const author = book.authors ? book.authors[0] : 'Unknown Author';

  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img
        src={book.coverImage || 'https://via.placeholder.com/150x220?text=No+Cover'}
        alt={book.title}
        className={styles.coverImage}
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{author}</p>
      </div>
      
      {onAddBook && (
        <button 
          onClick={() => onAddBook(book)} 
          className={styles.addButton}
        >
          Add to Library
        </button>
      )}
    </motion.div>
  );
};

export default BookCard;
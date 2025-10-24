// src/components/RatingModal.jsx
import React, { useState } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import styles from './RatingModal.module.css';
import { motion } from 'framer-motion';

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', duration: 0.3 } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

const RatingModal = ({ currentRating, onSave, onCancel }) => {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <motion.div 
      className={styles.overlay}
      onClick={onCancel} // Close on overlay click
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={styles.modal}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()} // Prevent closing
      >
        <h3>Rate this book</h3>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              className={styles.star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {(hoverRating || rating) >= star ? <IoStar /> : <IoStarOutline />}
            </motion.span>
          ))}
        </div>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={() => onSave(rating)} className={styles.saveButton}>
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RatingModal;
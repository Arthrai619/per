// src/components/LibraryBookCard.jsx
import React, { useState } from 'react';
import styles from './LibraryBookCard.module.css';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import RatingModal from './RatingModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const LibraryBookCard = ({ book, onDelete, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const cover = book.coverImage || 'https://via.placeholder.com/150x220?text=No+Cover';
  const status = book.status || 'Want to Read';
  const isFavourite = book.isFavourite || false;
  const rating = book.rating || 0;

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? <IoStar key={i} /> : <IoStarOutline key={i} />
      );
    }
    return <div className={styles.rating}>{stars}</div>;
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(book._id, { status: newStatus }); 
    setShowMenu(false);
  };

  const handleToggleFavorite = () => {
    onUpdate(book._id, { isFavourite: !isFavourite });
    setShowMenu(false);
  };

  const handleSaveRating = (newRating) => {
    onUpdate(book._id, { rating: newRating });
    setShowRatingModal(false);
    setShowMenu(false);
  };

  return (
    <>
      <motion.div 
        className={styles.card}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <img src={cover} alt={book.title} className={styles.coverImage} />
        <div className={styles.info}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>
        <div className={styles.details}>
          {renderStars()}
          <p className={styles.statusText}>{status}</p>
        </div>
        
        <button className={styles.menuButton} onClick={() => setShowMenu(!showMenu)}>
          ...
        </button>

        {showMenu && (
          <div className={styles.menu}>
            <p>Set Status:</p>
            <button onClick={() => handleStatusChange('Reading')}>Reading</button>
            <button onClick={() => handleStatusChange('Completed')}>Completed</button>
            <button onClick={() => handleStatusChange('Want to Read')}>Want to Read</button>
            <hr />
            <button onClick={() => setShowRatingModal(true)}>
              Add Rating
            </button>
            <button onClick={handleToggleFavorite}>
              {isFavourite ? 'Unfavorite' : 'Favorite'}
            </button>
            <hr />
            <button 
              className={styles.deleteButton} 
              onClick={() => {
                onDelete(book._id);
                setShowMenu(false);
              }}
            >
              Remove Book
            </button>
          </div>
        )}
      </motion.div>
      
      <AnimatePresence>
        {showRatingModal && (
          <RatingModal 
            currentRating={rating}
            onSave={handleSaveRating}
            onCancel={() => setShowRatingModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LibraryBookCard;
// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LibraryBookCard from '../components/LibraryBookCard.jsx';
import styles from './MyLibrary.module.css'; 
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { Helmet } from 'react-helmet-async';
import BookCardSkeleton from '../components/BookCardSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Favorites = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FIX: Make this robust to ensure an empty array is always set on error.
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/books');
      // Filter for favorites
      const favBooks = res.data.data.filter(book => book.isFavourite);
      setBooks(favBooks);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not fetch books');
      setBooks([]); // CRITICAL: Ensure 'books' is an array on fetch failure
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); 

  // When a book is deleted, filter it out locally and refetch.
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book?')) return;
    try {
      await api.delete(`/books/${bookId}`);
      toast.success('Book removed successfully');
      // Optimistic update: filter out the deleted book
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove book');
    }
  };

  // When a book is updated (e.g., unfavorited), refetch the list.
  const handleUpdateBook = async (bookId, updateData) => {
    try {
      await api.put(`/books/${bookId}`, updateData);
      toast.success('Book updated!');
      // Refetch is necessary here because the update might remove the book from the 'Favorites' list
      fetchBooks(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Favorites | Readly</title>
      </Helmet>
      <div className={styles.wrapper}>
        
        {/* FIX 1: Reorganize conditional rendering. 
                 Render the EmptyState OUTSIDE the motion.div grid container. 
        */}
        {isLoading ? (
            // Render Skeletons inside the grid container during loading
            <motion.div 
                key="loading" 
                className={styles.bookGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <BookCardSkeleton /><BookCardSkeleton /><BookCardSkeleton />
            </motion.div>
        ) : books.length === 0 ? (
            // Render EmptyState outside the grid container when there are no books
            <EmptyState message="You haven't favorited any books yet." />
        ) : (
            // Render the actual list when data is available
            <motion.div 
                // FIX 2: Add a key based on the number of books. This forces Framer Motion 
                // to restart the animation when a book is added/deleted/unfavorited.
                key={`favorites-${books.length}`}
                className={styles.bookGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {books.map((book) => (
                    // FIX 3: Ensure key is the stable, unique database ID.
                    <motion.div key={book._id} variants={itemVariants}>
                        <LibraryBookCard 
                            book={book} 
                            onDelete={handleDeleteBook}
                            onUpdate={handleUpdateBook}
                        />
                    </motion.div>
                ))}
            </motion.div>
        )}

      </div>
    </PageTransition>
  );
};

export default Favorites;
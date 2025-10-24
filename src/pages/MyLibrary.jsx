// src/pages/MyLibrary.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import LibraryBookCard from '../components/LibraryBookCard.jsx'; 
import styles from './MyLibrary.module.css';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { Helmet } from 'react-helmet-async';
import BookCardSkeleton from '../components/BookCardSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx'; // Assuming this component exists

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MyLibrary = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Assuming your /books endpoint returns data that has been stored
      // in your backend, meaning the structure is flat (e.g., book.title, book._id)
      const res = await api.get('/books');
      setBooks(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not fetch books');
      setBooks([]); // Set to empty array on error to prevent undefined issues
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); 

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book?')) return;
    try {
      await api.delete(`/books/${bookId}`);
      toast.success('Book removed successfully');
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove book');
    }
  };

  const handleUpdateBook = async (bookId, updateData) => {
    try {
      const res = await api.put(`/books/${bookId}`, updateData);
      setBooks(books.map((book) => 
        book._id === bookId ? res.data.data : book 
      ));
      toast.success('Book updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>My Library | Readly</title>
      </Helmet>
      <div className={styles.wrapper}>
        
        {/* FIX 1: Wrap the rendering logic to ensure the bookGrid motion.div 
                   only renders when there is a list (either skeletons or books).
                   This prevents EmptyState from being forced into the grid layout. 
        */}
        {isLoading ? (
            // Skeletons are rendered directly, so they fit in the grid
            <motion.div 
                key="loading" // Added key to force remount
                className={styles.bookGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <BookCardSkeleton /><BookCardSkeleton /><BookCardSkeleton />
                <BookCardSkeleton /><BookCardSkeleton /><BookCardSkeleton />
            </motion.div>
        ) : books.length === 0 ? (
            // FIX 2: Render EmptyState OUTSIDE the motion.div grid container.
            // EmptyState needs to take up the full page width, which is difficult 
            // when it's a child of a CSS Grid layout (styles.bookGrid).
            <EmptyState message="Your library is empty. Go discover some books!" />
        ) : (
            // FIX 3: Add a stable key to the motion.div to resolve animation conflicts
            // 'library' is stable, but adding books.length ensures the animation 
            // container re-renders when a book is added or deleted.
            <motion.div 
                key={`library-${books.length}`}
                className={styles.bookGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {books.map((book) => (
                    // FIX 4: Use the stable _id from your database for the map key.
                    // This prevents re-renders when books are updated.
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

export default MyLibrary;
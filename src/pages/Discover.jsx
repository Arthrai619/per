// src/pages/Discover.jsx - FINAL CORRECTED CODE with Duplicate Check
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import styles from './Discover.module.css';
import BookCard from '../components/BookCard.jsx';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { Helmet } from 'react-helmet-async';
import DiscoverSkeleton from '../components/DiscoverSkeleton.jsx';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchBooks = async (query) => {
    setIsLoading(true);
    try {
      const res = await api.get('/discover', { params: { search: query } });
      setSearchResults(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
      setSearchResults([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks('best sellers');
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchTerm) {
        fetchBooks(searchTerm);
      } else if (!searchTerm && searchResults.length > 0) {
        fetchBooks('best sellers');
      }
    }, 500); 
    return () => clearTimeout(searchTimer);
  }, [searchTerm]); 

  // FINAL FIX: Correctly extracts data from the FLAT structure and handles 409 error
  const handleAddBook = async (book) => {
    // 1. Convert 'authors' array (from backend) to the single string (for Mongoose model)
    const authorString = Array.isArray(book.authors) 
        ? book.authors.join(', ') 
        : book.authors;

    const bookData = {
      // 2. Access flat properties directly (no volumeInfo)
      googleBookId: book.googleBookId, // CRITICAL: Used for duplicate check on backend
      title: book.title || 'Unknown Title',
      author: authorString || 'Unknown Author',
      coverImage: book.coverImage || '',
    };
    
    try {
      await api.post('/books', bookData); 
      
      // 3. Use the correctly extracted title for the success toast
      toast.success(`'${bookData.title}' was added to your library!`);
      
    } catch (error) {
      // 4. Handle the new 409 Conflict status for duplicates
      if (error.response?.status === 409) {
        toast.error(error.response.data.message || `The book '${bookData.title}' is already in your library.`);
      } else if (error.response?.status === 401) {
        toast.error('You must be logged in to add a book.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add book');
      }
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Discover Books | Readly</title>
      </Helmet>
      <div className={styles.wrapper}>
        <div className={styles.searchBar}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Type to search for books..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section className={styles.bookSection}>
          <h2 className={styles.sectionTitle}>
            {searchTerm ? `Results for "${searchTerm}"` : 'Book Recommendation'}
          </h2>
          
          {isLoading ? (
            <motion.div 
                key="loading-skeletons" 
                className={styles.bookList}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <DiscoverSkeleton /><DiscoverSkeleton /><DiscoverSkeleton /><DiscoverSkeleton /><DiscoverSkeleton />
            </motion.div>
          ) : searchResults.length === 0 ? (
            <p className={styles.emptyMessage}>No books found for "{searchTerm || 'best sellers'}".</p>
          ) : (
            <motion.div 
              key={searchTerm || 'best-sellers-list'}
              className={styles.bookList}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {searchResults.map((book, index) => (
                <motion.div 
                  key={book.googleBookId || index} 
                  variants={itemVariants}
                >
                  <BookCard book={book} onAddBook={handleAddBook} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default Discover;
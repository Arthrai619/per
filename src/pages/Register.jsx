// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import styles from './Auth.module.css';
import PageTransition from '../components/PageTransition.jsx';
import { Helmet } from 'react-helmet-async';
import { ImSpinner9 } from 'react-icons/im';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/users/register', { name, email, password });
      toast.success(res.data.message || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Create Account | Readly</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Create Account</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <ImSpinner9 className={styles.spinner} /> : 'Register'}
            </button>
          </form>
          <p className={styles.link}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;
// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios.js';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { Helmet } from 'react-helmet-async';
import { ImSpinner9 } from 'react-icons/im';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/users/login', { email, password });
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(res.data.message || 'Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Login | Readly</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Welcome Back</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <ImSpinner9 className={styles.spinner} /> : 'Login'}
            </button>
          </form>
          <p className={styles.link}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
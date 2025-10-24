// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

// Layout
import Layout from './components/Layout.jsx';

// Pages
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Discover from './pages/Discover.jsx';
import MyLibrary from './pages/MyLibrary.jsx';
import Favorites from './pages/Favorites.jsx';

// Security
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Helper component to conditionally apply layout
const AppLayout = () => {
  const location = useLocation();
  const noLayoutPaths = ['/login', '/register'];

  if (noLayoutPaths.includes(location.pathname)) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Discover />} />
          <Route 
            path="/my-library" 
            element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} 
          />
          <Route 
            path="/favorites" 
            element={<ProtectedRoute><Favorites /></ProtectedRoute>} 
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

function App() {
  return (
    <>
      <ToastContainer />
      <AppLayout />
    </>
  );
}

export default App;
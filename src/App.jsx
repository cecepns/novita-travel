import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToTop from './components/ScrollToTop';

// Landing Pages
import HomePage from './pages/landing/HomePage';
import AboutPage from './pages/landing/AboutPage';
import LayananPage from './pages/landing/LayananPage';
import LayananDetailPage from './pages/landing/LayananDetailPage';
import ContactPage from './pages/landing/ContactPage';
import ReservasiPage from './pages/landing/ReservasiPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManajemenLayanan from './pages/admin/ManajemenLayanan';
import ManajemenSettings from './pages/admin/ManajemenSettings';
import ManajemenReservasi from './pages/admin/ManajemenReservasi';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="layanan" element={<LayananPage />} />
          <Route path="layanan/:id" element={<LayananDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="reservasi" element={<ReservasiPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="layanan" element={<ManajemenLayanan />} />
          <Route path="settings" element={<ManajemenSettings />} />
          <Route path="reservasi" element={<ManajemenReservasi />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
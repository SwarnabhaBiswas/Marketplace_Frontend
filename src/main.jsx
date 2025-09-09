import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import DealerForm from './pages/DealerForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Support from './pages/Support';
import About from './pages/About';
import './styles/index.css';
import { MotionProvider } from './lib/motion';
import GlobalLoader from './components/GlobalLoader';
import { beginRoute, endRoute } from './lib/loading';
import WhatsAppFAB from './components/WhatsAppFAB';

function ScrollToHash() {
  const { hash } = useLocation();
  React.useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);
  return null;
}

function RouteSpinner() {
  const location = useLocation();
  React.useEffect(() => {
    beginRoute();
    const t = setTimeout(() => endRoute(), 220);
    return () => clearTimeout(t);
  }, [location]);
  return null;
}

function ScrollToTopRoute() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <RouteSpinner />
      <ScrollToHash />
      <ScrollToTopRoute />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/become-dealer" element={<DealerForm />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <WhatsAppFAB />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <MotionProvider>
    <GlobalLoader />
    <AppRoutes />
  </MotionProvider>
);

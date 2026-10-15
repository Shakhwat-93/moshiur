import React, { useState, useEffect } from 'react';
import { CmsProvider } from './context/CmsContext';
import Storefront from './storefront/Storefront';
import AdminApp from './admin/AdminApp';
import OrderSuccessPage from './pages/OrderSuccessPage';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    // Check initial hash or path
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    if (window.location.hash === '#success' || window.location.pathname.startsWith('/order-success')) {
      return 'success';
    }
    return 'store';
  });

  const [latestOrder, setLatestOrder] = useState(() => {
    try {
      const saved = sessionStorage.getItem('herbheez_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#success') {
        setCurrentView('success');
      } else if (window.location.hash === '#store' || window.location.hash === '') {
        setCurrentView('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    setLatestOrder(order);
    try {
      sessionStorage.setItem('herbheez_last_order', JSON.stringify(order));
    } catch (e) {
      console.warn('Session storage write error:', e);
    }
    window.location.hash = 'success';
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CmsProvider>
      {currentView === 'admin' ? (
        <AdminApp onNavigateStore={navigateToStore} />
      ) : currentView === 'success' ? (
        <OrderSuccessPage order={latestOrder} onReturnHome={navigateToStore} />
      ) : (
        <Storefront
          onOpenAdmin={navigateToAdmin}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </CmsProvider>
  );
}

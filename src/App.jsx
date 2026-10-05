import React, { useState, useEffect } from 'react';
import { CmsProvider } from './context/CmsContext';
import Storefront from './storefront/Storefront';
import AdminApp from './admin/AdminApp';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    // Check initial hash or path
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
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

  return (
    <CmsProvider>
      {currentView === 'admin' ? (
        <AdminApp onNavigateStore={navigateToStore} />
      ) : (
        <Storefront onOpenAdmin={navigateToAdmin} />
      )}
    </CmsProvider>
  );
}

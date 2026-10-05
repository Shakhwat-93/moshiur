import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import ProductEditor from './pages/ProductEditor';
import OrdersManager from './pages/OrdersManager';
import HomepageBuilder from './pages/HomepageBuilder';
import AppearanceTheme from './pages/AppearanceTheme';
import SiteSettings from './pages/SiteSettings';
import TestimonialsManager from './pages/TestimonialsManager';
import FaqManager from './pages/FaqManager';

export default function AdminApp({ onNavigateStore }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditProduct = (prod) => {
    setSelectedProduct(prod);
    setActiveTab('product-edit');
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setActiveTab('product-new');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setActiveTab('products');
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigateStore={onNavigateStore}
    >
      {activeTab === 'dashboard' && (
        <Dashboard
          setActiveTab={setActiveTab}
          onEditProduct={handleEditProduct}
        />
      )}

      {activeTab === 'products' && (
        <ProductsList
          onNewProduct={handleNewProduct}
          onEditProduct={handleEditProduct}
        />
      )}

      {(activeTab === 'product-new' || activeTab === 'product-edit') && (
        <ProductEditor
          product={selectedProduct}
          onBack={handleBackToProducts}
        />
      )}

      {activeTab === 'orders' && <OrdersManager />}

      {activeTab === 'builder' && <HomepageBuilder />}

      {activeTab === 'theme' && <AppearanceTheme />}

      {activeTab === 'testimonials' && <TestimonialsManager />}

      {activeTab === 'faqs' && <FaqManager />}

      {activeTab === 'settings' && <SiteSettings />}
    </AdminLayout>
  );
}

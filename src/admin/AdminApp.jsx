import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import EasyOverview from './pages/EasyOverview';
import EasyContent from './pages/EasyContent';
import EasyPixelSetup from './pages/EasyPixelSetup';
import EasyCourierSetup from './pages/EasyCourierSetup';
import EasyStock from './pages/EasyStock';
import OrdersManager from './pages/OrdersManager';

export default function AdminApp({ onNavigateStore }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigateStore={onNavigateStore}
    >
      {activeTab === 'overview' && (
        <EasyOverview setActiveTab={setActiveTab} />
      )}

      {activeTab === 'content' && (
        <EasyContent />
      )}

      {activeTab === 'pixel' && (
        <EasyPixelSetup />
      )}

      {activeTab === 'courier' && (
        <EasyCourierSetup />
      )}

      {activeTab === 'stock' && (
        <EasyStock />
      )}

      {activeTab === 'orders' && (
        <OrdersManager />
      )}
    </AdminLayout>
  );
}

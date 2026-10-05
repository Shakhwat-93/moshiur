import React, { useState } from 'react';
import {
  LayoutGrid,
  Sliders,
  Target,
  Truck,
  Package,
  ClipboardList,
  RotateCw,
  LogOut,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import './admin.css';

export default function AdminLayout({ activeTab, setActiveTab, onNavigateStore, children }) {
  const { siteSettings, orders, fetchData, showToast } = useCms();
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = orders?.filter((o) => o.status === 'pending')?.length || 0;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'content', label: 'Content', icon: Sliders },
    { id: 'pixel', label: 'Pixel Setup', icon: Target },
    { id: 'courier', label: 'Courier Setup', icon: Truck },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : null }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (fetchData) await fetchData();
      showToast('সবগুলো তথ্য রিফ্রেশ করা হয়েছে!');
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="easy-admin-root">
      {/* Top Header matching reference */}
      <header className="easy-admin-header">
        <div className="easy-header-container">
          <div className="easy-header-left">
            <button
              type="button"
              className="easy-back-link"
              onClick={onNavigateStore}
            >
              <ArrowLeft size={15} />
              <span>Back to landing page</span>
            </button>
            <h1 className="easy-admin-title">
              {siteSettings?.store_name || 'Herbheez'} Admin
            </h1>
          </div>

          <div className="easy-header-right">
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="easy-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              className="easy-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RotateCw size={15} className={refreshing ? 'easy-spinning' : ''} />
              <span>Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              className="easy-logout-btn"
              onClick={onNavigateStore}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="easy-main-container">
        {/* Mobile menu drawer backdrop */}
        {mobileMenuOpen && (
          <div
            className="easy-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Floating Sidebar Card */}
        <aside className={`easy-sidebar-card ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="easy-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`easy-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="easy-nav-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Page Content */}
        <main className="easy-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

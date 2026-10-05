import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Palette,
  Settings,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Menu,
  X,
  Store,
  ChevronRight
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import './admin.css';

export default function AdminLayout({ activeTab, setActiveTab, onNavigateStore, children }) {
  const { siteSettings, orders } = useCms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Dashboard)', icon: LayoutDashboard },
    { id: 'products', label: 'প্রোডাক্টস (Products)', icon: Package },
    { id: 'orders', label: 'অর্ডার সমূহ (Orders)', icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'builder', label: 'হোমপেজ বিল্ডার (Homepage)', icon: Layers },
    { id: 'theme', label: 'থিম ও কালার (Theme)', icon: Palette },
    { id: 'testimonials', label: 'রিভিউ ও মতামত (Reviews)', icon: MessageSquare },
    { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)', icon: HelpCircle },
    { id: 'settings', label: 'স্টোর সেটিংস (Settings)', icon: Settings }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="adm-shell">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div className="adm-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`adm-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="adm-brand">
          <img
            src={siteSettings?.logo_url || '/images/herbheez-logo.webp'}
            alt="Logo"
            className="adm-brand-logo"
          />
          <div style={{ minWidth: 0 }}>
            <div className="adm-brand-name">{siteSettings?.store_name || 'Herbheez Store'}</div>
            <div className="adm-brand-tag">এডমিন প্যানেল</div>
          </div>
        </div>

        <nav className="adm-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'product-new' && item.id === 'products');
            return (
              <button
                key={item.id}
                className={`adm-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-view-store" onClick={onNavigateStore} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
            <Store size={16} />
            <span>লাইভ স্টোর দেখুন</span>
            <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="adm-main">
        {/* Top Header */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              className="adm-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="adm-page-title">
              {navItems.find((n) => n.id === activeTab)?.label || 'এডমিন প্যানেল'}
            </h1>
          </div>

          <div className="adm-topbar-right">
            <button className="adm-btn adm-btn-sm" onClick={onNavigateStore}>
              <Store size={14} />
              <span>স্টোর দেখুন</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="adm-content">{children}</main>
      </div>

      {/* Mobile-First Bottom Nav (One-hand quick navigation) */}
      <nav className="adm-bottom-nav">
        <button
          className={`adm-bottom-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>ড্যাশবোর্ড</span>
        </button>
        <button
          className={`adm-bottom-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleNavClick('products')}
        >
          <Package size={18} />
          <span>প্রোডাক্ট</span>
        </button>
        <button
          className={`adm-bottom-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleNavClick('orders')}
          style={{ position: 'relative' }}
        >
          <ShoppingBag size={18} />
          <span>অর্ডার</span>
          {pendingCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: '25%',
                width: 8,
                height: 8,
                background: '#d72c0d',
                borderRadius: '50%'
              }}
            />
          )}
        </button>
        <button
          className={`adm-bottom-tab ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => handleNavClick('builder')}
        >
          <Layers size={18} />
          <span>বিল্ডার</span>
        </button>
        <button
          className={`adm-bottom-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleNavClick('settings')}
        >
          <Settings size={18} />
          <span>সেটিংস</span>
        </button>
      </nav>
    </div>
  );
}

import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function DynamicNavbar({ onOpenAdmin }) {
  const { siteSettings } = useCms();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="vb2-nav">
      <div className="nav-inner">
        <a className="vb2-brand" href="#top">
          <img
            src={siteSettings?.logo_url || '/images/herbheez-logo.webp'}
            alt={siteSettings?.store_name || 'Herbheez BD'}
          />
        </a>

        <ul className={`vb2-menu ${mobileNavOpen ? 'open' : ''}`}>
          <li><a href="#problems" onClick={() => setMobileNavOpen(false)}>সমস্যাসমূহ</a></li>
          <li><a href="#benefits" onClick={() => setMobileNavOpen(false)}>উপকারিতা</a></li>
          <li><a href="#packs" onClick={() => setMobileNavOpen(false)}>প্যাকেজ</a></li>
          <li><a href="#lab-test" onClick={() => setMobileNavOpen(false)}>ল্যাব টেস্ট</a></li>
          <li><a href="#reviews" onClick={() => setMobileNavOpen(false)}>রিভিউ</a></li>
          <li><a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a></li>
          <li><a href="#info" onClick={() => setMobileNavOpen(false)}>সেবনের নিয়ম</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Admin Switcher Button */}
          <button
            onClick={onOpenAdmin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1a1c1d',
              color: '#ffffff',
              border: '1px solid #333',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="এডমিন প্যানেলে যান"
          >
            <ShieldCheck size={14} color="#008060" />
            <span>এডমিন প্যানেল</span>
          </button>

          <a className="vb2-nav-cta" href="#order">
            অর্ডার করুন
          </a>
        </div>
      </div>
    </nav>
  );
}

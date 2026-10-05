import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicFooter({ onOpenAdmin }) {
  const { siteSettings } = useCms();

  return (
    <footer className="vb2-footer">
      <div className="f-contact">
        <span>যেকোনো প্রয়োজনে আমাদের কল করুন:</span>
        {siteSettings?.phone_1 && (
          <a href={`tel:${siteSettings.phone_1.replace(/[^0-9]/g, '')}`}>
            📞 {siteSettings.phone_1}
          </a>
        )}
        {siteSettings?.phone_2 && (
          <a href={`tel:${siteSettings.phone_2.replace(/[^0-9]/g, '')}`}>
            📞 {siteSettings.phone_2}
          </a>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
        <span>Copyright © 2026 {siteSettings?.store_name || 'Herbheez BD'}. সর্বস্বত্ব সংরক্ষিত।</span>
        <button
          onClick={onOpenAdmin}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '12px',
            opacity: 0.8
          }}
        >
          এডমিন লগইন
        </button>
      </div>
    </footer>
  );
}

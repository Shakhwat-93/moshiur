import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicFloatingActions() {
  const { siteSettings } = useCms();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawPhone = (siteSettings?.phone_1 || '01604939479').replace(/[^0-9]/g, '');
  const waNumber = (siteSettings?.whatsapp_number || '8801604939479').replace(/[^0-9]/g, '');

  return (
    <>
      {/* Scroll to Top */}
      <button
        aria-label="Scroll to top"
        className={`vb2-top ${showTop ? 'show' : ''}`}
        id="vb2top"
        onClick={scrollToTop}
      >
        ↑
      </button>

      {/* Floating Action Buttons */}
      <div className="vb2-float">
        <a
          className="wa"
          href={`https://wa.me/${waNumber}?text=হ্যালো,%20আমি%20জিরো%20এলার্জি%20সম্পর্কে%20জানতে%20চাই`}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Message"
        >
          💬
        </a>
        <a className="cl" href={`tel:${rawPhone}`} title="Call Helpline">
          📞
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="vb2-sbar">
        <a className="o" href="#order">
          🛒 এখনই অর্ডার করুন
        </a>
        <a className="c" href={`tel:${rawPhone}`}>
          📞 সরাসরি কল করুন
        </a>
      </div>
    </>
  );
}

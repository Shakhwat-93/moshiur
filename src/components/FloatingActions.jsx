import React, { useState, useEffect } from 'react';

export default function FloatingActions() {
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
          href="https://wa.me/8801604939479?text=হ্যালো,%20আমি%20জিরো%20এলার্জি%20সম্পর্কে%20জানতে%20চাই"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Message"
        >
          💬
        </a>
        <a className="cl" href="tel:01604939479" title="Call Helpline">
          📞
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="vb2-sbar">
        <a className="o" href="#order">
          🛒 এখনই অর্ডার করুন
        </a>
        <a className="c" href="tel:01604939479">
          📞 সরাসরি কল করুন
        </a>
      </div>
    </>
  );
}

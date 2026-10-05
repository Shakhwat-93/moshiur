import React from 'react';

export default function Navbar() {
  return (
    <nav className="vb2-nav">
      <div className="nav-inner">
        <a className="vb2-brand" href="#top">
          <img src="/images/herbheez-logo.webp" alt="Herbheez BD" />
        </a>
        <ul className="vb2-menu">
          <li><a href="#problems">সমস্যাসমূহ</a></li>
          <li><a href="#benefits">উপকারিতা</a></li>
          <li><a href="#packs">প্যাকেজ</a></li>
          <li><a href="#lab-test">ল্যাব টেস্ট</a></li>
          <li><a href="#reviews">গ্রাহকদের রিভিউ</a></li>
          <li><a href="#info">সেবনের নিয়ম</a></li>
        </ul>
        <a className="vb2-nav-cta" href="#order">
          <span>🛒</span> অর্ডার করুন
        </a>
      </div>
    </nav>
  );
}

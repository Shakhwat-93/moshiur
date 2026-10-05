import React from 'react';

export default function Hero() {
  return (
    <section className="vb2-hero" id="top">
      <div className="vb2-hero-grid">
        {/* Left Copy */}
        <div>
          <span className="vb2-hbadge">🌿 সম্পূর্ণ প্রাকৃতিক ও নিরাপদ ভেষজ ফর্মুলা —</span>
          <h1>
            সকল ধরনের চুলকানি ও অ্যালার্জি ভেতর থেকে দূর করে,
            <em>আপনাকে দিবে দীর্ঘস্থায়ী সমাধান!</em>
          </h1>
          <p>
            ১ম দিন থেকেই পরিবর্তন বুঝতে পারবেন ইনশাআল্লাহ। রক্ত পরিশোধনের মাধ্যমে অ্যালার্জির মূল উৎস ধ্বংস করে আনে রাতে আরামদায়ক ঘুম ও যেকোনো পছন্দের খাবার খাওয়ার পূর্ণ স্বাধীনতা।
          </p>
          <div className="vb2-hero-actions">
            <a className="vb2-hero-cta" href="#order">👉 এখনই অর্ডার করুন</a>
            <a className="vb2-hero-call" href="tel:01604939479">📞 01604-939479</a>
          </div>
          <div className="vb2-hero-pills">
            <span>ক্যাশ অন ডেলিভারি</span>
            <span>১০০% অরিজিনাল ভেষজ</span>
            <span>কোনো সাইড ইফেক্ট নেই</span>
            <span>সারা দেশে ফ্রি ডেলিভারি</span>
          </div>
        </div>

        {/* Right Product Card */}
        <div>
          <div className="vb2-hero-card">
            <div className="vb2-hero-ribbon">🔥 সীমিত সময়ের অফার</div>
            <div className="vb2-hero-img-box">
              <img src="/images/IMG_7091.webp" alt="Zero Allergy Product Bottle & Box" />
            </div>
            <div className="vb2-hero-card-info">
              <div className="vb2-hero-card-title">জিরো এলার্জি (Zero Allergy)</div>
              <div className="vb2-hero-card-price">
                <span className="new">৳ ৭৫০</span>
                <span className="old">৳ ১,১৫০</span>
              </div>
              <a href="#order" className="vb2-hero-card-btn">অর্ডার করতে ফরম পূরণ করুন ↓</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicHero() {
  const { homepageSections, siteSettings, products } = useCms();
  const heroSection = homepageSections.find((s) => s.id === 'hero');

  if (heroSection && heroSection.is_enabled === false) return null;

  const cfg = heroSection?.config || {};
  const badge = cfg.badge || '🌿 সম্পূর্ণ প্রাকৃতিক ও নিরাপদ ভেষজ ফর্মুলা —';
  const headline = cfg.headline || 'সকল ধরনের চুলকানি ও অ্যালার্জি ভেতর থেকে দূর করে,';
  const emText = cfg.em || 'আপনাকে দিবে দীর্ঘস্থায়ী সমাধান!';
  const subheadline =
    cfg.subheadline ||
    '১ম দিন থেকেই পরিবর্তন বুঝতে পারবেন ইনশাআল্লাহ। রক্ত পরিশোধনের মাধ্যমে অ্যালার্জির মূল উৎস ধ্বংস করে আনে রাতে আরামদায়ক ঘুম ও যেকোনো পছন্দের খাবার খাওয়ার পূর্ণ স্বাধীনতা।';
  const ctaText = cfg.cta_text || 'এখনই অর্ডার করুন';
  const ctaUrl = cfg.cta_url || '#order';
  const phone = siteSettings?.phone_1 || '01604-939479';
  const rawPhone = phone.replace(/[^0-9]/g, '');

  // Active product details for the right-side card
  const primaryProduct = products.find((p) => p.status === 'active') || {
    title: 'জিরো এলার্জি (Zero Allergy)',
    price: 750,
    compare_at_price: 1150,
    images: ['/images/IMG_7091.webp']
  };

  const imageUrl = cfg.image_url || primaryProduct.images?.[0] || '/images/IMG_7091.webp';
  const productTitle = primaryProduct.title || 'জিরো এলার্জি (Zero Allergy)';
  const price = primaryProduct.price || 750;
  const comparePrice = primaryProduct.compare_at_price || 1150;

  return (
    <section className="vb2-hero" id="top">
      <div className="vb2-hero-grid">
        {/* Left Copy */}
        <div>
          <span className="vb2-hbadge">{badge}</span>
          <h1>
            {headline}
            <br />
            <em>{emText}</em>
          </h1>
          <p>{subheadline}</p>

          <div className="vb2-hero-actions">
            <a className="vb2-hero-cta" href={ctaUrl}>
              👉 {ctaText}
            </a>
            <a className="vb2-hero-call" href={`tel:${rawPhone}`}>
              📞 {phone}
            </a>
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
              <img
                src={imageUrl}
                alt={productTitle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/IMG_7091.webp';
                }}
              />
            </div>
            <div className="vb2-hero-card-info">
              <div className="vb2-hero-card-title">{productTitle}</div>
              <div className="vb2-hero-card-price">
                <span className="new">৳ {price}</span>
                {comparePrice > price && <span className="old">৳ {comparePrice}</span>}
              </div>
              <a href="#order" className="vb2-hero-card-btn">
                অর্ডার করতে ফরম পূরণ করুন ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

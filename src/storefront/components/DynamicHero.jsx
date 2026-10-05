import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicHero() {
  const { homepageSections } = useCms();
  const heroSection = homepageSections.find((s) => s.id === 'hero');

  if (heroSection && heroSection.is_enabled === false) return null;

  const cfg = heroSection?.config || {};
  const headline =
    cfg.headline ||
    'সকল ধরনের চুলকানি ও এলা-র্জি ভেতর থেকে দূর করে, আপনাকে দিবে দীর্ঘস্থায়ী সমাধান';
  const subheadline = cfg.subheadline || '১ম দিন থেকেই পরিবর্তন বুঝতে পারবেন';
  const imageUrl = cfg.image_url || '/images/IMG_7091.webp';
  const ctaText = cfg.cta_text || 'অর্ডার করুন';
  const ctaUrl = cfg.cta_url || '#order';

  return (
    <section className="vb2-hero-showcase" id="top">
      {/* 1. Maroon Headline Banner (Headline in yellow + Subtitle in white) */}
      <div className="vb2-hero-banner">
        <div className="vb2-hero-banner-inner">
          <h1 className="vb2-hero-heading">{headline}</h1>
          {subheadline && <p className="vb2-hero-subheading">{subheadline}</p>}
        </div>
      </div>

      {/* 2. Framed Product Picture & 3. Orange "অর্ডার করুন" Button */}
      <div className="vb2-hero-content-wrap">
        <div className="vb2-hero-img-box">
          <img
            src={imageUrl}
            alt="Zero Allergy Medicine Box and Bottle"
            draggable="false"
          />
        </div>

        <a className="vb2-hero-order-btn" href={ctaUrl}>
          <span>{ctaText}</span>
          <svg
            className="vb2-hero-arrow-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 9V5l12 7-12 7v-4.1c-7 0-11 4.1-11 9.1 0-7 4-13 11-15z" />
          </svg>
        </a>
      </div>
    </section>
  );
}

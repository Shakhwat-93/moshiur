import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicHero() {
  const { homepageSections } = useCms();
  const heroSection = homepageSections.find((s) => s.id === 'hero');

  if (heroSection && heroSection.is_enabled === false) return null;

  const cfg = heroSection?.config || {};
  const badge = cfg.badge || '🌿 সম্পূর্ণ প্রাকৃতিক ও নিরাপদ —';
  const headline = cfg.headline || 'সকল ধরনের চুলকানি ও অ্যালার্জি দূর করার';
  const emText = cfg.em || 'কার্যকর প্রাকৃতিক সমাধান!';
  const subheadline =
    cfg.subheadline ||
    'জিরো এলার্জি শরীরের ভেতর থেকে রক্ত পরিশোধন করে অ্যালার্জির স্থায়ী সমাধান নিশ্চিত করে, কোনো পার্শ্বপ্রতিক্রিয়া নেই।';
  const ctaText = cfg.cta_text || 'এখনই অর্ডার করুন ↓';
  const ctaUrl = cfg.cta_url || '#order';

  return (
    <section className="vb2-hero" id="top">
      <div className="in">
        <span className="vb2-hbadge">{badge}</span>
        <h1>
          {headline}
          {emText && <em>{emText}</em>}
        </h1>
        <p>{subheadline}</p>

        <a className="vb2-hero-cta" href={ctaUrl}>
          {ctaText}
        </a>

        <div className="vb2-hero-pills">
          <span>ক্যাশ অন ডেলিভারি</span>
          <span>১০০% অরিজিনাল</span>
          <span>দ্রুত হোম ডেলিভারি</span>
        </div>
      </div>
    </section>
  );
}

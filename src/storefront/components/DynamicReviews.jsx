import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicReviews() {
  const { testimonials, homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'reviews');

  if (sec && sec.is_enabled === false) return null;

  const title = sec?.title || 'আমাদের সম্মানিত গ্রাহকদের বাস্তব মতামত';
  const subtitle = sec?.subtitle || 'যাঁরা জিরো এলার্জি ব্যবহার করে উপকার পেয়েছেন, হোয়াটসঅ্যাপে তাঁদের পাঠানো সরাসরি স্ক্রিনশট ও অভিজ্ঞতা।';
  const badge = sec?.config?.badge || 'বাস্তব গ্রাহক প্রমাণ';

  const screenshots = [
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.24-PM.webp', alt: 'WhatsApp Review 1' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.25-PM.webp', alt: 'WhatsApp Review 2' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.25-PM-1.webp', alt: 'WhatsApp Review 3' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.26-PM.webp', alt: 'WhatsApp Review 4' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.26-PM-1.webp', alt: 'WhatsApp Review 5' }
  ];

  return (
    <section className="vb2-sec" id="reviews">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        {/* WhatsApp Screenshots Gallery */}
        <p className="vb2-block-t" style={{ marginBottom: '8px' }}>
          📱 হোয়াটসঅ্যাপে গ্রাহকদের সন্তুষ্টির প্রমাণ (ডানে স্ক্রোল করুন):
        </p>
        <div className="vb2-ss-grid">
          {screenshots.map((s, idx) => (
            <div className="vb2-ss-item" key={idx}>
              <img src={s.src} alt={s.alt} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Dynamic Testimonials Cards from DB */}
        <div className="vb2-rev-grid">
          {testimonials.map((t) => (
            <div className="vb2-rev-card" key={t.id}>
              <div className="stars">{'★'.repeat(t.rating || 5)}</div>
              <div className="txt">"{t.review_text}"</div>
              <div className="who">
                <div className="av">{t.avatar_letter || t.author_name?.charAt(0) || 'গ'}</div>
                <div>
                  <div className="nm">{t.author_name}</div>
                  <div className="lc">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

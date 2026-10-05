import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicTrustStrip() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'trust_strip');

  if (sec && sec.is_enabled === false) return null;

  const items = sec?.config?.items || [
    { icon: '🌿', title: '১০০% প্রাকৃতিক ভেষজ', desc: 'রাসায়নিক ও স্টেরয়েডমুক্ত ফর্মুলা' },
    { icon: '🚚', title: 'সারা দেশে ফ্রি ডেলিভারি', desc: 'পণ্য দেখে মূল্য পরিশোধ করুন' },
    { icon: '🛡️', title: 'ক্যাশ অন ডেলিভারি', desc: 'কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই' },
    { icon: '★', title: 'হাজারো সন্তুষ্ট গ্রাহক', desc: '৯৫%+ সফল পুনরাবৃত্তি গ্রাহক' }
  ];

  return (
    <section className="vb2-trust-strip">
      <div className="container">
        <div className="vb2-trust-grid">
          {items.map((item, idx) => (
            <div className="vb2-trust-card" key={idx}>
              <div className="icon">{item.icon}</div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

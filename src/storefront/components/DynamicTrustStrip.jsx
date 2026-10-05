import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicTrustStrip() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'trust_strip');

  if (sec && sec.is_enabled === false) return null;

  const defaultItems = [
    { icon: '🌿', title: '১০০% ভেষজ উপাদান', desc: 'কোনো ক্ষতিকর রাসায়নিক নেই' },
    { icon: '🔬', title: 'ল্যাব টেস্ট পরীক্ষিত', desc: 'গবেষণায় প্রমাণিত বিশুদ্ধতা' },
    { icon: '🛡️', title: 'ক্যাশ অন ডেলিভারি', desc: 'পণ্য হাতে পেয়ে টাকা দিন' },
    { icon: '🚚', title: 'সারা দেশে ফ্রি ডেলিভারি', desc: 'দ্রুততম সময়ে হোম ডেলিভারি' }
  ];

  const items = sec?.config?.items && sec.config.items.length > 0 ? sec.config.items : defaultItems;

  return (
    <div className="vb2-trust">
      <div className="trust-grid">
        {items.map((item, idx) => (
          <div className="t-item" key={idx}>
            <div className="t-icon">{item.icon}</div>
            <div>
              <b>{item.title}</b>
              <small>{item.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

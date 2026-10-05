import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicPackages({ onSelectProduct }) {
  const { products, homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'packages');

  if (sec && sec.is_enabled === false) return null;

  const activeProducts = products.filter((p) => p.status === 'active');

  const title = sec?.title || 'আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন';
  const subtitle = sec?.subtitle || 'আজকে অর্ডার করলে সারা বাংলাদেশে হোম ডেলিভারি সম্পূর্ণ ফ্রি! ক্যাশ অন ডেলিভারিতে চেক করে পেমেন্ট করুন।';
  const badge = sec?.config?.badge || 'প্যাকেজ ও অফার মূল্য';

  const handleSelect = (productId) => {
    if (onSelectProduct) onSelectProduct(productId);
    const orderElem = document.getElementById('order');
    if (orderElem) orderElem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="vb2-sec" id="packs">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-packs">
          {activeProducts.map((p, idx) => {
            const isPopular = p.is_featured || idx === 1;
            const savings = p.compare_at_price > p.price ? p.compare_at_price - p.price : 0;

            return (
              <div key={p.id} className={`vb2-pack ${isPopular ? 'pop' : ''}`}>
                <div className="rib">
                  {isPopular ? 'সবচেয়ে জনপ্রিয় — সেরা অফার' : 'স্টার্টার প্যাক'}
                </div>
                {savings > 0 && (
                  <div className="disc">{savings}৳ সাশ্রয়</div>
                )}
                <img
                  alt={p.title}
                  className="pimg"
                  src={p.images?.[0] || '/images/IMG_7091.webp'}
                />
                <h3>{p.title}</h3>
                <p className="pdesc">{p.short_description || '১ মাসের কোর্স'}</p>
                <div className="prow">
                  <span className="pnew">৳ {p.price}</span>
                  {p.compare_at_price > p.price && (
                    <span className="pold">৳ {p.compare_at_price}</span>
                  )}
                </div>
                <div className="chips">
                  <span className="chip">🚚 ফ্রি ডেলিভারি</span>
                  <span className="chip">🛡️ ক্যাশ অন ডেলিভারি</span>
                  {savings > 0 && <span className="chip">🎁 {savings}৳ সাশ্রয়</span>}
                </div>
                <button
                  className="pbtn"
                  type="button"
                  onClick={() => handleSelect(p.id)}
                >
                  এই প্যাকেজটি নিন →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

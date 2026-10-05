import React from 'react';

export default function Packages({ onSelectPackage }) {
  const handleSelect = (pkgId) => {
    if (onSelectPackage) onSelectPackage(pkgId);
    const orderElem = document.getElementById('order');
    if (orderElem) {
      orderElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="vb2-sec" id="packs">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">প্যাকেজ ও অফার মূল্য</span>
          <h2 className="vb2-title">
            আপনার প্রয়োজন অনুযায়ী <em>প্যাকেজ বেছে নিন</em>
          </h2>
          <p class="vb2-lead">
            আজকে অর্ডার করলে সারা বাংলাদেশে হোম ডেলিভারি সম্পূর্ণ ফ্রি! ক্যাশ অন ডেলিভারিতে চেক করে পেমেন্ট করুন।
          </p>
        </div>

        <div className="vb2-packs">
          {/* Package 1 */}
          <div className="vb2-pack">
            <div className="rib">স্টার্টার প্যাক</div>
            <div className="disc">৪০০৳ ছাড়</div>
            <img alt="জিরো এলার্জি - ১ বোতল" className="pimg" src="/images/IMG_7091.webp" />
            <h3>জিরো এলার্জি - ১ বোতল</h3>
            <p className="pdesc">১ মাসের নিয়মিত কোর্স (প্রাথমিক ও সাধারণ অ্যালার্জির সমস্যার জন্য)</p>
            <div className="prow">
              <span className="pnew">৳ ৭৫০</span>
              <span className="pold">৳ ১,১৫০</span>
            </div>
            <div className="chips">
              <span className="chip">🚚 ফ্রি ডেলিভারি</span>
              <span className="chip">🛡️ ক্যাশ অন ডেলিভারি</span>
            </div>
            <button className="pbtn" type="button" onClick={() => handleSelect('pack_1')}>
              এই প্যাকেজটি নিন →
            </button>
          </div>

          {/* Package 2 (POPULAR) */}
          <div className="vb2-pack pop">
            <div className="rib">সবচেয়ে জনপ্রিয় — সেরা অফার</div>
            <div className="disc">৩০০৳ সাশ্রয়</div>
            <img alt="জিরো এলার্জি - ২ বোতল" className="pimg" src="/images/IMG_7091.webp" />
            <h3>জিরো এলার্জি - ২ বোতল</h3>
            <p className="pdesc">২ মাসের ফুল কমপ্লিট কোর্স (পুরাতন ও জটিল অ্যালার্জি স্থায়ী নির্মূলে সবচেয়ে কার্যকর)</p>
            <div className="prow">
              <span className="pnew">৳ ১,২০০</span>
              <span className="pold">৳ ১,৫০০</span>
            </div>
            <div className="chips">
              <span className="chip">🚚 ফ্রি ডেলিভারি</span>
              <span className="chip">🛡️ ক্যাশ অন ডেলিভারি</span>
              <span className="chip">🎁 ৩০০৳ অতিরিক্ত ছাড়</span>
            </div>
            <button className="pbtn" type="button" onClick={() => handleSelect('pack_2')}>
              এই প্যাকেজটি নিন →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

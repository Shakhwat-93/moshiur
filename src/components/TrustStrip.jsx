import React from 'react';

export default function TrustStrip() {
  return (
    <div className="vb2-trust">
      <div className="trust-grid">
        <div className="t-item">
          <div className="t-icon">🌿</div>
          <div>
            <b>১০০% ভেষজ উপাদান</b>
            <small>কোনো ক্ষতিকর রাসায়নিক নেই</small>
          </div>
        </div>
        <div className="t-item">
          <div className="t-icon">🔬</div>
          <div>
            <b>ল্যাব টেস্ট পরীক্ষিত</b>
            <small>গবেষণায় প্রমাণিত বিশুদ্ধতা</small>
          </div>
        </div>
        <div className="t-item">
          <div className="t-icon">🛡️</div>
          <div>
            <b>ক্যাশ অন ডেলিভারি</b>
            <small>পণ্য হাতে পেয়ে টাকা দিন</small>
          </div>
        </div>
        <div className="t-item">
          <div className="t-icon">🚚</div>
          <div>
            <b>সারা দেশে ফ্রি ডেলিভারি</b>
            <small>দ্রুততম সময়ে হোম ডেলিভারি</small>
          </div>
        </div>
      </div>
    </div>
  );
}

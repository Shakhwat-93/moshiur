import React from 'react';

export default function LabReport() {
  return (
    <section className="vb2-sec alt" id="lab-test">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">পরীক্ষিত বিশুদ্ধতা</span>
          <h2 className="vb2-title">
            পরীক্ষিত <em>ল্যাব টেস্ট রিপোর্ট</em>
          </h2>
          <p className="vb2-lead">
            জিরো এলার্জি কোনো সাধারণ কবিরাজি বড়ি নয়, এটি গবেষণাগারে মান নিয়ন্ত্রিত এবং সম্পূর্ণ স্টেরয়েডমুক্ত প্রাকৃতিক সমাধান।
          </p>
        </div>

        <div className="vb2-lab-grid">
          <div className="vb2-lab-img">
            <img src="/images/Untitled-design-4-1.jpg" alt="Zero Allergy Official Lab Test Report" />
          </div>
          <div className="vb2-lab-content">
            <h3>বৈজ্ঞানিক বিশুদ্ধতা ও গুণগত নিশ্চয়তা</h3>
            <p>
              আমাদের প্রতিটি ব্যাচ স্বাস্থ্যবিধি ও বিশুদ্ধতার আন্তর্জাতিক মানদণ্ড অনুসরণ করে প্রস্তুত করা হয়। এতে কোনো প্রকার কৃত্রিম রঙ, বিপজ্জনক কেমিক্যাল বা ক্ষতিকর স্টেরয়েড নেই।
            </p>
            <ul className="vb2-lab-points">
              <li><span>✓</span> শতভাগ নিরাপদ ভেষজ উপাদানের নিশ্চয়তা</li>
              <li><span>✓</span> কোনো ক্ষতিকর স্টেরয়েড বা রাসায়নিক উপাদান নেই</li>
              <li><span>✓</span> কিডনি ও পাকস্থলীর জন্য শতভাগ নিরাপদ ও পার্শ্বপ্রতিক্রিয়াহীন</li>
              <li><span>✓</span> অভিজ্ঞ হাকিম ও হারবাল বিজ্ঞানীদের দীর্ঘ গবেষণার ফসল</li>
            </ul>
            <a href="#order" className="vb2-nav-cta" style={{ display: 'inline-block' }}>
              নিরাপদ প্রোডাক্ট অর্ডার করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

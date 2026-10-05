import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicLabReport() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'lab_report');

  if (sec && sec.is_enabled === false) return null;

  const cfg = sec?.config || {};
  const title = sec?.title || 'পরীক্ষিত ল্যাব টেস্ট রিপোর্ট';
  const subtitle = sec?.subtitle || 'জিরো এলার্জি কোনো সাধারণ কবিরাজি বড়ি নয়, এটি গবেষণাগারে মান নিয়ন্ত্রিত এবং সম্পূর্ণ স্টেরয়েডমুক্ত প্রাকৃতিক সমাধান।';
  const badge = cfg.badge || 'পরীক্ষিত বিশুদ্ধতা';
  const imageUrl = cfg.image_url || '/images/Untitled-design-4-1.jpg';
  const heading = cfg.heading || 'বৈজ্ঞানিক বিশুদ্ধতা ও গুণগত নিশ্চয়তা';
  const description = cfg.description || 'আমাদের প্রতিটি ব্যাচ স্বাস্থ্যবিধি ও বিশুদ্ধতার আন্তর্জাতিক মানদণ্ড অনুসরণ করে প্রস্তুত করা হয়। এতে কোনো প্রকার কৃত্রিম রঙ, বিপজ্জনক কেমিক্যাল বা ক্ষতিকর স্টেরয়েড নেই।';
  const points = cfg.points || [
    'শতভাগ নিরাপদ ভেষজ উপাদানের নিশ্চয়তা',
    'কোনো ক্ষতিকর স্টেরয়েড বা রাসায়নিক উপাদান নেই',
    'কিডনি ও পাকস্থলীর জন্য শতভাগ নিরাপদ ও পার্শ্বপ্রতিক্রিয়াহীন',
    'অভিজ্ঞ হাকিম ও হারবাল বিজ্ঞানীদের দীর্ঘ গবেষণার ফসল'
  ];

  return (
    <section className="vb2-sec alt" id="lab-test">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-lab-grid">
          <div className="vb2-lab-img">
            <img src={imageUrl} alt="Lab Test Certificate" />
          </div>
          <div className="vb2-lab-content">
            <h3>{heading}</h3>
            <p>{description}</p>
            <ul className="vb2-lab-points">
              {points.map((pt, idx) => (
                <li key={idx}>
                  <span>✓</span> {pt}
                </li>
              ))}
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

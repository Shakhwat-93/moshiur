import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicBenefits() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'benefits');

  if (sec && sec.is_enabled === false) return null;

  const title = sec?.title || 'জিরো এলার্জি কীভাবে আপনাকে স্থায়ী মুক্তি দেবে?';
  const subtitle = sec?.subtitle || 'অভিজ্ঞ হাকিমদের ফর্মুলায় তৈরি জিরো এলার্জি শরীরের ভেতর থেকে রক্ত পরিশোধন করে অ্যালার্জির স্থায়ী সমাধান নিশ্চিত করে।';
  const badge = sec?.config?.badge || 'কার্যকর সমাধান';

  const items = sec?.config?.items || [
    { title: '১) নির্ভয়ে যেকোনো খাবার খাওয়ার স্বাধীনতা', desc: 'চিংড়ি, ইলিশ, গরুর মাংস, বেগুন সহ যেকোনো প্রিয় খাবার নিশ্চিন্তে খেতে পারবেন, কোনো অ্যালার্জির ভয় থাকবে না ইনশাআল্লাহ।' },
    { title: '২) রক্ত থেকে অ্যালার্জি ও চুলকানি নির্মূল', desc: 'রক্ত পরিশোধনের মাধ্যমে ত্বকের নিচের জীবাণু ও টক্সিন নিষ্কাশন করে সারা শরীরের চুলকানি চিরতরে দূর করে।' },
    { title: '৩) যত বছরের পুরাতন অ্যালার্জিও দূর করে', desc: '৫-১০ বছরের পুরাতন জটিল অ্যালার্জি কিংবা দীর্ঘদিনের হাঁচি-কাশি থেকেও স্থায়ী সুস্থতা নিশ্চিত করে।' },
    { title: '৪) জটিল চর্মরোগে বিশেষ নিরাময়', desc: 'সোরিয়াসিস, খোস-পাঁচড়া, দাউদ ও একজিমার মতো ক্ষত ভেতর থেকে শুকিয়ে স্বাভাবিক মসৃণ ত্বক ফিরিয়ে আনে।' },
    { title: '৫) ডাস্ট ও কোল্ড অ্যালার্জি উপশম', desc: 'হাঁচি, সর্দি, নাক দিয়ে অনবরত পানি পড়া, নাক বন্ধ এবং শ্বাসকষ্টের কষ্ট থেকে মুক্ত করে সুস্থ স্বাভাবিক জীবন দেয়।' },
    { title: '৬) চুলকানি দূর করে এনে দেয় শান্তির ঘুম', desc: 'রাতে বিছানায় শোবার পরেই যে অসহ্য চুলকানি শুরু হয়, তা নিমিষেই বন্ধ করে দেয় আরামদায়ক সুনিদ্রা।' }
  ];

  return (
    <section className="vb2-sec alt" id="benefits">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-benefits-wrap">
          <div className="vb2-benefits-grid">
            {items.map((b, idx) => (
              <div className="vb2-benefit-item" key={idx}>
                <div className="vb2-benefit-icon">✓</div>
                <div className="vb2-benefit-text">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

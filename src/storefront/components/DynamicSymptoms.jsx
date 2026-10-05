import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicSymptoms() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'symptoms');

  if (sec && sec.is_enabled === false) return null;

  const title = sec?.title || 'আপনার কি এই সমস্যাগুলো হচ্ছে?';
  const subtitle = sec?.subtitle || 'দীর্ঘদিন ধরে এলার্জি ও চর্মরোগের অস্বস্তিতে ভুগছেন? লক্ষণগুলো মিলিয়ে নিন';
  const badge = sec?.config?.badge || 'সমস্যা চিহ্নিতকরণ';

  const defaultItems = [
    { num: '০১', icon: '🍤', title: 'প্রিয় খাবারে অ্যালার্জি', desc: 'চিংড়ি, ইলিশ, গরুর মাংস, হাঁসের ডিম, বেগুন কিংবা পুঁইশাক খেলেই সারা শরীরে লাল চাকা হয়ে চুলকানি ও অস্বস্তি শুরু হয়।' },
    { num: '০২', icon: '💨', title: 'ডাস্ট অ্যালার্জি ও হাঁচি', desc: 'ধুলোবালি বা সামান্য গন্ধ নাকে গেলেই অনবরত হাঁচি, সর্দি, নাক চুলকানো ও চোখ দিয়ে পানি পড়তে থাকে।' },
    { num: '০৩', icon: '❄️', title: 'কোল্ড অ্যালার্জি ও শ্বাসকষ্ট', desc: 'সামান্য ঠান্ডা বাতাস বা আবহাওয়া পরিবর্তনের সাথে সাথে কাশি, নাক বন্ধ এবং রাতে বুক ভারি হয়ে শ্বাসকষ্ট হয়।' },
    { num: '০৪', icon: '🔥', title: 'অসহ্য চুলকানি ও লাল দাগ', desc: 'বিশেষ করে রাতে বিছানায় গেলে শরীরের বিভিন্ন অংশে চুলকানি বেড়ে যায় এবং চুলকাতে চুলকাতে চামড়া লাল হয়ে যায়।' },
    { num: '০৫', icon: '💧', title: 'অ্যালার্জিক রাইনাইটিস', desc: 'সকালে ঘুম থেকে উঠেই একটানা হাঁচি, নাক দিয়ে অনবরত কাঁচা পানি পড়া এবং চোখ ও নাকের ভেতরে চুলকানো।' },
    { num: '০৬', icon: '🩹', title: 'পুরাতন চর্মরোগ', desc: 'সোরিয়াসিস, খোস-পাঁচড়া, দাউদ ও একজিমা—যা অনেক দিন ধরে বিভিন্ন মলম বা অ্যান্টিবায়োটিক ব্যবহার করেও নির্মূল হচ্ছে না।' }
  ];

  const items = sec?.config?.items && sec.config.items.length > 0 ? sec.config.items : defaultItems;

  return (
    <section className="vb2-sec" id="problems">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-symptoms-grid">
          {items.map((item, idx) => (
            <div className="vb2-symptom-card" key={idx}>
              <div className="vb2-symptom-icon">{item.icon || item.num || `0${idx + 1}`}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

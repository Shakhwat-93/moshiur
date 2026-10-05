import React from 'react';

export default function Symptoms() {
  const symptoms = [
    {
      icon: '🍤',
      title: 'খাবারের অ্যালার্জি',
      desc: 'ইলিশ, চিংড়ি, হাঁসের মাংস, গরুর মাংস, বেগুন বা ডিম খেলেই সারা শরীরে লাল চাকা হয়ে ফুলে ওঠা ও অসহ্য চুলকানি শুরু হয়।'
    },
    {
      icon: '💨',
      title: 'ডাস্ট ও কোল্ড অ্যালার্জি',
      desc: 'সামান্য ধুলাবালি বা ঠাণ্ডা বাতাস লাগলেই অনবরত হাঁচি, সর্দি, নাক দিয়ে পানি পড়া, নাক বন্ধ হয়ে দম আটকে আসা ও শ্বাসকষ্ট।'
    },
    {
      icon: '🩸',
      title: 'রক্তে অ্যালার্জির প্রভাব',
      desc: 'রক্ত দূষণের কারণে শরীরের ভেতরে অস্বস্তি, সারারাত চুলকানির যন্ত্রণায় চোখের পাতা এক করতে না পারা ও বিষাক্ত চুলকানি ভাব।'
    },
    {
      icon: '🩹',
      title: 'পুরাতন চর্মরোগ',
      desc: 'সোরিয়াসিস, খোস-পাঁচড়া, দাউদ ও একজিমা—যা অনেক দিন ধরে বিভিন্ন মলম বা অ্যান্টিবায়োটিক ব্যবহার করেও নির্মূল হচ্ছে না।'
    }
  ];

  return (
    <section className="vb2-sec" id="problems">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">কেন এই ভোগান্তি?</span>
          <h2 className="vb2-title">
            আপনি কি দীর্ঘদিন ধরে <em>এই সমস্যাগুলোতে</em> ভুগছেন?
          </h2>
          <p className="vb2-lead">
            অ্যালার্জি শুধুমাত্র বাহ্যিক কোনো সমস্যা নয়, এর আসল কারণ রক্তের ভেতর লুকিয়ে থাকে। সাধারণ মলম বা সাময়িক ড্রপ দিয়ে এর স্থায়ী সমাধান সম্ভব নয়।
          </p>
        </div>

        <div className="vb2-symptoms-grid">
          {symptoms.map((item, index) => (
            <div key={index} className="vb2-symptom-card">
              <div className="vb2-symptom-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

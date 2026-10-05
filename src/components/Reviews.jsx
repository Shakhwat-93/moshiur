import React from 'react';

export default function Reviews() {
  const screenshots = [
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.24-PM.webp', alt: 'WhatsApp Customer Review 1' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.25-PM.webp', alt: 'WhatsApp Customer Review 2' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.25-PM-1.webp', alt: 'WhatsApp Customer Review 3' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.26-PM.webp', alt: 'WhatsApp Customer Review 4' },
    { src: '/images/WhatsApp-Image-2026-03-31-at-1.42.26-PM-1.webp', alt: 'WhatsApp Customer Review 5' }
  ];

  const testimonials = [
    {
      stars: '★★★★★',
      text: '১০ বছর ধরে হাঁসের মাংস, চিংড়ি আর বেগুন খেলেই সারা শরীরে লাল চাকা হয়ে চুলকাতো। এই ওষুধ মাত্র ১ মাস খেয়ে এখন যেকোনো খাবার নিশ্চিন্তে খেতে পারছি। আলহামদুলিল্লাহ!',
      initial: 'র',
      name: 'মোঃ রফিকুল ইসলাম',
      location: 'মিরপুর, ঢাকা'
    },
    {
      stars: '★★★★★',
      text: 'শীতের সময় কোল্ড অ্যালার্জি আর ডাস্টের কারণে হাঁচি ও নাক বন্ধ হয়ে রাতে ঘুমাতে পারতাম না। জিরো এলার্জি ব্যবহারে প্রথম সপ্তাহ থেকেই খুব ভালো ফলাফল পেয়েছি।',
      initial: 'স',
      name: 'সালমা খাতুন',
      location: 'জিইসি, চট্টগ্রাম'
    },
    {
      stars: '★★★★★',
      text: 'প্যাকেজিং ও ডেলিভারি খুব দ্রুত ছিল। অগ্রিম টাকা ছাড়াই ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি। ওষুধটি সত্যিই কার্যকরী, কোনো সাইড ইফেক্ট হয়নি।',
      initial: 'আ',
      name: 'আরিফুল হক',
      location: 'উপশহর, সিলেট'
    }
  ];

  return (
    <section className="vb2-sec" id="reviews">
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">বাস্তব গ্রাহক প্রমাণ</span>
          <h2 className="vb2-title">
            আমাদের সম্মানিত গ্রাহকদের <em>বাস্তব মতামত</em>
          </h2>
          <p className="vb2-lead">
            যাঁরা জিরো এলার্জি ব্যবহার করে উপকার পেয়েছেন, হোয়াটসঅ্যাপে তাঁদের পাঠানো সরাসরি স্ক্রিনশট ও অভিজ্ঞতা।
          </p>
        </div>

        {/* WhatsApp Screenshots Scrollable Gallery */}
        <p className="vb2-block-t" style={{ marginBottom: '8px' }}>
          📱 হোয়াটসঅ্যাপে গ্রাহকদের সন্তুষ্টির প্রমাণ (ডানে স্ক্রোল করুন):
        </p>
        <div className="vb2-ss-grid">
          {screenshots.map((s, idx) => (
            <div className="vb2-ss-item" key={idx}>
              <img src={s.src} alt={s.alt} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Customer Testimonial Cards */}
        <div className="vb2-rev-grid">
          {testimonials.map((t, idx) => (
            <div className="vb2-rev-card" key={idx}>
              <div className="stars">{t.stars}</div>
              <div className="txt">"{t.text}"</div>
              <div className="who">
                <div className="av">{t.initial}</div>
                <div>
                  <div className="nm">{t.name}</div>
                  <div className="lc">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

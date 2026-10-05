import React, { useState, useEffect } from 'react';

const NOTIFICATIONS = [
  { name: 'সুমি আক্তার, চট্টগ্রাম', text: '১ মিনিট আগে ২ বোতল অর্ডার করেছেন' },
  { name: 'মোঃ জামান, ঢাকা', text: 'এইমাত্র ১ বোতল অর্ডার করেছেন' },
  { name: 'তানভীর আহমেদ, সিলেট', text: '৩ মিনিট আগে ২ বোতল অর্ডার করেছেন' },
  { name: 'ফরিদা বেগম, রাজশাহী', text: '২ মিনিট আগে ১ বোতল অর্ডার করেছেন' },
  { name: 'রাকিবুল ইসলাম, কুমিল্লা', text: '৪ মিনিট আগে ২ বোতল অর্ডার করেছেন' },
  { name: 'নাসরিন সুলতানা, খুলনা', text: 'এইমাত্র ২ বোতল অর্ডার করেছেন' }
];

export default function SocialToast() {
  const [current, setCurrent] = useState(NOTIFICATIONS[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const showToast = () => {
      index = (index + 1) % NOTIFICATIONS.length;
      setCurrent(NOTIFICATIONS[index]);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    const initialTimeout = setTimeout(showToast, 3000);
    const interval = setInterval(showToast, 8500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`vb2-toast ${visible ? 'show' : ''}`} id="vb2toast">
      <div className="ic">🛍️</div>
      <div>
        <b id="vb2toastName">{current.name}</b>
        <small id="vb2toastTime">{current.text}</small>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicBeforeAfter() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'before_after');

  if (sec && sec.is_enabled === false) return null;

  const [sliderPos, setSliderPos] = useState(50);

  const title = sec?.title || 'ফলাফল টেনে দেখুন';
  const subtitle =
    sec?.subtitle ||
    'মাঝের হ্যান্ডেলটা হাত দিয়ে ডানে-বামে টানুন — একই ফ্রেমে ব্যবহারের আগে ও পরের পরিবর্তন দেখুন।';
  const badge = sec?.config?.badge || 'Before / After';

  const beforeImg = sec?.config?.before_image || '/images/before_rash.jpg';
  const afterImg = sec?.config?.after_image || '/images/after_clear.jpg';

  const handleSliderChange = (e) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section className="vb2-sec" id="before-after" style={{ background: '#ffffff' }}>
      <div className="container">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">
            বাস্তব পরিবর্তন — <em>{title}</em>
          </h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-ba-wrap">
          <div
            className="vb2-ba"
            id="vb2ba"
            style={{ '--ba-pos': `${sliderPos}%` }}
          >
            {/* Before Image (underneath) */}
            <img
              src={beforeImg}
              alt="Before Treatment"
              className="before"
              loading="lazy"
            />

            {/* After Image (clipped) */}
            <img
              src={afterImg}
              alt="After Treatment with Zero Allergy"
              className="after"
              loading="lazy"
            />

            {/* Labels */}
            <span className="tag b">আগে (Before)</span>
            <span className="tag a">পরে (After)</span>

            {/* Divider Bar with Knob */}
            <div className="bar">
              <div className="knob">⟷</div>
            </div>
          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={handleSliderChange}
            className="vb2-ba-range"
            aria-label="Before after comparison slider"
          />
        </div>
      </div>
    </section>
  );
}

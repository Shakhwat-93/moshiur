import React, { useState, useRef, useCallback } from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicBeforeAfter() {
  const { homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'before_after');

  if (sec && sec.is_enabled === false) return null;

  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  const title = sec?.title || 'ফলাফল টেনে দেখুন';
  const subtitle =
    sec?.subtitle ||
    'ছবিটির উপরে আঙুল বা মাউস দিয়ে ডানে-বামে টানুন — একই ফ্রেমে ব্যবহারের আগে ও পরের পরিবর্তন সরাসরি দেখুন।';
  const badge = sec?.config?.badge || 'Before / After';

  const beforeImg = sec?.config?.before_image || '/images/before_rash.jpg';
  const afterImg = sec?.config?.after_image || '/images/after_clear.jpg';

  // Calculate percentage from pointer event on image
  const updatePosFromClientX = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(Math.round(percentage * 10) / 10);
  }, []);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    updatePosFromClientX(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current || e.buttons === 1) {
      updatePosFromClientX(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

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
          {/* Interactive Comparison Container with Touch/Mouse Drag Support */}
          <div
            className="vb2-ba"
            id="vb2ba"
            ref={containerRef}
            style={{ '--ba-pos': `${sliderPos}%` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="slider"
            aria-valuenow={sliderPos}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="ছবিতে হাত দিয়ে ডানে-বামে টেনে বিফোর ও আফটার দেখুন"
            tabIndex={0}
          >
            {/* Before Image (underneath) */}
            <img
              src={beforeImg}
              alt="Before Treatment"
              className="before"
              draggable="false"
            />

            {/* After Image (clipped) */}
            <img
              src={afterImg}
              alt="After Treatment with Zero Allergy"
              className="after"
              draggable="false"
            />

            {/* Labels */}
            <span className="tag b">আগে (Before)</span>
            <span className="tag a">পরে (After)</span>

            {/* Divider Bar with Interactive Knob */}
            <div className="bar">
              <div className="knob" title="ডানে-বামে টানুন">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Secondary Range Control Bar */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleSliderChange}
              className="vb2-ba-range"
              aria-label="Before after range slider"
            />
            <div style={{ fontSize: '13px', color: 'var(--mut)', marginTop: '6px', fontWeight: 600 }}>
              👈 ছবিতে হাত দিয়ে ডানে-বামে টানুন 👉
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useCms } from '../../context/CmsContext';

export default function DynamicTicker() {
  const { siteSettings } = useCms();

  if (!siteSettings?.announcement_enabled) return null;

  const text = siteSettings?.announcement_text || '🌿 ১০০% ভেষজ ফর্মুলা ★ সারা দেশে ফ্রি ডেলিভারি';

  return (
    <div aria-hidden="true" className="vb2-ticker">
      <div className="trk">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

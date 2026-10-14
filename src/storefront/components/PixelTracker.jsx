import React, { useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { initTracking } from '../../lib/tracking';

export default function PixelTracker() {
  const { siteSettings } = useCms();

  useEffect(() => {
    if (siteSettings) {
      initTracking(siteSettings);
    }
  }, [siteSettings]);

  return null;
}

import React, { useEffect } from 'react';
import { useCms } from '../../context/CmsContext';

export default function PixelTracker() {
  const { siteSettings } = useCms();
  const fbPixelId = siteSettings?.fb_pixel_id;
  const tiktokPixelId = siteSettings?.tiktok_pixel_id;
  const gtmId = siteSettings?.gtm_id;

  // Facebook Pixel Injection
  useEffect(() => {
    if (!fbPixelId || window.__fb_pixel_loaded) return;

    try {
      /* eslint-disable */
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq('init', fbPixelId);
      window.fbq('track', 'PageView');
      window.__fb_pixel_loaded = true;
    } catch (e) {
      console.warn('FB Pixel initialization error:', e);
    }
  }, [fbPixelId]);

  // Google Tag Manager / Analytics Injection
  useEffect(() => {
    if (!gtmId || window.__gtm_loaded) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', gtmId);
      window.__gtm_loaded = true;
    } catch (e) {
      console.warn('GTM initialization error:', e);
    }
  }, [gtmId]);

  return null;
}

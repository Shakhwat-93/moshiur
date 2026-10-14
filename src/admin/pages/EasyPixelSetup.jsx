import React, { useState, useEffect } from 'react';
import { Target, Save, CheckCircle2, ShieldCheck, Code, Zap, HelpCircle, Activity } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { trackPurchase } from '../../lib/tracking';

export default function EasyPixelSetup() {
  const { siteSettings, updateSiteSettings, showToast } = useCms();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [pixelData, setPixelData] = useState({
    fb_pixel_id: '',
    fb_capi_access_token: '',
    fb_test_event_code: '',
    tiktok_pixel_id: '',
    ga4_id: '',
    gtm_id: '',
    pixel_enabled: true
  });

  useEffect(() => {
    if (siteSettings) {
      setPixelData({
        fb_pixel_id: siteSettings.fb_pixel_id || '',
        fb_capi_access_token: siteSettings.fb_capi_access_token || '',
        fb_test_event_code: siteSettings.fb_test_event_code || '',
        tiktok_pixel_id: siteSettings.tiktok_pixel_id || '',
        ga4_id: siteSettings.ga4_id || siteSettings.ga4_measurement_id || '',
        gtm_id: siteSettings.gtm_id || '',
        pixel_enabled: siteSettings.pixel_enabled !== false
      });
    }
  }, [siteSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({
        fb_pixel_id: pixelData.fb_pixel_id.trim(),
        fb_capi_access_token: pixelData.fb_capi_access_token.trim(),
        fb_test_event_code: pixelData.fb_test_event_code.trim(),
        tiktok_pixel_id: pixelData.tiktok_pixel_id.trim(),
        ga4_id: pixelData.ga4_id.trim(),
        gtm_id: pixelData.gtm_id.trim(),
        pixel_enabled: pixelData.pixel_enabled
      });
      showToast('পিক্সেল, CAPI এবং ট্র্যাকিং সেটিংস সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('পিক্সেল সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Trigger Live Test Event for Meta Events Manager, TikTok & dataLayer
  const handleFireTestEvent = async () => {
    setTesting(true);
    try {
      const dummyOrder = {
        order_id: `TEST-${Math.floor(100000 + Math.random() * 900000)}`,
        name: 'Test Customer',
        phone: '01700000000',
        package_name: 'জিরো এলার্জি - ১ বোতল (Test Course)',
        quantity: 1,
        unit_price: 750,
        total_price: 750,
        delivery_fee: 0
      };

      await trackPurchase({
        order: dummyOrder,
        siteSettings: {
          ...siteSettings,
          ...pixelData
        }
      });

      showToast(`টেস্ট ইভেন্ট সফলভাবে পাঠানো হয়েছে! (Order ID: ${dummyOrder.order_id})`);
    } catch (err) {
      console.error('Test event trigger error:', err);
      showToast('টেস্ট ইভেন্ট পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="easy-page-wrap">
      <div className="easy-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="easy-page-title">Pixel, CAPI & DataLayer Setup</h2>
          <p className="easy-page-desc">
            Facebook Browser Pixel, Server-side Conversions API (CAPI), TikTok Pixel এবং Google Analytics 4 DataLayer সম্পূর্ণ নির্ভুলভাবে সেটআপ করুন।
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="easy-pill-action"
            onClick={handleFireTestEvent}
            disabled={testing}
            title="লাইভ টেস্ট ইভেন্ট পাঠিয়ে Facebook Events Manager ও Console এ চেক করুন"
          >
            <Activity size={15} />
            <span>{testing ? 'ইভেন্ট পাঠানো হচ্ছে...' : 'Send Live Test Event'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="easy-form-stack">
        {/* 1. Facebook Pixel & Server-Side CAPI */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Target size={18} className="text-orange" />
            <h3>Facebook Meta Pixel & Conversions API (CAPI)</h3>
            <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '12px', fontWeight: 700, marginLeft: 'auto' }}>
              Deduplication Enabled
            </span>
          </div>

          <div className="easy-field-group">
            <label>Facebook Dataset / Pixel ID (মেটা পিক্সেল আইডি)</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.fb_pixel_id}
              onChange={(e) => setPixelData({ ...pixelData, fb_pixel_id: e.target.value })}
              placeholder="যেমন: 104829471928374"
            />
            <span className="easy-field-hint">
              Facebook Events Manager থেকে আপনার পিক্সেল / ডেটাসেট আইডি এখানে বসান। পেজভিউ, চেকআউট এবং পারচেজ ব্রাউজার থেকে ট্র্যাক হবে।
            </span>
          </div>

          <div className="easy-field-group" style={{ marginTop: '12px' }}>
            <label>Facebook Conversions API (CAPI) Access Token</label>
            <textarea
              rows={2}
              className="easy-input"
              style={{ fontFamily: 'monospace', fontSize: '12.5px' }}
              value={pixelData.fb_capi_access_token}
              onChange={(e) => setPixelData({ ...pixelData, fb_capi_access_token: e.target.value })}
              placeholder="EAA..."
            />
            <span className="easy-field-hint">
              Events Manager → Settings → Generate Access Token এ ক্লিক করে কপি করে পেস্ট করুন। এটি সার্ভার সাইড থেকে adblocker বাইপাস করে ১০০% রিয়েল পারচেজ ডাটা ফেসবুকে পাঠাবে।
            </span>
          </div>

          <div className="easy-field-group" style={{ marginTop: '12px' }}>
            <label>Facebook Test Event Code (ঐচ্ছিক — শুধুমাত্র টেস্ট করার জন্য)</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.fb_test_event_code}
              onChange={(e) => setPixelData({ ...pixelData, fb_test_event_code: e.target.value })}
              placeholder="যেমন: TEST12345"
            />
            <span className="easy-field-hint">
              Facebook Events Manager এর "Test events" ট্যাবে থাকা কোডটি দিলে সরাসরি ফেসবুক টেস্ট স্ক্রিনে ইভেন্ট সবুজ টিক সহ দেখতে পাবেন। টেস্ট শেষে এটি খালি করে সেভ করুন।
            </span>
          </div>
        </div>

        {/* 2. TikTok Pixel */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Code size={18} className="text-orange" />
            <h3>TikTok Pixel & Events</h3>
          </div>

          <div className="easy-field-group">
            <label>TikTok Pixel ID</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.tiktok_pixel_id}
              onChange={(e) => setPixelData({ ...pixelData, tiktok_pixel_id: e.target.value })}
              placeholder="যেমন: C8XXXXXXXXXXXXX"
            />
            <span className="easy-field-hint">
              TikTok Ads Manager → Assets → Event Manager থেকে প্রাপ্ত Pixel ID। ViewContent, InitiateCheckout ও CompletePayment ইভেন্ট সাপোর্ট করে।
            </span>
          </div>
        </div>

        {/* 3. Google Analytics 4 (GA4) & Google Tag Manager (GTM) */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Zap size={18} className="text-orange" />
            <h3>Google Analytics 4 & Tag Manager (DataLayer)</h3>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '12px', fontWeight: 700, marginLeft: 'auto' }}>
              dataLayer Active
            </span>
          </div>

          <div className="easy-two-col">
            <div className="easy-field-group">
              <label>GA4 Measurement ID (গুগল অ্যানালিটিক্স ৪)</label>
              <input
                type="text"
                className="easy-input"
                value={pixelData.ga4_id}
                onChange={(e) => setPixelData({ ...pixelData, ga4_id: e.target.value })}
                placeholder="যেমন: G-XXXXXXXXXX"
              />
            </div>

            <div className="easy-field-group">
              <label>GTM Container ID (গুগল ট্যাগ ম্যানেজার)</label>
              <input
                type="text"
                className="easy-input"
                value={pixelData.gtm_id}
                onChange={(e) => setPixelData({ ...pixelData, gtm_id: e.target.value })}
                placeholder="যেমন: GTM-XXXXXXX"
              />
            </div>
          </div>

          <div style={{ marginTop: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#334155' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Standard E-commerce DataLayer সক্রিয় রয়েছে:</span>
            </div>
            <code>window.dataLayer.push()</code> এ প্রতিটি ভিজিটে <code>page_view</code>, প্যাকেজ সিলেকশনে <code>view_item</code>, ফরম ফোকাসে <code>begin_checkout</code> এবং সফল অর্ডারে <code>purchase</code> ইভেন্ট স্বয়ংক্রিয়ভাবে প্রেরিত হয়।
          </div>
        </div>

        {/* Master Active Switch */}
        <div className="easy-subcard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>মাস্টার ট্র্যাকিং সক্রিয় রাখুন (Master Tracking Switch)</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>বন্ধ থাকলে কোনো পিক্সেল বা স্ক্রিপ্ট ব্রাউজারে এক্সিকিউট হবে না।</div>
          </div>
          <label className="easy-switch">
            <input
              type="checkbox"
              checked={pixelData.pixel_enabled}
              onChange={(e) => setPixelData({ ...pixelData, pixel_enabled: e.target.checked })}
            />
            <span className="easy-slider round"></span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="easy-submit-wrap">
          <button type="submit" className="easy-save-btn" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পিক্সেল ও CAPI সেটিংস সেভ করুন (Save Changes)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

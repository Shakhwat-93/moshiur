import React, { useState, useEffect } from 'react';
import { Target, Save, CheckCircle, ShieldAlert, Code } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function EasyPixelSetup() {
  const { siteSettings, updateSiteSettings, showToast } = useCms();
  const [saving, setSaving] = useState(false);

  const [pixelData, setPixelData] = useState({
    fb_pixel_id: '',
    tiktok_pixel_id: '',
    gtm_id: '',
    pixel_enabled: true
  });

  useEffect(() => {
    if (siteSettings) {
      setPixelData({
        fb_pixel_id: siteSettings.fb_pixel_id || '',
        tiktok_pixel_id: siteSettings.tiktok_pixel_id || '',
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
        tiktok_pixel_id: pixelData.tiktok_pixel_id.trim(),
        gtm_id: pixelData.gtm_id.trim(),
        pixel_enabled: pixelData.pixel_enabled
      });
      showToast('পিক্সেল ও ট্র্যাকিং আইডি সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('পিক্সেল সেভ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="easy-page-wrap">
      <div className="easy-card-header">
        <h2 className="easy-page-title">Pixel & Tracking Setup</h2>
        <p className="easy-page-desc">
          ফেসবুক ও টিকটক বিজ্ঞাপনের জন্য পিক্সেল কোড বা আইডি যুক্ত করুন। ওয়েবসাইট ভিজিট ও পারচেজ স্বয়ংক্রিয়ভাবে ট্র্যাক হবে।
        </p>
      </div>

      <form onSubmit={handleSave} className="easy-form-stack">
        {/* Facebook Pixel */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Target size={18} className="text-orange" />
            <h3>Facebook Meta Pixel</h3>
          </div>

          <div className="easy-field-group">
            <label>Facebook Pixel ID (মেটা পিক্সেল আইডি)</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.fb_pixel_id}
              onChange={(e) => setPixelData({ ...pixelData, fb_pixel_id: e.target.value })}
              placeholder="উদাহরণ: 123456789012345"
            />
            <span className="easy-field-hint">
              আপনার Facebook Events Manager থেকে শুধুমাত্র Pixel ID টি কপি করে এখানে বসান। পেজভিউ ও পারচেজ ইভেন্ট অটো ট্র্যাক হবে।
            </span>
          </div>
        </div>

        {/* TikTok Pixel */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Code size={18} className="text-orange" />
            <h3>TikTok Pixel</h3>
          </div>

          <div className="easy-field-group">
            <label>TikTok Pixel ID</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.tiktok_pixel_id}
              onChange={(e) => setPixelData({ ...pixelData, tiktok_pixel_id: e.target.value })}
              placeholder="উদাহরণ: C8XXXXXXXXXXXXX"
            />
            <span className="easy-field-hint">
              টিকটক এডস ম্যানেজারের Pixel Code/ID এখানে দিন।
            </span>
          </div>
        </div>

        {/* Google Tag Manager / Analytics */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Target size={18} className="text-orange" />
            <h3>Google Tag Manager / GA4</h3>
          </div>

          <div className="easy-field-group">
            <label>GTM ID বা GA4 Measurement ID</label>
            <input
              type="text"
              className="easy-input"
              value={pixelData.gtm_id}
              onChange={(e) => setPixelData({ ...pixelData, gtm_id: e.target.value })}
              placeholder="উদাহরণ: GTM-XXXXXXX অথবা G-XXXXXXXXXX"
            />
            <span className="easy-field-hint">
              গুগল এনালিটিক্স ৪ বা গুগল ট্যাগ ম্যানেজার কন্টেইনার আইডি।
            </span>
          </div>
        </div>

        {/* Tracking Enable Switch */}
        <div className="easy-subcard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>পিক্সেল ট্র্যাকিং সক্রিয় রাখুন (Enable Tracking)</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>লাইভ স্টোরে পিক্সেল কোড এক্সিকিউট হবে</div>
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
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পিক্সেল সেটিংস সেভ করুন (Save Pixel)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

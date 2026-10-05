import React, { useState, useEffect } from 'react';
import { Truck, Save, CheckCircle, ShieldCheck, Key, DollarSign } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function EasyCourierSetup() {
  const { siteSettings, updateSiteSettings, showToast } = useCms();
  const [saving, setSaving] = useState(false);

  const [courierData, setCourierData] = useState({
    courier_provider: 'steadfast',
    steadfast_api_key: '',
    steadfast_secret_key: '',
    shipping_inside_dhaka: 0,
    shipping_outside_dhaka: 0,
    free_shipping_enabled: true,
    free_shipping_text: 'সারা দেশে ফ্রি হোম ডেলিভারি'
  });

  useEffect(() => {
    if (siteSettings) {
      setCourierData({
        courier_provider: siteSettings.courier_provider || 'steadfast',
        steadfast_api_key: siteSettings.steadfast_api_key || '',
        steadfast_secret_key: siteSettings.steadfast_secret_key || '',
        shipping_inside_dhaka: siteSettings.shipping_inside_dhaka ?? 0,
        shipping_outside_dhaka: siteSettings.shipping_outside_dhaka ?? 0,
        free_shipping_enabled: siteSettings.free_shipping_enabled !== false,
        free_shipping_text: siteSettings.free_shipping_text || 'সারা দেশে ফ্রি হোম ডেলিভারি'
      });
    }
  }, [siteSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({
        courier_provider: courierData.courier_provider,
        steadfast_api_key: courierData.steadfast_api_key.trim(),
        steadfast_secret_key: courierData.steadfast_secret_key.trim(),
        shipping_inside_dhaka: parseFloat(courierData.shipping_inside_dhaka) || 0,
        shipping_outside_dhaka: parseFloat(courierData.shipping_outside_dhaka) || 0,
        free_shipping_enabled: courierData.free_shipping_enabled,
        free_shipping_text: courierData.free_shipping_text
      });
      showToast('কুরিয়ার ও ডেলিভারি সেটিংস সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('কুরিয়ার সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="easy-page-wrap">
      <div className="easy-card-header">
        <h2 className="easy-page-title">Courier & Delivery Setup</h2>
        <p className="easy-page-desc">
          কুরিয়ার সার্ভিস ইন্টিগ্রেশন এবং সারা দেশে ডেলিভারি চার্জ নির্ধারণ করুন।
        </p>
      </div>

      <form onSubmit={handleSave} className="easy-form-stack">
        {/* Courier Provider Selection */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <Truck size={18} className="text-orange" />
            <h3>কুরিয়ার সার্ভিস পার্টনার (Courier Partner)</h3>
          </div>

          <div className="easy-radio-grid">
            <label className={`easy-radio-card ${courierData.courier_provider === 'steadfast' ? 'active' : ''}`}>
              <input
                type="radio"
                name="courier_provider"
                value="steadfast"
                checked={courierData.courier_provider === 'steadfast'}
                onChange={() => setCourierData({ ...courierData, courier_provider: 'steadfast' })}
              />
              <div className="easy-radio-content">
                <div style={{ fontWeight: 700 }}>Steadfast Courier</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>সরাসরি API ইন্টিগ্রেশন (রেকমেন্ডেড)</div>
              </div>
            </label>

            <label className={`easy-radio-card ${courierData.courier_provider === 'pathao' ? 'active' : ''}`}>
              <input
                type="radio"
                name="courier_provider"
                value="pathao"
                checked={courierData.courier_provider === 'pathao'}
                onChange={() => setCourierData({ ...courierData, courier_provider: 'pathao' })}
              />
              <div className="easy-radio-content">
                <div style={{ fontWeight: 700 }}>Pathao Courier</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>পাঠাও মার্চেন্ট সার্ভিস</div>
              </div>
            </label>

            <label className={`easy-radio-card ${courierData.courier_provider === 'redx' ? 'active' : ''}`}>
              <input
                type="radio"
                name="courier_provider"
                value="redx"
                checked={courierData.courier_provider === 'redx'}
                onChange={() => setCourierData({ ...courierData, courier_provider: 'redx' })}
              />
              <div className="easy-radio-content">
                <div style={{ fontWeight: 700 }}>RedX Delivery</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>রেডেক্স লজিস্টিকস</div>
              </div>
            </label>

            <label className={`easy-radio-card ${courierData.courier_provider === 'manual' ? 'active' : ''}`}>
              <input
                type="radio"
                name="courier_provider"
                value="manual"
                checked={courierData.courier_provider === 'manual'}
                onChange={() => setCourierData({ ...courierData, courier_provider: 'manual' })}
              />
              <div className="easy-radio-content">
                <div style={{ fontWeight: 700 }}>Manual Courier</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>ম্যানুয়ালি পার্সেল বুকিং</div>
              </div>
            </label>
          </div>
        </div>

        {/* Steadfast API Credentials */}
        {courierData.courier_provider === 'steadfast' && (
          <div className="easy-subcard">
            <div className="easy-section-head">
              <Key size={18} className="text-orange" />
              <h3>Steadfast API Credentials</h3>
            </div>

            <div className="easy-field-group">
              <label>Steadfast API Key</label>
              <input
                type="text"
                className="easy-input"
                value={courierData.steadfast_api_key}
                onChange={(e) => setCourierData({ ...courierData, steadfast_api_key: e.target.value })}
                placeholder="আপনার Steadfast API Key পেস্ট করুন"
              />
            </div>

            <div className="easy-field-group">
              <label>Steadfast Secret Key</label>
              <input
                type="password"
                className="easy-input"
                value={courierData.steadfast_secret_key}
                onChange={(e) => setCourierData({ ...courierData, steadfast_secret_key: e.target.value })}
                placeholder="আপনার Steadfast Secret Key পেস্ট করুন"
              />
            </div>
          </div>
        )}

        {/* Delivery Charges */}
        <div className="easy-subcard">
          <div className="easy-section-head">
            <DollarSign size={18} className="text-orange" />
            <h3>ডেলিভারি চার্জ নির্ধারণ (Delivery Fee)</h3>
          </div>

          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>সারা দেশে সম্পূর্ণ ফ্রি ডেলিভারি দিন</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>চালু থাকলে কোনো ডেলিভারি ফি যোগ হবে না</div>
            </div>
            <label className="easy-switch">
              <input
                type="checkbox"
                checked={courierData.free_shipping_enabled}
                onChange={(e) => setCourierData({ ...courierData, free_shipping_enabled: e.target.checked })}
              />
              <span className="easy-slider round"></span>
            </label>
          </div>

          {!courierData.free_shipping_enabled && (
            <div className="easy-two-col">
              <div className="easy-field-group">
                <label>ঢাকার ভিতরে চার্জ (৳)</label>
                <input
                  type="number"
                  className="easy-input"
                  value={courierData.shipping_inside_dhaka}
                  onChange={(e) => setCourierData({ ...courierData, shipping_inside_dhaka: e.target.value })}
                />
              </div>
              <div className="easy-field-group">
                <label>ঢাকার বাইরে চার্জ (৳)</label>
                <input
                  type="number"
                  className="easy-input"
                  value={courierData.shipping_outside_dhaka}
                  onChange={(e) => setCourierData({ ...courierData, shipping_outside_dhaka: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="easy-submit-wrap">
          <button type="submit" className="easy-save-btn" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'কুরিয়ার সেটিংস সেভ করুন (Save Courier)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

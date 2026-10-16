import React, { useState, useEffect } from 'react';
import {
  Truck,
  Save,
  CheckCircle,
  ShieldCheck,
  Key,
  DollarSign,
  Activity,
  RotateCw,
  ExternalLink,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function EasyCourierSetup() {
  const { siteSettings, updateSiteSettings, showToast } = useCms();
  const [saving, setSaving] = useState(false);

  // Standard courier provider & delivery charges
  const [courierData, setCourierData] = useState({
    courier_provider: 'steadfast',
    steadfast_api_key: '',
    steadfast_secret_key: '',
    shipping_inside_dhaka: 0,
    shipping_outside_dhaka: 0,
    free_shipping_enabled: true,
    free_shipping_text: 'সারা দেশে ফ্রি হোম ডেলিভারি'
  });

  // BD Courier specific integration state
  const [bdConfig, setBdConfig] = useState({
    is_enabled: false,
    has_key: false,
    masked_key: '',
    connection_status: 'unconfigured',
    connection_message: '',
    last_checked_at: null
  });
  const [bdApiKey, setBdApiKey] = useState('');
  const [bdLoading, setBdLoading] = useState(true);
  const [bdTesting, setBdTesting] = useState(false);
  const [bdSaving, setBdSaving] = useState(false);

  // Fetch BD Courier server-side configuration
  const fetchBdConfig = async () => {
    try {
      setBdLoading(true);
      const res = await fetch('/api/admin-courier-config');
      const data = await res.json();
      if (data?.config) {
        setBdConfig(data.config);
      }
    } catch (err) {
      console.error('Error fetching BD Courier settings:', err);
    } finally {
      setBdLoading(false);
    }
  };

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
    fetchBdConfig();
  }, [siteSettings]);

  // Save standard shipping settings
  const handleSaveStandard = async (e) => {
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

  // Save BD Courier Integration settings
  const handleSaveBdCourier = async () => {
    setBdSaving(true);
    try {
      const res = await fetch('/api/admin-courier-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_enabled: bdConfig.is_enabled,
          api_key: bdApiKey.trim() || undefined
        })
      });
      const data = await res.json();
      if (data?.success && data?.config) {
        setBdConfig(data.config);
        setBdApiKey('');
        showToast('BD Courier ইন্টিগ্রেশন সেটিংস সফলভাবে সেভ হয়েছে!');
      } else {
        throw new Error(data?.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      showToast('BD Courier সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setBdSaving(false);
    }
  };

  // Test connection to BD Courier API
  const handleTestConnection = async () => {
    setBdTesting(true);
    try {
      const res = await fetch('/api/admin-courier-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          api_key: bdApiKey.trim() || undefined
        })
      });
      const data = await res.json();
      if (data?.connected) {
        showToast('✓ BD Courier API এর সাথে সফলভাবে কানেক্ট হয়েছে!');
      } else {
        showToast(`⚠️ কানেকশন ব্যর্থ: ${data?.message || 'Invalid Key'}`, 'error');
      }
      // Refresh current config status
      await fetchBdConfig();
    } catch (err) {
      console.error(err);
      showToast('কানেকশন টেস্টে নেটওয়ার্ক ত্রুটি হয়েছে', 'error');
    } finally {
      setBdTesting(false);
    }
  };

  const getStatusBadge = () => {
    switch (bdConfig.connection_status) {
      case 'connected':
        return (
          <span className="adm-badge adm-badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={12} /> কানেক্টেড (Active)
          </span>
        );
      case 'invalid_key':
        return (
          <span className="adm-badge adm-badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={12} /> ইনভ্যালিড এপিআই কি (Invalid Key)
          </span>
        );
      case 'unverified':
        return (
          <span className="adm-badge adm-badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> কি আপডেট হয়েছে — টেস্ট করুন
          </span>
        );
      case 'error':
        return (
          <span className="adm-badge adm-badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={12} /> কানেকশন ত্রুটি (Error)
          </span>
        );
      default:
        return (
          <span className="adm-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#64748b' }}>
            ○ কনফিগার করা হয়নি
          </span>
        );
    }
  };

  return (
    <div className="easy-page-wrap">
      <div className="easy-card-header">
        <h2 className="easy-page-title">Courier & Delivery Setup</h2>
        <p className="easy-page-desc">
          কুরিয়ার সার্ভিস ইন্টিগ্রেশন, কাস্টমার ডেলিভারি রেশিও ভেরিফিকেশন এবং সারা দেশে ডেলিভারি চার্জ নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <div className="easy-form-stack">
        {/* ================================================================= */}
        {/* SECTION: BD Courier Official API Integration                      */}
        {/* ================================================================= */}
        <div className="easy-subcard" style={{ border: '2px solid #fed7aa', background: '#fffaf5' }}>
          <div className="easy-section-head" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#9a3412' }}>
                  BD Courier Integration (কাস্টমার ডেলিভারি হিস্ট্রি ও ফ্রড চেকার)
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#7c2d12' }}>
                  গ্রাহকের পূর্ববর্তী পার্সেল ডেলিভারি ও ক্যানসেলেশন রেশিও চেক করার অফিশিয়াল API
                </p>
              </div>
            </div>

            {/* Connection Status Badge */}
            <div>{getStatusBadge()}</div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fed7aa' }}>
            {/* Toggle Enable/Disable */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>
                  অর্ডার সিস্টেমে BD Courier ভেরিফিকেশন চালু রাখুন
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  নতুন অর্ডার আসলে গ্রাহকের নম্বর স্বয়ংক্রিয়ভাবে যাচাই হবে ও Supabase-এ পার্মানেন্ট ক্যাশ থাকবে।
                </div>
              </div>
              <label className="easy-switch">
                <input
                  type="checkbox"
                  checked={bdConfig.is_enabled}
                  onChange={(e) => setBdConfig({ ...bdConfig, is_enabled: e.target.checked })}
                />
                <span className="easy-slider round"></span>
              </label>
            </div>

            {/* At-most-once Guarantee Banner */}
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '12.5px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} color="#059669" />
              <span>
                <strong>At-Most-Once প্রটেকশন সক্রিয়:</strong> একই নম্বরে কখনোই একাধিকবার এক্সটার্নাল API কল হবে না — রিফ্রেশ, পেজ রিলোড বা নতুন অর্ডারে সংরক্ষিত রেজাল্ট রিউজ হবে।
              </span>
            </div>

            {/* API Key Input */}
            <div className="easy-field-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>BD Courier API Key (Bearer Token)</span>
                {bdConfig.has_key && (
                  <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={11} /> AES-256 এনক্রিপ্টেড সেভ আছে: <code>{bdConfig.masked_key}</code>
                  </span>
                )}
              </label>
              <input
                type="password"
                className="easy-input"
                value={bdApiKey}
                onChange={(e) => setBdApiKey(e.target.value)}
                placeholder={bdConfig.has_key ? 'বিদ্যমান কি অপরিবর্তিত রাখতে খালি রাখুন' : 'আপনার BD Courier API Bearer Token পেস্ট করুন'}
              />
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>API কি পেতে আপনার BD Courier অ্যাকাউন্টে লগইন করুন।</span>
                <a
                  href="https://bdcourier.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 600 }}
                >
                  bdcourier.com <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Status Message Info */}
            {bdConfig.connection_message && (
              <div style={{ fontSize: '12px', color: bdConfig.connection_status === 'connected' ? '#059669' : '#b91c1c', marginBottom: '16px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>স্ট্যাটাস মেসেজ:</strong> {bdConfig.connection_message}
                {bdConfig.last_checked_at && (
                  <span style={{ marginLeft: '10px', color: '#64748b' }}>
                    (শেষ যাচাই: {new Date(bdConfig.last_checked_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="adm-btn"
                style={{ background: '#ffffff', borderColor: '#fed7aa', color: '#c2410c', fontWeight: 600 }}
                onClick={handleTestConnection}
                disabled={bdTesting || (!bdConfig.has_key && !bdApiKey)}
              >
                <RotateCw size={14} className={bdTesting ? 'easy-spinning' : ''} />
                <span>{bdTesting ? 'কানেকশন টেস্ট হচ্ছে...' : 'Check Connection (টেস্ট করুন)'}</span>
              </button>

              <button
                type="button"
                className="adm-btn adm-btn-primary"
                style={{ background: '#ea580c', borderColor: '#ea580c' }}
                onClick={handleSaveBdCourier}
                disabled={bdSaving}
              >
                <Save size={14} />
                <span>{bdSaving ? 'সংরক্ষণ হচ্ছে...' : 'Save Settings (বিডি কুরিয়ার সেভ করুন)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION: Standard Courier Partner & Delivery Fee                  */}
        {/* ================================================================= */}
        <form onSubmit={handleSaveStandard} className="easy-form-stack">
          {/* Courier Provider Selection */}
          <div className="easy-subcard">
            <div className="easy-section-head">
              <Truck size={18} className="text-orange" />
              <h3>পার্সেল বুকিং পার্টনার (Courier Partner)</h3>
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
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'ডেলিভারি সেটিংস সেভ করুন (Save Delivery Settings)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

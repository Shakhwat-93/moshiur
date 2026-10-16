import React, { useState, useEffect } from 'react';
import {
  Truck,
  Save,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Key,
  DollarSign,
  Activity,
  RotateCw,
  ExternalLink,
  Lock,
  AlertTriangle,
  Clock,
  Smartphone,
  Globe,
  Ban,
  Eye,
  Check,
  Undo2
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

  // Duplicate Order Protection State
  const [dupConfig, setDupConfig] = useState({
    is_enabled: true,
    block_same_phone: true,
    block_same_ip: true,
    duration_minutes: 10,
    updated_at: null,
    updated_by: 'admin'
  });
  const [initialDupConfig, setInitialDupConfig] = useState(null);
  const [dupLogs, setDupLogs] = useState([]);
  const [totalBlockedCount, setTotalBlockedCount] = useState(0);
  const [dupLoading, setDupLoading] = useState(true);
  const [dupSaving, setDupSaving] = useState(false);
  const [showLogsTable, setShowLogsTable] = useState(true);

  // Fetch Duplicate Protection server-side configuration
  const fetchDupConfig = async () => {
    try {
      setDupLoading(true);
      const res = await fetch('/api/admin-duplicate-config');
      const data = await res.json();
      if (data?.config) {
        setDupConfig(data.config);
        setInitialDupConfig(data.config);
        setTotalBlockedCount(data.totalBlocked || 0);
        setDupLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching duplicate protection settings:', err);
    } finally {
      setDupLoading(false);
    }
  };

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
    fetchDupConfig();
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

  // Save Duplicate Protection Configuration
  const handleSaveDuplicateConfig = async () => {
    const mins = parseInt(dupConfig.duration_minutes, 10);
    if (isNaN(mins) || mins < 1 || mins > 1440) {
      showToast('ব্লক করার সময়সীমা ১ থেকে ১৪৪০ মিনিটের (২৪ ঘণ্টা) মধ্যে হতে হবে', 'error');
      return;
    }

    setDupSaving(true);
    try {
      const res = await fetch('/api/admin-duplicate-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dupConfig)
      });
      const data = await res.json();
      if (data?.success && data?.config) {
        setDupConfig(data.config);
        setInitialDupConfig(data.config);
        showToast('ডুপ্লিকেট অর্ডার প্রতিরোধ সেটিংস সফলভাবে সেভ হয়েছে!');
        await fetchDupConfig();
      } else {
        throw new Error(data?.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      showToast('সেটিংস সেভ করতে সমস্যা হয়েছে: ' + err.message, 'error');
    } finally {
      setDupSaving(false);
    }
  };

  const handleResetDuplicateConfig = () => {
    if (initialDupConfig) {
      setDupConfig(initialDupConfig);
      showToast('পূর্বের সেভ করা সেটিংস রিস্টোর করা হয়েছে');
    }
  };

  const getHumanDuration = (mins) => {
    const m = parseInt(mins, 10) || 0;
    if (m <= 0) return '০ মিনিট';
    if (m < 60) return `${m} মিনিট`;
    const hours = Math.floor(m / 60);
    const remMins = m % 60;
    if (remMins === 0) return `${hours} ঘণ্টা`;
    return `${hours} ঘণ্টা ${remMins} মিনিট`;
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
        <h2 className="easy-page-title">Fraud Protection & Courier Setup</h2>
        <p className="easy-page-desc">
          ডুপ্লিকেট ও ফেক অর্ডার প্রতিরোধ সিস্টেম (Anti-Duplicate Protection), কুরিয়ার সার্ভিস ইন্টিগ্রেশন এবং কাস্টমার ডেলিভারি রেশিও ভেরিফিকেশন নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <div className="easy-form-stack">
        {/* ================================================================= */}
        {/* SECTION: Fraud Protection → Duplicate Order Protection             */}
        {/* ================================================================= */}
        <div className="easy-subcard" style={{ border: '2px solid #fed7aa', background: '#fffcf9' }}>
          <div className="easy-section-head" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 700, color: '#9a3412' }}>
                  Fraud Protection → Duplicate Order Protection (ডুপ্লিকেট ও ফেক অর্ডার প্রতিরোধ)
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#7c2d12' }}>
                  একই ফোন নম্বর বা IP অ্যাড্রেস থেকে পুনরাবৃত্তি অর্ডার স্বয়ংক্রিয়ভাবে ব্লক করে ফেক অর্ডার ও অপচয় বন্ধ করুন।
                </p>
              </div>
            </div>

            {/* Active Status Badge */}
            <div>
              {dupConfig.is_enabled ? (
                <span className="adm-badge adm-badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={13} /> প্রটেকশন সক্রিয় ({getHumanDuration(dupConfig.duration_minutes)})
                </span>
              ) : (
                <span className="adm-badge adm-badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Ban size={13} /> নিষ্ক্রিয় (Disabled)
                </span>
              )}
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fed7aa' }}>
            {/* Main Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', background: '#ffffff', padding: '14px 16px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>
                  ডুপ্লিকেট অর্ডার ব্লকার সক্রিয় রাখুন (Enable Duplicate Order Protection)
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  সক্রিয় থাকলে নির্ধারিত সময়সীমার মধ্যে একই ফোন অথবা একই IP থেকে নতুন অর্ডার সাবমিট বন্ধ থাকবে।
                </div>
              </div>
              <label className="easy-switch">
                <input
                  type="checkbox"
                  checked={dupConfig.is_enabled}
                  onChange={(e) => setDupConfig({ ...dupConfig, is_enabled: e.target.checked })}
                />
                <span className="easy-slider round"></span>
              </label>
            </div>

            {/* Dual Toggles Grid: Phone & IP (OR Logic) */}
            <div className="adm-grid-2" style={{ marginBottom: '18px' }}>
              {/* Phone Protection Toggle */}
              <div style={{ background: '#ffffff', border: dupConfig.block_same_phone ? '1.5px solid #ea580c' : '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1e293b' }}>
                    <Smartphone size={17} color={dupConfig.block_same_phone ? '#ea580c' : '#64748b'} />
                    <span>একই ফোন নম্বর থেকে রিপিট অর্ডার ব্লক</span>
                  </div>
                  <label className="easy-switch">
                    <input
                      type="checkbox"
                      checked={dupConfig.block_same_phone}
                      onChange={(e) => setDupConfig({ ...dupConfig, block_same_phone: e.target.checked })}
                    />
                    <span className="easy-slider round"></span>
                  </label>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: '1.45' }}>
                  কাস্টমারের ফোন নম্বরের সব ভ্যারিয়েন্ট (01..., +8801..., বাংলা সংখ্যা) স্বাভাবিক করে ডাটাবেসের পূর্ববর্তী অর্ডারের সাথে মিলিয়ে দেখা হবে।
                </div>
              </div>

              {/* IP Protection Toggle */}
              <div style={{ background: '#ffffff', border: dupConfig.block_same_ip ? '1.5px solid #ea580c' : '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1e293b' }}>
                    <Globe size={17} color={dupConfig.block_same_ip ? '#ea580c' : '#64748b'} />
                    <span>একই IP অ্যাড্রেস থেকে রিপিট অর্ডার ব্লক</span>
                  </div>
                  <label className="easy-switch">
                    <input
                      type="checkbox"
                      checked={dupConfig.block_same_ip}
                      onChange={(e) => setDupConfig({ ...dupConfig, block_same_ip: e.target.checked })}
                    />
                    <span className="easy-slider round"></span>
                  </label>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', lineHeight: '1.45' }}>
                  একই ইন্টারনেট সংযোগ বা ডিভাইস থেকে ভিন্ন নাম/নম্বর ব্যবহার করে করা ফেক অর্ডার শনাক্ত ও ব্লক করবে।
                </div>
              </div>
            </div>

            {/* OR Logic Explanation Notice */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', fontSize: '12.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#2563eb" />
              <span>
                <strong>OR Logic সক্রিয়:</strong> Within the configured time window, a new order will be blocked if its protected phone number or IP address matches an eligible recent order.
              </span>
            </div>

            {/* Configurable Duration Section */}
            <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <label style={{ display: 'block', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                ডুপ্লিকেট অর্ডার ব্লক করার সময়সীমা (Duplicate Order Block Duration)
              </label>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px' }}>
                উইন্ডো প্রিভিউ: কাস্টমার একবার অর্ডার করার পর পরবর্তী <strong>{getHumanDuration(dupConfig.duration_minutes)}</strong> পর্যন্ত আর কোনো রিপিট অর্ডার সাবমিট করতে পারবেন না।
              </div>

              {/* Number Input + Unit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '300px', marginBottom: '12px' }}>
                <input
                  type="number"
                  className="easy-input"
                  min="1"
                  max="1440"
                  value={dupConfig.duration_minutes}
                  onChange={(e) => setDupConfig({ ...dupConfig, duration_minutes: e.target.value })}
                  style={{ fontWeight: 700, fontSize: '15px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                  মিনিট (Minutes)
                </span>
              </div>

              {/* Quick Select Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: '৫ মিনিট', val: 5 },
                  { label: '১০ মিনিট (ডিফল্ট)', val: 10 },
                  { label: '৩০ মিনিট', val: 30 },
                  { label: '১ ঘণ্টা (৬০ মি.)', val: 60 },
                  { label: '২৪ ঘণ্টা (১ দিন)', val: 1440 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDupConfig({ ...dupConfig, duration_minutes: item.val })}
                    className="adm-btn adm-btn-sm"
                    style={{
                      background: Number(dupConfig.duration_minutes) === item.val ? '#ea580c' : '#f8fafc',
                      color: Number(dupConfig.duration_minutes) === item.val ? '#ffffff' : '#374151',
                      borderColor: Number(dupConfig.duration_minutes) === item.val ? '#ea580c' : '#e2e8f0',
                      fontWeight: 600
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons & Audit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="adm-btn adm-btn-primary"
                  style={{ background: '#ea580c', borderColor: '#ea580c' }}
                  onClick={handleSaveDuplicateConfig}
                  disabled={dupSaving}
                >
                  <Save size={15} />
                  <span>{dupSaving ? 'সংরক্ষণ হচ্ছে...' : 'Save Settings (সেটিংস সংরক্ষণ করুন)'}</span>
                </button>

                <button
                  type="button"
                  className="adm-btn"
                  style={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#475569' }}
                  onClick={handleResetDuplicateConfig}
                >
                  <Undo2 size={15} />
                  <span>Cancel / Reset Changes</span>
                </button>
              </div>

              {dupConfig.updated_at && (
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  সর্বশেষ আপডেট: {new Date(dupConfig.updated_at).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })} • অ্যাডমিন: {dupConfig.updated_by}
                </div>
              )}
            </div>

            {/* Blocked Attempt Logs Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={17} color="#dc2626" />
                  <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                    সাম্প্রতিক ব্লক করা ডুপ্লিকেট অর্ডারের লগ (Blocked Attempt Logs)
                  </strong>
                  <span className="adm-badge adm-badge-danger" style={{ fontWeight: 700 }}>
                    মোট ব্লক: {totalBlockedCount} টি
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="adm-btn adm-btn-sm"
                    style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' }}
                    onClick={fetchDupConfig}
                    title="লগ রিফ্রেশ করুন"
                  >
                    <RotateCw size={13} className={dupLoading ? 'easy-spinning' : ''} />
                    <span>রিফ্রেশ</span>
                  </button>

                  <button
                    type="button"
                    className="adm-btn adm-btn-sm"
                    style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' }}
                    onClick={() => setShowLogsTable(!showLogsTable)}
                  >
                    {showLogsTable ? 'লগ আড়াল করুন' : 'লগ দেখুন'}
                  </button>
                </div>
              </div>

              {showLogsTable && (
                dupLogs.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    ✓ কোনো ব্লক করা ডুপ্লিকেট অর্ডার রেকর্ড নেই।
                  </div>
                ) : (
                  <div className="adm-table-wrap">
                    <table className="easy-table" style={{ minWidth: '700px' }}>
                      <thead>
                        <tr>
                          <th>সময় ও তারিখ</th>
                          <th>ফোন নম্বর</th>
                          <th>IP অ্যাড্রেস</th>
                          <th>ব্লক করার কারণ</th>
                          <th>পূর্ববর্তী অর্ডার</th>
                          <th>অবশিষ্ট কুলডাউন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dupLogs.map((log) => (
                          <tr key={log.id}>
                            <td style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap' }}>
                              {new Date(log.created_at).toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {log.phone_masked || log.phone}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                              {log.ip_masked || log.ip_address}
                            </td>
                            <td>
                              {log.blocked_reason === 'both' ? (
                                <span className="adm-badge adm-badge-danger">ফোন ও IP উভয়ই</span>
                              ) : log.blocked_reason === 'same_phone' ? (
                                <span className="adm-badge adm-badge-warning">ফোন নম্বর মিলেছে</span>
                              ) : (
                                <span className="adm-badge adm-badge-info">IP অ্যাড্রেস মিলেছে</span>
                              )}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0369a1' }}>
                              #{log.matching_order_id}
                            </td>
                            <td style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
                              {log.cooldown_remaining_seconds ? `প্রায় ${Math.ceil(log.cooldown_remaining_seconds / 60)} মিনিট` : 'উইন্ডো অ্যাক্টিভ'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

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

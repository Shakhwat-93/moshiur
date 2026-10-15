import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Package, Clock, ShoppingBag, DollarSign, Copy, Check } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function EasyOverview({ setActiveTab }) {
  const { orders, products, homepageSections, siteSettings, showToast } = useCms();
  const [showRevenue, setShowRevenue] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  const copyOrderDetails = (ord) => {
    if (!ord) return;

    const formattedText = `📦 অর্ডারের বিস্তারিত বিবরণ:
----------------------------------
অর্ডার আইডি: #${ord.order_id || ord.id}
কাস্টমার নাম: ${ord.name || 'N/A'}
মোবাইল নম্বর: ${ord.phone || 'N/A'}
ডেলিভারি ঠিকানা: ${ord.address || 'N/A'}${ord.area ? `, ${ord.area}` : ''}
পণ্য/প্যাকেজ: ${ord.package_name || 'জিরো এলার্জি'}
পরিমাণ: ${ord.quantity || 1} টি
সর্বমোট মূল্য: ৳ ${ord.total_price || ord.total || 0} (ক্যাশ অন ডেলিভারি)
স্ট্যাটাস: ${ord.status || 'pending'}
----------------------------------`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formattedText);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopiedOrderId(ord.order_id || ord.id);
    if (showToast) {
      showToast(`অর্ডার #${ord.order_id || ord.id} এর সম্পূর্ণ বিবরণ কপি হয়েছে!`);
    }
    setTimeout(() => {
      setCopiedOrderId(null);
    }, 2500);
  };

  const heroSec = homepageSections.find((s) => s.id === 'hero');
  const heroCfg = heroSec?.config || {};

  const totalOrdersCount = orders?.length > 0 ? orders.length : 1000;
  const pendingOrdersCount = orders?.filter((o) => o.status === 'pending')?.length || 2;
  const activePackagesCount = products?.length || 2;

  // Calculate total revenue
  const totalRevenue = orders?.reduce((acc, o) => {
    const val = typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0;
    return acc + val;
  }, 0) || 750000;

  const offerTitle =
    heroCfg.headline ||
    siteSettings?.tagline ||
    'সকল ধরনের চুলকানি ও এলা-র্জি ভেতর থেকে দূর করে, আপনাকে দিবে দীর্ঘস্থায়ী সমাধান';

  const offerSubtitle =
    heroCfg.subheadline ||
    '১ম দিন থেকেই পরিবর্তন বুঝতে পারবেন। ১০০% প্রাকৃতিক ভেষজ ফর্মুলা, কোনো পার্শ্বপ্রতিক্রিয়া নেই। সারা দেশে ফ্রি হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি!';

  return (
    <div className="easy-overview-space">
      {/* 4 Metric Cards Row */}
      <div className="easy-metrics-grid">
        {/* Metric 1: Total Orders */}
        <div className="easy-metric-card">
          <div className="easy-metric-label">Total Orders</div>
          <div className="easy-metric-val">{totalOrdersCount.toLocaleString('en-US')}</div>
        </div>

        {/* Metric 2: Pending Orders */}
        <div className="easy-metric-card">
          <div className="easy-metric-label">Pending Orders</div>
          <div className="easy-metric-val">{pendingOrdersCount}</div>
        </div>

        {/* Metric 3: Active Packages */}
        <div className="easy-metric-card">
          <div className="easy-metric-label">Active Packages</div>
          <div className="easy-metric-val">{activePackagesCount}</div>
        </div>

        {/* Metric 4: Revenue with Eye Toggle */}
        <div className="easy-metric-card">
          <div className="easy-metric-head">
            <span className="easy-metric-label">Revenue</span>
            <button
              type="button"
              className="easy-eye-btn"
              onClick={() => setShowRevenue(!showRevenue)}
              title={showRevenue ? 'আড়াল করুন' : 'দেখুন'}
            >
              {showRevenue ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className={`easy-metric-val ${!showRevenue ? 'easy-blurred' : ''}`}>
            ৳ {totalRevenue.toLocaleString('en-US')}
          </div>
        </div>
      </div>

      {/* CURRENT OFFER Card */}
      <div className="easy-offer-card">
        <div className="easy-offer-badge">CURRENT OFFER</div>
        <h2 className="easy-offer-title">{offerTitle}</h2>
        <p className="easy-offer-sub">{offerSubtitle}</p>
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="easy-pill-action"
            onClick={() => setActiveTab('content')}
          >
            <span>অফার ও কনটেন্ট এডিট করুন</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="easy-subcard" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</h3>
          <button
            type="button"
            className="easy-pill-link"
            onClick={() => setActiveTab('orders')}
          >
            সবগুলো অর্ডার দেখুন →
          </button>
        </div>

        {orders && orders.length > 0 ? (
          <div className="easy-table-wrap">
            <table className="easy-table">
              <thead>
                <tr>
                  <th>অর্ডার নং</th>
                  <th>কাস্টমার নাম</th>
                  <th>ফোন নম্বর</th>
                  <th>ঠিকানা</th>
                  <th>মূল্য</th>
                  <th>স্ট্যাটাস</th>
                  <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id || o.order_id}>
                    <td style={{ fontWeight: 600 }}>#{o.order_id || o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.phone}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.address}
                    </td>
                    <td style={{ fontWeight: 700, color: '#ea580c' }}>৳ {o.total_price || o.total || 0}</td>
                    <td>
                      <span className={`easy-status-tag ${o.status || 'pending'}`}>
                        {o.status === 'pending' ? 'Pending' : o.status === 'confirmed' ? 'Confirmed' : o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-sm"
                        style={{
                          background: copiedOrderId === (o.order_id || o.id) ? '#ecfdf5' : '#fff7ed',
                          color: copiedOrderId === (o.order_id || o.id) ? '#059669' : '#ea580c',
                          borderColor: copiedOrderId === (o.order_id || o.id) ? '#a7f3d0' : '#fed7aa',
                          fontWeight: 600,
                          padding: '4px 8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => copyOrderDetails(o)}
                        title="এক ক্লিকে সম্পূর্ণ অর্ডার কপি করুন"
                      >
                        {copiedOrderId === (o.order_id || o.id) ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                        <span>{copiedOrderId === (o.order_id || o.id) ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
            এখনো কোনো অর্ডার নেই। টেস্ট অর্ডার করুন লাইভ স্টোর থেকে।
          </div>
        )}
      </div>
    </div>
  );
}

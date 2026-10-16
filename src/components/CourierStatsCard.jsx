import React from 'react';
import { Truck, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function CourierStatsCard({
  data,
  loading = false,
  status = 'completed',
  error = null,
  isCached = false,
  retrievedAt = null,
  compact = false
}) {
  if (loading) {
    return (
      <div className="courier-card-shell courier-skeleton">
        <div className="courier-skeleton-line short"></div>
        <div className="courier-skeleton-grid">
          <div className="courier-skeleton-box"></div>
          <div className="courier-skeleton-box"></div>
          <div className="courier-skeleton-box"></div>
        </div>
      </div>
    );
  }

  if (status === 'disabled') {
    return null; // Omit cleanly when feature is not enabled
  }

  if (status === 'failed' || error) {
    return (
      <div className="courier-card-shell courier-error-state">
        <div className="courier-header">
          <div className="courier-title-wrap">
            <Truck size={18} className="courier-icon" />
            <span className="courier-title">কুরিয়ার ডেলিভারি রেকর্ড</span>
          </div>
          <span className="courier-badge-dim">অপ্রাপ্য</span>
        </div>
        <p className="courier-dim-text">
          {error || 'বর্তমানে কুরিয়ার তথ্য লোড করা সম্ভব হয়নি।'}
        </p>
      </div>
    );
  }

  const summary = data?.summary || {
    total_parcel: 0,
    success_parcel: 0,
    cancelled_parcel: 0,
    success_ratio: 0
  };

  const total = Number(summary.total_parcel || 0);
  const success = Number(summary.success_parcel || 0);
  const cancelled = Number(summary.cancelled_parcel || 0);
  const ratio = Number(summary.success_ratio || 0);

  const couriers = data?.couriers || {};
  const courierKeys = Object.keys(couriers).filter((k) => couriers[k]?.total_parcel > 0);

  // Status color logic
  const isHighSuccess = ratio >= 80;
  const isMediumSuccess = ratio >= 60 && ratio < 80;
  const isNewCustomer = total === 0;

  const ratioColor = isNewCustomer ? '#64748b' : isHighSuccess ? '#059669' : isMediumSuccess ? '#d97706' : '#e11d48';
  const ratioBg = isNewCustomer ? '#f1f5f9' : isHighSuccess ? '#ecfdf5' : isMediumSuccess ? '#fffbeb' : '#fff1f2';

  return (
    <div className={`courier-card-shell ${compact ? 'compact' : ''}`}>
      {/* Top Header */}
      <div className="courier-header">
        <div className="courier-title-wrap">
          <div className="courier-icon-box">
            <Truck size={17} color="#0a8d49" />
          </div>
          <div>
            <h4 className="courier-title">কুরিয়ার ভেরিফিকেশন ও ডেলিভারি হিস্ট্রি</h4>
            <div className="courier-subtitle">
              BD Courier নেটওয়ার্ক থেকে যাচাইকৃত কাস্টমার রিপোর্ট
            </div>
          </div>
        </div>

        {/* Ratio Badge */}
        {!isNewCustomer ? (
          <div
            className="courier-ratio-badge"
            style={{ color: ratioColor, backgroundColor: ratioBg, borderColor: ratioColor }}
          >
            <ShieldCheck size={14} />
            <span>{ratio}% সফল ডেলিভারি</span>
          </div>
        ) : (
          <div className="courier-ratio-badge new-customer">
            <span>নতুন গ্রাহক (০ পার্সেল)</span>
          </div>
        )}
      </div>

      {/* Progress Bar (if parcels exist) */}
      {!isNewCustomer && (
        <div className="courier-progress-wrap">
          <div className="courier-progress-bar">
            <div
              className="courier-progress-fill"
              style={{
                width: `${Math.min(100, Math.max(5, ratio))}%`,
                backgroundColor: ratioColor
              }}
            />
          </div>
          <div className="courier-progress-labels">
            <span>সফল: {success} টি</span>
            <span>রিটার্ন/বাতিল: {cancelled} টি</span>
          </div>
        </div>
      )}

      {/* 3 Metrics Grid */}
      <div className="courier-metrics-grid">
        <div className="courier-metric-item">
          <div className="courier-metric-val">{total}</div>
          <div className="courier-metric-lbl">মোট পার্সেল</div>
        </div>
        <div className="courier-metric-item success">
          <div className="courier-metric-val">{success}</div>
          <div className="courier-metric-lbl">সফল ডেলিভারি</div>
        </div>
        <div className="courier-metric-item cancel">
          <div className="courier-metric-val">{cancelled}</div>
          <div className="courier-metric-lbl">রিটার্ন / বাতিল</div>
        </div>
      </div>

      {/* Couriers Breakdown (Pathao, Steadfast, RedX, etc.) */}
      {courierKeys.length > 0 && (
        <div className="courier-breakdown-section">
          <div className="courier-breakdown-title">কুরিয়ারভিত্তিক বিবরণ:</div>
          <div className="courier-grid-list">
            {courierKeys.map((k) => {
              const c = couriers[k];
              const cTotal = c.total_parcel || 0;
              const cSuccess = c.success_parcel || 0;
              const cCancel = c.cancelled_parcel || 0;
              const cRatio = c.success_ratio || (cTotal > 0 ? Math.round((cSuccess / cTotal) * 100) : 0);

              return (
                <div key={k} className="courier-brand-card">
                  <div className="courier-brand-head">
                    <span className="courier-brand-name">{c.name || k.toUpperCase()}</span>
                    <span className="courier-brand-ratio">{cRatio}%</span>
                  </div>
                  <div className="courier-brand-details">
                    <span className="c-text-succ">✓ {cSuccess} ডেলিভার্ড</span>
                    <span className="c-text-sep">•</span>
                    <span className="c-text-canc">✕ {cCancel} রিটার্ন</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Customer Friendly Note */}
      {isNewCustomer && (
        <div className="courier-empty-note">
          <CheckCircle2 size={16} color="#059669" />
          <span>এই নম্বরে পূর্বে কোনো পার্সেল হিস্ট্রি পাওয়া যায়নি (নতুন কাস্টমার)।</span>
        </div>
      )}

      {/* Footer / Cache Note */}
      <div className="courier-footer-row">
        <span className="courier-cache-tag">
          <Clock size={12} />
          {isCached ? 'সুপাবেজ পার্মানেন্ট ক্যাশ থেকে সংগৃহীত (Instant)' : 'BD Courier API থেকে সংগৃহীত'}
        </span>
        {retrievedAt && (
          <span className="courier-date-tag">
            {new Date(retrievedAt).toLocaleDateString('bn-BD', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        )}
      </div>
    </div>
  );
}

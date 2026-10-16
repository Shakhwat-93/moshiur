import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Phone, Check, Package, ArrowLeft, Copy } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import CourierStatsCard from '../components/CourierStatsCard';

export default function OrderSuccessPage({ order, onReturnHome }) {
  const { siteSettings } = useCms();
  const [copied, setCopied] = useState(false);
  const [courierState, setCourierState] = useState({
    loading: true,
    data: null,
    status: 'pending',
    error: null,
    isCached: false,
    retrievedAt: null
  });

  useEffect(() => {
    let isMounted = true;
    async function checkCourier() {
      if (!order?.phone) {
        setCourierState({ loading: false, status: 'disabled' });
        return;
      }

      try {
        const res = await fetch('/api/courier-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: order.phone,
            orderId: order.order_id
          })
        });

        const json = await res.json();
        if (isMounted) {
          if (json.status === 'completed' && json.data) {
            setCourierState({
              loading: false,
              data: json.data,
              status: 'completed',
              isCached: json.source === 'cache',
              retrievedAt: json.data?.retrieved_at,
              error: null
            });
          } else if (json.status === 'disabled') {
            setCourierState({ loading: false, status: 'disabled' });
          } else {
            setCourierState({
              loading: false,
              status: json.status || 'failed',
              error: json.error || null,
              isCached: json.source === 'cache'
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setCourierState({
            loading: false,
            status: 'failed',
            error: 'কুরিয়ার তথ্য লোড করতে সমস্যা হয়েছে'
          });
        }
      }
    }

    checkCourier();
    return () => {
      isMounted = false;
    };
  }, [order?.phone, order?.order_id]);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Format date like: "October 16, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Clean numeric order ID for display (e.g. #18060 or numeric tail)
  const displayOrderId = order?.order_id
    ? order.order_id.replace(/^ORD-?/, '').slice(-5) || order.order_id
    : '18060';

  const customerName = order?.name || 'কাস্টমার';
  const customerPhone = order?.phone || siteSettings?.phone_1 || '01XXXXXXXXX';
  const customerAddress = order?.address
    ? `${order.address}${order.area ? `, ${order.area}` : ''}`
    : 'ঢাকা, বাংলাদেশ';
  const totalPrice = order?.total_price || order?.total || '750.00';
  const formattedPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : parseFloat(totalPrice).toFixed(2);

  const handleCopyOrder = () => {
    const name = (order?.name || customerName || '').trim();
    const address = (order?.address || customerAddress || '').trim();
    const phone = (order?.phone || customerPhone || '').trim();
    const qty = order?.quantity || 1;
    const price = Math.round(Number(order?.total_price || order?.total || totalPrice || 0));

    const formattedText = `${name}\n${address}\n${phone}\n${qty} packet = ${price} taka`;

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

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="success-page-shell">
      <div className="success-card-wrapper">
        <div className="success-receipt-card">
          {/* Top Warm Peach Section with Checkmark */}
          <div className="success-top-banner">
            <div className="success-check-badge">
              <Check size={32} strokeWidth={3.5} color="#ffffff" />
            </div>

            <h1 className="success-title">আপনার অর্ডারটি সফল হয়েছে!</h1>
            <p className="success-subtitle">
              ধন্যবাদ সাথে থাকার জন্য। আপনার পার্সেলটি প্রস্তুত করা হচ্ছে।
            </p>
          </div>

          {/* Ticket Perforated Cut Line */}
          <div className="success-cut-line"></div>

          {/* White Invoice Section */}
          <div className="success-body">
            <div className="success-sec-heading">
              <span className="success-box-emoji">📦</span>
              <span>অর্ডারের বিবরণ ও ইনভয়েস</span>
            </div>

            <div className="success-divider"></div>

            {/* Receipt Table Rows */}
            <div className="success-rows-list">
              <div className="success-row">
                <span className="success-lbl">অর্ডার নম্বর</span>
                <span className="success-val">#{displayOrderId}</span>
              </div>

              <div className="success-row">
                <span className="success-lbl">তারিখ</span>
                <span className="success-val">{formattedDate}</span>
              </div>

              <div className="success-row">
                <span className="success-lbl">কাস্টমার নাম</span>
                <span className="success-val">{customerName}</span>
              </div>

              <div className="success-row">
                <span className="success-lbl">মোবাইল নম্বর</span>
                <span className="success-val">{customerPhone}</span>
              </div>

              <div className="success-row">
                <span className="success-lbl">ডেলিভারি ঠিকানা</span>
                <span className="success-val" style={{ maxWidth: '65%', textAlign: 'right' }}>
                  {customerAddress}
                </span>
              </div>

              <div className="success-row">
                <span className="success-lbl">পেমেন্ট মেথড</span>
                <span className="success-val">Cash on delivery</span>
              </div>
            </div>

            {/* Total Highlight Row */}
            <div className="success-total-row">
              <span className="success-total-lbl">সর্বমোট মূল্য</span>
              <span className="success-total-val">৳ {formattedPrice}</span>
            </div>

            {/* Courier Verification & Delivery Statistics */}
            {courierState.status !== 'disabled' && (
              <div style={{ marginTop: '16px' }}>
                <CourierStatsCard {...courierState} />
              </div>
            )}

            {/* Important Notice Box */}
            <div className="success-notice-box">
              <div className="success-notice-icon">
                <Phone size={22} className="success-phone-icon" />
              </div>
              <div className="success-notice-text">
                <strong>জরুরি বিজ্ঞপ্তি:</strong> পার্সেল পাঠানোর পূর্বে আমাদের কাস্টমার প্রতিনিধি আপনার নম্বরে{' '}
                <strong>কল করে কনফার্ম করবেন।</strong>
              </div>
            </div>

            {/* One-click Copy Order Button */}
            <button
              type="button"
              className="success-copy-btn"
              onClick={handleCopyOrder}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '✓ সম্পূর্ণ বিবরণ কপি হয়েছে!' : '📋 এক ক্লিকে অর্ডার কপি করুন'}</span>
            </button>

            {/* Return to Home CTA Button */}
            <button
              type="button"
              className="success-home-btn"
              onClick={onReturnHome}
            >
              হোম পেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

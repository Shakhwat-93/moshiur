import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SuccessModal({ order, onClose }) {
  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="modal-overlay show" id="orderSuccessModal" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">✓</div>
        <h3>অর্ডার সফল হয়েছে!</h3>
        <p>
          ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে ফোনে যোগাযোগ করে ডেলিভারি নিশ্চিত করবেন।
        </p>

        <div
          id="modalOrderSummary"
          style={{
            background: '#f8fafc',
            padding: '14px',
            borderRadius: '12px',
            textAlign: 'left',
            fontSize: '14px',
            marginBottom: '20px',
            lineHeight: 1.65,
            border: '1px solid #e2e8f0'
          }}
        >
          <div style={{ fontWeight: 600, color: '#0a8d49', marginBottom: '6px' }}>
            অর্ডার আইডি: {order.order_id}
          </div>
          <div><strong>প্যাকেজ:</strong> {order.package_name}</div>
          <div><strong>পরিমাণ:</strong> {order.quantity} টি</div>
          <div><strong>মোট মূল্য:</strong> ৳ {order.total_price} (ক্যাশ অন ডেলিভারি)</div>
          <div><strong>গ্রাহক:</strong> {order.name} ({order.phone})</div>
          <div><strong>ঠিকানা:</strong> {order.address}, {order.area}</div>
        </div>

        <button className="modal-btn" id="closeModalBtn" onClick={onClose}>
          ঠিক আছে
        </button>
      </div>
    </div>
  );
}

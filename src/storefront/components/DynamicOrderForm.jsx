import React, { useState, useEffect, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { supabase } from '../../lib/supabase';
import { trackInitiateCheckout, trackPurchase } from '../../lib/tracking';

export default function DynamicOrderForm({ selectedProductId, onSelectProduct, onOrderSuccess }) {
  const { products, siteSettings, homepageSections } = useCms();
  const sec = homepageSections.find((s) => s.id === 'order_form');

  if (sec && sec.is_enabled === false) return null;

  const activeProducts = products.filter((p) => p.status === 'active');

  const [currentId, setCurrentId] = useState(selectedProductId || activeProducts[0]?.id || 1);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'inside_dhaka'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateBlockedError, setDuplicateBlockedError] = useState(null);
  const [timerText, setTimerText] = useState('01:59:45');

  // Sync external selection if prop changes
  useEffect(() => {
    if (selectedProductId) {
      setCurrentId(selectedProductId);
    }
  }, [selectedProductId]);

  // Set default product if none selected yet
  useEffect(() => {
    if (!currentId && activeProducts.length > 0) {
      setCurrentId(activeProducts[0].id);
    }
  }, [activeProducts, currentId]);

  // Countdown timer logic
  useEffect(() => {
    if (!siteSettings?.timer_enabled) return;
    let timeLeft = (siteSettings.timer_duration_hours || 2) * 3600 - 15;
    const interval = setInterval(() => {
      if (timeLeft <= 0) timeLeft = 2 * 3600;
      timeLeft--;
      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      setTimerText(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [siteSettings]);

  const selectedProduct =
    activeProducts.find((p) => p.id === currentId) || activeProducts[0] || {
      id: 1,
      title: 'জিরো এলার্জি - ১ বোতল',
      price: 750,
      compare_at_price: 1150,
      images: ['/images/IMG_7091.webp']
    };

  const subtotal = selectedProduct.price * quantity;
  const deliveryCharge = 0;
  const grandTotal = subtotal + deliveryCharge;

  const handleSelectProduct = (id) => {
    setCurrentId(id);
    if (onSelectProduct) onSelectProduct(id);
  };

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const hasTrackedCheckoutRef = useRef(false);

  // Helper to convert Bengali numerals to English
  const convertBengaliToEnglishNumerals = (str) => {
    if (!str) return '';
    const bnNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.replace(/[০-৯]/g, (match) => bnNumerals.indexOf(match));
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const converted = convertBengaliToEnglishNumerals(raw);
    const digitsOnly = converted.replace(/\D/g, '');
    const sanitized = digitsOnly.slice(0, 11);

    setFormData((prev) => ({ ...prev, phone: sanitized }));

    // Track InitiateCheckout on first interaction
    if (!hasTrackedCheckoutRef.current && selectedProduct) {
      hasTrackedCheckoutRef.current = true;
      trackInitiateCheckout({
        product: selectedProduct,
        quantity: quantity,
        total: grandTotal,
        siteSettings
      });
    }
  };

  const handlePhoneKeyDown = (e) => {
    // Allow control and navigation keys
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
      ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
    ) {
      return;
    }
    // Block non-digit characters immediately on keystroke
    if (!/[0-9০-৯]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Track InitiateCheckout on first interaction
    if (!hasTrackedCheckoutRef.current && selectedProduct) {
      hasTrackedCheckoutRef.current = true;
      trackInitiateCheckout({
        product: selectedProduct,
        quantity: quantity,
        total: grandTotal,
        siteSettings
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      alert('অনুগ্রহ করে সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!formData.name.trim() || !formData.address.trim()) {
      alert('অনুগ্রহ করে আপনার নাম ও সম্পূর্ণ ঠিকানা প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);
    setDuplicateBlockedError(null);

    const orderData = {
      order_id: `ORD-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      area: formData.area === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে',
      package_name: selectedProduct.title,
      quantity: quantity,
      unit_price: selectedProduct.price,
      subtotal: subtotal,
      delivery_fee: 0,
      total_price: grandTotal,
      status: 'pending'
    };

    try {
      // 1. Submit through secure server-side order boundary with Duplicate Protection
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const resData = await response.json();

      if (!response.ok || resData.success === false) {
        if (resData.code === 'DUPLICATE_ORDER_BLOCKED') {
          setDuplicateBlockedError(resData.message);
          return;
        }
        throw new Error(resData.message || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।');
      }

      const finalOrder = resData.order || orderData;

      // 2. Trigger High-Accuracy Purchase Tracking ONLY on allowed successful orders
      trackPurchase({
        order: finalOrder,
        siteSettings
      });

      if (onOrderSuccess) {
        onOrderSuccess(finalOrder);
      }

      setFormData({
        name: '',
        phone: '',
        address: '',
        area: 'inside_dhaka'
      });
      setQuantity(1);
      setDuplicateBlockedError(null);
    } catch (err) {
      console.error('Order submission error:', err);
      alert(err.message || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। দয়া করে সরাসরি হেল্পলাইনে কল করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = sec?.title || 'অর্ডার করতে ফরমটি পূরণ করুন';
  const subtitle = sec?.subtitle || 'অগ্রিম কোনো টাকা ছাড়া পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।';
  const badge = sec?.config?.badge || 'অর্ডার করুন';

  return (
    <section className="vb2-order" id="order">
      <div className="vb2-order-wrap">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">{badge}</span>
          <h2 className="vb2-title">{title}</h2>
          <p className="vb2-lead">{subtitle}</p>
        </div>

        <div className="vb2-ocard">
          <div className="vb2-ohead">
            <h3>✓ সহজ ক্যাশ অন ডেলিভারি অর্ডার ফর্ম</h3>
            <p>নিচের তথ্যগুলো দিয়ে অর্ডার কনফার্ম করুন — আমাদের প্রতিনিধি ফোন করে ডেলিভারি নিশ্চিত করবেন</p>
          </div>
          <div className="vb2-obody">
            <form id="vb-order-form" onSubmit={handleSubmit}>
              {/* Step 1: Package Selection */}
              <p className="vb2-block-t">🛍️ ১. আপনার পছন্দের প্যাকেজটি সিলেক্ট করুন</p>

              {activeProducts.map((p, idx) => {
                const isSelected = p.id === selectedProduct.id;
                const savings = p.compare_at_price > p.price ? p.compare_at_price - p.price : 0;

                return (
                  <div
                    key={p.id}
                    className={`vb-product-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectProduct(p.id)}
                  >
                    {savings > 0 && <div className="product-ribbon">{savings}৳ ছাড়</div>}
                    <input
                      type="radio"
                      name="product"
                      className="vb-product-radio"
                      checked={isSelected}
                      onChange={() => handleSelectProduct(p.id)}
                    />
                    <div className="vb-product-img">
                      <img src={p.images?.[0] || '/images/IMG_7091.webp'} alt={p.title} />
                    </div>
                    <div className="vb-product-info">
                      <div className="vb-product-name">{p.title}</div>
                      <div className="vb-product-bottom">
                        <span className="vb-product-price">৳ {p.price}</span>
                        {p.compare_at_price > p.price && (
                          <span className="vb-product-old">৳ {p.compare_at_price}</span>
                        )}
                        {savings > 0 && (
                          <span className="vb-product-save">৳{savings} সাশ্রয়</span>
                        )}
                      </div>
                      <span className="vb-product-offer-label">
                        {p.badge_text || '🎁 অফার মূল্য + ফ্রি ডেলিভারি'}
                      </span>
                    </div>
                    <div className="vb-product-check">✓</div>
                  </div>
                );
              })}

              {/* Benefit Chips */}
              <div className="vb2-chips">
                <div className="c"><span className="e">🚚</span> {siteSettings?.free_shipping_text || 'সারা দেশে ফ্রি ডেলিভারি'}</div>
                <div className="c"><span className="e">🛡️</span> ক্যাশ অন ডেলিভারি</div>
                <div className="c"><span className="e">🎁</span> স্পেশাল অফার মূল্য</div>
              </div>

              {/* Countdown Timer */}
              {siteSettings?.timer_enabled && (
                <div className="vb2-cd">
                  <span className="l">আজকের অফার শেষ হতে বাকি</span>
                  <span className="t" id="vb2timer">{timerText}</span>
                </div>
              )}

              {/* Step 2: Customer Info */}
              <p className="vb2-block-t">📝 ২. আপনার ডেলিভারির ঠিকানা দিন</p>
              <div className="form-group">
                <label htmlFor="name">আপনার নাম লিখুন *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="যেমন: মোঃ কামরুল হাসান"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label htmlFor="phone" style={{ margin: 0 }}>মোবাইল নম্বর লিখুন *</label>
                  {formData.phone && (
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: formData.phone.length === 11 && /^01[3-9]/.test(formData.phone) ? '#059669' : '#e11d48'
                    }}>
                      {formData.phone.length === 11 && /^01[3-9]/.test(formData.phone)
                        ? '✓ সঠিক ১১ ডিজিট'
                        : `${formData.phone.length}/১১ ডিজিট`}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="যেমন: 017XXXXXXXX"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={11}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  autoComplete="tel"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">আপনার সম্পূর্ণ ঠিকানা (থানা ও জেলা সহ) *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  placeholder="যেমন: বাড়ি নং, রোড নং, গ্রাম/মহল্লা, থানা ও জেলা"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="area">আপনার এরিয়া সিলেক্ট করুন *</label>
                <select
                  id="area"
                  name="area"
                  className="form-control"
                  value={formData.area}
                  onChange={handleInputChange}
                >
                  <option value="inside_dhaka">ঢাকার ভিতরে (ফ্রি ডেলিভারি)</option>
                  <option value="outside_dhaka">ঢাকার বাইরে (ফ্রি ডেলিভারি)</option>
                </select>
              </div>

              {/* Step 3: Live Cart Summary */}
              <p className="vb2-block-t" style={{ marginTop: '18px' }}>📋 ৩. আপনার অর্ডারের হিসাব</p>
              <div className="cartlist">
                <table className="cart_table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>প্রোডাক্ট</th>
                      <th style={{ width: '28%' }}>পরিমাণ</th>
                      <th style={{ width: '22%' }}>মূল্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            height="32"
                            width="32"
                            src={selectedProduct.images?.[0] || '/images/IMG_7091.webp'}
                            alt="Thumb"
                            style={{ borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{selectedProduct.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="quantity">
                          <button
                            type="button"
                            className="minus cart_decrement"
                            onClick={() => handleQtyChange(-1)}
                          >
                            -
                          </button>
                          <input readOnly type="text" value={quantity} />
                          <button
                            type="button"
                            className="plus cart_increment"
                            onClick={() => handleQtyChange(1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <span>৳{subtotal}</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="2">সাবটোটাল</th>
                      <td>৳ <strong>{subtotal}</strong></td>
                    </tr>
                    <tr>
                      <th colSpan="2">ডেলিভারি চার্জ</th>
                      <td><span style={{ color: '#0a8d49', fontWeight: 600 }}>ফ্রি (৳০)</span></td>
                    </tr>
                    <tr>
                      <th colSpan="2">সর্বমোট</th>
                      <td>৳ <strong>{grandTotal}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Duplicate Order Block Alert */}
              {duplicateBlockedError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #ef4444',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: '#991b1b',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)'
                  }}
                >
                  <span style={{ fontSize: '20px', lineHeight: 1 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '2px', color: '#b91c1c' }}>
                      অর্ডার গ্রহণ করা সম্ভব হয়নি:
                    </div>
                    <div>{duplicateBlockedError}</div>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <button className="order_place" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'অর্ডার প্রক্রিয়াকরণ হচ্ছে...' : '✓ অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)'}
              </button>

              {/* Ethical COD Notice */}
              {siteSettings?.cod_notice && (
                <div className="vb2-cod-box">
                  <span>🛡️</span>
                  <div>{siteSettings.cod_notice}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

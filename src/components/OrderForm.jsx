import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PRODUCTS = {
  pack_1: {
    id: 'pack_1',
    name: 'জিরো এলার্জি - ১ বোতল (১ মাসের কোর্স)',
    shortName: 'জিরো এলার্জি - ১ বোতল',
    price: 750,
    oldPrice: 1150,
    save: '৪০০৳ সাশ্রয়',
    ribbon: '৪০০৳ ছাড়',
    image: '/images/IMG_7091.webp'
  },
  pack_2: {
    id: 'pack_2',
    name: 'জিরো এলার্জি - ২ বোতল (২ মাসের ফুল কোর্স)',
    shortName: 'জিরো এলার্জি - ২ বোতল',
    price: 1200,
    oldPrice: 1500,
    save: '৩০০৳ সাশ্রয়',
    ribbon: 'সেরা অফার',
    image: '/images/IMG_7091.webp'
  }
};

export default function OrderForm({ selectedPackage, onSelectPackage, onOrderSuccess }) {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'inside_dhaka'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerText, setTimerText] = useState('01:59:45');

  // Countdown timer logic
  useEffect(() => {
    let timeLeft = 2 * 3600 - 15;
    const interval = setInterval(() => {
      if (timeLeft <= 0) timeLeft = 2 * 3600;
      timeLeft--;
      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      setTimerText(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentProduct = PRODUCTS[selectedPackage] || PRODUCTS.pack_1;
  const subtotal = currentProduct.price * quantity;
  const deliveryCharge = 0;
  const grandTotal = subtotal + deliveryCharge;

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const orderData = {
      order_id: `ORD-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      area: formData.area === 'inside_dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে',
      package_name: currentProduct.name,
      quantity: quantity,
      unit_price: currentProduct.price,
      total_price: grandTotal,
      status: 'pending'
    };

    try {
      // 1. Direct Supabase insertion via client
      if (supabase) {
        const { error } = await supabase.from('orders').insert([orderData]);
        if (error) {
          console.warn('Supabase direct insert notice:', error.message);
        }
      }

      // 2. Also attempt local node endpoint if active
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
      } catch (err) {
        // Safe to ignore if running purely on client/Vite
      }

      // Success
      if (onOrderSuccess) {
        onOrderSuccess(orderData);
      }
      setFormData({
        name: '',
        phone: '',
        address: '',
        area: 'inside_dhaka'
      });
      setQuantity(1);
    } catch (err) {
      console.error('Order error:', err);
      alert('অর্ডার প্রক্রিয়া করতে কিছুটা সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি কল করুন: 01604-939479');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="vb2-order" id="order">
      <div className="vb2-order-wrap">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">অর্ডার করুন</span>
          <h2 className="vb2-title">
            অর্ডার করতে <em>ফরমটি পূরণ করুন</em>
          </h2>
          <p className="vb2-lead">
            অগ্রিম কোনো টাকা ছাড়া পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
          </p>
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

              {/* Package 1 */}
              <div
                className={`vb-product-row ${selectedPackage === 'pack_1' ? 'selected' : ''}`}
                onClick={() => onSelectPackage('pack_1')}
              >
                <div className="product-ribbon">৪০০৳ ছাড়</div>
                <input
                  type="radio"
                  name="product"
                  className="vb-product-radio"
                  checked={selectedPackage === 'pack_1'}
                  onChange={() => onSelectPackage('pack_1')}
                />
                <div className="vb-product-img">
                  <img src="/images/IMG_7091.webp" alt="জিরো এলার্জি ১ বোতল" />
                </div>
                <div className="vb-product-info">
                  <div className="vb-product-name">জিরো এলার্জি - ১ বোতল (১ মাসের কোর্স)</div>
                  <div className="vb-product-bottom">
                    <span className="vb-product-price">৳ ৭৫০</span>
                    <span className="vb-product-old">৳ ১,১৫০</span>
                    <span className="vb-product-save">৳৪০০ সাশ্রয়</span>
                  </div>
                  <span className="vb-product-offer-label">🎁 অফার মূল্য</span>
                </div>
                <div className="vb-product-check">✓</div>
              </div>

              {/* Package 2 */}
              <div
                className={`vb-product-row ${selectedPackage === 'pack_2' ? 'selected' : ''}`}
                onClick={() => onSelectPackage('pack_2')}
              >
                <div className="product-ribbon">সেরা অফার</div>
                <input
                  type="radio"
                  name="product"
                  className="vb-product-radio"
                  checked={selectedPackage === 'pack_2'}
                  onChange={() => onSelectPackage('pack_2')}
                />
                <div className="vb-product-img">
                  <img src="/images/IMG_7091.webp" alt="জিরো এলার্জি ২ বোতল" />
                </div>
                <div className="vb-product-info">
                  <div className="vb-product-name">জিরো এলার্জি - ২ বোতল (২ মাসের ফুল কোর্স)</div>
                  <div className="vb-product-bottom">
                    <span className="vb-product-price">৳ ১,২০০</span>
                    <span className="vb-product-old">৳ ১,৫০০</span>
                    <span className="vb-product-save">৳৩০০ সাশ্রয়</span>
                  </div>
                  <span className="vb-product-offer-label">🎁 ৩০০৳ অতিরিক্ত ছাড় + ফ্রি ডেলিভারি</span>
                </div>
                <div className="vb-product-check">✓</div>
              </div>

              {/* Benefit Chips */}
              <div className="vb2-chips">
                <div className="c"><span className="e">🚚</span> সারা দেশে ফ্রি ডেলিভারি</div>
                <div className="c"><span className="e">🛡️</span> ক্যাশ অন ডেলিভারি</div>
                <div className="c"><span className="e">🎁</span> স্পেশাল অফার মূল্য</div>
              </div>

              {/* Urgent Countdown Timer */}
              <div className="vb2-cd">
                <span className="l">আজকের অফার শেষ হতে বাকি</span>
                <span className="t" id="vb2timer">{timerText}</span>
              </div>

              {/* Step 2: Customer Delivery Information */}
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
                <label htmlFor="phone">মোবাইল নম্বর লিখুন *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="যেমন: 017XXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength="11"
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

              {/* Step 3: Live Cart Summary Table */}
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
                        <a href="#order" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                          <img
                            height="32"
                            width="32"
                            src={currentProduct.image}
                            alt="Thumb"
                            style={{ borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <span>{currentProduct.shortName}</span>
                        </a>
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

              {/* Confirm Order Button */}
              <button className="order_place" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : '✓ অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)'}
              </button>

              {/* Ethical COD Islamic Reminder */}
              <div className="vb2-cod-box">
                <span>🛡️</span>
                <div>
                  অর্ডার করার পূর্বে অনুগ্রহ করে ভেবে-চিন্তে নিশ্চিত হয়ে অর্ডার করুন। অযথা অর্ডার করে কুরিয়ার চার্জ অপচয় করা থেকে বিরত থাকুন। নবীজী (সা.) বলেছেন: <em>"যে ব্যক্তি অপরকে ধোঁকা দেয়, সে আমাদের দলভুক্ত নয়।"</em> — সহিহ মুসলিম, হাদিস নং ১৮৫
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

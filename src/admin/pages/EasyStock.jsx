import React, { useState, useEffect } from 'react';
import { Layers, Save, CheckCircle, AlertTriangle, PackageCheck, PackageX } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function EasyStock() {
  const { products, saveProduct, showToast } = useCms();
  const [saving, setSaving] = useState(false);
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setStockList(
        products.map((p) => ({
          id: p.id,
          title: p.title,
          sku: p.sku || `ZA-0${p.id}`,
          price: p.price,
          stock_qty: p.stock_qty ?? 150,
          status: p.status || 'active',
          images: p.images || ['/images/IMG_7091.webp']
        }))
      );
    }
  }, [products]);

  const handleStockChange = (idx, value) => {
    const updated = [...stockList];
    updated[idx].stock_qty = parseInt(value, 10) || 0;
    setStockList(updated);
  };

  const handleStatusToggle = (idx) => {
    const updated = [...stockList];
    updated[idx].status = updated[idx].status === 'active' ? 'draft' : 'active';
    setStockList(updated);
  };

  const handleSaveStock = async () => {
    setSaving(true);
    try {
      for (const item of stockList) {
        const orig = products.find((p) => p.id === item.id);
        if (orig) {
          await saveProduct({
            ...orig,
            stock_qty: item.stock_qty,
            status: item.status
          });
        }
      }
      showToast('স্টক সফলভাবে আপডেট করা হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('স্টক আপডেট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="easy-page-wrap">
      <div className="easy-card-header">
        <h2 className="easy-page-title">Stock & Inventory Management</h2>
        <p className="easy-page-desc">
          আপনার প্যাকেজের বর্তমান স্টক সংখ্যা ও প্রাপ্যতা (In Stock / Out of Stock) নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <div className="easy-form-stack">
        {stockList.map((item, idx) => (
          <div key={item.id} className="easy-subcard">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={item.images?.[0] || '/images/IMG_7091.webp'}
                alt={item.title}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e7eb' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>{item.title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
                  <span>SKU: {item.sku}</span>
                  <span>মূল্য: ৳ {item.price}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: item.status === 'active' ? '#ecfdf5' : '#fef2f2',
                    color: item.status === 'active' ? '#059669' : '#dc2626'
                  }}
                >
                  {item.status === 'active' ? 'In Stock' : 'Out of Stock'}
                </span>
                <label className="easy-switch">
                  <input
                    type="checkbox"
                    checked={item.status === 'active'}
                    onChange={() => handleStatusToggle(idx)}
                  />
                  <span className="easy-slider round"></span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ maxWidth: '240px' }} className="easy-field-group">
                <label>বর্তমান স্টক সংখ্যা (Quantity)</label>
                <input
                  type="number"
                  className="easy-input"
                  value={item.stock_qty}
                  onChange={(e) => handleStockChange(idx, e.target.value)}
                  min="0"
                />
              </div>
              {item.stock_qty < 10 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '13px', marginTop: '6px' }}>
                  <AlertTriangle size={14} />
                  <span>সতর্কতা: স্টক সংখ্যা কম (Low Stock Alert)!</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="easy-submit-wrap">
          <button
            type="button"
            className="easy-save-btn"
            onClick={handleSaveStock}
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'স্টক সংরক্ষণ করুন (Save Stock)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

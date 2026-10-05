import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  FileText
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function OrdersManager() {
  const { orders, updateOrderStatus, deleteOrder } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (o.order_id && o.order_id.toLowerCase().includes(q)) ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q));

    const matchesStatus = statusTab === 'all' ? true : o.status === statusTab;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="adm-badge adm-badge-warning">অপেক্ষমাণ (Pending)</span>;
      case 'confirmed':
        return <span className="adm-badge adm-badge-info">কনফার্মড (Confirmed)</span>;
      case 'processing':
        return <span className="adm-badge adm-badge-info">প্রক্রিয়াধীন</span>;
      case 'shipped':
        return <span className="adm-badge adm-badge-info">কুরিয়ারে পাঠানো (Shipped)</span>;
      case 'delivered':
        return <span className="adm-badge adm-badge-success">ডেলিভার্ড (Delivered)</span>;
      case 'cancelled':
        return <span className="adm-badge adm-badge-danger">বাতিল (Cancelled)</span>;
      default:
        return <span className="adm-badge">{status}</span>;
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
            অর্ডার ব্যবস্থাপনা ({orders.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--adm-text-subdued)', margin: '2px 0 0 0' }}>
            ক্যাশ অন ডেলিভারি ও ওয়েবসাইট থেকে আসা সমস্ত অর্ডারের বিবরণ
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="adm-card" style={{ marginBottom: '16px' }}>
        <div className="adm-card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'all', label: `সব (${orders.length})` },
              { id: 'pending', label: `অপেক্ষমাণ (${orders.filter((o) => o.status === 'pending').length})` },
              { id: 'confirmed', label: `কনফার্মড (${orders.filter((o) => o.status === 'confirmed').length})` },
              { id: 'shipped', label: `শিপড (${orders.filter((o) => o.status === 'shipped').length})` },
              { id: 'delivered', label: `ডেলিভার্ড (${orders.filter((o) => o.status === 'delivered').length})` },
              { id: 'cancelled', label: `বাতিল (${orders.filter((o) => o.status === 'cancelled').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`adm-btn adm-btn-sm ${statusTab === tab.id ? 'adm-btn-primary' : ''}`}
                onClick={() => setStatusTab(tab.id)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', marginTop: '12px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--adm-text-subdued)'
              }}
            />
            <input
              type="text"
              placeholder="অর্ডার আইডি, গ্রাহকের নাম, মোবাইল নম্বর বা ঠিকানা দিয়ে খুঁজুন..."
              className="adm-input"
              style={{ paddingLeft: '36px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="adm-card">
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--adm-text-subdued)' }}>
            কোনো অর্ডার খুঁজে পাওয়া যায়নি
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table adm-table-responsive">
              <thead>
                <tr>
                  <th>অর্ডার আইডি</th>
                  <th>তারিখ</th>
                  <th>গ্রাহকের তথ্য</th>
                  <th>প্যাকেজ / পণ্য</th>
                  <th>টোটাল</th>
                  <th>স্ট্যাটাস পরিবর্তন</th>
                  <th style={{ textAlign: 'right' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.order_id}>
                    <td data-label="অর্ডার আইডি" style={{ fontWeight: 600, color: '#008060' }}>
                      {ord.order_id}
                    </td>

                    <td data-label="তারিখ" style={{ fontSize: '12.5px', color: 'var(--adm-text-subdued)' }}>
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString('bn-BD') : 'N/A'}
                    </td>

                    <td data-label="গ্রাহকের তথ্য">
                      <div style={{ fontWeight: 600 }}>{ord.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--adm-text-subdued)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} />
                        <a href={`tel:${ord.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {ord.phone}
                        </a>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--adm-text-subdued)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ord.address}, {ord.area}
                      </div>
                    </td>

                    <td data-label="প্যাকেজ">
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{ord.package_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--adm-text-subdued)' }}>
                        পরিমাণ: {ord.quantity || 1} টি
                      </div>
                    </td>

                    <td data-label="টোটাল">
                      <div style={{ fontWeight: 700, color: '#111827' }}>৳ {ord.total_price}</div>
                      <div style={{ fontSize: '11px', color: '#008060' }}>ক্যাশ অন ডেলিভারি</div>
                    </td>

                    <td data-label="স্ট্যাটাস">
                      <select
                        className="adm-select"
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          width: 'auto',
                          background:
                            ord.status === 'pending'
                              ? '#fef2f2'
                              : ord.status === 'delivered'
                              ? '#ecfdf5'
                              : '#eff6ff',
                          borderColor:
                            ord.status === 'pending'
                              ? '#f87171'
                              : ord.status === 'delivered'
                              ? '#34d399'
                              : '#60a5fa'
                        }}
                        value={ord.status || 'pending'}
                        onChange={(e) => updateOrderStatus(ord.order_id, e.target.value)}
                      >
                        <option value="pending">অপেক্ষমাণ (Pending)</option>
                        <option value="confirmed">কনফার্মড (Confirmed)</option>
                        <option value="processing">প্রক্রিয়াধীন (Processing)</option>
                        <option value="shipped">কুরিয়ারে পাঠানো (Shipped)</option>
                        <option value="delivered">ডেলিভার্ড (Delivered)</option>
                        <option value="cancelled">বাতিল (Cancelled)</option>
                      </select>
                    </td>

                    <td data-label="অ্যাকশন" style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="adm-btn adm-btn-sm"
                          onClick={() => setSelectedOrder(ord)}
                          title="সম্পূর্ণ অর্ডার দেখুন"
                        >
                          <Eye size={13} />
                          <span>বিস্তারিত</span>
                        </button>
                        <button
                          className="adm-btn adm-btn-sm adm-btn-danger"
                          onClick={() => {
                            if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) {
                              deleteOrder(ord.order_id);
                            }
                          }}
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal Sheet */}
      {selectedOrder && (
        <div
          className="adm-backdrop"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="adm-card"
            style={{ width: '92%', maxWidth: '520px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-card-header">
              <div>
                <h3 className="adm-card-title">অর্ডার ডিটেইলস: {selectedOrder.order_id}</h3>
                <div style={{ marginTop: '4px' }}>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <button
                className="adm-btn adm-btn-sm"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="adm-card-body" style={{ fontSize: '13.5px', lineHeight: 1.6 }}>
              {/* Customer Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontWeight: 600, color: '#008060', marginBottom: '4px' }}>
                  গ্রাহকের যোগাযোগের ঠিকানা:
                </div>
                <div><strong>নাম:</strong> {selectedOrder.name}</div>
                <div>
                  <strong>মোবাইল:</strong>{' '}
                  <a href={`tel:${selectedOrder.phone}`} style={{ color: '#008060', fontWeight: 600 }}>
                    {selectedOrder.phone}
                  </a>
                </div>
                <div><strong>ঠিকানা:</strong> {selectedOrder.address}</div>
                <div><strong>ডেলিভারি এরিয়া:</strong> {selectedOrder.area}</div>
              </div>

              {/* Order Items & Breakdown */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>অর্ডারের বিবরণ:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{selectedOrder.package_name}</span>
                  <span>× {selectedOrder.quantity || 1}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>একক মূল্য:</span>
                  <span>৳ {selectedOrder.unit_price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#008060' }}>
                  <span>ডেলিভারি চার্জ:</span>
                  <span>ফ্রি (৳০)</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--adm-border)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px' }}>
                  <span>সর্বমোট বিল:</span>
                  <span>৳ {selectedOrder.total_price}</span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="adm-btn adm-btn-sm"
                  style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.order_id, 'confirmed');
                    setSelectedOrder((prev) => ({ ...prev, status: 'confirmed' }));
                  }}
                >
                  ✓ কনফার্ম করুন
                </button>
                <button
                  className="adm-btn adm-btn-sm"
                  style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.order_id, 'shipped');
                    setSelectedOrder((prev) => ({ ...prev, status: 'shipped' }));
                  }}
                >
                  🚚 কুরিয়ারে পাঠান
                </button>
                <button
                  className="adm-btn adm-btn-sm"
                  style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.order_id, 'delivered');
                    setSelectedOrder((prev) => ({ ...prev, status: 'delivered' }));
                  }}
                >
                  🎉 ডেলিভার্ড
                </button>
                <button
                  className="adm-btn adm-btn-sm"
                  style={{ background: '#fef2f2', color: '#991b1b', borderColor: '#fecaca' }}
                  onClick={() => {
                    updateOrderStatus(selectedOrder.order_id, 'cancelled');
                    setSelectedOrder((prev) => ({ ...prev, status: 'cancelled' }));
                  }}
                >
                  ✕ বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

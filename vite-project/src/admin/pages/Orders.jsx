import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Edit2, ChevronDown, Package } from 'lucide-react';
import { getOrders, syncOrders, updateOrderStatus } from '../../utils/adminStore';

const statusConfig = {
  Delivered:  { bg: '#F0FDF8', text: '#10B981', dot: '#10B981' },
  Shipped:    { bg: '#EFF6FF', text: '#3B82F6', dot: '#3B82F6' },
  Processing: { bg: '#FFF7ED', text: '#F59E0B', dot: '#F59E0B' },
  Pending:    { bg: '#FFF1F2', text: '#F43F5E', dot: '#F43F5E' },
  Cancelled:  { bg: '#F9FAFB', text: '#9CA3AF', dot: '#9CA3AF' },
};

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [orderData, setOrderData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadOrders = (sourceOrders) => {
      setOrderData(sourceOrders ? [...sourceOrders] : []);
    };

    const local = getOrders();
    loadOrders(local);

    syncOrders((syncedList) => {
      loadOrders(syncedList);
    });
  }, []);

  const filtered = orderData.filter(o => {
    const custName = o.customer || o.shippingDetails?.name || 'Customer';
    const ordId = o.orderId || o.id;
    const matchSearch = custName.toLowerCase().includes(search.toLowerCase()) || ordId.includes(search);
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) => {
    setOrderData(prev => prev.map(o => (o.id === id || o.orderId === id) ? { ...o, status: newStatus } : o));
    updateOrderStatus(id, newStatus);
  };

  const counts = statusOptions.reduce((acc, s) => {
    acc[s] = orderData.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Orders</h2>
          <p className="text-sm text-[#9E9189]">{filtered.length} orders</p>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {['All', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 ${
              filterStatus === s ? 'bg-[#111111] text-white shadow-md shadow-[#111111]/20' : 'bg-white border border-[#E8DDD0] text-[#6B6B6B] hover:bg-[#F8F4F9]'
            }`}
          >
            {s !== 'All' && s in statusConfig && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig[s].dot }} />
            )}
            {s} {s !== 'All' && counts[s] !== undefined && <span className="opacity-70">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name or order ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#B0A99F] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.1)] transition-all"
          />
        </div>
      </div>

      {/* Orders - Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((order, i) => {
          const sc = statusConfig[order.status] || statusConfig.Pending;
          const ordId = order.orderId || order.id;
          const productName = order.product || (order.items && order.items.length > 0 ? order.items[0].name + (order.items.length > 1 ? ` +${order.items.length - 1} more` : '') : 'Custom Suit');
          const productSize = order.size || (order.items && order.items.length > 0 ? order.items[0].size : 'M');

          return (
            <motion.div key={ordId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-[#E8DDD0] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E8DDD0] flex items-center justify-center text-xs font-bold text-[#111111] flex-shrink-0">
                    {(order.customer || 'C').charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{order.customer || 'Customer'}</p>
                    <p className="text-[10px] text-[#9E9189]">{ordId} · {order.city || 'N/A'}</p>
                  </div>
                </div>
                <select
                  value={order.status}
                  onChange={e => updateStatus(ordId, e.target.value)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-full border-0 appearance-none cursor-pointer focus:outline-none pr-5 flex-shrink-0"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="text-xs text-[#1A1A1A] font-medium">{productName}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#1A1A1A]">{order.amount}</span>
                  <span className="text-[10px] text-[#9E9189]">{order.date}</span>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === ordId ? null : ordId)}
                  className="text-[10px] text-[#111111] font-semibold flex items-center gap-1"
                >
                  {expandedId === ordId ? 'Less' : 'Details'}
                </button>
              </div>
              {expandedId === ordId && (
                <div className="pt-2 border-t border-[#E8DDD0] grid grid-cols-2 gap-2 text-[10px]">
                  <div><span className="text-[#9E9189]">Size:</span> {productSize}</div>
                  <div><span className="text-[#9E9189]">Payment:</span> {order.payment || 'N/A'}</div>
                  <div><span className="text-[#9E9189]">Email:</span> {order.email || 'N/A'}</div>
                  <div><span className="text-[#9E9189]">Date:</span> {order.date || 'N/A'}</div>
                  {order.items && order.items.length > 0 && (
                    <div className="col-span-2 pt-2 border-t border-[#E8DDD0] space-y-2">
                      <p className="text-[#9E9189] font-bold uppercase">Items</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#FAF9F6] rounded-lg p-2">
                          <img src={item.image} alt={item.name} className="w-8 h-10 object-cover object-top rounded" />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-[#9E9189]">Size: {item.size} · Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#FDFBF8] border-b border-[#E8DDD0]">
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold tracking-widest text-[#9E9189] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD0]">
              <AnimatePresence>
                {filtered.map((order, i) => {
                  const sc = statusConfig[order.status] || statusConfig.Pending;
                  const ordId = order.orderId || order.id;
                  const isExpanded = expandedId === ordId;
                  
                  const productName = order.product || (order.items && order.items.length > 0 ? order.items[0].name + (order.items.length > 1 ? ` + ${order.items.length - 1} more` : '') : 'Custom Suit');
                  const productSize = order.size || (order.items && order.items.length > 0 ? order.items[0].size : 'M');
                  const productQty = order.qty || (order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 1);

                  return (
                    <React.Fragment key={ordId}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-[#FDFBF9] transition-colors text-left"
                      >
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-[#111111]">{ordId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#E8DDD0] flex items-center justify-center text-xs font-bold text-[#111111] flex-shrink-0">
                              {(order.customer || 'C').charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#1A1A1A]">{order.customer || order.shippingDetails?.name || 'Customer'}</p>
                              <p className="text-xs text-[#9E9189]">{order.city || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-[#1A1A1A] font-medium max-w-[160px] truncate">{productName}</p>
                          <p className="text-xs text-[#9E9189]">Size: {productSize} · Qty: {productQty}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-[#1A1A1A]">{order.amount}</p>
                          <p className="text-xs text-[#9E9189]">{order.payment}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={e => updateStatus(ordId, e.target.value)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-full border-0 appearance-none cursor-pointer focus:outline-none pr-6"
                              style={{ background: sc.bg, color: sc.text }}
                            >
                              {statusOptions.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: sc.text }} />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#6B6B6B]">{order.date}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : ordId)}
                            className="w-8 h-8 rounded-lg bg-[#E8DDD0] flex items-center justify-center hover:bg-[#E8DDD0] transition-colors cursor-pointer"
                          >
                            <Eye size={14} className="text-[#6B6B6B]" />
                          </button>
                        </td>
                      </motion.tr>
                      
                      {/* Expanded detail row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan={7} className="px-5 py-4 bg-[#FDFBF8] border-b border-[#E8DDD0]">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-left">
                                {[
                                  { label: 'Email', value: order.email || 'N/A' },
                                  { label: 'Payment Mode', value: order.payment || 'N/A' },
                                  { label: 'Shipping City', value: order.city || 'N/A' },
                                  { label: 'Order Date', value: order.date || 'N/A' },
                                ].map(({ label, value }) => (
                                  <div key={label} className="bg-white rounded-xl p-3 border border-[#E8DDD0]">
                                    <p className="text-xs text-[#9E9189] uppercase tracking-wider mb-1">{label}</p>
                                    <p className="font-semibold text-[#1A1A1A]">{value}</p>
                                  </div>
                                ))}

                                {order.items && order.items.length > 0 && (
                                  <div className="col-span-2 sm:col-span-4 mt-2 border-t border-[#E8DDD0] pt-4">
                                    <p className="text-xs text-[#9E9189] uppercase tracking-wider mb-2 font-bold">Ordered Items</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-xl p-3 border border-[#E8DDD0] flex items-center gap-3">
                                          <div className="w-10 h-13 overflow-hidden bg-white border border-[#E8DDD0] flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-[#1A1A1A] truncate">{item.name}</p>
                                            <p className="text-xs text-[#9E9189]">Size: {item.size} · Qty: {item.quantity} · Price: {item.price}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

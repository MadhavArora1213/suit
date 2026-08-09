import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Tag, Percent } from 'lucide-react';
import { getCoupons, addCoupon, deleteCoupon } from '../../utils/adminStore';

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCoupons(getCoupons());
    const handler = () => setCoupons(getCoupons());
    window.addEventListener('admin-data-updated', handler);
    return () => window.removeEventListener('admin-data-updated', handler);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;
    
    setLoading(true);
    const code = newCode.toUpperCase().replace(/\s+/g, '');
    const discount = parseInt(newDiscount, 10);
    
    if (coupons.some(c => c.code === code)) {
      alert('Coupon code already exists!');
      setLoading(false);
      return;
    }
    
    if (discount <= 0 || discount > 100) {
      alert('Discount must be between 1 and 100');
      setLoading(false);
      return;
    }

    const newCoupon = {
      id: `coupon_${Date.now()}`,
      code,
      discountPercentage: discount,
      createdAt: new Date().toISOString()
    };

    await addCoupon(newCoupon);
    setNewCode('');
    setNewDiscount('');
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      await deleteCoupon(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Discount Coupons</h2>
          <p className="text-sm text-[#9E9189]">Manage promo codes and their percentage discounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Coupon Form */}
        <div className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#111111]" /> Add New Coupon
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-[#111111]">Coupon Code</label>
              <div className="relative">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8BCBE]" />
                <input 
                  type="text" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. FESTIVE20"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm uppercase focus:outline-none focus:border-[#111111]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-[#111111]">Discount Percentage (%)</label>
              <div className="relative">
                <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8BCBE]" />
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm focus:outline-none focus:border-[#111111]"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors disabled:opacity-70"
            >
              {loading ? 'Adding...' : 'Create Coupon'}
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Active Coupons ({coupons.length})</h3>
          
          {coupons.length === 0 ? (
            <div className="bg-white border border-[#E8DDD0]/60 rounded-2xl p-10 text-center">
              <Tag size={40} className="mx-auto text-[#E8DDD0] mb-4" />
              <h4 className="text-lg font-medium text-[#1A1A1A]">No coupons found</h4>
              <p className="text-sm text-[#9E9189] mt-1">Create your first discount coupon using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={coupon.id} 
                  className="bg-white border border-[#E8DDD0]/60 rounded-2xl p-5 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#E8DDD0]/30 text-[#111111] font-mono font-bold text-sm px-2.5 py-1 rounded border border-[#E8DDD0]/50">
                        {coupon.code}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-[#1A1A1A] mt-2">
                      {coupon.discountPercentage}% OFF
                    </p>
                    <p className="text-[10px] text-[#9E9189] mt-1">
                      Added: {new Date(coupon.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

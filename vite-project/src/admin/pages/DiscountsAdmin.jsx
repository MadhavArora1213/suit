import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, Trash2, Edit2, CheckCircle2, Percent, IndianRupee } from 'lucide-react';
import { getDiscounts, saveDiscounts } from '../../utils/adminStore';

export default function DiscountsAdmin() {
  const [discounts, setDiscounts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percentage'); // 'percentage' | 'fixed'
  const [newValue, setNewValue] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('');

  useEffect(() => {
    setDiscounts(getDiscounts() || []);
  }, []);

  const handleSaveAll = (updatedDiscounts) => {
    saveDiscounts(updatedDiscounts);
    setDiscounts(updatedDiscounts);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!newCode || !newValue) return;
    
    if (editingId) {
      // Update existing
      const updated = discounts.map(d => {
        if (d.id === editingId) {
          return {
            ...d,
            code: newCode.toUpperCase(),
            type: newType,
            value: parseFloat(newValue),
            minOrder: newMinOrder ? parseFloat(newMinOrder) : 0,
          };
        }
        return d;
      });
      handleSaveAll(updated);
    } else {
      // Create new
      const newDiscount = {
        id: Date.now().toString(),
        code: newCode.toUpperCase(),
        type: newType,
        value: parseFloat(newValue),
        minOrder: newMinOrder ? parseFloat(newMinOrder) : 0,
        active: true,
        createdAt: new Date().toISOString()
      };
      const updated = [...discounts, newDiscount];
      handleSaveAll(updated);
    }
    
    // Reset form
    resetForm();
  };

  const startEdit = (discount) => {
    setEditingId(discount.id);
    setNewCode(discount.code);
    setNewType(discount.type);
    setNewValue(discount.value.toString());
    setNewMinOrder(discount.minOrder ? discount.minOrder.toString() : '');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewCode('');
    setNewValue('');
    setNewMinOrder('');
    setNewType('percentage');
    setIsAdding(false);
  };

  const toggleStatus = (id) => {
    const updated = discounts.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    );
    handleSaveAll(updated);
  };

  const deleteDiscount = (id) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      const updated = discounts.filter(d => d.id !== id);
      handleSaveAll(updated);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Discount Codes</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Create and manage promotional discount codes for your customers.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAdding(!isAdding); }}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-[#BCA58A] transition-colors"
        >
          <Plus size={16} /> Add Discount Code
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddOrUpdate}
            className="bg-white rounded-2xl border border-[#E8DDD0] p-6 mb-8 shadow-sm overflow-hidden"
          >
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest mb-6">
              {editingId ? 'Edit Discount Code' : 'Create New Discount'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase mb-2">Code</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                  <input 
                    type="text" 
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="e.g. SUMMER20"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm font-bold text-[#111111] uppercase placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#BCA58A] transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase mb-2">Discount Type</label>
                <div className="flex bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl p-1">
                  <button type="button" onClick={() => setNewType('percentage')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-sm font-semibold transition-colors ${newType === 'percentage' ? 'bg-[#111111] text-white shadow-sm' : 'text-[#6B6B6B] hover:text-[#111111]'}`}>
                    <Percent size={14} /> %
                  </button>
                  <button type="button" onClick={() => setNewType('fixed')} className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-sm font-semibold transition-colors ${newType === 'fixed' ? 'bg-[#111111] text-white shadow-sm' : 'text-[#6B6B6B] hover:text-[#111111]'}`}>
                    <IndianRupee size={14} /> Flat
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase mb-2">Discount Value</label>
                <div className="relative">
                  {newType === 'percentage' ? (
                    <Percent size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                  ) : (
                    <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                  )}
                  <input 
                    type="number" 
                    required
                    min="1"
                    step="0.01"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={newType === 'percentage' ? "20" : "500"}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#BCA58A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase mb-2">Min. Order Amount (Optional)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                  <input 
                    type="number" 
                    min="0"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#BCA58A] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DDD0]">
              <button type="button" onClick={resetForm} className="px-5 py-2.5 text-sm font-semibold text-[#6B6B6B] hover:text-[#111111] transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-[#BCA58A] text-white rounded-xl text-sm font-semibold hover:bg-[#111111] transition-colors shadow-sm">
                {editingId ? 'Save Changes' : 'Create Code'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden shadow-sm">
        {discounts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#BCA58A]/30 mb-4">
              <Tag size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No active discounts</h3>
            <p className="text-sm text-[#6B6B6B] max-w-sm">You haven't created any promotional codes yet. Create one to start offering deals to your customers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E8DDD0]">
                  <th className="py-4 px-6 text-xs font-bold text-[#111111] uppercase tracking-wider">Discount Code</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#111111] uppercase tracking-wider">Value</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#111111] uppercase tracking-wider">Min. Order</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#111111] uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#111111] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#111111] tracking-wider bg-[#E8DDD0]/30 px-3 py-1 rounded-lg">
                        <Tag size={12} className="text-[#BCA58A]" />
                        {discount.code}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-[#111111]">
                        {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} Flat`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#6B6B6B]">
                      {discount.minOrder > 0 ? `₹${discount.minOrder}` : 'None'}
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => toggleStatus(discount.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${discount.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        {discount.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => startEdit(discount)}
                        className="p-2 text-[#6B6B6B] hover:text-[#BCA58A] hover:bg-[#FAF9F6] rounded-lg transition-colors mr-1"
                        title="Edit Discount"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteDiscount(discount.id)}
                        className="p-2 text-[#6B6B6B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Discount"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Save Notification */}
      <AnimatePresence>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-[#111111] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Discounts Updated</p>
              <p className="text-xs text-white/60">Changes have been saved successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

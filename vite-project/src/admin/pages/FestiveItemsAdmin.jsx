import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Star, Sparkles, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { getFestiveOffers, deleteFestiveOffer, updateFestiveOffer, notifyWebsite } from '../../utils/adminStore';

export default function FestiveItemsAdmin({ setActivePage }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  const [items, setItems] = useState(() => getFestiveOffers());

  const reloadData = () => {
    setItems(getFestiveOffers());
  };

  useEffect(() => {
    window.addEventListener('admin-data-updated', reloadData);
    return () => window.removeEventListener('admin-data-updated', reloadData);
  }, []);

  const categories = ['All', 'Kashmiri Churi', 'Designer Kadas', 'Patiala Suits', 'Gift Hampers', 'Kids Rakhi', 'Silver Rakhi', 'Bracelets'];

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        (item.category || '').toLowerCase().includes(search.toLowerCase()) ||
                        (item.badge || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || item.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = (id) => {
    deleteFestiveOffer(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
  };

  const toggleStatus = (id, currentStatus) => {
    updateFestiveOffer(id, { active: !currentStatus });
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !currentStatus } : i));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8DDD0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-lg">
              <Sparkles size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Festive & Special Offers</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7A6E65]">Manage Churi, Rakhi, Kadas, Hampers & Combos for Rakhi Festive Offers ({filtered.length} items found)</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem('admin_edit_festive_item');
            setActivePage('add-festive-item');
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B1A1A] to-[#6B0D13] text-[#F5D76E] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus size={16} /> Add Festive Item (Rakhi/Churi/Kada)
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B1A1A]" />
          <input
            type="text"
            placeholder="Search Churi, Rakhi, Kadas, Hampers, Suits..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#B0A99F] focus:outline-none focus:border-[#8B1A1A] transition-all"
          />
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCat === cat
                  ? 'bg-[#8B1A1A] text-[#F5D76E] shadow-sm'
                  : 'bg-[#FAF9F5] text-[#6B6B6B] hover:bg-[#E8DDD0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden group hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative h-48 bg-[#FAF9F5] overflow-hidden">
                <img 
                  src={item.image || '/rakhi_suit_hero_shoot.jpg'} 
                  alt={item.title} 
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500" 
                />
                
                {/* Badge */}
                <span className="absolute top-2 left-2 bg-[#8B1A1A] text-[#F5D76E] text-[10px] font-black tracking-wider px-2.5 py-1 rounded-lg border border-[#D4AF37]/50 shadow-md">
                  {item.badge || 'FESTIVE EDIT'}
                </span>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleStatus(item.id, item.active)}
                  className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md cursor-pointer transition-colors ${
                    item.active !== false ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                  title="Click to toggle active status"
                >
                  {item.active !== false ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {item.active !== false ? 'Active' : 'Hidden'}
                </button>

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      localStorage.setItem('admin_edit_festive_item', JSON.stringify(item));
                      setActivePage('add-festive-item');
                    }}
                    className="w-10 h-10 bg-[#8B1A1A] text-[#F5D76E] rounded-full flex items-center justify-center shadow-lg border border-[#D4AF37] cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 size={16} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteId(item.id)}
                    className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-[#8B1A1A] uppercase tracking-wider">{item.category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star size={10} className="fill-amber-400 text-amber-500" />
                      <span>{item.rating || '4.9'}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#E8DDD0] flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-[#1A1A1A]">{item.price}</span>
                    {item.originalPrice && <span className="text-xs text-gray-400 line-through ml-2">{item.originalPrice}</span>}
                  </div>
                  {item.savings && (
                    <span className="text-[9px] font-bold text-[#8B1A1A] bg-[#8B1A1A]/10 px-2 py-0.5 rounded border border-[#8B1A1A]/20">
                      {item.savings}
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#E8DDD0]">
            <h3 className="text-lg font-bold text-[#1A1A1A]">Delete Festive Item?</h3>
            <p className="text-xs text-gray-600">Are you sure you want to delete this festive item? This action will remove it live from the website section.</p>
            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getCategories, saveCategories, notifyWebsite } from '../../utils/adminStore';

export default function CategoriesAdmin({ setActivePage }) {
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setCategories([...getCategories()]);
    handleUpdate();
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const openAdd = () => {
    window.history.pushState(null, '', '/admin/add-category');
    setActivePage('add-category');
  };

  const openEdit = (cat) => {
    window.history.pushState(null, '', `/admin/edit-category?id=${cat.id}`);
    setActivePage('edit-category');
  };

  const triggerSave = (updatedCategories) => {
    saveCategories(updatedCategories);
    notifyWebsite();
  };

  const toggleActive = (id) => {
    const nextCategories = categories.map(c => c.id === id ? { ...c, active: !c.active } : c);
    setCategories(nextCategories);
    triggerSave(nextCategories);
  };

  const handleDelete = (id) => {
    const nextCategories = categories.filter(c => c.id !== id);
    setCategories(nextCategories);
    triggerSave(nextCategories);
    setDeleteId(null);
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Categories</h2>
          <p className="text-xs sm:text-sm text-[#9E9189]">{categories.filter(c => c.active).length} active · {categories.filter(c => !c.active).length} hidden</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-[#111111] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-[#111111]/25 w-full sm:w-auto">
          <Plus size={14} /> Add Category
        </motion.button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {sorted.map((cat, i) => (
            <motion.div key={cat.id} layout
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border overflow-hidden group hover:shadow-lg transition-all duration-300 ${cat.active ? 'border-[#E8DDD0] hover:border-[#111111]/30' : 'border-dashed border-[#D0C8C0] opacity-60'}`}>
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[#F8F4F9]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Order badge */}
                <div className="absolute top-3 left-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xs font-bold text-[#111111] shadow">
                  {cat.order}
                </div>
                {/* Active badge */}
                <div className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-full ${cat.active ? 'bg-green-500 text-white' : 'bg-[#9E9189] text-white'}`}>
                  {cat.active ? 'Active' : 'Hidden'}
                </div>
                {/* Name overlay */}
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{cat.name}</h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-[#9E9189] mb-4 line-clamp-2">{cat.tagline}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(cat.id)} className="flex items-center gap-1.5">
                    {cat.active ? <ToggleRight size={20} className="text-[#10B981]" /> : <ToggleLeft size={20} className="text-[#D0C8C0]" />}
                    <span className={`text-xs font-semibold ${cat.active ? 'text-[#10B981]' : 'text-[#9E9189]'}`}>{cat.active ? 'Live' : 'Hidden'}</span>
                  </button>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => openEdit(cat)}
                      className="w-8 h-8 rounded-lg bg-[#E8DDD0] flex items-center justify-center hover:bg-[#B8DEE4] transition-colors">
                      <Edit2 size={14} className="text-[#6B6B6B]" />
                    </button>
                    <button onClick={() => setDeleteId(cat.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Card */}
        <motion.button onClick={openAdd} whileHover={{ scale: 1.01 }}
          className="h-full min-h-[230px] border-2 border-dashed border-[#111111]/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#111111] hover:bg-[#E8DDD0] transition-all text-[#111111]">
          <div className="w-10 h-10 bg-[#E8DDD0] rounded-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
          <span className="text-sm font-semibold">Add Category</span>
        </motion.button>
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-7 max-w-sm w-full mx-4 shadow-2xl border border-[#E8DDD0] text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Delete Category?</h3>
              <p className="text-sm text-[#9E9189] mb-6">All products in this category may become uncategorized.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

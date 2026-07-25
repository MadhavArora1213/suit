import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, X, Check, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react';
import { getCategories, saveCategories, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const initialCategories = [
  { id: 1, name: 'Anarkali', image: '/anarkali_suit.png', tagline: 'Flowing elegance for every occasion', order: 1, active: true },
  { id: 2, name: 'Sharara', image: '/sharara_suit.png', tagline: 'Modern silhouettes with traditional charm', order: 2, active: true },
  { id: 3, name: 'Banarasi', image: '/banarasi_suit.png', tagline: 'Heritage weaves from the holy city', order: 3, active: true },
  { id: 4, name: 'Chikankari', image: '/chikankari_suit.png', tagline: 'Lucknowi artistry in every thread', order: 4, active: true },
  { id: 5, name: 'Patiala', image: '/patiala_suit.png', tagline: 'Comfortable cuts with vibrant prints', order: 5, active: false },
  { id: 6, name: 'Pakistani', image: '/pakistani_suit.png', tagline: 'Contemporary styles with rich embroidery', order: 6, active: true },
];

const emptyForm = { name: '', tagline: '', image: '', imagePreview: '', order: 1, active: true };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getCategories();
    const merged = [...data, ...initialCategories.filter(s => !data.some(a => a.id === s.id))];
    setCategories(merged);
  }, []);

  const openAdd = () => { setForm({ ...emptyForm, order: categories.length + 1 }); setEditingId(null); setShowModal(true); };
  const openEdit = (cat) => { setForm({ ...cat, imagePreview: cat.image }); setEditingId(cat.id); setShowModal(true); };

  const triggerSave = (updatedCategories) => {
    saveCategories(updatedCategories);
    notifyWebsite();
  };

  const handleSave = () => {
    let nextCategories = [];
    if (editingId) {
      nextCategories = categories.map(c => c.id === editingId ? { ...c, ...form, image: form.imagePreview || form.image } : c);
    } else {
      nextCategories = [...categories, { ...form, id: Date.now(), image: form.imagePreview || '/designer_suit_1.png' }];
    }
    setCategories(nextCategories);
    triggerSave(nextCategories);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 900);
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

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setForm(f => ({ ...f, imagePreview: b64 }));
    }
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Categories</h2>
          <p className="text-sm text-[#9E9189]">{categories.filter(c => c.active).length} active · {categories.filter(c => !c.active).length} hidden</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#111111]/25">
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl border border-[#E8DDD0] shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#E8DDD0]">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{editingId ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[#E8DDD0] flex items-center justify-center text-[#6B6B6B]"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Category Image</label>
                  <label className="block border-2 border-dashed border-[#BCA58A] rounded-xl overflow-hidden cursor-pointer hover:border-[#111111] transition-colors">
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-[#9E9189] gap-2">
                        <Upload size={22} className="text-[#111111]" />
                        <span className="text-xs">Upload category image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                </div>

                {[
                  { label: 'Category Name', key: 'name', placeholder: 'e.g. Anarkali' },
                  { label: 'Tagline', key: 'tagline', placeholder: 'e.g. Flowing elegance for every occasion' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Display Order</label>
                    <input type="number" min="1" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center justify-between p-3 bg-[#FDFBF9] rounded-xl border border-[#E8DDD0]">
                      <span className="text-sm font-semibold text-[#1A1A1A]">Active</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                        {form.active ? <ToggleRight size={24} className="text-[#10B981]" /> : <ToggleLeft size={24} className="text-[#D0C8C0]" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-[#E8DDD0] flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={handleSave}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#111111] text-white shadow-md'}`}>
                  {saved ? <><Check size={15} /> Saved!</> : 'Save Category'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

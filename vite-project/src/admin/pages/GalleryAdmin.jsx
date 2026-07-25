import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, X, Check, Hash } from 'lucide-react';
import { getGallery, saveGallery, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const initialItems = [
  { id: 1, image: '/designer_suit_1.png', category: 'Traditional', likes: '1.2k', comments: '142', caption: 'Capturing royal heritage in our zardozi silk suit.', hashtags: '#ethnicwear #salwarsuits', productId: 't1' },
  { id: 2, image: '/anarkali_suit.png', category: 'Designer', likes: '942', comments: '85', caption: 'The perfect crimson flare for festive gatherings.', hashtags: '#anarkali #festive', productId: 'n1' },
  { id: 3, image: '/pakistani_suit.png', category: 'Party', likes: '2.5k', comments: '210', caption: 'Vibrant Pakistani silhouettes that flow beautifully.', hashtags: '#pakistanisuit #summer', productId: 't4' },
  { id: 4, image: '/sharara_suit.png', category: 'Casual', likes: '652', comments: '44', caption: 'Playful sharara tiers layered with gota details.', hashtags: '#sharara #traditional', productId: 't3' },
  { id: 5, image: '/patiala_suit.png', category: 'Designer', likes: '1.8k', comments: '166', caption: 'Bright handloom patiala suit for effortless day wear.', hashtags: '#patiala #cotton', productId: 'n3' },
  { id: 6, image: '/chikankari_suit.png', category: 'Traditional', likes: '1.1k', comments: '98', caption: 'Lucknowi shadow embroidery on pastel georgette.', hashtags: '#chikankari #handloom', productId: 'b2' },
];

const categories = ['Traditional', 'Designer', 'Party', 'Casual'];

const emptyForm = { image: '', imagePreview: '', category: 'Traditional', likes: '', comments: '', caption: '', hashtags: '', productId: '' };

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getGallery();
    const merged = [...data, ...initialItems.filter(s => !data.some(a => a.id === s.id))];
    setItems(merged);
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => {
    setForm({ ...item, imagePreview: item.image });
    setEditingItem(item.id);
    setShowModal(true);
  };

  const triggerSave = (updatedItems) => {
    saveGallery(updatedItems);
    notifyWebsite();
  };

  const handleSave = () => {
    let nextItems = [];
    if (editingItem) {
      nextItems = items.map(i => i.id === editingItem ? { ...i, ...form, image: form.imagePreview || form.image } : i);
    } else {
      nextItems = [{ ...form, id: Date.now(), image: form.imagePreview || '/designer_suit_1.png' }, ...items];
    }
    setItems(nextItems);
    triggerSave(nextItems);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 900);
  };

  const handleDelete = (id) => {
    const nextItems = items.filter(i => i.id !== id);
    setItems(nextItems);
    triggerSave(nextItems);
    setDeleteId(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setForm(f => ({ ...f, imagePreview: b64 }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Instagram Gallery</h2>
          <p className="text-sm text-[#9E9189]">{items.length} gallery items</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#111111]/25">
          <Plus size={16} /> Add Gallery Item
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }} transition={{ delay: i * 0.04 }}
              className="group relative rounded-2xl overflow-hidden bg-[#F8F4F9] border border-[#E8DDD0] aspect-square cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img src={item.image} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">{item.category}</span>
                </div>
                <div>
                  <p className="text-white text-xs line-clamp-2 mb-2">{item.caption}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="flex-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[#111111] transition-colors flex items-center justify-center gap-1">
                      <Edit2 size={10} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="bg-red-500/80 backdrop-blur-sm text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Stats badge */}
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                ❤ {item.likes}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add card */}
        <motion.button onClick={openAdd} whileHover={{ scale: 1.02 }}
          className="aspect-square border-2 border-dashed border-[#111111]/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#111111] hover:bg-[#E8DDD0] transition-all text-[#111111]">
          <Plus size={24} />
          <span className="text-xs font-semibold">Add New</span>
        </motion.button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl border border-[#E8DDD0] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#E8DDD0]">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[#E8DDD0] flex items-center justify-center text-[#6B6B6B]"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Gallery Image</label>
                  <label className="block w-full border-2 border-dashed border-[#BCA58A] rounded-xl overflow-hidden cursor-pointer hover:border-[#111111] transition-colors">
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-[#9E9189] gap-2">
                        <Upload size={22} className="text-[#111111]" />
                        <span className="text-xs">Click to upload image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Style Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(c => (
                      <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.category === c ? 'bg-[#111111] text-white border-[#111111]' : 'border-[#E8DDD0] text-[#6B6B6B] hover:border-[#111111]'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Caption</label>
                  <textarea rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                    placeholder="Instagram-style caption..."
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all resize-none" />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Hashtags</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                    <input value={form.hashtags} onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))}
                      placeholder="#ethnicwear #salwarsuits"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                </div>

                {/* Stats & Product Link */}
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'Likes', key: 'likes', placeholder: '1.2k' }, { label: 'Comments', key: 'comments', placeholder: '142' }, { label: 'Product ID', key: 'productId', placeholder: 't1' }].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">{label}</label>
                      <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border-t border-[#E8DDD0] flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={handleSave}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#111111] text-white shadow-md'}`}>
                  {saved ? <><Check size={15} /> Saved!</> : 'Save Item'}
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
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Remove Gallery Item?</h3>
              <p className="text-sm text-[#9E9189] mb-6">This will remove it from the Instagram gallery section.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

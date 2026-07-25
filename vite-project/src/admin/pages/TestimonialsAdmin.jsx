import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, X, Check, Star, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';
import { getTestimonials, saveTestimonials, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const initialTestimonials = [
  { id: 1, name: 'Priya Sharma', location: 'Delhi, India', review: 'Absolutely stunning quality! The Banarasi silk suit I ordered was beyond my expectations. The craftsmanship is exquisite.', rating: 5, photo: '', published: true },
  { id: 2, name: 'Anjali Mehta', location: 'Mumbai, India', review: 'The chikankari work is so delicate and beautiful. Got so many compliments at the wedding. Will definitely order again!', rating: 5, photo: '', published: true },
  { id: 3, name: 'Ritu Verma', location: 'Jaipur, India', review: 'Perfect festive wear! The colors are vibrant and the fabric is premium. Delivery was also very prompt.', rating: 4, photo: '', published: true },
  { id: 4, name: 'Sunita Joshi', location: 'Lucknow, India', review: 'Loved the patiala suit. Very comfortable and the embroidery details are gorgeous. Great value for money!', rating: 5, photo: '', published: false },
];

const emptyForm = { name: '', location: '', review: '', rating: 5, photo: '', photoPreview: '', published: true };

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getTestimonials();
    const merged = [...data, ...initialTestimonials.filter(s => !data.some(a => a.id === s.id))];
    setItems(merged);
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ ...item, photoPreview: item.photo }); setEditingId(item.id); setShowModal(true); };

  const triggerSave = (updatedItems) => {
    saveTestimonials(updatedItems);
    notifyWebsite();
  };

  const handleSave = () => {
    let nextItems = [];
    if (editingId) {
      nextItems = items.map(t => t.id === editingId ? { ...t, ...form, photo: form.photoPreview || form.photo } : t);
    } else {
      nextItems = [...items, { ...form, id: Date.now(), photo: form.photoPreview || '' }];
    }
    setItems(nextItems);
    triggerSave(nextItems);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 900);
  };

  const togglePublish = (id) => {
    const nextItems = items.map(t => t.id === id ? { ...t, published: !t.published } : t);
    setItems(nextItems);
    triggerSave(nextItems);
  };

  const handleDelete = (id) => {
    const nextItems = items.filter(t => t.id !== id);
    setItems(nextItems);
    triggerSave(nextItems);
    setDeleteId(null);
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setForm(f => ({ ...f, photoPreview: b64 }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Testimonials</h2>
          <p className="text-sm text-[#9E9189]">{items.filter(t => t.published).length} published · {items.filter(t => !t.published).length} hidden</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#111111]/25">
          <Plus size={16} /> Add Review
        </motion.button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div key={item.id} layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.06 }}
              className={`bg-white rounded-2xl border p-5 transition-all ${item.published ? 'border-[#E8DDD0]' : 'border-dashed border-[#D0C8C0] opacity-70'}`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#111111]/30 to-[#111111]/10 flex items-center justify-center flex-shrink-0 border border-[#E8DDD0] overflow-hidden">
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-[#111111]">{item.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{item.name}</p>
                    <div className="flex items-center gap-1 text-[#9E9189]">
                      <MapPin size={10} />
                      <span className="text-xs">{item.location}</span>
                    </div>
                  </div>
                </div>
                {/* Published toggle */}
                <button onClick={() => togglePublish(item.id)} className="flex items-center gap-1.5 flex-shrink-0">
                  {item.published
                    ? <ToggleRight size={22} className="text-[#10B981]" />
                    : <ToggleLeft size={22} className="text-[#D0C8C0]" />
                  }
                  <span className={`text-xs font-semibold ${item.published ? 'text-[#10B981]' : 'text-[#9E9189]'}`}>
                    {item.published ? 'Live' : 'Hidden'}
                  </span>
                </button>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={14} className={n <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-[#D0C8C0]'} />
                ))}
              </div>

              {/* Review */}
              <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4 line-clamp-3">"{item.review}"</p>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-[#E8DDD0]">
                <button onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#E8DDD0] rounded-xl text-xs font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] hover:text-[#111111] hover:border-[#111111]/30 transition-all">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-100 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 hover:border-red-200 transition-all">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{editingId ? 'Edit Review' : 'Add Review'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[#E8DDD0] flex items-center justify-center text-[#6B6B6B]"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Photo upload */}
                <div className="flex items-center gap-4">
                  <label className="w-16 h-16 rounded-full overflow-hidden bg-[#E8DDD0] border-2 border-dashed border-[#BCA58A] flex items-center justify-center cursor-pointer hover:border-[#111111] transition-colors flex-shrink-0">
                    {form.photoPreview ? (
                      <img src={form.photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={18} className="text-[#111111]" />
                    )}
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#1A1A1A]">Customer Photo</p>
                    <p className="text-xs text-[#9E9189]">Optional. Square format recommended.</p>
                  </div>
                </div>

                {[
                  { label: 'Customer Name', key: 'name', placeholder: 'e.g. Priya Sharma' },
                  { label: 'Location', key: 'location', placeholder: 'e.g. Delhi, India' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                ))}

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Review Text</label>
                  <textarea rows={3} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} placeholder="Customer's review..."
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all resize-none" />
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                        className="transition-transform hover:scale-110">
                        <Star size={26} className={form.rating >= n ? 'text-amber-400 fill-amber-400' : 'text-[#D0C8C0]'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Published toggle */}
                <div className="flex items-center justify-between p-4 bg-[#FDFBF9] rounded-xl border border-[#E8DDD0]">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Publish Review</p>
                    <p className="text-xs text-[#9E9189]">Show this review on the homepage</p>
                  </div>
                  <button type="button" onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                    {form.published
                      ? <ToggleRight size={28} className="text-[#10B981]" />
                      : <ToggleLeft size={28} className="text-[#D0C8C0]" />}
                  </button>
                </div>
              </div>
              <div className="p-5 border-t border-[#E8DDD0] flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={handleSave}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#111111] text-white shadow-md'}`}>
                  {saved ? <><Check size={15} /> Saved!</> : 'Save Review'}
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
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Delete Review?</h3>
              <p className="text-sm text-[#9E9189] mb-6">This review will be permanently removed.</p>
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

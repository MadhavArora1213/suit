import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, X, Check, Move } from 'lucide-react';
import { getLookbook, saveLookbook, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const initialHotspots = [
  { id: 1, top: '35%', left: '42%', productName: 'Royal Zari Dupatta', price: '₹3,499', desc: 'Handwoven pure silk banarasi dupatta with intricate gold zari borders.', image: '/designer_suit_1.png', productId: 't1' },
  { id: 2, top: '60%', left: '55%', productName: 'Crimson Anarkali Flare', price: '₹14,999', desc: 'Voluminous 24-kali silk anarkali with hand-embroidered waist belt.', image: '/anarkali_suit.png', productId: 'n1' },
  { id: 3, top: '75%', left: '38%', productName: 'Handcrafted Zardozi Kurti', price: '₹8,999', desc: 'Deep maroon raw silk kurti featuring heavy zardozi neckwork.', image: '/sharara_suit.png', productId: 'b1' },
];

const defaultLookbook = {
  bgImage: '/hero_campaign_palace.png',
  hotspots: initialHotspots
};

const emptyForm = { productName: '', price: '', desc: '', image: '', imagePreview: '', top: '50%', left: '50%', productId: '' };

export default function LookbookAdmin() {
  const [bgImage, setBgImage] = useState('');
  const [hotspots, setHotspots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getLookbook(defaultLookbook);
    setBgImage(data.bgImage || defaultLookbook.bgImage);
    setHotspots(data.hotspots || defaultLookbook.hotspots);
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (h) => { setForm({ ...h, imagePreview: h.image }); setEditingId(h.id); setShowModal(true); };

  const triggerSave = (updatedHotspots, updatedBg) => {
    saveLookbook({
      bgImage: updatedBg || bgImage,
      hotspots: updatedHotspots || hotspots
    });
    notifyWebsite();
  };

  const handleSave = () => {
    let nextHotspots = [];
    if (editingId) {
      nextHotspots = hotspots.map(h => h.id === editingId ? { ...h, ...form, image: form.imagePreview || form.image } : h);
    } else {
      nextHotspots = [...hotspots, { ...form, id: Date.now(), image: form.imagePreview || '/designer_suit_1.png' }];
    }
    setHotspots(nextHotspots);
    triggerSave(nextHotspots, bgImage);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 900);
  };

  const removeHotspot = (id) => {
    const nextHotspots = hotspots.filter(h => h.id !== id);
    setHotspots(nextHotspots);
    triggerSave(nextHotspots, bgImage);
  };

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleBgChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setBgImage(b64);
      triggerSave(hotspots, b64);
    }
  };

  const handleHotspotImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      updateForm('imagePreview', b64);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Interactive Lookbook</h2>
          <p className="text-sm text-[#9E9189]">Manage campaign image and product hotspots</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#111111]/25">
          <Plus size={16} /> Add Hotspot
        </motion.button>
      </div>

      {/* Background Image */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Campaign Background Image</h3>
        <div className="flex items-start gap-5">
          <div className="relative w-32 h-44 rounded-xl overflow-hidden border border-[#E8DDD0] flex-shrink-0 bg-[#F8F4F9]">
            <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
              <Upload size={20} className="text-white" />
              <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1A1A1A] mb-1">Lookbook Campaign Image</p>
            <p className="text-xs text-[#9E9189] mb-4">Full-screen editorial image. Recommended: 1920×1080px or larger. The hotspots are positioned as percentage coordinates over this image.</p>
            <label className="inline-flex items-center gap-2 bg-[#E8DDD0] text-[#111111] text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[#B8DEE4] transition-colors border border-[#BCA58A]">
              <Upload size={14} /> Change Background
              <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Preview */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
        <div className="p-5 border-b border-[#E8DDD0]">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Hotspot Preview</h3>
          <p className="text-xs text-[#9E9189]">Glowing dots show where hotspots are positioned</p>
        </div>
        <div className="relative w-full h-72 bg-[#F8F4F9] overflow-hidden">
          <img src={bgImage} alt="Lookbook Preview" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {hotspots.map((h) => (
            <div key={h.id} className="absolute" style={{ top: h.top, left: h.left, transform: 'translate(-50%, -50%)' }}>
              <div className="relative">
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 w-8 h-8 bg-[#111111] rounded-full" />
                <div className="w-8 h-8 bg-[#111111] rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer">
                  <Plus size={14} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotspots Table */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden">
        <div className="p-5 border-b border-[#E8DDD0]">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Hotspots ({hotspots.length})</h3>
        </div>
        <div className="divide-y divide-[#E8DDD0]">
          {hotspots.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#FDFBF9] transition-colors">
              <div className="w-9 h-9 bg-[#111111] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
              <img src={h.image} alt={h.productName} className="w-10 h-12 object-cover rounded-lg flex-shrink-0 border border-[#E8DDD0]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{h.productName}</p>
                <p className="text-xs text-[#9E9189] truncate">{h.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#111111]">{h.price}</p>
                <p className="text-xs text-[#9E9189]">Top: {h.top} · Left: {h.left}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(h)} className="w-8 h-8 rounded-lg bg-[#E8DDD0] flex items-center justify-center hover:bg-[#B8DEE4] transition-colors">
                  <Edit2 size={14} className="text-[#6B6B6B]" />
                </button>
                <button onClick={() => removeHotspot(h.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {hotspots.length === 0 && (
          <div className="p-10 text-center text-[#9E9189] text-sm">No hotspots yet. Click "Add Hotspot" to create one.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl border border-[#E8DDD0] shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#E8DDD0]">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">{editingId ? 'Edit Hotspot' : 'Add Hotspot'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-[#E8DDD0] flex items-center justify-center text-[#6B6B6B]"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Product Image */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Product Image</label>
                  <label className="block border-2 border-dashed border-[#BCA58A] rounded-xl overflow-hidden cursor-pointer hover:border-[#111111] transition-colors">
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" className="w-full h-28 object-cover" />
                    ) : (
                      <div className="h-28 flex flex-col items-center justify-center text-[#9E9189] gap-2">
                        <Upload size={20} className="text-[#111111]" />
                        <span className="text-xs">Upload product image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleHotspotImage} className="hidden" />
                  </label>
                </div>

                {[
                  { label: 'Product Name', key: 'productName', placeholder: 'e.g. Royal Zari Dupatta' },
                  { label: 'Price', key: 'price', placeholder: 'e.g. ₹3,499' },
                  { label: 'Linked Product ID', key: 'productId', placeholder: 'e.g. t1, n1' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">{label}</label>
                    <input value={form[key]} onChange={e => updateForm(key, e.target.value)} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Description</label>
                  <textarea rows={2} value={form.desc} onChange={e => updateForm('desc', e.target.value)} placeholder="Short product description..."
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all resize-none" />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Position on Image</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Top (%)', key: 'top' }, { label: 'Left (%)', key: 'left' }].map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-xs text-[#9E9189] mb-1 block">{label}</label>
                        <input type="text" value={form[key]} onChange={e => updateForm(key, e.target.value)} placeholder="e.g. 45%"
                          className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#9E9189] mt-2 flex items-center gap-1">
                    <Move size={10} /> Enter percentage values (0–100%). E.g. Top: 35%, Left: 42%
                  </p>
                </div>
              </div>
              <div className="p-5 border-t border-[#E8DDD0] flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={handleSave}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#111111] text-white shadow-md'}`}>
                  {saved ? <><Check size={15} /> Saved!</> : 'Save Hotspot'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

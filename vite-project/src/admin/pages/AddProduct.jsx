import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus, X, Check, Star } from 'lucide-react';
import { addProduct, updateProduct, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const P = '#005461';

const sizes = ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'];
const occasions = ['Festive', 'Wedding', 'Casual', 'Party', 'Daily Wear'];
const careOptions = ['Dry Clean Only', 'Hand Wash', 'Machine Wash', 'Do Not Bleach', 'Iron on Low Heat'];
const badges = ['Silk Blend', 'Handloom', 'Premium', 'Hot Seller', 'New Edition', 'Artisanal', 'Heritage', 'Exclusive', 'Best Price', 'Verified', '100% Cotton', 'Lightweight'];

const Label = ({ children, required }) => (
  <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: P }}>
    {children} {required && <span className="text-red-400">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = 'text', ...rest }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    className="w-full px-4 py-3 bg-[#F5FCFD] border border-[#C8E8EC] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all"
    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(0,84,97,0.1)`; e.target.style.background = '#fff'; }}
    onBlur={e => { e.target.style.borderColor = '#C8E8EC'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F5FCFD'; }}
    {...rest} />
);

const Card = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-[#C8E8EC]/60 overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-[#EBF6F8]" style={{ background: '#F5FCFD' }}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      {subtitle && <p className="text-xs text-[#6B8C90] mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function AddProduct({ setActivePage, editProduct = null }) {
  const [form, setForm] = useState({
    name: editProduct?.name || '',
    price: editProduct?.price?.replace('₹', '').replace(',', '') || '',
    boutique: editProduct?.boutique || '',
    badge: editProduct?.badge || '',
    collection: editProduct?.collection || 'Trending',
    styleCategory: editProduct?.styleCategory || 'Traditional',
    suitType: editProduct?.suitType || 'Anarkali',
    shortDesc: editProduct?.shortDesc || '',
    fabricDetails: editProduct?.fabricDetails || '',
    fabricName: editProduct?.fabricName || '',
    fabricDesc: editProduct?.fabricDesc || '',
    rating: editProduct?.rating || '4.5',
    igLikes: editProduct?.igLikes || '',
    igComments: editProduct?.igComments || '',
    videoUrl: editProduct?.videoUrl || '',
    reelUrl: editProduct?.reelUrl || '',
  });

  const [selectedSizes, setSelectedSizes] = useState(editProduct?.sizes || []);
  const [selectedOccasions, setSelectedOccasions] = useState(editProduct?.occasions || []);
  const [selectedCare, setSelectedCare] = useState(editProduct?.care || []);
  const [stockQty, setStockQty] = useState(editProduct?.stockQty || {});
  const [mainImage, setMainImage] = useState(editProduct?.image || null);
  const [additionalImages, setAdditionalImages] = useState(editProduct?.additionalImages || []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setMainImage(b64);
  };

  const handleAdditionalImages = async (e) => {
    const files = Array.from(e.target.files || []);
    const b64s = await Promise.all(files.map(fileToBase64));
    setAdditionalImages(prev => [...prev, ...b64s]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert('Product name and price are required.');
      return;
    }
    setSaving(true);
    const product = {
      id: editProduct?.id || `admin_${Date.now()}`,
      name: form.name,
      price: `₹${Number(form.price).toLocaleString('en-IN')}`,
      priceNum: Number(form.price),
      boutique: form.boutique,
      badge: form.badge,
      collection: form.collection,
      styleCategory: form.styleCategory,
      suitType: form.suitType,
      type: form.suitType,
      shortDesc: form.shortDesc,
      fabricDetails: form.fabricDetails,
      fabricName: form.fabricName,
      fabricDesc: form.fabricDesc,
      rating: parseFloat(form.rating),
      igLikes: form.igLikes,
      igComments: form.igComments,
      videoUrl: form.videoUrl,
      reelUrl: form.reelUrl,
      sizes: selectedSizes,
      occasions: selectedOccasions,
      care: selectedCare,
      stockQty,
      image: mainImage || '/designer_suit_1.png',
      additionalImages,
      addedAt: editProduct?.addedAt || new Date().toISOString(),
      source: 'admin',
    };

    if (editProduct) {
      updateProduct(editProduct.id, product);
    } else {
      addProduct(product);
    }

    notifyWebsite();
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setActivePage('products'); }, 1500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Header — full width */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setActivePage('products')}
          className="w-10 h-10 rounded-xl bg-white border border-[#C8E8EC] flex items-center justify-center hover:bg-[#EBF6F8] transition-colors shadow-sm">
          <ArrowLeft size={18} className="text-[#6B8C90]" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-sm text-[#6B8C90]">Fill in details — saved product will appear on the website instantly</p>
        </div>
        <motion.button type="submit" disabled={saving}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="ml-auto flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all"
          style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${P}, #003D47)`, boxShadow: saved ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px rgba(0,84,97,0.3)` }}>
          {saving ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
           : saved ? <><Check size={16} /> Saved to Website!</>
           : 'Save Product'}
        </motion.button>
      </div>

      {/* FULL-WIDTH 3-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* ── LEFT: Basic + Categorization + Description + Sizes ── (3 cols) */}
        <div className="xl:col-span-3 space-y-5">

          {/* Basic Info */}
          <Card title="Basic Information" subtitle="Core details shown on product listing cards">
            <div className="space-y-4">
              <div>
                <Label required>Product Name</Label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Embroidered Silk Suit Set" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 4299" />
                </div>
                <div>
                  <Label required>Boutique / Seller</Label>
                  <Input value={form.boutique} onChange={e => update('boutique', e.target.value)} placeholder="e.g. Kala Mandir" />
                </div>
              </div>
              <div>
                <Label>Badge / Tag</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {badges.map(b => (
                    <button key={b} type="button" onClick={() => update('badge', b)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all"
                      style={form.badge === b
                        ? { background: P, color: '#fff', borderColor: P }
                        : { background: '#F5FCFD', borderColor: '#C8E8EC', color: '#4A6A70' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Categorization */}
          <Card title="Categorization" subtitle="Controls which tab and filters the product appears under on the website">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Collection Tab', key: 'collection', options: ['Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit'] },
                { label: 'Style Category', key: 'styleCategory', options: ['Traditional', 'Designer', 'Party', 'Casual'] },
                { label: 'Suit Type', key: 'suitType', options: ['Anarkali', 'Sharara', 'Patiala', 'Pakistani', 'Chikankari', 'Banarasi'] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <Label required>{label}</Label>
                  <select value={form[key]} onChange={e => update(key, e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5FCFD] border border-[#C8E8EC] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all"
                    onFocus={e => { e.target.style.borderColor = P; }}
                    onBlur={e => { e.target.style.borderColor = '#C8E8EC'; }}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <Label>Occasion</Label>
              <div className="flex flex-wrap gap-2">
                {occasions.map(o => (
                  <button key={o} type="button" onClick={() => toggleArr(selectedOccasions, setSelectedOccasions, o)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all"
                    style={selectedOccasions.includes(o)
                      ? { background: '#EBF6F8', borderColor: P, color: P }
                      : { background: '#F5FCFD', borderColor: '#C8E8EC', color: '#4A6A70' }}>
                    {selectedOccasions.includes(o) && <Check size={12} />} {o}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card title="Description & Details" subtitle="Fabric info shown in Quick View and product pages">
            <div className="space-y-4">
              <div>
                <Label>Short Description</Label>
                <textarea rows={2} value={form.shortDesc} onChange={e => update('shortDesc', e.target.value)}
                  placeholder="Brief product summary..."
                  className="w-full px-4 py-3 bg-[#F5FCFD] border border-[#C8E8EC] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(0,84,97,0.08)`; }}
                  onBlur={e => { e.target.style.borderColor = '#C8E8EC'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <Label>Fabric & Design Details</Label>
                <textarea rows={3} value={form.fabricDetails} onChange={e => update('fabricDetails', e.target.value)}
                  placeholder="Handcrafted from premium salwar suit fabric blend..."
                  className="w-full px-4 py-3 bg-[#F5FCFD] border border-[#C8E8EC] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(0,84,97,0.08)`; }}
                  onBlur={e => { e.target.style.borderColor = '#C8E8EC'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Featured Fabric Name</Label>
                  <Input value={form.fabricName} onChange={e => update('fabricName', e.target.value)} placeholder="e.g. Heritage Banarasi Silk" />
                </div>
                <div>
                  <Label>Fabric Short Description</Label>
                  <Input value={form.fabricDesc} onChange={e => update('fabricDesc', e.target.value)} placeholder="e.g. Handwoven pure zari" />
                </div>
              </div>
              <div>
                <Label>Care Instructions</Label>
                <div className="flex flex-wrap gap-2">
                  {careOptions.map(c => (
                    <button key={c} type="button" onClick={() => toggleArr(selectedCare, setSelectedCare, c)}
                      className="px-3 py-2 rounded-lg text-sm font-semibold border transition-all"
                      style={selectedCare.includes(c)
                        ? { background: '#EBF6F8', borderColor: P, color: P }
                        : { background: '#F5FCFD', borderColor: '#C8E8EC', color: '#4A6A70' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Sizes & Stock */}
          <Card title="Sizes & Stock" subtitle="Select available sizes and enter per-size stock quantity">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sizes.map(size => (
                <div key={size}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer"
                  style={{ borderColor: selectedSizes.includes(size) ? P : '#C8E8EC', background: selectedSizes.includes(size) ? '#EBF6F8' : '#F5FCFD' }}
                  onClick={() => toggleArr(selectedSizes, setSelectedSizes, size)}>
                  <div className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ borderColor: selectedSizes.includes(size) ? P : '#A8BCBE', background: selectedSizes.includes(size) ? P : 'transparent' }}>
                    {selectedSizes.includes(size) && <Check size={13} className="text-white" />}
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A1A]">{size}</span>
                  {selectedSizes.includes(size) && (
                    <input type="number" min="0" value={stockQty[size] || ''}
                      onChange={e => { e.stopPropagation(); setStockQty(prev => ({ ...prev, [size]: e.target.value })); }}
                      onClick={e => e.stopPropagation()}
                      placeholder="Qty"
                      className="ml-auto w-16 px-2 py-1 border border-[#C8E8EC] rounded-lg text-sm text-center focus:outline-none bg-white"
                      onFocus={e => { e.stopPropagation(); e.target.style.borderColor = P; }}
                      onBlur={e => { e.target.style.borderColor = '#C8E8EC'; }} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── RIGHT: Images + Rating + Summary ── (2 cols) */}
        <div className="xl:col-span-2 space-y-5">

          {/* Main Image Upload */}
          <Card title="Main Product Image" subtitle="Primary listing image (3:4 ratio recommended)">
            <div
              onDrop={e => { e.preventDefault(); handleMainImage(e); }}
              onDragOver={e => e.preventDefault()}
              className="relative rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group"
              style={{ borderColor: mainImage ? P : '#C8E8EC' }}>
              {mainImage ? (
                <div className="relative">
                  <img src={mainImage} alt="Preview" className="w-full aspect-[3/4] object-cover" />
                  <button type="button" onClick={() => setMainImage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    ✓ Image uploaded
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-[3/4] cursor-pointer hover:bg-[#EBF6F8] transition-colors">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110"
                    style={{ background: '#EBF6F8' }}>
                    <Upload size={24} style={{ color: P }} />
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Drop image here</p>
                  <p className="text-xs text-[#6B8C90] mt-1">or click to browse</p>
                  <p className="text-xs text-[#A8BCBE] mt-3">JPG, PNG, WEBP · Max 5MB</p>
                  <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                </label>
              )}
            </div>
          </Card>

          {/* Additional Images */}
          <Card title="Additional Images" subtitle="Shown in product gallery / carousel">
            <div className="grid grid-cols-3 gap-3 mb-3">
              {additionalImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-[#C8E8EC]">
                  <img src={img} alt={`Additional ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-[#C8E8EC] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#EBF6F8] transition-colors">
                <Plus size={20} style={{ color: P }} />
                <span className="text-xs text-[#6B8C90] mt-1">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} className="hidden" />
              </label>
            </div>
          </Card>

          {/* Media Links */}
          <Card title="Product Video & Reels" subtitle="Add standard and vertical reel-style video loops">
            <div className="space-y-4">
              <div>
                <Label>Standard Product Video URL</Label>
                <Input value={form.videoUrl} onChange={e => update('videoUrl', e.target.value)} placeholder="e.g. https://assets.mixkit.co/... .mp4" />
                <p className="text-[10px] text-[#6B8C90] mt-1">Direct MP4/WebM video URL recommended</p>
              </div>
              <div>
                <Label>Vertical 9:16 Reel Video URL</Label>
                <Input value={form.reelUrl} onChange={e => update('reelUrl', e.target.value)} placeholder="e.g. https://assets.mixkit.co/... .mp4" />
                <p className="text-[10px] text-[#6B8C90] mt-1">Reel-style vertical video (MP4/WebM link)</p>
              </div>
            </div>
          </Card>

          {/* Rating & Social */}
          <Card title="Rating & Social Stats">
            <div className="space-y-4">
              <div>
                <Label>Star Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => update('rating', String(n))}
                      className="transition-transform hover:scale-110 active:scale-95">
                      <Star size={28} className={parseFloat(form.rating) >= n ? 'fill-amber-400 text-amber-400' : 'text-[#C8E8EC]'} />
                    </button>
                  ))}
                  <span className="text-lg font-bold text-[#1A1A1A] ml-2">{form.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Instagram Likes</Label>
                  <Input value={form.igLikes} onChange={e => update('igLikes', e.target.value)} placeholder="e.g. 1.2k" />
                </div>
                <div>
                  <Label>Instagram Comments</Label>
                  <Input value={form.igComments} onChange={e => update('igComments', e.target.value)} placeholder="e.g. 142" />
                </div>
              </div>
            </div>
          </Card>

          {/* Live Summary */}
          <div className="rounded-2xl p-5 border border-[#C8E8EC]" style={{ background: 'linear-gradient(135deg, #EBF6F8, #F5FCFD)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: P }}>Product Summary</p>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Name',       val: form.name || '—' },
                { label: 'Price',      val: form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—', bold: true },
                { label: 'Collection', val: form.collection },
                { label: 'Type',       val: form.suitType },
                { label: 'Sizes',      val: selectedSizes.length ? `${selectedSizes.length} selected` : 'None' },
                { label: 'Image',      val: mainImage ? '✓ Ready' : 'Not uploaded', color: mainImage ? '#10B981' : '#F43F5E' },
              ].map(({ label, val, bold, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[#6B8C90]">{label}</span>
                  <span className="font-semibold truncate max-w-[150px] text-right" style={{ color: color || (bold ? P : '#1A1A1A') }}>{val}</span>
                </div>
              ))}
            </div>
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${P}, #003D47)` }}>
              {saving ? 'Saving...' : saved ? '✓ Saved — Visible on Website!' : 'Save & Publish to Website'}
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  );
}

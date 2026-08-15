import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus, X, Check, Star, MousePointer, Eye, BarChart2 } from 'lucide-react';
import { addProduct, updateProduct, fileToBase64, notifyWebsite, getBoutiques, getCategories } from '../../utils/adminStore';
import { uploadImageToFirebase } from '../../firebase';

const P = '#111111';

const sizes = ['XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)', 'XXXL (46)', 'XXXXL (48)'];
const occasions = ['Festive', 'Wedding', 'Casual', 'Party', 'Daily Wear', 'Bridal', 'Engagement', 'Sangeet', 'Mehendi', 'Reception', 'Puja', 'Eid', 'Diwali', 'Holi', 'Navratri', 'Karva Chauth', 'Office Wear', 'Travel', 'Brunch', 'Date Night'];
const careOptions = ['Dry Clean Only', 'Hand Wash', 'Machine Wash', 'Do Not Bleach', 'Iron on Low Heat'];
const badges = ['Silk Blend', 'Handloom', 'Premium', 'Hot Seller', 'New Edition', 'Artisanal', 'Heritage', 'Exclusive', 'Best Price', 'Verified', '100% Cotton', 'Lightweight'];

const Label = ({ children, required }) => (
  <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: P }}>
    {children} {required && <span className="text-red-400">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = 'text', ...rest }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all"
    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; e.target.style.background = '#fff'; }}
    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAF9F6'; }}
    {...rest} />
);

const Card = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-[#E8DDD0]/60 overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-[#E8DDD0]" style={{ background: '#FAF9F6' }}>
      <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
      {subtitle && <p className="text-xs text-[#6B8C90] mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function AddProduct({ setActivePage, editProduct = null }) {
  const ep = editProduct;

  const [form, setForm] = useState({
    name: ep?.name || '',
    color: ep?.color || '',
    weight: ep?.weight || '500',
    price: ep?.price?.replace('₹', '').replace(/,/g, '') || '',
    originalPrice: ep?.originalPrice?.replace('₹', '').replace(/,/g, '') || '',
    boutique: ep?.boutique || '',
    badge: ep?.badge || '',
    category: ep?.category || '',
    collection: ep?.collection || 'Trending',
    styleCategory: ep?.styleCategory || 'Traditional',
    suitType: ep?.suitType || ep?.type || 'Anarkali',
    shortDesc: ep?.shortDesc || '',
    fabricDetails: ep?.fabricDetails || '',
    fabricName: ep?.fabricName || '',
    fabricDesc: ep?.fabricDesc || '',
    rating: ep?.rating?.toString() || '4.5',
    igLikes: ep?.igLikes || '',
    igComments: ep?.igComments || '',
    videoUrl: ep?.videoUrl || '',
    reelUrl: ep?.reelUrl || '',
    shippingType: ep?.shippingType || 'Calculate',
  });

  const [selectedFits, setSelectedFits] = useState(ep?.fitOptions || ['Unstitched', 'Stitched']);
  const [selectedSizes, setSelectedSizes] = useState(Array.isArray(ep?.sizes) ? ep.sizes : []);
  const [selectedOccasions, setSelectedOccasions] = useState(ep?.occasions || []);
  const [selectedCare, setSelectedCare] = useState(ep?.care || []);
  const [stockQty, setStockQty] = useState(ep?.stockQty || {});
  const [mainImage, setMainImage] = useState(ep?.image || null);
  const [additionalImages, setAdditionalImages] = useState(ep?.additionalImages || []);
  const [colorVariants, setColorVariants] = useState(ep?.colorVariants || {});
  const [activeColorSlot, setActiveColorSlot] = useState("1");
  const [boutiques, setBoutiques] = useState([]);
  const [globalCategories, setGlobalCategories] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const list = getBoutiques();
    setBoutiques(list.filter(b => b.active !== false));
    setGlobalCategories(getCategories().filter(c => c.active !== false));
  }, []);

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

  const handleVariantMainImage = async (e, slot) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setColorVariants(prev => ({
      ...prev,
      [slot]: { ...(prev[slot] || {}), mainImage: b64 }
    }));
  };

  const handleVariantAdditionalImages = async (e, slot) => {
    const files = Array.from(e.target.files || []);
    const b64s = await Promise.all(files.map(fileToBase64));
    setColorVariants(prev => {
      const current = prev[slot] || {};
      const addImgs = current.additionalImages || [];
      return { ...prev, [slot]: { ...current, additionalImages: [...addImgs, ...b64s] } };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert('Product name and price are required.');
      return;
    }

    const totalImages = (mainImage ? 1 : 0) + additionalImages.length;
    if (totalImages < 1 || totalImages > 5) {
      alert('Please upload between 1 and 5 images in total.');
      return;
    }

    setSaving(true);
    
    // Upload images to Firebase Storage to avoid Firestore document size limits
    let finalMainImage = mainImage || '/designer_suit_1.png';
    if (mainImage && mainImage.startsWith('data:image')) {
      finalMainImage = await uploadImageToFirebase(mainImage, `main_${Date.now()}.jpg`);
    }
    
    const finalAdditionalImages = [];
    for (let i = 0; i < additionalImages.length; i++) {
      if (additionalImages[i].startsWith('data:image')) {
        const url = await uploadImageToFirebase(additionalImages[i], `add_${Date.now()}_${i}.jpg`);
        finalAdditionalImages.push(url);
      } else {
        finalAdditionalImages.push(additionalImages[i]);
      }
    }

    const finalColorVariants = { ...colorVariants };
    for (const slot of Object.keys(finalColorVariants)) {
      const variant = finalColorVariants[slot];
      const colorFolderName = variant.name ? variant.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : `color_${slot}`;
      const uploadFolder = `products/variants/${colorFolderName}`;
      
      if (variant.mainImage && variant.mainImage.startsWith('data:image')) {
        variant.mainImage = await uploadImageToFirebase(variant.mainImage, `main_${Date.now()}.jpg`, uploadFolder);
      }
      if (variant.additionalImages && variant.additionalImages.length > 0) {
        const uploadedAdds = [];
        for (let j = 0; j < variant.additionalImages.length; j++) {
          if (variant.additionalImages[j].startsWith('data:image')) {
             uploadedAdds.push(await uploadImageToFirebase(variant.additionalImages[j], `add_${Date.now()}_${j}.jpg`, uploadFolder));
          } else {
             uploadedAdds.push(variant.additionalImages[j]);
          }
        }
        variant.additionalImages = uploadedAdds;
      }
    }

    const totalStock = Object.values(stockQty).reduce((acc, curr) => acc + (Number(curr) || 0), 0);

    const product = {
      id: ep?.id || `admin_${Date.now()}`,
      name: form.name,
      color: form.color,
      weight: Number(form.weight) || 500,
      price: `₹${Number(form.price).toLocaleString('en-IN')}`,
      priceNum: Number(form.price),
      originalPrice: form.originalPrice ? `₹${Number(form.originalPrice).toLocaleString('en-IN')}` : null,
      originalPriceNum: Number(form.originalPrice) || 0,
      boutique: form.boutique,
      badge: form.badge,
      category: form.category,
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
      fitOptions: selectedFits,
      sizes: selectedSizes,
      occasions: selectedOccasions,
      care: selectedCare,
      stockQty,
      stock: totalStock,
      shippingType: form.shippingType,
      image: finalMainImage,
      additionalImages: finalAdditionalImages,
      colorVariants: finalColorVariants,
      addedAt: ep?.addedAt || new Date().toISOString(),
      source: 'admin',
    };

    if (ep) {
      updateProduct(ep.id, product);
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
          className="w-10 h-10 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-[#E8DDD0] transition-colors shadow-sm">
          <ArrowLeft size={18} className="text-[#6B8C90]" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">{ep ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-sm text-[#6B8C90]">Fill in details — saved product will appear on the website instantly</p>
        </div>
        <motion.button type="submit" disabled={saving}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="ml-auto flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all"
          style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${P}, #111111)`, boxShadow: saved ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px rgba(17,17,17,0.3)` }}>
          {saving ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
           : saved ? <><Check size={16} /> Saved to Website!</>
           : 'Save Product'}
        </motion.button>
      </div>

      {/* Product Tracking Analytics if Editing */}
      {ep && (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B2252]/10 flex items-center justify-center text-[#8B2252]">
              <BarChart2 size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1A1A1A]">Product Link & View Performance</h4>
              <p className="text-xs text-[#6B8C90]">Live tracking metrics for {ep.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#FAF9F6] border border-[#E8DDD0] px-4 py-2 rounded-xl flex items-center gap-2">
              <MousePointer size={14} className="text-[#8B2252]" />
              <span className="text-xs font-bold text-[#1A1A1A]">{ep.clicksCount || ep.clicks || 0} Link Clicks</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E8DDD0] px-4 py-2 rounded-xl flex items-center gap-2">
              <Eye size={14} className="text-[#111111]" />
              <span className="text-xs font-bold text-[#1A1A1A]">{ep.viewsCount || ep.views || 0} Detail Views</span>
            </div>
            <div className="bg-[#111111] text-white px-3 py-2 rounded-xl text-xs font-bold">
              {((ep.viewsCount || ep.views || 0) > 0 ? (((ep.clicksCount || ep.clicks || 0) / (ep.viewsCount || ep.views || 0)) * 100).toFixed(0) : (ep.clicksCount || ep.clicks || 0) > 0 ? 100 : 0)}% CTR
            </div>
          </div>
        </div>
      )}

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label required>Selling Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 4299" />
                </div>
                <div>
                  <Label>Original MRP (₹)</Label>
                  <Input type="number" value={form.originalPrice} onChange={e => update('originalPrice', e.target.value)} placeholder="e.g. 5999" />
                </div>
                <div>
                  <Label>Color(s)</Label>
                  <Input value={form.color} onChange={e => update('color', e.target.value)} placeholder="e.g. Mustard, Wine" />
                </div>
                <div>
                  <Label>Weight (g)</Label>
                  <Input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="e.g. 500" />
                </div>
                <div>
                  <Label required>Shipping Type</Label>
                  <select value={form.shippingType} onChange={e => update('shippingType', e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all"
                    onFocus={e => { e.target.style.borderColor = P; }}
                    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }}>
                    <option value="Calculate">Calculate at Checkout</option>
                    <option value="Free">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <Label required>Boutique / Seller</Label>
                  <select value={form.boutique} onChange={e => update('boutique', e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all"
                    onFocus={e => { e.target.style.borderColor = P; }}
                    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }}>
                    <option value="">Select boutique...</option>
                    {boutiques.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
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
                        : { background: '#FAF9F6', borderColor: '#E8DDD0', color: '#4A6A70' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Categorization */}
          <Card title="Categorization" subtitle="Controls which tab and filters the product appears under on the website">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Global Category</Label>
                <select value={form.category} onChange={e => update('category', e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all"
                  onFocus={e => { e.target.style.borderColor = P; }}
                  onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }}>
                  <option value="">No Category</option>
                  <option value="Suit Sets">Suit Sets</option>
                  <option value="Kurta Sets">Kurta Sets</option>
                  {globalCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              {[
                { label: 'Collection Tab', key: 'collection', options: ['Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit', 'Summer', 'Monsoon', 'Wedding', 'Pastel', 'Black', 'Luxury', 'Punjabi', 'Bridal', 'Velvet', 'Pure Silk', 'Cotton', 'Georgette', 'Organza', 'Casual', 'Party'] },
                { label: 'Style Category', key: 'styleCategory', options: ['Traditional', 'Designer', 'Party', 'Casual', 'Bridal', 'Ethnic', 'Fusion', 'Contemporary', 'Royal', 'Heritage', 'Minimalist', 'Boho', 'Indo Western', 'Western Wear', 'Festive', 'Workwear'] },
                { label: 'Suit Type', key: 'suitType', options: ['Co-ord Set', 'Faarshi Salwar Suit', 'Anarkali', 'Sharara', 'Patiala', 'Pakistani', 'Chikankari', 'Banarasi', 'Lehenga', 'Palazzo Suit', 'Gown', 'Kurti Set', 'Straight Cut', 'A-Line', 'Cotton Suit', 'Georgette Suit', 'Silk Suit', 'Floor Length', 'Indo Western'] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <Label required>{label}</Label>
                  <select value={form[key]} onChange={e => update(key, e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all"
                    onFocus={e => { e.target.style.borderColor = P; }}
                    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }}>
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
                      ? { background: '#E8DDD0', borderColor: P, color: P }
                      : { background: '#FAF9F6', borderColor: '#E8DDD0', color: '#4A6A70' }}>
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
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.08)`; }}
                  onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <Label>Fabric & Design Details</Label>
                <textarea rows={3} value={form.fabricDetails} onChange={e => update('fabricDetails', e.target.value)}
                  placeholder="Handcrafted from premium salwar suit fabric blend..."
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.08)`; }}
                  onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
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
                        ? { background: '#E8DDD0', borderColor: P, color: P }
                        : { background: '#FAF9F6', borderColor: '#E8DDD0', color: '#4A6A70' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Sizes & Stock */}
          <Card title="Available Fits & Sizes" subtitle="Select available fits and sizes. Stock qty is per size.">
            
            <div className="mb-6 border-b border-[#E8DDD0] pb-6">
              <Label required>Available Fits</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {['Unstitched', 'Semi-Stitched', 'Stitched'].map(fit => (
                  <label key={fit} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-[#E8DDD0] flex items-center justify-center transition-all group-hover:border-black"
                         style={{ background: selectedFits.includes(fit) ? '#111111' : '#fff', borderColor: selectedFits.includes(fit) ? '#111111' : '' }}>
                      {selectedFits.includes(fit) && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A]">{fit === 'Stitched' ? 'Readymade (Stitched)' : (fit === 'Semi-Stitched' ? 'Semi-Stitched' : 'Unstitched Fabric')}</span>
                    <input type="checkbox" className="hidden" checked={selectedFits.includes(fit)} onChange={() => toggleArr(selectedFits, setSelectedFits, fit)} />
                  </label>
                ))}
              </div>
              {selectedFits.length === 0 && <p className="text-red-500 text-xs mt-2">Please select at least one fit option.</p>}
            </div>

            {selectedFits.includes('Stitched') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sizes.map(size => (
                  <div key={size}
                    className="flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer"
                    style={{ borderColor: selectedSizes.includes(size) ? P : '#E8DDD0', background: selectedSizes.includes(size) ? '#E8DDD0' : '#FAF9F6' }}
                    onClick={() => toggleArr(selectedSizes, setSelectedSizes, size)}>
                    <div className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: selectedSizes.includes(size) ? P : '#A8BCBE', background: selectedSizes.includes(size) ? P : 'transparent' }}>
                      {selectedSizes.includes(size) && <Check size={13} className="text-white" />}
                    </div>
                    <span className="text-sm font-semibold text-[#1A1A1A]">{size}</span>
                    {selectedSizes.includes(size) && (
                      <button type="button" onClick={e => e.stopPropagation()}
                        className="ml-auto px-3 py-1 rounded-lg text-[11px] font-bold transition-all"
                        style={stockQty[size] > 0
                          ? { background: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7' }
                          : { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                        onClick={e => { e.stopPropagation(); setStockQty(prev => ({ ...prev, [size]: prev[size] > 0 ? 0 : 1 })); }}>
                        {stockQty[size] > 0 ? 'In Stock' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!selectedFits.includes('Stitched') && (
              <p className="text-sm text-[#6B8C90] italic">Sizes are not applicable for purely Unstitched products.</p>
            )}
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
              style={{ borderColor: mainImage ? P : '#E8DDD0' }}>
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
                <label className="flex flex-col items-center justify-center aspect-[3/4] cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:scale-110"
                    style={{ background: '#E8DDD0' }}>
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
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-[#E8DDD0]">
                  <img src={img} alt={`Additional ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setAdditionalImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-[#E8DDD0] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                <Plus size={20} style={{ color: P }} />
                <span className="text-xs text-[#6B8C90] mt-1">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} className="hidden" />
              </label>
            </div>
          </Card>

          {/* Color Variants */}
          <Card title="Color Variants (1-15)" subtitle="Define up to 15 different colors with specific images">
            <div className="space-y-4">
              <div>
                <Label>Select Color Slot</Label>
                <select value={activeColorSlot} onChange={e => setActiveColorSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none appearance-none cursor-pointer transition-all">
                  {[...Array(15)].map((_, i) => (
                    <option key={i+1} value={String(i+1)}>Color Slot {i+1}</option>
                  ))}
                </select>
              </div>
              
              <div className="p-4 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl space-y-4">
                <div>
                  <Label>Color {activeColorSlot} Name</Label>
                  <Input 
                    value={colorVariants[activeColorSlot]?.name || ''} 
                    onChange={e => setColorVariants(prev => ({ ...prev, [activeColorSlot]: { ...prev[activeColorSlot], name: e.target.value } }))} 
                    placeholder="e.g. Royal Blue" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Variant Main Image */}
                  <div>
                    <Label>Main Image</Label>
                    <div className="relative rounded-xl overflow-hidden border-2 border-dashed aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors"
                      style={{ borderColor: colorVariants[activeColorSlot]?.mainImage ? P : '#E8DDD0' }}>
                      {colorVariants[activeColorSlot]?.mainImage ? (
                        <>
                          <img src={colorVariants[activeColorSlot].mainImage} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                          <button type="button" onClick={(e) => { e.preventDefault(); setColorVariants(prev => ({ ...prev, [activeColorSlot]: { ...prev[activeColorSlot], mainImage: null } })) }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10">
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                          <Upload size={20} style={{ color: P }} className="mb-2" />
                          <span className="text-[10px] text-[#6B8C90]">Upload</span>
                          <input type="file" accept="image/*" onChange={(e) => handleVariantMainImage(e, activeColorSlot)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* Variant Additional Images */}
                  <div>
                    <Label>Additional Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(colorVariants[activeColorSlot]?.additionalImages || []).map((img, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden aspect-square border border-[#E8DDD0]">
                          <img src={img} alt={`Add ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setColorVariants(prev => ({
                            ...prev, 
                            [activeColorSlot]: { ...prev[activeColorSlot], additionalImages: prev[activeColorSlot].additionalImages.filter((_, idx) => idx !== i) }
                          }))}
                            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-[#E8DDD0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                        <Plus size={16} style={{ color: P }} />
                        <input type="file" accept="image/*" multiple onChange={(e) => handleVariantAdditionalImages(e, activeColorSlot)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                  {[1, 2, 3, 4, 5].map(n => {
                    const fill = Math.min(Math.max((parseFloat(form.rating) - (n - 1)) * 100, 0), 100);
                    return (
                      <button key={n} type="button" onClick={() => update('rating', String(n))}
                        className="transition-transform hover:scale-110 active:scale-95 relative" style={{ width: 28, height: 28 }}>
                        <Star size={28} className="text-[#E8DDD0] absolute inset-0" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                          <Star size={28} className="fill-amber-400 text-amber-400" />
                        </div>
                      </button>
                    );
                  })}
                  <input type="number" step="0.1" min="0" max="5" value={form.rating}
                    onChange={e => update('rating', e.target.value)}
                    className="w-20 px-3 py-1.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none transition-all text-center font-bold"
                    onFocus={e => { e.target.style.borderColor = P; }}
                    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }} />
                  <span className="text-sm text-[#6B8C90]">/ 5</span>
                </div>
                <p className="text-[10px] text-[#6B8C90] mt-1">Click stars or type decimal like 4.4, 3.2</p>
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
          <div className="rounded-2xl p-5 border border-[#E8DDD0]" style={{ background: 'linear-gradient(135deg, #E8DDD0, #FAF9F6)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: P }}>Product Summary</p>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Name',       val: form.name || '—' },
                { label: 'Price',      val: form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—', bold: true },
                { label: 'Collection', val: form.collection },
                { label: 'Type',       val: form.suitType },
                { label: 'Fits',       val: selectedFits.join(', ') || 'None' },
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
              style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${P}, #111111)` }}>
              {saving ? 'Saving...' : saved ? '✓ Saved — Visible on Website!' : 'Save & Publish to Website'}
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  );
}

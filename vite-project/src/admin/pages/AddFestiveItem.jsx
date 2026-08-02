import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Sparkles, Check, Star, Eye } from 'lucide-react';
import { addFestiveOffer, updateFestiveOffer, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const P = '#8B1A1A';

const categoryOptions = [
  'Kashmiri Churi',
  'Designer Kadas',
  'Patiala Suits',
  'Gift Hampers',
  'Kids Rakhi',
  'Silver Rakhi',
  'Bracelets',
  'Other'
];

const badgeOptions = [
  '40% OFF',
  '45% OFF',
  '30% OFF',
  'BUY 1 GET 1 FREE',
  'FESTIVE BESTSELLER',
  'HOT SELLER',
  'LIMITED EDITION',
  'HANDCRAFTED'
];

const Label = ({ children, required }) => (
  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-[#8B1A1A]">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, type = 'text', ...rest }) => (
  <input 
    type={type} 
    value={value} 
    onChange={onChange} 
    placeholder={placeholder}
    className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all"
    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(139,26,26,0.1)`; e.target.style.background = '#fff'; }}
    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAF9F5'; }}
    {...rest} 
  />
);

export default function AddFestiveItem({ setActivePage }) {
  const [editItem] = useState(() => {
    const saved = localStorage.getItem('admin_edit_festive_item');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { return null; }
    }
    return null;
  });

  const [form, setForm] = useState({
    title: editItem?.title || '',
    category: editItem?.category || 'Kashmiri Churi',
    price: editItem?.price?.replace('₹', '').replace(/,/g, '') || '',
    originalPrice: editItem?.originalPrice?.replace('₹', '').replace(/,/g, '') || '',
    savings: editItem?.savings || '',
    badge: editItem?.badge || '30% OFF',
    rating: editItem?.rating?.toString() || '4.8',
    reviews: editItem?.reviews?.toString() || '86',
    desc: editItem?.desc || '',
    stock: editItem?.stock?.toString() || '50',
    active: editItem?.active !== false
  });

  const [image, setImage] = useState(editItem?.image || null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Auto calculate savings if original price & price are given
  useEffect(() => {
    if (form.price && form.originalPrice) {
      const p = Number(form.price);
      const op = Number(form.originalPrice);
      if (op > p) {
        const diff = op - p;
        update('savings', `Save ₹${diff.toLocaleString('en-IN')}`);
      }
    }
  }, [form.price, form.originalPrice]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setImage(b64);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert('Item Title and Sale Price are required.');
      return;
    }

    setSaving(true);

    const formattedPrice = `₹${Number(form.price).toLocaleString('en-IN')}`;
    const formattedOriginalPrice = form.originalPrice ? `₹${Number(form.originalPrice).toLocaleString('en-IN')}` : '';

    const payload = {
      id: editItem?.id || `festive_${Date.now()}`,
      title: form.title,
      category: form.category,
      price: formattedPrice,
      originalPrice: formattedOriginalPrice,
      savings: form.savings || (form.originalPrice ? `Save ₹${(Number(form.originalPrice) - Number(form.price)).toLocaleString('en-IN')}` : ''),
      badge: form.badge || 'FESTIVE SPECIAL',
      rating: form.rating || '4.8',
      reviews: form.reviews || '50',
      desc: form.desc,
      stock: Number(form.stock) || 30,
      image: image || '/kashmiri_churi_bangles.jpg',
      active: form.active
    };

    if (editItem) {
      updateFestiveOffer(editItem.id, payload);
    } else {
      addFestiveOffer(payload);
    }

    localStorage.removeItem('admin_edit_festive_item');
    notifyWebsite();
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActivePage('festive-items');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E8DDD0] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem('admin_edit_festive_item');
              setActivePage('festive-items');
            }}
            className="p-2.5 bg-[#FAF9F5] hover:bg-[#E8DDD0] rounded-xl text-[#8B1A1A] transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">
              {editItem ? 'Edit Festive Item' : 'Add New Festive Item'}
            </h2>
            <p className="text-xs text-gray-500">Changes will instantly update live on the website section.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8B1A1A] to-[#6B0D13] text-[#F5D76E] px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : editItem ? 'Update Item' : 'Publish Item'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8DDD0] p-6 space-y-5 shadow-sm">
          
          <div>
            <Label required>Item Title</Label>
            <Input 
              value={form.title} 
              onChange={e => update('title', e.target.value)} 
              placeholder="e.g. Royal Kashmiri Velvet & Zari Churi" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Category</Label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B1A1A]"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Discount / Badge Tag</Label>
              <input
                type="text"
                list="badge-suggestions"
                value={form.badge}
                onChange={e => update('badge', e.target.value)}
                placeholder="e.g. 30% OFF or BUY 1 GET 1"
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none"
              />
              <datalist id="badge-suggestions">
                {badgeOptions.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>Sale Price (₹)</Label>
              <Input 
                type="number" 
                value={form.price} 
                onChange={e => update('price', e.target.value)} 
                placeholder="1499" 
              />
            </div>

            <div>
              <Label>Original Price (₹)</Label>
              <Input 
                type="number" 
                value={form.originalPrice} 
                onChange={e => update('originalPrice', e.target.value)} 
                placeholder="2499" 
              />
            </div>

            <div>
              <Label>Savings Text</Label>
              <Input 
                value={form.savings} 
                onChange={e => update('savings', e.target.value)} 
                placeholder="Save ₹1,000" 
              />
            </div>
          </div>

          <div>
            <Label>Item Description</Label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={e => update('desc', e.target.value)}
              placeholder="e.g. Handcrafted Kashmiri Velvet Zari Bangles with Gold Tilla."
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Rating (out of 5)</Label>
              <Input 
                value={form.rating} 
                onChange={e => update('rating', e.target.value)} 
                placeholder="4.8" 
              />
            </div>

            <div>
              <Label>Reviews Count</Label>
              <Input 
                value={form.reviews} 
                onChange={e => update('reviews', e.target.value)} 
                placeholder="86" 
              />
            </div>

            <div>
              <Label>Stock Quantity</Label>
              <Input 
                type="number" 
                value={form.stock} 
                onChange={e => update('stock', e.target.value)} 
                placeholder="50" 
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label required>Item Photo</Label>
            <div className="border-2 border-dashed border-[#E8DDD0] rounded-2xl p-4 text-center bg-[#FAF9F5] hover:border-[#8B1A1A] transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
              <Upload size={24} className="mx-auto text-[#8B1A1A] mb-2" />
              <p className="text-xs font-bold text-[#1A1A1A]">Click or Drag & Drop Photo Here</p>
              <p className="text-[10px] text-gray-400">Supports JPG, PNG, WEBP</p>
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="active-toggle" 
              checked={form.active} 
              onChange={e => update('active', e.target.checked)} 
              className="w-4 h-4 accent-[#8B1A1A] rounded cursor-pointer"
            />
            <label htmlFor="active-toggle" className="text-xs font-bold text-[#1A1A1A] cursor-pointer">
              Active & Visible on Website Section
            </label>
          </div>

        </div>

        {/* Right Live Preview Card (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8DDD0]">
              <Eye size={16} className="text-[#8B1A1A]" />
              <h3 className="text-sm font-bold text-[#1A1A1A]">Live Website Card Preview</h3>
            </div>

            {/* Simulated Website Card */}
            <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F4EEE0] border-2 border-[#D4AF37]/50 rounded-t-[2.5rem] rounded-b-[2rem] p-4 shadow-xl relative overflow-hidden">
              <div className="aspect-[4/3] rounded-t-[2rem] rounded-b-xl overflow-hidden bg-gray-100 mb-3 border-2 border-[#D4AF37]/60 relative">
                <img 
                  src={image || '/kashmiri_churi_bangles.jpg'} 
                  alt="Preview" 
                  className="w-full h-full object-cover object-top" 
                />
                <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#6B0D13] text-[#F5D76E] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border border-[#D4AF37]">
                  {form.badge || '30% OFF'}
                </span>

                <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#6B0D13] to-[#8B1A1A] border border-[#D4AF37] px-2.5 py-1 rounded-lg text-white">
                  <div className="text-right leading-none">
                    <span className="text-xs font-black text-[#F5D76E] block">
                      {form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '₹1,499'}
                    </span>
                    {form.originalPrice && (
                      <span className="text-[8px] text-gray-200 line-through">
                        ₹{Number(form.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold text-[#8B1A1A] uppercase tracking-wider">{form.category}</span>
                <div className="flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star size={10} className="fill-amber-400 text-amber-500" />
                  <span>{form.rating}</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-[#1A1A1A] line-clamp-1 mb-1 font-serif">
                {form.title || 'Royal Kashmiri Velvet & Zari Churi'}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {form.desc || 'Handcrafted Kashmiri Velvet Zari Bangles with Gold Tilla.'}
              </p>

              <div className="bg-gradient-to-r from-[#6B0D13] to-[#8B1A1A] text-[#F5D76E] py-2.5 px-4 rounded-b-[1.8rem] flex items-center justify-between font-bold text-xs">
                <span className="text-[9px] uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} /> Explore Deal
                </span>
                <span>Shop Now →</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

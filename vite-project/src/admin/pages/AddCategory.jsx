import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getCategories, saveCategories, fileToBase64, notifyWebsite } from '../../utils/adminStore';

export default function AddCategory({ setActivePage }) {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');

  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    tagline: '',
    image: '',
    imagePreview: '',
    image2: '',
    image2Preview: '',
    order: 1,
    active: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cats = getCategories();
    if (editId) {
      const existing = cats.find(c => c.id.toString() === editId);
      if (existing) {
        setForm({
          ...existing,
          imagePreview: existing.image,
          image2Preview: existing.image2
        });
      }
    } else {
      setForm(f => ({ ...f, order: cats.length + 1 }));
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImage = async (e, isSecond = false) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      if (isSecond) {
        setForm(f => ({ ...f, image2Preview: b64 }));
      } else {
        setForm(f => ({ ...f, imagePreview: b64 }));
      }
    }
  };

  const removeImage = (isSecond = false) => {
    if (isSecond) {
      setForm(f => ({ ...f, image2: '', image2Preview: '' }));
    } else {
      setForm(f => ({ ...f, image: '', imagePreview: '' }));
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Category Name is required");

    const allCats = getCategories();
    const finalData = {
      ...form,
      image: form.imagePreview || form.image || '/designer_suit_1.png',
      image2: form.image2Preview || form.image2 || '/anarkali_suit.png'
    };

    if (editId) {
      const updated = allCats.map(c => c.id.toString() === editId ? { ...c, ...finalData } : c);
      saveCategories(updated);
    } else {
      const newCat = { ...finalData, id: Date.now() };
      saveCategories([...allCats, newCat]);
    }
    
    notifyWebsite();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.history.pushState(null, '', '/admin/categories');
      setActivePage('categories');
    }, 1000);
  };

  const goBack = () => {
    window.history.pushState(null, '', '/admin/categories');
    setActivePage('categories');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="w-10 h-10 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center text-[#111111] hover:bg-[#F8F4F9] transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{editId ? 'Edit Category' : 'Add New Category'}</h2>
            <p className="text-sm text-[#9E9189] mt-1">Configure layout, details, and imagery for this collection category.</p>
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#111111] hover:bg-[#000000] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#111111]/20 transition-all">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved Successfully' : 'Save Category'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
            <h3 className="text-sm font-bold text-[#111111] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#BCA58A] rounded-full"></span> Basic Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Category Title (e.g. Anarkali)</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Category Name"
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#BCA58A] focus:ring-1 focus:ring-[#BCA58A] transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Subtitle (e.g. The Royal Edit)</label>
                <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Short highlight phrase"
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#BCA58A] focus:ring-1 focus:ring-[#BCA58A] transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Description / Tagline</label>
                <textarea name="tagline" value={form.tagline} onChange={handleChange} placeholder="Detailed description for the category page header..." rows="3"
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#BCA58A] focus:ring-1 focus:ring-[#BCA58A] transition-all resize-none" />
                <p className="text-xs text-[#9E9189] mt-2">This appears on the main hero banner of the category page.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
            <h3 className="text-sm font-bold text-[#111111] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#BCA58A] rounded-full"></span> Media Content
            </h3>
            <p className="text-xs text-[#9E9189] mb-4">Upload high quality portrait images for the dual-image hero section.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Image */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-3">Hero Image 1 (Left)</label>
                <div className="relative aspect-[3/4] bg-[#FAF9F6] border-2 border-dashed border-[#E8DDD0] rounded-xl overflow-hidden group hover:border-[#BCA58A] transition-colors">
                  {form.imagePreview ? (
                    <>
                      <img src={form.imagePreview} alt="Primary" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(false)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                        <ImageIcon size={20} className="text-[#BCA58A]" />
                      </div>
                      <span className="text-sm font-semibold text-[#1A1A1A]">Click to upload</span>
                      <span className="text-xs text-[#9E9189] mt-1">Portrait aspect ratio (3:4)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImage(e, false)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Secondary Image */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-3">Hero Image 2 (Right/Offset)</label>
                <div className="relative aspect-[3/4] bg-[#FAF9F6] border-2 border-dashed border-[#E8DDD0] rounded-xl overflow-hidden group hover:border-[#BCA58A] transition-colors">
                  {form.image2Preview ? (
                    <>
                      <img src={form.image2Preview} alt="Secondary" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(true)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                        <ImageIcon size={20} className="text-[#BCA58A]" />
                      </div>
                      <span className="text-sm font-semibold text-[#1A1A1A]">Click to upload</span>
                      <span className="text-xs text-[#9E9189] mt-1">Portrait aspect ratio (3:4)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImage(e, true)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] shadow-sm">
            <h3 className="text-sm font-bold text-[#111111] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#BCA58A] rounded-full"></span> Status & Ordering
            </h3>
            
            <div className="space-y-5">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E8DDD0] rounded-xl bg-[#FAF9F6] hover:bg-[#FDFBF9] transition-colors">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-[#111111]" />
                <div>
                  <span className="block text-sm font-semibold text-[#1A1A1A]">Active & Visible</span>
                  <span className="block text-xs text-[#9E9189] mt-0.5">Show this category in the navbar and menus</span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Menu Display Order</label>
                <input type="number" min="1" name="order" value={form.order} onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#BCA58A] focus:ring-1 focus:ring-[#BCA58A] transition-all" />
              </div>
            </div>
          </div>

          {/* Quick Preview Hint */}
          <div className="bg-[#111111] rounded-2xl p-6 text-white text-center shadow-lg">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-[#BCA58A]" />
            </div>
            <h4 className="font-semibold mb-2">Live Integration</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Once saved, this category's custom layout will instantly be applied to <br/><span className="text-[#BCA58A] font-bold">/category/{form.name.toLowerCase().replace(/ /g, '-') || '...'}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

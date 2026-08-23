import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Plus, X, Check, Image as ImageIcon } from 'lucide-react';
import { addBoutique, updateBoutique, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const P = '#111111';

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

export default function AddBoutique({ setActivePage, editBoutique = null }) {
  const [formData, setFormData] = useState({
    id: `boutique_${Date.now()}`,
    name: '',
    owner: '',
    established: '',
    experience: '',
    gstVerified: true,
    responseTime: '',
    shippingTime: '',
    returnPolicy: '',
    description: '',
    welcomeMessage: '',
    whatsapp: '',
    contact: '',
    instagramUrl: '',
    address: '',
    totalOrders: '',
    rating: '',
    coverImage: '',
    leftImage: '',
    rightImage: '',
    logo: '',
    story: '',
    type: 'Boutique',
    showInNavbar: true,
    isFeatured: false,
    tags: []
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editBoutique) {
      setFormData(prev => ({ ...prev, ...editBoutique }));
      setIsEditing(true);
    }
  }, [editBoutique]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: val.split(',').map(t => t.trim()).filter(Boolean)
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show loading state could be added here
      const base64 = await fileToBase64(file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            filename: file.name,
            folder: 'boutiques'
          })
        });
        const data = await response.json();
        
        if (data.url) {
          setFormData(prev => ({ ...prev, [field]: data.url }));
        } else {
          console.error("Upload error:", data.error);
          alert('Upload failed: ' + (data.error || 'Unknown error'));
          setFormData(prev => ({ ...prev, [field]: base64 })); // Fallback
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert('Upload failed. Using base64 preview instead.');
        setFormData(prev => ({ ...prev, [field]: base64 })); // Fallback
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    
    setSaving(true);
    
    // Add default values for empty fields if needed
    const dataToSave = {
      ...formData,
      tags: formData.tags.length ? formData.tags : ['Premium Boutique']
    };

    if (isEditing) {
      updateBoutique(dataToSave.id, dataToSave);
    } else {
      addBoutique(dataToSave);
    }
    
    notifyWebsite();
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => { 
      setSaved(false); 
      window.history.pushState(null, '', '/admin/boutiques');
      setActivePage('boutiques'); 
    }, 1500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => { window.history.pushState(null, '', '/admin/boutiques'); setActivePage('boutiques'); }}
          className="w-10 h-10 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-[#E8DDD0] transition-colors shadow-sm">
          <ArrowLeft size={18} className="text-[#6B8C90]" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">{isEditing ? 'Edit Shop/Boutique' : 'Add New Shop/Boutique'}</h2>
          <p className="text-sm text-[#6B8C90]">Fill in details — saved profile will appear on the website instantly</p>
        </div>
        <motion.button type="submit" disabled={saving}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="ml-auto flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-70 transition-all"
          style={{ background: saved ? '#10B981' : `linear-gradient(135deg, ${P}, #111111)`, boxShadow: saved ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px rgba(17,17,17,0.3)` }}>
          {saving ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
           : saved ? <><Check size={16} /> Saved to Website!</>
           : 'Save Profile'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-5">
          <Card title="Basic Details" subtitle="Core information for the shop or boutique">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label required>Name</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Mahalaksmi Silk Store" required />
                </div>
                <div>
                  <Label>Type</Label>
                  <select name="type" value={formData.type || 'Boutique'} onChange={handleChange} 
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none transition-all cursor-pointer">
                    <option value="Boutique">Boutique</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Owner Name(s)</Label>
                  <Input name="owner" value={formData.owner} onChange={handleChange} placeholder="e.g. Rajesh & Priya Sharma" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location / Address</Label>
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="e.g. Model Town, Ludhiana" />
                </div>
                <div>
                  <Label>Tags (Comma Separated)</Label>
                  <Input value={formData.tags?.join(', ') || ''} onChange={handleTagsChange} placeholder="Premium Boutique, Verified Seller" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Brand Assets" subtitle="Visuals used across the directory and shop page">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Logo (URL or Upload)</Label>
                  <div className="flex gap-2">
                    <Input name="logo" value={formData.logo} onChange={handleChange} placeholder="https://..." />
                    <label className="flex-shrink-0 w-12 h-12 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                      <Upload size={16} className="text-[#6B8C90]" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                    </label>
                  </div>
                  {formData.logo && (
                    <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#E8DDD0]">
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Center Hero Image (URL or Upload)</Label>
                  <div className="flex gap-2">
                    <Input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." />
                    <label className="flex-shrink-0 w-12 h-12 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                      <Upload size={16} className="text-[#6B8C90]" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                    </label>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-[#E8DDD0]">
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Left Hero Image</Label>
                  <div className="flex gap-2">
                    <Input name="leftImage" value={formData.leftImage} onChange={handleChange} placeholder="https://..." />
                    <label className="flex-shrink-0 w-12 h-12 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                      <Upload size={16} className="text-[#6B8C90]" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'leftImage')} />
                    </label>
                  </div>
                  {formData.leftImage && (
                    <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-[#E8DDD0]">
                      <img src={formData.leftImage} alt="Left" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Right Hero Image</Label>
                  <div className="flex gap-2">
                    <Input name="rightImage" value={formData.rightImage} onChange={handleChange} placeholder="https://..." />
                    <label className="flex-shrink-0 w-12 h-12 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#E8DDD0] transition-colors">
                      <Upload size={16} className="text-[#6B8C90]" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'rightImage')} />
                    </label>
                  </div>
                  {formData.rightImage && (
                    <div className="mt-2 w-full h-24 rounded-xl overflow-hidden border border-[#E8DDD0]">
                      <img src={formData.rightImage} alt="Right" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Store Text & Stories" subtitle="Content for the boutique profile">
            <div className="space-y-4">
              <div>
                <Label>Short Description (Directory Page)</Label>
                <textarea rows={2} name="description" value={formData.description} onChange={handleChange} placeholder="A brief sentence about the boutique..."
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; }} onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }} />
              </div>
              
              <div>
                <Label>Full Heritage Story (Shop Page Footer)</Label>
                <textarea rows={4} name="story" value={formData.story} onChange={handleChange} placeholder="Founded in 2008..."
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; }} onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }} />
              </div>

              <div>
                <Label>Welcome Message (Shop Page Header)</Label>
                <textarea rows={2} name="welcomeMessage" value={formData.welcomeMessage} onChange={handleChange} placeholder="Welcome to our boutique..."
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all resize-none"
                  onFocus={e => { e.target.style.borderColor = P; }} onBlur={e => { e.target.style.borderColor = '#E8DDD0'; }} />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          <Card title="Metrics & Contact">
            <div className="space-y-4">
              <div>
                <Label>WhatsApp Number(s)</Label>
                <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="e.g. +919876543210, +919876543211 (comma separated)" />
              </div>
              <div>
                <Label>Calling Number(s)</Label>
                <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="e.g. +919876543210, 011-456789 (comma separated)" />
              </div>
              <div>
                <Label>Instagram URL</Label>
                <Input name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rating</Label>
                  <Input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="4.8" />
                </div>
                <div>
                  <Label>Total Orders</Label>
                  <Input name="totalOrders" value={formData.totalOrders} onChange={handleChange} placeholder="e.g. 25,000+" />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Policies & Operations">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Established Year</Label>
                  <Input name="established" value={formData.established} onChange={handleChange} placeholder="e.g. 2008" />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 15+ Years" />
                </div>
              </div>
              <div>
                <Label>Response Time</Label>
                <Input name="responseTime" value={formData.responseTime} onChange={handleChange} placeholder="e.g. Within 1 hour" />
              </div>
              <div>
                <Label>Shipping Time</Label>
                <Input name="shippingTime" value={formData.shippingTime} onChange={handleChange} placeholder="e.g. 3-5 Business Days" />
              </div>
              <div>
                <Label>Return Policy</Label>
                <Input name="returnPolicy" value={formData.returnPolicy} onChange={handleChange} placeholder="e.g. No Returns / All Sales Final" />
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#E8DDD0] rounded-xl bg-[#FAF9F6]">
                  <input type="checkbox" name="gstVerified" checked={formData.gstVerified} onChange={handleChange} className="w-4 h-4 accent-[#111111]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">GST Verified Seller</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#E8DDD0] rounded-xl bg-[#FAF9F6]">
                  <input type="checkbox" name="showInNavbar" checked={formData.showInNavbar} onChange={handleChange} className="w-4 h-4 accent-[#111111]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">Show in Website Navigation (Navbar)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#E8DDD0] rounded-xl bg-[#FAF9F6]">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[#111111]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">Featured in Navbar (Shows Photo - Max 2)</span>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

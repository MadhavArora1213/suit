import { useState, useEffect } from 'react';
import { getBoutiques, addBoutique, updateBoutique, deleteBoutique, fileToBase64 } from '../../utils/adminStore';
import { Pencil, Trash2, Plus, X, Store, Image as ImageIcon } from 'lucide-react';

export default function BoutiquesAdmin() {
  const [boutiques, setBoutiques] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    setBoutiques(getBoutiques());
    const handleUpdate = () => setBoutiques(getBoutiques());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const openForm = (boutique = null) => {
    if (boutique) {
      setFormData(boutique);
    } else {
      setFormData({
        id: `boutique_${Date.now()}`,
        name: '',
        owner: '',
        established: '',
        experience: '',
        gstVerified: true,
        responseTime: 'Within 2 hours',
        shippingTime: '3-5 Business Days',
        returnPolicy: 'No Returns / All Sales Final',
        description: '',
        welcomeMessage: '',
        whatsapp: '',
        contact: '',
        instagramUrl: '',
        address: '',
        location: '', 
        totalOrders: '',
        rating: 4.8,
        coverImage: '',
        logo: '',
        story: '',
        tags: []
      });
    }
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !boutiques.some(b => b.id === formData.id);
    if (isNew) {
      await addBoutique(formData);
    } else {
      await updateBoutique(formData.id, formData);
    }
    setBoutiques(getBoutiques());
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this boutique?")) {
      await deleteBoutique(id);
      setBoutiques(getBoutiques());
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, [field]: base64 });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#111111]">Boutiques Manager</h1>
        <button onClick={() => openForm()} className="bg-[#111111] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#BCA58A] transition cursor-pointer">
          <Plus size={16} /> Add Boutique
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium">Boutique</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boutiques.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    {b.logo ? <img src={b.logo} className="w-full h-full object-cover" /> : <Store className="m-auto text-gray-400 mt-2" size={20} />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.owner || 'N/A'}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{b.location || b.address || 'N/A'}</td>
                <td className="p-4 text-gray-600">{b.rating}</td>
                <td className="p-4 text-gray-600">{b.totalOrders || '0'}</td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <button onClick={() => openForm(b)} className="p-2 text-gray-500 hover:text-[#BCA58A] cursor-pointer"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-gray-500 hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {boutiques.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-500">
                  <Store size={32} className="mx-auto mb-3 text-gray-300" />
                  No boutiques added yet. Click "Add Boutique" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-8 relative my-8 shadow-2xl">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-full transition cursor-pointer">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-light mb-8 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {formData.name ? 'Edit Boutique Profile' : 'New Boutique Profile'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Boutique Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. Badshah Designer Fabrics" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Owner Name</label>
                  <input value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. Rajesh & Priya Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Short Location (Directory View)</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. Ludhiana, Punjab" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Full Address (Shop View)</label>
                  <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. Guru Nanak Nagar, Model Town..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">WhatsApp Number</label>
                  <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. +919876543210" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Rating</label>
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="4.8" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Total Orders</label>
                  <input value={formData.totalOrders} onChange={e => setFormData({...formData, totalOrders: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. 25,000+" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Established Year</label>
                  <input value={formData.established} onChange={e => setFormData({...formData, established: e.target.value})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="e.g. 2008" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Tags (comma separated)</label>
                  <input value={formData.tags?.join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t=>t.trim())})} className="w-full border-b border-gray-200 focus:border-[#BCA58A] outline-none py-2 text-sm transition" placeholder="Premium Boutique, Verified Seller" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Logo (URL or Upload)</label>
                  <div className="flex gap-2">
                    <input value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="https://..." />
                    <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border border-gray-200 flex items-center justify-center transition">
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo')} />
                      <ImageIcon size={18} className="text-gray-500" />
                    </label>
                  </div>
                  {formData.logo && (
                    <div className="mt-3 w-16 h-16 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
                      <img src={formData.logo} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Cover Image (URL or Upload)</label>
                  <div className="flex gap-2">
                    <input value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm" placeholder="https://..." />
                    <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-2.5 rounded-lg border border-gray-200 flex items-center justify-center transition">
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'coverImage')} />
                      <ImageIcon size={18} className="text-gray-500" />
                    </label>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-3 h-24 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <img src={formData.coverImage} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Short Description (Directory Page)</label>
                  <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#BCA58A] outline-none" placeholder="A brief sentence about the boutique..." />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Full Heritage Story (Shop Page Footer)</label>
                  <textarea rows="4" value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#BCA58A] outline-none" placeholder="Detailed history, craftsmanship, and legacy..." />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 bg-[#111111] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#BCA58A] transition shadow-lg cursor-pointer">
                  Save Boutique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getCollections, saveCollections, getCollectionTags, fileToBase64, notifyWebsite } from '../../utils/adminStore';

export default function AddCollection({ setActivePage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const emptyForm = {
    id: '', title: '', subtitle: '', desc: '', story: '', image: '', imagePreview: '', 
    accent: '#BCA58A', category: 'All', tag: 'Seasonal', order: 1, active: true, isFeaturedMenu: false
  };
  
  const [formData, setFormData] = useState(emptyForm);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    setAvailableTags(getCollectionTags().filter(t => t.active).sort((a,b) => a.order - b.order));
    
    const editData = localStorage.getItem('editCollectionData');
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData({
        ...parsed,
        imagePreview: parsed.image || ''
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setFormData(emptyForm);
    }
  }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setFormData({ ...formData, image: base64, imagePreview: base64 });
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '', imagePreview: '' });
  };

  const handleSave = () => {
    if (!formData.title || !formData.id) {
      alert("Please provide at least an ID and a Title.");
      return;
    }

    const dataToSave = { ...formData };
    delete dataToSave.imagePreview; // don't need to save preview

    let collections = getCollections();

    if (isEditing) {
      collections = collections.map(c => c.id === dataToSave.id ? dataToSave : c);
    } else {
      // check if ID exists
      if (collections.some(c => c.id === dataToSave.id)) {
        alert("A collection with this ID already exists. Please choose a different ID.");
        return;
      }
      collections.push(dataToSave);
    }

    saveCollections(collections);
    notifyWebsite();

    setSuccessMsg('Collection saved successfully!');
    setTimeout(() => {
      setActivePage('collections');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActivePage('collections')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Collection' : 'Add New Collection'}</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details below to create or update a collection.</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#111111] text-white px-6 py-2.5 rounded-md hover:bg-black transition-colors font-medium cursor-pointer"
        >
          <Save size={18} />
          {isEditing ? 'Update Collection' : 'Save Collection'}
        </button>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 border border-green-100"
          >
            <Check size={18} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-8">
          
          {/* Main Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="w-1 h-5 bg-[#BCA58A] rounded-full"></span> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection ID (URL Slug) *</label>
                <input 
                  type="text" 
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
                  placeholder="e.g., summer-edit, bridal"
                  disabled={isEditing}
                />
                <p className="text-xs text-gray-500 mt-1">Used in URL: /collection/summer-edit (Cannot be changed later)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
                  placeholder="e.g., Summer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
                  placeholder="e.g., Collection or Edit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Group)</label>
                <select 
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="">Select a tag...</option>
                  {availableTags.map(tag => (
                    <option key={tag.id} value={tag.name}>{tag.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="w-1 h-5 bg-[#BCA58A] rounded-full"></span> Content
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Description</label>
                <textarea 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 h-20 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none resize-none"
                  placeholder="Short description for the collection card..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Story / Editorial Text</label>
                <textarea 
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none resize-none"
                  placeholder="Long detailed story for the collection detail page hero section..."
                />
              </div>
            </div>
          </div>

          {/* Styling & Mapping */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="w-1 h-5 bg-[#BCA58A] rounded-full"></span> Styling & Mapping
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={formData.accent}
                    onChange={(e) => setFormData({...formData, accent: e.target.value})}
                    className="h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={formData.accent}
                    onChange={(e) => setFormData({...formData, accent: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none uppercase font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Category Filter</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none cursor-pointer"
                >
                  <option value="All">All Products (Filtered internally)</option>
                  <option value="Anarkali">Anarkali</option>
                  <option value="Patiala">Patiala</option>
                  <option value="Sharara">Sharara</option>
                  <option value="Chikankari">Chikankari</option>
                  <option value="Banarasi">Banarasi</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Casual">Casual</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Which products to show? Or keep 'All' and map by ID.</p>
              </div>
            </div>
          </div>

          {/* Image & Visibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <span className="w-1 h-5 bg-[#BCA58A] rounded-full"></span> Media & Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                {formData.imagePreview ? (
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-[4/5] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      onChange={handleImage}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">Portrait aspect ratio recommended</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input 
                    type="number" 
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.active ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">Collection Visibility</span>
                      <span className="text-xs text-gray-500">{formData.active ? 'Visible on website' : 'Hidden from website'}</span>
                    </div>
                  </label>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={formData.isFeaturedMenu}
                        onChange={(e) => setFormData({...formData, isFeaturedMenu: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isFeaturedMenu ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isFeaturedMenu ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">Feature in Megamenu?</span>
                      <span className="text-xs text-gray-500">{formData.isFeaturedMenu ? 'Will show as large image in Nav dropdown' : 'Standard collection display'}</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

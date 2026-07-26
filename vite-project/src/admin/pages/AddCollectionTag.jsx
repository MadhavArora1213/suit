import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Save, ArrowLeft } from 'lucide-react';
import { getCollectionTags, saveCollectionTags, notifyWebsite } from '../../utils/adminStore';

export default function AddCollectionTag({ setActivePage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const emptyForm = {
    id: '', name: '', icon: '🌟', order: 1, active: true
  };
  
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const editData = localStorage.getItem('editCollectionTagData');
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData(parsed);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setFormData(emptyForm);
    }
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.id) {
      alert("Please provide at least an ID and a Name.");
      return;
    }

    const dataToSave = { ...formData };
    let tags = getCollectionTags();

    if (isEditing) {
      tags = tags.map(t => t.id === dataToSave.id ? dataToSave : t);
    } else {
      if (tags.some(t => t.id === dataToSave.id)) {
        alert("A tag with this ID already exists. Please choose a different ID.");
        return;
      }
      tags.push(dataToSave);
    }

    saveCollectionTags(tags);
    notifyWebsite();

    setSuccessMsg('Tag saved successfully!');
    setTimeout(() => {
      setActivePage('collection-tags');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActivePage('collection-tags')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Tag' : 'Add New Tag'}</h2>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#111111] text-white px-6 py-2.5 rounded-md hover:bg-black transition-colors font-medium cursor-pointer"
        >
          <Save size={18} />
          {isEditing ? 'Update Tag' : 'Save Tag'}
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
        <div className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag ID (Value) *</label>
            <input 
              type="text" 
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
              placeholder="e.g., seasonal, by-style"
              disabled={isEditing}
            />
            <p className="text-xs text-gray-500 mt-1">Used internally to link collections. Cannot be changed later.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
              placeholder="e.g., Seasonal, By Style"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji/Symbol)</label>
            <input 
              type="text" 
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              className="w-24 text-center text-xl border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
              placeholder="e.g., ☀"
              maxLength="3"
            />
            <p className="text-xs text-gray-500 mt-1">A short emoji or symbol used in the UI.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input 
                type="number" 
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#BCA58A] focus:border-transparent outline-none"
                min="1"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer mt-5">
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
                  <span className="text-sm font-medium text-gray-900 block">Tag Visibility</span>
                  <span className="text-xs text-gray-500">{formData.active ? 'Active' : 'Hidden'}</span>
                </div>
              </label>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

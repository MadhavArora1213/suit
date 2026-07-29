import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getCollectionTags, saveCollectionTags } from '../../utils/adminStore';

export default function CollectionTagsAdmin({ setActivePage }) {
  const [tags, setTags] = useState([]);

  const loadData = () => {
    const data = getCollectionTags();
    data.sort((a, b) => a.order - b.order);
    setTags(data);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('admin-data-updated', loadData);
    return () => window.removeEventListener('admin-data-updated', loadData);
  }, []);

  const handleToggleActive = (id) => {
    const updated = tags.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    );
    saveCollectionTags(updated);
    loadData();
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this tag?')) {
      const updated = tags.filter(t => t.id !== id);
      saveCollectionTags(updated);
      loadData();
    }
  };

  const handleEdit = (t) => {
    localStorage.setItem('editCollectionTagData', JSON.stringify(t));
    setActivePage('edit-collection-tag');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collection Tags</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage the tags used to group collections.</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('editCollectionTagData');
            setActivePage('add-collection-tag');
          }}
          className="flex items-center justify-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-md hover:bg-black transition-colors text-sm"
        >
          <Plus size={16} /> Add Tag
        </button>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">{tag.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{tag.name}</p>
                <p className="text-xs text-gray-500 truncate">{tag.id}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(tag)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(tag.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Order: {tag.order}</span>
              <button onClick={() => handleToggleActive(tag.id)} className={`px-2 py-0.5 rounded-full font-medium ${tag.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {tag.active ? 'Active' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">No tags found.</div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="p-4 w-16">Icon</th>
              <th className="p-4">Name</th>
              <th className="p-4">ID / Value</th>
              <th className="p-4">Order</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.tr 
                  key={tag.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 text-xl text-center border-r border-gray-100 bg-gray-50/30">
                    {tag.icon}
                  </td>
                  <td className="p-4 font-semibold text-gray-900">
                    {tag.name}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {tag.id}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {tag.order}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(tag.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        tag.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {tag.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tag)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tag.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {tags.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No tags found. Click "Add Tag" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

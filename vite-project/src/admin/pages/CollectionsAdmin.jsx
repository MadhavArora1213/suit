import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getCollections, saveCollections } from '../../utils/adminStore';

export default function CollectionsAdmin({ setActivePage }) {
  const [collections, setCollections] = useState([]);

  const loadData = () => {
    const data = getCollections();
    data.sort((a, b) => a.order - b.order);
    setCollections(data);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('admin-data-updated', loadData);
    return () => window.removeEventListener('admin-data-updated', loadData);
  }, []);

  const handleToggleActive = (id) => {
    const updated = collections.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    );
    saveCollections(updated);
    loadData();
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this collection?')) {
      const updated = collections.filter(c => c.id !== id);
      saveCollections(updated);
      loadData();
    }
  };

  const handleEdit = (c) => {
    localStorage.setItem('editCollectionData', JSON.stringify(c));
    setActivePage('edit-collection');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your curated collections and editorial edits.</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('editCollectionData');
            setActivePage('add-collection');
          }}
          className="flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
        >
          <Plus size={18} /> Add Collection
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="p-4">Image</th>
              <th className="p-4">Title & Subtitle</th>
              <th className="p-4">Tag</th>
              <th className="p-4">Order</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {collections.map((col) => (
                <motion.tr 
                  key={col.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 w-20">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {col.image ? (
                        <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{col.title}</p>
                    <p className="text-xs text-gray-500 italic">{col.subtitle}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase tracking-wider">
                      {col.tag}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {col.order}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleActive(col.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        col.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {col.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {col.active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(col)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(col.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {collections.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No collections found. Click "Add Collection" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

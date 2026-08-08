import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { getCollections, saveCollections } from '../../utils/adminStore';

const defaultCollections = [
  { id: 'wedding', title: 'Wedding Collection', subtitle: 'Bridal Luxury Redefined', desc: 'Exquisite bridal and wedding wear featuring heavy embroidery, zardozi work, and rich fabrics perfect for your special day.', story: '', image: '', accent: '#D4AF37', category: 'All', tag: 'Seasonal', order: 1, active: true, isFeaturedMenu: false },
  { id: 'festive', title: 'Festive Collection', subtitle: 'Celebrate in Style', desc: 'Stunning festive wear designed for celebrations, festivals, and special occasions with vibrant colors and premium craftsmanship.', story: '', image: '', accent: '#E85D75', category: 'All', tag: 'Seasonal', order: 2, active: true, isFeaturedMenu: false },
  { id: 'daily-wear', title: 'Daily Wear Collection', subtitle: 'Everyday Luxe Essentials', desc: 'Comfortable yet elegant ethnic wear for everyday use. Lightweight fabrics and easy-care designs for the modern woman.', story: '', image: '', accent: '#6B8C90', category: 'All', tag: 'Everyday', order: 3, active: true, isFeaturedMenu: false },
  { id: 'cotton-suits', title: 'Cotton Suits', subtitle: 'Pure Comfort, Pure Elegance', desc: 'Handpicked cotton suits featuring breathable fabrics, block prints, and traditional Indian craftsmanship for all seasons.', story: '', image: '', accent: '#BCA58A', category: 'All', tag: 'By Fabric', order: 4, active: true, isFeaturedMenu: false },
  { id: 'pakistani', title: 'Pakistani Collection', subtitle: 'Cross-Border Elegance', desc: 'Premium Pakistani suits with straight cuts, digital prints, and contemporary silhouettes that define modern ethnic fashion.', story: '', image: '', accent: '#8B5CF6', category: 'Pakistani', tag: 'By Style', order: 5, active: true, isFeaturedMenu: false },
  { id: 'readymade', title: 'Readymade Collection', subtitle: 'Ready to Wear, Ready to Shine', desc: 'Beautifully tailored readymade suits that offer perfect fit and finish. No tailoring needed - just wear and dazzle.', story: '', image: '', accent: '#F59E0B', category: 'All', tag: 'By Type', order: 6, active: true, isFeaturedMenu: false },
];

export default function CollectionsAdmin({ setActivePage, onEditCollection }) {
  const [collections, setCollections] = useState([]);
  const [seeding, setSeeding] = useState(false);

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

  const handleSeedDefaults = async () => {
    if (!window.confirm('Add 6 default collections? Existing collections will not be affected.')) return;
    setSeeding(true);
    try {
      const existing = getCollections();
      const existingIds = new Set(existing.map(c => c.id));
      const newCollections = defaultCollections.filter(c => !existingIds.has(c.id));
      if (newCollections.length === 0) {
        alert('All default collections already exist!');
        setSeeding(false);
        return;
      }
      saveCollections([...existing, ...newCollections]);
      alert(`Added ${newCollections.length} collections!`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSeeding(false);
  };

  const handleEdit = (c) => {
    onEditCollection(c);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collections</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage your curated collections and editorial edits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center justify-center gap-2 bg-[#BCA58A] text-white px-4 py-2 rounded-md hover:bg-[#A8937A] transition-colors text-sm disabled:opacity-50"
          >
            <Sparkles size={16} /> {seeding ? 'Adding...' : 'Add Defaults'}
          </button>
          <button
            onClick={() => {
              setActivePage('add-collection');
            }}
            className="flex items-center justify-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-md hover:bg-black transition-colors text-sm"
          >
            <Plus size={16} /> Add Collection
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {collections.map((col) => (
          <div key={col.id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                {col.image ? (
                  <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{col.title}</p>
                <p className="text-xs text-gray-500 italic truncate">{col.subtitle}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleEdit(col)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(col.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium uppercase">{col.tag}</span>
              <span className="text-gray-500">Order: {col.order}</span>
              <button onClick={() => handleToggleActive(col.id)} className={`px-2 py-1 rounded-full font-medium ${col.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {col.active ? 'Active' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
        {collections.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">No collections found.</div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

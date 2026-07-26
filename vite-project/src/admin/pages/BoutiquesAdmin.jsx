import { useState, useEffect } from 'react';
import { getBoutiques, addBoutique, updateBoutique, deleteBoutique, fileToBase64 } from '../../utils/adminStore';
import { Pencil, Trash2, Plus, X, Store, Image as ImageIcon } from 'lucide-react';

export default function BoutiquesAdmin({ setActivePage }) {
  const [boutiques, setBoutiques] = useState([]);

  useEffect(() => {
    setBoutiques(getBoutiques());
    const handleUpdate = () => setBoutiques(getBoutiques());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const handleAdd = () => {
    localStorage.removeItem('admin_edit_boutique');
    window.history.pushState(null, '', '/admin/add-boutique');
    setActivePage('add-boutique');
  };

  const handleEdit = (boutique) => {
    localStorage.setItem('admin_edit_boutique', JSON.stringify(boutique));
    window.history.pushState(null, '', '/admin/edit-boutique');
    setActivePage('edit-boutique');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this boutique?")) {
      await deleteBoutique(id);
      setBoutiques(getBoutiques());
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-[#111111]">Shops & Boutiques Manager</h1>
        <button onClick={handleAdd} className="bg-[#111111] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#BCA58A] transition cursor-pointer">
          <Plus size={16} /> Add Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Type</th>
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
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${b.type === 'Shop' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-[#BCA58A]/10 text-[#BCA58A] border border-[#BCA58A]/20'}`}>
                    {b.type || 'Boutique'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{b.location || b.address || 'N/A'}</td>
                <td className="p-4 text-gray-600">{b.rating}</td>
                <td className="p-4 text-gray-600">{b.totalOrders || '0'}</td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(b)} className="p-2 text-gray-500 hover:text-[#BCA58A] cursor-pointer"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-gray-500 hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {boutiques.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-500">
                  <Store size={32} className="mx-auto mb-3 text-gray-300" />
                  No profiles added yet. Click "Add Profile" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

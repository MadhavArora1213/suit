import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Star, RefreshCw } from 'lucide-react';
import { getProducts, deleteProduct as storeDelete, notifyWebsite } from '../../utils/adminStore';

const staticProducts = [
  { id: 't1', name: 'Embroidered Silk Suit Set', price: '₹4,299', boutique: 'Kala Mandir', badge: 'Silk Blend', collection: 'Trending', type: 'Anarkali', stock: 12, rating: 4.8, image: '/designer_suit_1.png' },
  { id: 't2', name: 'Chanderi Salwar Suit Set', price: '₹3,899', boutique: 'Zari Heritage', badge: 'Handloom', collection: 'Trending', type: 'Patiala', stock: 8, rating: 4.6, image: '/cotton_suit.png' },
  { id: 't3', name: 'Designer Angrakha Suit Set', price: '₹5,499', boutique: 'Gulabo Jaipur', badge: 'Premium', collection: 'Trending', type: 'Sharara', stock: 5, rating: 4.9, image: '/sharara_suit.png' },
  { id: 't4', name: 'Pakistani Straight Suit Set', price: '₹4,799', boutique: 'Nazraana', badge: 'Verified', collection: 'New Arrivals', type: 'Pakistani', stock: 14, rating: 4.7, image: '/pakistani_suit.png' },
  { id: 'b1', name: 'Velvet Embroidered Suit Set', price: '₹8,999', boutique: 'Vastra', badge: 'Hot Seller', collection: 'Best Sellers', type: 'Anarkali', stock: 3, rating: 4.9, image: '/banarasi_suit.png' },
  { id: 'b2', name: 'Chikankari Handloom Suit Set', price: '₹7,499', boutique: 'Awadh Kraft', badge: 'Artisanal', collection: 'Best Sellers', type: 'Chikankari', stock: 7, rating: 4.8, image: '/chikankari_suit.png' },
  { id: 'f1', name: 'Royal Sharara Suit Set', price: '₹11,499', boutique: 'Rajputana', badge: 'Grand Wedding', collection: 'Festive Edit', type: 'Sharara', stock: 2, rating: 5.0, image: '/sharara_suit.png' },
  { id: 'f3', name: 'Raw Silk Anarkali Suit Set', price: '₹13,999', boutique: 'Royal Heritage', badge: 'Exclusive', collection: 'Festive Edit', type: 'Anarkali', stock: 1, rating: 4.9, image: '/anarkali_suit.png' },
];

export default function Products({ setActivePage }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  const loadAll = () => {
    const adminProducts = getProducts().map(p => ({ ...p, category: p.collection, source: 'admin' }));
    const adminIds = new Set(adminProducts.map(p => p.id));
    return [...adminProducts, ...staticProducts.filter(p => !adminIds.has(p.id))];
  };

  const [products, setProducts] = useState(loadAll);

  useEffect(() => {
    const handler = () => setProducts(loadAll());
    window.addEventListener('admin-data-updated', handler);
    return () => window.removeEventListener('admin-data-updated', handler);
  }, []);

  const categories = ['All', 'Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit'];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.boutique || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat || p.collection === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = (id) => {
    storeDelete(id);
    notifyWebsite();
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Products</h2>
          <p className="text-sm text-[#9E9189]">{filtered.length} products found</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setActivePage('add-product')}
          className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#111111]/25 hover:shadow-lg transition-shadow"
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
          <input
            type="text"
            placeholder="Search products or boutique..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#B0A99F] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.1)] transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#F8F4F9] text-[#6B6B6B] hover:bg-[#F0EAE2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden group hover:shadow-lg hover:shadow-[#111111]/10 hover:border-[#111111]/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 bg-[#F8F4F9] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#111111] text-[11px] font-bold tracking-wider px-2 py-1 rounded-lg border border-[#111111]/20">
                  {product.badge}
                </span>
                <span className={`absolute top-2 right-2 text-[11px] font-bold px-2 py-1 rounded-lg ${product.stock <= 3 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {product.stock <= 3 ? `Low: ${product.stock}` : `${product.stock} in stock`}
                </span>
                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1A1A1A] shadow-md">
                    <Eye size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePage('add-product')}
                    className="w-9 h-9 bg-[#111111] rounded-full flex items-center justify-center text-white shadow-md">
                    <Edit2 size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteId(product.id)}
                    className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-[#111111] font-semibold tracking-wider uppercase mb-1">{product.boutique} · {product.type}</p>
                <h4 className="text-sm font-semibold text-[#1A1A1A] leading-snug mb-2 line-clamp-2">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-[#111111]">{product.price}</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-[#6B6B6B]">{product.rating}</span>
                  </div>
                </div>
                <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8DDD0] text-[#111111]">{product.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteId(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-7 max-w-sm w-full mx-4 shadow-2xl border border-[#E8DDD0]"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-center text-[#1A1A1A] mb-2">Delete Product?</h3>
              <p className="text-sm text-center text-[#9E9189] mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Star, MousePointer, TrendingUp, PackageX, X } from 'lucide-react';
import { getProducts, deleteProduct as storeDelete, bulkDeleteProducts, bulkUpdateProducts, notifyWebsite } from '../../utils/adminStore';

export default function Products({ setActivePage, onEditProduct }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(null); // { type: 'single' | 'delete' | 'oos', id? }

  const loadAll = () => {
    return getProducts().map(p => ({ ...p, source: 'admin' }));
  };

  const [products, setProducts] = useState(loadAll);

  useEffect(() => {
    const handler = () => setProducts(loadAll());
    window.addEventListener('admin-data-updated', handler);
    return () => window.removeEventListener('admin-data-updated', handler);
  }, []);

  const categories = ['All', 'Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit'];

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.boutique || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat || p.collection === filterCat;
    return matchSearch && matchCat;
  });

  const visibleIds = filtered.map(p => p.id);
  // Ignore ids whose product no longer exists (deleted elsewhere / filtered out)
  const selectedIds = selected.filter(id => products.some(p => p.id === id));
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  const toggleSelect = (id) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleSelectAllVisible = () => {
    setSelected(prev => (allVisibleSelected
      ? prev.filter(id => !visibleIds.includes(id))
      : Array.from(new Set([...prev, ...visibleIds]))));
  };

  const selectEveryProduct = () => setSelected(products.map(p => p.id));

  const clearSelection = () => setSelected([]);

  const handleDelete = (id) => {
    storeDelete(id);
    notifyWebsite();
    setProducts(prev => prev.filter(p => p.id !== id));
    setConfirm(null);
  };

  const handleBulkDelete = () => {
    const ids = selectedIds.slice();
    bulkDeleteProducts(ids);
    notifyWebsite();
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    setSelected([]);
    setConfirm(null);
  };

  const zeroStock = (p) => {
    const stockQty = (p.stockQty && typeof p.stockQty === 'object' && Object.keys(p.stockQty).length > 0)
      ? Object.keys(p.stockQty).reduce((acc, k) => { acc[k] = 0; return acc; }, {})
      : (p.stockQty || {});
    return { stock: 0, stockQty, manualOOS: true };
  };

  const handleBulkOutOfStock = () => {
    const ids = selectedIds.slice();
    bulkUpdateProducts(ids, zeroStock);
    notifyWebsite();
    setProducts(prev => prev.map(p => (ids.includes(p.id) ? { ...p, ...zeroStock(p) } : p)));
    setConfirm(null);
    setSelected([]);
  };

  // Analytics totals
  const totalViews = products.reduce((acc, p) => acc + (p.viewsCount || p.views || 0), 0);
  const totalClicks = products.reduce((acc, p) => acc + (p.clicksCount || p.clicks || 0), 0);
  const mostClickedProduct = [...products].sort((a, b) => (b.clicksCount || b.clicks || 0) - (a.clicksCount || a.clicks || 0))[0];

  // Confirm modal copy
  const confirmIsOOS = confirm?.type === 'oos';
  const confirmIsSingle = confirm?.type === 'single';
  const confirmCount = selectedIds.length;
  const confirmNoun = confirmCount === 1 ? 'Product' : 'Products';
  const confirmTitle = confirmIsSingle
    ? 'Delete Product?'
    : confirmIsOOS
      ? `Mark ${confirmCount} ${confirmNoun} Out of Stock?`
      : `Delete ${confirmCount} ${confirmNoun}?`;
  const confirmDesc = confirmIsSingle
    ? 'This action cannot be undone.'
    : confirmIsOOS
      ? 'Stock will be set to 0 for every size on the selected products. You can restore stock later by editing each product.'
      : `This will permanently remove ${confirmCount} ${confirmNoun.toLowerCase()} from your store. This action cannot be undone.`;
  const confirmCta = confirmIsSingle
    ? 'Delete'
    : confirmIsOOS ? 'Mark Out of Stock' : `Delete ${confirmCount}`;
  const runConfirm = () => {
    if (!confirm) return;
    if (confirmIsSingle) handleDelete(confirm.id);
    else if (confirmIsOOS) handleBulkOutOfStock();
    else handleBulkDelete();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Products</h2>
          <p className="text-xs sm:text-sm text-[#9E9189]">{filtered.length} products found</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setActivePage('add-product')}
          className="flex items-center justify-center gap-2 bg-[#111111] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-[#111111]/25 hover:shadow-lg transition-shadow w-full sm:w-auto cursor-pointer"
        >
          <Plus size={14} /> Add Product
        </motion.button>
      </div>

      {/* Analytics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8DDD0] flex items-center justify-center text-[#111111]">
            <MousePointer size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#9E9189] tracking-wider">Total Product Clicks</p>
            <p className="text-xl font-bold text-[#111111]">{totalClicks.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8DDD0] flex items-center justify-center text-[#8B2252]">
            <Eye size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#9E9189] tracking-wider">Total Detail Views</p>
            <p className="text-xl font-bold text-[#111111]">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8DDD0] flex items-center justify-center text-[#D4AF37]">
            <TrendingUp size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-[#9E9189] tracking-wider">Top Clicked Product</p>
            <p className="text-xs font-bold text-[#111111] truncate">{mostClickedProduct?.name || 'N/A'}</p>
            <p className="text-[10px] text-[#8B2252] font-semibold">{mostClickedProduct ? `${mostClickedProduct.clicksCount || mostClickedProduct.clicks || 0} clicks` : '0 clicks'}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]" />
          <input
            type="text"
            placeholder="Search products or boutique..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#B0A99F] focus:outline-none focus:border-[#111111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.1)] transition-all"
          />
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
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

      {/* Bulk Actions */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="checkbox"
            id="bulk-select-all"
            checked={allVisibleSelected}
            onChange={toggleSelectAllVisible}
            disabled={filtered.length === 0}
            className="w-4 h-4 accent-[#111111] cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="bulk-select-all" className="text-xs font-semibold text-[#6B6B6B] cursor-pointer select-none">
            Select all ({filtered.length})
          </label>
          {products.length > filtered.length && (
            <button
              type="button"
              onClick={selectEveryProduct}
              className="text-[11px] font-semibold text-[#8B2252] underline underline-offset-2 hover:text-[#111111] cursor-pointer"
            >
              All {products.length} products
            </button>
          )}
        </div>

        <div className="sm:ml-auto">
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-[11px] font-bold text-white bg-[#111111] px-2.5 py-1.5 rounded-lg">
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => setConfirm({ type: 'oos' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#FFF7E6] border border-[#E8C77A] text-[#8A6100] hover:bg-[#FDECC2] transition-colors cursor-pointer"
                >
                  <PackageX size={13} /> Mark Out of Stock
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm({ type: 'delete' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} /> Delete
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors cursor-pointer"
                >
                  <X size={13} /> Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => {
            const clicks = product.clicksCount || product.clicks || 0;
            const views = product.viewsCount || product.views || 0;
            const ctr = views > 0 ? ((clicks / views) * 100).toFixed(0) : (clicks > 0 ? 100 : 0);
            const isSelected = selectedIds.includes(product.id);

            return (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className={`bg-white rounded-2xl border overflow-hidden group transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#111111] shadow-lg shadow-[#111111]/15 ring-2 ring-[#111111]/20'
                    : 'border-[#E8DDD0] hover:shadow-lg hover:shadow-[#111111]/10 hover:border-[#111111]/30'
                }`}
              >
                <div>
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 bg-[#F8F4F9] overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#9E9189]">No Image</div>
                    )}
                    <span className="absolute top-2 left-9 bg-white/90 backdrop-blur-sm text-[#111111] text-[9px] sm:text-[11px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-[#111111]/20">
                      {product.badge}
                    </span>
                    {(() => {
                      let isOOS = false;
                      if (product.stock !== undefined) {
                        isOOS = Number(product.stock) <= 0;
                      } else if (product.stockQty && typeof product.stockQty === 'object' && Object.keys(product.stockQty).length > 0) {
                        const vals = Object.values(product.stockQty);
                        isOOS = vals.every(v => !v || Number(v) <= 0);
                      }
                      return (
                        <span className={`absolute top-2 right-2 text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${
                          isOOS ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {isOOS ? 'Out of Stock' : 'In Stock'}
                        </span>
                      );
                    })()}

                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(`/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`, '_blank')}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#1A1A1A] shadow-md cursor-pointer" title="View Storefront Link">
                        <Eye size={15} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => onEditProduct(product)}
                        className="w-9 h-9 bg-[#111111] rounded-full flex items-center justify-center text-white shadow-md cursor-pointer" title="Edit Product">
                        <Edit2 size={15} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setConfirm({ type: 'single', id: product.id })}
                        className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer" title="Delete Product">
                        <Trash2 size={15} />
                      </motion.button>
                    </div>

                    {/* Selection checkbox */}
                    <span className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-sm rounded-md p-1 border border-[#111111]/15 shadow-sm">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(product.id)}
                        onClick={e => e.stopPropagation()}
                        aria-label={`Select ${product.name}`}
                        className="block w-4 h-4 accent-[#111111] cursor-pointer"
                      />
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] sm:text-xs text-[#111111] font-semibold tracking-wider uppercase mb-1">{product.boutique} · {product.type}</p>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-snug mb-1.5 sm:mb-2 line-clamp-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm sm:text-base font-bold text-[#111111]">{product.price}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] sm:text-xs text-[#6B6B6B]">{product.rating}</span>
                      </div>
                    </div>
                    <span className="inline-block mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8DDD0] text-[#111111]">{product.category || product.collection}</span>
                  </div>
                </div>

                {/* Tracking Analytics Footer Badge */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-[#FAF9F6] border-t border-[#E8DDD0] flex items-center justify-between text-[11px] font-semibold text-[#4A4A4A]">
                  <div className="flex items-center gap-1.5" title="Link Clicks">
                    <MousePointer size={12} className="text-[#8B2252]" />
                    <span>{clicks} Clicks</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Page Views">
                    <Eye size={12} className="text-[#111111]" />
                    <span>{views} Views</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#111111] text-white px-2 py-0.5 rounded-full text-[9px]" title="Click Through Rate">
                    <span>{ctr}% CTR</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Confirm Modal (single + bulk) */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirm(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-7 max-w-sm w-full mx-4 shadow-2xl border border-[#E8DDD0]"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmIsOOS ? 'bg-amber-100' : 'bg-red-100'}`}>
                {confirmIsOOS ? <PackageX size={22} className="text-amber-600" /> : <Trash2 size={22} className="text-red-500" />}
              </div>
              <h3 className="text-lg font-semibold text-center text-[#1A1A1A] mb-2">{confirmTitle}</h3>
              <p className="text-sm text-center text-[#9E9189] mb-6">{confirmDesc}</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(null)} className="flex-1 py-2.5 border border-[#E8DDD0] rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-[#F8F4F9] transition-colors cursor-pointer">Cancel</button>
                <button
                  onClick={runConfirm}
                  className={`flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    confirmIsOOS ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {confirmCta}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

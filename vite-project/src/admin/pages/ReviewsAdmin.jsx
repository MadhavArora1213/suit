import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Trash2, ShieldCheck, ChevronDown, Check, X, Search, Filter } from 'lucide-react';
import { getAllReviews, deleteReview, getProducts } from '../../utils/adminStore';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    const fetchReviews = () => {
      setReviews(getAllReviews());
      setProducts(getProducts());
    };
    fetchReviews();
    window.addEventListener('admin-data-updated', fetchReviews);
    return () => window.removeEventListener('admin-data-updated', fetchReviews);
  }, []);

  const handleDelete = async (productId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(productId, reviewId);
      setReviews(getAllReviews());
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.review || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getProductName(r.productId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 0 || Math.round(r.rating) === filterRating;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Product Reviews</h1>
          <p className="text-sm text-[#9E9189]">Manage and moderate customer reviews and uploaded media.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-[#E8DDD0]/50 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search reviews by name, content or product..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]/10 transition-all" />
        </div>
        <div className="flex gap-2">
          {[0, 5, 4, 3, 2, 1].map(star => (
            <button key={star} onClick={() => setFilterRating(star)}
              className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                filterRating === star ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#FAF9F6] text-[#1A1A1A] border-[#E8DDD0] hover:border-gray-300'
              }`}>
              {star === 0 ? 'All' : <span className="flex items-center gap-1">{star} <Star size={14} className={filterRating === star ? 'fill-current text-white' : 'fill-current text-[#f5a623]'} /></span>}
            </button>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#E8DDD0]/50 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-4">
            <MessageCircle size={32} className="text-[#9E9189]" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No reviews found</h3>
          <p className="text-[#9E9189] text-sm">There are no reviews matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map(r => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-[#E8DDD0]/50 shadow-sm flex flex-col relative group">
              <button onClick={() => handleDelete(r.productId, r.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                <Trash2 size={15} />
              </button>
              
              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111111] to-[#333] flex items-center justify-center text-white font-bold shrink-0">
                  {r.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#1A1A1A] truncate">{r.name}</h3>
                  <p className="text-xs text-[#9E9189] truncate">on {getProductName(r.productId)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5 bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {r.rating} <Star size={10} className="fill-current" />
                </div>
                {r.date && <span className="text-xs text-gray-400">{r.date}</span>}
              </div>

              <p className="text-sm text-[#444] leading-relaxed mb-4 flex-1">
                {r.review}
              </p>

              {r.media && r.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                  {r.media.map((m, mIdx) => (
                    <div key={mIdx} className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF9F6] border border-[#E8DDD0]/50 relative group/media cursor-pointer">
                      {m.type.startsWith('video/') ? (
                        <video src={m.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={m.url} alt="Review attachment" className="w-full h-full object-cover" loading="lazy" />
                      )}
                      <a href={m.url} target="_blank" rel="noreferrer"
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                        <Search size={16} className="text-white" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

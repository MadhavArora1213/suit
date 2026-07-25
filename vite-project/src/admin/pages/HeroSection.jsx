import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Check, Move } from 'lucide-react';
import { getHero, saveHero, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const P = '#111111';

const defaultHeroData = {
  tagLine: 'Edition 2026',
  heading: 'Unveiling Masterpieces',
  subText: 'A curated journey through heritage craftsmanship and modern luxury silhouettes.',
  ctaText: 'Explore Gallery',
  ctaLink: '#collections',
  slides: [
    { id: 1, image: '/hero_campaign_suits.png', title: 'Banarasi Silk' },
    { id: 2, image: '/anarkali_suit.png', title: 'Royal Anarkali' },
    { id: 3, image: '/sharara_suit.png', title: 'Modern Sharara' },
    { id: 4, image: '/sky_blue_suit.jpg', title: 'Glacier Blue Organza' },
    { id: 5, image: '/hero_campaign_palace.png', title: 'Bridal Couture' },
    { id: 6, image: '/designer_suit_1.png', title: 'Heritage Luxe' },
  ]
};

const InputField = ({ label, value, onChange, placeholder, textarea }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold tracking-wide uppercase" style={{ color: P }}>{label}</label>
    {textarea ? (
      <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-base text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all resize-none"
        onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; }}
        onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
    ) : (
      <input type="text" value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-base text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all"
        onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; }}
        onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
    )}
  </div>
);

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [heroText, setHeroText] = useState({
    tagLine: '',
    heading: '',
    subText: '',
    ctaText: '',
    ctaLink: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getHero(defaultHeroData);
    setHeroText({
      tagLine: data.tagLine,
      heading: data.heading,
      subText: data.subText,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
    });
    setSlides(data.slides || defaultHeroData.slides);
  }, []);

  const handleSave = () => {
    saveHero({
      ...heroText,
      slides,
    });
    notifyWebsite();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeSlide = (id) => setSlides(prev => prev.filter(s => s.id !== id));

  const addSlide = () => {
    setSlides(prev => [...prev, { id: Date.now(), image: '/designer_suit_1.png', title: 'New Slide' }]);
  };

  const updateSlide = (id, key, value) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const handleSlideImage = async (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      updateSlide(id, 'image', b64);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Hero Section</h2>
          <p className="text-sm text-[#9E9189]">Manage headline, sub-text, CTA and gallery slideshow</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all ${
            saved ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#111111] text-white shadow-[#111111]/25'
          }`}>
          {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
        </motion.button>
      </div>

      {/* Hero Text Content */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-5">Hero Text & CTA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Tag Line" value={heroText.tagLine} onChange={e => setHeroText(p => ({ ...p, tagLine: e.target.value }))} placeholder="e.g. Edition 2026" />
          <InputField label="Main Heading" value={heroText.heading} onChange={e => setHeroText(p => ({ ...p, heading: e.target.value }))} placeholder="e.g. Unveiling Masterpieces" />
          <div className="sm:col-span-2">
            <InputField label="Sub Text" value={heroText.subText} onChange={e => setHeroText(p => ({ ...p, subText: e.target.value }))} placeholder="Sub-heading text..." textarea />
          </div>
          <InputField label="CTA Button Text" value={heroText.ctaText} onChange={e => setHeroText(p => ({ ...p, ctaText: e.target.value }))} placeholder="e.g. Explore Gallery" />
          <InputField label="CTA Link" value={heroText.ctaLink} onChange={e => setHeroText(p => ({ ...p, ctaLink: e.target.value }))} placeholder="e.g. #collections" />
        </div>

        {/* Live Preview */}
        <div className="mt-6 bg-gradient-to-br from-[#FBF9F7] to-[#F5EDE3] rounded-xl p-5 border border-[#E8DDD0]">
          <p className="text-xs font-bold tracking-widest text-[#9E9189] uppercase mb-3">Live Preview</p>
          <p className="text-xs tracking-widest text-[#111111] uppercase mb-1 font-semibold">{heroText.tagLine}</p>
          <h2 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {heroText.heading}
          </h2>
          <p className="text-xs text-[#6B6B6B] mb-3">{heroText.subText}</p>
          <span className="inline-block border border-[#111111] text-[#111111] text-xs font-bold tracking-widest px-5 py-2 rounded-full">{heroText.ctaText} →</span>
        </div>
      </div>

      {/* Gallery Slides */}
      <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Gallery Slides</h3>
            <p className="text-xs text-[#9E9189]">{slides.length} slides in auto-scroll gallery</p>
          </div>
          <button onClick={addSlide} className="flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#111111] transition-colors border border-[#111111]/30 px-3 py-2 rounded-xl hover:bg-[#E8DDD0]">
            <Plus size={15} /> Add Slide
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {slides.map((slide, i) => (
            <motion.div key={slide.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-xl overflow-hidden border border-[#E8DDD0] bg-[#F8F4F9]">
              {/* Image */}
              <label className="block aspect-[3/4] cursor-pointer overflow-hidden">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <input type="file" accept="image/*" onChange={e => handleSlideImage(slide.id, e)} className="hidden" />
              </label>
              {/* Number */}
              <div className="absolute top-2 left-2 w-5 h-5 bg-[#111111] rounded-full flex items-center justify-center text-white text-[11px] font-bold">{i + 1}</div>
              {/* Delete */}
              <button onClick={() => removeSlide(slide.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <Trash2 size={11} />
              </button>
              {/* Title edit */}
              <div className="p-2">
                <input
                  type="text"
                  value={slide.title}
                  onChange={e => updateSlide(slide.id, 'title', e.target.value)}
                  className="w-full text-xs font-semibold text-[#1A1A1A] bg-transparent focus:outline-none focus:bg-[#FAF9F6] rounded px-1 py-0.5 truncate"
                  placeholder="Slide title"
                />
              </div>
            </motion.div>
          ))}

          {/* Add placeholder */}
          <button onClick={addSlide}
            className="aspect-[3/4] border-2 border-dashed border-[#111111]/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#111111] hover:bg-[#E8DDD0] transition-all text-[#111111] group">
            <div className="w-8 h-8 bg-[#E8DDD0] rounded-xl flex items-center justify-center group-hover:bg-[#B8DEE4] transition-colors">
              <Upload size={16} />
            </div>
            <span className="text-[11px] font-semibold">Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  );
}

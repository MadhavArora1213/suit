import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, Check, Copy, Clock, Tag, Percent } from 'lucide-react';
import { getPromo, savePromo, fileToBase64, notifyWebsite } from '../../utils/adminStore';

const P = '#111111';

const initialFabrics = [
  { id: 1, name: 'Heritage Banarasi Silk', image: '/banarasi_suit.png', desc: 'Handwoven pure zari panels.' },
  { id: 2, name: 'Lucknowi Chikankari', image: '/chikankari_suit.png', desc: 'Detailed shadow stitch artistry.' },
  { id: 3, name: 'Summer Gota Patti', image: '/sharara_suit.png', desc: 'Traditional royal gold borders.' },
];

const defaultPromo = {
  title: 'Festive Season Sale',
  discount: '40',
  couponCode: 'FESTIVE40',
  endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endTime: '23:59',
  fabrics: initialFabrics,
};

const InputField = ({ label, value, onChange, placeholder, type = 'text', icon: Icon }) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold tracking-wide uppercase" style={{ color: P }}>{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: P }} />}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-base text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all`}
        onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; }}
        onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
    </div>
  </div>
);

export default function Promotions() {
  const [promo, setPromo] = useState({
    title: '',
    discount: '',
    couponCode: '',
    endDate: '',
    endTime: '',
  });
  const [fabrics, setFabrics] = useState([]);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, mins: 48, secs: 35 });

  useEffect(() => {
    const data = getPromo(defaultPromo);
    setPromo({
      title: data.title,
      discount: data.discount,
      couponCode: data.couponCode,
      endDate: data.endDate,
      endTime: data.endTime,
    });
    setFabrics(data.fabrics || defaultPromo.fabrics);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  const handleSave = () => {
    savePromo({
      ...promo,
      fabrics,
    });
    notifyWebsite();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeFabric = (id) => setFabrics(prev => prev.filter(f => f.id !== id));
  const addFabric = () => setFabrics(prev => [...prev, { id: Date.now(), name: '', image: '/designer_suit_1.png', desc: '' }]);
  const updateFabric = (id, key, val) => setFabrics(prev => prev.map(f => f.id === id ? { ...f, [key]: val } : f));
  
  const handleFabricImage = async (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      updateFabric(id, 'image', b64);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Promotions & Special Offers</h2>
          <p className="text-sm text-[#9E9189]">Manage coupon codes, countdown timer, and featured fabrics</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all ${saved ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#111111] text-white shadow-[#111111]/25'}`}>
          {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Promo Details */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-5">Offer Details</h3>
            <div className="space-y-4">
              <InputField label="Promotion Title" value={promo.title} onChange={e => setPromo(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Festive Season Sale" icon={Tag} />
              <InputField label="Discount Percentage" type="number" value={promo.discount} onChange={e => setPromo(p => ({ ...p, discount: e.target.value }))} placeholder="e.g. 40" icon={Percent} />

              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]" />
                    <input value={promo.couponCode} onChange={e => setPromo(p => ({ ...p, couponCode: e.target.value.toUpperCase() }))} placeholder="e.g. FESTIVE40"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm font-bold text-[#111111] tracking-widest placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  </div>
                  <button onClick={handleCopy} className={`px-4 py-3 rounded-xl text-sm font-semibold border flex items-center gap-1.5 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'border-[#E8DDD0] text-[#6B6B6B] hover:bg-[#F8F4F9]'}`}>
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">End Date</label>
                  <input type="date" value={promo.endDate} onChange={e => setPromo(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#111111] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-[#111111] uppercase mb-2">End Time</label>
                  <input type="time" value={promo.endTime} onChange={e => setPromo(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#111111] transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Live Countdown Preview */}
          <div className="bg-[#111111] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-[#111111]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-white/70" />
                <p className="text-xs font-semibold text-white/70 tracking-wider uppercase">Live Countdown Preview</p>
              </div>
              <p className="text-lg font-semibold mb-1">{promo.title}</p>
              <p className="text-white/70 text-xs mb-4">Use code: <span className="font-bold text-white">{promo.couponCode}</span> for {promo.discount}% OFF</p>
              <div className="flex gap-3">
                {[{ v: pad(timeLeft.days), l: 'Days' }, { v: pad(timeLeft.hours), l: 'Hrs' }, { v: pad(timeLeft.mins), l: 'Mins' }, { v: pad(timeLeft.secs), l: 'Secs' }].map(({ v, l }) => (
                  <div key={l} className="text-center bg-white/15 rounded-xl px-3 py-2 min-w-[48px]">
                    <p className="text-xl font-bold tabular-nums">{v}</p>
                    <p className="text-[11px] text-white/70 uppercase tracking-wider">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Fabrics */}
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Featured Fabrics Carousel</h3>
              <p className="text-xs text-[#9E9189]">Up to 3 fabrics shown in special offer section</p>
            </div>
            {fabrics.length < 3 && (
              <button onClick={addFabric} className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:text-[#111111] border border-[#111111]/30 px-3 py-2 rounded-xl hover:bg-[#E8DDD0] transition-all">
                <Plus size={13} /> Add
              </button>
            )}
          </div>

          <div className="space-y-4">
            {fabrics.map((fabric, i) => (
              <motion.div key={fabric.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-[#FDFBF9] rounded-xl border border-[#E8DDD0]">
                <label className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group relative border border-[#E8DDD0]">
                  <img src={fabric.image} alt={fabric.name} className="w-14 h-16 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={14} className="text-white" />
                  </div>
                  <input type="file" accept="image/*" onChange={e => handleFabricImage(fabric.id, e)} className="hidden" />
                </label>
                <div className="flex-1 space-y-2">
                  <input value={fabric.name} onChange={e => updateFabric(fabric.id, 'name', e.target.value)} placeholder="Fabric name"
                    className="w-full px-3 py-2 bg-white border border-[#E8DDD0] rounded-lg text-sm font-semibold text-[#1A1A1A] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                  <input value={fabric.desc} onChange={e => updateFabric(fabric.id, 'desc', e.target.value)} placeholder="Short description"
                    className="w-full px-3 py-2 bg-white border border-[#E8DDD0] rounded-lg text-xs text-[#6B6B6B] placeholder-[#C0B8B0] focus:outline-none focus:border-[#111111] transition-all" />
                </div>
                <button onClick={() => removeFabric(fabric.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0 mt-1">
                  <Trash2 size={13} className="text-red-500" />
                </button>
              </motion.div>
            ))}

            {fabrics.length === 0 && (
              <button onClick={addFabric}
                className="w-full py-8 border-2 border-dashed border-[#111111]/30 rounded-xl text-sm text-[#111111] font-semibold hover:border-[#111111] hover:bg-[#E8DDD0] transition-all">
                + Add Featured Fabric
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

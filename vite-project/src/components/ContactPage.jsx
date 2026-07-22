import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const floatingImages = [
  { src: '/monsoon_edit.png', style: { top: '140px', left: '2%', width: '190px', rotate: '-6deg' } },
  { src: '/luxury_edit.png', style: { top: '130px', right: '2%', width: '170px', rotate: '5deg' } },
  { src: '/hero_campaign_palace.png', style: { top: '45%', left: '0.5%', width: '185px', rotate: '-3deg' } },
  { src: '/wedding_edit.png', style: { top: '42%', right: '1%', width: '190px', rotate: '4deg' } },
  { src: '/summer_edit.png', style: { bottom: '4%', left: '2%', width: '165px', rotate: '7deg' } },
  { src: '/pastel_edit.png', style: { bottom: '3%', right: '2%', width: '175px', rotate: '-5deg' } },
];

export default function ContactPage({ setView }) {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 40% 40%, #1a1209 0%, #0a0806 60%, #0e0c0a 100%)' }}
    >
      {/* Animated Grain Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Soft glow that follows mouse */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(188,165,138,0.06) 0%, transparent 70%)',
          left: mousePos.x - 400,
          top: mousePos.y - 400,
          transition: 'left 0.8s ease, top 0.8s ease',
        }}
      />

      {/* Floating Editorial Images */}
      {floatingImages.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, rotate: parseFloat(img.style.rotate || '0') - 10 }}
          animate={{ opacity: 1, scale: 1, rotate: parseFloat(img.style.rotate || '0') }}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            ...img.style,
            rotate: img.style.rotate,
            zIndex: 1,
          }}
          whileHover={{ scale: 1.04, zIndex: 10, rotate: '0deg' }}
          className="overflow-hidden shadow-2xl border border-white/10 hidden lg:block"
        >
          <img src={img.src} alt="" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4', objectPosition: 'top' }} />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      ))}

      {/* CENTRAL GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-4 mt-24 mb-12"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(188,165,138,0.2)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Top Gold Trim */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#BCA58A] to-transparent" />

        <div className="p-10 md:p-16">
          {!submitted ? (
            <>
              {/* Title */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-4 mb-6"
                >
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#BCA58A]" />
                  <span className="text-[9px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Gurnaaz Private Suite
                  </span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#BCA58A]" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="text-5xl md:text-7xl font-light text-white tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Contact
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-sm text-white/40 mt-4 leading-relaxed"
                >
                  Our concierge team replies personally within 24 hours.
                </motion.p>
              </div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="grid grid-cols-3 gap-4 mb-12"
              >
                {[
                  { label: 'Call Us', value: '+91 98772 75894' },
                  { label: 'Email', value: 'concierge@gurnaaz.com' },
                  { label: 'Visit', value: 'Bandra, Mumbai' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-4 rounded-none border border-white/5 hover:border-[#BCA58A]/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="text-[8px] tracking-[0.2em] uppercase text-[#BCA58A] font-bold mb-2">{item.label}</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {['Full Name', 'Email Address'].map((placeholder) => (
                    <div key={placeholder} className="relative">
                      <input
                        required
                        type={placeholder.includes('Email') ? 'email' : 'text'}
                        placeholder=" "
                        onFocus={() => setFocused(placeholder)}
                        onBlur={() => setFocused(null)}
                        className="w-full bg-transparent border-b py-3 text-sm text-white focus:outline-none transition-colors peer"
                        style={{ borderColor: focused === placeholder ? '#BCA58A' : 'rgba(255,255,255,0.12)' }}
                      />
                      <label
                        className="absolute left-0 text-xs transition-all duration-300 pointer-events-none"
                        style={{
                          top: focused === placeholder ? '-16px' : '12px',
                          fontSize: focused === placeholder ? '9px' : '13px',
                          letterSpacing: focused === placeholder ? '0.2em' : '0',
                          color: focused === placeholder ? '#BCA58A' : 'rgba(255,255,255,0.35)',
                          textTransform: focused === placeholder ? 'uppercase' : 'none',
                          fontWeight: focused === placeholder ? '700' : '400',
                        }}
                      >
                        {placeholder}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    required rows="4"
                    placeholder=" "
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent border-b py-3 text-sm text-white focus:outline-none transition-colors resize-none peer"
                    style={{ borderColor: focused === 'message' ? '#BCA58A' : 'rgba(255,255,255,0.12)' }}
                  />
                  <label
                    className="absolute left-0 pointer-events-none transition-all duration-300"
                    style={{
                      top: focused === 'message' ? '-16px' : '12px',
                      fontSize: focused === 'message' ? '9px' : '13px',
                      letterSpacing: focused === 'message' ? '0.2em' : '0',
                      color: focused === 'message' ? '#BCA58A' : 'rgba(255,255,255,0.35)',
                      textTransform: focused === 'message' ? 'uppercase' : 'none',
                      fontWeight: focused === 'message' ? '700' : '400',
                    }}
                  >
                    Your Message
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full group relative overflow-hidden cursor-pointer mt-4"
                  style={{ background: 'rgba(188,165,138,0.15)', border: '1px solid rgba(188,165,138,0.4)', padding: '18px 32px' }}
                >
                  <div
                    className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-out"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(188,165,138,0.2), rgba(188,165,138,0.4))' }}
                  />
                  <span className="relative flex items-center justify-center gap-4 text-[10px] tracking-[0.3em] text-white/80 group-hover:text-white font-bold uppercase transition-colors">
                    Send to Concierge
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-[#BCA58A]" />
                  </span>
                </button>
              </motion.form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-20 h-20 mx-auto border border-[#BCA58A]/50 rounded-full flex items-center justify-center mb-8"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#BCA58A" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message Sent</h2>
              <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                Thank you for reaching out. A member of our concierge team will respond within 24 hours.
              </p>
              <button
                onClick={() => setView('home')}
                className="mt-10 text-[9px] tracking-[0.3em] uppercase text-[#BCA58A] hover:text-white transition-colors border-b border-[#BCA58A]/40 pb-1 cursor-pointer"
              >
                Return to Gurnaaz
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom Gold Trim */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#BCA58A] to-transparent" />
      </motion.div>
    </div>
  );
}

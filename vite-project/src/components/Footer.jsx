import { motion } from 'framer-motion';
import gurnaazLogo from '../assets/gurnaaz.png';

export default function Footer({ setView }) {
  const navigate = (view) => {
    if (setView) setView(view);
  };

  return (
    <footer className="relative overflow-hidden min-h-[80vh] md:min-h-screen">

      {/* ═══════════════ Mountain Background (full footer) ═══════════════ */}
      <img
        src="/mountains_bg.jpg"
        alt="Mountain landscape"
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />

      {/* Soft fade from top — cream blends into mountain */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(180deg, #FAF9F6 0%, #F0EBE2 6%, rgba(240,235,226,0.7) 15%, rgba(180,170,155,0.3) 40%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* ═══════════════ Main Content ═══════════════ */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-8">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="md:col-span-5">
            <img src={gurnaazLogo} alt="GURNAAZ" className="h-8 md:h-10 w-auto object-contain mb-4" />
             <h3 className="text-white md:text-[#1A0008] text-[22px] sm:text-2xl md:text-[28px] font-bold mb-3 sm:mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Premium Ethnic Wear Destination</h3>
             <p className="text-white/70 md:text-[#1A0008]/70 text-[13px] sm:text-[14px] leading-relaxed mb-6 sm:mb-8 max-w-xs sm:max-w-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Gurnaaz brings you handcrafted premium ethnic wear from India's finest heritage boutiques — curated, not aggregated.</p>
             <a href="#" onClick={(e) => { e.preventDefault(); navigate('collections'); }} className="inline-flex items-center gap-2.5 bg-[#1A0008] text-[#FAF9F6] text-[11px] sm:text-[12px] font-semibold tracking-[0.05em] px-6 sm:px-7 py-3 sm:py-3.5 hover:bg-[#D4AF37] transition-colors duration-300 rounded-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
               Explore Collection
             </a>
             <p className="text-white/60 md:text-[#1A0008]/60 text-[12px] mt-8 mb-1 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>&copy; 2026 Gurnaaz — All rights reserved</p>
             <p className="text-white/60 md:text-[#1A0008]/60 text-[12px] flex items-center gap-1.5 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Built with <span className="text-[#D4AF37] text-sm">✦</span> by <span className="font-semibold text-white/80 md:text-white/80 md:text-[#1A0008]/80">Gurnaaz Team</span></p>
          </motion.div>

          <div className="hidden md:block md:col-span-1" />

          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-white md:text-[#1A0008] text-[15px] sm:text-[14px] font-bold mb-4 sm:mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Shop</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[{ label: 'Anarkali', view: 'category' }, { label: 'Banarasi', view: 'category' }, { label: 'Chikankari', view: 'category' }, { label: 'Sharara', view: 'category' }, { label: 'Patiala', view: 'category' }].map((item) => (
                  <li key={item.label}><a href="#" onClick={(e) => { e.preventDefault(); navigate(item.view); }} className="text-white/80 md:text-[#1A0008]/80 text-[14px] sm:text-[13px] font-medium hover:text-white md:hover:text-[#1A0008] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</a></li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-white md:text-[#1A0008] text-[15px] sm:text-[14px] font-bold mb-4 sm:mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Navigation</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  { label: 'Home', view: 'customer-home' }, 
                  { label: 'About Us', view: 'about' }, 
                  { label: 'Collection', view: 'collections' }, 
                  { label: 'Boutiques', view: 'boutiques' },
                  { label: 'Contact', view: 'contact' }
                ].map((l) => (
                  <li key={l.label}><a href="#" onClick={(e) => { e.preventDefault(); navigate(l.view); }} className="text-white/80 md:text-[#1A0008]/80 text-[14px] sm:text-[13px] font-medium hover:text-white md:hover:text-[#1A0008] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{l.label}</a></li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-white md:text-[#1A0008] text-[15px] sm:text-[14px] font-bold mb-4 sm:mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Help</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[{ label: 'Shipping', view: 'shipping' }, { label: 'FAQ', view: 'faq' }, { label: 'Privacy Policy', view: 'privacy' }].map((l) => (
                  <li key={l.label}><a href="#" onClick={(e) => { e.preventDefault(); if (l.view) navigate(l.view); }} className="text-white/80 md:text-[#1A0008]/80 text-[14px] sm:text-[13px] font-medium hover:text-white md:hover:text-[#1A0008] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{l.label}</a></li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════ Large "Gurnaaz" text at bottom ═══════════════ */}
      <div className="relative z-10 flex items-end justify-center pb-4 md:items-center md:pb-0 pointer-events-none" style={{ height: 'clamp(140px, 28vw, 350px)' }}>
        <h1
          className="font-bold leading-none text-center"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(70px, 22vw, 320px)',
            color: 'rgba(255, 252, 245, 0.6)',
            textShadow: '0 4px 60px rgba(255,252,245,0.3), 0 0 120px rgba(255,252,245,0.15)',
            lineHeight: '0.85',
          }}
        >
          Gurnaaz
        </h1>
      </div>
    </footer>
  );
}

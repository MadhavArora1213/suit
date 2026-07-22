import { motion } from 'framer-motion';

export default function Footer({ setView }) {
  const navigate = (view) => {
    if (setView) setView(view);
  };

  return (
    <footer className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

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
          background: 'linear-gradient(180deg, #FAF9F6 0%, #F0EBE2 8%, rgba(240,235,226,0.9) 20%, rgba(232,223,210,0.7) 35%, rgba(200,190,175,0.4) 55%, transparent 100%)',
        }}
      />

      {/* ═══════════════ Main Content ═══════════════ */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center">
                <span className="text-[#FAF9F6] text-[13px] font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>G</span>
              </div>
              <span className="text-[#111111] text-[17px] font-bold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Gurnaaz</span>
            </div>
            <h3 className="text-[#111111] text-2xl sm:text-[28px] font-bold mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Premium Ethnic<br />Wear Destination</h3>
            <p className="text-[#111111]/50 text-[13px] leading-relaxed mb-8 max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Gurnaaz brings you handcrafted premium ethnic wear from India's finest heritage boutiques — curated, not aggregated. Delivered worldwide with love.</p>
            <a href="/sell" className="inline-flex items-center gap-2.5 bg-[#111111] text-[#FAF9F6] text-[11px] font-semibold tracking-[0.05em] px-7 py-3.5 hover:bg-[#BCA58A] transition-colors duration-300 rounded-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Explore Collection
            </a>
            <p className="text-[#111111]/50 text-[12px] mt-8 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>&copy; 2026 Gurnaaz — All rights reserved</p>
            <p className="text-[#111111]/50 text-[12px] flex items-center gap-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Built with <span className="text-[#BCA58A] text-sm">✦</span> by <span className="font-semibold text-[#111111]/60">Gurnaaz Team</span></p>
          </motion.div>

          <div className="hidden md:block md:col-span-1" />

          <div className="md:col-span-6 grid grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-[#111111] text-[14px] font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Shop</h4>
              <ul className="space-y-4">
                {[{ label: 'Anarkali', view: 'category' }, { label: 'Banarasi', view: 'category' }, { label: 'Chikankari', view: 'category' }, { label: 'Sharara', view: 'category' }, { label: 'Patiala', view: 'category' }].map((item) => (
                  <li key={item.label}><a href="#" onClick={(e) => { e.preventDefault(); navigate(item.view); }} className="text-[#111111]/50 text-[13px] hover:text-[#111111] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</a></li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-[#111111] text-[14px] font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'About', 'Collection', 'Contact', 'Become Seller'].map((l) => (
                  <li key={l}><a href="#" onClick={(e) => { e.preventDefault(); if (l === 'Home') window.location.href = '/sell'; if (l === 'Collection') navigate('category'); }} className="text-[#111111]/50 text-[13px] hover:text-[#111111] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{l}</a></li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-[#111111] text-[14px] font-bold mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Help</h4>
              <ul className="space-y-4">
                {[{ label: 'Shipping' }, { label: 'Returns' }, { label: 'Size Guide' }, { label: 'FAQ', view: 'faq' }, { label: 'Privacy Policy', view: 'privacy' }].map((l) => (
                  <li key={l.label}><a href="#" onClick={(e) => { e.preventDefault(); if (l.view) navigate(l.view); }} className="text-[#111111]/50 text-[13px] hover:text-[#111111] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>{l.label}</a></li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════ Large "Gurnaaz" text at bottom ═══════════════ */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none" style={{ height: 'clamp(180px, 28vw, 350px)' }}>
        <h1
          className="font-bold leading-none text-center"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(120px, 22vw, 320px)',
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

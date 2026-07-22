import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RAINBOW = ['#FF6B6B', '#FF8E53', '#FFC93C', '#6BCB77', '#4D96FF', '#9B59B6', '#FF69B4', '#00D2FF', '#FF4757', '#FFA502', '#2ED573', '#1E90FF', '#8854D0', '#FC427B', '#0ABDE3', '#F8C291'];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <>
      <style>{`
        .nl-input:-webkit-autofill,
        .nl-input:-webkit-autofill:hover,
        .nl-input:-webkit-autofill:focus,
        .nl-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(17,17,17,0.95) inset !important;
          -webkit-text-fill-color: transparent !important;
          caret-color: transparent;
          transition: background-color 5000s ease-in-out 0s;
        }
        @keyframes nl-charPop {
          0% { opacity: 0; transform: translateY(6px) scale(0.5); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.08); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nl-char {
          display: inline-block;
          animation: nl-charPop 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
          opacity: 0;
          font-weight: 500;
        }
        .nl-char:hover {
          transform: scale(1.2) translateY(-2px);
          transition: transform 0.2s;
        }
      `}</style>
      <section className="relative min-h-[100vh] flex items-center bg-[#111111] overflow-hidden" style={{ marginBottom: '-1px' }}>

        {/* ═══ Left — Image ═══ */}
        <div className="hidden md:block absolute left-0 top-0 w-[45%] h-full">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80"
            alt="Ethnic Wear"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]" />
          <div className="absolute inset-0 bg-[#111111]/20" />
        </div>

        {/* ═══ Bottom Gradient → Footer ═══ */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(250,249,246,0.15) 30%, rgba(240,235,226,0.5) 60%, #F0EBE2 85%, #FAF9F6 100%)' }} />

        {/* ═══ Ambient Glow ═══ */}
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[#BCA58A]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        {/* ═══ Content ═══ */}
        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left spacer on desktop */}
          <div className="hidden md:block" />

          {/* Right — Form */}
          <div className="py-16 md:py-0">

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#BCA58A] text-[9px] tracking-[0.4em] uppercase mb-5 flex items-center gap-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="w-6 h-px bg-[#BCA58A]/50" />
              The Inner Circle
            </motion.p>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-5"
            >
              <span className="block text-white text-[42px] md:text-[54px] font-light leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Never Miss
              </span>
              <span className="block text-[#BCA58A] text-[50px] md:text-[66px] italic font-light leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                a New Suit
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/30 text-[14px] leading-[1.7] max-w-[420px] mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Join women who love handcrafted ethnic wear. Get early access to new collections,
              private sales, and styling tips.
            </motion.p>

            {/* Form — Input with colorful overlay inside */}
            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex bg-white/[0.05] border border-white/[0.08] hover:border-[#BCA58A]/25 transition-all duration-500 overflow-hidden max-w-[440px]">
                <div className="flex-1 relative">
                  {/* Hidden real input */}
                  <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="absolute inset-0 w-full h-full px-5 py-4 text-[15px] bg-transparent border-none outline-none cursor-text z-10"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      caretColor: 'white',
                      color: 'transparent',
                    }}
                  />
                  {/* Colorful display on top */}
                  <div className="flex items-center px-5 py-4 min-h-[48px] pointer-events-none">
                    {email.length === 0 ? (
                      <span className="text-white/25 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        your@email.com
                      </span>
                    ) : (
                      <span key={email} className="text-[15px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {email.split('').map((char, i) => (
                          <span
                            key={`${i}-${char}`}
                            className="nl-char"
                            style={{
                              color: RAINBOW[i % RAINBOW.length],
                              animationDelay: `${i * 0.04}s`,
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#BCA58A] hover:bg-[#c9b39a] text-[#111111] px-6 md:px-8 py-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer whitespace-nowrap"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Subscribe
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-rose-400/70 text-[11px] mt-2 ml-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {error}
                  </motion.p>
                )}
                {subscribed && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-3 ml-1 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BCA58A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[#BCA58A] text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Welcome to the Gurnaaz family
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {['No spam', 'Unsubscribe anytime', '2,400+ subscribers'].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-white/15 text-[11px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="w-1 h-1 rounded-full bg-[#BCA58A]/30" />
                  {t}
                </span>
              ))}
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}

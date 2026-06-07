import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Globe } from 'lucide-react';
import { useState } from 'react';

const Github = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
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
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#111111] text-[#FAF9F6] border-t border-[#BCA58A]/10">

      {/* Newsletter */}
      <div className="border-b border-[#BCA58A]/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-14 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase block mb-3 font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Stay Connected</span>
              <h3 className="text-3xl md:text-4xl font-light text-[#FAF9F6] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Join the <em className="italic text-[#BCA58A]">Inner Circle</em>
              </h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Exclusive offers, new arrivals, and artisan stories — delivered with elegance.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input type="email" placeholder="Your email address"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#111111] border border-[#BCA58A]/20 text-[#FAF9F6] placeholder-[#6B6B6B] px-5 py-3.5 text-sm focus:outline-none focus:border-[#BCA58A] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="bg-[#BCA58A] hover:bg-[#BCA58A] text-[#111111] px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] transition-colors cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    SUBSCRIBE
                  </motion.button>
                </div>
                {error && <p className="text-rose-400 text-xs">{error}</p>}
                {subscribed && <p className="text-emerald-400 text-xs font-medium">Thank you! Check your inbox for a 10% welcome discount.</p>}
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-14 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14 text-left">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-4 lg:col-span-1">
            <div>
              <h2 className="text-2xl tracking-[0.14em] text-[#BCA58A]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500 }}>
                SUITÉ
              </h2>
              <span className="text-[7px] tracking-[0.28em] text-[#6B6B6B] uppercase block -mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Ethnic Elegance Redefined
              </span>
            </div>
            <div className="w-8 h-px bg-[#BCA58A]/30" />
            <p className="text-xs text-[#6B6B6B] leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Premium ethnic wear curated from heritage artisans across India. Quality, elegance, and rich tradition woven into every stitch.
            </p>
          </motion.div>

          {/* Links */}
          {[
            { title: 'SHOP', links: ['New Arrivals', 'Best Sellers', 'Trending Now', 'Festive Sale'] },
            { title: 'COLLECTIONS', links: ['Anarkali Suits', 'Sharara Suits', 'Patiala Suits', 'Pakistani Suits'] },
            { title: 'HELP', links: ['Contact Us', 'Shipping & Delivery', 'Returns Policy', 'FAQs'] },
          ].map(({ title, links }, ci) => (
            <motion.div key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1 + 0.1, duration: 0.6 }} viewport={{ once: true }}>
              <h4 className="text-[9px] font-semibold tracking-[0.28em] uppercase mb-5 text-[#BCA58A]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a href="#" whileHover={{ x: 4, color: '#BCA58A' }}
                      className="text-xs text-[#6B6B6B] transition-colors block"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }} viewport={{ once: true }}>
            <h4 className="text-[9px] font-semibold tracking-[0.28em] uppercase mb-5 text-[#BCA58A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>CONTACT</h4>
            <ul className="space-y-4">
              {[
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@suite.com' },
                { Icon: MapPin, text: 'Mumbai, India' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={13} className="mt-0.5 text-[#BCA58A] flex-shrink-0" />
                  <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#BCA58A]/8 my-8" />

        {/* Bottom */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}
          viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-[#6B6B6B]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 SUITÉ · All Rights Reserved · Crafted with Heritage
          </p>
          <div className="flex gap-5">
            {[{ Icon: Github, label: 'GitHub' }, { Icon: Send, label: 'Twitter' }, { Icon: Globe, label: 'Website' }, { Icon: Linkedin, label: 'LinkedIn' }].map(({ Icon, label }) => (
              <motion.a key={label} href="#" whileHover={{ scale: 1.2, color: '#BCA58A' }} whileTap={{ scale: 0.9 }}
                className="text-[#6B6B6B]/50 hover:text-[#BCA58A] transition-colors" title={label}>
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#6B6B6B]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>Secure Payments:</span>
            <div className="flex gap-3 text-sm opacity-50 hover:opacity-80 transition-opacity">
              {['💳', '🏦', '📱', '🛡️'].map((e, i) => (
                <motion.span key={i} whileHover={{ scale: 1.25 }} className="cursor-pointer">{e}</motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

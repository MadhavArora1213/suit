import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Globe } from 'lucide-react';
import { useState } from 'react';
import gurnaazLogo from '../assets/gurnaaz.png';

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

export default function Footer({ setView }) {
  return (
    <footer className="bg-[#FAF9F6] text-[#111111] py-16">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Brand */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-12 cursor-pointer" onClick={() => setView && setView('home')}>
          <img src={gurnaazLogo} alt="GURNAAZ" className="h-16 w-auto object-contain mx-auto" />
        </motion.div>

        {/* Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12">
          {['About', 'Contact', 'Become Seller', 'Shipping', 'Returns', 'Privacy'].map((link) => (
            <a key={link} href="#" className="text-[12px] text-[#555] hover:text-[#BCA58A] transition-colors font-light tracking-wide uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {link}
            </a>
          ))}
        </motion.div>

        <div className="w-full border-t border-[#111111]/5 mb-8" />

        {/* Bottom */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-[#555] tracking-widest font-light uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            © 2026 GURNAAZ · Global Luxury
          </p>
          <div className="flex gap-6">
            {[{ Icon: Github, label: 'Instagram' }, { Icon: Send, label: 'WhatsApp' }, { Icon: Linkedin, label: 'LinkedIn' }].map(({ Icon, label }) => (
              <motion.a key={label} href="#" whileHover={{ scale: 1.1, color: '#BCA58A' }} whileTap={{ scale: 0.9 }} className="text-[#111111]/40 hover:text-[#BCA58A] transition-colors" title={label}>
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </footer>
  );
}

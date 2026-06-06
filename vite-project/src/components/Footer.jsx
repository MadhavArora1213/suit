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
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-[#111111] text-white">
      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="border-b border-gray-800"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-3xl font-display mb-4">Stay Connected</h3>
              <p className="text-gray-400 font-body text-sm">Subscribe to our newsletter for exclusive offers and the latest designer collections.</p>
            </div>

            <div className="w-full">
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full">
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#BCA58A] transition-colors"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#BCA58A] hover:bg-[#a69076] text-white px-8 py-3 rounded-lg font-medium transition tracking-wider text-xs font-semibold"
                  >
                    Subscribe
                  </motion.button>
                </div>
                {error && <p className="text-rose-500 text-xs text-left font-body">{error}</p>}
                {subscribed && (
                  <p className="text-emerald-500 text-xs text-left font-body font-semibold">
                    Thank you! Check your inbox for a 10% welcome discount.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 text-left">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-2xl font-display font-bold tracking-widest text-[#BCA58A]">SUITÉ</h2>
              <span className="text-[7px] font-body tracking-[0.25em] text-gray-500 uppercase -mt-1 block">
                Ethnic Elegance Redefined
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed font-body">
              Premium ethnic wear curated from heritage artisans across India. Quality, elegance, and rich tradition woven into every single stitch.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-4 text-[#BCA58A]">SHOP</h4>
            <ul className="space-y-3 text-gray-400 text-xs font-body">
              {['New Arrivals', 'Best Sellers', 'Trending Now', 'Festive Sale'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 3, color: '#BCA58A' }}
                    className="transition-colors block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-4 text-[#BCA58A]">COLLECTIONS</h4>
            <ul className="space-y-3 text-gray-400 text-xs font-body">
              {['Anarkali Suits', 'Sharara Suits', 'Patiala Suits', 'Pakistani Suits'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 3, color: '#BCA58A' }}
                    className="transition-colors block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-4 text-[#BCA58A]">HELP</h4>
            <ul className="space-y-3 text-gray-400 text-xs font-body">
              {['Contact Us', 'Shipping & Delivery', 'Returns Policy', 'FAQs'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 3, color: '#BCA58A' }}
                    className="transition-colors block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-xs tracking-widest uppercase mb-4 text-[#BCA58A]">CONTACT</h4>
            <ul className="space-y-4 text-gray-400 text-xs font-body">
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 text-[#BCA58A] flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 text-[#BCA58A] flex-shrink-0" />
                <span>hello@suite.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 text-[#BCA58A] flex-shrink-0" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-500 text-xs font-body">© 2026 SUITÉ. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex gap-6">
            {[
              { Icon: Github, label: 'GitHub' },
              { Icon: Send, label: 'Twitter' },
              { Icon: Globe, label: 'Website' },
              { Icon: Linkedin, label: 'LinkedIn' },
            ].map(({ Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ scale: 1.2, color: '#BCA58A' }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-[#BCA58A] transition-colors"
                title={label}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex gap-4 items-center">
            <span className="text-gray-500 text-xs font-body">Secure Payments:</span>
            <div className="flex gap-3 text-base filter grayscale opacity-60 hover:opacity-100 transition-opacity">
              {['💳', '🏦', '📱', '🛡️'].map((emoji, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="cursor-pointer"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

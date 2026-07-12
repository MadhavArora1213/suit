import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="py-24 bg-[#FAF9F6] border-t border-[#111111]/5">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#111111] tracking-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Join The <em className="italic text-[#BCA58A]">GURNAAZ</em> Community
          </h2>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-4 relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border border-[#111111]/10 text-[#111111] placeholder-[#111111]/40 px-6 py-4 text-[13px] font-light focus:outline-none focus:border-[#BCA58A] transition-colors shadow-sm text-center sm:text-left"
                style={{ fontFamily: "'Montserrat', sans-serif" }} 
              />
              <button 
                type="submit"
                className="bg-[#111111] hover:bg-[#BCA58A] text-white px-10 py-4 text-[10px] font-medium tracking-[0.3em] transition-all duration-500 cursor-pointer uppercase shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Subscribe
              </button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-rose-400 text-xs text-left absolute -bottom-6 left-2">
                  {error}
                </motion.p>
              )}
              {subscribed && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#BCA58A] text-xs font-medium text-left absolute -bottom-6 left-2">
                  Thank you for subscribing.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

      </div>
    </section>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { addSupportTicket } from '../utils/adminStore';

const floatingImages = [
  { src: '/monsoon_edit.png', style: { top: '140px', left: '2%', rotate: '-6deg' } },
  { src: '/luxury_edit.png', style: { top: '130px', right: '2%', rotate: '5deg' } },
  { src: '/hero_campaign_palace.png', style: { top: '45%', left: '0.5%', rotate: '-3deg' } },
  { src: '/wedding_edit.png', style: { top: '42%', right: '1%', rotate: '4deg' } },
  { src: '/summer_edit.png', style: { bottom: '4%', left: '2%', rotate: '7deg' } },
  { src: '/pastel_edit.png', style: { bottom: '3%', right: '2%', rotate: '-5deg' } },
];

export default function ContactPage({ setView, user }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Very basic spam filter check
  const hasSpamKeywords = (text) => {
    const spamWords = ['buy cheap', 'casino', 'viagra', 'crypto', 'investment', 'http://', 'https://'];
    return spamWords.some(word => text.toLowerCase().includes(word));
  };

  const checkRateLimit = () => {
    try {
      const history = JSON.parse(localStorage.getItem('gurnaaz_contact_history') || '[]');
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const recentSubmissions = history.filter(time => time > oneHourAgo);
      if (recentSubmissions.length >= 3) return false;

      recentSubmissions.push(Date.now());
      localStorage.setItem('gurnaaz_contact_history', JSON.stringify(recentSubmissions));
      return true;
    } catch {
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setErrorMsg('');

    // 1. Validation
    if (formData.name.length < 3) {
      setErrorMsg('Name must be at least 3 characters long.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (formData.message.length < 10) {
      setErrorMsg('Message must be at least 10 characters long.');
      return;
    }
    if (formData.message.length > 1000) {
      setErrorMsg('Message cannot exceed 1000 characters.');
      return;
    }
    if (hasSpamKeywords(formData.message)) {
      setErrorMsg('Your message triggered our spam filters. Please remove links and try again.');
      return;
    }

    // 2. Rate Limiting
    if (!checkRateLimit()) {
      setErrorMsg('You have reached the maximum number of inquiries per hour. Please try again later.');
      return;
    }

    // 3. Clean Input to prevent basic XSS (strip script tags)
    const cleanMessage = formData.message.replace(/<[^>]*>?/gm, '');
    const cleanName = formData.name.replace(/<[^>]*>?/gm, '');

    // 4. Submit to Database
    addSupportTicket({
      name: cleanName,
      email: formData.email,
      message: cleanMessage,
    });
    setSubmitted(true);

    // 5. Send Auto-Responder via Brevo API
    const brevoKey = import.meta.env.VITE_BREVO_API_KEY;
    if (brevoKey) {
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: "Gurnaaz Support", email: "madhavarora132005@gmail.com" }, // Using your email as sender to avoid verification issues for now
          to: [{ email: formData.email, name: cleanName }],
          subject: "Gurnaaz Private Suite - We received your inquiry",
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
              <div style="background-color: #f7f5f2; padding: 60px 20px; min-height: 100vh;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e3dc; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                  
                  <!-- Elegant Header (Light) -->
                  <tr>
                    <td style="padding: 40px; text-align: center; border-bottom: 1px solid #f0ebe4; background-color: #ffffff;">
                      <!-- NOTE: This logo will only appear once the website is hosted on a live URL. Email providers block localhost images. -->
                      <img src="https://your-domain.com/assets/gurnaaz.png" alt="GURNAAZ" style="height: 40px; width: auto; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" />
                      <div style="font-size: 9px; letter-spacing: 5px; color: #D4AF37; text-transform: uppercase; font-weight: bold;">Client Services</div>
                    </td>
                  </tr>
                  
                  <!-- Body Content (Light) -->
                  <tr>
                    <td style="padding: 50px 40px; color: #554d45; font-size: 14px; line-height: 1.8;">
                      <h2 style="margin-top: 0; color: #221f1c; font-size: 20px; font-weight: 400; font-family: Georgia, serif; font-style: italic; margin-bottom: 30px;">Dear ${cleanName},</h2>
                      <p style="margin-bottom: 20px;">Thank you for getting in touch with Gurnaaz. This email is to confirm that we have safely received your inquiry.</p>
                      <p style="margin-bottom: 40px;">Our dedicated client support team reviews every message personally to ensure you receive the highest level of service. A representative will be in touch with you shortly.</p>
                      
                      <!-- Quote Box -->
                      <div style="margin: 40px 0; padding: 30px; background-color: #faf9f6; border-left: 2px solid #D4AF37; border-radius: 2px;">
                        <div style="font-size: 10px; letter-spacing: 2px; color: #8a7c6e; text-transform: uppercase; margin-bottom: 15px; font-weight: bold;">Your Inquiry</div>
                        <div style="color: #332d28; font-style: italic; font-family: Georgia, serif; font-size: 15px; line-height: 1.6;">"${cleanMessage}"</div>
                      </div>
                      
                      <p style="margin-bottom: 0;">We sincerely appreciate your patience and look forward to assisting you.</p>
                    </td>
                  </tr>
                  
                  <!-- Footer (Light) -->
                  <tr>
                    <td style="padding: 40px; text-align: center; background-color: #faf9f6; border-top: 1px solid #f0ebe4;">
                      <p style="margin: 0; color: #D4AF37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">The Gurnaaz Team</p>
                      <p style="margin: 15px 0 0 0; color: #8a7c6e; font-size: 10px; letter-spacing: 1px;">Excellence in every thread.</p>
                      
                      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0ebe4;">
                        <p style="margin: 0; color: #a39c94; font-size: 9px; letter-spacing: 1px; text-transform: uppercase;">© ${new Date().getFullYear()} Gurnaaz. All rights reserved.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </body>
            </html>
          `
        })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json();
            console.error("Brevo API Error:", errData);
            alert("Failed to send email. Check browser console for Brevo error.");
          } else {

          }
        })
        .catch(err => console.error("Brevo Network Error:", err));
    } else {
      console.warn("No Brevo API key found in .env");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: '#000000' }}
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
      {floatingImages.map((img, i) => {
        const isLeft = img.style.left;
        return (
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
            className={`overflow-hidden shadow-2xl border border-white/10
              w-[65px] sm:w-[90px] md:w-[130px] lg:w-[160px] xl:w-[190px]
              ${isLeft ? 'origin-left' : 'origin-right'}
            `}
          >
            <img src={img.src} alt="" className="w-full h-auto object-cover" style={{ aspectRatio: '3/4', objectPosition: 'top' }} />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        );
      })}

      {/* CENTRAL GLASS CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
         className="relative z-10 w-full max-w-2xl mx-3 sm:mx-4 mt-16 sm:mt-20 md:mt-24 mb-8 sm:mb-12"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(188,165,138,0.2)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Top Gold Trim */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

         <div className="p-6 sm:p-8 md:p-12 lg:p-16">
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
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="text-[9px] tracking-[0.4em] text-[#D4AF37] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Gurnaaz Support
                  </span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </motion.div>
                 <motion.h1
                   initial={{ opacity: 0, y: 16 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.7, duration: 1 }}
                   className="text-4xl sm:text-5xl md:text-7xl font-light text-white tracking-wide"
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
                  Our support team replies personally within 24 hours.
                </motion.p>
              </div>

              {/* Quick Links */}
               <motion.div
                 initial={{ opacity: 0, y: 16 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.0 }}
                 className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12"
               >
                {[
                  { label: 'Call Us', value: '+91 98772 75894' },
                  { label: 'Email', value: 'madhavarora132005@gmail.com' },
                  { label: 'Visit', value: 'Hoshiarpur, Punjab' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-4 rounded-none border border-white/5 hover:border-[#D4AF37]/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="text-[8px] tracking-[0.2em] uppercase text-[#D4AF37] font-bold mb-2">{item.label}</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Error Message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 border border-red-500/30 bg-red-500/10 rounded-xl text-center"
                >
                  <p className="text-xs text-red-300 font-bold uppercase tracking-widest">{errorMsg}</p>
                </motion.div>
              )}

              {/* Form */}
               <motion.form
                 onSubmit={handleSubmit}
                 initial={{ opacity: 0, y: 16 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.1 }}
                 className="space-y-6 sm:space-y-8"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {['Full Name', 'Email Address'].map((placeholder) => {
                    const isEmail = placeholder.includes('Email');
                    const value = isEmail ? formData.email : formData.name;
                    const isActive = focused === placeholder || value.trim() !== '';
                    return (
                      <div key={placeholder} className="relative">
                        <input
                          required
                          type={isEmail ? 'email' : 'text'}
                          placeholder=" "
                          value={value}
                          onChange={(e) => setFormData({ ...formData, [isEmail ? 'email' : 'name']: e.target.value })}
                          onFocus={() => !user && setFocused(placeholder)}
                          onBlur={() => !user && setFocused(null)}
                          className={`w-full bg-transparent border-b py-3 text-sm text-white focus:outline-none transition-colors peer ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                          style={{ borderColor: (focused === placeholder && !user) ? '#D4AF37' : 'rgba(255,255,255,0.12)' }}
                          readOnly={!!user}
                        />
                        <label
                          className="absolute left-0 text-xs transition-all duration-300 pointer-events-none"
                          style={{
                            top: isActive ? '-16px' : '12px',
                            fontSize: isActive ? '9px' : '13px',
                            letterSpacing: isActive ? '0.2em' : '0',
                            color: (focused === placeholder && !user) ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                            textTransform: isActive ? 'uppercase' : 'none',
                            fontWeight: isActive ? '700' : '400',
                          }}
                        >
                          {placeholder}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="relative">
                  <textarea
                    required rows="4"
                    placeholder=" "
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent border-b py-3 text-sm text-white focus:outline-none transition-colors resize-none peer"
                    style={{ borderColor: focused === 'message' ? '#D4AF37' : 'rgba(255,255,255,0.12)' }}
                  />
                  <label
                    className="absolute left-0 pointer-events-none transition-all duration-300"
                    style={{
                      top: (focused === 'message' || formData.message.trim() !== '') ? '-16px' : '12px',
                      fontSize: (focused === 'message' || formData.message.trim() !== '') ? '9px' : '13px',
                      letterSpacing: (focused === 'message' || formData.message.trim() !== '') ? '0.2em' : '0',
                      color: focused === 'message' ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                      textTransform: (focused === 'message' || formData.message.trim() !== '') ? 'uppercase' : 'none',
                      fontWeight: (focused === 'message' || formData.message.trim() !== '') ? '700' : '400',
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
                    Send Message
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-[#D4AF37]" />
                  </span>
                </button>
              </motion.form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pt-0 pb-8 text-center flex flex-col items-center justify-start relative -mt-8"
            >
              {/* Glowing Background Effect */}
              <div
                className="absolute inset-0 opacity-50 blur-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(188,165,138,0.15) 0%, transparent 60%)' }}
              />

              {/* Success Image (No Text) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative mb-8 flex justify-center w-full"
              >
                <div className="w-60 h-60 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] relative group-hover:scale-105 transition-transform duration-700 ease-out z-10">
                  <img
                    src="/Images/contact.png"
                    alt="Success Character"
                    className="w-full h-full object-contain object-bottom relative z-10"
                    style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-0"
              >

                <button
                  onClick={() => setView('customer-home')}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors duration-500 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative text-[10px] tracking-[0.3em] uppercase text-white font-semibold">
                    Return to Store
                  </span>
                  <ArrowRight size={14} className="relative text-[#D4AF37] group-hover:translate-x-1 transition-transform duration-500" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Bottom Gold Trim */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </motion.div>

      {/* Auth Required Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 pt-24 sm:pt-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-[#FAF9F6] p-6 sm:p-8 md:p-12 max-w-[400px] w-full border border-[#D4AF37]/30 text-center relative overflow-hidden mx-3 sm:mx-4"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
            >
              {/* Modal Background Glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top center, #D4AF37 0%, transparent 70%)' }}
              />

              <div className="w-16 h-16 rounded-full bg-[#1A0008]/5 flex items-center justify-center text-[#D4AF37] mx-auto mb-6 relative z-10 border border-[#D4AF37]/20">
                <User size={28} strokeWidth={1.5} />
              </div>

              <h3 className="text-3xl font-light text-[#1A0008] mb-3 relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Login Required
              </h3>
              <p className="text-[13px] text-[#1A0008]/60 mb-8 relative z-10 leading-relaxed font-light">
                Please sign in to your Gurnaaz account to send us a message. It helps us serve you better!
              </p>

              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    setView('login');
                  }}
                  className="w-full bg-[#1A0008] text-white py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] transition-colors duration-300"
                >
                  Log In Now
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A0008]/40 font-semibold hover:text-[#1A0008] transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

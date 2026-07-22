import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Check, ArrowRight } from 'lucide-react';

export default function LoginSignup({ setView, onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [focusedField, setFocusedField] = useState(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) interval = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleOtpChange = (index, val) => {
    if (val.length > 1) return;
    const next = [...otpCode];
    next[index] = val;
    setOtpCode(next);
    if (val && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: form.email.split('@')[0], email: form.email, phone: '' });
    }, 1200);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    const code = otpCode.join('');
    if (code.length !== 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: form.name, email: form.email, phone: form.phone });
    }, 1000);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: 'Google User', email: 'user@gmail.com', phone: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden flex flex-col">

      {/* Back button — top left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <button
          onClick={() => setView('customer-home')}
          className="flex items-center gap-2 text-[#111111]/30 hover:text-[#BCA58A] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] tracking-[0.25em] uppercase hidden sm:inline">Back</span>
        </button>
      </div>

      {/* Brand wordmark — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <button onClick={() => setView('customer-home')} className="cursor-pointer">
          <span className="text-[14px] font-bold tracking-[0.15em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            GURNAAZ
          </span>
        </button>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-[400px]">

          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Heading */}
                <div className="text-center mb-12">
                  <h1 className="text-[48px] md:text-[56px] font-light leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-[13px] text-[#111111]/30 font-light">
                    {mode === 'login'
                      ? 'Sign in to your Gurnaaz account.'
                      : 'Join India\'s finest ethnic wear destination.'}
                  </p>
                </div>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full border border-[#111111]/8 rounded-full py-3.5 flex items-center justify-center gap-3 hover:border-[#BCA58A]/40 hover:bg-white transition-all duration-300 cursor-pointer mb-8"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[12px] text-[#111111]/50 font-medium">Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-[#111111]/6" />
                  <span className="text-[9px] tracking-[0.3em] text-[#111111]/15 uppercase">or</span>
                  <div className="flex-1 h-px bg-[#111111]/6" />
                </div>

                {/* Form */}
                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => update('name', e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Full Name"
                          className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                  />

                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => update('phone', e.target.value)}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Phone Number"
                          className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Password"
                      className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 pr-10 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#111111]/15 hover:text-[#BCA58A] transition-colors cursor-pointer p-1">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="flex justify-end -mt-1">
                      <button type="button" className="text-[11px] text-[#111111]/25 hover:text-[#BCA58A] transition-colors cursor-pointer">
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-[#111111] text-white py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#BCA58A] disabled:opacity-40 transition-all duration-500 cursor-pointer mt-6 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={13} className="opacity-50" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Terms */}
                {mode === 'signup' && (
                  <p className="text-[10px] text-[#111111]/18 text-center mt-6 leading-relaxed">
                    By signing up, you agree to our{' '}
                    <button onClick={() => setView('privacy')} className="text-[#BCA58A]/50 hover:text-[#BCA58A] cursor-pointer underline underline-offset-2">Privacy Policy</button>.
                  </p>
                )}

                {/* Toggle */}
                <div className="mt-10 pt-8 text-center">
                  <p className="text-[12px] text-[#111111]/25">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-[#BCA58A] font-medium hover:underline cursor-pointer"
                    >
                      {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ═══════ OTP ═══════ */
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-center mb-12">
                  <h1 className="text-[48px] md:text-[56px] font-light leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Check Your Email
                  </h1>
                  <p className="text-[13px] text-[#111111]/30 font-light">
                    We sent a 4-digit code to{' '}
                    <span className="text-[#111111]/50">{form.email}</span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div className="flex items-center justify-center gap-3 mb-10">
                  {otpCode.map((digit, i) => (
                    <motion.input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="w-16 h-[72px] text-center text-[32px] font-light border-b-2 border-[#111111]/8 focus:border-[#BCA58A] bg-transparent outline-none transition-colors duration-300"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={handleVerifyOtp}
                  disabled={loading || otpCode.join('').length !== 4}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#111111] text-white py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#BCA58A] disabled:opacity-30 transition-all duration-500 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={14} /> Verify
                    </>
                  )}
                </motion.button>

                <div className="text-center mt-8 space-y-3">
                  {timer > 0 ? (
                    <p className="text-[12px] text-[#111111]/20">
                      Resend in <span className="text-[#111111]/40 tabular-nums">{timer}s</span>
                    </p>
                  ) : (
                    <button onClick={handleSignup} className="text-[12px] text-[#BCA58A] hover:underline cursor-pointer">
                      Resend Code
                    </button>
                  )}
                  <button
                    onClick={() => { setOtpSent(false); setOtpCode(['', '', '', '']); }}
                    className="block w-full text-[11px] text-[#111111]/20 hover:text-[#BCA58A] transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-5">
        <p className="text-[10px] text-[#111111]/15 tracking-wide">&copy; 2026 Gurnaaz</p>
        <button onClick={() => setView('privacy')} className="text-[10px] text-[#111111]/15 hover:text-[#BCA58A] transition-colors cursor-pointer tracking-wide">
          Privacy
        </button>
      </div>
    </div>
  );
}

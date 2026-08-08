import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

const P = '#111111';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!auth) {
      setError('Firebase Auth not initialized.');
      setLoading(false);
      return;
    }

    try {
      // Try to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AdminApp will detect the auth state and set isLoggedIn
    } catch (err) {
      console.error('Sign-in error:', err.code, err.message);

      // If user doesn't exist in Firebase Auth, create them (first-time setup)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('Admin user created in Firebase Auth:', userCredential.user.uid);
          // onAuthStateChanged will handle the rest
        } catch (createErr) {
          console.error('Create user error:', createErr.code, createErr.message);
          if (createErr.code === 'auth/email-already-in-use') {
            setError('Incorrect password. Please try again.');
          } else if (createErr.code === 'auth/weak-password') {
            setError('Password must be at least 6 characters.');
          } else if (createErr.code === 'auth/invalid-email') {
            setError('Invalid email address.');
          } else {
            setError(createErr.message || 'Login failed. Please try again.');
          }
          setLoading(false);
        }
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
        setLoading(false);
      } else {
        setError(err.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAF9F6' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm sm:max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${P}, #111111)`, boxShadow: `0 8px 24px rgba(17,17,17,0.3)` }}
          >
            <Sparkles size={22} className="text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-light text-[#1A1A1A] mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Gurnaaz Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#6B8C90]">Sign in to access your dashboard</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-[#E8DDD0]/60"
          style={{ boxShadow: '0 20px 60px rgba(17,17,17,0.1)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1.5 sm:mb-2"
                style={{ color: P }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: P }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="madhavarora132005@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#A8BCBE] border border-[#E8DDD0] bg-[#FAF9F6] focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.12)`; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAF9F6'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1.5 sm:mb-2"
                style={{ color: P }}
              >
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: P }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#A8BCBE] border border-[#E8DDD0] bg-[#FAF9F6] focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.12)`; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAF9F6'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: showPass ? P : '#9EA8A9' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] sm:text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white flex items-center justify-center gap-2 disabled:opacity-70 transition-all mt-2"
              style={{
                background: `linear-gradient(135deg, ${P}, #111111)`,
                boxShadow: `0 6px 24px rgba(17,17,17,0.35)`,
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                'Sign In to Dashboard'
              )}
            </motion.button>
          </form>

          <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-[#E8DDD0] text-center">
            <p className="text-[9px] sm:text-xs text-[#A8BCBE] tracking-widest uppercase">
              Gurnaaz Ethnic Wear · Admin Portal
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

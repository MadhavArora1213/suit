import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Check, ArrowRight, AlertCircle, X } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isValidPhoneNumber } from 'libphonenumber-js';

export default function LoginSignup({ setView, onLoginSuccess }) {
  const [mode, setMode] = useState(window.location.pathname === '/signup' ? 'signup' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [focusedField, setFocusedField] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const [form, setForm] = useState({ name: '', email: '', phone: '', countryCode: 'IN', password: '' });
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(() => parseInt(localStorage.getItem('gurnaaz_login_attempts') || '0'));
  const [lockoutUntil, setLockoutUntil] = useState(() => parseInt(localStorage.getItem('gurnaaz_lockout_until') || '0'));

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const getErrorImage = (errorText) => {
    if (!errorText) return "/Images/error_character.png";
    if (errorText.includes("already have an account")) return "/Images/error_registered.png";
    if (errorText.includes("Incorrect email")) return "/Images/error_invalid_credentials.png";
    if (errorText.includes("code you entered is incorrect")) return "/Images/error_invalid_otp.png";
    if (errorText.includes("valid email")) return "/Images/error_invalid_email.png";
    return "/Images/error_character.png"; // Fallback
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone, countryCode) => {
    if (!phone) return false;
    try {
      return isValidPhoneNumber(phone, countryCode);
    } catch (error) {
      return false;
    }
  };
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleRateLimitFail = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('gurnaaz_login_attempts', newAttempts.toString());
    
    if (newAttempts >= 5) {
      const lockoutTime = Date.now() + 15 * 60 * 1000; // 15 minutes
      setLockoutUntil(lockoutTime);
      localStorage.setItem('gurnaaz_lockout_until', lockoutTime.toString());
    }
  };

  const checkRateLimit = () => {
    if (lockoutUntil > Date.now()) {
      const remainingMins = Math.ceil((lockoutUntil - Date.now()) / 60000);
      alert(`Too many failed attempts. Please try again in ${remainingMins} minutes.`);
      return false;
    }
    return true;
  };

  const handleSuccessAuth = (profile) => {
    setLoginAttempts(0);
    localStorage.removeItem('gurnaaz_login_attempts');
    localStorage.removeItem('gurnaaz_lockout_until');
    onLoginSuccess(profile);
  };

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
    if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!checkRateLimit()) return;

    const sanitizedEmail = form.email.trim();
    if (!validateEmail(sanitizedEmail)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, form.password);
      
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      let userProfile = { name: form.email.split('@')[0], email: form.email, phone: '' };
      
      if (userDoc.exists()) {
        userProfile = userDoc.data();
      }
      
      handleSuccessAuth(userProfile);
    } catch (error) {
      console.error("Login error:", error);
      handleRateLimitFail();
      setErrors({ form: 'Incorrect email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const sanitizedEmail = form.email.trim();
    if (!validateEmail(sanitizedEmail)) {
      setErrors({ email: 'Please enter your email address first to reset password.' });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, sanitizedEmail);
      alert("Success! A password reset link has been sent to your email. Please check your inbox.");
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({ form: "Error sending reset email. Please make sure you have an account." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!checkRateLimit()) return;

    const sanitizedEmail = form.email.trim();
    const sanitizedName = form.name.trim();
    const newErrors = {};

    if (!sanitizedName) newErrors.name = 'Full name is required.';
    if (!validateEmail(sanitizedEmail)) newErrors.email = 'Please enter a valid email address.';
    if (!validatePhone(form.phone, form.countryCode)) newErrors.phone = 'Please enter a valid phone number for the selected country.';
    if (!validatePassword(form.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update form state with sanitized values before OTP
    setForm(prev => ({ ...prev, email: sanitizedEmail, name: sanitizedName }));

    setLoading(true);

    // Check if email already exists in Firebase Auth before sending OTP
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, sanitizedEmail);
      if (signInMethods && signInMethods.length > 0) {
        setErrors({ form: 'Looks like you already have an account! Please log in instead.' });
        setLoading(false);
        return; // STOP execution
      }
    } catch (error) {
      console.error("Email check error:", error);
      setErrors({ form: 'Firebase Security Error: Please disable "Email Enumeration Protection" in your Firebase Authentication Settings to allow sign-ups.' });
      setLoading(false);
      return; // STOP execution so OTP is NEVER sent
    }

    // Generate a random 6 digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': import.meta.env.VITE_BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Gurnaaz', email: 'madhavarora132005@gmail.com' }, // Make sure this is a verified sender in Brevo
        to: [{ email: sanitizedEmail, name: sanitizedName }],
        subject: 'Your Gurnaaz Verification Code',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 40px 20px; color: #111111; }
            .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); text-align: center; border-top: 4px solid #BCA58A; }
            .logo { font-size: 20px; font-weight: 700; letter-spacing: 0.2em; color: #111111; margin-bottom: 30px; text-transform: uppercase; }
            .title { font-size: 22px; font-weight: 300; margin-bottom: 15px; color: #111111; }
            .text { color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
            .otp-box { background-color: #FAF9F6; border: 1px solid #EAEAEA; padding: 24px; font-size: 38px; font-weight: 600; letter-spacing: 0.15em; color: #BCA58A; margin: 30px 0; border-radius: 6px; }
            .footer { margin-top: 40px; font-size: 11px; color: #999999; line-height: 1.6; text-transform: uppercase; letter-spacing: 0.1em; }
          </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">Gurnaaz</div>
              <div class="title">Email Verification</div>
              <div class="text">
                Welcome to Gurnaaz! To complete your registration and discover our premium handcrafted ethnic wear, please use the following verification code:
              </div>
              <div class="otp-box">${newOtp}</div>
              <div class="text" style="font-size: 13px;">
                This code is valid for the next 10 minutes. If you did not request this, please safely ignore this email.
              </div>
              <div class="footer">
                &copy; 2026 Gurnaaz. All rights reserved.
              </div>
            </div>
          </body>
          </html>
        `
      })
    })
    .then(async (res) => {
      if (res.ok) {
        setOtpSent(true);
        setTimer(60);
      } else {
        const errorData = await res.json();
        console.error('Brevo Error:', errorData);
        setErrors({ form: 'Oops! We had trouble sending the email. Please try again later.' });
      }
    })
    .catch((err) => {
      console.error('Network Error:', err);
      setErrors({ form: 'Network error. Please check your internet connection and try again.' });
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleVerifyOtp = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) return;
    
    if (code !== generatedOtp) {
      setErrors({ form: 'The code you entered is incorrect. Please check your email and try again.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Actually create the user in Firebase now that "OTP" is verified
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      const userProfile = {
        uid: userCredential.user.uid,
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        role: 'customer',
        createdAt: serverTimestamp()
      };

      // Store in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      handleSuccessAuth(userProfile);
    } catch (error) {
      console.error("Signup error:", error);
      handleRateLimitFail();
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      let userProfile = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email,
        phone: userCredential.user.phoneNumber || '',
        role: 'customer'
      };

      if (!userDoc.exists()) {
        // Create new user profile if first time logging in
        userProfile.createdAt = serverTimestamp();
        await setDoc(userRef, userProfile);
      } else {
        userProfile = userDoc.data();
      }
      
      handleSuccessAuth(userProfile);
    } catch (error) {
      console.error("Google Auth error:", error);
      handleRateLimitFail();
      setErrors({ form: "Google Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
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
        
        {/* Centered Character Error Modal */}
        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#111111]/30 backdrop-blur-sm"
              onClick={() => setErrors(prev => ({ ...prev, form: '' }))}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[360px] aspect-square flex items-center justify-center bg-transparent"
                onClick={e => e.stopPropagation()}
              >
                {/* The Character Image containing baked-in text */}
                <img 
                  src={`${getErrorImage(errors.form)}?v=1`} 
                  alt="Notice" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Close Button Floating Top Right */}
                <button 
                  onClick={() => setErrors(prev => ({ ...prev, form: '' }))}
                  className="absolute top-4 right-4 bg-white/40 hover:bg-white/60 text-[#111111] rounded-full p-2 backdrop-blur-md shadow-sm transition-all"
                >
                  <X size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
                        <div className="relative">
                          <input
                            type="text"
                            value={form.name}
                            onChange={e => update('name', e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Full Name"
                            className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                          />
                          {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                  </div>

                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                        <div className="relative flex gap-3">
                          
                          {/* Country Code Dropdown */}
                          <div className="w-[100px] shrink-0 border-b border-[#111111]/8 focus-within:border-[#BCA58A] transition-colors relative">
                            <select 
                              value={form.countryCode} 
                              onChange={e => update('countryCode', e.target.value)}
                              className="w-full bg-transparent outline-none py-3.5 text-[14px] text-[#111111] appearance-none cursor-pointer pr-6"
                            >
                              <option value="IN">🇮🇳 +91</option>
                              <option value="US">🇺🇸 +1</option>
                              <option value="GB">🇬🇧 +44</option>
                              <option value="AE">🇦🇪 +971</option>
                              <option value="AU">🇦🇺 +61</option>
                              <option value="CA">🇨🇦 +1</option>
                            </select>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#111111]/40 text-[10px]">
                              ▼
                            </div>
                          </div>

                          {/* Phone Input */}
                          <div className="flex-1 relative">
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={e => update('phone', e.target.value)}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Phone Number"
                              className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                            />
                          </div>
                        </div>
                        {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative mb-6">
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
                    {errors.password && <span className="text-red-500 text-xs mt-1 block leading-tight">{errors.password}</span>}
                  </div>

                  {mode === 'login' && (
                    <div className="flex justify-end -mt-1">
                      <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="text-[11px] text-[#111111]/25 hover:text-[#BCA58A] transition-colors cursor-pointer"
                      >
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
                      onClick={() => {
                        const next = mode === 'login' ? 'signup' : 'login';
                        setMode(next);
                        window.history.pushState(null, '', `/${next}`);
                      }}
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
                    We sent a 6-digit code to{' '}
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
                  disabled={loading || otpCode.join('').length !== 6}
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
                    onClick={() => { setOtpSent(false); setOtpCode(['', '', '', '', '', '']); }}
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

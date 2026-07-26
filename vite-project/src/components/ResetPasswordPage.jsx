import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';

export default function ResetPasswordPage({ setView }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [oobCode, setOobCode] = useState(null);
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(true);

  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  useEffect(() => {
    // Parse the oobCode from the URL
    const params = new URLSearchParams(window.location.search);
    let code = params.get('oobCode');
    
    // For local testing/development without a real token
    if (!code && window.location.hostname === 'localhost') {
        // Fallback for UI testing
        setVerifying(false);
        setEmail("testuser@example.com");
        return;
    }

    if (!code) {
      setError("Invalid or missing password reset link.");
      setVerifying(false);
      return;
    }

    setOobCode(code);

    // Verify the code and get the user's email
    verifyPasswordResetCode(auth, code)
      .then((userEmail) => {
        setEmail(userEmail);
        setVerifying(false);
      })
      .catch((err) => {
        console.error("Token verification error:", err);
        setError("Your password reset link is invalid or has expired. Please request a new one.");
        setVerifying(false);
      });
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (error) return; // Don't submit if token is invalid

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, newPassword);
      }
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An error occurred while resetting your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative overflow-hidden flex flex-col">
      {/* Back button */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <button
          onClick={() => {
            setView('login');
            window.history.pushState(null, '', '/login');
          }}
          className="flex items-center gap-2 text-[#111111]/30 hover:text-[#BCA58A] transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] tracking-[0.25em] uppercase hidden sm:inline">Back to Login</span>
        </button>
      </div>

      {/* Brand wordmark */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <button onClick={() => setView('customer-home')} className="cursor-pointer">
          <span className="text-[14px] font-bold tracking-[0.15em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            GURNAAZ
          </span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        
        {/* Error Modal (re-using the character style for consistency) */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#111111]/30 backdrop-blur-sm"
              onClick={() => setError('')}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[360px] aspect-square flex items-center justify-center bg-transparent"
                onClick={e => e.stopPropagation()}
              >
                <img 
                  src={`/Images/error_character.png?v=1`} 
                  alt="Notice" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Fallback CSS overlay since we didn't generate an image for every custom reset error */}
                <div className="absolute top-[53%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[38%] text-center flex flex-col items-center justify-center">
                  <p className="text-[10px] sm:text-[11px] text-[#4A3B2C] font-semibold leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {error}
                  </p>
                </div>

                <button 
                  onClick={() => setError('')}
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
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#BCA58A]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#BCA58A]">
                  <Check size={28} />
                </div>
                <h1 className="text-[40px] md:text-[48px] font-light leading-none mb-4 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Password Reset
                </h1>
                <p className="text-[13px] text-[#111111]/50 font-light mb-10 leading-relaxed">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </p>
                <button
                  onClick={() => {
                    setView('login');
                    window.history.pushState(null, '', '/login');
                  }}
                  className="w-full bg-[#111111] text-white py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#BCA58A] transition-colors cursor-pointer"
                >
                  Sign In Now
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-center mb-12">
                  <h1 className="text-[44px] md:text-[52px] font-light leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Reset Password
                  </h1>
                  {verifying ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-5 h-5 border-2 border-[#BCA58A]/30 border-t-[#BCA58A] rounded-full animate-spin mb-3" />
                      <p className="text-[13px] text-[#111111]/40 font-light">Verifying your secure link...</p>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#111111]/40 font-light">
                      Create a new password for <br/><span className="text-[#111111]">{email}</span>
                    </p>
                  )}
                </div>

                {!verifying && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => {
                          setNewPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="New Password"
                        className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 pr-10 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#111111]/15 hover:text-[#BCA58A] transition-colors cursor-pointer p-1">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    <div className="relative mb-8">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => {
                          setConfirmPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="Confirm New Password"
                        className="w-full bg-transparent border-b border-[#111111]/8 focus:border-[#BCA58A] outline-none py-3.5 pr-10 text-[14px] text-[#111111] placeholder:text-[#111111]/20 font-light transition-colors"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-[#111111] text-white py-4 rounded-full text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#BCA58A] disabled:opacity-40 transition-all duration-500 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Reset Password'
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

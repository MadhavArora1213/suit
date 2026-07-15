import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, User, Mail } from 'lucide-react';
import { saveUserData } from '../firebase';
import { sendBrevoOtp } from '../brevo';

export default function LoginPage({ setView, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    // Define the global listener required by Phone.Email
    window.phoneEmailListener = (userObj) => {
      const user_json_url = userObj.user_json_url;
      setLoading(true);
      
      fetch(user_json_url)
        .then((res) => res.json())
        .then((data) => {
          const verifiedPhone = data.user_phone_number || '';
          const userProfile = {
            name: isRegister ? name : (data.user_first_name ? `${data.user_first_name} ${data.user_last_name}` : 'Gurnaaz Member'),
            phone: verifiedPhone,
            email: isRegister ? email : 'member@gurnaaz.com',
          };
          saveUserData(userProfile).then(() => {
            onLoginSuccess(userProfile);
          });
        })
        .catch((err) => {
          console.error("Error fetching user data from user_json_url", err);
          // Fallback if CORS block occurs in frontend
          const userProfile = {
            name: isRegister ? name : 'Gurnaaz Member',
            phone: 'Verified Phone',
            email: isRegister ? email : 'member@gurnaaz.com',
          };
          saveUserData(userProfile).then(() => {
            onLoginSuccess(userProfile);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Load or reload Phone.Email sign-in script
    const scriptId = 'phone-email-script';
    let script = document.getElementById(scriptId);
    if (script) {
      script.remove();
    }
    script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://www.phone.email/sign_in_button_v1.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script) {
        script.remove();
      }
      delete window.phoneEmailListener;
    };
  }, [isRegister, name, email]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendEmailOtp = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setLoading(true);

    sendBrevoOtp(loginEmail, code).then((sentSuccessfully) => {
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
      if (sentSuccessfully) {
        alert(`Verification OTP code sent to your email address!`);
      } else {
        alert(`[Brevo Demo Mode] OTP sent to email! For testing, use code: ${code}`);
      }
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== generatedOtp) {
      alert(`Invalid OTP. Please enter ${generatedOtp}.`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userProfile = {
        name: 'Gurnaaz Member',
        phone: 'Linked Phone',
        email: loginEmail,
      };
      saveUserData(userProfile).then(() => {
        onLoginSuccess(userProfile);
      });
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[480px] mx-auto px-6 pt-36 pb-24 min-h-[80vh] flex flex-col justify-center text-[#111111]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="bg-white border border-[#BCA58A]/20 p-8 md:p-10 shadow-2xl relative rounded">
        {/* Back Button */}
        <button 
          onClick={() => window.location.href = '/sell'} 
          className="absolute top-6 left-6 text-[#6B6B6B] hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        <div className="text-center mb-6 mt-4">
          <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase font-bold">Join Gurnaaz</span>
          <h2 className="text-4xl font-light text-[#111111] mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {otpSent ? 'Verify OTP' : isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-2">
            {otpSent 
              ? `We've sent a 4-digit code to ${loginEmail}` 
              : 'Access your luxury shopping bag, order tracking, & history.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!otpSent ? (
            <motion.div 
              key="form-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Method Switcher Tabs (Only for Login) */}
              {!isRegister && (
                <div className="flex border-b border-[#BCA58A]/20 pb-3 mb-2 gap-4 text-xs font-bold uppercase tracking-wider justify-center">
                  <button 
                    onClick={() => setLoginMethod('phone')} 
                    className={`pb-1 transition-colors cursor-pointer ${loginMethod === 'phone' ? 'text-[#BCA58A] border-b-2 border-[#BCA58A]' : 'text-[#6B6B6B] hover:text-[#111111]'}`}
                  >
                    Login with Phone
                  </button>
                  <button 
                    onClick={() => setLoginMethod('email')} 
                    className={`pb-1 transition-colors cursor-pointer ${loginMethod === 'email' ? 'text-[#BCA58A] border-b-2 border-[#BCA58A]' : 'text-[#6B6B6B] hover:text-[#111111]'}`}
                  >
                    Login with Email
                  </button>
                </div>
              )}

              {isRegister ? (
                /* Registration Fields */
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BCA58A]" size={16} />
                      <input 
                        type="text" 
                        required
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Gurpreet Singh"
                        className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none pl-11 pr-4 py-3.5 text-sm transition-colors rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BCA58A]" size={16} />
                      <input 
                        type="email" 
                        required
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@gurnaaz.com"
                        className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none pl-11 pr-4 py-3.5 text-sm transition-colors rounded"
                      />
                    </div>
                  </div>

                  {/* Register Verification Button via Phone.Email */}
                  <div className="pt-2 text-center">
                    <p className="text-xs text-[#6B6B6B] mb-3">To complete registration, please verify your phone number:</p>
                    <div className="flex justify-center">
                      <div className="pe_signin_button" data-client-id="11746701488860563525"></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Login Fields */
                loginMethod === 'phone' ? (
                  <div className="py-4 text-center space-y-3">
                    <p className="text-xs text-[#6B6B6B]">Click below to sign in with your phone number securely via Phone.Email:</p>
                    <div className="flex justify-center">
                      <div className="pe_signin_button" data-client-id="11746701488860563525"></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendEmailOtp} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BCA58A]" size={16} />
                        <input 
                          type="email" 
                          required
                          value={loginEmail} 
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. name@gurnaaz.com"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none pl-11 pr-4 py-3.5 text-sm transition-colors rounded"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#BCA58A] hover:bg-[#9A8268] disabled:bg-[#BCA58A]/50 text-[#FAF9F6] py-4 text-xs font-bold tracking-[0.25em] shadow-lg transition-colors cursor-pointer uppercase rounded"
                    >
                      {loading ? 'SENDING OTP...' : 'SEND OTP'}
                    </button>
                  </form>
                )
              )}

              <p className="text-xs text-center text-[#6B6B6B] mt-4 pt-2 border-t border-[#BCA58A]/10">
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                  type="button" 
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[#BCA58A] hover:underline font-bold cursor-pointer"
                >
                  {isRegister ? 'Log In' : 'Register'}
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.form 
              key="otp-form"
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block text-center">
                  Verification Code
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BCA58A]" size={16} />
                  <input 
                    type="text" 
                    required
                    maxLength={4}
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none pl-11 pr-4 py-3.5 text-center text-lg tracking-[0.5em] font-bold transition-colors rounded"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-[#BCA58A] disabled:bg-[#111111]/50 text-[#FAF9F6] py-4 text-xs font-bold tracking-[0.25em] shadow-lg transition-colors cursor-pointer uppercase rounded"
              >
                {loading ? 'VERIFYING...' : 'VERIFY & REGISTER'}
              </button>

              <div className="text-center text-xs text-[#6B6B6B]">
                {timer > 0 ? (
                  <span>Resend OTP in <strong className="text-[#111111]">{timer}s</strong></span>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSendEmailOtp}
                    className="text-[#BCA58A] hover:underline font-bold cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              <button 
                type="button" 
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-[#6B6B6B] hover:text-[#111111] underline cursor-pointer mt-2"
              >
                Change Email
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveWaitlistEmail, onWaitlistUpdate } from '../firebase';
import { sendBrevoOtp, sendWaitlistWelcomeEmail, generateOtp } from '../brevo';

const TOTAL_SEATS = 1000;

const MARKETING_LINES = [
  "Your wardrobe is about to get a whole lot more interesting.",
  "We don't sell suits. We craft stories you wear.",
  "1,247 women already asked us — \"When are you launching?\"",
  "Hand-block prints. Real zari. No shortcuts.",
  "The suit your mother wore to your parent's wedding? We elevated it.",
  "While fast fashion copies, we create.",
  "Each piece takes 40+ hours of handwork. You'll feel every stitch.",
  "Your Diwali outfit sorted — 3 months before everyone else.",
  "Premium ethnic wear without the premium ego.",
  "We asked 500 women what they want. The answer: something real.",
  "Banarasi silk that doesn't cost a month's salary.",
  "Your grandmother's taste. Your generation's speed.",
  "We're not for everyone. We're for you.",
  "First 100 members get a handwritten note from our founder.",
  "The collection that'll make your friends ask \"where did you get that?\"",
];

const STORAGE_KEY = 'gurnaaz_waitlist_line_index';

function getNextLineIndex() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const lastIndex = stored !== null ? parseInt(stored, 10) : -1;
    const nextIndex = (lastIndex + 1) % MARKETING_LINES.length;
    localStorage.setItem(STORAGE_KEY, nextIndex.toString());
    return nextIndex;
  } catch {
    return Math.floor(Math.random() * MARKETING_LINES.length);
  }
}

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1=name, 2=email, 3=otp, 4=success
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [seatsLeft, setSeatsLeft] = useState(TOTAL_SEATS);
  const [animatedCount, setAnimatedCount] = useState(TOTAL_SEATS);
  const [joinedBefore, setJoinedBefore] = useState(0);
  const [lineIndex] = useState(() => getNextLineIndex());
  const prevCountRef = useRef(TOTAL_SEATS);

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const unsubscribe = onWaitlistUpdate((count) => {
      const newSeats = Math.max(0, TOTAL_SEATS - count);
      setSeatsLeft(newSeats);
      setJoinedBefore(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (animatedCount === seatsLeft) return;
    const start = prevCountRef.current;
    const end = seatsLeft;
    prevCountRef.current = end;
    if (start === end) return;
    const duration = 800;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [seatsLeft]);

  // OTP resend timer
  useEffect(() => {
    if (otpResendTimer <= 0) return;
    const timer = setInterval(() => {
      setOtpResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpResendTimer]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || otpSending) return;
    setOtpSending(true);
    setError('');
    try {
      // Generate and send OTP
      const otp = generateOtp();
      setGeneratedOtp(otp);
      const sent = await sendBrevoOtp(email.trim().toLowerCase(), otp);
      if (sent) {
        setStep(3);
        setOtpResendTimer(60);
        // Auto-focus first OTP input
        setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
      } else {
        setError("Failed to send verification code. Please try again.");
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(''), 3000);
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otpInput];
    newOtp[index] = value.slice(-1); // only last char
    setOtpInput(newOtp);
    setError('');
    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtpInput(newOtp);
    // Focus last filled or next empty
    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleOtpVerify = async () => {
    const enteredOtp = otpInput.join('');
    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setOtpVerifying(true);
    setError('');

    // Verify OTP
    if (enteredOtp !== generatedOtp) {
      setError("Invalid code. Please check and try again.");
      setOtpVerifying(false);
      return;
    }

    // OTP correct — save to Firebase and send welcome email
    try {
      const saved = await saveWaitlistEmail(email.trim().toLowerCase(), name.trim());
      if (saved) {
        console.log("Email verified and saved to Firebase!");
        sendWaitlistWelcomeEmail(email.trim().toLowerCase(), name.trim()).catch(() => {});
        setStep(4);
      } else {
        setError("You're already on the list! We'll be in touch soon.");
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(''), 3000);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpResendTimer > 0) return;
    setOtpSending(true);
    setError('');
    try {
      const otp = generateOtp();
      setGeneratedOtp(otp);
      const sent = await sendBrevoOtp(email.trim().toLowerCase(), otp);
      if (sent) {
        setOtpResendTimer(60);
        setOtpInput(['', '', '', '', '', '']);
        otpInputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch (err) {
      setError("Failed to resend code.");
    } finally {
      setOtpSending(false);
    }
  };

  const urgencyColor = animatedCount <= 100 ? 'text-red-400' : animatedCount <= 300 ? 'text-yellow-400' : 'text-[#BCA58A]';
  const firstName = name.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#BCA58A]/5 via-transparent to-[#BCA58A]/3" />
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#BCA58A]/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-[#BCA58A]/4 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-1/3 w-40 h-40 sm:w-64 sm:h-64 bg-[#BCA58A]/2 rounded-full blur-[150px]" />

      {/* Seats Counter — Fixed Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-20"
      >
        <div className="inline-flex items-center gap-2 sm:gap-3 border border-white/10 px-3 py-2 sm:px-5 sm:py-2.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${urgencyColor} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${animatedCount <= 100 ? 'bg-red-400' : animatedCount <= 300 ? 'bg-yellow-400' : 'bg-[#BCA58A]'}`}></span>
          </span>
          <span className="text-gray-500 text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className={`font-bold ${urgencyColor}`}>{animatedCount.toLocaleString()}</span>
            {' '}seats remaining
          </span>
        </div>
      </motion.div>

      {/* Main container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-6xl mx-auto pt-16 sm:pt-20 lg:pt-0">

        {/* Left: Character + Marketing Line (desktop only) */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex flex-col items-center gap-8 w-[340px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-52 h-52 xl:w-56 xl:h-56"
            >
              <img
                src="/Images/Pointing.png"
                alt="Gurnaaz"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-center px-2"
            >
              <p className="text-lg xl:text-xl leading-relaxed text-gray-300 max-w-[300px]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                "{MARKETING_LINES[lineIndex]}"
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full max-w-xl"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 sm:w-16 h-px bg-[#BCA58A]/50 mx-auto mb-6 sm:mb-10"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-[#BCA58A]/70 uppercase font-medium mb-4 sm:mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Gurnaaz
          </motion.p>

          {/* Mobile: Marketing Line */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="lg:hidden mb-4 sm:mb-6"
            >
              <p className="text-sm sm:text-base text-gray-400 italic text-center px-4 sm:px-6 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "{MARKETING_LINES[lineIndex]}"
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ===== STEP 1: Name ===== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-[#BCA58A]/50 uppercase mb-3 sm:mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Before we begin
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-2 leading-tight"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  Hey, Beautiful
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-16 sm:w-20 h-px bg-[#BCA58A]/30 mx-auto my-4 sm:my-5"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-3 max-w-xs sm:max-w-sm mx-auto font-light"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  You just found something most people are still searching for.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-gray-500 text-[11px] sm:text-xs leading-relaxed mb-6 sm:mb-10 max-w-[260px] sm:max-w-xs mx-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  But first — every great relationship starts with a name.
                  <br />
                  <span className="text-[#BCA58A]/60">Tell us yours.</span>
                </motion.p>

                <motion.form
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  onSubmit={handleNameSubmit}
                  className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    required
                    autoFocus
                    className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 bg-transparent border border-white/15 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#BCA58A]/50 transition-all duration-500 rounded-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#BCA58A] text-[#111111] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-[#BCA58A]/90 transition-all duration-500 rounded-none"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Continue
                  </motion.button>
                </motion.form>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] text-gray-600 tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="text-[#BCA58A]/50">✦</span>
                  {' '}Trusted by 1,247 women already
                  {' '}<span className="text-[#BCA58A]/50">✦</span>
                </motion.p>
              </motion.div>
            )}

            {/* ===== STEP 2: Email ===== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-[#BCA58A]/50 uppercase mb-3 sm:mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Almost there, {firstName}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2 leading-tight"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {firstName}, this is{' '}
                  <span className="text-[#BCA58A]">for you</span>
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-16 sm:w-20 h-px bg-[#BCA58A]/30 mx-auto my-4 sm:my-5"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-3 max-w-xs sm:max-w-sm mx-auto font-light"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  We're handpicking our first 1,000 members.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-gray-500 text-[11px] sm:text-xs leading-relaxed mb-6 sm:mb-10 max-w-[260px] sm:max-w-xs mx-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Drop your email and you're in, {firstName}.
                  <br />
                  <span className="text-[#BCA58A]/60">No spam. Just the good stuff.</span>
                </motion.p>

                <motion.form
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    disabled={isSaving}
                    className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 bg-transparent border border-white/15 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#BCA58A]/50 transition-all duration-500 rounded-none disabled:opacity-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <motion.button
                    whileHover={{ scale: isSaving ? 1 : 1.02 }}
                    whileTap={{ scale: isSaving ? 1 : 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#BCA58A] text-[#111111] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-[#BCA58A]/90 transition-all duration-500 rounded-none disabled:opacity-60"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {isSaving ? 'Reserving...' : 'Reserve My Spot'}
                  </motion.button>
                </motion.form>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-red-400/80 px-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ===== STEP 3: OTP Verification ===== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-[#BCA58A]/50 uppercase mb-3 sm:mb-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Verify your email
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2 leading-tight"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  Check your{' '}
                  <span className="text-[#BCA58A]">inbox</span>
                </motion.h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-16 sm:w-20 h-px bg-[#BCA58A]/30 mx-auto my-4 sm:my-5"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-2 max-w-xs sm:max-w-sm mx-auto font-light"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  We sent a 6-digit code to
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-[#BCA58A] text-xs sm:text-sm font-medium mb-6 sm:mb-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {email}
                </motion.p>

                {/* OTP Input Boxes */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex justify-center gap-2.5 sm:gap-3 mb-6"
                >
                  {otpInput.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpInputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 bg-transparent border border-white/15 text-white text-center text-lg sm:text-xl focus:outline-none focus:border-[#BCA58A]/50 transition-all duration-300 rounded-none"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  ))}
                </motion.div>

                {/* Verify Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ scale: otpVerifying ? 1 : 1.02 }}
                  whileTap={{ scale: otpVerifying ? 1 : 0.98 }}
                  onClick={handleOtpVerify}
                  disabled={otpVerifying || otpInput.join('').length !== 6}
                  className="w-full sm:w-auto px-10 py-3.5 sm:py-4 bg-[#BCA58A] text-[#111111] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:bg-[#BCA58A]/90 transition-all duration-500 rounded-none disabled:opacity-50"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {otpVerifying ? 'Verifying...' : 'Verify & Join'}
                </motion.button>

                {/* Resend */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-5 sm:mt-6"
                >
                  {otpResendTimer > 0 ? (
                    <p className="text-gray-600 text-[11px] sm:text-xs">
                      Resend code in <span className="text-[#BCA58A]/60">{otpResendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={otpSending}
                      className="text-gray-500 text-[11px] sm:text-xs hover:text-[#BCA58A] transition-colors cursor-pointer underline underline-offset-2"
                    >
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-red-400/80 px-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ===== STEP 4: Success ===== */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-8 rounded-full border-2 border-[#BCA58A]/40 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#BCA58A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4 leading-tight"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  You're In, {firstName}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 max-w-xs sm:max-w-sm mx-auto font-light px-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  You're among the first {joinedBefore.toLocaleString()} people to discover Gurnaaz.
                  We've sent a welcome note to your inbox.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 sm:mb-6"
                >
                  <img src="/Images/Holding_Bag.png" alt="Welcome" className="w-full h-full object-contain drop-shadow-lg" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="border border-[#BCA58A]/15 max-w-xs sm:max-w-sm mx-auto mb-8 sm:mb-10"
                >
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#BCA58A]/10">
                    <p className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-[#BCA58A]/60 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Your Exclusive Perks, {firstName}
                    </p>
                  </div>
                  <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-2.5 sm:space-y-3 text-left">
                    {[
                      'First access to the full collection',
                      'Exclusive launch-day pricing',
                      'Priority on limited-edition pieces',
                      'A handwritten thank-you with your first order',
                    ].map((perk, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                        className="flex items-start gap-2.5 sm:gap-3"
                      >
                        <span className="text-[#BCA58A] text-[10px] sm:text-xs mt-0.5">✦</span>
                        <span className="text-gray-400 text-[11px] sm:text-xs leading-relaxed">{perk}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                  className="text-gray-600 text-[10px] sm:text-[11px] italic px-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  "Every thread tells a story. We can't wait to share ours with you, {firstName}."
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust signals */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-10 sm:mt-14 lg:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-gray-700"
            >
              <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase">Handcrafted</span>
              <span className="w-1 h-1 rounded-full bg-[#BCA58A]/30" />
              <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase">Premium Fabrics</span>
              <span className="w-1 h-1 rounded-full bg-[#BCA58A]/30" />
              <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] uppercase">Limited Edition</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

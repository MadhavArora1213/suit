import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 'occasion',
    title: 'What is the occasion?',
    image: 'https://images.unsplash.com/photo-1583391733958-69279541a5d6?auto=format&fit=crop&q=80&w=1200',
    options: ['Wedding Guest', 'Festive Celebration', 'Casual Elegance', 'Evening Soirée']
  },
  {
    id: 'color',
    title: 'Your color palette?',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
    options: ['Soft Pastels', 'Deep Jewels', 'Ivory & Gold', 'Vibrant Hues']
  },
  {
    id: 'fabric',
    title: 'Preferred fabric?',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1200',
    options: ['Pure Georgette', 'Rich Banarasi', 'Plush Velvet', 'Breathable Cotton']
  },
  {
    id: 'size',
    title: 'Your standard size?',
    image: 'https://images.unsplash.com/photo-1584324087538-4e09581bd051?auto=format&fit=crop&q=80&w=1200',
    options: ['XS', 'S', 'M', 'L', 'XL', 'Custom Tailored']
  },
  {
    id: 'budget',
    title: 'Your investment?',
    image: 'https://images.unsplash.com/photo-1605022600390-071c6f969d32?auto=format&fit=crop&q=80&w=1200',
    options: ['Under ₹3,000', '₹3,000 - ₹8,000', 'The Prestige Collection']
  }
];

export default function AiOutfitFinder() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 500);
    } else {
      setTimeout(() => setIsRevealing(true), 500);
    }
  };

  const closeAndReset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setIsRevealing(false);
    }, 500);
  };

  return (
    <>
      {/* ─── TEXT-MASK USP BANNER (EXTRAORDINARY ELEGANCE) ─── */}
      <section className="w-full bg-[#0a0a0a] py-20 md:py-28 relative overflow-hidden flex flex-col items-center justify-center border-y border-[#BCA58A]/10">
        
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#BCA58A]/5 rounded-full blur-[120px]" />
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
          
          {/* Small Top Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="w-8 h-px bg-[#BCA58A]" />
            <span className="text-[#BCA58A] text-[10px] uppercase tracking-[0.4em] font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Innovation</span>
            <div className="w-8 h-px bg-[#BCA58A]" />
          </motion.div>

          {/* MASSIVE TEXT MASK */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[70px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black uppercase tracking-tighter leading-none mb-6 text-transparent bg-clip-text select-none"
            style={{ 
              backgroundImage: "url('/designer_suit_1.png')",
              backgroundSize: "150% auto",
              backgroundPosition: "center 20%",
              // Adding a subtle stroke so the text outline is always crisp even if the image is dark
              WebkitTextStroke: "1px rgba(188, 165, 138, 0.2)"
            }}
          >
            <motion.span
               animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="bg-clip-text text-transparent inline-block w-full"
               style={{ 
                 backgroundImage: "url('/designer_suit_1.png')",
                 backgroundSize: "150% auto",
               }}
            >
              AI STYLIST
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-white/80 text-2xl md:text-4xl font-light mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Find your perfect <span className="italic text-[#BCA58A]">masterpiece.</span>
          </motion.p>
          
          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <button 
              onClick={() => setIsOpen(true)}
              className="group relative px-12 py-5 bg-transparent border border-[#BCA58A]/50 hover:border-[#BCA58A] overflow-hidden transition-all duration-500 flex items-center gap-6"
            >
               {/* Elegant fill hover */}
               <div className="absolute inset-0 bg-[#BCA58A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-in-out" />
               
              <span className="relative z-10 text-white group-hover:text-black text-[11px] tracking-[0.3em] font-bold uppercase transition-colors duration-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Begin Consultation
              </span>
              <div className="relative z-10 w-10 h-[1px] bg-white group-hover:bg-black group-hover:w-16 transition-all duration-500" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ─── SPLIT-SCREEN MODAL ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={closeAndReset}
              className="absolute top-6 right-6 md:top-10 md:right-12 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white transition-colors group z-50 backdrop-blur-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white group-hover:text-black transition-colors"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* LEFT SIDE: Dynamic Image Gallery */}
            <div className="hidden md:block w-1/2 h-full relative bg-[#111]">
              <AnimatePresence mode="wait">
                {!isRevealing && (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={QUESTIONS[currentStep].image} 
                      alt="Fashion Mood"
                      className="w-full h-full object-cover saturate-50"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </motion.div>
                )}
                {isRevealing && (
                  <motion.div
                    key="reveal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-[#BCA58A]/20 backdrop-blur-3xl"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE: Interactive UI */}
            <div className="w-full md:w-1/2 h-full relative flex flex-col">
              
              {!isRevealing ? (
                <div className="flex-1 flex flex-col w-full max-w-[600px] mx-auto px-8 pt-24 pb-12 relative z-10">
                  
                  {/* Glowing Progress Indicator */}
                  <div className="flex gap-2 mb-16">
                    {QUESTIONS.map((_, idx) => (
                      <div key={idx} className="flex-1 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                        {idx <= currentStep && (
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: idx < currentStep ? '0%' : '0%' }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 bg-[#BCA58A]"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Question Area */}
                  <div className="flex-1 relative flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="w-full"
                      >
                        <span className="text-[#BCA58A] text-[10px] tracking-[0.3em] font-bold uppercase mb-4 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Step 0{currentStep + 1}
                        </span>
                        <h3 
                          className="text-4xl lg:text-5xl text-white font-light mb-12 leading-tight"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {QUESTIONS[currentStep].title}
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                          {QUESTIONS[currentStep].options.map((option, idx) => {
                            const isSelected = answers[QUESTIONS[currentStep].id] === option;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleOptionSelect(QUESTIONS[currentStep].id, option)}
                                className={`group relative p-6 text-left border-b transition-all duration-500 overflow-hidden flex items-center justify-between
                                  ${isSelected 
                                    ? 'border-[#BCA58A] bg-white/5' 
                                    : 'border-white/10 hover:border-white/40 hover:bg-white/5'
                                  }`}
                              >
                                <span 
                                  className={`relative z-10 text-lg lg:text-xl font-light tracking-wide transition-colors duration-300 ${isSelected ? 'text-[#BCA58A]' : 'text-white'}`}
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                  {option}
                                </span>
                                
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-[#BCA58A] bg-[#BCA58A]/10' : 'border-white/20 group-hover:border-white/50'}`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#BCA58A]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Magic Reveal Screen */
                <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center w-full max-w-[500px]"
                  >
                    <h3 
                      className="text-5xl md:text-6xl text-white font-light mb-6 tracking-wide"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      The <span className="italic text-[#BCA58A]">curation</span><br/>is complete.
                    </h3>
                    <p className="text-white/50 text-sm font-light mb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      We have hand-selected 18 exquisite pieces that perfectly match your exact preferences, occasion, and style.
                    </p>
                    
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      onClick={closeAndReset}
                      className="w-full bg-white text-black py-5 rounded-none text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#BCA58A] hover:text-white transition-all duration-500"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      View Your Masterpieces
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

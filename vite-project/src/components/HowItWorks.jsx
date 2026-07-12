import { motion } from 'framer-motion';
import { Store, ShoppingBag, CreditCard, PackageCheck, Gift, Plane } from 'lucide-react';
import { useState } from 'react';

const timelineSteps = [
  { id: 1, title: 'Choose a Store', desc: 'Select from our verified heritage boutiques.', icon: Store },
  { id: 2, title: 'Browse Collection', desc: 'Explore their exclusive inventory.', icon: ShoppingBag },
  { id: 3, title: 'Place Order', desc: 'Secure checkout with global payment support.', icon: CreditCard },
  { id: 4, title: 'We Collect', desc: 'Our team picks up the product from the weaver.', icon: PackageCheck },
  { id: 5, title: 'Premium Packaging', desc: 'Carefully wrapped in signature Gurnaaz boxes.', icon: Gift },
  { id: 6, title: 'Worldwide Delivery', desc: 'Shipped to your doorstep via luxury couriers.', icon: Plane },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-32 bg-white relative overflow-hidden border-t border-[#111111]/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="text-center mb-24">
          <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            The Journey
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-[#111111] leading-none tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            How Gurnaaz <em className="italic text-[#BCA58A] font-light">Works</em>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 right-0 h-px bg-[#111111]/10 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-4 relative z-10">
            {timelineSteps.map((step) => {
              const isActive = activeStep >= step.id;
              const isCurrent = activeStep === step.id;
              
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.id * 0.1, duration: 0.8 }}
                  onMouseEnter={() => setActiveStep(step.id)}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  {/* Icon Node */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-700 bg-white shadow-xl border ${
                    isActive ? 'border-[#BCA58A]' : 'border-[#111111]/10 group-hover:border-[#BCA58A]/50'
                  }`}>
                    <step.icon 
                      size={24} 
                      strokeWidth={1} 
                      className={`transition-colors duration-700 ${isActive ? 'text-[#BCA58A]' : 'text-[#111111]/40 group-hover:text-[#111111]'}`} 
                    />
                  </div>

                  {/* Number */}
                  <span className="text-[10px] tracking-[0.3em] font-medium uppercase mb-4 block text-[#111111]/40" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Step 0{step.id}
                  </span>

                  {/* Title */}
                  <h3 className={`text-xl font-light mb-3 transition-colors duration-700 ${isCurrent ? 'text-[#111111]' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {step.title}
                  </h3>

                  {/* Description (collapsible on mobile, always there on desktop) */}
                  <div className={`overflow-hidden transition-all duration-700 ${isCurrent ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 lg:max-h-24 lg:opacity-50'}`}>
                    <p className="text-[12px] text-[#555] font-light leading-relaxed max-w-[200px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {step.desc}
                    </p>
                  </div>
                  
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

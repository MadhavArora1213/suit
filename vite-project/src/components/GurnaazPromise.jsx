import { motion } from 'framer-motion';

const promises = [
  "Luxury Shopping.",
  "Trusted Sellers.",
  "Premium Experience.",
  "Worldwide Delivery."
];

export default function GurnaazPromise() {
  return (
    <section className="py-40 bg-[#111111] relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      
      {/* Background Graphic Lines (Subtle) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 C 200 300, 400 0, 1000 200" fill="none" stroke="#BCA58A" strokeWidth="0.5" />
          <path d="M0 300 C 300 500, 600 200, 1200 400" fill="none" stroke="#BCA58A" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-12 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          The Gurnaaz Promise
        </span>

        <div className="flex flex-col gap-4">
          {promises.map((text, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-[#FAF9F6] leading-none tracking-tight hover:text-[#BCA58A] transition-colors duration-1000 cursor-default" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {text}
              </h2>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

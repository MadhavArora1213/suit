import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function FabricMagnifier() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: '50%', y: '50%' });
  const [lensSize, setLensSize] = useState(250);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLensSize(160);
      } else {
        setLensSize(250);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // High-res image for the fabric details
  const fabricImage = '/chikankari_suit.png'; // We'll use this as our intricate fabric

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Position of cursor relative to the container
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate percentage for the zoomed background position
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setPosition({ x, y });
    setBgPosition({ x: `${xPercent}%`, y: `${yPercent}%` });
  };

  return (
    <section className="relative w-full bg-[#FAF9F6] py-32 overflow-hidden" id="fabric-zoom">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Typography */}
        <div className="w-full lg:w-1/3 text-left">
          <span className="text-[#BCA58A] text-[11px] tracking-[0.5em] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            The Microscopic Detail
          </span>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-[#111111] leading-[0.9] tracking-tight mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Feel the <br/>
            <em className="italic text-[#BCA58A] font-light">Texture</em>
          </h2>
          <p className="text-[#555] text-[13px] tracking-wide leading-relaxed font-light mb-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Our embroidery is so dense, it requires up to 500 stitches per square inch. Hover over the garment to inspect the microscopic precision of our master artisans.
          </p>
          
          <div className="flex items-center gap-4 text-[#BCA58A]">
            <Search size={18} className="animate-pulse" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Interactive Zoom Enabled</span>
          </div>
        </div>

        {/* Right Side: The Interactive Magnifier Canvas */}
        <div className="w-full lg:w-2/3">
          <div 
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden cursor-crosshair bg-white shadow-xl"
          >
            {/* The Base Image */}
            <img 
              src={fabricImage} 
              alt="Fabric Detail" 
              className="w-full h-full object-cover object-top opacity-90"
            />
            
            {/* Very light cinematic overlay */}
            <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay" />

            {/* The Magnifying Glass Lens */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute pointer-events-none z-10 rounded-full border border-white/40 shadow-2xl backdrop-blur-sm"
                style={{
                  width: `${lensSize}px`,
                  height: `${lensSize}px`,
                  left: `${position.x - lensSize / 2}px`, // Center the lens on cursor
                  top: `${position.y - lensSize / 2}px`,
                  backgroundImage: `url(${fabricImage})`,
                  backgroundSize: '400% 400%', // 4x Zoom
                  backgroundPosition: `${bgPosition.x} ${bgPosition.y}`,
                  backgroundRepeat: 'no-repeat',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.3)'
                }}
              >
                {/* Crosshair inside the lens */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-6 h-[1px] bg-[#111111]/40"></div>
                  <div className="h-6 w-[1px] bg-[#111111]/40 absolute"></div>
                </div>
              </motion.div>
            )}
            
            {/* Prompt text if not hovered */}
            {!isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="bg-white/80 backdrop-blur-md text-[#111111] border border-[#111111]/5 px-8 py-4 rounded-full text-[10px] tracking-[0.4em] font-medium uppercase shadow-lg flex items-center gap-4">
                  <Search size={16} className="text-[#BCA58A]" />
                  Hover to Magnify
                </span>
              </motion.div>
            )}
            
          </div>
        </div>

      </div>
    </section>
  );
}

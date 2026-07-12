import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, CreditCard, Truck } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden z-10 -mt-10">
      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        
        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#111111] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Shopping for ethnic wear<br/>
            is a <span className="text-[#4a90d9] italic">headache</span> to manage
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center text-[15px] text-[#555] max-w-[600px] mx-auto mb-3 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Too many stores, unclear sizing, fake products — but the same old problems, endless calls, and wasted time.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-center text-[14px] text-[#888] mb-16"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Every time a special occasion comes, the chaos begins...
        </motion.p>

        {/* Chaos Area */}
        <div className="relative h-[500px] mb-16">
          
          {/* Center - Confused Character - Using absolute with fixed pixel values */}
          <div className="absolute" style={{ top: '100px', left: 'calc(50% - 125px)', zIndex: 20 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-[250px] h-[300px]">
                <img
                  src="/Images/Confused.png"
                  alt="Gurnaaz confused"
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Curved Lines from Center */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Lines from center (50%, 250px) to left elements */}
            <path d="M 480 250 Q 350 200 180 180" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M 480 250 Q 350 280 160 320" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M 480 250 Q 380 380 180 420" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
            {/* Lines from center to right elements */}
            <path d="M 480 250 Q 600 180 750 160" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M 480 250 Q 600 280 760 300" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M 480 250 Q 600 380 740 400" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="6 4" />
          </svg>

          {/* Left Side Elements */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="absolute top-[80px] left-[2%] z-20"
            style={{ transform: 'rotate(-4deg)' }}
          >
            <div className="bg-white px-3 py-1.5 rounded shadow-md border border-gray-100">
              <span className="text-[10px] text-gray-500 font-mono">Order_form_v2.docx</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22 }}
            className="absolute top-[115px] left-[5%] z-20"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="bg-white px-3 py-1.5 rounded shadow-md border border-gray-100">
              <span className="text-[10px] text-gray-500 font-mono">Size_guide_?.pdf</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="absolute top-[150px] left-[1%] z-20"
            style={{ transform: 'rotate(-6deg)' }}
          >
            <div className="bg-white px-3 py-1.5 rounded shadow-md border border-gray-100">
              <span className="text-[10px] text-gray-500 font-mono">Return_v3_FINAL.xlsx</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="absolute top-[200px] left-[5%] z-30"
            style={{ transform: 'rotate(-3deg)' }}
          >
            <div className="bg-[#111111] text-white px-4 py-2.5 rounded-2xl text-[12px] font-medium shadow-xl">
              Is this authentic? 🤨
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="absolute top-[300px] left-[10%] z-30"
            style={{ transform: 'rotate(2deg)' }}
          >
            <div className="bg-[#BCA58A] text-white px-4 py-2.5 rounded-2xl text-[12px] font-medium shadow-xl">
              Where's my order? 😤
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute top-[380px] left-[5%] z-30"
            style={{ transform: 'rotate(-4deg)' }}
          >
            <div className="bg-[#111111] text-white px-4 py-2.5 rounded-2xl text-[12px] font-medium shadow-xl">
              Return kaise karun? 😫
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute top-[260px] left-[2%] z-20"
          >
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </motion.div>

          {/* Right Side Elements */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute top-[100px] right-[5%] z-30"
            style={{ transform: 'rotate(4deg)' }}
          >
            <div className="bg-[#111111] text-white px-4 py-2.5 rounded-2xl text-[12px] font-medium shadow-xl">
              COD available? 🤔
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="absolute top-[140px] right-[2%] z-20"
          >
            <div className="w-[130px] h-[150px]">
              <img
                src="/Images/Frustrated.png"
                alt="Gurnaaz frustrated"
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))' }}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="absolute top-[320px] right-[8%] z-30"
            style={{ transform: 'rotate(2deg)' }}
          >
            <div className="bg-[#111111] text-white px-4 py-2.5 rounded-2xl text-[12px] font-medium shadow-xl">
              Kitna time lagega? ⏰
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32 }}
            className="absolute bottom-[80px] right-[5%] z-20"
            style={{ transform: 'rotate(2deg)' }}
          >
            <div className="bg-white px-3 py-1.5 rounded shadow-md border border-gray-100">
              <span className="text-[10px] text-gray-500 font-mono">Shipping_v1_MASTER.xlsx</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.34 }}
            className="absolute bottom-[45px] right-[8%] z-20"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <div className="bg-white px-3 py-1.5 rounded shadow-md border border-gray-100">
              <span className="text-[10px] text-gray-500 font-mono">Delivery_v2_FINAL.xlsx</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute top-[280px] right-[3%] z-20"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
          </motion.div>

          {/* Emojis Scattered */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute top-[110px] left-[22%] text-2xl z-10"
          >
            😫
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute top-[80px] right-[22%] text-2xl z-10"
          >
            🧐
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, type: 'spring' }}
            className="absolute bottom-[100px] right-[22%] text-2xl z-10"
          >
            😩
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute bottom-[80px] left-[28%] text-2xl z-10"
          >
            💸
          </motion.div>

          {/* Notification Badges */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, type: 'spring' }}
            className="absolute top-[170px] left-[25%] bg-red-500 text-white text-[10px] font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-40"
          >
            132
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute top-[200px] right-[18%] bg-red-500 text-white text-[10px] font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-40"
          >
            42
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, type: 'spring' }}
            className="absolute bottom-[120px] right-[25%] bg-red-500 text-white text-[10px] font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-40"
          >
            87
          </motion.div>

        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            and when you try to fix it,<br/>
            you end up <span className="text-[#4a90d9] italic">stuck</span> between:
          </h3>
        </motion.div>

        {/* Venn Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-[400px] h-[280px]">
            <svg className="w-full h-full" viewBox="0 0 400 280">
              {/* Circle 1 - Local Stores */}
              <circle cx="150" cy="120" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              <text x="118" y="115" className="text-[12px] fill-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Local</text>
              <text x="115" y="130" className="text-[12px] fill-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Stores</text>
              <text x="110" y="145" className="text-[8px] fill-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>"Limited variety"</text>

              {/* Circle 2 - Online Apps */}
              <circle cx="250" cy="120" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              <text x="222" y="115" className="text-[12px] fill-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Online</text>
              <text x="220" y="130" className="text-[12px] fill-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Apps</text>
              <text x="215" y="145" className="text-[8px] fill-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>"Can't touch & feel"</text>

              {/* Circle 3 - Tailors */}
              <circle cx="200" cy="195" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              <text x="180" y="193" className="text-[12px] fill-[#555]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tailors</text>
              <text x="170" y="208" className="text-[8px] fill-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>"Too slow & costly"</text>

              {/* Center - Gurnaaz */}
              <circle cx="200" cy="145" r="30" fill="#BCA58A" />
              <text x="185" y="143" className="text-[9px] fill-white font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>GUR</text>
              <text x="187" y="155" className="text-[9px] fill-white font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>NAAZ</text>
            </svg>
          </div>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl md:text-4xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            But <span className="text-[#BCA58A] italic">Gurnaaz</span> makes it simple ✨
          </h3>
        </motion.div>

        {/* Holding Bag + Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-8 mb-10"
        >
          <div className="w-[160px] h-[180px] relative">
            <img
              src="/Images/Holding_Bag.png"
              alt="Gurnaaz holding bag"
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))' }}
            />
          </div>
          <div className="text-left">
            <h4 className="text-2xl font-light text-[#111111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Premium Delivery
            </h4>
            <p className="text-sm text-[#666] max-w-[250px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your order arrives in signature Gurnaaz packaging.
            </p>
          </div>
        </motion.div>

        {/* Solution Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShieldCheck, title: 'Verified Sellers', desc: 'Trusted boutiques' },
            { icon: Sparkles, title: 'Curated Collections', desc: 'Handpicked designs' },
            { icon: CreditCard, title: 'Secure Payment', desc: '100+ methods' },
            { icon: Truck, title: 'Express Delivery', desc: '5-7 days worldwide' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="flex justify-center mb-3">
                <item.icon className="w-8 h-8 text-[#BCA58A]" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-semibold text-[#111111] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {item.title}
              </h4>
              <p className="text-xs text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Processing & Dispatch',
    content: `All orders are processed and dispatched within 2-4 business days. Since our premium unstitched fabric sets are sourced directly from heritage boutiques across India, our team performs a rigorous 3-point quality check before the item is packed and dispatched to you.`,
  },
  {
    title: '2. Shipping Times & Costs',
    content: `We offer Free Shipping across India.
Domestic Delivery (Within India): 4-7 business days from the date of dispatch.

International Delivery: We deliver worldwide! International shipping charges are calculated at checkout based on your location and the order's weight. International delivery typically takes 7-14 business days from the date of dispatch.`,
  },
  {
    title: '3. Customs & Import Taxes',
    content: `For international orders, buyers are responsible for any customs and import taxes that may apply. We are not responsible for delays due to customs processes in your country.`,
  },
  {
    title: '4. Tracking Your Order',
    content: `Once your order is dispatched, you will receive an email and a WhatsApp message containing your tracking number and a link to trace your package's journey.`,
  },
  {
    title: '5. Undelivered or Returned Packages',
    content: `If a package is returned to us due to an incorrect address provided by the buyer, or if the buyer fails to collect the package, the buyer will be responsible for the re-shipping costs.`,
  },
  {
    title: '6. Damaged or Lost Packages',
    content: `While we ensure secure packaging, if your package arrives damaged, please take photographs before opening it and contact our support team within 24 hours. Each case will be reviewed individually.`,
  },
];

export default function ShippingPolicy({ setView }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A0008]">

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 max-w-[900px] mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setView('customer-home')}
          className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#1A0008]/50 hover:text-[#D4AF37] transition-colors mb-10 cursor-pointer"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={14} /> Back to Home
        </motion.button>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[9px] tracking-[0.4em] text-[#D4AF37] font-bold uppercase block mb-6"
        >
          Policies
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[48px] md:text-[72px] font-light leading-none mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Shipping Policy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[#1A0008]/50 font-light"
        >
          Last Updated: July 2026
        </motion.p>
      </section>

      {/* Divider */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <div className="h-px bg-[#1A0008]/10" />
      </div>

      {/* Intro */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 py-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[15px] leading-[1.9] text-[#1A0008]/70 font-light"
        >
          At Gurnaaz, we strive to deliver your premium heritage ethnic wear safely and promptly. We partner with the best courier services to ensure your luxury garments arrive in pristine condition, no matter where you are located.
        </motion.p>
      </section>

      {/* Sections */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 pb-20">
        <div className="space-y-14">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.6 }}
            >
              <h2
                className="text-[20px] md:text-[24px] font-light mb-4 text-[#1A0008]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {section.title}
              </h2>
              <p className="text-[14px] leading-[2] text-[#1A0008]/60 font-light whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 pb-20">
        <div className="border-t border-[#1A0008]/10 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[13px] text-[#1A0008]/50 font-light">
              Have a question about your shipment?
            </p>
            <p className="text-[13px] text-[#D4AF37] font-medium mt-1">
              madhavarora132005@gmail.com
            </p>
          </div>
          <button
            onClick={() => setView('contact')}
            className="bg-[#1A0008] text-white px-8 py-3.5 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#D4AF37] transition-colors cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}

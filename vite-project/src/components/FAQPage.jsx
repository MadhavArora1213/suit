import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

const faqCategories = [
  {
    category: 'Orders & Shopping',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our curated collections, select your desired suit, choose your size, and proceed to checkout. You can pay via UPI, credit/debit cards, net banking, or wallets. You\'ll receive an order confirmation via email and WhatsApp immediately.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'You can modify or cancel your order within 2 hours of placing it. After that, the order moves to processing and changes may not be possible. Please contact support@gurnaaz.com immediately if you need to make changes.',
      },
      {
        q: 'Do you offer COD (Cash on Delivery)?',
        a: 'Yes, we offer Cash on Delivery for orders within India. For international orders, prepayment is required. A nominal COD handling fee may apply.',
      },
      {
        q: 'Are the colors on the website accurate?',
        a: 'We photograph all products under natural lighting to give you the most accurate representation. However, slight variations may occur due to screen settings and lighting conditions during photography.',
      },
    ],
  },
  {
    category: 'Sizing & Fit',
    items: [
      {
        q: 'How do I find my correct size?',
        a: 'Each product page includes a detailed size chart with measurements in both inches and centimeters. We recommend measuring yourself and comparing with our chart. If you\'re between sizes, we suggest going one size up for a comfortable fit.',
      },
      {
        q: 'Do you offer custom tailoring?',
        a: 'Yes! Many of our boutique partners offer custom tailoring. Select the "Custom Size" option on the product page and share your measurements. Custom-tailored pieces take 7-14 days additional processing time and are non-returnable.',
      },
      {
        q: 'What if the size doesn\'t fit?',
        a: 'We offer free size exchanges within 7 days of delivery. The garment must be in unworn condition with all tags intact. Contact our support team and we\'ll arrange a pickup and dispatch the new size at no extra cost.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Within India: 5-7 business days. International: 7-14 business days. Custom-tailored orders may take an additional 7-14 days. You\'ll receive real-time tracking updates via WhatsApp and email.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we deliver worldwide. International shipping charges are calculated at checkout based on your location and order weight. All customs duties and import taxes are the responsibility of the customer.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive a tracking link via WhatsApp and email. You can also track your order from the "My Orders" section in your Gurnaaz account.',
      },
      {
        q: 'What if my package is damaged during delivery?',
        a: 'We take utmost care in packaging. However, if your package arrives damaged, please take photos and contact us within 24 hours of delivery. We\'ll arrange an immediate replacement or full refund.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for items in unworn, pristine condition with all original tags and packaging intact. Custom-tailored and personalized items are non-returnable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team via WhatsApp or email at support@gurnaaz.com with your order ID and reason for return. We\'ll arrange a free pickup within 48 hours.',
      },
      {
        q: 'How long does the refund take?',
        a: 'Refunds are processed within 3-5 business days after we receive and inspect the returned item. The amount is credited to your original payment method. COD refunds are transferred via UPI or bank transfer.',
      },
    ],
  },
  {
    category: 'Products & Authenticity',
    items: [
      {
        q: 'Are the products authentic?',
        a: 'Every product on Gurnaaz is sourced directly from verified heritage boutiques across India. We personally curate and quality-check each item before it reaches you. Each product comes with a Gurnaaz authenticity guarantee.',
      },
      {
        q: 'How do you select your boutiques?',
        a: 'Each boutique undergoes a rigorous vetting process. We verify their craftsmanship, material quality, business legitimacy, and customer reviews. Only those meeting our strict quality standards are featured on Gurnaaz.',
      },
      {
        q: 'What fabrics are available?',
        a: 'We offer a wide range of premium fabrics including Pure Silk, Banarasi, Chanderi, Cotton, Georgette, Organza, Velvet, Chikankari, and Linen. Each product page details the exact fabric composition.',
      },
      {
        q: 'How should I care for my garment?',
        a: 'Each garment comes with a specific care label. Generally, we recommend dry cleaning for silk and embroidered pieces, and gentle hand wash for cotton items. Store in the provided garment bag away from direct sunlight.',
      },
    ],
  },
  {
    category: 'Account & Support',
    items: [
      {
        q: 'Do I need an account to shop?',
        a: 'You can browse and add items to your cart without an account. However, an account is required at checkout to track orders, manage returns, and save your preferences.',
      },
      {
        q: 'How do I contact customer support?',
        a: 'You can reach us via WhatsApp at +91 XXXXX XXXXX, email at support@gurnaaz.com, or use the contact form on our Contact page. Our team responds within 2 hours during business hours (10 AM - 8 PM IST).',
      },
      {
        q: 'Do you offer gift cards?',
        a: 'Yes, Gurnaaz gift cards are available in denominations of ₹1,000, ₹2,500, ₹5,000, and ₹10,000. They\'re delivered instantly via email and valid for 12 months from the date of purchase.',
      },
    ],
  },
];

export default function FAQPage({ setView }) {
  const [openIndex, setOpenIndex] = useState('0-0');
  const [activeCategory, setActiveCategory] = useState(0);

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 max-w-[900px] mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setView('customer-home')}
          className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#111111]/50 hover:text-[#BCA58A] transition-colors mb-10 cursor-pointer"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <ArrowLeft size={14} /> Back to Home
        </motion.button>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[9px] tracking-[0.4em] text-[#BCA58A] font-bold uppercase block mb-6"
        >
          Help Center
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[48px] md:text-[72px] font-light leading-none mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Frequently Asked <em className="italic text-[#BCA58A]">Questions</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[#111111]/50 font-light max-w-lg"
        >
          Everything you need to know about shopping with Gurnaaz. Can't find your answer? Contact our support team.
        </motion.p>
      </section>

      {/* Divider */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <div className="h-px bg-[#111111]/10" />
      </div>

      {/* Category Tabs */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 pt-10">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {faqCategories.map((cat, i) => (
            <button
              key={i}
              onClick={() => { setActiveCategory(i); setOpenIndex(`${i}-0`); }}
              className={`px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeCategory === i
                  ? 'bg-[#111111] text-white'
                  : 'bg-transparent border border-[#111111]/15 text-[#111111]/50 hover:border-[#BCA58A] hover:text-[#BCA58A]'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 py-10 pb-20">
        <div className="border-t border-[#111111]/10">
          {faqCategories[activeCategory].items.map((item, idx) => {
            const key = `${activeCategory}-${idx}`;
            const isOpen = openIndex === key;

            return (
              <div key={idx} className="border-b border-[#111111]/10">
                <button
                  onClick={() => toggle(activeCategory, idx)}
                  className="w-full py-7 flex items-center justify-between group cursor-pointer text-left"
                >
                  <h3
                    className={`text-[18px] md:text-[20px] font-light transition-colors duration-300 pr-6 ${isOpen ? 'text-[#BCA58A]' : 'text-[#111111] group-hover:text-[#BCA58A]'}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {item.q}
                  </h3>
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'border-[#BCA58A] bg-[#BCA58A] text-white' : 'border-[#111111]/20 text-[#111111] group-hover:border-[#BCA58A]'}`}>
                    {isOpen ? <Minus size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pr-12 text-[13px] text-[#111111]/55 leading-[2] font-light">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 pb-20">
        <div className="bg-[#111111] rounded-2xl p-10 md:p-14 text-center">
          <h3
            className="text-[28px] md:text-[36px] font-light text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Still have questions?
          </h3>
          <p className="text-white/50 text-[13px] mb-8 max-w-md mx-auto font-light">
            Our support team is available 10 AM - 8 PM IST. We typically respond within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('contact')}
              className="bg-[#BCA58A] text-white px-8 py-3.5 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#a8916e] transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <a
              href="mailto:support@gurnaaz.com"
              className="border border-white/20 text-white px-8 py-3.5 text-[10px] tracking-[0.2em] font-bold uppercase hover:border-[#BCA58A] hover:text-[#BCA58A] transition-colors"
            >
              support@gurnaaz.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

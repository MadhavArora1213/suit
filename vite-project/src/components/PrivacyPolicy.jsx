import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you visit Gurnaaz, we automatically collect certain information about your device, including your web browser, IP address, time zone, and some cookies. Additionally, as you browse the site, we collect information about the individual web pages or products you view, what websites or search terms referred you to Gurnaaz, and how you interact with the site.

When you make a purchase or attempt to make a purchase through the Site, we collect your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. This is referred to as "Order Information."

When we talk about "Personal Information" in this Privacy Policy, we are talking about both Device Information and Order Information.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:

• Communicate with you;
• Screen our orders for potential risk or fraud; and
• When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.

We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site).`,
  },
  {
    title: '3. Sharing Your Personal Information',
    content: `We do not sell, trade, or rent your Personal Information to any third parties. Your data stays with us.

We may share your information only in the following limited circumstances:

• With trusted service providers who assist us in operating our platform (such as payment processors and delivery partners), strictly for the purpose of fulfilling your orders.
• To comply with applicable laws and regulations, to respond to a lawful request, or to otherwise protect our legal rights.

All third-party service providers are contractually obligated to keep your information confidential and use it only for the services we have engaged them for.`,
  },
  {
    title: '4. Data Security',
    content: `We implement appropriate technical and organizational security measures to protect your Personal Information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission, secure server infrastructure, and regular security assessments.

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.`,
  },
  {
    title: '5. Data Retention',
    content: `When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information, subject to applicable legal and regulatory retention requirements.`,
  },
  {
    title: '6. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.`,
  },
  {
    title: '7. Contact Us',
    content: `For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by email at support@gurnaaz.com or by mail using the details provided below:

Gurnaaz
Madhav Arora, Founder
India`,
  },
];

export default function PrivacyPolicy({ setView }) {
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
          Legal
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[48px] md:text-[72px] font-light leading-none mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-[#111111]/50 font-light"
        >
          Last Updated: July 2026
        </motion.p>
      </section>

      {/* Divider */}
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <div className="h-px bg-[#111111]/10" />
      </div>

      {/* Intro */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 py-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[15px] leading-[1.9] text-[#111111]/70 font-light"
        >
          At Gurnaaz, operated by Madhav Arora ("we," "us," or "our"), we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website gurnaaz.com and purchase our products. Please read this policy carefully. By accessing or using our Site, you agree to the collection and use of information in accordance with this policy.
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
                className="text-[20px] md:text-[24px] font-light mb-4 text-[#111111]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {section.title}
              </h2>
              <p className="text-[14px] leading-[2] text-[#111111]/60 font-light whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[900px] mx-auto px-6 md:px-12 pb-20">
        <div className="border-t border-[#111111]/10 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[13px] text-[#111111]/50 font-light">
              Questions about this policy? Reach out anytime.
            </p>
            <p className="text-[13px] text-[#BCA58A] font-medium mt-1">
              support@gurnaaz.com
            </p>
          </div>
          <button
            onClick={() => setView('contact')}
            className="bg-[#111111] text-white px-8 py-3.5 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#BCA58A] transition-colors cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}

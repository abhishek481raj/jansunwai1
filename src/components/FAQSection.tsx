import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'How do I file a complaint?',
    a: "Click on 'File a Complaint' button, register or login with your phone number, fill in the complaint details including category, description, and location. You'll receive a unique tracking ID immediately.",
  },
  {
    q: 'How can I track my complaint?',
    a: 'Use the tracking ID (format: GRV-2024-XXXXX) provided at the time of filing. Enter it in the \'Track Complaint\' search bar on our homepage or visit the Track page. No login required for tracking.',
  },
  {
    q: 'What is the resolution timeline?',
    a: 'Each complaint has a 7-day SLA (Service Level Agreement). Officers are required to resolve complaints within this timeframe. You can monitor the SLA countdown on your dashboard.',
  },
  {
    q: 'Can I file a complaint in my local language?',
    a: 'Yes! JanSunwai supports multiple languages including Hindi, English, and Telugu. You can also record voice complaints in any language using the audio recording feature.',
  },
  {
    q: 'How are complaints assigned to officers?',
    a: 'Complaints are automatically categorized by department based on the category you select. The admin then assigns the relevant departmental officer who handles the resolution.',
  },
  {
    q: 'What happens after my complaint is resolved?',
    a: 'You will receive a notification when your complaint is resolved. You can view the complete timeline of actions taken on your complaint detail page.',
  },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,153,51,0.1)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.25)' }}
          >
            FAQs
          </span>
          <h2 className="font-extrabold text-[#0C2340]" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                openFaq === index
                  ? 'border-[#FF9933]/30 bg-[#FFF8F0]'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className={`font-semibold text-sm md:text-base ${openFaq === index ? 'text-[#0C2340]' : 'text-gray-800'}`}>
                  {faq.q}
                </span>
                {openFaq === index ? (
                  <ChevronUp size={18} className="flex-shrink-0 text-[#FF9933]" />
                ) : (
                  <ChevronDown size={18} className="flex-shrink-0 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 mt-0 text-gray-600 text-sm leading-relaxed border-t border-[#FF9933]/15 pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

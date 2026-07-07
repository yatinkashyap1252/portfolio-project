import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I schedule an appointment with a specialist physician?',
    answer: 'You can request an appointment easily via our online calendar booking form above or by calling our concierge desk directly. No external physician referral is required for private consultations.',
  },
  {
    question: 'Do you accept corporate or private international insurance policies?',
    answer: 'Yes, Novara Health partners with leading global and premium private insurance providers. We support direct billing for approved policies and provide comprehensive clinical invoice breakdowns for fast reimbursement.',
  },
  {
    question: 'What is the standard turnaround time for diagnostic lab results?',
    answer: 'Standard clinical diagnostics and blood chemistry panels are processed in-house within 2 to 4 hours. Specialized screenings, genetic mapping, or external biopsies usually require 3 to 5 business days. All results are securely posted to your patient portal.',
  },
  {
    question: 'What should I bring to my initial consultation checkup?',
    answer: 'Please bring a valid photo ID, your insurance membership card, any recent medical imaging records or blood reports (from the last 12 months), and a list of any active prescriptions or supplements.',
  },
  {
    question: 'Do you offer virtual or telehealth follow-up consultations?',
    answer: 'Yes. For your convenience, follow-up consults, prescription renewals, and test review sessions can be conducted via our HIPAA-compliant secure video conferencing system directly with your physician.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-brand-100 last:border-0 py-5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left py-2 hover:text-brand-500 transition-colors duration-300 focus:outline-hidden cursor-pointer"
      >
        <span className="text-base md:text-lg font-serif font-bold text-brand-950">
          {question}
        </span>
        <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-sm md:text-base text-slate-luxury-900/60 leading-relaxed pt-2 pb-4 font-sans max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-[-10%] w-[35%] h-[35%] rounded-full bg-brand-50/50 blur-3xl -translate-y-1/2 -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Common Inquiries</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="glass-card p-6 md:p-10 rounded-3xl border border-brand-100 shadow-md">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>

        {/* Bottom Help Note */}
        <div className="text-center mt-12 flex items-center justify-center gap-2 text-xs md:text-sm text-slate-luxury-900/50 font-semibold font-sans">
          <HelpCircle size={16} className="text-accent-500" />
          <span>Have a different question? Email our concierge desk at </span>
          <a href="mailto:concierge@novarahealth.com" className="text-brand-500 hover:underline">
            concierge@novarahealth.com
          </a>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Heart, Calendar, Sparkles, Clipboard } from 'lucide-react';

const reasons = [
  {
    icon: Cpu,
    title: 'Advanced Medical Diagnostics',
    desc: 'Equipped with ultra-low radiation CT scanners and high-field 3T MRI technology for precise and prompt diagnosis.',
  },
  {
    icon: Heart,
    title: 'Patient-First Focus',
    desc: 'Unrushed appointments that respect your intelligence and comfort. Complete direct access to your primary medical team.',
  },
  {
    icon: ShieldCheck,
    title: 'JCI Accredited Safety Protocols',
    desc: 'Hospital-level sterilizations, dual-filtration clean rooms, and touchless clinics to provide absolute hygiene safety.',
  },
  {
    icon: Calendar,
    title: 'Seamless Digital Booking',
    desc: 'Skip phone queues. Manage, reschedule, and access patient portal diagnostic results in our premium cloud hub.',
  },
  {
    icon: Sparkles,
    title: 'Modern Integrative Treatment',
    desc: 'Merging traditional biological medicine with cellular therapies, longevity medicine, and nutritional science.',
  },
  {
    icon: Clipboard,
    title: 'Transparent Pricing models',
    desc: 'Comprehensive breakdowns upfront. We believe medical transparency leads to patient satisfaction and trust.',
  },
];

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-brand-700 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/40 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[50%] rounded-full bg-accent-600/20 blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Our Competitive Advantage</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
            Why Discerning Patients Choose <br />
            <span className="text-accent-500 font-normal italic">Novara Health Clinic</span>
          </h2>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={cardVariants}
                className="flex flex-col items-start text-left bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Icon frame */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-500 mb-6 shrink-0">
                  <Icon size={24} className="stroke-[2]" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-serif font-bold text-white mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm text-brand-100/70 leading-relaxed font-sans">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dynamic highlights strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="text-left max-w-xl">
            <h4 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Ready to prioritize your long-term health?</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              Connect with our medical coordinators. We offer clinical consult slots and private checkup bookings tailored to your schedule.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.querySelector('#booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-xl bg-white hover:bg-accent-100 text-brand-700 font-bold text-base shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer hover:shadow-white/10"
          >
            Start Your Journey
          </button>
        </motion.div>

      </div>
    </section>
  );
}

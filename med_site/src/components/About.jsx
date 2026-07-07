import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Heart, Award, Shield, Stethoscope } from 'lucide-react';
import clinicLobby from '../assets/clinic_lobby.png';

const values = [
  {
    icon: Heart,
    title: 'Compassionate Care',
    desc: 'We put the human touch back in medicine, listening with empathy and designing treatment around you.',
  },
  {
    icon: Stethoscope,
    title: 'Medical Expertise',
    desc: 'Our physicians are Board-certified leaders in their medical fields, carrying decades of global research.',
  },
  {
    icon: Shield,
    title: 'Strict Clinical Hygiene',
    desc: 'Operating with strict JCI-accredited protocols, providing the safest, sterile healthcare environments.',
  },
  {
    icon: Award,
    title: 'Advanced Tech & Testing',
    desc: 'Outfitted with next-generation diagnostic imaging and screening labs for early, accurate detection.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Structural visual assets */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-brand-50/50 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Image with floating details */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Visual background frame decorations */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-accent-500/40 rounded-tl-3xl"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-brand-500/20 rounded-br-3xl"></div>
            
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-brand-100">
              <img
                src={clinicLobby}
                alt="Novara Health Luxury Lobby"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent"></div>
            </div>

            {/* Float Detail Overlay Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 glass-card p-6 rounded-2xl shadow-xl border border-white/60 text-left"
            >
              <span className="text-accent-600 font-bold text-xs uppercase tracking-widest block mb-1">Our Facility Goal</span>
              <p className="text-brand-950 font-serif text-sm font-bold">
                "Where elite hospitality blends with leading-edge medical clinical excellence."
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Story and Values list */}
          <div className="lg:col-span-7 text-left">
            <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">About Novara Health</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-[1.2] mb-6">
              A Private Sanctuary for <br />
              <span className="text-brand-500 font-normal italic">Precision & Restorative Healthcare</span>
            </h2>
            <p className="text-slate-luxury-900/70 text-base md:text-lg mb-10 leading-relaxed font-sans">
              Founded on the belief that medicine should be highly individualized and proactive, Novara Health is designed to serve as a comprehensive medical resource. We reject the template approach to clinical services, replacing it with deep analysis, world-leading physicians, and luxury patient hospitality.
            </p>

            {/* Core Values grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-500 shrink-0 border border-brand-100/50">
                      <Icon size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif font-bold text-brand-950">{val.title}</h4>
                      <p className="text-xs md:text-sm text-slate-luxury-900/60 mt-1 leading-relaxed">{val.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

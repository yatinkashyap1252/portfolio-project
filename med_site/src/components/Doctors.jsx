import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, GraduationCap, Award } from 'lucide-react';
import doctor1 from '../assets/doctor_1.png';
import doctor2 from '../assets/doctor_2.png';
import doctor3 from '../assets/doctor_3.png';

const specialists = [
  {
    name: 'Dr. Evelyn Sinclair, MD',
    specialty: 'Chief of Cardiology',
    experience: '18 Years Exp',
    education: 'Harvard Medical School',
    image: doctor1,
    bio: 'Pioneering cardiovascular health expert focusing on advanced preventive screenings and personalized rehabilitation plans.',
  },
  {
    name: 'Dr. Marcus Thorne, PhD',
    specialty: 'Chief Neurologist & Director',
    experience: '24 Years Exp',
    education: 'Johns Hopkins University',
    image: doctor2,
    bio: 'Renowned clinical researcher specializing in neuromuscular disorders, early dementia detection, and cognitive health.',
  },
  {
    name: 'Dr. Sophia Laurent, MD',
    specialty: 'Senior Pediatrician',
    experience: '12 Years Exp',
    education: 'Stanford School of Medicine',
    image: doctor3,
    bio: 'Dedicated advocate for proactive childhood development, childhood nutrition, and gentle neonatal primary medical care.',
  },
];

export default function Doctors() {
  const scrollToBooking = () => {
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="doctors" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute right-[-10%] top-[-10%] w-[35%] h-[40%] rounded-full bg-accent-100/30 blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Our Clinical Faculty</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Elite Medical Specialists <br />
            <span className="text-brand-500 font-normal italic">Committed to Your Absolute Wellness</span>
          </h2>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {specialists.map((doc, idx) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col bg-accent-50/30 rounded-3xl overflow-hidden border border-brand-100/50 hover:border-brand-200 shadow-xs hover:shadow-2xl transition-all duration-500"
            >
              {/* Doctor Portrait Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Visual Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover Details Panel overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-sm text-brand-100 font-medium leading-relaxed mb-6 font-sans">
                    {doc.bio}
                  </p>
                  <button
                    onClick={scrollToBooking}
                    className="w-full py-3 rounded-xl bg-white hover:bg-accent-100 text-brand-700 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10 cursor-pointer"
                  >
                    <Calendar size={16} />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 text-left flex-grow flex flex-col bg-white">
                {/* Specialty */}
                <span className="text-xs text-accent-600 font-bold uppercase tracking-wider block mb-1">
                  {doc.specialty}
                </span>

                {/* Name */}
                <h3 className="text-lg font-serif font-bold text-brand-950 leading-snug mb-3">
                  {doc.name}
                </h3>

                {/* Academic Highlights */}
                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-brand-50 text-xs text-slate-luxury-900/60 font-semibold">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-brand-500 shrink-0" />
                    <span>{doc.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-accent-500 shrink-0" />
                    <span>{doc.experience}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

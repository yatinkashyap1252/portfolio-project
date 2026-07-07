import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Stethoscope, Activity, Baby, Smile, 
  Flame, ClipboardCheck, ArrowUpRight, Zap 
} from 'lucide-react';

const servicesData = [
  {
    id: 1,
    title: 'General Consultation',
    category: 'Primary Care',
    icon: Stethoscope,
    desc: 'Comprehensive personal wellness examinations, preventative medical plans, and dedicated management of chronic illnesses.',
    duration: '30-45 mins',
  },
  {
    id: 2,
    title: 'Diagnostics & Imaging',
    category: 'Preventive',
    icon: Activity,
    desc: 'High-precision MRI, low-dose CT scans, digital ultrasound systems, and rapid-turnaround blood analysis laboratories.',
    duration: 'Varies',
  },
  {
    id: 3,
    title: 'Pediatric Clinic',
    category: 'Primary Care',
    icon: Baby,
    desc: 'Compassionate, specialist child care ranging from newborn wellness checks to developmental screenings and immunizations.',
    duration: '30 mins',
  },
  {
    id: 4,
    title: 'Premium Dental Care',
    category: 'Specialty',
    icon: Smile,
    desc: 'Advanced cosmetic design, root canal therapies, periodontics, and surgical implants under specialized sedation.',
    duration: '45-60 mins',
  },
  {
    id: 5,
    title: 'Gynecology & Obstetrics',
    category: 'Specialty',
    icon: ClipboardCheck,
    desc: 'Empathetic women\'s reproductive wellness guidance, complete prenatal care, and modern minimally invasive surgical treatments.',
    duration: '45 mins',
  },
  {
    id: 6,
    title: 'Sports & Physiotherapy',
    category: 'Specialty',
    icon: Zap,
    desc: 'Tailored skeletal rehabilitation, posture training, dry-needling, and manual alignment therapies to restore fluid range of motion.',
    duration: '60 mins',
  },
  {
    id: 7,
    title: 'Preventive Health Checkup',
    category: 'Preventive',
    icon: Flame,
    desc: 'Elite health screenings scanning complete metabolic panels, cardiovascular assessments, and lifestyle risk factors.',
    duration: 'Half Day',
  },
];

const categories = ['All', 'Primary Care', 'Specialty', 'Preventive'];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = servicesData.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-24 md:py-32 bg-brand-50/50 relative overflow-hidden">
      {/* Dynamic light glows */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Our Clinical Specializations</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Premium Healthcare Services <br />
            <span className="text-brand-500 font-normal italic">Engineered for Your Well-being</span>
          </h2>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 glass-card p-4 rounded-2xl border border-brand-100">
          
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-white text-slate-luxury-900/60 hover:text-brand-500 hover:bg-brand-50/50 border border-brand-100/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-luxury-900/40" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-brand-100 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-sm transition-all duration-300"
            />
          </div>

        </div>

        {/* Services Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  key={service.id}
                  className="group bg-white p-8 rounded-2xl border border-brand-100 hover:border-brand-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-start text-left"
                >
                  {/* Service Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 mb-6 border border-brand-100/50">
                    <Icon size={24} className="stroke-[2]" />
                  </div>

                  {/* Category Tag */}
                  <span className="text-[10px] text-accent-600 font-bold uppercase tracking-widest bg-accent-50 px-2.5 py-1 rounded-md mb-3">
                    {service.category}
                  </span>

                  {/* Service Title */}
                  <h3 className="text-xl font-serif font-bold text-brand-950 mb-3 group-hover:text-brand-500 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Service Desc */}
                  <p className="text-sm text-slate-luxury-900/60 leading-relaxed mb-6 font-sans flex-grow">
                    {service.desc}
                  </p>

                  {/* Card Bottom / Action */}
                  <div className="w-full flex items-center justify-between border-t border-brand-50 pt-4 mt-auto">
                    <span className="text-xs text-slate-luxury-900/40 font-medium">
                      Duration: {service.duration}
                    </span>
                    <a
                      href="#booking"
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 group-hover:text-accent-500 transition-colors duration-300"
                    >
                      <span>Book Now</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Result State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-base text-slate-luxury-900/50">No clinical services found matching your criteria.</p>
          </motion.div>
        )}

      </div>
    </section>
  );
}

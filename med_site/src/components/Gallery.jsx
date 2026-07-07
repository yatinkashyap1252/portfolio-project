import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import lobby from '../assets/clinic_lobby.png';
import operating from '../assets/clinic_operating.png';
import heroDoc from '../assets/hero_doctor.png';
import doc1 from '../assets/doctor_1.png';
import doc2 from '../assets/doctor_2.png';
import doc3 from '../assets/doctor_3.png';

const galleryItems = [
  { id: 1, image: lobby, title: 'Grand Reception Lobby', category: 'Interior' },
  { id: 2, image: operating, title: 'State-of-the-Art Operating Theater', category: 'Technology' },
  { id: 3, image: heroDoc, title: 'Patient Consultation Office', category: 'Rooms' },
  { id: 4, image: doc1, title: 'Diagnostics & Screening Lab', category: 'Technology' },
  { id: 5, image: doc2, title: 'Cardiology Care Suite', category: 'Interior' },
  { id: 6, image: doc3, title: 'Pediatric Care Lounge', category: 'Rooms' },
];

export default function Gallery() {
  const [activePhoto, setActivePhoto] = useState(null);

  const openLightbox = (photo) => {
    setActivePhoto(photo);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-brand-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Our Environment</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Explore Our World-Class Clinic <br />
            <span className="text-brand-500 font-normal italic">Designed for Healing & Comfort</span>
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              onClick={() => openLightbox(item)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl border border-brand-100/50 cursor-pointer"
            >
              {/* Image with zoom on hover */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                <span className="text-[10px] text-accent-500 font-bold uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="text-base font-serif font-bold text-white mb-2 flex items-center justify-between">
                  <span>{item.title}</span>
                  <Maximize2 size={16} className="text-accent-500 shrink-0" />
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-300 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Lightbox Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-brand-100/10 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Image */}
              <div className="md:w-3/5 aspect-video md:aspect-[4/3] bg-brand-950">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Copy/Details */}
              <div className="md:w-2/5 p-8 text-left flex flex-col justify-center">
                <span className="text-xs text-accent-600 font-bold uppercase tracking-wider block mb-2">
                  {activePhoto.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-brand-950 leading-tight mb-4">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-slate-luxury-900/60 leading-relaxed font-sans mb-6">
                  Experience modern medical architecture designed strictly to promote therapeutic rest and recovery. Our suites are customized with patient conveniences, HEPA medical filtration, and relaxing acoustic properties.
                </p>
                <button
                  onClick={closeLightbox}
                  className="px-6 py-2.5 self-start rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs md:text-sm shadow-md transition-all duration-300 cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

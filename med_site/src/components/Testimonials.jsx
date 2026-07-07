import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Julianne Vance',
    role: 'Executive Director',
    treatment: 'Executive Preventative Screening',
    rating: 5,
    quote: 'Novara Health completely changed my view on medicine. The screening was fast, hyper-detailed, and Dr. Sinclair explained my cardiovascular parameters with complete clarity. Truly elite service.',
  },
  {
    id: 2,
    name: 'Robert H. Gallagher',
    role: 'Senior Attorney',
    treatment: 'Cardio Management Plan',
    rating: 5,
    quote: 'Their attention to JCI-clinical hygiene standards and patient safety is outstanding. The facility feels like a luxury resort, yet the medical expertise is rigorous and top-tier.',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Creative Consultant',
    treatment: 'Cosmetic Dentistry & Alignment',
    rating: 5,
    quote: 'The dental specialists here are artists. They mapped my entire cosmetic veneers in 3D and completed the placement flawlessly. Zero discomfort, beautiful results.',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Structural layout glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Patient Case Studies</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Client Testimonials & Reviews
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative glass-card p-8 md:p-16 rounded-[2rem] border border-brand-100 shadow-xl overflow-hidden min-h-[350px] flex flex-col justify-between">
          <Quote className="absolute top-8 left-8 text-brand-100 w-16 h-16 stroke-[1.5] -z-10" />

          {/* Testimonial Content Slide */}
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center"
              >
                {/* Star rating */}
                <div className="flex gap-1 mb-6 text-accent-500">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" className="stroke-none" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl font-serif text-brand-950 italic leading-relaxed mb-8 max-w-2xl">
                  "{current.quote}"
                </p>

                {/* Patient Meta */}
                <div>
                  <h4 className="text-base font-bold text-brand-950 font-sans">{current.name}</h4>
                  <span className="block text-xs text-slate-luxury-900/50 uppercase tracking-wider font-semibold mt-1">
                    {current.role} • <span className="text-brand-500">{current.treatment}</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-brand-50">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-brand-500' : 'bg-brand-200'
                  }`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700 flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700 flex items-center justify-center transition-colors duration-300 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, HeartPulse } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'AI Assistant', href: '#ai-assistant' },
  { name: 'Doctors', href: '#doctors' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const scrollPosition = window.scrollY + 120;
      for (const link of navLinks) {
        const el = document.querySelector(link.href);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.href.slice(1));
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'glass-nav py-4 shadow-xs' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className="flex items-center gap-2.5 text-brand-700 font-serif font-bold text-xl md:text-2xl tracking-wide group"
          >
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/10 group-hover:bg-brand-600 transition-colors duration-300">
              <HeartPulse size={20} className="stroke-[2.5]" />
            </div>
            <span className="flex flex-col leading-none">
              <span className="text-brand-700 font-bold font-sans text-lg tracking-wider">NOVARA</span>
              <span className="text-accent-500 text-xs font-semibold tracking-[0.25em] font-sans -mt-0.5">HEALTH</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`relative text-sm font-semibold tracking-wide transition-colors duration-300 py-1 ${
                    isActive ? 'text-brand-500 font-bold' : 'text-slate-luxury-900/70 hover:text-brand-500'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop Call to Action */}
          <div className="hidden lg:block">
            <button
              onClick={() => scrollToSection('#booking')}
              className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/15 hover:shadow-brand-500/25 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <span>Book Appointment</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-brand-700 hover:text-brand-500 focus:outline-hidden p-1.5 rounded-lg border border-brand-500/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-luxury-900/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-accent-50 shadow-2xl p-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-brand-700 hover:text-brand-500 focus:outline-hidden p-1.5 rounded-lg border border-brand-500/10 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6 my-auto">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <motion.a
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className={`text-xl font-serif font-bold tracking-wide transition-colors duration-300 py-1 block ${
                        isActive ? 'text-brand-500 pl-2 border-l-2 border-accent-500' : 'text-slate-luxury-900/80 hover:text-brand-500'
                      }`}
                    >
                      {link.name}
                    </motion.a>
                  );
                })}
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => scrollToSection('#booking')}
                  className="w-full text-center py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-base shadow-lg shadow-brand-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Appointment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

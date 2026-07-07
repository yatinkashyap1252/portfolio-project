import React, { useState } from 'react';
import { HeartPulse, Mail, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-950 text-white pt-20 pb-10 border-t border-brand-800 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-600 rounded-full filter blur-3xl opacity-10 -mr-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Footer Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-brand-800">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 text-left space-y-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white">
                <HeartPulse size={18} className="stroke-[2.5]" />
              </div>
              <span className="flex flex-col leading-none">
                <span className="text-white font-bold tracking-wider text-base">NOVARA</span>
                <span className="text-accent-500 text-[10px] font-semibold tracking-[0.25em] -mt-0.5">HEALTH</span>
              </span>
            </a>
            
            <p className="text-xs md:text-sm text-brand-100/60 leading-relaxed font-sans">
              Experience the pinnacle of individualized medicine and elite patient hospitality in the heart of New York.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <span className="block text-xs font-semibold text-accent-500 uppercase tracking-widest">
                Subscribe to Wellness Insights
              </span>
              <div className="relative flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-brand-800 bg-brand-900/50 text-white placeholder-white/30 text-xs md:text-sm focus:outline-hidden focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-brand-500 hover:bg-brand-600 rounded-md transition-colors duration-300 text-white flex items-center justify-center cursor-pointer"
                >
                  {subscribed ? <span className="text-[10px] font-bold">Subscribed</span> : <Send size={16} />}
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 text-left space-y-5">
            <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-brand-100/60 font-semibold font-sans">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="hover:text-accent-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="hover:text-accent-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  Clinical Services
                </a>
              </li>
              <li>
                <a href="#doctors" onClick={(e) => { e.preventDefault(); scrollToSection('#doctors'); }} className="hover:text-accent-500 transition-colors">
                  Our Specialists
                </a>
              </li>
              <li>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('#testimonials'); }} className="hover:text-accent-500 transition-colors">
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical Services */}
          <div className="lg:col-span-3 text-left space-y-5">
            <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
              Our Services
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-brand-100/60 font-sans">
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  General Consultation
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  Diagnostics & Screening
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  Pediatric Clinic
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  Cosmetic & General Dental
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="hover:text-accent-500 transition-colors">
                  Sports & Physiotherapy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="lg:col-span-3 text-left space-y-5">
            <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
              Concierge Channels
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-brand-100/60 font-sans">
              <li className="leading-relaxed">
                742 Fifth Avenue, 14th Floor,<br />
                New York, NY 10019
              </li>
              <li>
                General: <a href="tel:+18005550199" className="text-white hover:text-accent-500 transition-colors font-bold">+1 (800) NOVARA-H</a>
              </li>
              <li>
                Office: <a href="tel:+12125550188" className="text-white hover:text-accent-500 transition-colors font-bold">+1 (212) 555-0188</a>
              </li>
              <li>
                Email: <a href="mailto:concierge@novarahealth.com" className="text-white hover:text-accent-500 transition-colors">concierge@novarahealth.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom elements */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-xs text-brand-100/40 font-sans">
          <span>
            © {new Date().getFullYear()} Novara Health Clinic. All rights reserved. Private & Confidential.
          </span>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-brand-900 border border-brand-800 flex items-center justify-center text-brand-100/60 hover:text-white hover:bg-brand-500 transition-all duration-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-brand-900 border border-brand-800 flex items-center justify-center text-brand-100/60 hover:text-white hover:bg-brand-500 transition-all duration-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-brand-900 border border-brand-800 flex items-center justify-center text-brand-100/60 hover:text-white hover:bg-brand-500 transition-all duration-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-brand-900 border border-brand-800 flex items-center justify-center text-brand-100/60 hover:text-white hover:bg-brand-500 transition-all duration-300">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

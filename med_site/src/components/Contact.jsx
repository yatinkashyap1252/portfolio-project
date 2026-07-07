import React from 'react';
import { MapPin, Phone, Mail, Clock, CalendarCheck } from 'lucide-react';

export default function Contact() {
  const officeHours = [
    { days: 'Monday - Friday', hours: '8:00 AM - 8:00 PM' },
    { days: 'Saturday', hours: '9:00 AM - 5:00 PM' },
    { days: 'Sunday', hours: '10:00 AM - 2:00 PM (Emergency only)' },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-brand-50/50 relative overflow-hidden">
      {/* Light blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Visit Novara</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Contact & Clinical Locations <br />
            <span className="text-brand-500 font-normal italic">We Welcome Your Clinical Inquiries</span>
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          
          {/* Left Side: Address Details */}
          <div className="lg:col-span-5 text-left flex flex-col justify-between gap-8 bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-md">
            
            {/* Quick Contact Block */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-brand-950 pb-4 border-b border-brand-50">
                Novara Concierge Desk
              </h3>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-950 uppercase tracking-wider mb-1">Clinic Address</h4>
                  <p className="text-sm text-slate-luxury-900/60 leading-relaxed font-sans">
                    742 Fifth Avenue, 14th Floor,<br />
                    New York, NY 10019
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-950 uppercase tracking-wider mb-1">Telephone Channels</h4>
                  <p className="text-sm text-slate-luxury-900/60 leading-relaxed font-sans">
                    General: +1 (800) NOVARA-H <br />
                    Direct: +1 (212) 555-0188
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-950 uppercase tracking-wider mb-1">Concierge Email</h4>
                  <p className="text-sm text-slate-luxury-900/60 leading-relaxed font-sans">
                    concierge@novarahealth.com <br />
                    referrals@novarahealth.com
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours block */}
            <div className="space-y-4 pt-6 border-t border-brand-50">
              <h4 className="text-sm font-bold text-brand-950 uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-accent-500" />
                <span>Operating Hours</span>
              </h4>
              <div className="space-y-2 text-xs md:text-sm font-sans text-slate-luxury-900/60">
                {officeHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-brand-50/55 last:border-0 pb-1.5 last:pb-0">
                    <span className="font-semibold text-brand-950/70">{item.days}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Map Iframe Placeholder */}
          <div className="lg:col-span-7 h-[400px] lg:h-auto rounded-3xl overflow-hidden border border-brand-100 shadow-md relative group bg-brand-100">
            {/* High-quality embedded map mockup or static satellite visual */}
            <iframe
              title="Novara Health New York Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1837862215286!2d-73.97491738459368!3d40.761226979326444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f97ffa4257%3A0xe7261d7de39b7a42!2s742%205th%20Ave%2C%20New%20York%2C%20NY%2010019!5e0!3m2!1sen!2sus!4v1689123456789!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.7) contrast(1.1) brightness(0.95)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[400px] opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            {/* Visual map pin hover details overlay */}
            <div className="absolute bottom-4 left-4 right-4 glass-card px-4 py-3 rounded-xl border border-brand-100 text-left pointer-events-none flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-950">Fifth Avenue Medical Center (Valet Parking Available)</span>
              <span className="text-brand-500 uppercase tracking-widest text-[10px]">Open</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

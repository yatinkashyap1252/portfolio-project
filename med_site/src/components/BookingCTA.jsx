import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarRange, Sparkles, Check, Phone, Mail, User, Clock, ArrowRight } from 'lucide-react';

const departments = [
  'General Consultation',
  'Cardiology & Heart Health',
  'Pediatrics & Child Care',
  'Cosmetic & General Dental',
  'Gynecology & Women\'s Health',
  'Sports Medicine & Physio',
  'Executive Health Checkup',
];

export default function BookingCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    date: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.department) newErrors.department = 'Please select a clinical department';
    if (!formData.date) newErrors.date = 'Preferred date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API Delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      date: '',
      message: '',
    });
    setIsSuccess(false);
  };

  return (
    <section id="booking" className="py-24 md:py-32 bg-accent-50 relative overflow-hidden">
      {/* Visual lighting blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Branding content */}
          <div className="lg:col-span-5 text-left">
            <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3">Scheduling & Consultation</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight mb-6">
              Begin Your Premium <br />
              <span className="text-brand-500 font-normal italic">Healthcare Experience Today</span>
            </h2>
            <p className="text-slate-luxury-900/70 text-base mb-8 leading-relaxed">
              Book a private screening slot. Fill out our initial scheduling form, and a dedicated patient coordinator will reach out to you within 2 business hours to confirm your calendar booking.
            </p>

            {/* Quick Contact stats */}
            <div className="flex flex-col gap-6 pt-6 border-t border-brand-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-xs text-slate-luxury-900/50 uppercase font-semibold">Immediate Assistance</span>
                  <a href="tel:+18005550199" className="text-base font-bold text-brand-950 hover:text-brand-500 transition-colors duration-300">
                    +1 (800) NOVARA-H
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-xs text-slate-luxury-900/50 uppercase font-semibold">Support Desk Email</span>
                  <a href="mailto:concierge@novarahealth.com" className="text-base font-bold text-brand-950 hover:text-brand-500 transition-colors duration-300">
                    concierge@novarahealth.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-brand-100 shadow-xl relative"
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="booking-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="text-left">
                      <label htmlFor="name" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-luxury-900/30" size={16} />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-premium-with-icon"
                          placeholder="Elizabeth Bennett"
                        />
                      </div>
                      {errors.name && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="text-left">
                      <label htmlFor="email" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-luxury-900/30" size={16} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-premium-with-icon"
                          placeholder="elizabeth@domain.com"
                        />
                      </div>
                      {errors.email && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="text-left">
                      <label htmlFor="phone" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-luxury-900/30" size={16} />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-premium-with-icon"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.phone}</span>}
                    </div>

                    {/* Department Select */}
                    <div className="text-left">
                      <label htmlFor="department" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                        Department *
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-premium h-[50px] py-0 pr-10 cursor-pointer"
                      >
                        <option value="">Select Specialty</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.department && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.department}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="text-left col-span-2">
                      <label htmlFor="date" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                        Preferred Consultation Date *
                      </label>
                      <div className="relative">
                        <CalendarRange className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-luxury-900/30" size={16} />
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="input-premium-with-icon cursor-pointer"
                        />
                      </div>
                      {errors.date && <span className="text-xs text-rose-500 font-semibold mt-1 block">{errors.date}</span>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="text-left">
                    <label htmlFor="message" className="block text-xs text-brand-950 font-bold uppercase tracking-wider mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="input-premium"
                      placeholder="Share details regarding your query or requested physician..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/10 hover:shadow-brand-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying Request Details...
                      </span>
                    ) : (
                      <>
                        <span>Submit Schedule Request</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 mb-6 border border-brand-200">
                    <Check size={32} className="stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-950 mb-3">Booking Request Received</h3>
                  <p className="text-sm text-slate-luxury-900/60 max-w-sm mb-8 leading-relaxed">
                    Thank you, <strong className="text-brand-950">{formData.name}</strong>. Your clinical request has been securely routed. Our medical coordinator will contact you at <strong className="text-brand-950">{formData.phone}</strong> or email you shortly.
                  </p>
                  
                  <div className="w-full max-w-md bg-accent-50 rounded-2xl p-6 border border-brand-100 text-left mb-8 text-xs md:text-sm space-y-3 font-sans">
                    <div className="flex justify-between border-b border-brand-100/50 pb-2">
                      <span className="text-slate-luxury-900/50">Department:</span>
                      <span className="font-bold text-brand-950">{formData.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-100/50 pb-2">
                      <span className="text-slate-luxury-900/50">Scheduled Date:</span>
                      <span className="font-bold text-brand-950">{formData.date}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-luxury-900/50">Status:</span>
                      <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                        <Clock size={14} className="animate-pulse" />
                        Pending Confirmation
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-xl border border-brand-200 hover:bg-brand-50 text-brand-700 font-semibold text-xs md:text-sm transition-all duration-300 cursor-pointer"
                  >
                    Schedule Another Appointment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickInfo from './components/QuickInfo';
import About from './components/About';
import Services from './components/Services';
import Doctors from './components/Doctors';
import SymptomChecker from './components/SymptomChecker';
import WhyChooseUs from './components/WhyChooseUs';
import BookingCTA from './components/BookingCTA';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden antialiased">
      {/* Premium Sticky Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust / Statistics Strip */}
        <QuickInfo />

        {/* 3. About the Clinic Section */}
        <About />

        {/* 4. Services Grid Section */}
        <Services />

        {/* AI Symptom Checker Assistant */}
        <SymptomChecker />

        {/* 5. Specialist Doctors Section */}
        <Doctors />

        {/* 6. Why Choose Us Grid */}
        <WhyChooseUs />

        {/* 7. Appointment Booking Form Block */}
        <BookingCTA />

        {/* 8. Testimonials Carousel Section */}
        <Testimonials />

        {/* 9. Facilities Lightbox Gallery */}
        <Gallery />

        {/* 10. FAQ Accordions */}
        <FAQ />

        {/* 11. Contact & Map Location Details */}
        <Contact />
      </main>

      {/* 12. Corporate Footer */}
      <Footer />
    </div>
  );
}

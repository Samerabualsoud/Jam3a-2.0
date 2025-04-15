
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutUsContent from '@/components/AboutUsContent';
import Benefits from '@/components/Benefits';
import WhyChooseUs from '@/components/WhyChooseUs';

const AboutUs = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AboutUsContent />
        <Benefits />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;

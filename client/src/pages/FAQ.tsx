
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQContent from '@/components/FAQContent';

const FAQ = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <FAQContent />
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;

'use client';

import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/hero/Hero';
import UseCases from '@/components/sections/UseCases';
import Integrations from '@/components/sections/Integrations';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';

export default function Home() {
  const scrollToFaq = () => {
    const el = document.getElementById('faq-free');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Simulate click to open FAQ if it exists
      el.click();
    }
  };

  return (
    <div className="p-0">
      <Navbar onFreePillClick={scrollToFaq} />
      <Hero />
      <UseCases />
      <Integrations />
      <Features />
      <Pricing />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
}

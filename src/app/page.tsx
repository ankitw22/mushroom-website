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
  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-0">
      <Navbar onFreePillClick={scrollToPricing} />
      <Hero />
      <Integrations />
      <UseCases />
      <Features />
      <Pricing />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
}

'use client';

import { useLayoutEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Integrations from '@/components/sections/Integrations';
import AiClients from '@/components/sections/AiClients';
import Features from '@/components/sections/Features';
import Pricing from '@/components/sections/Pricing';
import Blog from '@/components/sections/Blog';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/ui/Footer';
import Hero from '@/components/hero/Hero';
import Hero2 from '@/components/hero/Hero2';

const USER_ID_COOKIE = 'userId';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

interface HomeClientProps {
  userId: number;
  shouldSetCookie: boolean;
}

export default function HomeClient({ userId, shouldSetCookie }: HomeClientProps) {
  useLayoutEffect(() => {
    if (shouldSetCookie) {
      document.cookie = `${USER_ID_COOKIE}=${userId}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
    }
  }, [shouldSetCookie, userId]);

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-0">
      <Navbar onFreePillClick={scrollToPricing} />
      {userId % 2 === 0 ? <Hero /> : <Hero2 />}
      <Integrations />
      <AiClients />
      <Features />
      <Pricing />
      <Blog />
      <FAQ />
      <Footer />
    </div>
  );
}

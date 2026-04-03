'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FAQ from '@/components/ui/FAQ';
import styles from './pricing.module.css';

const FAQ_DATA = [
  {
    id: 'free',
    q: 'Is Mushrooms really free?',
    a: 'Yes. Free for individual use, for life. No trials, no expiry, no credit card needed.',
  },
  {
    id: 'fair-usage-exceed',
    q: 'What happens if I exceed fair usage?',
    a: "We'll reach out before anything changes. Fair usage is about intent — genuine users doing real work are always fine.",
  },
  {
    id: 'difference',
    q: "What's the difference between Mushrooms and the Embed?",
    a: 'Mushrooms is the dashboard you use to power your own AI. The Embed is for companies who want to offer this capability inside their own product to their own users.',
  },
  {
    id: 'code',
    q: 'Do I need to know how to code?',
    a: "No. Connect your apps, copy your MCP URL, paste it into your AI client. That's it.",
  },
  {
    id: 'self-host',
    q: 'Can I self-host Mushrooms?',
    a: "Self-hosting is available on the Enterprise Embed plan. Individual users run on Mushrooms' hosted infrastructure.",
  },
  {
    id: 'fair-usage',
    q: 'What does fair usage mean?',
    a: 'No hard limits, no meters running. Fair usage means real people doing real work — not abuse, not spam bots. If you\'re a genuine user, you\'re good.',
    link: {
      href: 'https://viasocket.com/help/viaSocket-MCP/Fair-Usage-Policy',
      text: 'Read the full policy →',
    },
  },
];

const FEATURES = [
  '2,000+ Apps',
  'Free to use',
  'No Code Required',
  'Granular Permissions',
  'Audit Logs',
  'History Logs',
];

export default function PricingPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = sectionRef.current;
    if (section) {
      section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.pricingPageWrapper}>
      <Navbar />
      
      {/* PAGE HEADER */}
      <div className={styles.pricingPageHeader}>
        <div className={styles.pricingPageHeaderInner}>
          <nav className={styles.pricingBreadcrumb}>
            <Link href="/">Mushrooms</Link>
            <span className={styles.pricingBreadcrumbSep}>›</span>
            <span className={styles.pricingBreadcrumbCurrent}>Pricing</span>
          </nav>
          <h1 className={styles.pricingPageHeadline}>Free to use. Built to scale.</h1>
        </div>
      </div>

      {/* TWO-COLUMN PRICING BLOCK */}
      <section className={styles.pricingBlock}>
        <div className={styles.pricingBlockInner}>
          {/* FREE CARD */}
          <div className={styles.pcCardFree}>
            <p className={styles.pcLabel}>For Individuals</p>
            <h2 className={styles.pcHeadline}>Start Free.</h2>
            <p className={styles.pcSub}>
              Connect your AI to the tools you already use — no setup fees, no subscription, no lock-in.
            </p>
            <ul className={styles.pcList}>
              <li>No credit card</li>
              <li>Fair usage, no hard limits</li>
              <li>2,000+ integrations</li>
              <li>Works with Claude, ChatGPT, Cursor, Windsurf + more</li>
            </ul>
            <a
              href="https://app.mushroom.viasocket.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pcCtaFull}
            >
              Get Started Free →
            </a>
          </div>

          {/* ENTERPRISE CARD */}
          <div className={styles.pcCardEnt}>
            <p className={styles.pcLabel}>For Enterprise</p>
            <h2 className={styles.pcHeadline}>Building an AI product?</h2>
            <p className={styles.pcSub}>
              Give your users the power to connect their own apps — without building the integrations yourself.
            </p>
            <ul className={styles.pcList}>
              <li>White-labelled, your brand</li>
              <li>2,000+ apps, no pipelines to build</li>
              <li>Ships in hours, one script tag</li>
              <li>Self-hosted MCP, your infrastructure</li>
            </ul>
            <div className={styles.pcCtasSplit}>
              <a
                href="https://viasocket.com/embed"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pcCtaSplitLeft}
              >
                Explore Embed
              </a>
              <a href="mailto:support@viasocket.com" className={styles.pcCtaSplitRight}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className={styles.sectionFeaturesStrip}>
        <div className={styles.featuresStripInner}>
          {FEATURES.map((feature, idx) => (
            <span key={feature}>
              <span className={styles.fsItem}>{feature}</span>
              {idx < FEATURES.length - 1 && <span className={styles.fsDivider} />}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQ data={FAQ_DATA} />

      <Footer />
    </div>
  );
}

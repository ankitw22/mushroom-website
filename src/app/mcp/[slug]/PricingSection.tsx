import React from 'react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <div className="pricing-band" id="pricing">
      <div className="pricing-wrap" style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: 20, padding: '52px 52px 56px' }}>
        <div className="pricing-header" style={{ marginBottom: 40 }}>
          <h2 className="section-headline" style={{ fontSize: 'clamp(20px, 2.6vw, 34px)', marginBottom: 10 }}>Start getting work done via <span style={{ color: '#068F57' }}>Mushrooms</span></h2>
          <p className="section-sub" style={{ color: 'var(--ink)', maxWidth: 'none' }}>Break free from isolation. Connect your AI to real-world tools for smarter, more impactful results.</p>
        </div>
        <div className="pricing-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="pricing-card" style={{ border: '1.5px solid rgba(0, 0, 0, 0.1)', borderRadius: 14, padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>Free for Lifetime</h3>
            <p style={{ fontSize: 14, color: 'rgba(10, 10, 10, 0.6)', lineHeight: 1.65, flex: 1 }}>Mushrooms is free to use for lifetime under a fair usage policy, without rate limits.</p>
            <Link href="https://app.mushroom.viasocket.com/login" target="_blank" className="pricing-card-cta" style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--ink)', textDecoration: 'none', padding: '10px 22px', borderRadius: 100, alignSelf: 'flex-start' }}>Get your Cluster URL</Link>
          </div>
          <div className="pricing-card" style={{ border: '1.5px solid rgba(0, 0, 0, 0.1)', borderRadius: 14, padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>For Enterprises</h3>
            <p style={{ fontSize: 14, color: 'rgba(10, 10, 10, 0.6)', lineHeight: 1.65, flex: 1 }}>Mushrooms for Enterprises empowers AI models to securely connect to thousands of apps in minutes.</p>
            <Link href="https://viasocket.com/contact-sales" target="_blank" className="pricing-card-cta" style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--ink)', textDecoration: 'none', padding: '10px 22px', borderRadius: 100, alignSelf: 'flex-start' }}>Contact Sales</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

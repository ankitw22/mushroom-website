import React from 'react';

export function McpHowItWorks({ appName }: { appName: string }) {
  const steps = [
    {
      num: 1,
      title: "Get Your Cluster URL",
      desc: "Instantly get a unique, secure URL that connects your AI assistant to Mushrooms' network of integrations."
    },
    {
      num: 2,
      title: "Choose Your Actions",
      desc: `Choose and configure the ${appName} actions your AI can perform, with granular per-action permissions.`
    },
    {
      num: 3,
      title: "Connect Your AI Assistant",
      desc: "Paste your Cluster URL into Claude, ChatGPT, or Cursor. Every action is scoped and approved."
    }
  ];

  return (
    <div className="how-section">
      <div className="how-header" style={{ marginBottom: 56, textAlign: 'center' }}>
        <h2 className="section-headline" style={{ marginBottom: 10 }}>Connect {appName} to Any<br /><span style={{ color: 'var(--green-dark)' }}>AI Assistant</span></h2>
        <p className="section-sub" style={{ maxWidth: 'none' }}>Mushrooms connects your AI to real-world tools and translates intent into controlled actions.</p>
      </div>

      <div className="how-stepper" style={{ display: 'flex', alignItems: 'flex-end', position: 'relative', marginBottom: 0 }}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="how-step" style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <div className="how-step-circle">{step.num}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className="how-step-gap" style={{ flexShrink: 0, width: 72 }}></div>
            )}
          </React.Fragment>
        ))}
        {/* Connecting Line */}
        <div style={{ position: 'absolute', top: 26, left: '15%', right: '15%', height: 2, background: 'rgba(255, 255, 255, 0.3)', zIndex: 0 }}></div>
      </div>

      <div className="how-cards" style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="how-card" style={{ padding: '44px 40px 52px', border: 'none', boxShadow: 'none' }}>
              <div className="how-card-num" style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 700, color: 'rgba(6,143,87,0.25)', letterSpacing: '0.05em', lineHeight: 1 }}>{String(step.num).padStart(2, '0')}</div>
              <div className="how-card-title" style={{ fontSize: 28, fontWeight: 700, color: '#068F57', lineHeight: 1.15 }}>{step.title}</div>
              <div className="how-card-desc" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.65 }}>{step.desc}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className="how-card-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '0 8px' }}>
                <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 56, height: 44, opacity: 0.2 }}>
                  <line x1="6" y1="15" x2="46" y2="15" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="square" />
                  <line x1="6" y1="29" x2="46" y2="29" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="square" />
                  <polyline points="42,7 58,22 42,37" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

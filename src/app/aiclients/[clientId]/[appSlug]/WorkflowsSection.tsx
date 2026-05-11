interface WorkflowsSectionProps {
  clientTitle: string;
  appName: string;
  useCases: string[];
}

export function WorkflowsSection({ clientTitle, appName, useCases }: WorkflowsSectionProps) {
  const shown = useCases.slice(0, 6);
  if (shown.length === 0) return null;

  return (
    <section className="workflows-section">
      <div style={{ textAlign: 'center', marginBottom: 0 }}>
        <h2
          style={{
            fontFamily: 'var(--pixel)',
            fontSize: 'clamp(22px, 3vw, 38px)',
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {clientTitle} + {appName}{' '}
          <span style={{ color: '#068F57' }}>Use Cases</span>
        </h2>
        <p style={{ fontFamily: 'var(--body)', fontSize: 16, color: 'rgba(10,10,10,0.6)', maxWidth: 600, margin: '0 auto' }}>
          {clientTitle} works best when it reaches across your whole stack — here&apos;s what that looks like in practice.
        </p>
      </div>

      <div className="workflows-grid">
        {shown.map((useCase, i) => (
          <div key={i} className="workflow-card">
            <p className="workflow-sentence">{useCase}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

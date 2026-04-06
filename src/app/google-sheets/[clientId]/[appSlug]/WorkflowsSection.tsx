interface Combination {
  description: string;
  trigger: { name: string };
  actions: { name: string }[];
}

interface WorkflowsSectionProps {
  clientTitle: string;
  appName: string;
  combinations: Combination[];
}

export function WorkflowsSection({ clientTitle, appName, combinations }: WorkflowsSectionProps) {
  const shown = combinations.slice(0, 6);
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
        {shown.map((combo, i) => (
          <div key={i} className="workflow-card">
            <p className="workflow-sentence">{combo.description}</p>
            <p className="workflow-meta">
              {combo.trigger.name}
              {combo.actions.length > 0 && ` → ${combo.actions.map((a) => a.name).join(', ')}`}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

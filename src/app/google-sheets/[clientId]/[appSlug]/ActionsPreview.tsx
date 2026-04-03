import Link from 'next/link';

interface Action {
  name: string;
  description: string;
}

interface ActionsPreviewProps {
  clientTitle: string;
  appName: string;
  appSlug: string;
  actions: Action[];
}

export function ActionsPreview({ clientTitle, appName, appSlug, actions }: ActionsPreviewProps) {
  const shown = actions.slice(0, 4);
  if (shown.length === 0) return null;

  return (
    <section className="actions-preview-section">
      <h2
        style={{
          fontFamily: 'var(--pixel)',
          fontSize: 'clamp(20px, 2.8vw, 36px)',
          color: 'var(--ink)',
          lineHeight: 1.3,
        }}
      >
        What {clientTitle} Can Do{' '}
        <span style={{ color: '#068F57' }}>in {appName}</span>
      </h2>

      <div className="actions-preview-grid">
        {shown.map((action, i) => (
          <div key={i} className="action-preview-card">
            <div className="action-preview-name">{action.name}</div>
            <div className="action-preview-desc">{action.description}</div>
          </div>
        ))}
      </div>

      {actions.length > 4 && (
        <Link href={`/mcp/${appSlug}`} className="actions-more-link">
          View all {actions.length} actions in {appName} →
        </Link>
      )}
    </section>
  );
}

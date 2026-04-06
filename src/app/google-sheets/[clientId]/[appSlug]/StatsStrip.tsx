const STATS = [
  '2,000+ Apps',
  'Free to use',
  'No Code Required',
  'Granular Permissions',
  'Audit Logs',
  'History Logs',
];

export function StatsStrip() {
  return (
    <div className="stats-strip">
      {STATS.map((stat, i) => (
        <span key={stat} style={{ display: 'contents' }}>
          <span className="stat-item">{stat}</span>
          {i < STATS.length - 1 && <span className="stat-divider" />}
        </span>
      ))}
    </div>
  );
}

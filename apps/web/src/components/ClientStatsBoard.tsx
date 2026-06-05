import { CLIENT_ORDER, getClientStyle } from '@/lib/clients';
import type { DashboardSummary } from '@/lib/api';

export function ClientStatsBoard({ summary }: { summary: DashboardSummary }) {
  const statsMap = new Map(
    summary.clientStats.map((c) => [c.clientName, c]),
  );

  const ordered = CLIENT_ORDER.filter((n) => statsMap.has(n)).map(
    (n) => statsMap.get(n)!,
  );

  return (
    <div className="stats-board">
      <div className="stats-panel">
        <h3 className="stats-title">HOW MANY VIDEOS HAVE BEEN SHOT?</h3>
        <div className="stats-grid">
          {ordered.map((c) => {
            const style = getClientStyle(c.clientName);
            return (
              <div key={c.clientId} className="stats-column">
                <div
                  className="stats-cell label"
                  style={{ background: style.bg, color: style.text }}
                >
                  {c.clientName}
                </div>
                <div className="stats-cell value">{c.shot}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-panel">
        <h3 className="stats-title">HOW MANY VIDEOS HAVE BEEN POSTED?</h3>
        <div className="stats-grid">
          {ordered.map((c) => {
            const style = getClientStyle(c.clientName);
            return (
              <div key={c.clientId} className="stats-column">
                <div
                  className="stats-cell label"
                  style={{ background: style.bg, color: style.text }}
                >
                  {c.clientName}
                </div>
                <div className="stats-cell value">{c.published}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

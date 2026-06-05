import { ClientStatsBoard } from '@/components/ClientStatsBoard';
import { ImportCsvPanel } from '@/components/ImportCsvPanel';
import { api } from '@/lib/api-server';
import type { DashboardSummary } from '@/lib/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let summary: DashboardSummary | null = null;
  let error: string | null = null;

  try {
    summary = await api<DashboardSummary>('/dashboard/summary');
  } catch {
    error = 'Connect the API and database — run START.bat';
  }

  return (
    <main className="page page-wide">
      <h1 className="page-title">RG Marketing Content Calendar</h1>
      <p className="page-sub">Dashboard — replaces your Google Sheet counters</p>

      {error && <p className="page-sub error">{error}</p>}

      {summary && (
        <>
          <ClientStatsBoard summary={summary} />

          <ImportCsvPanel />

          <div className="kpi-grid" style={{ marginTop: 20 }}>
            <Kpi label="Total clients" value={summary.clients} />
            <Kpi label="Planned" value={summary.planned} />
            <Kpi label="Shot (all)" value={summary.shot} />
            <Kpi label="Posted (all)" value={summary.published} />
          </div>

          <Link href="/content?month=5&year=2025&view=shoot" className="cta-link">
            Open May Shoot calendar →
          </Link>
        </>
      )}
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

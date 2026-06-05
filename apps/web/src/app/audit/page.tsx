'use client';

import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Log = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  user: { name: string } | null;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/audit`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setLogs)
      .catch(() => {});
  }, []);

  return (
    <main className="page">
      <h1 className="page-title">Audit Logs</h1>
      {logs.map((l) => (
        <div key={l.id} className="content-card">
          <strong>{l.action}</strong>
          <p className="page-sub">
            {l.entityType} · {l.user?.name ?? 'System'} ·{' '}
            {new Date(l.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
      {logs.length === 0 && <p className="page-sub">No audit entries yet (admin only).</p>}
    </main>
  );
}

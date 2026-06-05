'use client';

import { ClientChip } from '@/components/ClientChip';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Shoot = {
  id: string;
  date: string;
  startTime: string | null;
  location: string | null;
  status: string;
  client: { name: string };
  contentItem: { title: string } | null;
};

export default function ShootsPage() {
  const [shoots, setShoots] = useState<Shoot[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/shoots`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setShoots)
      .catch(() => {});
  }, []);

  return (
    <main className="page">
      <h1 className="page-title">Shooting Schedule</h1>
      {shoots.map((s) => (
        <div key={s.id} className="content-card">
          <ClientChip name={s.client.name} />
          <h3>{s.contentItem?.title ?? 'Shoot session'}</h3>
          <p className="page-sub">
            {new Date(s.date).toLocaleDateString()} {s.startTime ?? ''} · {s.location ?? 'TBD'}
          </p>
          <span className="badge">{s.status}</span>
        </div>
      ))}
    </main>
  );
}

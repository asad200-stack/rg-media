'use client';

import { ClientChip } from '@/components/ClientChip';
import { StatusToggle } from '@/components/StatusToggle';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { isPosted } from '@/lib/clients';
import { useEffect, useState } from 'react';

type Item = {
  id: string;
  title: string;
  publishingDate: string | null;
  publishTime: string | null;
  publishedUrl: string | null;
  publishingStatus: string;
  client: { name: string };
};

export default function PublishPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/content?view=post&month=5&year=2025`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  return (
    <main className="page">
      <h1 className="page-title">Publishing Calendar</h1>
      {items.map((i) => (
        <div key={i.id} className="content-card">
          <ClientChip name={i.client.name} />
          <h3>{i.title}</h3>
          <p className="page-sub">
            {i.publishingDate?.slice(0, 10)} {i.publishTime ?? ''}
          </p>
          <StatusToggle id={i.id} field="published" value={isPosted(i.publishingStatus)} />
          {i.publishedUrl && (
            <a href={i.publishedUrl} target="_blank" rel="noreferrer">
              Published URL ↗
            </a>
          )}
        </div>
      ))}
    </main>
  );
}

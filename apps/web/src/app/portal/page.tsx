'use client';

import { ClientChip } from '@/components/ClientChip';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Item = {
  id: string;
  title: string;
  description: string | null;
  client: { name: string };
  approvalStatus: string;
};

export default function PortalPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/portal/content`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  async function approve(id: string, status: string) {
    await fetch(`${API_BASE_URL}/approvals/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ status }),
    });
    setItems((list) => list.filter((i) => i.id !== id));
  }

  return (
    <main className="page">
      <h1 className="page-title">Client Portal</h1>
      <p className="page-sub">Review and approve content</p>
      {items.map((i) => (
        <div key={i.id} className="content-card">
          <ClientChip name={i.client.name} />
          <h3>{i.title}</h3>
          <p>{i.description}</p>
          <div className="actions">
            <button type="button" className="btn primary" onClick={() => approve(i.id, 'APPROVED')}>
              Approve
            </button>
            <button type="button" className="btn" onClick={() => approve(i.id, 'REJECTED')}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}

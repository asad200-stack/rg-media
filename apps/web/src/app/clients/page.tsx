import { api } from '@/lib/api-server';
import type { Client } from '@/lib/api';

type ClientRow = {
  id: string;
  name: string;
  _count: { contentItems: number };
};

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  let clients: ClientRow[] = [];
  let error: string | null = null;

  try {
    clients = await api<ClientRow[]>('/clients');
  } catch {
    error = 'Unable to load clients.';
  }

  return (
    <main className="page">
      <h1 className="page-title">Clients</h1>
      <p className="page-sub">From your content calendar sheet</p>
      {error && <p className="page-sub">{error}</p>}
      {clients.map((c) => (
        <div key={c.id} className="client-row">
          <span>{c.name}</span>
          <span className="meta">{c._count.contentItems} items</span>
        </div>
      ))}
    </main>
  );
}

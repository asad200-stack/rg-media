'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { CLIENT_ORDER, getClientStyle } from '@/lib/clients';

type Client = { id: string; name: string };

export function ContentToolbar({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');

  const clientId = params.get('clientId') ?? '';

  const apply = useCallback(
    (next: { search?: string; clientId?: string }) => {
      const q = new URLSearchParams(params.toString());
      if (next.search !== undefined) {
        if (next.search) q.set('search', next.search);
        else q.delete('search');
      }
      if (next.clientId !== undefined) {
        if (next.clientId) q.set('clientId', next.clientId);
        else q.delete('clientId');
      }
      router.push(`/content?${q.toString()}`);
    },
    [params, router],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== (params.get('search') ?? '')) apply({ search });
    }, 400);
    return () => clearTimeout(t);
  }, [search, apply, params]);

  const ordered = CLIENT_ORDER.map(
    (name) => clients.find((c) => c.name === name),
  ).filter(Boolean) as Client[];

  return (
    <div className="content-toolbar">
      <input
        type="search"
        className="toolbar-search"
        placeholder="Search title, client, script…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="toolbar-filters">
        <button
          type="button"
          className={`filter-chip ${!clientId ? 'active' : ''}`}
          onClick={() => apply({ clientId: '' })}
        >
          All
        </button>
        {ordered.map((c) => {
          const style = getClientStyle(c.name);
          return (
            <button
              key={c.id}
              type="button"
              className={`filter-chip ${clientId === c.id ? 'active' : ''}`}
              style={
                clientId === c.id
                  ? { background: style.bg, color: style.text }
                  : undefined
              }
              onClick={() => apply({ clientId: c.id })}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

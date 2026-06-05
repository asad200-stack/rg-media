'use client';

import { ClientChip } from '@/components/ClientChip';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useEffect, useState } from 'react';

const COLUMNS = [
  'PLANNED',
  'SCHEDULED_FOR_SHOOTING',
  'SHOT',
  'EDITING',
  'REVIEW',
  'APPROVED',
  'PUBLISHED',
];

type Item = {
  id: string;
  title: string;
  workflowStatus: string;
  client: { name: string };
};

export default function KanbanPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/content/kanban`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  return (
    <main className="page page-wide">
      <h1 className="page-title">Workflow Kanban</h1>
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div key={col} className="kanban-col">
            <h3>{col.replace(/_/g, ' ')}</h3>
            {items
              .filter((i) => i.workflowStatus === col)
              .map((i) => (
                <div key={i.id} className="kanban-card">
                  <ClientChip name={i.client.name} />
                  <p>{i.title}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </main>
  );
}

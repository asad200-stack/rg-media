'use client';

import { ClientChip } from '@/components/ClientChip';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  contentItem: { title: string; client: { name: string } };
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {});
  }, []);

  async function toggle(id: string, isCompleted: boolean) {
    await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ isCompleted }),
    });
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, isCompleted } : x)));
  }

  return (
    <main className="page">
      <h1 className="page-title">Tasks</h1>
      <p className="page-sub">Auto-generated from content workflow</p>
      {tasks.map((t) => (
        <div key={t.id} className="content-card">
          <ClientChip name={t.contentItem.client.name} />
          <h3>{t.title}</h3>
          <p className="page-sub">{t.contentItem.title}</p>
          <label>
            <input
              type="checkbox"
              checked={t.isCompleted}
              onChange={(e) => toggle(t.id, e.target.checked)}
            />
            Done
          </label>
        </div>
      ))}
    </main>
  );
}

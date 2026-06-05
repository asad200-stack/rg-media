'use client';

import { LogoutButton } from '@/components/AuthGate';
import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MorePage() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; isRead: boolean }[]
  >([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/notifications`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setNotifications)
      .catch(() => {});
  }, []);

  function setRtl() {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }

  function setLtr() {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }

  async function exportCsv() {
    const res = await fetch(`${API_BASE_URL}/reports/content.csv`, {
      headers: authHeaders(),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page">
      <h1 className="page-title">More</h1>

      <section className="more-section">
        <h2>Modules</h2>
        <Link href="/kanban" className="more-link">Workflow Kanban</Link>
        <Link href="/shoots" className="more-link">Shooting Schedule</Link>
        <Link href="/publish" className="more-link">Publishing Calendar</Link>
        <Link href="/portal" className="more-link">Client Portal</Link>
        <Link href="/clients" className="more-link">Clients</Link>
        <Link href="/audit" className="more-link">Audit Logs</Link>
      </section>

      <section className="more-section">
        <h2>Reports</h2>
        <button type="button" className="more-link btn-link" onClick={exportCsv}>
          Export Content CSV
        </button>
      </section>

      <section className="more-section">
        <h2>Language</h2>
        <button type="button" className="more-link btn-link" onClick={setRtl}>Arabic (RTL)</button>
        <button type="button" className="more-link btn-link" onClick={setLtr}>English (LTR)</button>
      </section>

      <section className="more-section">
        <h2>Notifications ({notifications.filter((n) => !n.isRead).length})</h2>
        {notifications.slice(0, 5).map((n) => (
          <div key={n.id} className="notif-row">
            <strong>{n.title}</strong>
            <p>{n.body}</p>
          </div>
        ))}
      </section>

      <LogoutButton />
    </main>
  );
}

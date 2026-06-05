import { api } from '@/lib/api-server';
import type { ContentItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  let items: ContentItem[] = [];

  try {
    items = await api<ContentItem[]>('/content');
  } catch {
    /* empty */
  }

  const byDate = new Map<string, ContentItem[]>();
  for (const item of items) {
    if (!item.filmingDate) continue;
    const key = item.filmingDate.slice(0, 10);
    const list = byDate.get(key) ?? [];
    list.push(item);
    byDate.set(key, list);
  }

  const dates = [...byDate.keys()].sort();

  return (
    <main className="page">
      <h1 className="page-title">Calendar</h1>
      <p className="page-sub">Filming schedule (daily timeline)</p>
      {dates.length === 0 && (
        <p className="page-sub">No scheduled filming dates yet.</p>
      )}
      {dates.map((date) => (
        <section key={date} style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            {new Date(date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </h2>
          {(byDate.get(date) ?? []).map((item) => (
            <div key={item.id} className="content-card">
              <h3>{item.title}</h3>
              <div className="meta">
                <span>{item.client.name}</span>
                {item.shootStartTime && <span>{item.shootStartTime}</span>}
              </div>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}

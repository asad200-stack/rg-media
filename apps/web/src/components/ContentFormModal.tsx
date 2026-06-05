'use client';

import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import type { ContentItem } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Client = { id: string; name: string };

type FormState = {
  clientId: string;
  title: string;
  description: string;
  script: string;
  referenceUrl: string;
  note: string;
  filmingDate: string;
  shootStartTime: string;
  publishingDate: string;
  publishTime: string;
  shot: boolean;
  posted: boolean;
};

const empty: FormState = {
  clientId: '',
  title: '',
  description: '',
  script: '',
  referenceUrl: '',
  note: '',
  filmingDate: '',
  shootStartTime: '',
  publishingDate: '',
  publishTime: '',
  shot: false,
  posted: false,
};

function fromItem(item: ContentItem): FormState {
  return {
    clientId: item.client.id,
    title: item.title,
    description: item.description ?? '',
    script: item.script ?? '',
    referenceUrl: item.references[0]?.url ?? '',
    note: '',
    filmingDate: item.filmingDate?.slice(0, 10) ?? '',
    shootStartTime: item.shootStartTime ?? '',
    publishingDate: item.publishingDate?.slice(0, 10) ?? '',
    publishTime: item.publishTime ?? '',
    shot: false,
    posted: false,
  };
}

export function ContentFormModal({
  clients,
  item,
  open,
  onClose,
}: {
  clients: Client[];
  item?: ContentItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(item ? fromItem(item) : { ...empty, clientId: clients[0]?.id ?? '' });
      setError('');
    }
  }, [open, item, clients]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.clientId) {
      setError('Title and client are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = {
        ...form,
        filmingDate: form.filmingDate || undefined,
        publishingDate: form.publishingDate || undefined,
      };
      const url = item
        ? `${API_BASE_URL}/content/${item.id}`
        : `${API_BASE_URL}/content`;
      const res = await fetch(url, {
        method: item ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      onClose();
      router.refresh();
    } catch {
      setError('Could not save. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="preview-backdrop" onClick={onClose} role="presentation">
      <form
        className="preview-panel form-panel"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <header>
          <h2>{item ? 'Edit content' : 'Add content'}</h2>
          <button type="button" className="preview-close" onClick={onClose}>
            ✕
          </button>
        </header>

        <label>
          Client
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            required
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            dir="auto"
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            dir="auto"
          />
        </label>

        <label>
          Script
          <textarea
            value={form.script}
            onChange={(e) => setForm({ ...form, script: e.target.value })}
            rows={4}
            dir="auto"
            placeholder="Script text or Google Doc name"
          />
        </label>

        <div className="form-row">
          <label>
            Filming date
            <input
              type="date"
              value={form.filmingDate}
              onChange={(e) => setForm({ ...form, filmingDate: e.target.value })}
            />
          </label>
          <label>
            Time
            <input
              value={form.shootStartTime}
              onChange={(e) => setForm({ ...form, shootStartTime: e.target.value })}
              placeholder="16:00"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Publish date
            <input
              type="date"
              value={form.publishingDate}
              onChange={(e) => setForm({ ...form, publishingDate: e.target.value })}
            />
          </label>
          <label>
            Publish time
            <input
              value={form.publishTime}
              onChange={(e) => setForm({ ...form, publishTime: e.target.value })}
              placeholder="04:00"
            />
          </label>
        </div>

        <label>
          Reference URL (Instagram)
          <input
            value={form.referenceUrl}
            onChange={(e) => setForm({ ...form, referenceUrl: e.target.value })}
            placeholder="https://instagram.com/reel/..."
          />
        </label>

        <label>
          Notes
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            dir="auto"
          />
        </label>

        {!item && (
          <div className="form-checks">
            <label>
              <input
                type="checkbox"
                checked={form.shot}
                onChange={(e) => setForm({ ...form, shot: e.target.checked })}
              />
              Already shot
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.posted}
                onChange={(e) => setForm({ ...form, posted: e.target.checked })}
              />
              Already posted
            </label>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Saving…' : item ? 'Update' : 'Add row'}
        </button>
      </form>
    </div>
  );
}

export function AddContentFab({
  clients,
}: {
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="fab"
        aria-label="Add content"
        onClick={() => setOpen(true)}
      >
        +
      </button>
      <ContentFormModal
        clients={clients}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

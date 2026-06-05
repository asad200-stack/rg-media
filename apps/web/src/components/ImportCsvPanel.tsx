'use client';

import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ImportCsvPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE_URL}/admin/import/calendar?year=2025`, {
        method: 'POST',
        headers: authHeaders(),
        body: fd,
      });
      const data = (await res.json()) as {
        imported: number;
        skipped: number;
        errors: string[];
      };
      setResult(
        `Imported ${data.imported} rows, skipped ${data.skipped}` +
          (data.errors?.length ? `. Errors: ${data.errors.slice(0, 3).join('; ')}` : ''),
      );
      router.refresh();
    } catch {
      setResult('Import failed — run START.bat first');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="import-panel">
      <h3>Import from Google Sheets</h3>
      <p className="page-sub" style={{ marginBottom: 12 }}>
        File → Download → CSV, then upload here
      </p>
      <label className="import-btn">
        {loading ? 'Importing…' : 'Upload CSV file'}
        <input type="file" accept=".csv" hidden onChange={onFile} disabled={loading} />
      </label>
      {result && <p className="import-result">{result}</p>}
    </div>
  );
}

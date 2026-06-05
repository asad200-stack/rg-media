'use client';

import { API_BASE_URL } from '@/lib/api';
import { authHeaders } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function StatusToggle({
  id,
  field,
  value,
}: {
  id: string;
  field: 'shot' | 'published';
  value: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  async function setYes(yes: boolean) {
    setLoading(true);
    setOpen(false);
    try {
      await fetch(`${API_BASE_URL}/content/${id}/${field}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ yes }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="status-toggle" ref={ref}>
      <button
        type="button"
        className={`status-pill ${value ? 'yes' : 'no'}`}
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
      >
        {value ? 'Yes' : 'No'}
      </button>
      {open && (
        <div className="status-menu">
          <button type="button" className="status-option yes" onClick={() => setYes(true)}>
            <span className="dot green" /> Yes
          </button>
          <button type="button" className="status-option no" onClick={() => setYes(false)}>
            <span className="dot red" /> No
          </button>
        </div>
      )}
    </div>
  );
}

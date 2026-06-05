'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export function ContentActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(path: string) {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/content/${id}/${path}`, { method: 'PATCH' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="actions">
      <button
        type="button"
        className="btn"
        disabled={loading || status === 'SHOT' || status === 'PUBLISHED'}
        onClick={() => patch('shot')}
      >
        Shot
      </button>
      <button
        type="button"
        className="btn primary"
        disabled={loading || status === 'PUBLISHED'}
        onClick={() => patch('published')}
      >
        Posted
      </button>
    </div>
  );
}

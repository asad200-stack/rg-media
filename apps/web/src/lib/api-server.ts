import { cookies } from 'next/headers';

function serverApiBase() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/v1`;
  }
  const root = (process.env.API_URL ?? 'http://localhost:3001').replace(/\/$/, '');
  return `${root}/api/v1`;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const store = await cookies();
  const token = store.get('rg_token')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${serverApiBase()}${path}`, {
    ...init,
    headers,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

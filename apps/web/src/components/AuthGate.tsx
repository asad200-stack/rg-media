'use client';

import { clearAuth, getToken } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/login') {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready && pathname !== '/login') return null;
  return <>{children}</>;
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="logout-btn"
      onClick={() => {
        clearAuth();
        router.replace('/login');
      }}
    >
      Logout
    </button>
  );
}

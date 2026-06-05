'use client';

import { AuthGate } from '@/components/AuthGate';
import { BottomNav } from '@/components/BottomNav';
import { usePathname } from 'next/navigation';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  if (isLogin) return <>{children}</>;

  return (
    <AuthGate>
      <div className="app-shell">{children}</div>
      <BottomNav />
    </AuthGate>
  );
}

'use client';

import { BottomNav } from '@/components/BottomNav';
import { LogoutButton } from '@/components/AuthGate';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/content?month=5&year=2025&view=shoot', label: 'Calendar' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/more', label: 'More' },
];

export function BottomNavBar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <>
      <nav className="bottom-nav" aria-label="Main">
        {mainLinks.map((link) => {
          const active =
            link.href === '/'
              ? pathname === '/'
              : link.href.includes('content')
                ? pathname.startsWith('/content')
                : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={active ? 'active' : undefined}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

// re-export for AppChrome
export { BottomNavBar as BottomNav };

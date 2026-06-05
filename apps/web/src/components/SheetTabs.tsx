import Link from 'next/link';
import { SHEET_TABS } from '@/lib/clients';

export function SheetTabs({
  month,
  year,
  view,
}: {
  month: number;
  year: number;
  view: 'shoot' | 'post';
}) {
  return (
    <div className="sheet-tabs">
      {SHEET_TABS.map((tab) => {
        const active =
          tab.month === month && tab.year === year && tab.view === view;
        return (
          <Link
            key={tab.label}
            href={`/content?month=${tab.month}&year=${tab.year}&view=${tab.view}`}
            className={active ? 'active' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

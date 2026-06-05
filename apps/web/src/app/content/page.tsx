import { Suspense } from 'react';
import { AddContentFab } from '@/components/ContentFormModal';
import { ContentSpreadsheet } from '@/components/ContentSpreadsheet';
import { ContentToolbar } from '@/components/ContentToolbar';
import { SheetTabs } from '@/components/SheetTabs';
import { api } from '@/lib/api-server';
import { contentQuery, type Client, type ContentItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{
    month?: string;
    year?: string;
    view?: string;
    clientId?: string;
    search?: string;
  }>;
};

export default async function ContentPage({ searchParams }: Props) {
  const sp = await searchParams;
  const month = parseInt(sp.month ?? '5', 10);
  const year = parseInt(sp.year ?? '2025', 10);
  const view = sp.view === 'post' ? 'post' : 'shoot';

  let items: ContentItem[] = [];
  let clients: Client[] = [];
  let error: string | null = null;

  try {
    [items, clients] = await Promise.all([
      api<ContentItem[]>(
        `/content${contentQuery({
          month,
          year,
          view,
          clientId: sp.clientId,
          search: sp.search,
        })}`,
      ),
      api<Client[]>('/clients'),
    ]);
  } catch {
    error = 'Unable to load content. Run START.bat first.';
  }

  const tabLabel =
    view === 'post'
      ? `${month === 5 ? 'May' : 'June'} Post`
      : `${month === 5 ? 'May' : 'June'} Shoot`;

  return (
    <main className="page page-wide sheet-page">
      <header className="sheet-header">
        <div>
          <h1 className="page-title">RG Marketing Content Calendar</h1>
          <p className="page-sub">{tabLabel}</p>
        </div>
      </header>

      {error && <p className="page-sub error">{error}</p>}

      <Suspense fallback={null}>
        <ContentToolbar clients={clients} />
      </Suspense>

      <SheetTabs month={month} year={year} view={view} />
      <ContentSpreadsheet items={items} view={view} clients={clients} />
      <AddContentFab clients={clients} />
    </main>
  );
}

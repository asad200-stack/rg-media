export type ContentReference = { id: string; url: string; label: string | null };
export type ContentNote = { id: string; body: string };

export type ContentItem = {
  id: string;
  contentCode: string;
  title: string;
  description: string | null;
  script: string | null;
  workflowStatus: string;
  publishingStatus: string;
  approvalStatus?: string;
  priority: string;
  filmingDate: string | null;
  shootStartTime: string | null;
  publishingDate: string | null;
  publishTime: string | null;
  publishedUrl: string | null;
  client: { id: string; name: string };
  references: ContentReference[];
  notes: ContentNote[];
  assignedTo: { id: string; name: string } | null;
};

export type DashboardSummary = {
  clients: number;
  planned: number;
  shot: number;
  published: number;
  clientStats: {
    clientId: string;
    clientName: string;
    shot: number;
    published: number;
    total: number;
  }[];
};

export type Client = { id: string; name: string; _count?: { contentItems: number } };

export const API_BASE = '/api/v1';
export const API_BASE_URL = API_BASE;

export function contentQuery(params: {
  month?: number;
  year?: number;
  view?: 'shoot' | 'post';
  clientId?: string;
  search?: string;
}) {
  const q = new URLSearchParams();
  if (params.month) q.set('month', String(params.month));
  if (params.year) q.set('year', String(params.year));
  if (params.view) q.set('view', params.view);
  if (params.clientId) q.set('clientId', params.clientId);
  if (params.search) q.set('search', params.search);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const CLIENT_COLORS: Record<string, { bg: string; text: string }> = {
  'JOSEPH NADER': { bg: '#e8d5f5', text: '#5b2c6f' },
  FISHBITE: { bg: '#cfe2ff', text: '#084298' },
  'ABU HATEM': { bg: '#fff3cd', text: '#856404' },
  'SIT N DIP': { bg: '#f8d7da', text: '#842029' },
  BACHIR: { bg: '#e2e3e5', text: '#41464b' },
  JANATY: { bg: '#ffe5d0', text: '#984c0c' },
};

export const CLIENT_ORDER = [
  'JOSEPH NADER',
  'FISHBITE',
  'ABU HATEM',
  'SIT N DIP',
  'BACHIR',
  'JANATY',
];

export function getClientStyle(name: string) {
  return CLIENT_COLORS[name] ?? { bg: '#e2e3e5', text: '#41464b' };
}

export const SHOT_STATUSES = new Set([
  'SHOT',
  'EDITING',
  'REVIEW',
  'REVISION_REQUIRED',
  'APPROVED',
  'SCHEDULED_FOR_PUBLISHING',
  'PUBLISHED',
  'ARCHIVED',
]);

export function isShot(status: string) {
  return SHOT_STATUSES.has(status);
}

export function isPosted(status: string) {
  return status === 'PUBLISHED';
}

export function formatSheetDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export const SHEET_TABS = [
  { label: 'May Shoot', month: 5, year: 2025, view: 'shoot' as const },
  { label: 'May Post', month: 5, year: 2025, view: 'post' as const },
  { label: 'June Shoot', month: 6, year: 2025, view: 'shoot' as const },
  { label: 'June Post', month: 6, year: 2025, view: 'post' as const },
];

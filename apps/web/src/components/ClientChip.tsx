import { getClientStyle } from '@/lib/clients';

export function ClientChip({ name }: { name: string }) {
  const { bg, text } = getClientStyle(name);
  return (
    <span className="client-chip" style={{ background: bg, color: text }}>
      {name}
    </span>
  );
}

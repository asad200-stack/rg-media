'use client';

import { ClientChip } from '@/components/ClientChip';
import { StatusToggle } from '@/components/StatusToggle';
import { ContentFormModal } from '@/components/ContentFormModal';
import type { Client, ContentItem } from '@/lib/api';
import {
  formatSheetDate,
  isPosted,
  isShot,
} from '@/lib/clients';
import { useState } from 'react';

export function ContentSpreadsheet({
  items,
  view,
  clients,
}: {
  items: ContentItem[];
  view: 'shoot' | 'post';
  clients: Client[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const dateCol = view === 'post' ? 'publishingDate' : 'filmingDate';
  const timeCol = view === 'post' ? 'publishTime' : 'shootStartTime';

  if (items.length === 0) {
    return (
      <p className="empty-sheet">No content for this tab. Import from Google Sheet or add rows.</p>
    );
  }

  return (
    <>
      <div className="sheet-wrap">
        <table className="content-sheet">
          <thead>
            <tr>
              <th>{view === 'post' ? 'Publish Date' : 'Date of Filming'}</th>
              <th>Time</th>
              <th>Shot?</th>
              <th>Posted?</th>
              <th>Client</th>
              <th>Title</th>
              <th>Description</th>
              <th>Reference</th>
              <th>Script</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const dateVal = item[dateCol as keyof ContentItem] as string | null;
              const timeVal = item[timeCol as keyof ContentItem] as string | null;
              const ref = item.references[0]?.url;
              const note = item.notes[0]?.body;
              const open = expanded === item.id;

              return (
                <tr key={item.id} className={open ? 'expanded' : undefined}>
                  <td>{formatSheetDate(dateVal)}</td>
                  <td>{timeVal ?? '—'}</td>
                  <td>
                    <StatusToggle
                      id={item.id}
                      field="shot"
                      value={isShot(item.workflowStatus)}
                    />
                  </td>
                  <td>
                    <StatusToggle
                      id={item.id}
                      field="published"
                      value={isPosted(item.publishingStatus)}
                    />
                  </td>
                  <td>
                    <ClientChip name={item.client.name} />
                  </td>
                  <td className="cell-title">
                    <button
                      type="button"
                      className="cell-expand title-btn"
                      onClick={() => setEditItem(item)}
                    >
                      {item.title}
                    </button>
                  </td>
                  <td className="cell-desc">
                    <button
                      type="button"
                      className="cell-expand"
                      onClick={() => setExpanded(open ? null : item.id)}
                    >
                      {item.description ?? '—'}
                    </button>
                  </td>
                  <td className="cell-link">
                    {ref ? (
                      <a href={ref} target="_blank" rel="noreferrer">
                        Instagram ↗
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="cell-script">
                    {item.script ? (
                      <button
                        type="button"
                        className="script-chip"
                        onClick={() => setExpanded(open ? null : item.id)}
                      >
                        📄 {item.script.slice(0, 28)}
                        {item.script.length > 28 ? '…' : ''}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{note ?? '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => setEditItem(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {expanded && (
        <PreviewPanel
          item={items.find((i) => i.id === expanded)!}
          onClose={() => setExpanded(null)}
        />
      )}

      <div className="mobile-cards">
        {items.map((item) => (
          <article key={item.id} className="mobile-row">
            <div className="mobile-row-top">
              <ClientChip name={item.client.name} />
              <span className="mobile-date">
                {formatSheetDate(
                  (item[dateCol as keyof ContentItem] as string | null) ?? null,
                )}
                {item[timeCol as keyof ContentItem]
                  ? ` · ${item[timeCol as keyof ContentItem]}`
                  : ''}
              </span>
            </div>
            <h3>{item.title}</h3>
            <button type="button" className="edit-btn mobile" onClick={() => setEditItem(item)}>
              Edit
            </button>
            <p className="mobile-desc">{item.description}</p>
            <div className="mobile-toggles">
              <span>Shot?</span>
              <StatusToggle
                id={item.id}
                field="shot"
                value={isShot(item.workflowStatus)}
              />
              <span>Posted?</span>
              <StatusToggle
                id={item.id}
                field="published"
                value={isPosted(item.publishingStatus)}
              />
            </div>
          </article>
        ))}
      </div>

      <ContentFormModal
        clients={clients}
        item={editItem}
        open={!!editItem}
        onClose={() => setEditItem(null)}
      />
    </>
  );
}

function PreviewPanel({
  item,
  onClose,
}: {
  item: ContentItem;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <div className="preview-backdrop" onClick={onClose} role="presentation">
      <div
        className="preview-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <header>
          <ClientChip name={item.client.name} />
          <button type="button" className="preview-close" onClick={onClose}>
            ✕
          </button>
        </header>
        <h2>{item.title}</h2>
        {item.description && (
          <section>
            <h4>Description</h4>
            <p dir="auto">{item.description}</p>
          </section>
        )}
        {item.script && (
          <section>
            <h4>Script</h4>
            <pre dir="auto">{item.script}</pre>
          </section>
        )}
        {item.references[0] && (
          <a href={item.references[0].url} target="_blank" rel="noreferrer">
            Open reference ↗
          </a>
        )}
      </div>
    </div>
  );
}

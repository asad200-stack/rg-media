import { Injectable } from '@nestjs/common';
import {
  ContentWorkflowStatus,
  PublishingStatus,
} from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && next === '\n') i++;
      row.push(cell);
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

function parseSheetDate(raw: string, defaultYear = 2025): Date | null {
  const s = raw.trim();
  if (!s || /no shooting|posting day/i.test(s)) return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  let year = m[3] ? parseInt(m[3], 10) : defaultYear;
  if (year < 100) year += 2000;
  return new Date(year, month - 1, day);
}

function yesNo(val: string) {
  return val.trim().toLowerCase() === 'yes';
}

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importCalendarCsv(csvText: string, defaultYear = 2025) {
    const rows = parseCsv(csvText.replace(/^\uFEFF/, ''));
    if (rows.length < 2) return { imported: 0, skipped: 0, errors: ['Empty CSV'] };

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const col = (name: string) => headers.findIndex((h) => h.includes(name));

    const filmingIdx = col('date of filming');
    const timeIdx = col('time');
    const shotIdx = col('shot');
    const postedIdx = col('posted');
    const clientIdx = col('client');
    const titleIdx = col('title');
    const descIdx = col('description');
    const refIdx = col('reference');
    const scriptIdx = col('script');
    const notesIdx = col('notes');

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    let codeCounter = await this.prisma.contentItem.count();

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const get = (i: number) => (i >= 0 && row[i] ? row[i].trim() : '');

      const title = get(titleIdx);
      const clientName = get(clientIdx).toUpperCase();
      const filmingRaw = get(filmingIdx);

      if (!title && !clientName) {
        skipped++;
        continue;
      }
      if (/posting day|no shooting/i.test(filmingRaw) && !title) {
        skipped++;
        continue;
      }
      if (!title || !clientName) {
        skipped++;
        continue;
      }

      let client = await this.prisma.client.findFirst({
        where: { name: { equals: clientName, mode: 'insensitive' } },
      });
      if (!client) {
        client = await this.prisma.client.create({
          data: { name: clientName, isActive: true },
        });
      }

      const shot = yesNo(get(shotIdx));
      const posted = yesNo(get(postedIdx));
      const filmingDate = parseSheetDate(filmingRaw, defaultYear);

      codeCounter++;
      const contentCode = `RG-${String(codeCounter).padStart(6, '0')}`;

      try {
        await this.prisma.contentItem.create({
          data: {
            contentCode,
            clientId: client.id,
            title,
            description: get(descIdx) || null,
            script: get(scriptIdx) || null,
            filmingDate,
            shootStartTime: get(timeIdx) || null,
            publishingDate: filmingDate,
            workflowStatus: posted
              ? ContentWorkflowStatus.PUBLISHED
              : shot
                ? ContentWorkflowStatus.SHOT
                : ContentWorkflowStatus.PLANNED,
            publishingStatus: posted
              ? PublishingStatus.PUBLISHED
              : PublishingStatus.PENDING,
            references: get(refIdx).startsWith('http')
              ? { create: [{ url: get(refIdx), label: 'Reference' }] }
              : undefined,
            notes: get(notesIdx)
              ? { create: [{ body: get(notesIdx) }] }
              : undefined,
          },
        });
        imported++;
      } catch (e) {
        errors.push(`Row ${r + 1}: ${e instanceof Error ? e.message : 'failed'}`);
      }
    }

    return { imported, skipped, errors };
  }
}

import { Injectable } from '@nestjs/common';
import {
  ContentWorkflowStatus,
  Prisma,
  PublishingStatus,
} from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';

const include = {
  client: { select: { id: true, name: true } },
  references: true,
  notes: { orderBy: { createdAt: 'desc' as const }, take: 1 },
  assignedTo: { select: { id: true, name: true } },
};

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tasksService: TasksService,
  ) {}

  private static readonly SHOT_STATUSES: ContentWorkflowStatus[] = [
    ContentWorkflowStatus.SHOT,
    ContentWorkflowStatus.EDITING,
    ContentWorkflowStatus.REVIEW,
    ContentWorkflowStatus.REVISION_REQUIRED,
    ContentWorkflowStatus.APPROVED,
    ContentWorkflowStatus.SCHEDULED_FOR_PUBLISHING,
    ContentWorkflowStatus.PUBLISHED,
    ContentWorkflowStatus.ARCHIVED,
  ];

  findMany(query: {
    clientId?: string;
    from?: string;
    to?: string;
    month?: string;
    year?: string;
    view?: 'shoot' | 'post';
    workflowStatus?: ContentWorkflowStatus;
    search?: string;
  }) {
    const where = this.buildWhere(query);

    const orderBy =
      query.view === 'post'
        ? [{ publishingDate: 'asc' as const }, { publishTime: 'asc' as const }]
        : [{ filmingDate: 'asc' as const }, { shootStartTime: 'asc' as const }];

    return this.prisma.contentItem.findMany({ where, orderBy, include });
  }

  findOne(id: string) {
    return this.prisma.contentItem.findUniqueOrThrow({ where: { id }, include });
  }

  async create(dto: CreateContentDto) {
    const code = await this.nextContentCode();
    const workflowStatus = dto.posted
      ? ContentWorkflowStatus.PUBLISHED
      : dto.shot
        ? ContentWorkflowStatus.SHOT
        : ContentWorkflowStatus.PLANNED;
    const publishingStatus = dto.posted
      ? PublishingStatus.PUBLISHED
      : PublishingStatus.PENDING;

    const item = await this.prisma.contentItem.create({
      data: {
        contentCode: code,
        clientId: dto.clientId,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        script: dto.script?.trim(),
        filmingDate: dto.filmingDate ? new Date(dto.filmingDate) : null,
        shootStartTime: dto.shootStartTime || null,
        publishingDate: dto.publishingDate ? new Date(dto.publishingDate) : null,
        publishTime: dto.publishTime || null,
        workflowStatus,
        publishingStatus,
        references: dto.referenceUrl
          ? { create: [{ url: dto.referenceUrl.trim(), label: 'Reference' }] }
          : undefined,
        notes: dto.note?.trim()
          ? { create: [{ body: dto.note.trim() }] }
          : undefined,
      },
      include,
    });
    await this.tasksService.generateForContent(item.id);
    return item;
  }

  async update(id: string, dto: UpdateContentDto) {
    const data: Prisma.ContentItemUpdateInput = {};

    if (dto.clientId) data.client = { connect: { id: dto.clientId } };
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description.trim();
    if (dto.script !== undefined) data.script = dto.script.trim();
    if (dto.filmingDate !== undefined) {
      data.filmingDate = dto.filmingDate ? new Date(dto.filmingDate) : null;
    }
    if (dto.shootStartTime !== undefined) data.shootStartTime = dto.shootStartTime || null;
    if (dto.publishingDate !== undefined) {
      data.publishingDate = dto.publishingDate ? new Date(dto.publishingDate) : null;
    }
    if (dto.publishTime !== undefined) data.publishTime = dto.publishTime || null;

    const item = await this.prisma.contentItem.update({
      where: { id },
      data,
      include,
    });

    if (dto.referenceUrl !== undefined) {
      await this.prisma.contentReference.deleteMany({ where: { contentItemId: id } });
      if (dto.referenceUrl.trim()) {
        await this.prisma.contentReference.create({
          data: { contentItemId: id, url: dto.referenceUrl.trim(), label: 'Reference' },
        });
      }
    }

    if (dto.note?.trim()) {
      await this.prisma.contentNote.create({
        data: { contentItemId: id, body: dto.note.trim() },
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    return this.prisma.contentItem.delete({ where: { id } });
  }

  async setShot(id: string, yes: boolean) {
    return this.prisma.contentItem.update({
      where: { id },
      data: {
        workflowStatus: yes
          ? ContentWorkflowStatus.SHOT
          : ContentWorkflowStatus.SCHEDULED_FOR_SHOOTING,
      },
      include,
    });
  }

  async setPosted(id: string, yes: boolean, publishedUrl?: string) {
    return this.prisma.contentItem.update({
      where: { id },
      data: yes
        ? {
            workflowStatus: ContentWorkflowStatus.PUBLISHED,
            publishingStatus: PublishingStatus.PUBLISHED,
            publishedUrl,
          }
        : {
            publishingStatus: PublishingStatus.PENDING,
            workflowStatus: ContentWorkflowStatus.APPROVED,
          },
      include,
    });
  }

  async setWorkflow(id: string, workflowStatus: ContentWorkflowStatus) {
    return this.prisma.contentItem.update({
      where: { id },
      data: { workflowStatus },
      include,
    });
  }

  portalContent() {
    return this.prisma.contentItem.findMany({
      where: { publishingStatus: PublishingStatus.PUBLISHED },
      include: { client: { select: { name: true } }, references: true },
      orderBy: { publishingDate: 'desc' },
    });
  }

  kanban() {
    return this.prisma.contentItem.findMany({
      select: {
        id: true,
        title: true,
        workflowStatus: true,
        priority: true,
        client: { select: { name: true } },
        filmingDate: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  private buildWhere(query: {
    clientId?: string;
    from?: string;
    to?: string;
    month?: string;
    year?: string;
    view?: 'shoot' | 'post';
    workflowStatus?: ContentWorkflowStatus;
    search?: string;
  }): Prisma.ContentItemWhereInput {
    const where: Prisma.ContentItemWhereInput = {};

    if (query.clientId) where.clientId = query.clientId;
    if (query.workflowStatus) where.workflowStatus = query.workflowStatus;

    const dateField = query.view === 'post' ? 'publishingDate' : 'filmingDate';

    if (query.month && query.year) {
      const m = parseInt(query.month, 10);
      const y = parseInt(query.year, 10);
      where[dateField] = {
        gte: new Date(y, m - 1, 1),
        lte: new Date(y, m, 0, 23, 59, 59),
      };
    } else if (query.from || query.to) {
      where[dateField] = {};
      if (query.from) where[dateField].gte = new Date(query.from);
      if (query.to) where[dateField].lte = new Date(query.to);
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { script: { contains: query.search, mode: 'insensitive' } },
        { client: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return where;
  }

  private async nextContentCode() {
    const last = await this.prisma.contentItem.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { contentCode: true },
    });
    const num = last?.contentCode?.match(/RG-(\d+)/)?.[1];
    const next = num ? parseInt(num, 10) + 1 : 1;
    return `RG-${String(next).padStart(6, '0')}`;
  }
}

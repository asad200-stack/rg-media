import { Injectable } from '@nestjs/common';
import { ContentWorkflowStatus, PublishingStatus } from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';

const SHOT_STATUSES: ContentWorkflowStatus[] = [
  ContentWorkflowStatus.SHOT,
  ContentWorkflowStatus.EDITING,
  ContentWorkflowStatus.REVIEW,
  ContentWorkflowStatus.REVISION_REQUIRED,
  ContentWorkflowStatus.APPROVED,
  ContentWorkflowStatus.SCHEDULED_FOR_PUBLISHING,
  ContentWorkflowStatus.PUBLISHED,
  ContentWorkflowStatus.ARCHIVED,
];

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [clients, planned, shot, published] = await Promise.all([
      this.prisma.client.count({ where: { isActive: true } }),
      this.prisma.contentItem.count({
        where: { workflowStatus: ContentWorkflowStatus.PLANNED },
      }),
      this.prisma.contentItem.count({
        where: { workflowStatus: { in: SHOT_STATUSES } },
      }),
      this.prisma.contentItem.count({
        where: { publishingStatus: PublishingStatus.PUBLISHED },
      }),
    ]);

    const byClient = await this.prisma.client.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        contentItems: {
          select: { workflowStatus: true, publishingStatus: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const clientStats = byClient.map((c) => ({
      clientId: c.id,
      clientName: c.name,
      shot: c.contentItems.filter((i) =>
        SHOT_STATUSES.includes(i.workflowStatus),
      ).length,
      published: c.contentItems.filter(
        (i) => i.publishingStatus === PublishingStatus.PUBLISHED,
      ).length,
      total: c.contentItems.length,
    }));

    return {
      clients,
      planned,
      shot,
      published,
      clientStats,
    };
  }
}

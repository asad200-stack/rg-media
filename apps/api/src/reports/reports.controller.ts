import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { PublishingStatus } from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators';

@Controller('reports')
@UseGuards(JwtAuthGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('content.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="content-report.csv"')
  async contentCsv() {
    const items = await this.prisma.contentItem.findMany({
      include: { client: { select: { name: true } } },
      orderBy: { filmingDate: 'asc' },
    });
    const header =
      'Code,Client,Title,Filming Date,Shot Status,Publish Status,Published URL\n';
    const rows = items
      .map((i) =>
        [
          i.contentCode,
          i.client.name,
          `"${i.title.replace(/"/g, '""')}"`,
          i.filmingDate?.toISOString().slice(0, 10) ?? '',
          i.workflowStatus,
          i.publishingStatus,
          i.publishedUrl ?? '',
        ].join(','),
      )
      .join('\n');
    return header + rows;
  }

  @Get('summary')
  async summary() {
    const [total, published, clients] = await Promise.all([
      this.prisma.contentItem.count(),
      this.prisma.contentItem.count({
        where: { publishingStatus: PublishingStatus.PUBLISHED },
      }),
      this.prisma.client.count({ where: { isActive: true } }),
    ]);
    return { total, published, clients, completionRate: total ? published / total : 0 };
  }
}

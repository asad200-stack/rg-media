import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApprovalStatus } from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators';

@Controller('portal')
@UseGuards(JwtAuthGuard)
@Roles('CLIENT_PORTAL', 'SUPER_ADMIN', 'ADMIN')
export class PortalController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('content')
  approvedContent() {
    return this.prisma.contentItem.findMany({
      where: {
        approvalStatus: { in: [ApprovalStatus.CLIENT_REVIEW, ApprovalStatus.APPROVED] },
      },
      include: {
        client: { select: { name: true } },
        references: true,
      },
      orderBy: { publishingDate: 'desc' },
    });
  }
}

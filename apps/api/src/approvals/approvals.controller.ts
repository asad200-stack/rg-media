import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApprovalStatus } from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators';

@Controller('approvals')
@UseGuards(JwtAuthGuard)
export class ApprovalsController {
  constructor(private readonly prisma: PrismaService) {}

  @Patch('content/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'CLIENT_PORTAL')
  async setStatus(
    @Param('id') id: string,
    @Body() body: { status: ApprovalStatus; feedback?: string },
  ) {
    await this.prisma.approvalRecord.create({
      data: {
        contentItemId: id,
        status: body.status,
        feedback: body.feedback,
      },
    });
    return this.prisma.contentItem.update({
      where: { id },
      data: { approvalStatus: body.status },
      include: { client: true },
    });
  }

  @Get('content/:id/history')
  history(@Param('id') id: string) {
    return this.prisma.approvalRecord.findMany({
      where: { contentItemId: id },
      orderBy: { createdAt: 'desc' },
    });
  }
}

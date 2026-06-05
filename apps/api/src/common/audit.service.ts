import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: unknown;
    newValue?: unknown;
    deviceInfo?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValue: params.oldValue as object | undefined,
        newValue: params.newValue as object | undefined,
        deviceInfo: params.deviceInfo,
      },
    });
  }

  findAll(limit = 100) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }
}

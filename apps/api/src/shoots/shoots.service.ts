import { Injectable } from '@nestjs/common';
import { ShootingStatus } from '@rg-media/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShootsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(from?: string, to?: string) {
    return this.prisma.shootingSession.findMany({
      where:
        from || to
          ? {
              date: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : undefined,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        client: { select: { id: true, name: true } },
        contentItem: { select: { id: true, title: true } },
      },
    });
  }

  create(data: {
    clientId: string;
    contentItemId?: string;
    date: string;
    startTime?: string;
    location?: string;
    status?: ShootingStatus;
    equipmentNotes?: string;
  }) {
    return this.prisma.shootingSession.create({
      data: {
        clientId: data.clientId,
        contentItemId: data.contentItemId,
        date: new Date(data.date),
        startTime: data.startTime,
        location: data.location,
        status: data.status ?? ShootingStatus.SCHEDULED,
        equipmentNotes: data.equipmentNotes,
      },
      include: { client: true, contentItem: true },
    });
  }

  updateStatus(id: string, status: ShootingStatus) {
    return this.prisma.shootingSession.update({
      where: { id },
      data: { status },
    });
  }
}

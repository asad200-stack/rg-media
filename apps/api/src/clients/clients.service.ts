import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { contentItems: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.client.findUniqueOrThrow({
      where: { id },
      include: {
        contentItems: {
          take: 20,
          orderBy: { filmingDate: 'desc' },
        },
      },
    });
  }
}

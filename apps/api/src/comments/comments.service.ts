import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  forContent(contentItemId: string) {
    return this.prisma.comment.findMany({
      where: { contentItemId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  create(contentItemId: string, authorId: string, body: string) {
    return this.prisma.comment.create({
      data: { contentItemId, authorId, body },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  resolve(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { isResolved: true },
    });
  }
}

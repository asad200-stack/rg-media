import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_TASKS = [
  'Script Writing',
  'Filming',
  'Editing',
  'Review',
  'Publishing',
];

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: { assigneeId?: string; completed?: boolean }) {
    return this.prisma.task.findMany({
      where: {
        ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
        ...(query.completed !== undefined ? { isCompleted: query.completed } : {}),
      },
      orderBy: [{ isCompleted: 'asc' }, { dueAt: 'asc' }],
      include: {
        contentItem: {
          select: { id: true, title: true, client: { select: { name: true } } },
        },
      },
    });
  }

  async generateForContent(contentItemId: string) {
    await this.prisma.task.createMany({
      data: DEFAULT_TASKS.map((title) => ({ contentItemId, title })),
    });
  }

  toggleComplete(id: string, isCompleted: boolean) {
    return this.prisma.task.update({ where: { id }, data: { isCompleted } });
  }

  assign(id: string, assigneeId: string) {
    return this.prisma.task.update({ where: { id }, data: { assigneeId } });
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
  }
}

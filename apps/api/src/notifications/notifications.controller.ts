import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findMine(@Req() req: { user: { sub: string } }, @Query('unread') unread?: string) {
    return this.notificationsService.forUser(req.user.sub, unread === 'true');
  }

  @Patch('read-all')
  markAllRead(@Req() req: { user: { sub: string } }) {
    return this.notificationsService.markAllRead(req.user.sub);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.notificationsService.markRead(id, req.user.sub);
  }
}

import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ShootingStatus } from '@rg-media/database';
import { ShootsService } from './shoots.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shoots')
@UseGuards(JwtAuthGuard)
export class ShootsController {
  constructor(private readonly shootsService: ShootsService) {}

  @Get()
  findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return this.shootsService.findAll(from, to);
  }

  @Post()
  create(@Body() body: {
    clientId: string;
    contentItemId?: string;
    date: string;
    startTime?: string;
    location?: string;
    equipmentNotes?: string;
  }) {
    return this.shootsService.create(body);
  }

  @Patch(':id/status')
  setStatus(@Param('id') id: string, @Body() body: { status: ShootingStatus }) {
    return this.shootsService.updateStatus(id, body.status);
  }
}

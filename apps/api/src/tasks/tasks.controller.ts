import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('assigneeId') assigneeId?: string,
    @Query('completed') completed?: string,
  ) {
    return this.tasksService.findAll({
      assigneeId,
      completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
    });
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() body: { isCompleted: boolean }) {
    return this.tasksService.toggleComplete(id, body.isCompleted ?? true);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() body: { assigneeId: string }) {
    return this.tasksService.assign(id, body.assigneeId);
  }
}

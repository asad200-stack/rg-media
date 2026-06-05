import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContentWorkflowStatus } from '@rg-media/database';
import { CreateContentDto, ToggleDto, UpdateContentDto } from './content.dto';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll(
    @Query('clientId') clientId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('view') view?: 'shoot' | 'post',
    @Query('workflowStatus') workflowStatus?: ContentWorkflowStatus,
    @Query('search') search?: string,
  ) {
    return this.contentService.findMany({
      clientId,
      from,
      to,
      month,
      year,
      view,
      workflowStatus,
      search,
    });
  }

  @Get('kanban')
  kanban() {
    return this.contentService.kanban();
  }

  @Patch(':id/workflow')
  setWorkflow(
    @Param('id') id: string,
    @Body() body: { workflowStatus: ContentWorkflowStatus },
  ) {
    return this.contentService.setWorkflow(id, body.workflowStatus);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Patch(':id/shot')
  setShot(@Param('id') id: string, @Body() body: ToggleDto) {
    return this.contentService.setShot(id, body.yes ?? true);
  }

  @Patch(':id/published')
  setPosted(@Param('id') id: string, @Body() body: ToggleDto) {
    return this.contentService.setPosted(id, body.yes ?? true);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}

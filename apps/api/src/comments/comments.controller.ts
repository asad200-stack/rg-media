import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('content/:contentId')
  forContent(@Param('contentId') contentId: string) {
    return this.commentsService.forContent(contentId);
  }

  @Post('content/:contentId')
  create(
    @Param('contentId') contentId: string,
    @Req() req: { user: { sub: string } },
    @Body() body: { body: string },
  ) {
    return this.commentsService.create(contentId, req.user.sub, body.body);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.commentsService.resolve(id);
  }
}

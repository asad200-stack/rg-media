import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('content/:contentId')
  list(@Param('contentId') contentId: string) {
    return this.filesService.forContent(contentId);
  }

  @Post('content/:contentId')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('contentId') contentId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.save(contentId, file);
  }

  @Get(':key/download')
  download(@Param('key') key: string, @Res() res: Response) {
    const filePath = this.filesService.getPath(key);
    if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
    return res.download(filePath);
  }
}

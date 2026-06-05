import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators';
import { ImportService } from './import.service';

@Controller('admin/import')
@Roles('SUPER_ADMIN', 'ADMIN')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('calendar')
  @UseInterceptors(FileInterceptor('file'))
  async importCalendar(
    @UploadedFile() file: Express.Multer.File,
    @Query('year') year?: string,
  ) {
    if (!file?.buffer) {
      return { imported: 0, skipped: 0, errors: ['No file uploaded'] };
    }
    const text = file.buffer.toString('utf-8');
    return this.importService.importCalendarCsv(
      text,
      year ? parseInt(year, 10) : 2025,
    );
  }
}

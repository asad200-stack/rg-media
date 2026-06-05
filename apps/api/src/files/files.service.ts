import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async save(contentItemId: string, file: Express.Multer.File) {
    const key = `${contentItemId}-${Date.now()}-${file.originalname}`;
    const dest = path.join(this.uploadDir, key);
    fs.writeFileSync(dest, file.buffer);
    return this.prisma.fileAttachment.create({
      data: {
        contentItemId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        storageKey: key,
      },
    });
  }

  getPath(key: string) {
    return path.join(this.uploadDir, key);
  }

  forContent(contentItemId: string) {
    return this.prisma.fileAttachment.findMany({
      where: { contentItemId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

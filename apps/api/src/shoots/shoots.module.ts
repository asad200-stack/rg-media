import { Module } from '@nestjs/common';
import { ShootsController } from './shoots.controller';
import { ShootsService } from './shoots.service';

@Module({
  controllers: [ShootsController],
  providers: [ShootsService],
  exports: [ShootsService],
})
export class ShootsModule {}

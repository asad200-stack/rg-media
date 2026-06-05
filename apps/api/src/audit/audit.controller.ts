import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from '../common/audit.service';
import { Roles } from '../common/decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll() {
    return this.auditService.findAll();
  }
}

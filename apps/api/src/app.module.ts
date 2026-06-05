import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ContentModule } from './content/content.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ImportModule } from './import/import.module';
import { TasksModule } from './tasks/tasks.module';
import { ShootsModule } from './shoots/shoots.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { PortalModule } from './portal/portal.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule,
    ContentModule,
    DashboardModule,
    ImportModule,
    TasksModule,
    ShootsModule,
    CommentsModule,
    FilesModule,
    NotificationsModule,
    AuditModule,
    ReportsModule,
    ApprovalsModule,
    PortalModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

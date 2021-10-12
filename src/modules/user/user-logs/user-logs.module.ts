import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAppInstallLogsRepository } from './user-logs.repository';
import { UserLogsService } from './user-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAppInstallLogsRepository])],
  providers: [UserLogsService],
})
export class UserLogsModule {}

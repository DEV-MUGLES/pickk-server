import { Module } from '@nestjs/common';

import { FollowsModule } from './follows/follows.module';
import { UserLogsModule } from './user-logs/user-logs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FollowsModule, UserLogsModule, UsersModule],
})
export class UserModule {}

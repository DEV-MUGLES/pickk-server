import { Module } from '@nestjs/common';

import { FollowsModule } from './follows/follows.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FollowsModule, UsersModule],
})
export class UserModule {}

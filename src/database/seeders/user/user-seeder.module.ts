import { Module } from '@nestjs/common';

import { PointsModule } from '@order/points/points.module';
import { UsersModule } from '@user/users/users.module';
import { UsersSeeder } from './users.seeder';

@Module({
  imports: [UsersModule, PointsModule],
  providers: [UsersSeeder],
  exports: [UsersSeeder],
})
export class UsersSeederModule {}

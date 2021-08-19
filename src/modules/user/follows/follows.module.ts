import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowsRepository } from './follows.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FollowsRepository])],
})
export class FollowsModule {}

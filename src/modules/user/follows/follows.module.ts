import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowsRepository } from './follows.repository';
import { FollowsResolver } from './follows.resolver';
import { FollowsService } from './follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowsRepository])],
  providers: [FollowsResolver, FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}

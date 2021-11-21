import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

import { UPDATE_USER_FOLLOW_COUNT_QUEUE } from '@queue/constants';

import { FollowProducer } from './producers';

import { FollowsRepository } from './follows.repository';
import { FollowsResolver } from './follows.resolver';
import { FollowsService } from './follows.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowsRepository]),
    SqsModule.registerQueue({
      name: UPDATE_USER_FOLLOW_COUNT_QUEUE,
      type: SqsQueueType.Producer,
    }),
  ],
  providers: [FollowsResolver, FollowsService, FollowProducer],
  exports: [FollowsService],
})
export class FollowsModule {}

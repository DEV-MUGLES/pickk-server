import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { UPDATE_DIGEST_LIKE_COUNT_QUEUE } from '@queue/constants';

import { LikesModule } from '@content/likes/likes.module';
import { FollowsModule } from '@user/follows/follows.module';

import { UpdateDigestLikeCountConsumer } from './consumers';

import { DigestsRepository } from './digests.repository';
import { DigestsResolver } from './digests.resolver';
import { DigestsService } from './digests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DigestsRepository]),
    SqsModule.registerQueue({
      name: UPDATE_DIGEST_LIKE_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
    LikesModule,
    FollowsModule,
  ],
  providers: [DigestsResolver, DigestsService, UpdateDigestLikeCountConsumer],
})
export class DigestsModule {}

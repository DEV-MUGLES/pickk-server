import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { LikesModule } from '@content/likes/likes.module';
import { UPDATE_DIGEST_LIKE_COUNT_QUEUE } from '@queue/constants';

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
  ],
  providers: [DigestsResolver, DigestsService, UpdateDigestLikeCountConsumer],
})
export class DigestsModule {}

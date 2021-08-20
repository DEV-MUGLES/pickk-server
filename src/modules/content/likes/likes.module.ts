import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  UPDATE_COMMENT_LIKE_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
} from '@queue/constants';

import { LikeProducer } from './producers';

import { LikesRepository } from './likes.repository';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikesRepository]),
    SqsModule.registerQueue(
      {
        name: UPDATE_COMMENT_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_DIGEST_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_LOOK_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_VIDEO_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      }
    ),
  ],
  providers: [LikesResolver, LikesService, LikeProducer],
  exports: [LikeProducer, LikesService],
})
export class LikesModule {}

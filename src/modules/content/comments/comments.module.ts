import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { LikesModule } from '@content/likes/likes.module';
import {
  UPDATE_COMMENT_LIKE_COUNT_QUEUE,
  UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
  UPDATE_LOOK_COMMENT_COUNT_QUEUE,
  UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
} from '@queue/constants';

import { UpdateCommentLikeCountConsumer } from './consumers';
import { CommentsProducer } from './producers';

import { CommentsRepository } from './comments.repository';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsRepository]),
    SqsModule.registerQueue(
      {
        name: UPDATE_COMMENT_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_LOOK_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      }
    ),
    LikesModule,
  ],
  providers: [
    CommentsResolver,
    CommentsService,
    UpdateCommentLikeCountConsumer,
    CommentsProducer,
  ],
})
export class CommentsModule {}

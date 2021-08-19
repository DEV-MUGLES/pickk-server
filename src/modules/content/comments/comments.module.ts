import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { UPDATE_COMMENT_LIKE_COUNT_QUEUE } from '@src/queue/constants';

import { UpdateCommentLikeCountConsumer } from './consumers';

import { CommentsRepository } from './comments.repository';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsRepository]),
    SqsModule.registerQueue({
      name: UPDATE_COMMENT_LIKE_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
  ],
  providers: [
    CommentsResolver,
    CommentsService,
    UpdateCommentLikeCountConsumer,
  ],
})
export class CommentsModule {}

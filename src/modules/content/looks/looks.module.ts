import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { LikesModule } from '@content/likes/likes.module';
import { CommentsRepository } from '@content/comments/comments.repository';
import {
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_COMMENT_COUNT_QUEUE,
} from '@queue/constants';

import {
  UpdateLookCommentCountConsumer,
  UpdateLookLikeCountConsumer,
} from './consumers';

import { LooksRepository } from './looks.repository';
import { LooksResolver } from './looks.resolver';
import { LooksService } from './looks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LooksRepository, CommentsRepository]),
    SqsModule.registerQueue(
      {
        name: UPDATE_LOOK_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: UPDATE_LOOK_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      }
    ),
    LikesModule,
  ],
  providers: [
    LooksResolver,
    LooksService,
    UpdateLookLikeCountConsumer,
    UpdateLookCommentCountConsumer,
  ],
})
export class LooksModule {}

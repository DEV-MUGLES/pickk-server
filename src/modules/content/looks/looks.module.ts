import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_COMMENT_COUNT_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { LikesModule } from '@content/likes/likes.module';
import { CommentsModule } from '@content/comments/comments.module';
import { CommentsRepository } from '@content/comments/comments.repository';
import { StyleTagsModule } from '@content/style-tags/style-tags.module';
import { FollowsModule } from '@user/follows/follows.module';

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
    FollowsModule,
    forwardRef(() => SearchModule),
    CommentsModule,
    StyleTagsModule,
  ],
  providers: [
    Logger,
    LooksResolver,
    LooksService,
    UpdateLookLikeCountConsumer,
    UpdateLookCommentCountConsumer,
  ],
  exports: [LooksService],
})
export class LooksModule {}

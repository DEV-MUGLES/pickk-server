import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { CommentsModule } from '@content/comments/comments.module';
import { FollowsModule } from '@user/follows/follows.module';
import { LikesModule } from '@content/likes/likes.module';

import {
  UpdateDigestCommentCountConsumer,
  UpdateDigestLikeCountConsumer,
} from './consumers';

import { DigestsRepository } from './digests.repository';
import { DigestsResolver } from './digests.resolver';
import { DigestsService } from './digests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DigestsRepository]),
    SqsModule.registerQueue(
      {
        name: UPDATE_DIGEST_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      }
    ),
    LikesModule,
    FollowsModule,
    forwardRef(() => SearchModule),
    CommentsModule,
  ],
  providers: [
    DigestsResolver,
    DigestsService,
    UpdateDigestLikeCountConsumer,
    UpdateDigestCommentCountConsumer,
  ],
  exports: [DigestsService],
})
export class DigestsModule {}

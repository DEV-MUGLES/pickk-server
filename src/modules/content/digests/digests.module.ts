import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { CommentsRepository } from '@content/comments/comments.repository';
import { FollowsModule } from '@user/follows/follows.module';
import { LikesModule } from '@content/likes/likes.module';
import { SearchModule } from '@providers/elasticsearch';
import {
  UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
} from '@queue/constants';

import {
  UpdateDigestCommentCountConsumer,
  UpdateDigestLikeCountConsumer,
} from './consumers';

import { DigestsRepository } from './digests.repository';
import { DigestsResolver } from './digests.resolver';
import { DigestsSearchService } from './digests.search.service';
import { DigestsService } from './digests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DigestsRepository, CommentsRepository]),
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
    SearchModule,
  ],
  providers: [
    DigestsResolver,
    DigestsService,
    UpdateDigestLikeCountConsumer,
    UpdateDigestCommentCountConsumer,
    DigestsSearchService,
  ],
})
export class DigestsModule {}

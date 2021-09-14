import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { LikesModule } from '@content/likes/likes.module';
import { CommentsModule } from '@content/comments/comments.module';
import { DigestsModule } from '@content/digests/digests.module';
import { ItemPropertiesModule } from '@item/item-properties/item-properties.module';
import { FollowsModule } from '@user/follows/follows.module';

import {
  UpdateVideoLikeCountConsumer,
  UpdateVideoCommentCountConsumer,
} from './consumers';

import { VideosRepository } from './videos.repository';
import { VideosResolver } from './videos.resolver';
import { VideosService } from './videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideosRepository]),
    SqsModule.registerQueue(
      {
        name: UPDATE_VIDEO_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      },
      {
        name: UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: { batchSize: 10 },
      }
    ),
    LikesModule,
    FollowsModule,
    forwardRef(() => SearchModule),
    CommentsModule,
    ItemPropertiesModule,
    DigestsModule,
  ],
  providers: [
    VideosResolver,
    VideosService,
    UpdateVideoLikeCountConsumer,
    UpdateVideoCommentCountConsumer,
  ],
  exports: [VideosService],
})
export class VideosModule {}

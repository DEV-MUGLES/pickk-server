import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

import {
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_COMMENT_COUNT_QUEUE,
  SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE,
  UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { LikesModule } from '@content/likes/likes.module';
import { CommentsModule } from '@content/comments/comments.module';
import { DigestsModule } from '@content/digests/digests.module';
import { ItemPropertiesModule } from '@item/item-properties/item-properties.module';
import { YoutubeProviderModule } from '@providers/youtube/provider.module';
import { FollowsModule } from '@user/follows/follows.module';

import { VideosConsumers } from './consumers';
import { VideosProducer } from './producers';

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
      },
      {
        name: SEND_VIDEO_CREATION_SLACK_MESSAGE_QUEUE,
      },
      {
        name: UPDATE_YOUTUBE_VIDEO_DATAS_QUEUE,
      }
    ),
    forwardRef(() => LikesModule),
    forwardRef(() => FollowsModule),
    forwardRef(() => SearchModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => DigestsModule),
    forwardRef(() => ItemPropertiesModule),
    YoutubeProviderModule,
  ],
  providers: [
    Logger,
    VideosResolver,
    VideosService,
    VideosProducer,
    ...VideosConsumers,
  ],
  exports: [VideosService, VideosProducer],
})
export class VideosModule {}

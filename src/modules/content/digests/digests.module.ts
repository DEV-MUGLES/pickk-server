import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  REMOVE_DIGEST_IMAGES_QUEUE,
  UPDATE_DIGEST_COMMENT_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
  UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { ImagesModule } from '@mcommon/images/images.module';
import { CommentsModule } from '@content/comments/comments.module';
import { FollowsModule } from '@user/follows/follows.module';
import { LikesModule } from '@content/likes/likes.module';
import { ItemPropertiesModule } from '@item/item-properties/item-properties.module';

import {
  RemoveDigestImagesConsumer,
  UpdateDigestCommentCountConsumer,
  UpdateDigestLikeCountConsumer,
} from './consumers';
import { DigestsProducer } from './producers';

import {
  DigestImagesRepository,
  DigestsRepository,
} from './digests.repository';
import { DigestsResolver } from './digests.resolver';
import { DigestsService } from './digests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DigestsRepository, DigestImagesRepository]),
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
      },
      {
        name: UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
        type: SqsQueueType.Producer,
        producerOptions: { batchSize: 10 },
      },
      {
        name: REMOVE_DIGEST_IMAGES_QUEUE,
      }
    ),
    LikesModule,
    FollowsModule,
    forwardRef(() => SearchModule),
    CommentsModule,
    ItemPropertiesModule,
    ImagesModule,
  ],
  providers: [
    Logger,
    DigestsResolver,
    DigestsService,
    UpdateDigestLikeCountConsumer,
    UpdateDigestCommentCountConsumer,
    DigestsProducer,
    RemoveDigestImagesConsumer,
  ],
  exports: [DigestsService, DigestsProducer],
})
export class DigestsModule {}

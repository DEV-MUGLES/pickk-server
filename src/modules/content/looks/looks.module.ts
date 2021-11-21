import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

import {
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_COMMENT_COUNT_QUEUE,
  SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE,
  REMOVE_LOOK_IMAGES_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { ImagesModule } from '@mcommon/images/images.module';
import { CommentsModule } from '@content/comments/comments.module';
import { CommentsRepository } from '@content/comments/comments.repository';
import { DigestsModule } from '@content/digests/digests.module';
import { LikesModule } from '@content/likes/likes.module';
import { StyleTagsModule } from '@content/style-tags/style-tags.module';
import { ItemsGroupsModule } from '@exhibition/items-groups/items-groups.module';
import { FollowsModule } from '@user/follows/follows.module';

import { LooksConsumers } from './consumers';
import { LooksProducer } from './producers';

import { LookImagesRepository, LooksRepository } from './looks.repository';
import { LooksResolver } from './looks.resolver';
import { LooksService } from './looks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LooksRepository,
      CommentsRepository,
      LookImagesRepository,
    ]),
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
      },
      {
        name: SEND_LOOK_CREATION_SLACK_MESSAGE_QUEUE,
      },
      {
        name: REMOVE_LOOK_IMAGES_QUEUE,
      }
    ),
    forwardRef(() => LikesModule),
    forwardRef(() => FollowsModule),
    forwardRef(() => SearchModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => StyleTagsModule),
    forwardRef(() => DigestsModule),
    forwardRef(() => ImagesModule),
    forwardRef(() => ItemsGroupsModule),
  ],
  providers: [
    Logger,
    LooksResolver,
    LooksService,
    LooksProducer,
    ...LooksConsumers,
  ],
  exports: [LooksService],
})
export class LooksModule {}

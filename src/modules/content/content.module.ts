import { Module } from '@nestjs/common';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  UPDATE_COMMENT_LIKE_COUNT_QUEUE,
  UPDATE_DIGEST_LIKE_COUNT_QUEUE,
  UPDATE_LOOK_LIKE_COUNT_QUEUE,
  UPDATE_VIDEO_LIKE_COUNT_QUEUE,
} from '@src/queue/constants';

import { CommentsModule } from './comments/comments.module';
import { DigestsModule } from './digests/digests.module';
import { LikesModule } from './likes/likes.module';
import { LooksModule } from './looks/looks.module';
import { ContentProducer } from './producers';
import { StyleTagsModule } from './style-tags/style-tags.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    CommentsModule,
    DigestsModule,
    LikesModule,
    LooksModule,
    StyleTagsModule,
    VideosModule,
    SqsModule.registerQueue(
      {
        name: UPDATE_COMMENT_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_DIGEST_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_LOOK_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      },
      {
        name: UPDATE_VIDEO_LIKE_COUNT_QUEUE,
        type: SqsQueueType.Producer,
      }
    ),
  ],
  providers: [ContentProducer],
})
export class ContentModule {}

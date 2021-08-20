import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { LikesModule } from '@content/likes/likes.module';
import { UPDATE_VIDEO_LIKE_COUNT_QUEUE } from '@queue/constants';

import { UpdateVideoLikeCountConsumer } from './consumers';

import { VideosRepository } from './videos.repository';
import { VideosResolver } from './videos.resolver';
import { VideosService } from './videos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideosRepository]),
    SqsModule.registerQueue({
      name: UPDATE_VIDEO_LIKE_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
    LikesModule,
  ],
  providers: [VideosResolver, VideosService, UpdateVideoLikeCountConsumer],
})
export class VideosModule {}

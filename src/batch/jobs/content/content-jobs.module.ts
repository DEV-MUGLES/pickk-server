import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';

import { CommentsRepository } from '@content/comments/comments.repository';
import { DigestsRepository } from '@content/digests/digests.repository';
import { LikesRepository } from '@content/likes/likes.repository';
import { LooksRepository } from '@content/looks/looks.repository';
import { VideosRepository } from '@content/videos/videos.repository';
import { VideosModule } from '@content/videos/videos.module';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import {
  UpdateContentScoreJob,
  UpdateDigestScoreStep,
  UpdateLookScoreStep,
  UpdateVideoScoreStep,
} from './update-content-score';
import {
  UpdateYoutubeVideoDataJob,
  UpdateYoutubeVideoDataStep,
} from './update-youtube-video-data';

import { ContentJobsService } from './content-jobs.service';
import { ContentJobsController } from './content-jobs.controller';

@Module({
  imports: [
    JobsModule,
    TypeOrmModule.forFeature([
      DigestsRepository,
      LooksRepository,
      VideosRepository,
      LikesRepository,
      OrderItemsRepository,
      CommentsRepository,
    ]),
    VideosModule,
  ],
  controllers: [ContentJobsController],
  providers: [
    BatchWorker,
    ContentJobsService,
    UpdateContentScoreJob,
    UpdateDigestScoreStep,
    UpdateLookScoreStep,
    UpdateVideoScoreStep,
    UpdateYoutubeVideoDataJob,
    UpdateYoutubeVideoDataStep,
  ],
})
export class ContentJobsModule {}

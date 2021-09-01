import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';

import { CommentsRepository } from '@content/comments/comments.repository';
import { DigestsRepository } from '@content/digests/digests.repository';
import { LikesRepository } from '@content/likes/likes.repository';
import { LooksRepository } from '@content/looks/looks.repository';
import { VideosRepository } from '@content/videos/videos.repository';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import {
  UpdateDigestScoreJob,
  UpdateDigestScoreStep,
} from './update-digest-score';
import { UpdateLookScoreJob, UpdateLookScoreStep } from './update-look-score';
import {
  UpdateVideoScoreJob,
  UpdateVideoScoreStep,
} from './update-video-score';

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
  ],
  controllers: [ContentJobsController],
  providers: [
    BatchWorker,
    ContentJobsService,
    UpdateDigestScoreJob,
    UpdateDigestScoreStep,
    UpdateLookScoreJob,
    UpdateLookScoreStep,
    UpdateVideoScoreJob,
    UpdateVideoScoreStep,
  ],
})
export class ContentJobsModule {}

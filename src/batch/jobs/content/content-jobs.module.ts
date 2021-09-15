import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';

import { CommentsRepository } from '@content/comments/comments.repository';
import {
  DigestImagesRepository,
  DigestsRepository,
} from '@content/digests/digests.repository';
import { LikesRepository } from '@content/likes/likes.repository';
import { LooksRepository } from '@content/looks/looks.repository';
import { VideosRepository } from '@content/videos/videos.repository';
import { ImagesModule } from '@mcommon/images/images.module';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import {
  UpdateContentScoreJob,
  UpdateDigestScoreStep,
  UpdateLookScoreStep,
  UpdateVideoScoreStep,
} from './update-content-score';

import { ContentJobsService } from './content-jobs.service';
import { ContentJobsController } from './content-jobs.controller';
import {
  RemoveDeletedDigestImagesJob,
  RemoveDeletedDigestImagesStep,
} from './remove-deleted-digest-images';

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
      DigestImagesRepository,
    ]),
    ImagesModule,
  ],
  controllers: [ContentJobsController],
  providers: [
    BatchWorker,
    ContentJobsService,
    UpdateContentScoreJob,
    UpdateDigestScoreStep,
    UpdateLookScoreStep,
    UpdateVideoScoreStep,
    RemoveDeletedDigestImagesJob,
    RemoveDeletedDigestImagesStep,
  ],
})
export class ContentJobsModule {}

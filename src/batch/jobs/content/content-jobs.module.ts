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
  UpdateContentScoreJob,
  UpdateDigestScoreStep,
  UpdateLookScoreStep,
  UpdateVideoScoreStep,
} from './update-content-score';
import { CommentReactionScoreCalculator } from './update-content-score/reaction-score-calculator/comment.reaction-score-calculator';
import { LikeReactionScoreCalculator } from './update-content-score/reaction-score-calculator/like.reaction-score-calculator';
import { OrderReactionScoreCalculator } from './update-content-score/reaction-score-calculator/order.reaction-score-calculator';

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
    CommentReactionScoreCalculator,
    LikeReactionScoreCalculator,
    OrderReactionScoreCalculator,
    UpdateContentScoreJob,
    UpdateDigestScoreStep,
    UpdateLookScoreStep,
    UpdateVideoScoreStep,
  ],
})
export class ContentJobsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { DigestsRepository } from '@content/digests/digests.repository';
import { LooksRepository } from '@content/looks/looks.repository';
import { VideosRepository } from '@content/videos/videos.repository';
import { ItemsRepository } from '@item/items/items.repository';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { HitsModule } from '@mcommon/hits/hits.module';

import {
  UpdateDigestHitCountStep,
  UpdateHitCountJob,
  UpdateItemHitCountStep,
  UpdateLookHitCountStep,
  UpdateVideoHitCountStep,
} from './update-hit-count';

import { HitJobsService } from './hit-jobs.service';
import { HitJobsController } from './hit-jobs.controller';

@Module({
  imports: [
    JobsModule,
    TypeOrmModule.forFeature([
      DigestsRepository,
      ItemsRepository,
      LooksRepository,
      VideosRepository,
    ]),
    HitsModule,
  ],
  controllers: [HitJobsController],
  providers: [
    BatchWorker,
    HitJobsService,
    UpdateHitCountJob,
    UpdateDigestHitCountStep,
    UpdateItemHitCountStep,
    UpdateLookHitCountStep,
    UpdateVideoHitCountStep,
  ],
})
export class HitJobsModule {}

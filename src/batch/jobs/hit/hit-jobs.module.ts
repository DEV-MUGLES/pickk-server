import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { DigestsRepository } from '@content/digests/digests.repository';
import { LooksRepository } from '@content/looks/looks.repository';
import { VideosRepository } from '@content/videos/videos.repository';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { HitsModule } from '@mcommon/hits/hits.module';

import {
  UpdateDigestHitCountStep,
  UpdateHitCountJob,
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
    UpdateLookHitCountStep,
    UpdateVideoHitCountStep,
  ],
})
export class HitJobsModule {}

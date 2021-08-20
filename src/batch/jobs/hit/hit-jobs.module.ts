import { Module } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';

import { HitJobsService } from './hit-jobs.service';
import { HitJobsController } from './hit-jobs.controller';

@Module({
  imports: [JobsModule],
  providers: [BatchWorker, HitJobsService],
  controllers: [HitJobsController],
})
export class HitJobsModule {}

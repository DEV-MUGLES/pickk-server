import { Module } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { JobsModule } from '@mcommon/jobs/jobs.module';
import { SearchModule } from '@mcommon/search/search.module';
import { ItemsModule } from '@item/items/items.module';
import { LooksModule } from '@content/looks/looks.module';
import { VideosModule } from '@content/videos/videos.module';
import { DigestsModule } from '@content/digests/digests.module';

import { IndexItemsJob, IndexItemsStep } from './index-items';
import { IndexDigestsJob, IndexDigestsStep } from './index-digests';
import { IndexLooksJob, IndexLooksStep } from './index-looks';
import { IndexVideosJob, IndexVideosStep } from './index-videos';

import { CommonJobsController } from './common-jobs.controller';
import { CommonJobsService } from './common-jobs.service';

@Module({
  imports: [
    JobsModule,
    SearchModule,
    ItemsModule,
    DigestsModule,
    LooksModule,
    VideosModule,
  ],
  controllers: [CommonJobsController],
  providers: [
    BatchWorker,
    CommonJobsService,
    IndexItemsJob,
    IndexItemsStep,
    IndexDigestsJob,
    IndexDigestsStep,
    IndexLooksJob,
    IndexLooksStep,
    IndexVideosJob,
    IndexVideosStep,
  ],
})
export class CommonJobsModule {}

import { Module } from '@nestjs/common';

import { BatchWorker } from '@src/batch/batch.worker';
import { JobsModule } from '@src/modules/common/jobs/jobs.module';
import { SellersModule } from '@item/sellers/sellers.module';

import {
  UpdateSellerItemsJob,
  ProduceScrapSellerItemsMessageStep,
} from './update-seller-items';

import { ItemJobsController } from './item-jobs.controller';
import { ItemJobsService } from './item-jobs.service';

@Module({
  imports: [JobsModule, SellersModule],
  controllers: [ItemJobsController],
  providers: [
    BatchWorker,
    ItemJobsService,
    UpdateSellerItemsJob,
    ProduceScrapSellerItemsMessageStep,
  ],
})
export class ItemJobsModule {}

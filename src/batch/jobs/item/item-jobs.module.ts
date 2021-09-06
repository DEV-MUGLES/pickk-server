import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';

import { DigestsRepository } from '@content/digests/digests.repository';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { ProductsRepository } from '@item/products/products.repository';
import { SellersRepository } from '@item/sellers/sellers.repository';
import { ItemsRepository } from '@item/items/items.repository';

import {
  UpdateSellerItemsJob,
  ProduceScrapSellerItemsMessageStep,
} from './update-seller-items';
import {
  UpdateItemIsSoldoutJob,
  UpdateItemIsSoldoutStep,
} from './update-item-is-soldout';
import { UpdateItemScoreJob, UpdateItemScoreStep } from './update-item-score';

import { ItemJobsController } from './item-jobs.controller';
import { ItemJobsService } from './item-jobs.service';

@Module({
  imports: [
    JobsModule,
    SellersModule,
    TypeOrmModule.forFeature([
      ProductsRepository,
      ItemsRepository,
      DigestsRepository,
      SellersRepository,
    ]),
  ],
  controllers: [ItemJobsController],
  providers: [
    BatchWorker,
    ItemJobsService,
    UpdateSellerItemsJob,
    ProduceScrapSellerItemsMessageStep,
    UpdateItemIsSoldoutJob,
    UpdateItemIsSoldoutStep,
    UpdateItemScoreJob,
    UpdateItemScoreStep,
  ],
})
export class ItemJobsModule {}

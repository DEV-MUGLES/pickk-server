import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@src/batch/batch.worker';
import { JobsModule } from '@src/modules/common/jobs/jobs.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { ProductsRepository } from '@item/products/products.repository';
import { ItemsRepository } from '@item/items/items.repository';

import {
  UpdateSellerItemsJob,
  ProduceScrapSellerItemsMessageStep,
} from './update-seller-items';
import {
  UpdateItemIsSoldoutJob,
  UpdateItemIsSoldoutStep,
} from './update-item-is-soldout';

import { ItemJobsController } from './item-jobs.controller';
import { ItemJobsService } from './item-jobs.service';

@Module({
  imports: [
    JobsModule,
    SellersModule,
    TypeOrmModule.forFeature([ProductsRepository, ItemsRepository]),
  ],
  controllers: [ItemJobsController],
  providers: [
    BatchWorker,
    ItemJobsService,
    UpdateSellerItemsJob,
    ProduceScrapSellerItemsMessageStep,
    UpdateItemIsSoldoutJob,
    UpdateItemIsSoldoutStep,
  ],
})
export class ItemJobsModule {}

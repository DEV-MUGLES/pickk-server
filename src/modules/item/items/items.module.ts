import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { ImagesModule } from '@src/modules/common/images/images.module';
import {
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
  UPDATE_ITEM_IMAGE_URL_QUEUE,
} from '@queue/constants';
import { ProductsModule } from '@item/products/products.module';

import { Consumers } from './consumers';
import { Producers } from './producers';
import { UPDATE_ITEM_IMAGE_URL_PRODUCER_BATCH_SIZE } from './constants';

import {
  ItemsRepository,
  ItemOptionsRepository,
  ItemOptionValuesRepository,
  ItemSizeChartsRepository,
  ItemPricesRepository,
  ItemDetailImagesRepository,
} from './items.repository';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsRepository,
      ItemOptionsRepository,
      ItemOptionValuesRepository,
      ItemSizeChartsRepository,
      ItemPricesRepository,
      ItemDetailImagesRepository,
    ]),
    ProductsModule,
    HttpModule,
    ImagesModule,
    SqsModule.registerQueue(
      {
        name: UPDATE_ITEM_IMAGE_URL_QUEUE,
        producerOptions: {
          batchSize: UPDATE_ITEM_IMAGE_URL_PRODUCER_BATCH_SIZE,
        },
      },
      {
        name: PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: {
          visibilityTimeout: 100,
        },
      }
    ),
  ],
  providers: [ItemsResolver, ItemsService, Logger, ...Producers, ...Consumers],
  exports: [ItemsService, ...Producers, ...Consumers],
})
export class ItemsModule {}

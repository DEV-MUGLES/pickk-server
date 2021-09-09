import { HttpModule } from '@nestjs/axios';
import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
  UPDATE_ITEM_DETAIL_IMAGES_QUEUE,
  UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
  UPDATE_ITEM_IMAGE_URL_QUEUE,
} from '@queue/constants';
import { CrawlerProviderModule } from '@providers/crawler';

import { ImagesModule } from '@mcommon/images/images.module';
import { SearchModule } from '@mcommon/search/search.module';
import { ProductsModule } from '@item/products/products.module';
import { DigestsRepository } from '@content/digests/digests.repository';

import {
  UPDATE_ITEM_DETAIL_IMAGES_BATCH_SIZE,
  UPDATE_ITEM_IMAGE_URL_BATCH_SIZE,
} from './constants';
import { Consumers } from './consumers';
import { ItemsProducer } from './producers';

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
      DigestsRepository,
    ]),
    ProductsModule,
    HttpModule,
    ImagesModule,
    CrawlerProviderModule,
    forwardRef(() => SearchModule),
    SqsModule.registerQueue(
      {
        name: UPDATE_ITEM_IMAGE_URL_QUEUE,
        producerOptions: {
          batchSize: UPDATE_ITEM_IMAGE_URL_BATCH_SIZE,
        },
      },
      {
        name: UPDATE_ITEM_DETAIL_IMAGES_QUEUE,
        producerOptions: {
          batchSize: UPDATE_ITEM_DETAIL_IMAGES_BATCH_SIZE,
        },
      },
      {
        name: PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: {
          visibilityTimeout: 100,
        },
      },
      {
        name: UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
        type: SqsQueueType.Consumer,
        consumerOptions: {
          batchSize: 10,
        },
      }
    ),
  ],
  providers: [ItemsResolver, ItemsService, Logger, ItemsProducer, ...Consumers],
  exports: [ItemsService],
})
export class ItemsModule {}

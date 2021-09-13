import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
  SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_QUEUE,
  SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE,
  UPDATE_ITEM_DETAIL_IMAGES_QUEUE,
  UPDATE_ITEM_DIGEST_STATISTICS_QUEUE,
  UPDATE_ITEM_IMAGE_URL_QUEUE,
} from '@queue/constants';
import { CrawlerProviderModule } from '@providers/crawler';
import { SlackProviderModule } from '@providers/slack';

import { ImagesModule } from '@mcommon/images/images.module';
import { SearchModule } from '@mcommon/search/search.module';
import { BrandsModule } from '@item/brands/brands.module';
import { ProductsModule } from '@item/products/products.module';
import { DigestsRepository } from '@content/digests/digests.repository';

import {
  UPDATE_ITEM_DETAIL_IMAGES_BATCH_SIZE,
  UPDATE_ITEM_IMAGE_URL_BATCH_SIZE,
} from './constants';
import { ItemsConsumers } from './consumers';
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
    forwardRef(() => ProductsModule),
    BrandsModule,
    ImagesModule,
    CrawlerProviderModule,
    SlackProviderModule,
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
      },
      {
        name: SEND_ITEM_CREATION_FAIL_SLACK_MESSAGE_QUEUE,
      },
      {
        name: SEND_ITEM_CREATION_SUCCESS_SLACK_MESSAGE_QUEUE,
      }
    ),
  ],
  providers: [
    ItemsResolver,
    ItemsService,
    Logger,
    ItemsProducer,
    ...ItemsConsumers,
  ],
  exports: [ItemsService],
})
export class ItemsModule {}

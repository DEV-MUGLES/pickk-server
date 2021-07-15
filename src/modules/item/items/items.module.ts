import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nest-sqs';

import { ProductsModule } from '../products/products.module';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from './constants/item-image-url.constant';
import { Consumers } from './consumers';
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
import { Producers } from './producers';

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
    SqsModule.registerQueue([
      {
        name: UPDATE_ITEM_IMAGE_URL_QUEUE,
        type: SqsQueueType.All,
      },
    ]),
  ],
  providers: [ItemsResolver, ItemsService, ...Producers, ...Consumers],
  exports: [ItemsService, ...Producers, ...Consumers],
})
export class ItemsModule {}

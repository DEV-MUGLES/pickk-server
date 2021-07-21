import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { ImagesModule } from '@src/modules/common/images/images.module';

import { ProductsModule } from '@item/products/products.module';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from './constants';
import { Consumers } from './consumers';
import { Producers } from './producers';

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
    SqsModule.registerQueue({
      name: UPDATE_ITEM_IMAGE_URL_QUEUE,
    }),
  ],
  providers: [ItemsResolver, ItemsService, ...Producers, ...Consumers],
  exports: [ItemsService, ...Producers, ...Consumers],
})
export class ItemsModule {}
